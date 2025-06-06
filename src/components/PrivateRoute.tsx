import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<Props> = ({ children, requireAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.email !== "admin@gmail.com") {
    return <Navigate to="/catalog" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
