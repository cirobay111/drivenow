import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';
import config from '../../config/config';
import {
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
} from '../../services/reservationStore';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_STYLES = {
  pending:   'bg-yellow-900/40 text-yellow-400 border border-yellow-800',
  confirmed: 'bg-green-900/40  text-green-400  border border-green-800',
  completed: 'bg-blue-900/40   text-blue-400   border border-blue-800',
  cancelled: 'bg-red-900/40    text-red-400    border border-red-800',
};

export default function ManageBookings() {
  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { currency } = config;

  const load = () => setReservations(getAllReservations());

  useEffect(() => { load(); }, []);

  // Client-side filter + search
  const filtered = useMemo(() => {
    let list = reservations;
    if (filterStatus) list = list.filter(r => r.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.customer_name?.toLowerCase().includes(q) ||
        r.customer_phone?.toLowerCase().includes(q) ||
        r.customer_email?.toLowerCase().includes(q) ||
        r.car_brand?.toLowerCase().includes(q) ||
        r.car_model?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reservations, filterStatus, search]);

  const handleStatusChange = (id, status) => {
    updateReservationStatus(id, status);
    load();
  };

  const handleDelete = (id) => {
    deleteReservation(id);
    setConfirmDelete(null);
    load();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reservations</h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} of {reservations.length} reservation{reservations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search + Status filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name, phone, email or car..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-9 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all whitespace-nowrap
              ${filterStatus === s
                ? 'bg-accent text-black border-accent'
                : 'border-[#2A2A2A] text-gray-500 hover:border-accent hover:text-accent'}`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {reservations.length === 0 ? (
        <div className="card p-16 text-center text-gray-500">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium text-gray-400">No reservations yet</p>
          <p className="text-sm text-gray-600 mt-1">
            They'll appear here when customers submit the booking form.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-400">No results for your search / filter.</p>
          <button
            onClick={() => { setSearch(''); setFilterStatus(''); }}
            className="btn-outline mt-4 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0A0A0A] border-b border-[#2A2A2A]">
                <tr>
                  {['#', 'Customer', 'Car', 'Dates', 'Location', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-[#111] transition-colors">
                    {/* ID */}
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      #{String(r.id).slice(-6)}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{r.customer_name}</p>
                      <p className="text-gray-500 text-xs">{r.customer_email}</p>
                      <p className="text-gray-500 text-xs">{r.customer_phone}</p>
                    </td>

                    {/* Car */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.car_image && (
                          <img
                            src={r.car_image}
                            alt={r.car_model}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <p className="font-medium text-white whitespace-nowrap">
                          {r.car_brand} {r.car_model}
                        </p>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      <p>📅 {r.pickup_date}</p>
                      <p>📅 {r.return_date}</p>
                      <p className="text-gray-600">{r.total_days} day{r.total_days !== 1 ? 's' : ''}</p>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px]">
                      <span className="truncate block">{r.pickup_location}</span>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 font-bold text-accent whitespace-nowrap">
                      {currency}{r.total_price?.toFixed(2)}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[r.status] || 'bg-[#1A1A1A] text-gray-500'}`}>
                        {r.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={r.status}
                          onChange={e => handleStatusChange(r.id, e.target.value)}
                          className="text-xs bg-[#0D0D0D] border border-[#2A2A2A] text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-accent cursor-pointer"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setConfirmDelete(r.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded"
                          title="Delete reservation"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="card p-6 max-w-sm w-full text-center">
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className="text-lg font-bold text-white mb-2">Delete Reservation?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 btn-outline text-sm py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white rounded-xl text-sm py-2 font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
