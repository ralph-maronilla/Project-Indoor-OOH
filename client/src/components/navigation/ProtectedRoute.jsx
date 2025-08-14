// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAppStateStore } from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = useAppStateStore((state) => state.isAuthenticated);
  const authUser = useAppStateStore((state) => state.authUser);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to='/login' replace />;
  }
  // If allowedRoles is provided, check if user's role matches
  if (allowedRoles && !allowedRoles.includes(authUser?.role)) {
    return <Navigate to='/' replace />; // redirect non-admins to home
  }

  return children;
}
