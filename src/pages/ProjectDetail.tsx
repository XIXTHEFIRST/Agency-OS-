import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Users, DollarSign, Clock, 
  CheckCircle2, FileText, Settings, Plus, MessageSquare,
  BarChart3, Activity
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { 
  formatDate, formatCurrency, budgetPercent, budgetColor, 
  healthColor, healthLabel, statusColor, getInitials, formatDuration, cn
} from '../lib/utils';

const TABS = ['Overview', 'Tasks', 'Timeline', 'Budget', 'Team', 'Files', 'Activity'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, clients, users, tasks, milestones, expenses, timeEntries, activityLogs } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');

  const project = projects.find(p => p.id === id);
  if (!project) return <div className="p-10 text-center">Project not found</div>;

  const client = clients.find(c => c.id === project.clientId);
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectExpenses = expenses.filter(e => e.projectId === project.id);
  const projectLogs = activityLogs.filter(l => l.entityId === project.id || projectTasks.some(t => t.id === l.entityId));
  const projectTeam = users.filter(u => project.teamIds.includes(u.id));
  const manager = users.find(u => u.id === project.managerId);

  const pct = budgetPercent(project.spent, project.budget);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
              <span className={`${statusColor(project.status)} badge capitalize`}>{project.status.replace('_', ' ')}</span>
              <span className={`${healthColor(project.health)} badge capitalize`}>{healthLabel(project.health)}</span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              {client?.company} · Created {formatDate(project.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary btn-sm"><Settings size={14} /> Project Settings</button>
          <button className="btn-primary btn-sm"><Plus size={14} /> New Task</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><Clock size={14} /> Hours Logged</div>
          <div className="text-xl font-bold text-slate-800">{project.hoursLogged}h <span className="text-xs font-normal text-slate-400">/ {project.hoursEstimated}h est.</span></div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><DollarSign size={14} /> Current Spend</div>
          <div className="text-xl font-bold text-slate-800">{formatCurrency(project.spent)} <span className="text-xs font-normal text-slate-400">/ {formatCurrency(project.budget)}</span></div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><Calendar size={14} /> Next Milestone</div>
          <div className="text-xl font-bold text-slate-800 text-sm truncate">{projectMilestones.find(m => !m.completed)?.title || 'All Completed'}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1"><Users size={14} /> Team Size</div>
          <div className="text-xl font-bold text-slate-800">{project.teamIds.length} members</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'Overview' && (
            <>
              <div className="card p-6">
                <h2 className="font-semibold text-slate-800 mb-4">Description</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
                
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Project Manager</span>
                        <span className="font-medium text-slate-700">{manager?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Budget Type</span>
                        <span className="font-medium text-slate-700 capitalize">{project.budgetType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Timeline</span>
                        <span className="font-medium text-slate-700">{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Milestones Progress</h3>
                    <div className="space-y-2">
                       {projectMilestones.map(m => (
                         <div key={m.id} className="flex items-center gap-2 text-sm">
                           {m.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />}
                           <span className={m.completed ? 'text-slate-400 line-through' : 'text-slate-700'}>{m.title}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-slate-800 mb-4">Task Summary</h2>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Total', count: projectTasks.length, color: 'text-slate-600 bg-slate-50' },
                    { label: 'In Progress', count: projectTasks.filter(t => t.status === 'in_progress').length, color: 'text-amber-600 bg-amber-50' },
                    { label: 'Review', count: projectTasks.filter(t => t.status === 'review').length, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Done', count: projectTasks.filter(t => t.status === 'done').length, color: 'text-emerald-600 bg-emerald-50' },
                  ].map(s => (
                    <div key={s.label} className={`p-4 rounded-2xl text-center ${s.color}`}>
                      <div className="text-2xl font-bold">{s.count}</div>
                      <div className="text-xs font-medium uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeTab === 'Tasks' && (
            <div className="card overflow-hidden">
               <table className="data-table w-full">
                 <thead>
                   <tr>
                     <th>Task</th>
                     <th>Assignee</th>
                     <th>Due Date</th>
                     <th>Status</th>
                     <th>Progress</th>
                   </tr>
                 </thead>
                 <tbody>
                    {projectTasks.map(t => {
                      const assignee = users.find(u => u.id === t.assigneeId);
                      return (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="font-medium text-slate-700">{t.title}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar-sm text-white" style={{ backgroundColor: assignee?.avatarColor }}>{getInitials(assignee?.name || '')}</div>
                              <span className="text-xs">{assignee?.name.split(' ')[0]}</span>
                            </div>
                          </td>
                          <td className="text-xs text-slate-500">{formatDate(t.dueDate)}</td>
                          <td><span className={`${statusColor(t.status)} badge capitalize`}>{t.status.replace('_', ' ')}</span></td>
                          <td className="w-24">
                            <div className="budget-bar h-1.5">
                               <div className="budget-bar-fill bg-primary-500" style={{ width: t.status === 'done' ? '100%' : t.status === 'in_progress' ? '50%' : '0%' }} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                 </tbody>
               </table>
            </div>
          )}

          {activeTab === 'Timeline' && (
            <div className="card p-8">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                <div className="space-y-12">
                  {projectMilestones.map((m, i) => (
                    <div key={m.id} className="relative pl-12">
                      <div className={cn(
                        "absolute left-2 top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm -translate-x-1/2 z-10",
                        m.completed ? "bg-emerald-500" : "bg-slate-200"
                      )} />
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-slate-800">{m.title}</h3>
                          <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", m.completed ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400")}>
                            {m.completed ? 'Achieved' : 'Scheduled'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Calendar size={12} />
                          {formatDate(m.dueDate, 'MMM d, yyyy')}
                        </div>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                          Deliverable and outcome tracking for this project phase.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Budget Sidebox */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
              Budget Health
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${pct > 90 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {pct}% Used
              </span>
            </h2>
            <div className="budget-bar h-2.5 mb-2">
               <div className="budget-bar-fill" style={{ width: `${pct}%`, backgroundColor: budgetColor(pct) }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-6 font-medium">
               <span>{formatCurrency(project.spent)} spent</span>
               <span>{formatCurrency(project.budget - project.spent)} left</span>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Labor Cost</span>
                 <span className="font-semibold text-slate-800">{formatCurrency(project.spent - 1200)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Expenses</span>
                 <span className="font-semibold text-slate-800">{formatCurrency(projectExpenses.reduce((s,e) => s + e.amount, 0))}</span>
               </div>
               <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-center text-sm">
                 <span className="text-slate-700 font-bold">Estimated Profit</span>
                 <span className="font-bold text-emerald-600">{formatCurrency(project.budget - project.spent)}</span>
               </div>
            </div>
          </div>

          {/* Team Sidebox */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Project Team</h2>
            <div className="space-y-4">
               {projectTeam.map(u => (
                 <div key={u.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="avatar-md text-white font-semibold" style={{ backgroundColor: u.avatarColor }}>{getInitials(u.name)}</div>
                       <div>
                         <div className="text-sm font-semibold text-slate-700">{u.name}</div>
                         <div className="text-xs text-slate-400">{u.jobTitle}</div>
                       </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-500 transition-colors">
                       <MessageSquare size={16} />
                    </button>
                 </div>
               ))}
            </div>
            <button className="btn-secondary w-full btn-sm mt-6">
               <Plus size={14} /> Add Team Member
            </button>
          </div>
          
          {/* Recent Activity Sidebox */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Activity size={16} className="text-slate-400" /> Recent Activity</h2>
            <div className="space-y-4">
               {projectLogs.slice(0, 4).map(log => {
                 const actor = users.find(u => u.id === log.userId);
                 return (
                   <div key={log.id} className="flex gap-3">
                     <div className="avatar-sm text-white flex-shrink-0" style={{ backgroundColor: actor?.avatarColor }}>{getInitials(actor?.name || '')}</div>
                     <div>
                        <p className="text-xs text-slate-600 leading-snug">{log.detail}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(log.createdAt, 'MMM d, h:mm a')}</p>
                     </div>
                   </div>
                 )
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
