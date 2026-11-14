// Root app component — provides the router
import { RouterProvider } from 'react-router-dom';
import { router } from './router/index';
import { useEffect } from 'react';
import { useStore } from './store/index';

export default function App() {
  const signedIn = useStore((state) => state.signedIn);
  const hydrateFromApi = useStore((state) => state.hydrateFromApi);
  const signOut = useStore((state) => state.signOut);

  useEffect(() => {
    const token = localStorage.getItem('yogdan-access-token');
    if (signedIn && !token) {
      signOut();
      return;
    }
    if (!signedIn || !token) return;
    hydrateFromApi().catch((error) => {
      console.error('[Yogdan] Failed to refresh account data:', error.message);
      signOut();
    });
  }, [signedIn, hydrateFromApi, signOut]);

  useEffect(() => {
    const handleAuthExpired = () => signOut();
    window.addEventListener('yogdan-auth-expired', handleAuthExpired);
    return () => window.removeEventListener('yogdan-auth-expired', handleAuthExpired);
  }, [signOut]);

  return <RouterProvider router={router} />;
}
