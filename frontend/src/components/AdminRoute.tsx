import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
export interface AdminRouteProps {
  children: React.ReactNode;
}



const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  console.log("AdminRoutes", isAuthenticated, user);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader loading />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
