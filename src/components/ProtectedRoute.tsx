import { JSX, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useContext(UserContext);
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }
  return children;
}
