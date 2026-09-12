import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--background)' }}>
        <span className="dot-pulse">...</span>
      </div>
    );
  }


  if (!token || !user) {


    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user.role)) {

    if (user.role === 'TECHNICIAN') {
      return <Navigate to="/technician/dashboard/overview" replace />;
    } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return <Navigate to="/admin/dashboard/overview" replace />;
    } else {
      return <Navigate to="/dashboard/overview" replace />;
    }
  }

  return <>{children}</>;
}
