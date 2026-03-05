import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PortalLoader } from '../components/PortalLoader';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PortalLoader label="Carregando sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
