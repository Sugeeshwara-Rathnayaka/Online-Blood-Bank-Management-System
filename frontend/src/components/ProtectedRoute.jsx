import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, role, redirectTo = "/" }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={`/${user?.role}-dashboard`} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
