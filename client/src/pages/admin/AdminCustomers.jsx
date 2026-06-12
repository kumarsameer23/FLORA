import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import { AdminWrapper } from './AdminDashboard';
import { HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import { motion } from 'framer-motion';

export default function AdminCustomers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => adminAPI.getUsers({ search, limit: 50 }).then(r => r.data),
    staleTime: 2 * 60 * 1000,
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => adminAPI.toggleUser(id),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('User status updated'); },
  });

  const users = data?.users || [];

  return (
    <>
      <Helmet><title>Customers — FLORA Admin</title></Helmet>
      <AdminWrapper active="/admin/customers" title="Customers">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-sage)' }} size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="input-flora pl-10 w-64" />
          </div>
          <p className="text-sm" style={{ color: 'var(--color-sage)' }}>{data?.total || 0} total customers</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--color-mist)' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--color-mist)', background: 'var(--color-cream)' }}>
                  {['Customer', 'Email', 'Phone', 'Joined', 'Wishlist', 'Status', 'Action'].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-sage)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={7} className="py-3 px-4"><div className="skeleton h-10 rounded" /></td></tr>)
                  : users.map(user => (
                    <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="border-b hover:bg-mist/20 transition-colors" style={{ borderColor: 'var(--color-mist)' }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${user.name}&background=2a5c3f&color=fff&size=40`} alt="" className="w-8 h-8 rounded-full" />
                          <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--color-sage)' }}>{user.email}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--color-sage)' }}>{user.phone || '—'}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--color-sage)' }}>{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--color-sage)' }}>{user.wishlist?.length || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleMutation.mutate(user._id)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {user.isActive ? 'Block' : 'Activate'}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                }
              </tbody>
            </table>
            {!isLoading && users.length === 0 && (
              <div className="text-center py-16" style={{ color: 'var(--color-sage)' }}>No customers found</div>
            )}
          </div>
        </div>
      </AdminWrapper>
    </>
  );
}
