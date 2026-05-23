import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart3, FolderKanban, FileText, FolderOpen, 
  LogOut, User, Bell, Search, Zap 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn, getInitials } from '../../lib/utils';

export default function PortalLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/client-login');
  };

  const navItems = [
    { to: '/portal', label: 'Overview', icon: BarChart3, end: true },
    { to: '/portal/projects', label: 'Projects', icon: FolderKanban },
    { to: '/portal/invoices', label: 'Invoices', icon: FileText },
    { to: '/portal/documents', label: 'Files', icon: FolderOpen },
  ];

  if (!currentUser) return null;

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <Zap size={18} />
            </div>
            <div className="font-bold text-xl tracking-tight">Portal</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary-50 text-primary-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={18} className={cn("transition-colors", "group-hover:text-primary-500")} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {getInitials(currentUser.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</div>
              <div className="text-xs text-slate-500 truncate">{(currentUser as any).company || 'Client Access'}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="md:hidden flex items-center gap-2">
             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <Zap size={18} />
            </div>
            <span className="font-bold">Portal</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <div className="text-sm font-bold text-slate-800">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Client Account</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
