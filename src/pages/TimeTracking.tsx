import { useState, useEffect, useRef } from 'react';
import { Play, Square, Plus, Clock, Check, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatDuration, formatDate, formatCurrency, getInitials, elapsedToDisplay } from '../lib/utils';

const TABS = ['Timer', 'Daily', 'Weekly', 'All Entries'];

export default function TimeTracking() {
  const { timer, startTimer, stopTimer, updateTimer, timeEntries, projects, tasks, users, addTimeEntry } = useApp();
  const [activeTab, setActiveTab] = useState('Timer');
  const [elapsed, setElapsed] = useState(0);
  const [manualEntry, setManualEntry] = useState({ projectId: '', taskId: '', date: new Date().toISOString().split('T')[0], hours: '', minutes: '', billable: true, notes: '' });
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timer.running && timer.startTime) {
      intervalRef.current = setInterval(() => setElapsed(Date.now() - timer.startTime!), 1000) as unknown as number;
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timer.running, timer.startTime]);

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = timeEntries.filter(e => e.date === today);
  const todayTotal = todayEntries.reduce((s, e) => s + e.duration, 0);
  const todayBillable = todayEntries.filter(e => e.billable).reduce((s, e) => s + e.duration, 0);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = (parseInt(manualEntry.hours || '0') * 60) + parseInt(manualEntry.minutes || '0');
    if (!duration || !manualEntry.projectId) return;
    addTimeEntry({ userId: 'u1', projectId: manualEntry.projectId, taskId: manualEntry.taskId || undefined, date: manualEntry.date, duration, billable: manualEntry.billable, notes: manualEntry.notes, approved: false });
    setManualEntry(m => ({ ...m, hours: '', minutes: '', notes: '' }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Time Tracking</h1>
          <p className="text-slate-500 text-sm">Today: {formatDuration(todayTotal)} logged · {formatDuration(todayBillable)} billable</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Timer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timer widget */}
          <div className="card p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Active Timer</h2>

            {/* Big elapsed display */}
            <div className={`text-6xl font-mono font-bold text-center mb-6 ${timer.running ? 'text-primary-600' : 'text-slate-300'}`}>
              {elapsedToDisplay(timer.running ? elapsed : 0)}
            </div>

            <div className="space-y-3 mb-5">
              <select className="select" value={timer.projectId} onChange={e => updateTimer({ projectId: e.target.value })}>
                <option value="">Select project...</option>
                {projects.filter(p => p.status === 'active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {timer.projectId && (
                <select className="select" value={timer.taskId} onChange={e => updateTimer({ taskId: e.target.value })}>
                  <option value="">No specific task</option>
                  {tasks.filter(t => t.projectId === timer.projectId).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              )}
              <input className="input" placeholder="Notes (optional)" value={timer.notes} onChange={e => updateTimer({ notes: e.target.value })} />
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-10 h-5 rounded-full transition-colors relative ${timer.billable ? 'bg-primary-500' : 'bg-slate-200'}`}
                  onClick={() => updateTimer({ billable: !timer.billable })}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${timer.billable ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm text-slate-600">Billable</span>
              </label>
            </div>

            <button
              onClick={() => timer.running ? stopTimer() : (timer.projectId && startTimer(timer.projectId, timer.taskId, timer.billable))}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${timer.running
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary-500 text-white hover:bg-primary-600'}`}
            >
              {timer.running ? <><Square size={16} fill="white" /> Stop Timer</> : <><Play size={16} fill="white" /> Start Timer</>}
            </button>
          </div>

          {/* Manual entry */}
          <div className="card p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Manual Entry</h2>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <select className="select" value={manualEntry.projectId} onChange={e => setManualEntry(m => ({ ...m, projectId: e.target.value }))} required>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="date" className="input" value={manualEntry.date} onChange={e => setManualEntry(m => ({ ...m, date: e.target.value }))} />
              <div className="flex gap-2">
                <input type="number" className="input" placeholder="Hours" min="0" max="24" value={manualEntry.hours} onChange={e => setManualEntry(m => ({ ...m, hours: e.target.value }))} />
                <input type="number" className="input" placeholder="Minutes" min="0" max="59" value={manualEntry.minutes} onChange={e => setManualEntry(m => ({ ...m, minutes: e.target.value }))} />
              </div>
              <input className="input" placeholder="Notes..." value={manualEntry.notes} onChange={e => setManualEntry(m => ({ ...m, notes: e.target.value }))} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={manualEntry.billable} onChange={e => setManualEntry(m => ({ ...m, billable: e.target.checked }))} className="rounded" />
                <span className="text-sm text-slate-600">Billable time</span>
              </label>
              <button type="submit" className="btn-primary w-full justify-center"><Plus size={16} /> Log Time</button>
            </form>
          </div>
        </div>
      )}

      {/* All Entries */}
      {activeTab === 'All Entries' && (
        <div className="card overflow-hidden">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Date</th><th>Project</th><th>Task</th><th>Duration</th><th>Billable</th><th>Notes</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map(entry => {
                const project = projects.find(p => p.id === entry.projectId);
                const task = tasks.find(t => t.id === entry.taskId);
                const user = users.find(u => u.id === entry.userId);
                return (
                  <tr key={entry.id}>
                    <td className="text-xs">{formatDate(entry.date, 'MMM d')}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color }} />
                        <span className="text-xs truncate max-w-[120px]">{project?.name}</span>
                      </div>
                    </td>
                    <td className="text-xs text-slate-400 truncate max-w-[120px]">{task?.title || '—'}</td>
                    <td><span className="font-semibold text-sm">{formatDuration(entry.duration)}</span></td>
                    <td>
                      {entry.billable
                        ? <span className="badge-green"><Check size={10} /> Billable</span>
                        : <span className="badge-slate">Non-billable</span>}
                    </td>
                    <td className="text-xs text-slate-400 max-w-[150px] truncate">{entry.notes || '—'}</td>
                    <td>
                      {entry.approved
                        ? <span className="badge-green">Approved</span>
                        : <span className="badge-amber">Pending</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {(activeTab === 'Daily' || activeTab === 'Weekly') && (
        <div className="card p-6">
          <h2 className="font-semibold text-slate-800 mb-4">{activeTab} Timesheet</h2>
          <div className="space-y-2">
            {timeEntries.filter(e => activeTab === 'Daily' ? e.date === today : true).slice(0, 8).map(entry => {
              const project = projects.find(p => p.id === entry.projectId);
              const hours = (entry.duration / 60).toFixed(1);
              return (
                <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-1 h-10 rounded-full" style={{ backgroundColor: project?.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-700">{project?.name}</div>
                    <div className="text-xs text-slate-400">{entry.notes || 'No notes'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">{hours}h</div>
                    <div className={`text-xs ${entry.billable ? 'text-emerald-600' : 'text-slate-400'}`}>{entry.billable ? 'Billable' : 'Non-billable'}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between">
            <span className="font-semibold text-slate-600">Total</span>
            <span className="font-bold text-slate-800">{formatDuration(timeEntries.reduce((s,e) => s + e.duration, 0))}</span>
          </div>
        </div>
      )}
    </div>
  );
}
