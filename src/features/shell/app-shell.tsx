import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Logo } from '@shared/ui';
import { Users, ClipboardCheck, ListChecks, Settings, LogOut, ShieldCheck } from '@shared/ui/icons';
import { useAuth } from '@shared/hooks/use-auth';

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
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

export const AppShell = () => {
  const { reviewer, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-surface border-r border-line flex flex-col">
        <div className="px-5 py-5 border-b border-line">
          <Logo />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem to="/app/candidates" icon={<Users size={16} />} label="Candidates" />
          <NavItem to="/app/assignments" icon={<ClipboardCheck size={16} />} label="Assignments" />
          <NavItem to="/app/instances" icon={<ListChecks size={16} />} label="Sessions" />
          <NavItem to="/app/settings" icon={<ShieldCheck size={16} />} label="Settings" />
          <NavItem to="/app/account" icon={<Settings size={16} />} label="Account" />
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-ink truncate">{reviewer?.name}</p>
            <p className="text-xs text-ink-soft truncate">{reviewer?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-surface-sunken"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
