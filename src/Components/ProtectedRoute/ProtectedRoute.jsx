import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const rawToken = localStorage.getItem("access_token");

  if (!rawToken) {
    return <Navigate to="/login" />;
  }

  try {
    const token = rawToken.replace(/^bearer\s+/i, "");
    
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;

    if (Date.now() >= exp) {
      localStorage.removeItem("access_token")
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("access_token");
    return <Navigate to="/login" />;
  }
}
