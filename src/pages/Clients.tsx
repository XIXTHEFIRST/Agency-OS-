import { useState } from 'react';
import { Search, Plus, Filter, Building2, Mail, Phone, ExternalLink, MoreVertical, Globe, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getInitials } from '../lib/utils';
import type { Client } from '../types';

export default function Clients() {
  const { clients, projects, addClient, updateClient } = useApp();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'createdAt' | 'activeProjects' | 'totalRevenue'>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    color: '#3b82f6',
    status: 'active',
    projects: []
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(newClient);
    setIsAdding(false);
    setNewClient({
      name: '', company: '', email: '', phone: '', address: '', avatar: '', color: '#3b82f6', status: 'active', projects: []
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Clients</h1>
          <p className="text-slate-500 mt-1">Manage your agency's client relationships and portals.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus size={18} />
          <span>New Client</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
              <Building2 size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{clients.length}</div>
              <div className="text-sm text-slate-500">Total Clients</div>
            </div>
          </div>
        </div>
        <div className="card-glass p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Globe size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{clients.filter(c => c.status === 'active').length}</div>
              <div className="text-sm text-slate-500">Active Portals</div>
            </div>
          </div>
        </div>
        <div className="card-glass p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Zap size={24} className="fill-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {projects.filter(p => clients.some(c => c.id === p.clientId)).length}
              </div>
              <div className="text-sm text-slate-500">Total Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search clients, companies, emails..." 
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn-secondary flex-1 md:flex-none">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Client List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="card group hover:scale-[1.02] transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {client.avatar ? (
                    <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-lg">
                      {getInitials(client.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{client.company}</h3>
                    <p className="text-sm text-slate-500">{client.name}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  <span>{client.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {client.activeProjects} Active Projects
                </div>
                <div className={`badge-${client.status === 'active' ? 'emerald' : 'slate'}`}>
                  {client.status}
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-50 group-hover:bg-primary-50/30 transition-colors flex justify-between items-center">
              <button className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View Portal <ExternalLink size={12} />
              </button>
              <button className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Client Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-fade-in p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">New Client</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Contact Name</label>
                  <input className="input" placeholder="e.g. John Doe" value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Company</label>
                  <input className="input" placeholder="e.g. Acme Inc" value={newClient.company} onChange={e => setNewClient(p => ({ ...p, company: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="john@example.com" value={newClient.email} onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" className="input" placeholder="+1 (555) 000-0000" value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="label">Avatar URL (Optional)</label>
                <input className="input" placeholder="https://..." value={newClient.avatar} onChange={e => setNewClient(p => ({ ...p, avatar: e.target.value }))} />
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Zap = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
