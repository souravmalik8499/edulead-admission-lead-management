import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User has wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "ADMIN") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (user.role === "COUNSELLOR") {
      return (
        <Navigate
          to="/counsellor/dashboard"
          replace
        />
      );
    }

    if (user.role === "LEAD") {
      return (
        <Navigate
          to="/lead/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;