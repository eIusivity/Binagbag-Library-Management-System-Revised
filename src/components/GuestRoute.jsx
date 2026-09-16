import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
export default function GuestRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return children;
  }

  if (user.role === "Patron") {
    return <Navigate to="/home" replace />;
  }

  if (user.role === "Librarian" || user.role === "Administrator") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
