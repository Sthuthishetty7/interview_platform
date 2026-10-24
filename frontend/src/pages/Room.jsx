import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PRODUCT_NAME } from "../utils/constants";

// Turns the browser's technical error into a message a person can act on.
function describeMediaError(error) {
  if (error.name === "NotAllowedError") {
    return "Camera and microphone access was blocked. Allow it using the icon in the address bar, then reload the page.";
  }
  if (error.name === "NotFoundError") {
    return "No camera or microphone was found on this device.";
  }
  return "Could not start your camera and microphone.";
}

function Room() {
  const { roomCode } = useParams(); // the code from the address, like /room/K7X-92QM
  const videoRef = useRef(null); // points at the <video> element
  const streamRef = useRef(null); // holds your camera and microphone stream
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          // The page was closed before the permission prompt finished.
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setReady(true);
      } catch (err) {
        if (!cancelled) setError(describeMediaError(err));
      }
    }

    startMedia();

    // Cleanup: turn the camera light off when you leave the page.
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
        <span className="room-status">Waiting for the other person</span>
      </header>

      {error && (
        <p className="room-error" role="alert">
          {error}
        </p>
      )}

      <main className="room-stage">
        <div className="video-tile">
          <div className="tile-placeholder">
            <p>Waiting for the other person to join.</p>
            <p>Video from the other side will appear here.</p>
          </div>
          <span className="tile-label">Participant</span>
        </div>

        <div className="video-tile">
          <video ref={videoRef} autoPlay playsInline muted />
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
        <Link className="control-btn leave" to="/">
          Leave
        </Link>
      </footer>
    </div>
  );
}

export default Room;