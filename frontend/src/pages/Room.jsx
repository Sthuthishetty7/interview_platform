import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { PRODUCT_NAME } from "../utils/constants";

// Where the signaling server runs. Change this in frontend/.env later if needed.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

// A free public server that helps two browsers discover how to reach each other.
const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

function describeMediaError(error) {
  if (error.name === "NotAllowedError") {
    return "Camera and microphone access was blocked. Allow it using the icon in the address bar, then reload the page.";
  }
  if (error.name === "NotFoundError") {
    return "No camera or microphone was found on this device.";
  }
  if (error.name === "NotReadableError") {
    return "Your camera is being used by another app or tab. Close it and reload.";
  }
  return "Could not start your camera and microphone.";
}

function Room() {
  const { roomCode } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [hasRemote, setHasRemote] = useState(false);
  const [status, setStatus] = useState("Starting your camera...");

  // Effect 1: turn on your camera and microphone.
  useEffect(() => {
    let cancelled = false;

    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(describeMediaError(err));
          setStatus("No camera or microphone");
        }
      }
    }

    startMedia();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Effect 2: once the camera is ready, join the room and set up the call.
  useEffect(() => {
    if (!ready) return;

    setStatus("Connecting to the room...");
    const socket = io(SOCKET_URL);
    let peer = null; // the direct connection to the other person
    let pendingCandidates = []; // connection hints that arrived too early

    function showError(err) {
      console.error(err);
      setStatus("Connection problem. Reload both pages and try again.");
    }

    function closePeer() {
      if (peer) {
        peer.close();
        peer = null;
      }
      pendingCandidates = [];
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setHasRemote(false);
    }

    function createPeer() {
      closePeer();
      peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });

      // Send my camera and microphone through the connection.
      streamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, streamRef.current);
      });

      // Pass my connection hints to the other person.
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc:ice-candidate", { candidate: event.candidate.toJSON() });
        }
      };

      // When the other person's video arrives, show it.
      peer.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        setHasRemote(true);
        setStatus("Connected");
      };

      peer.onconnectionstatechange = () => {
        if (peer && peer.connectionState === "failed") {
          setStatus("Connection failed. Reload both pages and try again.");
        }
      };

      return peer;
    }

    async function addPendingCandidates() {
      for (const candidate of pendingCandidates) {
        await peer.addIceCandidate(candidate);
      }
      pendingCandidates = [];
    }

    socket.on("connect", () => {
      socket.emit("room:join", { roomCode });
    });

    socket.on("connect_error", () => {
      setStatus("Cannot reach the server. Is the backend running?");
    });

    socket.on("room:error", (data) => {
      setError(data.message);
      setStatus("Could not join the room");
    });

    // I just arrived. If someone is already here, I start the call.
    socket.on("room:joined", async ({ peerIds }) => {
      try {
        if (peerIds.length === 0) {
          setStatus("Waiting for the other person to join...");
          return;
        }
        setStatus("Connecting...");
        createPeer();
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("webrtc:offer", { sdp: { type: offer.type, sdp: offer.sdp } });
      } catch (err) {
        showError(err);
      }
    });

    // Someone arrived after me. They will send me an offer.
    socket.on("participant:joined", () => {
      setStatus("The other person joined. Connecting...");
    });

    // I received an offer, so I answer it.
    socket.on("webrtc:offer", async ({ sdp }) => {
      try {
        createPeer();
        await peer.setRemoteDescription(sdp);
        await addPendingCandidates();
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("webrtc:answer", { sdp: { type: answer.type, sdp: answer.sdp } });
      } catch (err) {
        showError(err);
      }
    });

    // The other person answered my offer.
    socket.on("webrtc:answer", async ({ sdp }) => {
      try {
        if (!peer) return;
        await peer.setRemoteDescription(sdp);
        await addPendingCandidates();
      } catch (err) {
        showError(err);
      }
    });

    // A connection hint from the other person.
    socket.on("webrtc:ice-candidate", async ({ candidate }) => {
      try {
        if (!peer || !candidate) return;
        if (peer.remoteDescription) {
          await peer.addIceCandidate(candidate);
        } else {
          pendingCandidates.push(candidate);
        }
      } catch (err) {
        showError(err);
      }
    });

    socket.on("participant:left", () => {
      closePeer();
      setStatus("The other person left. Waiting for them to rejoin...");
    });

    // Cleanup when you leave the page.
    return () => {
      socket.disconnect();
      closePeer();
    };
  }, [ready, roomCode]);

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  }

  function toggleCamera() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  }

  return (
    <div className="room-page">
      <header className="room-bar">
        <Link className="brand" to="/" aria-label={`${PRODUCT_NAME} home`}>
          <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true">
            <circle cx="11" cy="15" r="9" fill="#2850e8" />
            <circle cx="19" cy="15" r="9" fill="#dfe6fb" fillOpacity="0.85" />
          </svg>
          <span>{PRODUCT_NAME}</span>
        </Link>
        <span className="room-code">Room {roomCode}</span>
        <span className="room-status" role="status">{status}</span>
      </header>

      {error && (
        <p className="room-error" role="alert">
          {error}
        </p>
      )}

      <main className="room-stage">
        <div className="video-tile">
          <video
            ref={remoteVideoRef}
            className={`remote ${hasRemote ? "" : "is-hidden"}`}
            autoPlay
            playsInline
          />
          {!hasRemote && (
            <div className="tile-placeholder">
              <p>Waiting for the other person.</p>
              <p>Their video will appear here.</p>
            </div>
          )}
          <span className="tile-label">Participant</span>
        </div>

        <div className="video-tile">
          <video ref={localVideoRef} autoPlay playsInline muted />
          {!cameraOn && (
            <div className="camera-off">
              <span className="tile-avatar">You</span>
            </div>
          )}
          <span className="tile-label">You</span>
        </div>
      </main>

      <footer className="room-controls">
        <button
          className="control-btn"
          type="button"
          onClick={toggleMic}
          aria-pressed={!micOn}
          disabled={!ready}
        >
          {micOn ? "Mute" : "Unmute"}
        </button>
        <button
          className="control-btn"
          type="button"
          onClick={toggleCamera}
          aria-pressed={!cameraOn}
          disabled={!ready}
        >
          {cameraOn ? "Turn camera off" : "Turn camera on"}
        </button>
        <Link className="control-btn leave" to="/dashboard">
          Leave
        </Link>
      </footer>
    </div>
  );
}

export default Room;