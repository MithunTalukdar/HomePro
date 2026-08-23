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

  // Not logged in
  if (!token || !user) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Logged in, but incorrect role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard based on their role
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
