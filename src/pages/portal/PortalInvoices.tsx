import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, Download, CreditCard, Clock, 
  ExternalLink, Search, Filter, CheckCircle2,
  AlertCircle, ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { useState } from 'react';

export default function PortalInvoices() {
  const { currentUser } = useAuth();
  const { invoices } = useApp();
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  const clientInvoices = invoices.filter(i => i.clientId === currentUser?.clientId);
  const filteredInvoices = clientInvoices.filter(i => {
    if (filter === 'unpaid') return i.status !== 'paid';
    if (filter === 'paid') return i.status === 'paid';
    return true;
  });

  const totalUnpaid = clientInvoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-slate-500 mt-1">Manage your payments, view history, and download invoices.</p>
        </div>
        <div className="card bg-primary-600 border-none p-4 px-6 flex items-center gap-6 shadow-xl shadow-primary-200">
           <div>
             <div className="text-xs font-bold text-primary-200 uppercase tracking-widest mb-1">Total Outstanding</div>
             <div className="text-2xl font-black text-white">{formatCurrency(totalUnpaid)}</div>
           </div>
           <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all group">
             <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'All', count: clientInvoices.length, id: 'all' },
          { label: 'Unpaid', count: clientInvoices.filter(i => i.status !== 'paid').length, id: 'unpaid' },
          { label: 'Paid', count: clientInvoices.filter(i => i.status === 'paid').length, id: 'paid' },
        ].map(f => (
          <button 
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={cn(
              "card p-4 flex items-center justify-between transition-all",
              filter === f.id ? "border-primary-200 bg-primary-50/30 ring-1 ring-primary-100" : "hover:bg-slate-50 border-slate-100"
            )}
          >
            <span className={cn("font-bold text-sm", filter === f.id ? "text-primary-600" : "text-slate-500")}>{f.label}</span>
            <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black", filter === f.id ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-400")}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search invoice #, description..." 
            className="input pl-10 h-11"
          />
        </div>
        <button className="btn-secondary h-11 px-6">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="card overflow-hidden border-slate-100 shadow-sm bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Issued</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{invoice.invoiceNumber}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Project Payment</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-slate-600 font-medium">{formatDate(invoice.issueDate, 'MMM d, yyyy')}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {invoice.status === 'overdue' ? <AlertCircle size={14} className="text-red-500" /> : <Clock size={14} className="text-slate-400" />}
                    <span className={cn("text-sm font-medium", invoice.status === 'overdue' ? "text-red-600" : "text-slate-600")}>
                      {formatDate(invoice.dueDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-black text-slate-800">
                  {formatCurrency(invoice.total)}
                </td>
                <td className="px-6 py-5">
                  <div className={cn(
                    "badge inline-flex items-center gap-1.5",
                    invoice.status === 'paid' ? "badge-emerald" : 
                    invoice.status === 'overdue' ? "badge-red" : "badge-blue"
                  )}>
                    {invoice.status === 'paid' && <CheckCircle2 size={10} />}
                    {invoice.status.toUpperCase()}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-lg transition-colors inline-flex items-center gap-2 font-bold text-xs">
                    PDF <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                  <FileText size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-slate-500">No invoices found for this period.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Methods (Visual Only) */}
      <div className="card-glass p-8 border-dashed border-2 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-tight">Setup Automatic Payments</h4>
            <p className="text-sm text-slate-500">Enable auto-pay to streamline your billing cycle.</p>
          </div>
        </div>
        <button className="btn-primary px-8">
          Add Payment Method
          <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  );
}
