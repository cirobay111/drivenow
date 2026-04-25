import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2 group">
            <img
              src={config.company.logo}
              alt={config.company.name}
              className="h-16 w-16 object-contain transition-transform duration-200 group-hover:scale-105"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-2xl font-bold tracking-widest text-white">{config.company.name}</span>
            <span className="text-[10px] tracking-[0.3em] text-accent uppercase">{config.company.tagline}</span>
          </Link>
          <p className="text-gray-600 mt-4 text-sm">Admin Dashboard</p>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder={config.admin.email} className="input-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="••••••••" className="input-dark"
              />
            </div>
            <button
              type="submit" disabled={isLoading}
              className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-accent text-sm transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
