// Redirects unauthenticated users to the welcome screen
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/index';

export function ProtectedRoute({ children }) {
  const { signedIn, hydrated } = useStore();
  if (!hydrated) return null;
  if (!signedIn) return <Navigate to="/welcome" replace />;
  return children;
}
