import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, LogOut, User, Settings, Play, Square, Search } from 'lucide-react';
import { cn, getInitials, elapsedToDisplay, formatCurrency } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { timer, stopTimer, startTimer, projects, unreadCount, markNotificationsRead, notifications } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showQuickTimer, setShowQuickTimer] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timer.running && timer.startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - (timer.startTime!));
      }, 1000) as unknown as number;
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timer.running, timer.startTime]);

  const activeProject = projects.find(p => p.id === timer.projectId);

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0 z-20">
      {/* Search */}
      <div className="relative w-64 hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-9 py-1.5 text-sm h-9" placeholder="Search projects, tasks..." />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Global Timer */}
        <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all text-sm font-mono', timer.running ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500')}>
          {timer.running ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{elapsedToDisplay(elapsed)}</span>
              {activeProject && <span className="text-xs truncate max-w-[80px] hidden lg:block">{activeProject.name}</span>}
              <button onClick={stopTimer} className="p-0.5 hover:text-red-700 transition-colors">
                <Square size={14} fill="currentColor" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowQuickTimer(!showQuickTimer)}
              className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
            >
              <Play size={14} />
              <span className="hidden lg:block">Start Timer</span>
            </button>
          )}
        </div>

        {/* Quick timer dropdown */}
        {showQuickTimer && !timer.running && (
          <div className="absolute top-14 right-48 z-50 bg-white shadow-xl rounded-xl border border-slate-100 p-3 min-w-[220px] animate-slide-up">
            <div className="text-xs font-semibold text-slate-500 mb-2">Quick Start Timer</div>
            {projects.filter(p => p.status === 'active').map(p => (
              <button
                key={p.id}
                className="w-full text-left px-2 py-1.5 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                onClick={() => { startTimer(p.id, '', true); setShowQuickTimer(false); }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Quick Add */}
        <button className="btn-primary btn-sm hidden md:flex" onClick={() => navigate('/tasks')}>
          <Plus size={15} /> New Task
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
          >
            <Bell size={18} className="text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 z-50 bg-white shadow-xl rounded-2xl border border-slate-100 w-80 animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Notifications</span>
                <button className="text-xs text-primary-600 hover:underline" onClick={markNotificationsRead}>Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 6).map(n => (
                  <div key={n.id} className={cn('px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors', !n.read && 'bg-blue-50/50')}>
                    <div className="flex items-start gap-2">
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />}
                      <div>
                        <div className="text-sm font-medium text-slate-700">{n.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{n.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            className="flex items-center gap-2 hover:bg-slate-100 rounded-xl px-2 py-1.5 transition-colors"
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
          >
            {currentUser && (
              <div className="avatar-sm text-white text-xs" style={{ backgroundColor: currentUser.avatarColor }}>
                {getInitials(currentUser.name)}
              </div>
            )}
            <span className="text-sm font-medium text-slate-700 hidden lg:block">{currentUser?.name}</span>
          </button>

          {showUser && (
            <div className="absolute right-0 top-12 z-50 bg-white shadow-xl rounded-2xl border border-slate-100 w-48 animate-slide-up">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="text-sm font-semibold text-slate-800">{currentUser?.name}</div>
                <div className="text-xs text-slate-500">{currentUser?.email}</div>
              </div>
              <div className="p-2">
                <button className="w-full sidebar-link text-sm"><User size={15} /> Profile</button>
                <button className="w-full sidebar-link text-sm"><Settings size={15} /> Settings</button>
                <button className="w-full sidebar-link text-sm text-red-600 hover:text-red-700" onClick={() => { logout(); navigate('/login'); }}>
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
