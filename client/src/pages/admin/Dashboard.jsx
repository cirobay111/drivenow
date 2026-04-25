import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import config from '../../config/config';
import { carService } from '../../services/api';
import { getAllReservations, getStats } from '../../services/reservationStore';

const STATUS_STYLES = {
  pending:   'bg-yellow-900/40 text-yellow-400 border border-yellow-800',
  confirmed: 'bg-green-900/40  text-green-400  border border-green-800',
  completed: 'bg-blue-900/40   text-blue-400   border border-blue-800',
  cancelled: 'bg-red-900/40    text-red-400    border border-red-800',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const { currency } = config;

  const load = useCallback(async () => {
    let cars = [];
    try {
      const res = await carService.getAll();
      cars = res.data.data || [];
    } catch {
      cars = [];
    }
    setStats(getStats(cars));
    setRecent(getAllReservations().slice(0, 5));
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, [load]);

  if (!stats) return null;

  const statCards = [
    { icon: '📋', label: 'Total Reservations', value: stats.totalReservations, color: 'bg-purple-900/40 text-purple-400' },
    { icon: '💰', label: 'Revenue',             value: `${currency}${stats.totalRevenue.toFixed(2)}`, color: 'bg-green-900/40 text-green-400' },
    { icon: '🚗', label: 'Available Cars',       value: stats.availableCars,    color: 'bg-blue-900/40 text-blue-400'   },
    { icon: '🆕', label: 'New Today',            value: stats.newToday,         color: 'bg-accent/20 text-accent'       },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's your overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ icon, label, value, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
            <div>
              <p className="text-gray-500 text-xs font-medium">{label}</p>
              <p className="text-white font-bold text-2xl">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="card p-6">
          <h2 className="font-bold text-white text-lg mb-4">Reservations by Status</h2>
          {stats.totalReservations === 0 ? (
            <p className="text-gray-600 text-sm">No reservations yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.byStatus.map(({ status, count }) => {
                const pct = stats.totalReservations > 0
                  ? Math.round((count / stats.totalReservations) * 100) : 0;
                const barColor = {
                  pending: 'bg-yellow-400', confirmed: 'bg-green-400',
                  completed: 'bg-blue-400',  cancelled: 'bg-red-400',
                }[status];
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium text-gray-400">{status}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent reservations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-lg">Recent Reservations</h2>
            <Link to="/admin/bookings" className="text-accent text-xs hover:underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500 text-sm">No reservations yet.</p>
              <p className="text-gray-600 text-xs mt-1">They'll appear here when customers book cars.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#1A1A1A] last:border-0">
                  <div>
                    <p className="font-medium text-sm text-white">{r.customer_name}</p>
                    <p className="text-xs text-gray-500">{r.car_brand} {r.car_model} · {r.pickup_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent text-sm">{currency}{r.total_price}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.status] || 'bg-[#1A1A1A] text-gray-500'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
