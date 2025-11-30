import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("userType");

  if (!token || !userType) {
    return <Navigate to="/login" replace />;
  }

  return children;
}