import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FolderKanban, Clock, Layout, List, 
  Search, Filter, ExternalLink, Calendar
} from 'lucide-react';
import { formatDate, healthColor, healthLabel, cn } from '../../lib/utils';
import { useState } from 'react';

export default function PortalProjects() {
  const { currentUser } = useAuth();
  const { projects } = useApp();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const clientProjects = projects.filter(p => p.clientId === currentUser?.clientId);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Projects</h1>
          <p className="text-slate-500 mt-1">Track progress, timelines, and deliverables for your ongoing work.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setView('grid')}
            className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-primary-50 text-primary-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
          >
            <Layout size={18} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-primary-50 text-primary-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="input pl-10 h-11"
          />
        </div>
        <button className="btn-secondary h-11 px-6">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clientProjects.map(project => {
            const progress = Math.round((project.spent / project.budget) * 100) || 0;
            return (
              <div key={project.id} className="card group hover:scale-[1.02] transition-all bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner" style={{ backgroundColor: project.color }}>
                      {project.name.charAt(0)}
                    </div>
                    <div className={`badge-${healthColor(project.health)}`}>
                      {healthLabel(project.health)}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2 truncate group-hover:text-primary-700 transition-colors">{project.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10 leading-relaxed font-medium">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-lg">
                      <Clock size={12} className="text-slate-400" />
                      <span>{formatDate(project.endDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-lg">
                      <FolderKanban size={12} className="text-slate-400" />
                      <span>{project.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>PROJECT COMPLETION</span>
                      <span className="text-primary-600">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", progress > 100 ? "bg-red-500" : "bg-primary-500")}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 group-hover:bg-primary-50/50 transition-colors flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-500">LAST SYNC: 2 HRS AGO</div>
                  <button className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 underline decoration-primary-200 underline-offset-4 decoration-2">
                    Open Details <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden border-slate-100 shadow-sm bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Health</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clientProjects.map(project => {
                const progress = Math.round((project.spent / project.budget) * 100) || 0;
                return (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm" style={{ backgroundColor: project.color }}>
                          {project.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formatDate(project.startDate, 'MMM d')} - {formatDate(project.endDate, 'MMM d')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 truncate">
                      <span className="text-sm font-medium text-slate-600 capitalize">{project.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-5 w-48">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-primary-500 transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{progress}% complete</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`badge-${healthColor(project.health)} inline-flex shrink-0`}>
                        {healthLabel(project.health)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
