import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { USERS } from '../data/mockData';

const DEMO_ACCOUNTS = [
  { label: 'Agency Owner', email: 'admin@agency.com', role: 'Full access' },
  { label: 'Project Manager', email: 'pm@agency.com', role: 'Projects & reports' },
  { label: 'Team Member', email: 'dev@agency.com', role: 'Tasks & time' },
];

export default function Login() {
  const [email, setEmail] = useState('admin@agency.com');
  const [password, setPassword] = useState('demo');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      const user = USERS.find(u => u.email === email);
      if (user?.role === 'client') navigate('/portal');
      else navigate('/dashboard');
    } else {
      setError('No account found with that email.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AgencyOS</h1>
          <p className="text-primary-200 mt-1">Project management for agencies</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          {/* Demo accounts */}
          <div className="mb-5">
            <p className="text-xs text-primary-200 mb-2 font-semibold uppercase tracking-wide">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => setEmail(acc.email)}
                  className={`p-2 rounded-xl border text-center transition-all text-xs ${
                    email === acc.email
                      ? 'bg-primary-500 border-primary-400 text-white'
                      : 'bg-white/10 border-white/20 text-primary-100 hover:bg-white/20'
                  }`}
                >
                  <div className="font-semibold">{acc.label}</div>
                  <div className="opacity-70 mt-0.5 hidden sm:block">{acc.role}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary-200 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-primary-300 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-all"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary-200 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-primary-300 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-all pr-12"
                  placeholder="Any password (demo)"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 disabled:opacity-70 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-primary-300 mt-4 text-center">
            Client?{' '}
            <a href="/client-login" className="text-primary-200 underline hover:text-white">Access Client Portal</a>
          </p>
        </div>
      </div>
    </div>
  );
}
