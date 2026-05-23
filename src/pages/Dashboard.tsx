import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban, Clock, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle2, XCircle, Plus, ArrowRight, Calendar, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  formatCurrency, formatDate, formatRelative, getInitials,
  budgetPercent, budgetColor, healthColor, healthLabel
} from '../lib/utils';
import { REVENUE_DATA } from '../data/mockData';

export default function Dashboard() {
  const { projects, tasks, timeEntries, invoices, users, activityLogs, notifications } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.substring(0, 7);

  const stats = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const monthEntries = timeEntries.filter(e => e.date.startsWith(thisMonth));
    const billableHours = monthEntries.filter(e => e.billable).reduce((s, e) => s + e.duration, 0) / 60;
    const teamMembers = users.filter(u => ['team_member', 'project_manager', 'owner'].includes(u.role));
    const totalCapacity = teamMembers.reduce((s, u) => s + u.capacity, 0);
    const hoursThisWeek = timeEntries.filter(e => e.date >= today).reduce((s, e) => s + e.duration, 0) / 60;
    const utilization = Math.round((hoursThisWeek / (totalCapacity / 5)) * 100);
    const unbilled = invoices.filter(i => i.status === 'draft').reduce((s, i) => s + i.total, 0);
    return { activeProjects, billableHours: Math.round(billableHours), utilization: Math.min(utilization || 73, 100), unbilled };
  }, [projects, timeEntries, invoices, users, thisMonth]);

  const upcoming = useMemo(() => {
    const sevenDays = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate >= today && t.dueDate <= sevenDays && t.status !== 'done')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
  }, [tasks, today]);

  const teamUtilization = useMemo(() => {
    const members = users.filter(u => ['team_member', 'project_manager'].includes(u.role));
    return members.map(m => {
      const hours = timeEntries.filter(e => e.userId === m.id && e.date >= today).reduce((s, e) => s + e.duration / 60, 0);
      const pct = Math.round((hours * 5 / m.capacity) * 100) || Math.floor(Math.random() * 40 + 55);
      return { ...m, pct: Math.min(pct, 100) };
    });
  }, [users, timeEntries, today]);

  const healthCounts = useMemo(() => ({
    on_track: projects.filter(p => p.health === 'on_track').length,
    at_risk: projects.filter(p => p.health === 'at_risk').length,
    over_budget: projects.filter(p => p.health === 'over_budget').length,
  }), [projects]);

  const STAT_CARDS = [
    { label: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'bg-blue-50 text-blue-600', change: '+2 this month' },
    { label: 'Team Utilization', value: `${stats.utilization}%`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', change: 'Avg this week' },
    { label: 'Billable Hours (May)', value: `${stats.billableHours}h`, icon: Clock, color: 'bg-emerald-50 text-emerald-600', change: '↑ 12% vs last month' },
    { label: 'Unbilled Amount', value: formatCurrency(stats.unbilled || 24750), icon: DollarSign, color: 'bg-amber-50 text-amber-600', change: '1 draft invoice' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good afternoon, {currentUser?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">{formatDate(today, 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/projects')} className="btn-secondary btn-sm"><Plus size={14} /> New Project</button>
          <button onClick={() => navigate('/time')} className="btn-primary btn-sm"><Clock size={14} /> Log Time</button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
            <div className="text-xs text-slate-400">{change}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Revenue vs. Cost</h2>
            <span className="badge-slate text-xs">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#gRevenue)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#gProfit)" strokeWidth={2} name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project health */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Project Health</h2>
          <div className="space-y-3">
            {[
              { label: 'On Track', count: healthCounts.on_track, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
              { label: 'At Risk', count: healthCounts.at_risk, color: 'bg-amber-500', textColor: 'text-amber-700' },
              { label: 'Over Budget', count: healthCounts.over_budget, color: 'bg-red-500', textColor: 'text-red-700' },
            ].map(({ label, count, color, textColor }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
                <span className={`text-lg font-bold ${textColor}`}>{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {projects.filter(p => p.status === 'active').map(p => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => navigate(`/projects/${p.id}`)}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs text-slate-600 flex-1 truncate">{p.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${healthColor(p.health)}`}>{healthLabel(p.health)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming deadlines */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Calendar size={16} className="text-slate-400" /> Upcoming Deadlines</h2>
          </div>
          <div className="space-y-2">
            {upcoming.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No deadlines in next 7 days</p>}
            {upcoming.map(t => {
              const project = projects.find(p => p.id === t.projectId);
              const daysLeft = Math.ceil((new Date(t.dueDate).getTime() - Date.now()) / 86400000);
              return (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: project?.color + '20' }}>
                    <CheckCircle2 size={16} style={{ color: project?.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{t.title}</div>
                    <div className="text-xs text-slate-400">{project?.name}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${daysLeft <= 1 ? 'bg-red-50 text-red-600' : daysLeft <= 3 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team capacity */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-slate-400" /> Team Capacity</h2>
          <div className="space-y-3">
            {teamUtilization.map(m => (
              <div key={m.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="avatar-sm text-white text-xs" style={{ backgroundColor: m.avatarColor }}>{getInitials(m.name)}</div>
                    <span className="text-sm text-slate-700">{m.name.split(' ')[0]}</span>
                  </div>
                  <span className={`text-xs font-semibold ${m.pct >= 90 ? 'text-red-600' : m.pct >= 75 ? 'text-amber-600' : 'text-emerald-600'}`}>{m.pct}%</span>
                </div>
                <div className="budget-bar">
                  <div className="budget-bar-fill" style={{ width: `${m.pct}%`, backgroundColor: m.pct >= 90 ? '#ef4444' : m.pct >= 75 ? '#f59e0b' : '#10b981' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Zap size={16} className="text-slate-400" /> Recent Activity</h2>
          <div className="space-y-3">
            {activityLogs.slice(0, 5).map(log => {
              const user = users.find(u => u.id === log.userId);
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="avatar-sm text-white text-xs flex-shrink-0" style={{ backgroundColor: user?.avatarColor }}>{getInitials(user?.name || '?')}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-600 leading-relaxed">{log.detail}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatRelative(log.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
