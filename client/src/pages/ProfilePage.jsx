import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineHeart, HiOutlineShoppingBag, HiLogout, HiPencil } from 'react-icons/hi';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ['me'],
    queryFn: () => authAPI.getMe().then(r => r.data.user),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out. See you soon! 🌿');
    navigate('/');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name, phone });
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (_) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center pt-20 px-4" style={{ background: 'var(--color-cream)' }}>
        <div className="text-6xl mb-4">🌿</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-3xl mb-3">Please Login</h1>
        <Link to="/login" className="btn btn-forest">Login to your account</Link>
      </div>
    );
  }

  const currentUser = userData || user;

  return (
    <>
      <Helmet><title>My Profile — FLORA</title></Helmet>
      <div className="min-h-screen pt-20" style={{ background: 'var(--color-cream)' }}>
        <div className="section-pad-sm" style={{ background: 'var(--color-forest)' }}>
          <div className="container-flora flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-label text-white/50 mb-2">Account</p>
              <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl font-bold text-white">
                Hello, <em className="italic font-normal" style={{ color: 'var(--color-mint)' }}>{currentUser?.name?.split(' ')[0]}</em>
              </h1>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
              <HiLogout size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="container-flora py-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
            {/* Profile Card */}
            <div className="md:col-span-2 bg-white rounded-2xl p-7 border shadow-sm" style={{ borderColor: 'var(--color-mist)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-xl font-bold">Personal Information</h2>
                <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-moss)' }}>
                  <HiPencil size={16} /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Full Name</label>
                    <input className="input-flora" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Phone</label>
                    <input className="input-flora" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <button onClick={handleSave} disabled={loading} className="btn btn-forest">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    ['Name', currentUser?.name],
                    ['Email', currentUser?.email],
                    ['Phone', currentUser?.phone || '—'],
                    ['Member Since', new Date(currentUser?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: 'var(--color-mist)' }}>
                      <span className="text-sm" style={{ color: 'var(--color-sage)' }}>{label}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <Link to="/wishlist" className="flex items-center gap-4 p-5 rounded-xl bg-white border shadow-sm hover:shadow-md transition-all" style={{ borderColor: 'var(--color-mist)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-mist)' }}>
                  <HiOutlineHeart style={{ color: 'var(--color-moss)' }} size={20} />
                </div>
                <div>
                  <div className="font-medium text-sm" style={{ color: 'var(--color-ink)' }}>My Wishlist</div>
                  <div className="text-xs" style={{ color: 'var(--color-sage)' }}>{currentUser?.wishlist?.length || 0} plants saved</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
