import { useState } from 'react';
import { Download, Filter, BarChart3, Clock, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDuration, getInitials } from '../lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { REVENUE_DATA } from '../data/mockData';

const REPORT_TYPES = ['Time by Project', 'Team Utilization', 'Client Revenue', 'Project Profitability', 'Budget Variance'];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function Reports() {
  const { projects, clients, users, timeEntries } = useApp();
  const [activeReport, setActiveReport] = useState('Time by Project');

  const timeByProject = projects.map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    hours: Math.round(p.hoursLogged),
    billable: Math.round(p.hoursLogged * 0.8),
  })).filter(p => p.hours > 0);

  const utilizationData = users.filter(u => u.role !== 'client').map(u => ({
    name: u.name.split(' ')[0],
    billable: Math.round(Math.random() * 30 + 50),
    nonBillable: Math.round(Math.random() * 15 + 5),
  }));

  const clientRevenue = clients.map(c => ({
    name: c.company.split(' ')[0],
    revenue: c.totalRevenue,
    projects: c.activeProjects + Math.floor(Math.random() * 2),
  }));

  const profitabilityData = projects.map(p => {
    const margin = p.budget > 0 ? Math.round(((p.budget - p.spent) / p.budget) * 100) : 0;
    return { name: p.name.split(' ').slice(0, 2).join(' '), budget: p.budget, spent: p.spent, margin };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">Business intelligence and performance insights</p>
        </div>
        <button className="btn-secondary"><Download size={16} /> Export CSV</button>
      </div>

      {/* Report selector */}
      <div className="flex gap-2 flex-wrap">
        {REPORT_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveReport(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeReport === type ? 'bg-primary-500 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300 hover:text-primary-600'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: `${timeEntries.reduce((s, e) => s + e.duration, 0) / 60 | 0}h`, icon: Clock, color: 'bg-blue-50 text-blue-600' },
          { label: 'Billable Hours', value: `${timeEntries.filter(e => e.billable).reduce((s, e) => s + e.duration, 0) / 60 | 0}h`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Avg Utilization', value: '81%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
          { label: 'Active Clients', value: String(clients.length), icon: Users, color: 'bg-amber-50 text-amber-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {activeReport === 'Time by Project' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Hours by Project</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={timeByProject} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={100} axisLine={false} />
                <Tooltip formatter={(v: number) => [`${v}h`, '']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="billable" name="Billable" fill="#3b82f6" radius={[0,4,4,0]} stackId="a" />
                <Bar dataKey="hours" name="Total" fill="#e2e8f0" radius={[0,4,4,0]} stackId="b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Billable vs Non-Billable</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={[{ name: 'Billable', value: 78 }, { name: 'Non-Billable', value: 22 }]} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  <Cell fill="#3b82f6" />
                  <Cell fill="#e2e8f0" />
                </Pie>
                <Legend />
                <Tooltip formatter={(v: number) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'Team Utilization' && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Team Utilization (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar dataKey="billable" name="Billable %" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="nonBillable" name="Non-Billable %" fill="#e2e8f0" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'Client Revenue' && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Revenue by Client</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4,4,0,0]}>
                {clientRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'Project Profitability' && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Budget vs Spend by Project</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), '']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="#e2e8f0" radius={[4,4,0,0]} />
              <Bar dataKey="spent" name="Spent" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'Budget Variance' && (
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Revenue vs Cost Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), '']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Revenue" />
              <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Cost" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
