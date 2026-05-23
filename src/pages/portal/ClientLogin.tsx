import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ClientLogin() {
  const [email, setEmail] = useState('client@example.com');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    login(email, 'password');
    navigate('/portal');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary-200 mb-6 rotate-3">
             <Zap size={40} className="fill-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Agency <span className="text-primary-600">Portal</span></h1>
          <p className="text-slate-500 font-medium">Access your projects, invoices, and assets in one place.</p>
        </div>

        {/* Card */}
        <div className="card-glass p-10 bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Company Email</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-300" 
                  placeholder="e.g. client@company.com"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-3 active:scale-95 group">
              Access Portal
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-3 grayscale opacity-30">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Secure Client Access</span>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Not a client? <button onClick={() => navigate('/login')} className="text-primary-600 font-bold hover:underline">Staff Login</button>
        </p>
      </div>
    </div>
  );
}
