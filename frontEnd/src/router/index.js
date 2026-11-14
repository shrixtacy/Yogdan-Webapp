// React Router v6 — all routes wired to real pages
import { createBrowserRouter } from 'react-router-dom';

// Auth
import WelcomePage    from '../pages/auth/WelcomePage';
import RegisterPage   from '../pages/auth/RegisterPage';
import LoginPage      from '../pages/auth/LoginPage';
import VerifyPage     from '../pages/auth/VerifyPage';
import OnboardingPage from '../pages/auth/OnboardingPage';

// App tabs
import HomePage      from '../pages/app/HomePage';
import DiscoverPage  from '../pages/app/DiscoverPage';
import CommunityPage from '../pages/app/CommunityPage';
import ProfilePage   from '../pages/app/ProfilePage';
import ActionPage    from '../pages/app/ActionPage';

// Blood & documents (live in app/)
import BloodDetailsPage from '../pages/app/BloodDetailsPage';
import DocumentsPage    from '../pages/app/DocumentsPage';

// Requests
import RequestsPage      from '../pages/requests/RequestsPage';
import CreateRequestPage from '../pages/requests/CreateRequestPage';

// Health
import HealthPage        from '../pages/health/HealthPage';
import AssessmentPage    from '../pages/health/AssessmentPage';
import HealthHistoryPage from '../pages/health/HealthHistoryPage';
import HealthPassportPage from '../pages/health/HealthPassportPage';

// Activity & donations
import ActivityPage  from '../pages/activity/ActivityPage';
import DonationsPage from '../pages/activity/DonationsPage';

// Leaderboard & notifications
import LeaderboardPage   from '../pages/app/LeaderboardPage';
import NotificationsPage from '../pages/app/NotificationsPage';

// Settings & info
import SettingsPage from '../pages/settings/SettingsPage';
import InfoPage     from '../pages/info/InfoPage';

// Guards
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute }     from './GuestRoute';

export const router = createBrowserRouter([
  // ── Guest-only ──────────────────────────────────────────────
  { path: '/welcome',    element: <GuestRoute><WelcomePage /></GuestRoute> },
  { path: '/register',   element: <GuestRoute><RegisterPage /></GuestRoute> },
  { path: '/login',      element: <GuestRoute><LoginPage /></GuestRoute> },
  { path: '/verify',     element: <VerifyPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },

  // ── Main tabs ───────────────────────────────────────────────
  { path: '/',          element: <ProtectedRoute><HomePage /></ProtectedRoute> },
  { path: '/discover',  element: <ProtectedRoute><DiscoverPage /></ProtectedRoute> },
  { path: '/community', element: <ProtectedRoute><CommunityPage /></ProtectedRoute> },
  { path: '/profile',   element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
  { path: '/action',    element: <ProtectedRoute><ActionPage /></ProtectedRoute> },

  // ── Requests ────────────────────────────────────────────────
  { path: '/request',  element: <ProtectedRoute><CreateRequestPage /></ProtectedRoute> },
  { path: '/requests', element: <ProtectedRoute><RequestsPage /></ProtectedRoute> },

  // ── Health ──────────────────────────────────────────────────
  { path: '/health',            element: <ProtectedRoute><HealthPage /></ProtectedRoute> },
  { path: '/health/assessment', element: <ProtectedRoute><AssessmentPage /></ProtectedRoute> },
  { path: '/health/history',    element: <ProtectedRoute><HealthHistoryPage /></ProtectedRoute> },
  { path: '/health/passport',   element: <ProtectedRoute><HealthPassportPage /></ProtectedRoute> },

  // ── Blood & documents ───────────────────────────────────────
  { path: '/blood',     element: <ProtectedRoute><BloodDetailsPage /></ProtectedRoute> },
  { path: '/documents', element: <ProtectedRoute><DocumentsPage /></ProtectedRoute> },

  // ── Activity & donations ────────────────────────────────────
  { path: '/activity',  element: <ProtectedRoute><ActivityPage /></ProtectedRoute> },
  { path: '/donations', element: <ProtectedRoute><DonationsPage /></ProtectedRoute> },

  // ── Leaderboard & notifications ─────────────────────────────
  { path: '/leaderboard',   element: <ProtectedRoute><LeaderboardPage /></ProtectedRoute> },
  { path: '/notifications', element: <ProtectedRoute><NotificationsPage /></ProtectedRoute> },

  // ── Settings & info ─────────────────────────────────────────
  { path: '/settings',   element: <ProtectedRoute><SettingsPage /></ProtectedRoute> },
  { path: '/info/:page', element: <InfoPage /> },

  // ── Fallback ────────────────────────────────────────────────
  { path: '*', element: <WelcomePage /> },
]);
