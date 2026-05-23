import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FolderKanban, FileText, CheckCircle2, Clock, 
  ArrowUpRight, TrendingUp, Calendar, ArrowRight,
  FileDown, Zap
} from 'lucide-react';
import { formatCurrency, formatDate, healthColor, healthLabel, cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function PortalDashboard() {
  const { currentUser } = useAuth();
  const { projects, invoices, documents, milestones } = useApp();

  // Filter data for this client
  const clientProjects = projects.filter(p => p.clientId === currentUser?.clientId);
  const clientInvoices = invoices.filter(i => i.clientId === currentUser?.clientId);
  const clientDocuments = documents.filter(d => d.projectId && clientProjects.some(p => p.id === d.projectId) && d.clientShared);
  
  const unpaidInvoices = clientInvoices.filter(i => i.status !== 'paid');
  const activeProjectsCount = clientProjects.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-primary-600">{currentUser?.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Here's an overview of your active projects and deliverables.</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="text-slate-400" size={20} />
          <span className="font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-glass p-6 group hover:border-primary-200 transition-all cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-primary-100/50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
              <FolderKanban size={24} />
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary-400 transition-colors" />
          </div>
          <div className="text-3xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{activeProjectsCount}</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Active Projects</div>
        </div>

        <div className="card-glass p-6 group hover:border-amber-200 transition-all cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-100/50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-3xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">7</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Upcoming Milestones</div>
        </div>

        <div className="card-glass p-6 group hover:border-emerald-200 transition-all cursor-default">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <FileDown size={24} />
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{clientDocuments.length}</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Shared Files</div>
        </div>

        <div className="card-glass p-6 group hover:border-blue-200 transition-all cursor-default border-blue-100 bg-blue-50/10">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{formatCurrency(unpaidInvoices.reduce((sum, i) => sum + i.total, 0))}</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Total Outstanding</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Health & Progress */}
        <div className="card border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary-500" />
              Project Status
            </h3>
            <Link to="/portal/projects" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {clientProjects.slice(0, 3).map(project => {
              const progress = Math.round((project.spent / project.budget) * 100) || 0;
              return (
                <div key={project.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{project.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Updated {formatDate(project.endDate, 'MMMM d')}</div>
                    </div>
                    <div className={`badge-${healthColor(project.health)}`}>
                      {healthLabel(project.health)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Development Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                      <div 
                        className={cn("h-full transition-all duration-1000", progress > 100 ? "bg-red-500" : "bg-primary-500")}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {clientProjects.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <FolderKanban size={40} className="mx-auto mb-3 opacity-20" />
                <p>No active projects found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Deliverables/Milestones */}
        <div className="card border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              Upcoming Deliverables
            </h3>
          </div>
          <div className="p-6 space-y-6">
             {[
               { title: 'Brand Strategy Phase 1', date: 'Oct 24', status: 'In Review', color: 'blue' },
               { title: 'Initial Wireframes', date: 'Oct 28', status: 'Pending', color: 'amber' },
               { title: 'Technical SEO Audit', date: 'Nov 02', status: 'Pending', color: 'slate' },
             ].map((m, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{m.date.split(' ')[0]}</span>
                    <span className="text-sm font-bold text-slate-700 leading-tight">{m.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 truncate">{m.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full bg-${m.color}-500`}></span>
                      <span className="text-xs text-slate-500">{m.status}</span>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-300 hover:text-primary-500 transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Support (Optional Premium Touch) */}
      <div className="fixed bottom-10 right-10 flex flex-col items-end gap-3 z-20">
         <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-100 text-sm font-bold text-slate-800 flex items-center gap-2 animate-bounce-slow">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Agency is Online
         </div>
         <button className="w-16 h-16 bg-primary-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 hover:rotate-3 transition-all hover:bg-primary-700 ring-4 ring-primary-50">
            <Zap size={28} className="fill-white" />
         </button>
      </div>
    </div>
  );
}
