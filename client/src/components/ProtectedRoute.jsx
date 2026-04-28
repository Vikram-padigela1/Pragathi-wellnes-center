import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, reqRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading your session...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (reqRole && user.role !== reqRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
