import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function VerifyRoute({ children }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appointmentId = searchParams.get("app_id");

  if (!appointmentId) {
    return <Navigate to="/invalid-link" replace />;
  }

  const isVerified = Cookies.get(`verified_${appointmentId}`) === "true";

  if (!isVerified) {
    return <Navigate to={`/verifyNotification?app_id=${appointmentId}`} replace />;
  }

  return children;
}
