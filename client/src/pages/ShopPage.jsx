import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineFilter, HiX, HiViewGrid, HiViewList, HiChevronDown } from 'react-icons/hi';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import { FaWhatsapp } from 'react-icons/fa';
import { getWAEnquiryLink } from '../utils/helpers';

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' },
];

function FilterAccordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b py-1" style={{ borderColor: 'var(--color-mist)' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left cursor-pointer group"
      >
        <span className="text-xs font-semibold uppercase tracking-widest transition-colors group-hover:text-gold" style={{ color: 'var(--color-ink)' }}>
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: 'var(--color-sage)' }}
        >
          <HiChevronDown size={16} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="overflow-hidden"
      >
        <div className="pb-5 pt-0.5">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function FilterSidebar({ filters, onFilterChange, categories, onClose }) {
  const { category, placement, airPurifying, petFriendly, difficulty, minPrice, maxPrice } = filters;

  // Compute active filters
  const activeFilters = [];
  if (category) {
    const catObj = categories.find(c => c.slug === category || c._id === category);
    activeFilters.push({ label: catObj ? catObj.name : category, type: 'category' });
  }
  if (placement) activeFilters.push({ label: `Placement: ${placement}`, type: 'placement' });
  if (airPurifying === 'true') activeFilters.push({ label: '💨 Air Purifying', type: 'airPurifying' });
  if (petFriendly === 'true') activeFilters.push({ label: '🐾 Pet Friendly', type: 'petFriendly' });
  if (difficulty) activeFilters.push({ label: `Care: ${difficulty}`, type: 'difficulty' });
  if (minPrice) activeFilters.push({ label: `Min ₹${minPrice}`, type: 'minPrice' });
  if (maxPrice) activeFilters.push({ label: `Max ₹${maxPrice}`, type: 'maxPrice' });

  const handleRemoveFilter = (type) => {
    if (type === 'category') onFilterChange({ category: '' });
    else if (type === 'placement') onFilterChange({ placement: '' });
    else if (type === 'airPurifying') onFilterChange({ airPurifying: '' });
    else if (type === 'petFriendly') onFilterChange({ petFriendly: '' });
    else if (type === 'difficulty') onFilterChange({ difficulty: '' });
    else if (type === 'minPrice') onFilterChange({ minPrice: '' });
    else if (type === 'maxPrice') onFilterChange({ maxPrice: '' });
  };

  const handleResetAll = () => {
    onFilterChange({
      category: '',
      placement: '',
      airPurifying: '',
      petFriendly: '',
      difficulty: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="h-full overflow-y-auto" style={{ padding: '1.5rem 1.75rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: 'var(--color-mist)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-xl font-bold">
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {activeFilters.length > 0 && (
            <button
              onClick={handleResetAll}
              className="text-xs font-semibold uppercase tracking-wider hover:underline cursor-pointer"
              style={{ color: 'var(--color-gold)' }}
            >
              Clear All
            </button>
          )}
          <button onClick={onClose} className="lg:hidden p-1 text-ink hover:text-gold" aria-label="Close sidebar">
            <HiX size={20} />
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-sage)' }}>
            Active Filters ({activeFilters.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map((act) => (
              <button
                key={act.type}
                onClick={() => handleRemoveFilter(act.type)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border bg-mint/5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer"
                style={{ borderColor: 'rgba(142,201,162,0.3)', color: 'var(--color-forest)' }}
              >
                <span>{act.label}</span>
                <HiX size={10} className="opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Accordion */}
      <FilterAccordion title="Category" defaultOpen={true}>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = category === cat._id || category === cat.slug;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => onFilterChange({ category: isSelected ? '' : cat.slug })}
                className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm text-left transition-all group cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(42,92,63,0.06)' : 'transparent',
                }}
              >
                <span
                  className="flex items-center gap-2.5 transition-colors"
                  style={{
                    color: isSelected ? 'var(--color-forest)' : 'var(--color-sage)',
                    fontWeight: isSelected ? '600' : '400',
                  }}
                >
                  <span className="text-base">{cat.icon}</span>
                  {cat.name}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors"
                  style={{
                    background: isSelected ? 'var(--color-mint)' : 'var(--color-mist)',
                    color: isSelected ? 'var(--color-forest)' : 'var(--color-sage)',
                  }}
                >
                  {cat.productCount || 0}
                </span>
              </button>
            );
          })}
        </div>
      </FilterAccordion>

      {/* Placement Accordion */}
      <FilterAccordion title="Placement" defaultOpen={true}>
        <div className="flex flex-wrap gap-2">
          {['Indoor', 'Outdoor', 'Both'].map((p) => {
            const isSelected = placement === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onFilterChange({ placement: isSelected ? '' : p })}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border"
                style={{
                  background: isSelected ? 'var(--color-forest)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--color-sage)',
                  borderColor: isSelected ? 'var(--color-forest)' : 'rgba(42, 92, 63, 0.15)',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </FilterAccordion>

      {/* Features Accordion */}
      <FilterAccordion title="Features" defaultOpen={false}>
        <div className="space-y-3 pt-1">
          {[
            { key: 'airPurifying', checked: airPurifying === 'true', label: '💨 Air Purifying' },
            { key: 'petFriendly', checked: petFriendly === 'true', label: '🐾 Pet Friendly' },
          ].map(({ key, checked, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange({ [key]: checked ? '' : 'true' })}
              className="w-full flex items-center gap-3 py-1 text-left cursor-pointer group"
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center border transition-all"
                style={{
                  background: checked ? 'var(--color-forest)' : '#fff',
                  borderColor: checked ? 'var(--color-forest)' : 'rgba(42,92,63,0.3)',
                }}
              >
                {checked && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span
                className="text-sm transition-colors group-hover:text-ink"
                style={{
                  color: checked ? 'var(--color-ink)' : 'var(--color-sage)',
                  fontWeight: checked ? '500' : '400',
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </FilterAccordion>

      {/* Difficulty Accordion */}
      <FilterAccordion title="Care Level" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {['Beginner', 'Intermediate', 'Expert'].map((d) => {
            const isSelected = difficulty === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => onFilterChange({ difficulty: isSelected ? '' : d })}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border"
                style={{
                  background: isSelected ? 'var(--color-forest)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--color-sage)',
                  borderColor: isSelected ? 'var(--color-forest)' : 'rgba(42, 92, 63, 0.15)',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </FilterAccordion>

      {/* Price Accordion */}
      <FilterAccordion title="Price Range" defaultOpen={true}>
        <div className="flex gap-2 items-center mb-4">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2 text-xs font-semibold" style={{ color: 'var(--color-sage)' }}>₹</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              className="input-flora w-full pl-6 pr-2 py-1.5 text-xs"
              style={{ paddingLeft: '1.5rem' }}
            />
          </div>
          <span style={{ color: 'var(--color-sage)' }}>—</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2 text-xs font-semibold" style={{ color: 'var(--color-sage)' }}>₹</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              className="input-flora w-full pl-6 pr-2 py-1.5 text-xs"
              style={{ paddingLeft: '1.5rem' }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Under ₹299', max: '299' },
            { label: 'Under ₹499', max: '499' },
            { label: 'Under ₹999', max: '999' },
          ].map((preset) => {
            const isSelected = maxPrice === preset.max && !minPrice;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onFilterChange({ minPrice: '', maxPrice: isSelected ? '' : preset.max })}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md transition-all cursor-pointer border"
                style={{
                  background: isSelected ? 'rgba(42,92,63,0.08)' : 'transparent',
                  color: isSelected ? 'var(--color-forest)' : 'var(--color-sage)',
                  borderColor: isSelected ? 'var(--color-forest)' : 'rgba(42,92,63,0.15)',
                }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </FilterAccordion>
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getFilters = () => ({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    placement: searchParams.get('placement') || '',
    airPurifying: searchParams.get('airPurifying') || '',
    petFriendly: searchParams.get('petFriendly') || '',
    difficulty: searchParams.get('difficulty') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const filters = getFilters();

  const updateFilters = useCallback((updates) => {
    const current = getFilters();
    const next = { ...current, ...updates, page: 1 };
    const params = {};
    Object.entries(next).forEach(([k, v]) => { if (v) params[k] = String(v); });
    setSearchParams(params);
  }, [searchParams]);

  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productAPI.getAll(filters).then(r => r.data),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });

  const { data: catData, error: catError, isError: isCatError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then(r => r.data.categories),
    staleTime: 10 * 60 * 1000,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {};
  const categories = catData || [];

  return (

    <>
      <Helmet>
        <title>Shop Plants — FLORA Lucknow | Indoor, Outdoor, Rare Plants</title>
        <meta name="description" content="Shop premium plant varieties at FLORA. Filter by category, care level, and placement. Free delivery above ₹999 in Lucknow. Order on WhatsApp." />
        <meta property="og:title" content="Shop Plants — FLORA Lucknow" />
        <meta property="og:description" content="Premium indoor, outdoor and rare plants. Same-day delivery in Lucknow. Order on WhatsApp." />
        <link rel="canonical" href="https://floraplants.in/shop" />
      </Helmet>

      <div className="min-h-screen pt-20" style={{ background: 'var(--color-cream)' }}>
        {/* Page header */}
        <div className="section-pad-sm" style={{ background: 'var(--color-forest)' }}>
          <div className="container-flora">
            <p className="text-label text-white/50 mb-2">Browse All</p>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl md:text-5xl font-bold text-white">
              Our <em className="italic font-normal" style={{ color: 'var(--color-mint)' }}>Collection</em>
            </h1>
            {filters.search && (
              <p className="text-white/60 mt-2 text-sm">
                Showing results for "<span style={{ color: 'var(--color-gold)' }}>{filters.search}</span>"
              </p>
            )}
          </div>
        </div>

        <div className="container-flora py-8">
          {/* Mobile filter button + Sort bar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 btn btn-ghost-dark text-sm px-4 py-2"
              >
                <HiOutlineFilter /> Filters
              </button>
              <p className="text-sm" style={{ color: 'var(--color-sage)' }}>
                {pagination.total || 0} plants found
              </p>
            </div>
            <select
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="input-flora w-auto text-sm px-3 py-2"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: 'var(--color-mist)' }}>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={updateFilters}
                  categories={categories}
                  onClose={() => {}}
                />
              </div>
            </aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-ink/50"
                  />
                  <motion.div
                    initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                    className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl"
                  >
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={(u) => { updateFilters(u); setSidebarOpen(false); }}
                      categories={categories}
                      onClose={() => setSidebarOpen(false)}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {(isError || isCatError) && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 shadow-sm">
                  <h4 className="font-bold text-sm mb-1">⚠️ Shop Page API Error:</h4>
                  {isError && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold">Products Query failed:</p>
                      <pre className="text-[11px] overflow-x-auto bg-white/50 p-2 rounded border mt-1 max-h-40">{error?.message || error?.toString() || JSON.stringify(error)}</pre>
                    </div>
                  )}
                  {isCatError && (
                    <div>
                      <p className="text-xs font-semibold">Categories Query failed:</p>
                      <pre className="text-[11px] overflow-x-auto bg-white/50 p-2 rounded border mt-1 max-h-40">{catError?.message || catError?.toString() || JSON.stringify(catError)}</pre>
                    </div>
                  )}
                </div>
              )}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array(9).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-2xl mb-2">No plants found</h3>
                  <p style={{ color: 'var(--color-sage)' }} className="mb-6">Try adjusting your filters or search terms</p>
                  <a href={getWAEnquiryLink("Hi FLORA! I'm looking for a specific plant. Can you help?")} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                    <FaWhatsapp /> Ask us on WhatsApp
                  </a>
                </div>
              ) : (
                <>
                  <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
                  >
                    <AnimatePresence mode="popLayout">
                      {products.map((product, i) => (
                        <motion.div
                          key={product._id}
                          layout
                          initial={{ opacity: 0, scale: 0.93 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.93 }}
                          transition={{ duration: 0.24, ease: 'easeOut', delay: Math.min(i * 0.02, 0.2) }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => updateFilters({ page: p })}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            p === filters.page
                              ? 'text-ink'
                              : 'bg-white hover:bg-mist text-sage border border-mist'
                          }`}
                          style={p === filters.page ? { background: 'var(--color-gold)', color: 'var(--color-ink)' } : {}}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp FAB */}
      <motion.a
        href={getWAEnquiryLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white animate-wa-pulse"
        style={{ background: 'var(--color-whatsapp)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaWhatsapp size={26} />
      </motion.a>
    </>
  );
}
