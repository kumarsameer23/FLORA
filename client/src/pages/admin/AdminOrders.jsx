import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAPI } from '../../services/api';
import { AdminWrapper } from './AdminDashboard';
import toast from 'react-hot-toast';
import { HiSearch } from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';
import { motion } from 'framer-motion';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, page],
    queryFn: () => orderAPI.getAll({ search, status: statusFilter, page, limit: 20 }).then(r => r.data),
    staleTime: 1 * 60 * 1000,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => orderAPI.updateStatus(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-orders']); toast.success('Status updated'); },
    onError: () => toast.error('Update failed'),
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination || {};

  return (
    <>
      <Helmet><title>Orders — FLORA Admin</title></Helmet>
      <AdminWrapper active="/admin/orders" title="Orders">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-sage)' }} size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="input-flora pl-10 w-64" />
          </div>
          <div className="flex gap-2">
            {['', ...statusFlow, 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`filter-pill text-xs ${statusFilter === s ? 'active' : ''}`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--color-mist)' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--color-mist)', background: 'var(--color-cream)' }}>
                  {['Order #', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-sage)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={7} className="py-3 px-4"><div className="skeleton h-10 rounded" /></td></tr>)
                  : orders.map(order => (
                    <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="border-b hover:bg-mist/20 transition-colors" style={{ borderColor: 'var(--color-mist)' }}>
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{order.customer?.name || order.user?.name || 'Guest'}</p>
                        <p className="text-xs" style={{ color: 'var(--color-sage)' }}>{order.customer?.phone || ''}</p>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--color-sage)' }}>{order.items?.length} item(s)</td>
                      <td className="py-3 px-4 text-sm font-bold" style={{ color: 'var(--color-forest)' }}>₹{order.total}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--color-sage)' }}>{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || ''}`}>{order.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={e => updateStatus.mutate({ id: order._id, status: e.target.value })}
                          className="text-xs border rounded-lg px-2 py-1 focus:outline-none"
                          style={{ borderColor: 'var(--color-mist)', color: 'var(--color-ink)' }}
                        >
                          {[...statusFlow, 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </motion.tr>
                  ))
                }
              </tbody>
            </table>
            {!isLoading && orders.length === 0 && (
              <div className="text-center py-16" style={{ color: 'var(--color-sage)' }}>No orders found</div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm ${p === page ? 'text-ink' : 'bg-white text-sage border border-mist hover:bg-mist'}`}
                style={p === page ? { background: 'var(--color-gold)' } : {}}>
                {p}
              </button>
            ))}
          </div>
        )}
      </AdminWrapper>
    </>
  );
}
