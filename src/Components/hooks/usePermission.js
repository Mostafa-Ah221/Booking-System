// hooks/usePermission.js
import { useSelector } from "react-redux";

export const usePermission = (tagDescription) => {
  const permissions = useSelector((state) => state.permissions.permissions);
  const loading = useSelector((state) => state.permissions.loading);
  
  // لو لسه بيحمل، ارجع null عشان نعرف إننا لسه مستنيين
  if (loading) {
    return null;
  }
  
  return permissions.some((p) => p.tag_description === tagDescription);
};