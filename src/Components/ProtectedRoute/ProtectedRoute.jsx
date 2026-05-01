import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("userType");
  const location = useLocation();

  if (!token || !userType) {
    const currentUrl = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentUrl)}`} replace />;
  }

  return children;
}