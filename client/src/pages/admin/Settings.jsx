import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { authService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Lock, CheckCircle } from 'lucide-react';

export default function Settings() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError(t('admin.passwordMismatch'));
      return;
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(t('admin.passwordChanged'));
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{t('admin.settings')}</h1>
        <p className="text-gray-500 text-sm">Manage your account settings</p>
      </div>

      <div className="max-w-md">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-bold text-white text-lg">{t('admin.changePassword')}</h2>
          </div>

          {success && (
            <div className="flex items-center gap-2 bg-green-900/30 border border-green-700 text-green-400 rounded-xl px-4 py-3 text-sm mb-4">
              <CheckCircle className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('admin.currentPassword')}</label>
              <input
                type="password" name="currentPassword" value={form.currentPassword}
                onChange={handleChange} required
                className="input-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('admin.newPassword')}</label>
              <input
                type="password" name="newPassword" value={form.newPassword}
                onChange={handleChange} required minLength={6}
                className="input-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t('admin.confirmPassword')}</label>
              <input
                type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} required minLength={6}
                className="input-dark"
              />
            </div>
            <button
              type="submit" disabled={isSubmitting}
              className="btn-primary w-full py-3 disabled:opacity-60"
            >
              {isSubmitting ? '...' : t('admin.updatePassword')}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
