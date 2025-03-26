import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ✅ Get role from localStorage

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/dashboard" />; // ✅ Redirect unauthorized users to dashboard
  }

  return <Outlet />;
};

export default ProtectedRoute;
