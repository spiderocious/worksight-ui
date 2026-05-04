import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Logo } from '@shared/ui';
import {
  Activity,
  Users,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  LogOut,
} from '@shared/ui/icons';
import { adminTokenStore } from '../api/admin-token-store';

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-brand-50 text-brand-900 font-medium'
          : 'text-ink-muted hover:text-ink hover:bg-surface-sunken'
      )
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export const AdminShell = () => {
  const navigate = useNavigate();

  const onSignOut = () => {
    adminTokenStore.clear();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 bg-surface border-r border-line flex flex-col">
        <div className="px-5 py-5 border-b border-line">
          <Logo />
          <span className="block mt-2 text-[10px] uppercase tracking-[0.2em] text-brand-700 font-medium">
            Admin
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem to="/admin/dashboard" icon={<Activity size={16} />} label="Dashboard" />
          <NavItem to="/admin/reviewers" icon={<Users size={16} />} label="Reviewers" />
          <NavItem to="/admin/candidates" icon={<KeyRound size={16} />} label="Candidates" />
          <NavItem to="/admin/downloads" icon={<ShieldCheck size={16} />} label="Downloads" />
          <NavItem to="/admin/blocklist" icon={<ShieldAlert size={16} />} label="Blocklist" />
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-surface-sunken"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
