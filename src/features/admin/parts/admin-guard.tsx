import { Navigate } from 'react-router-dom';
import { PageLoader } from '@shared/ui';
import { useAdminMe } from '../api/use-admin-api';
import { adminTokenStore } from '../api/admin-token-store';

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps admin-only routes. Verifies the stored admin token by hitting
 * /admin/me. On 401 the api client clears the token; here we react by
 * sending the user to the login screen.
 */
export const AdminGuard = ({ children }: Props) => {
  const hasToken = !!adminTokenStore.get();
  const { data, isLoading, isError } = useAdminMe(hasToken);

  if (!hasToken) return <Navigate to="/admin/login" replace />;
  if (isLoading) return <PageLoader />;
  if (isError || !data) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};
