import { useState } from 'react';
import { Search, Upload, Grid, List, FileText, Image, Download, Share2, Lock, Globe, Plus, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDate, formatRelative, getInitials } from '../lib/utils';

const FILE_ICONS: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  pdf:   { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
  image: { icon: Image, color: 'text-blue-600', bg: 'bg-blue-50' },
  figma: { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  doc:   { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function Documents() {
  const { documents, projects, users, addDocument, deleteDocument } = useApp();
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', projectId: projects[0]?.id || '', category: 'Design', clientShared: false });

  const filtered = documents.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchProject = projectFilter === 'all' || d.projectId === projectFilter;
    return matchSearch && matchProject;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      projectId: newDoc.projectId,
      name: newDoc.name || 'Untitled Document',
      type: 'pdf',
      size: 1024 * 1024 * Math.random() * 5,
      uploadedBy: users[0]?.id || 'u1',
      clientShared: newDoc.clientShared,
      category: newDoc.category,
      url: '#'
    });
    setIsUploading(false);
    setNewDoc({ name: '', projectId: projects[0]?.id || '', category: 'Design', clientShared: false });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
          <p className="text-slate-500 text-sm">{documents.length} files across all projects</p>
        </div>
        <button onClick={() => setIsUploading(true)} className="btn-primary"><Upload size={16} /> Upload File</button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select w-48" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={15} /></button>
          <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List size={15} /></button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(doc => {
            const project = projects.find(p => p.id === doc.projectId);
            const uploader = users.find(u => u.id === doc.uploadedBy);
            const fileType = FILE_ICONS[doc.type] || FILE_ICONS.pdf;
            const Icon = fileType.icon;

            return (
              <div key={doc.id} className="card-hover p-4 cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl ${fileType.bg} flex items-center justify-center mb-3`}>
                  <Icon size={22} className={fileType.color} />
                </div>
                <div className="font-medium text-sm text-slate-700 truncate mb-1">{doc.name}</div>
                <div className="text-xs text-slate-400 mb-3">
                  <div>v{doc.version} · {formatBytes(doc.size)}</div>
                  <div className="truncate">{formatDate(doc.uploadedAt, 'MMM d')}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color }} />
                    <span className="text-xs text-slate-400 truncate">{project?.name.split(' ')[0]}</span>
                  </div>
                  {doc.clientShared
                    ? <Globe size={12} className="text-primary-400" />
                    : <Lock size={12} className="text-slate-300" />}
                </div>
                <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="btn-ghost btn-sm flex-1 justify-center p-1.5"><Download size={13} /></button>
                  <button className="btn-ghost btn-sm flex-1 justify-center p-1.5"><Share2 size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table w-full">
            <thead>
              <tr><th>Name</th><th>Project</th><th>Category</th><th>Version</th><th>Size</th><th>Uploaded</th><th>Access</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(doc => {
                const project = projects.find(p => p.id === doc.projectId);
                const uploader = users.find(u => u.id === doc.uploadedBy);
                const fileType = FILE_ICONS[doc.type] || FILE_ICONS.pdf;
                const Icon = fileType.icon;
                return (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${fileType.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={16} className={fileType.color} />
                        </div>
                        <span className="font-medium text-slate-700 text-sm">{doc.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color }} />
                        <span className="text-xs text-slate-500 truncate">{project?.name}</span>
                      </div>
                    </td>
                    <td><span className="badge-slate">{doc.category}</span></td>
                    <td><span className="text-xs text-slate-500">v{doc.version}</span></td>
                    <td><span className="text-xs text-slate-500">{formatBytes(doc.size)}</span></td>
                    <td>
                      <div>
                        <div className="text-xs text-slate-500">{formatDate(doc.uploadedAt, 'MMM d')}</div>
                        <div className="text-xs text-slate-400">by {uploader?.name.split(' ')[0]}</div>
                      </div>
                    </td>
                    <td>
                      {doc.clientShared
                        ? <span className="badge-blue"><Globe size={10} /> Shared</span>
                        : <span className="badge-slate"><Lock size={10} /> Internal</span>}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn-ghost btn-sm p-1.5"><Download size={14} /></button>
                        <button className="btn-ghost btn-sm p-1.5"><Share2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsUploading(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Upload Document</h2>
              <button onClick={() => setIsUploading(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="label">File Name</label>
                <input className="input" placeholder="Enter file name" value={newDoc.name} onChange={e => setNewDoc(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Project</label>
                  <select className="select" value={newDoc.projectId} onChange={e => setNewDoc(p => ({ ...p, projectId: e.target.value }))}>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="select" value={newDoc.category} onChange={e => setNewDoc(p => ({ ...p, category: e.target.value }))}>
                    <option>Design</option>
                    <option>Legal</option>
                    <option>Financial</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="shared" checked={newDoc.clientShared} onChange={e => setNewDoc(p => ({ ...p, clientShared: e.target.checked }))} className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500" />
                <label htmlFor="shared" className="text-sm text-slate-600">Share with client</label>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsUploading(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
