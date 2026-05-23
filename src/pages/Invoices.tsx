import { useState } from 'react';
import { Plus, Send, Check, AlertCircle, FileText, Download, Eye } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate, invoiceStatusColor } from '../lib/utils';
import type { InvoiceStatus } from '../types';

const STATUS_OPTIONS: { label: string; value: InvoiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
];
export default function Invoices() {
  const { invoices, clients, projects, addInvoice, updateInvoice, deleteInvoice } = useApp();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(invoices[0]?.id || null);
  const [isAdding, setIsAdding] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    projectId: projects[0]?.id || '',
    clientId: clients[0]?.id || '',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    notes: '',
    items: [{ id: '1', description: 'Product/Service', quantity: 1, unitPrice: 0 }]
  });

  const filtered = invoices.filter(i => statusFilter === 'all' || i.status === statusFilter);
  const selectedInvoice = invoices.find(i => i.id === selected);

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalSent = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = newInvoice.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
    const taxRate = 10;
    const tax = subtotal * (taxRate / 100);
    
    addInvoice({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      projectId: newInvoice.projectId,
      clientId: newInvoice.clientId,
      status: 'draft',
      lineItems: newInvoice.items.map(item => ({ ...item, amount: item.quantity * item.unitPrice })),
      subtotal,
      tax,
      taxRate,
      discount: 0,
      total: subtotal + tax,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate,
      notes: newInvoice.notes
    });
    setIsAdding(false);
    setNewInvoice({
      projectId: projects[0]?.id || '',
      clientId: clients[0]?.id || '',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: '',
      items: [{ id: '1', description: 'Product/Service', quantity: 1, unitPrice: 0 }]
    });
  };

  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          <p className="text-slate-500 text-sm">{invoices.length} total invoices</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-primary"><Plus size={16} /> New Invoice</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Collected', value: totalPaid, color: 'text-emerald-600 bg-emerald-50', icon: Check },
          { label: 'Outstanding', value: totalSent, color: 'text-blue-600 bg-blue-50', icon: Send },
          { label: 'Overdue', value: totalOverdue, color: 'text-red-600 bg-red-50', icon: AlertCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}><Icon size={16} /></div>
              <span className="text-sm text-slate-500">{label}</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(value)}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {STATUS_OPTIONS.map(f => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${statusFilter === f.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice list */}
        <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
          {filtered.map(inv => {
            const client = clients.find(c => c.id === inv.clientId);
            return (
              <div
                key={inv.id}
                onClick={() => setSelected(inv.id)}
                className={`card p-4 cursor-pointer transition-all ${selected === inv.id ? 'ring-2 ring-primary-400 shadow-card-hover' : 'hover:shadow-card-hover'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{inv.invoiceNumber}</div>
                    <div className="text-xs text-slate-400">{client?.company}</div>
                  </div>
                  <span className={`${invoiceStatusColor(inv.status)} badge capitalize`}>{inv.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-800">{formatCurrency(inv.total)}</span>
                  <span className="text-xs text-slate-400">Due {formatDate(inv.dueDate, 'MMM d')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invoice detail */}
        <div className="lg:col-span-2">
          {selectedInvoice ? (
            <div className="card p-6 min-h-[500px] flex flex-col">
              {/* Invoice header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold text-slate-800">{selectedInvoice.invoiceNumber}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`${invoiceStatusColor(selectedInvoice.status)} badge capitalize`}>{selectedInvoice.status}</span>
                    <span className="text-sm text-slate-400">Issued {formatDate(selectedInvoice.issueDate)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary btn-sm"><Download size={14} /> PDF</button>
                  {selectedInvoice.status === 'draft' && <button className="btn-primary btn-sm"><Send size={14} /> Send Invoice</button>}
                </div>
              </div>

              {/* From/To */}
              <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-2">From</div>
                  <div className="font-semibold text-slate-800 text-sm">Agency OS</div>
                  <div className="text-xs text-slate-500">finance@agencyos.com</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Bill To</div>
                  <div className="font-semibold text-slate-800 text-sm">{clients.find(c => c.id === selectedInvoice.clientId)?.company}</div>
                  <div className="text-xs text-slate-500">{clients.find(c => c.id === selectedInvoice.clientId)?.email}</div>
                </div>
              </div>

              {/* Line items */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm mb-4">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-2 py-2 text-left text-xs font-semibold text-slate-400 uppercase">Description</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold text-slate-400 uppercase">Qty</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold text-slate-400 uppercase">Price</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold text-slate-400 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedInvoice.lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-2 py-3 text-slate-700">{item.description}</td>
                        <td className="px-2 py-3 text-right text-slate-600">{item.quantity}</td>
                        <td className="px-2 py-3 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-2 py-3 text-right font-semibold text-slate-800">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <div className="w-56 space-y-2">
                  <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>{formatCurrency(selectedInvoice.subtotal)}</span></div>
                  <div className="flex justify-between text-sm text-slate-500"><span>Tax ({selectedInvoice.taxRate}%)</span><span>{formatCurrency(selectedInvoice.tax)}</span></div>
                  <div className="flex justify-between font-bold text-lg text-slate-800 pt-2 border-t border-slate-200">
                    <span>Total</span><span>{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-2 border-t border-slate-100 pt-6">
                {selectedInvoice.status === 'draft' && (
                  <button onClick={() => updateInvoice(selectedInvoice.id, { status: 'sent' })} className="btn-primary flex-1">Mark as Sent</button>
                )}
                {selectedInvoice.status === 'sent' && (
                  <button onClick={() => updateInvoice(selectedInvoice.id, { status: 'paid' })} className="btn-primary flex-1 border-emerald-600 bg-emerald-600 hover:bg-emerald-700">Mark as Paid</button>
                )}
                <button onClick={() => { if(confirm('Delete invoice?')) deleteInvoice(selectedInvoice.id); }} className="btn-secondary text-red-600 border-red-100 hover:bg-red-50 px-3">Delete</button>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-full min-h-[500px]">
              <div className="text-center text-slate-400">
                <FileText size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-medium">No invoice selected</p>
                <p className="text-xs">Select an invoice from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Invoice Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-fade-in p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Create Invoice</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Project</label>
                  <select className="select" value={newInvoice.projectId} onChange={e => setNewInvoice(p => ({ ...p, projectId: e.target.value }))}>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Client</label>
                  <select className="select" value={newInvoice.clientId} onChange={e => setNewInvoice(p => ({ ...p, clientId: e.target.value }))}>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="label mb-0">Line Items</label>
                  <button type="button" onClick={addItem} className="text-xs text-primary-600 font-bold hover:text-primary-700">+ Add Item</button>
                </div>
                {newInvoice.items.map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">
                      <input className="input text-sm" placeholder="Description" value={item.description} onChange={e => {
                        const items = [...newInvoice.items];
                        items[idx].description = e.target.value;
                        setNewInvoice(p => ({ ...p, items }));
                      }} />
                    </div>
                    <div className="col-span-2">
                      <input type="number" className="input text-sm" placeholder="Qty" value={item.quantity} onChange={e => {
                        const items = [...newInvoice.items];
                        items[idx].quantity = parseInt(e.target.value) || 0;
                        setNewInvoice(p => ({ ...p, items }));
                      }} />
                    </div>
                    <div className="col-span-4">
                      <input type="number" className="input text-sm" placeholder="Price" value={item.unitPrice} onChange={e => {
                        const items = [...newInvoice.items];
                        items[idx].unitPrice = parseInt(e.target.value) || 0;
                        setNewInvoice(p => ({ ...p, items }));
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="label">Due Date</label>
                <input type="date" className="input" value={newInvoice.dueDate} onChange={e => setNewInvoice(p => ({ ...p, dueDate: e.target.value }))} />
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
