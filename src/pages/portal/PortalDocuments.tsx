import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FolderOpen, Search, Download, ExternalLink, 
  FileText, Image, FileVideo, Grid, List, 
  MoreVertical, Filter, Globe, Lock, Clock
} from 'lucide-react';
import { formatDate, cn } from '../../lib/utils';
import { useState } from 'react';

const FILE_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  jpg: { icon: Image, color: 'text-blue-500', bg: 'bg-blue-50' },
  png: { icon: Image, color: 'text-blue-500', bg: 'bg-blue-50' },
  mp4: { icon: FileVideo, color: 'text-purple-500', bg: 'bg-purple-50' },
};

export default function PortalDocuments() {
  const { currentUser } = useAuth();
  const { documents, projects } = useApp();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const clientProjects = projects.filter(p => p.clientId === currentUser?.clientId);
  const clientDocuments = documents.filter(d => 
    d.projectId && 
    clientProjects.some(p => p.id === d.projectId) && 
    d.clientShared
  );

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shared Files</h1>
          <p className="text-slate-500 mt-1">Access all assets, reports, and deliverables shared with your team.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setView('grid')}
            className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-primary-50 text-primary-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
          >
            <Grid size={18} />
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
            placeholder="Search filenames, categories..." 
            className="input pl-10 h-11"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn-secondary h-11 px-6">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clientDocuments.map(doc => {
            const ext = doc.name.split('.').pop()?.toLowerCase() || 'pdf';
            const iconConfig = FILE_ICONS[ext] || FILE_ICONS.pdf;
            const Icon = iconConfig.icon;
            const project = clientProjects.find(p => p.id === doc.projectId);

            return (
              <div key={doc.id} className="card group hover:scale-[1.02] transition-all bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-current opacity-80", iconConfig.bg, iconConfig.color)}>
                      <Icon size={28} />
                    </div>
                    <button className="p-2 text-slate-300 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg mb-1 truncate group-hover:text-primary-700 transition-colors" title={doc.name}>
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                    <span>{doc.category}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{formatBytes(doc.size)}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg mb-6 group-hover:bg-primary-50 transition-colors">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color || '#cbd5e1' }}></div>
                    <span className="text-xs font-bold text-slate-600 truncate">{project?.name || 'General'}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                       <Clock size={12} />
                       {formatDate(doc.uploadedAt, 'MMM d')}
                    </div>
                    {doc.clientShared ? (
                      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                         <Globe size={10} />
                         Shared
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                         <Lock size={10} />
                         Internal
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-50 group-hover:bg-primary-600 transition-colors flex justify-between items-center group/btn">
                  <button className="text-xs font-black text-slate-500 group-hover:text-white flex items-center gap-2 group-hover/btn:scale-105 transition-transform uppercase tracking-tighter">
                    <Download size={14} className="group-hover:animate-bounce" /> Download
                  </button>
                  <button className="text-xs font-black text-slate-500 group-hover:text-white flex items-center gap-2 group-hover/btn:scale-105 transition-transform uppercase tracking-tighter">
                    View <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {clientDocuments.length === 0 && (
            <div className="col-span-full p-20 text-center text-slate-400">
               <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
               <p className="font-bold text-lg text-slate-500 mb-1">No shared files yet</p>
               <p className="text-sm">Your agency hasn't shared any documents with you at this time.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden border-slate-100 shadow-sm bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Added</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clientDocuments.map(doc => {
                const ext = doc.name.split('.').pop()?.toLowerCase() || 'pdf';
                const iconConfig = FILE_ICONS[ext] || FILE_ICONS.pdf;
                const Icon = iconConfig.icon;
                const project = clientProjects.find(p => p.id === doc.projectId);

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center opacity-80", iconConfig.bg, iconConfig.color)}>
                          <Icon size={20} />
                        </div>
                        <span className="font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-sm text-slate-500 font-medium">{project?.name || 'General'}</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="badge-slate text-[10px] uppercase font-black tracking-widest">{doc.category}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-400 tabular-nums">
                       {formatBytes(doc.size)}
                    </td>
                    <td className="px-6 py-5 text-right text-sm text-slate-500">
                       {formatDate(doc.uploadedAt, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Download size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <ExternalLink size={18} />
                         </button>
                       </div>
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
