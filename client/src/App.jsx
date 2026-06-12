import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ScrollToHash from './components/layout/ScrollToHash';

// Lazy loaded pages
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.SignupPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">🌿</div>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--color-moss)' }} />
      </div>
    </div>
  );
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout><PageTransition><HomePage /></PageTransition></MainLayout>} />
        <Route path="/shop" element={<MainLayout><Suspense fallback={<PageLoader />}><PageTransition><ShopPage /></PageTransition></Suspense></MainLayout>} />
        <Route path="/product/:slug" element={<MainLayout><Suspense fallback={<PageLoader />}><PageTransition><ProductDetailPage /></PageTransition></Suspense></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Suspense fallback={<PageLoader />}><PageTransition><ProfilePage /></PageTransition></Suspense></MainLayout>} />

        <Route path="/contact" element={<MainLayout><Suspense fallback={<PageLoader />}><PageTransition><ContactPage /></PageTransition></Suspense></MainLayout>} />
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<PageLoader />}><SignupPage /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
        <Route path="/admin/products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
        <Route path="/admin/orders" element={<Suspense fallback={<PageLoader />}><AdminOrders /></Suspense>} />
        <Route path="/admin/customers" element={<Suspense fallback={<PageLoader />}><AdminCustomers /></Suspense>} />
        <Route path="*" element={
          <MainLayout>
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20" style={{ background: 'var(--color-cream)' }}>
              <div className="text-7xl mb-6">🌱</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-5xl font-bold mb-3">404</h1>
              <p style={{ color: 'var(--color-sage)' }} className="text-lg mb-8">This page seems to have wilted away.</p>
              <a href="/" className="btn btn-gold">Back to Home</a>
            </div>
          </MainLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 2 * 60 * 1000, gcTime: 5 * 60 * 1000 },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToHash />
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-ink)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                borderRadius: '8px',
              },
              success: { iconTheme: { primary: '#8ec9a2', secondary: '#0d1a0f' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
