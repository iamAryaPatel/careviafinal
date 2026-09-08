import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, allowIncomplete = false }) {
  const { user, loading, profile, loadingProfile, isProfileComplete } = useAuth();
  const location = useLocation();

  if (loading || loadingProfile) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '60vh' }}>
        <Loader text="Checking user profile..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const complete = isProfileComplete(profile);

  // If user profile is incomplete and they are trying to access protected pages other than /complete-profile
  if (!complete && !allowIncomplete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}
