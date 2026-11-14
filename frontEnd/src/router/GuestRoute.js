// Redirects authenticated users away from auth screens
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/index';

export function GuestRoute({ children }) {
  const { signedIn, hydrated } = useStore();
  if (!hydrated) return null;
  if (signedIn) return <Navigate to="/" replace />;
  return children;
}
