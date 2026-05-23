import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, FolderKanban, Clock, DollarSign, Users, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate, budgetPercent, budgetColor, healthColor, healthLabel, statusColor } from '../lib/utils';
import type { ProjectStatus } from '../types';

const STATUS_FILTERS: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Planning', value: 'planning' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Completed', value: 'completed' },
];

export default function Projects() {
  const { projects, clients, users, tasks, timeEntries, addProject } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '', clientId: clients[0]?.id || '', managerId: users[0]?.id || '',
    type: 'active' as any, budget: 0, budgetType: 'fixed_price' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    color: '#3b82f6', description: '', tags: [] as string[],
    teamIds: [users[0]?.id || ''], hoursEstimated: 0
  });
  const navigate = useNavigate();

  const filtered = projects.filter(p => {
    const client = clients.find(c => c.id === p.clientId);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      client?.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      ...newProject,
      status: 'planning',
    });
    setIsAdding(false);
    setNewProject({
      name: '', clientId: clients[0]?.id || '', managerId: users[0]?.id || '',
      type: 'active' as any, budget: 0, budgetType: 'fixed_price',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      color: '#3b82f6', description: '', tags: [],
      teamIds: [users[0]?.id || ''], hoursEstimated: 0
    });
  };

  const profitability = (project: typeof projects[0]) => {
    const pct = project.budget > 0 ? Math.round(((project.budget - project.spent) / project.budget) * 100) : 0;
    return pct;
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 text-sm">{projects.length} total projects</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-primary"><Plus size={16} /> New Project</button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${statusFilter === f.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(project => {
          const client = clients.find(c => c.id === project.clientId);
          const manager = users.find(u => u.id === project.managerId);
          const pct = budgetPercent(project.spent, project.budget);
          const profit = profitability(project);
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const taskCount = projectTasks.length;
          const completedTasks = projectTasks.filter(t => t.status === 'done').length;

          return (
            <div
              key={project.id}
              className="card-hover p-5 cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: project.color + '20' }}>
                    <FolderKanban size={20} style={{ color: project.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{project.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{client?.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={statusColor(project.status) + ' badge capitalize'}>{project.status.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1 mb-3 flex-wrap">
                {project.tags.map(tag => (
                  <span key={tag} className="badge-slate text-xs">{tag}</span>
                ))}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${healthColor(project.health)}`}>{healthLabel(project.health)}</span>
              </div>

              {/* Budget progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Budget</span>
                  <span className="font-medium">{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span>
                </div>
                <div className="budget-bar">
                  <div className="budget-bar-fill" style={{ width: `${pct}%`, backgroundColor: budgetColor(pct) }} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{pct}% used</div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="text-xs font-bold text-slate-700">{project.hoursLogged}h</div>
                  <div className="text-xs text-slate-400">Hours</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <div className="text-xs font-bold text-slate-700">{completedTasks}/{taskCount}</div>
                  <div className="text-xs text-slate-400">Tasks</div>
                </div>
                <div className={`rounded-xl p-2 ${profit > 20 ? 'bg-emerald-50' : profit > 0 ? 'bg-amber-50' : 'bg-red-50'}`}>
                  <div className={`text-xs font-bold ${profit > 20 ? 'text-emerald-700' : profit > 0 ? 'text-amber-700' : 'text-red-700'}`}>{profit}%</div>
                  <div className="text-xs text-slate-400">Margin</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <div className="avatar-sm text-white text-xs" style={{ backgroundColor: manager?.avatarColor }}>{manager?.name.charAt(0)}</div>
                  <span className="text-xs text-slate-500">{manager?.name.split(' ')[0]}</span>
                </div>
                <span className="text-xs text-slate-400">Due {formatDate(project.endDate, 'MMM d')}</span>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <FolderKanban size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-slate-500">No projects found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* New Project Drawer */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-slide-in-right p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">New Project</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg"><MoreHorizontal size={20} className="rotate-90" /></button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="label">Project Name</label>
                <input autoFocus required className="input" placeholder="e.g. Website Redesign" value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} />
              </div>

              <div>
                <label className="label">Client</label>
                <select className="select" value={newProject.clientId} onChange={e => setNewProject(p => ({ ...p, clientId: e.target.value }))}>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Manager</label>
                  <select className="select" value={newProject.managerId} onChange={e => setNewProject(p => ({ ...p, managerId: e.target.value }))}>
                    {users.filter(u => u.role !== 'client').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Project Type</label>
                  <select className="select" value={newProject.budgetType} onChange={e => setNewProject(p => ({ ...p, budgetType: e.target.value as any }))}>
                    <option value="fixed_price">Fixed Price</option>
                    <option value="time_materials">Time & Materials</option>
                    <option value="retainer">Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Budget Amount</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" className="input pl-8" value={newProject.budget} onChange={e => setNewProject(p => ({ ...p, budget: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date</label>
                  <input type="date" className="input" value={newProject.startDate} onChange={e => setNewProject(p => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input type="date" className="input" value={newProject.endDate} onChange={e => setNewProject(p => ({ ...p, endDate: e.target.value }))} />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
