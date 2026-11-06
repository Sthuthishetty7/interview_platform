
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Room from "./pages/Room";
import Dashboard from "./pages/Dashboard";
import MockTest from "./pages/MockTest";

function ProtectedRoute({ allowedRole, children }) {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/interviewer/dashboard"
        element={
          <ProtectedRoute allowedRole="interviewer">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRole="candidate">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/room/:roomCode" element={<Room />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mock-test" element={<MockTest />} />
    </Routes>
  );
}

export default App;
