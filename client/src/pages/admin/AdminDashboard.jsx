import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { adminAPI, productAPI, orderAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { formatPrice } from '../../utils/helpers';
import {
  HiOutlineUsers, HiOutlineShoppingBag, HiOutlineCube,
  HiOutlineCurrencyRupee, HiMenu, HiX, HiOutlineLogout,
} from 'react-icons/hi';
import { FaLeaf } from 'react-icons/fa';
import toast from 'react-hot-toast';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border shadow-sm"
      style={{ borderColor: '#e8f2eb' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm" style={{ color: 'var(--color-ink)' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--color-sage)' }}>{sub}</div>}
    </motion.div>
  );
}

function AdminSidebar({ active, onClose }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '🌿' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--color-ink)' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-mint), var(--color-moss))' }}>
            <FaLeaf className="text-white text-sm" />
          </div>
          <span style={{ fontFamily: 'var(--font-serif)' }} className="text-xl font-black tracking-widest text-white">
            FLORA<span style={{ color: 'var(--color-gold)' }}>.</span>
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--color-sage)' }}>Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              active === link.href
                ? 'text-ink font-medium'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            style={active === link.href ? { background: 'var(--color-gold)', color: 'var(--color-ink)' } : {}}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white text-sm rounded-xl hover:bg-white/5 transition-all">
          🌐 View Website
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 text-sm rounded-xl hover:bg-white/5 transition-all w-full">
          <HiOutlineLogout size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

function AdminWrapper({ children, active, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-cream)' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0">
        <AdminSidebar active={active} onClose={() => {}} />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex-shrink-0">
            <AdminSidebar active={active} onClose={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-ink/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--color-mist)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: 'var(--color-sage)' }}>
              <HiMenu size={22} />
            </button>
            <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=2a5c3f&color=fff`}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--color-ink)' }}>{user?.name}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboard().then(r => r.data),
    staleTime: 2 * 60 * 1000,
  });

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];

  return (
    <>
      <Helmet><title>Admin Dashboard — FLORA</title></Helmet>
      <AdminWrapper active="/admin" title="Dashboard">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<HiOutlineCurrencyRupee size={22} />} label="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} color="#c9a84c" />
              <StatCard icon={<HiOutlineShoppingBag size={22} />} label="Total Orders" value={stats.totalOrders || 0} sub={`${stats.ordersThisMonth || 0} this month`} color="#2a5c3f" />
              <StatCard icon={<HiOutlineCube size={22} />} label="Products" value={stats.totalProducts || 0} sub={`${stats.lowStockProducts || 0} low stock`} color="#5a8a6a" />
              <StatCard icon={<HiOutlineUsers size={22} />} label="Customers" value={stats.totalUsers || 0} sub={`+${stats.newUsersThisMonth || 0} this month`} color="#8ec9a2" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e8f2eb' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="font-bold text-lg mb-4">Recent Orders</h3>
                {recentOrders.length === 0 ? (
                  <p style={{ color: 'var(--color-sage)' }} className="text-sm">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map(order => (
                      <div key={order._id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--color-mist)' }}>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{order.orderNumber}</p>
                          <p className="text-xs" style={{ color: 'var(--color-sage)' }}>{order.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: 'var(--color-forest)' }}>₹{order.total}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e8f2eb' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="font-bold text-lg mb-4">Top Products</h3>
                {topProducts.length === 0 ? (
                  <p style={{ color: 'var(--color-sage)' }} className="text-sm">No products yet</p>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => (
                      <div key={p._id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--color-mist)' }}>
                        <span className="text-sm font-bold w-6" style={{ color: 'var(--color-gold)' }}>#{i + 1}</span>
                        <img src={p.thumbnail} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>{p.name}</p>
                          <p className="text-xs" style={{ color: 'var(--color-sage)' }}>{p.orderCount} orders</p>
                        </div>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-forest)' }}>₹{p.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Add Product', href: '/admin/products', icon: '🌿', color: 'var(--color-moss)' },
                { label: 'View Orders', href: '/admin/orders', icon: '📦', color: 'var(--color-gold)' },
                { label: 'Customers', href: '/admin/customers', icon: '👥', color: 'var(--color-sage)' },
                { label: 'View Site', href: '/', icon: '🌐', color: 'var(--color-mint)' },
              ].map(action => (
                <Link key={action.href} to={action.href}
                  className="bg-white border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all text-center"
                  style={{ borderColor: 'var(--color-mist)' }}>
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </AdminWrapper>
    </>
  );
}

export { AdminWrapper };
