// PermissionRoute.jsx
import { usePermission } from "../hooks/usePermission";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NotAuthorized from "./NotAuthorizes";
import Loader from "../Loader";

export default function PermissionRoute({ permission, children }) {
  const hasPermission = usePermission(permission);
  const loading = useSelector((state) => state.permissions.loading);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading) {
      setInitialLoad(false);
    }
  }, [loading]);

  if (loading || initialLoad) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!hasPermission) {
    return <NotAuthorized />;
  }

  return children;
}