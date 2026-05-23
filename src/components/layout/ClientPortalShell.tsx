import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, FileText, Settings, 
  LogOut, Menu, X, Bell, User, ChevronRight, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../lib/utils';

export default function ClientPortalShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/client-login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/portal/dashboard' },
    { name: 'My Projects', icon: FolderKanban, path: '/portal/projects' },
    { name: 'Invoices', icon: FileText, path: '/portal/invoices' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-[260px]' : 'w-0 lg:w-20'} bg-white border-r border-slate-100 transition-all duration-300 flex flex-col relative z-30`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-50">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
          {sidebarOpen && <span className="font-bold text-xl text-slate-800 tracking-tight">Agency<span className="text-primary-500">OS</span></span>}
        </div>

        {/* Client Label */}
        {sidebarOpen && (
          <div className="px-6 pt-6 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Portal</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`}
            >
              <item.icon size={20} className={sidebarOpen ? '' : 'mx-auto'} />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-50 space-y-1">
          <button className={`sidebar-link w-full ${!sidebarOpen ? 'justify-center px-0' : ''}`}>
             <HelpCircle size={20} />
             {sidebarOpen && <span>Support</span>}
          </button>
          <button 
            onClick={handleLogout}
            className={`sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 ${!sidebarOpen ? 'justify-center px-0' : ''}`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
               <span>Acme Corp</span>
               <ChevronRight size={14} />
               <span className="text-slate-800 capitalize">{window.location.pathname.split('/').pop()?.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-100 mx-1"></div>
            
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800 leading-none">{currentUser?.name}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{currentUser?.role.replace('_', ' ')}</div>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: currentUser?.avatarColor || '#3b82f6' }}
              >
                {getInitials(currentUser?.name || 'Client')}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
