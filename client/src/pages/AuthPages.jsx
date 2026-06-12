import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function AuthInput({ label, error, showToggle, onToggle, type, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>{label}</label>
      <div className="relative">
        <input
          type={type}
          className={`input-flora ${error ? 'border-red-400' : ''}`}
          {...props}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-sage)' }}>
            {type === 'password' ? <HiEye size={18} /> : <HiEyeOff size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 🌿`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your FLORA account">
      <Helmet><title>Login — FLORA</title></Helmet>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput label="Email Address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <AuthInput label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••" error={errors.password?.message} showToggle onToggle={() => setShowPw(v => !v)} {...register('password')} />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--color-moss)' }}>Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn btn-forest w-full justify-center mt-2">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm mt-5" style={{ color: 'var(--color-sage)' }}>
        New to FLORA? <Link to="/signup" className="font-medium hover:underline" style={{ color: 'var(--color-moss)' }}>Create account</Link>
      </p>
    </AuthLayout>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const res = await authAPI.register(payload);
      setAuth(res.data.user, res.data.token);
      toast.success('Account created! Welcome to FLORA 🌿');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join FLORA" subtitle="Create your account and start your plant journey">
      <Helmet><title>Sign Up — FLORA</title></Helmet>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput label="Full Name" type="text" placeholder="Your name" error={errors.name?.message} {...register('name')} />
        <AuthInput label="Email Address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <AuthInput label="Phone (optional)" type="tel" placeholder="+91 98765 43210" error={errors.phone?.message} {...register('phone')} />
        <AuthInput label="Password" type={showPw ? 'text' : 'password'} placeholder="Min 6 characters" error={errors.password?.message} showToggle onToggle={() => setShowPw(v => !v)} {...register('password')} />
        <AuthInput label="Confirm Password" type={showPw ? 'text' : 'password'} placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <button type="submit" disabled={loading} className="btn btn-forest w-full justify-center mt-2">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm mt-5" style={{ color: 'var(--color-sage)' }}>
        Already have an account? <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--color-moss)' }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-cream)' }}>
      {/* Left panel - image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=900&q=85"
          alt="Plants"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(22,51,32,0.9), rgba(13,26,15,0.6))' }} />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-mint), var(--color-moss))' }}>
              <FaLeaf className="text-white" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl font-black tracking-widest text-white">
              FLORA<span style={{ color: 'var(--color-gold)' }}>.</span>
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)' }} className="text-white text-3xl font-normal italic mb-3">
            Where Every Leaf Tells a Story
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Premium plants for every home. Grown with love, delivered with care, supported for life.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-moss)' }}>
              <FaLeaf className="text-white text-sm" />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-xl font-black tracking-widest">
              FLORA<span style={{ color: 'var(--color-gold)' }}>.</span>
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-sage)' }}>{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
