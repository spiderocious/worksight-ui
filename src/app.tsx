import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@shared/hooks/use-auth";
import { ToastProvider } from "@shared/hooks/use-toast";
import { PageLoader } from "@shared/ui";
import { LoginScreen } from "@features/auth/screens/login-screen";
import { SignupScreen } from "@features/auth/screens/signup-screen";
import { AppShell } from "@features/shell/app-shell";
import { CandidatesScreen } from "@features/candidates/screens/candidates-screen";
import { CandidateDetailScreen } from "@features/candidates/screens/candidate-detail-screen";
import { AssignmentsScreen } from "@features/assignments/screens/assignments-screen";
import { AssignmentDetailScreen } from "@features/assignments/screens/assignment-detail-screen";
import { InstancesScreen } from "@features/assignments/screens/instances-screen";
import { SessionDetailScreen } from "@features/sessions/screens/session-detail-screen";
import { AccountScreen } from "@features/auth/screens/account-screen";
import { SettingsScreen } from "@features/settings/screens/settings-screen";
import { LandingScreen } from "@features/landing/landing-screen";
import { InviteScreen } from "@features/invite/screens/invite-screen";
import { AdminShell } from "@features/admin/parts/admin-shell";
import { AdminGuard } from "@features/admin/parts/admin-guard";
import { AdminSetupScreen } from "@features/admin/screens/admin-setup-screen";
import { AdminLoginScreen } from "@features/admin/screens/admin-login-screen";
import { AdminDashboardScreen } from "@features/admin/screens/admin-dashboard-screen";
import { AdminReviewersScreen } from "@features/admin/screens/admin-reviewers-screen";
import { AdminCandidatesScreen } from "@features/admin/screens/admin-candidates-screen";
import { AdminDownloadsScreen } from "@features/admin/screens/admin-downloads-screen";
import { AdminBlocklistScreen } from "@features/admin/screens/admin-blocklist-screen";

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

            {/* Public invite link — candidate's entry point. No auth. */}
            <Route path="/candidate/invite/:code" element={<InviteScreen />} />

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
              <Route
                path="candidates/:id"
                element={<CandidateDetailScreen />}
              />
              <Route path="assignments" element={<AssignmentsScreen />} />
              <Route
                path="assignments/:id"
                element={<AssignmentDetailScreen />}
              />
              <Route path="instances" element={<InstancesScreen />} />
              <Route path="sessions/:id" element={<SessionDetailScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="account" element={<AccountScreen />} />
            </Route>

            {/* Admin — separate token, separate shell. /admin/setup and
                /admin/login are public; everything else is gated by AdminGuard. */}
            <Route path="/admin/setup" element={<AdminSetupScreen />} />
            <Route path="/admin/login" element={<AdminLoginScreen />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminShell />
                </AdminGuard>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardScreen />} />
              <Route path="reviewers" element={<AdminReviewersScreen />} />
              <Route path="candidates" element={<AdminCandidatesScreen />} />
              <Route path="downloads" element={<AdminDownloadsScreen />} />
              <Route path="blocklist" element={<AdminBlocklistScreen />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
