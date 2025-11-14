import { Navigate } from "react-router-dom";
import useAuthStore from "../services/authService.js";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
