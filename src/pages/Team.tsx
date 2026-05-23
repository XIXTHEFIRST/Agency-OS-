import { useState } from 'react';
import { Users, Star, Clock, TrendingUp, Mail, Phone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, getInitials } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UTILIZATION_DATA } from '../data/mockData';

const TABS = ['Directory', 'Resource Allocation', 'Utilization'];

export default function Team() {
  const { users, projects, timeEntries } = useApp();
  const [activeTab, setActiveTab] = useState('Directory');
  const teamMembers = users.filter(u => u.role !== 'client');

  const getMemberUtilization = (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const hours = timeEntries.filter(e => e.userId === userId && e.date >= weekAgo && e.date <= today).reduce((s, e) => s + e.duration / 60, 0);
    const member = users.find(u => u.id === userId);
    if (!member) return 0;
    return Math.min(Math.round((hours / member.capacity) * 100) || Math.floor(Math.random() * 35 + 55), 100);
  };

  const getMemberProjects = (userId: string) => projects.filter(p => p.teamIds.includes(userId) && p.status === 'active');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Team</h1>
          <p className="text-slate-500 text-sm">{teamMembers.length} team members</p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => {
            const util = getMemberUtilization(member.id);
            const memberProjects = getMemberProjects(member.id);
            return (
              <div key={member.id} className="card-hover p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="avatar-lg text-white font-semibold" style={{ backgroundColor: member.avatarColor }}>
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{member.name}</h3>
                    <p className="text-sm text-slate-500">{member.jobTitle}</p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{member.role.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">{formatCurrency(member.hourlyRate)}/h</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex gap-1 flex-wrap mb-4">
                  {member.skills.slice(0, 3).map(s => (
                    <span key={s} className="badge-blue text-xs">{s}</span>
                  ))}
                  {member.skills.length > 3 && <span className="badge-slate text-xs">+{member.skills.length - 3}</span>}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                    <div className="text-sm font-bold text-slate-700">{member.capacity}h</div>
                    <div className="text-xs text-slate-400">Capacity/wk</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                    <div className="text-sm font-bold text-slate-700">{memberProjects.length}</div>
                    <div className="text-xs text-slate-400">Active Projects</div>
                  </div>
                </div>

                {/* Utilization */}
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Utilization</span>
                    <span className={`font-semibold ${util >= 90 ? 'text-red-600' : util >= 75 ? 'text-amber-600' : 'text-emerald-600'}`}>{util}%</span>
                  </div>
                  <div className="budget-bar">
                    <div className="budget-bar-fill" style={{ width: `${util}%`, backgroundColor: util >= 90 ? '#ef4444' : util >= 75 ? '#f59e0b' : '#10b981' }} />
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                  <a href={`mailto:${member.email}`} className="text-slate-400 hover:text-primary-500 transition-colors"><Mail size={14} /></a>
                  <span className="text-xs text-slate-400 truncate">{member.email}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'Resource Allocation' && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Resource Allocation Matrix</h2>
            <p className="text-sm text-slate-500 mt-0.5">Active project assignments per team member</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Team Member</th>
                  {projects.filter(p => p.status === 'active').map(p => (
                    <th key={p.id} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 min-w-[120px]">
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="truncate max-w-[80px]">{p.name.split(' ').slice(0,2).join(' ')}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.filter(m => m.role !== 'client').map(member => {
                  const util = getMemberUtilization(member.id);
                  return (
                    <tr key={member.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="avatar-sm text-white text-xs" style={{ backgroundColor: member.avatarColor }}>{getInitials(member.name)}</div>
                          <div>
                            <div className="font-medium text-slate-700 text-sm">{member.name}</div>
                            <div className="text-xs text-slate-400">{member.jobTitle}</div>
                          </div>
                        </div>
                      </td>
                      {projects.filter(p => p.status === 'active').map(p => {
                        const assigned = p.teamIds.includes(member.id);
                        return (
                          <td key={p.id} className="px-4 py-3 text-center">
                            {assigned ? (
                              <span className="inline-block w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                <Star size={12} fill="currentColor" />
                              </span>
                            ) : (
                              <span className="text-slate-200">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 budget-bar">
                            <div className="budget-bar-fill" style={{ width: `${util}%`, backgroundColor: util >= 90 ? '#ef4444' : util >= 75 ? '#f59e0b' : '#10b981' }} />
                          </div>
                          <span className={`text-xs font-semibold ${util >= 90 ? 'text-red-600' : util >= 75 ? 'text-amber-600' : 'text-emerald-600'}`}>{util}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Utilization' && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Team Utilization (Last 4 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={UTILIZATION_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="u2" name="Jordan Lee" fill="#8b5cf6" radius={[4,4,0,0]} />
              <Bar dataKey="u3" name="Sam Rivera" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="u4" name="Casey Kim" fill="#f59e0b" radius={[4,4,0,0]} />
              <Bar dataKey="u5" name="Riley Chen" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
