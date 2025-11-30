import { Navigate } from "react-router-dom";
import { useMemo } from "react";

export default function GuestRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("userType");
const currentPath = window.location.pathname;

   const allowedPublicPaths = [
    '/webinars',
    '/termsOf-service',
    '/security',
    '/privacy-policy'
  ];

  const isAllowedPublic = allowedPublicPaths.some(path => 
    currentPath.startsWith(path)
  );

  if (isAllowedPublic) {
    return children;
  }
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

  if (isValidSession) {
    const redirectPath = userType === "staff" 
      ? "/staff_dashboard_layout" 
      : "/layoutDashboard";
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}