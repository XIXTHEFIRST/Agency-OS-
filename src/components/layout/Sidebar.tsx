import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Clock, Users,
  DollarSign, FileText, BarChart3, FolderOpen, Settings,
  ChevronLeft, ChevronRight, Building2, Zap
} from 'lucide-react';
import { cn, getInitials } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Task Board', icon: CheckSquare },
  { to: '/time', label: 'Time Tracking', icon: Clock },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/budget', label: 'Budget', icon: DollarSign },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
  { to: '/clients', label: 'Clients', icon: Building2 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAuth();
  const { projects } = useApp();
  const location = useLocation();

  const activeProjects = projects.filter(p => p.status === 'active').slice(0, 3);

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-white border-r border-slate-100 transition-all duration-300 flex-shrink-0',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-slate-100', collapsed && 'justify-center px-0')}>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-slate-800 text-sm leading-tight">AgencyOS</div>
            <div className="text-xs text-slate-400">Project Suite</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {!collapsed && (
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1.5">Navigation</div>
        )}
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'sidebar-link',
              isActive && 'active',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Active Projects */}
        {!collapsed && (
          <>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-4 pb-1.5">Active Projects</div>
            {activeProjects.map(p => (
              <NavLink
                key={p.id}
                to={`/projects/${p.id}`}
                className={({ isActive }) => cn('sidebar-link text-xs', isActive && 'active')}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="truncate">{p.name}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className={cn('border-t border-slate-100 p-3', collapsed && 'flex justify-center')}>
        {currentUser && (
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div
              className="avatar-sm flex-shrink-0 text-white text-xs"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {getInitials(currentUser.name)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700 truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-400 capitalize">{currentUser.role.replace('_', ' ')}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-10"
        style={{ position: 'relative', alignSelf: collapsed ? 'center' : 'flex-end', margin: '0 0 8px 0' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
