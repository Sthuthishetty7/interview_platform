
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./socket');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const pool = require('./db');
const mockTestRoutes = require('./mock-test/mockTestRoutes');
const authRoutes = require('./auth/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const notesRoutes = require('./notes/notesRoutes');
app.use(cors());
app.use(express.json());
const io = new Server(server, {
    cors: {
        origin: [
            'https://interview-platform-git-feature-mock-test-bit-heads3.vercel.app',
            'http://localhost:5173',
            'http://localhost:5174'
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

setupSocket(io, pool);

app.use('/api/mock-tests', mockTestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/interviews', notesRoutes);
// Basic route
app.get('/', (req, res) => {
    res.send('Technical Interview Platform Backend is running!');
});

// Check database connection
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database()');

        res.json({
            status: 'success',
            message: 'Backend is running!',
            database: result.rows[0].current_database
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed'
        });
    }
});

// Create an interview
// Create an interview
app.post('/api/interviews', authMiddleware, async (req, res) => {

    // Only interviewers can create interviews
    if (req.user.role !== 'interviewer') {
        return res.status(403).json({
            error: 'Only interviewers can create interviews.'
        });
    }

    const {
        title,
        scheduledAt,
        duration = 60,
        candidateId
    } = req.body;

    // Validate input
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        !Number.isInteger(candidateId) ||
        candidateId <= 0 ||
        !Number.isInteger(duration) ||
        duration <= 0
    ) {
        return res.status(400).json({
            error: 'Provide a valid title, candidateId and duration.'
        });
    }

    if (
        scheduledAt !== undefined &&
        scheduledAt !== null &&
        (typeof scheduledAt !== 'string' ||
         Number.isNaN(Date.parse(scheduledAt)))
    ) {
        return res.status(400).json({
            error: 'scheduledAt must be a valid date string or null.'
        });
    }

    try {
        // Check whether the selected user is a candidate
        const candidate = await pool.query(
            'SELECT id FROM "User" WHERE id = $1 AND role = $2',
            [candidateId, 'candidate']
        );

        if (candidate.rows.length === 0) {
            return res.status(400).json({
                error: 'Invalid candidate ID.'
            });
        }

        // Use the logged-in interviewer's ID from the JWT
        const result = await pool.query(
            `INSERT INTO "Interview"
                ("title", "scheduledAt", "duration", "status",
                 "roomId", "createdAt", "interviewerId", "candidateId")
             VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
             RETURNING *`,
            [
                title.trim(),
                scheduledAt ?? null,
                duration,
                'scheduled',
                randomUUID(),
                req.user.userId,
                candidateId
            ]
        );

        res.status(201).json({
            message: 'Interview created successfully.',
            interview: result.rows[0]
        });

    } catch (error) {
        console.error('Create interview failed:', error.message);

        res.status(500).json({
            error: 'Could not create interview.'
        });
    }
});

// List interviews belonging to the logged-in user
app.get('/api/interviews', authMiddleware, async (req, res) => {
    try {
        let result;

        if (req.user.role === 'interviewer') {
            result = await pool.query(
                `SELECT * FROM "Interview"
                 WHERE "interviewerId" = $1
                 ORDER BY "createdAt" DESC`,
                [req.user.userId]
            );
        } 
        else if (req.user.role === 'candidate') {
            result = await pool.query(
                `SELECT * FROM "Interview"
                 WHERE "candidateId" = $1
                 ORDER BY "createdAt" DESC`,
                [req.user.userId]
            );
        } 
        else {
            return res.status(403).json({
                error: 'You are not authorized to view interviews.'
            });
        }

        res.json({
            interviews: result.rows
        });

    } catch (error) {
        console.error('List interviews failed:', error.message);

        res.status(500).json({
            error: 'Could not retrieve interviews.'
        });
    }
});
// Get one interview by ID (only assigned users)
app.get('/api/interviews/:id', authMiddleware, async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Interview ID must be a positive integer.'
        });
    }

    try {
        let result;

        if (req.user.role === 'interviewer') {
            result = await pool.query(
                `SELECT * FROM "Interview"
                 WHERE id = $1 AND "interviewerId" = $2`,
                [id, req.user.userId]
            );
        } 
        else if (req.user.role === 'candidate') {
            result = await pool.query(
                `SELECT * FROM "Interview"
                 WHERE id = $1 AND "candidateId" = $2`,
                [id, req.user.userId]
            );
        } 
        else {
            return res.status(403).json({
                error: 'You are not authorized to view this interview.'
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Interview not found or access denied.'
            });
        }

        res.json({
            interview: result.rows[0]
        });

    } catch (error) {
        console.error('Get interview failed:', error.message);

        res.status(500).json({
            error: 'Could not retrieve interview.'
        });
    }
});
// Temporary: check database tables
app.get('/api/check-tables', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        res.json({ tables: result.rows });
    } catch (error) {
        console.error('Check tables failed:', error.message);
        res.status(500).json({
            error: 'Could not list database tables.'
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});