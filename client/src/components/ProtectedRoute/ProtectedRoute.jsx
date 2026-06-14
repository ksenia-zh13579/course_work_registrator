import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="page-container">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
