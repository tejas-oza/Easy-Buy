import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user || user === null) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={"/not-allowed"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
