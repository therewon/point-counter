import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PageLoader = () => (
  <div className="page-loader" role="status" aria-live="polite">
    <div className="page-loader__mark">
      <span>01</span>
      <span>12</span>
      <span>08</span>
    </div>
    <p>Hesabınız yoxlanılır...</p>
  </div>
);

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
