import { Navigate, useLocation } from "react-router-dom";
import { useMemo } from "react";

export default function GuestRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("userType");
  const location = useLocation();

  // ✅ useMemo لازم يكون قبل أي early return
  const isValidSession = useMemo(() => {
    if (token && !userType) {
      localStorage.removeItem("access_token");
      return false;
    }
    if (!token && userType) {
      localStorage.removeItem("userType");
      localStorage.removeItem("user");
      return false;
    }
    return !!(token && userType);
  }, [token, userType]);

  const allowedPublicPaths = [
    "/",
    "/pricing",
    "/webinars",
    "/features",
    "/contact-us",
    "/termsof-service",
    "/privacy-policy",
    "/security",
    "/industries",
    "/abuse-policy"
  ];

  const currentPath = window.location.pathname.toLowerCase();
  const isAllowedPublic = allowedPublicPaths.includes(currentPath);

  if (isAllowedPublic) {
    return children;
  }

  if (isValidSession) {
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get("redirect");

    const defaultPath =
      userType === "staff"
        ? "/staff_dashboard_layout"
        : "/layoutDashboard";

    return <Navigate to={redirectTo || defaultPath} replace />;
  }

  return children;
}