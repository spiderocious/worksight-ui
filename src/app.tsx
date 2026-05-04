import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@shared/hooks/use-auth';
import { ToastProvider } from '@shared/hooks/use-toast';
import { PageLoader } from '@shared/ui';
import { LoginScreen } from '@features/auth/screens/login-screen';
import { SignupScreen } from '@features/auth/screens/signup-screen';
import { AppShell } from '@features/shell/app-shell';
import { CandidatesScreen } from '@features/candidates/screens/candidates-screen';
import { CandidateDetailScreen } from '@features/candidates/screens/candidate-detail-screen';
import { AssignmentsScreen } from '@features/assignments/screens/assignments-screen';
import { AssignmentDetailScreen } from '@features/assignments/screens/assignment-detail-screen';
import { InstancesScreen } from '@features/assignments/screens/instances-screen';
import { SessionDetailScreen } from '@features/sessions/screens/session-detail-screen';
import { AccountScreen } from '@features/auth/screens/account-screen';
import { SettingsScreen } from '@features/settings/screens/settings-screen';
import { LandingScreen } from '@features/landing/landing-screen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
    },
  },
});

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { reviewer, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!reviewer) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RedirectIfAuthed = ({ children }: { children: React.ReactNode }) => {
  const { reviewer, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (reviewer) return <Navigate to="/app/candidates" replace />;
  return <>{children}</>;
};

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public landing */}
            <Route path="/" element={<LandingScreen />} />

            {/* Auth */}
            <Route
              path="/login"
              element={
                <RedirectIfAuthed>
                  <LoginScreen />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/signup"
              element={
                <RedirectIfAuthed>
                  <SignupScreen />
                </RedirectIfAuthed>
              }
            />

            {/* App shell — everything signed-in lives under /app */}
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="candidates" replace />} />
              <Route path="candidates" element={<CandidatesScreen />} />
              <Route path="candidates/:id" element={<CandidateDetailScreen />} />
              <Route path="assignments" element={<AssignmentsScreen />} />
              <Route path="assignments/:id" element={<AssignmentDetailScreen />} />
              <Route path="instances" element={<InstancesScreen />} />
              <Route path="sessions/:id" element={<SessionDetailScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="account" element={<AccountScreen />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
