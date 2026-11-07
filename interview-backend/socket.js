
const jwt = require('jsonwebtoken');

function setupSocket(io, pool) {

    // Authenticate every Socket.IO connection using the JWT.
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error('Authentication token required.'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded.userId || !decoded.role) {
                return next(new Error('Invalid user information.'));
            }

            socket.data.user = decoded;
            next();

        } catch (error) {
            next(new Error('Invalid or expired token.'));
        }
    });

    io.on('connection', (socket) => {

        console.log(`Socket connected: ${socket.id}`);

        // Join an authorized interview room.
        socket.on('room:join', async ({ roomCode } = {}) => {
            try {
                if (typeof roomCode !== 'string' || !roomCode.trim()) {
                    socket.emit('room:error', {
                        message: 'Invalid room ID.'
                    });
                    return;
                }

                const userId = socket.data.user.userId;

                // Find the interview and verify participant access.
                const result = await pool.query(
                    `SELECT "interviewerId", "candidateId"
                     FROM "Interview"
                     WHERE "roomId" = $1`,
                    [roomCode]
                );

                if (result.rows.length === 0) {
                    socket.emit('room:error', {
                        message: 'Interview room not found.'
                    });
                    return;
                }

                const interview = result.rows[0];

                const isParticipant =
                    String(interview.interviewerId) === String(userId) ||
                    String(interview.candidateId) === String(userId);

                if (!isParticipant) {
                    socket.emit('room:error', {
                        message: 'You are not authorized to join this room.'
                    });
                    return;
                }

                if (socket.data.roomCode) {
                    socket.emit('room:error', {
                        message: 'You have already joined a room.'
                    });
                    return;
                }

                // Check how many participants are already connected.
                const existingSockets = await io
                    .in(roomCode)
                    .fetchSockets();

                if (existingSockets.length >= 2) {
                    socket.emit('room:error', {
                        message: 'This interview room is full.'
                    });
                    return;
                }

                // Prevent the same account from joining twice.
                const alreadyJoined = existingSockets.some(
                    (existingSocket) =>
                        String(existingSocket.data.user.userId) === String(userId)
                );

                if (alreadyJoined) {
                    socket.emit('room:error', {
                        message: 'This user is already in the room.'
                    });
                    return;
                }

                const peerIds = existingSockets.map(
                    (existingSocket) => existingSocket.id
                );

                await socket.join(roomCode);
                socket.data.roomCode = roomCode;

                socket.emit('room:joined', { peerIds });

                socket.to(roomCode).emit('participant:joined', {
                    peerId: socket.id
                });

                console.log(`User ${userId} joined room ${roomCode}`);

            } catch (error) {
                console.error('Room join failed:', error.message);

                socket.emit('room:error', {
                    message: 'Unable to join the interview room.'
                });
            }
        });

        // Relay WebRTC signaling messages only within the joined room.
        function relayToRoom(eventName, data) {
            const roomCode = socket.data.roomCode;

            if (!roomCode || !socket.rooms.has(roomCode)) {
                return;
            }

            socket.to(roomCode).emit(eventName, data);
        }

        socket.on('webrtc:offer', (data) => {
            relayToRoom('webrtc:offer', data);
        });

        socket.on('webrtc:answer', (data) => {
            relayToRoom('webrtc:answer', data);
        });

        socket.on('webrtc:ice-candidate', (data) => {
            relayToRoom('webrtc:ice-candidate', data);
        });

        // Notify the other participant when someone disconnects.
        socket.on('disconnecting', () => {
            const roomCode = socket.data.roomCode;

            if (roomCode) {
                socket.to(roomCode).emit('participant:left');
                console.log(`User left room ${roomCode}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}

module.exports = setupSocket;
