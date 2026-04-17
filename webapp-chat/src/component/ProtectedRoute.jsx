import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // In a real app, check your Auth Context or a JWT in localStorage
  const isAuthenticated = localStorage.getItem("access_token") !== null;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component (the Chat)
  return <Outlet />;
};

export default ProtectedRoute;
