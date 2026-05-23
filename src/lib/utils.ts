import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatDate(dateStr: string, fmt = 'MMM d, yyyy'): string {
  try { return format(parseISO(dateStr), fmt); } catch { return dateStr; }
}

export function formatRelative(dateStr: string): string {
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); } catch { return dateStr; }
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function budgetPercent(spent: number, budget: number): number {
  if (!budget) return 0;
  return Math.min(Math.round((spent / budget) * 100), 100);
}

export function budgetColor(pct: number): string {
  if (pct >= 100) return '#ef4444';
  if (pct >= 90)  return '#f97316';
  if (pct >= 75)  return '#f59e0b';
  return '#10b981';
}

export function healthColor(health: string): string {
  switch (health) {
    case 'on_track':   return 'text-emerald-600 bg-emerald-50';
    case 'at_risk':    return 'text-amber-600 bg-amber-50';
    case 'over_budget':return 'text-red-600 bg-red-50';
    default: return 'text-slate-600 bg-slate-100';
  }
}

export function healthLabel(health: string): string {
  switch (health) {
    case 'on_track':   return 'On Track';
    case 'at_risk':    return 'At Risk';
    case 'over_budget':return 'Over Budget';
    default: return health;
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'active':    return 'badge-green';
    case 'planning':  return 'badge-blue';
    case 'on_hold':   return 'badge-amber';
    case 'completed': return 'badge-slate';
    case 'archived':  return 'badge-slate';
    default: return 'badge-slate';
  }
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'low':      return 'priority-low';
    case 'medium':   return 'priority-medium';
    case 'high':     return 'priority-high';
    case 'critical': return 'priority-critical';
    default: return 'priority-low';
  }
}

export function invoiceStatusColor(status: string): string {
  switch (status) {
    case 'paid':    return 'badge-green';
    case 'sent':    return 'badge-blue';
    case 'overdue': return 'badge-red';
    case 'draft':   return 'badge-slate';
    default: return 'badge-slate';
  }
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function elapsedToDisplay(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}
