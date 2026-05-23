import { useState } from 'react';
import { AlertTriangle, TrendingDown, DollarSign, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, budgetPercent, budgetColor } from '../lib/utils';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';

export default function Budget() {
  const { projects, clients, expenses, timeEntries, users } = useApp();

  const getBurnData = (projectId: string) => {
    const entries = timeEntries.filter(e => e.projectId === projectId);
    const months = ['Jan','Feb','Mar','Apr','May','Jun'];
    return months.map((month, i) => {
      const monthEntries = entries.filter(e => {
        const m = new Date(e.date).getMonth();
        return m <= i;
      });
      const cost = monthEntries.reduce((s, e) => {
        const user = users.find(u => u.id === e.userId);
        return s + (e.duration / 60) * (user?.hourlyRate || 0);
      }, 0);
      const projExp = expenses.filter(ex => ex.projectId === projectId && new Date(ex.date).getMonth() <= i).reduce((s, ex) => s + ex.amount, 0);
      return { month, spend: Math.round(cost + projExp) };
    });
  };

  const getProjectCost = (projectId: string) => {
    const labor = timeEntries.filter(e => e.projectId === projectId).reduce((s, e) => {
      const user = users.find(u => u.id === e.userId);
      return s + (e.duration / 60) * (user?.hourlyRate || 0);
    }, 0);
    const exp = expenses.filter(ex => ex.projectId === projectId).reduce((s, ex) => s + ex.amount, 0);
    return Math.round(labor + exp);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Budget & Financials</h1>
        <p className="text-slate-500 text-sm">Track project budgets, profitability, and expenses</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Contracted', value: formatCurrency(projects.reduce((s, p) => s + p.budget, 0)), icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Billed', value: formatCurrency(projects.reduce((s, p) => s + p.spent, 0) * 0.7), icon: TrendingDown, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Unbilled Work', value: formatCurrency(24750), icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
          { label: 'Avg Margin', value: '34%', icon: ChevronRight, color: 'bg-purple-50 text-purple-600' },
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

      {/* Project budgets */}
      <div className="space-y-4">
        {projects.filter(p => p.status !== 'archived').map(project => {
          const client = clients.find(c => c.id === project.clientId);
          const pct = budgetPercent(project.spent, project.budget);
          const cost = getProjectCost(project.id);
          const profit = project.budget - cost;
          const margin = project.budget > 0 ? Math.round((profit / project.budget) * 100) : 0;
          const projectExpenses = expenses.filter(ex => ex.projectId === project.id);
          const burnData = getBurnData(project.id);

          return (
            <div key={project.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                  <div>
                    <h3 className="font-semibold text-slate-800">{project.name}</h3>
                    <p className="text-sm text-slate-400">{client?.company} · {project.budgetType.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-800">{formatCurrency(project.budget)}</div>
                  <div className="text-xs text-slate-400">Total budget</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: budget details */}
                <div className="space-y-4">
                  {/* Budget bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500">Budget consumed</span>
                      <span className="font-semibold" style={{ color: budgetColor(pct) }}>{pct}%</span>
                    </div>
                    <div className="budget-bar h-3">
                      <div className="budget-bar-fill" style={{ width: `${pct}%`, backgroundColor: budgetColor(pct) }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Spent: {formatCurrency(project.spent)}</span>
                      <span>Remaining: {formatCurrency(project.budget - project.spent)}</span>
                    </div>
                  </div>

                  {/* Budget alerts */}
                  {pct >= 90 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-sm">
                      <AlertTriangle size={16} />
                      <span>Budget critical: {pct}% consumed</span>
                    </div>
                  )}
                  {pct >= 75 && pct < 90 && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-600 text-sm">
                      <AlertTriangle size={16} />
                      <span>Budget warning: {pct}% consumed</span>
                    </div>
                  )}

                  {/* Profitability */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="text-sm font-bold text-slate-700">{formatCurrency(cost)}</div>
                      <div className="text-xs text-slate-400">Cost</div>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${profit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <div className={`text-sm font-bold ${profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatCurrency(Math.abs(profit))}</div>
                      <div className="text-xs text-slate-400">Profit</div>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${margin >= 20 ? 'bg-emerald-50' : margin >= 0 ? 'bg-amber-50' : 'bg-red-50'}`}>
                      <div className={`text-sm font-bold ${margin >= 20 ? 'text-emerald-700' : margin >= 0 ? 'text-amber-700' : 'text-red-700'}`}>{margin}%</div>
                      <div className="text-xs text-slate-400">Margin</div>
                    </div>
                  </div>

                  {/* Expenses */}
                  {projectExpenses.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-2">Expenses</div>
                      {projectExpenses.map(ex => (
                        <div key={ex.id} className="flex justify-between items-center py-1.5 border-b border-slate-50 text-sm">
                          <span className="text-slate-600">{ex.description}</span>
                          <span className="font-medium text-slate-700">{formatCurrency(ex.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: burn chart */}
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-2">Spend Over Time</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={burnData}>
                      <defs>
                        <linearGradient id={`gBurn${project.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={project.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={project.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                      <Tooltip formatter={(v: number) => [formatCurrency(v), 'Spent']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="spend" stroke={project.color} fill={`url(#gBurn${project.id})`} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
