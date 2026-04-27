import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated } = useAuth();
  console.log("ProtectedRoute check:", isAuthenticated);
  if (!isAuthenticated) {
    //return <Navigate to="/login" replace />;
    <Navigate to="/" replace />;
  }

  return children;
}
