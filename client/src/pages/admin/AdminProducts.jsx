import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI, categoryAPI } from '../../services/api';
import { AdminWrapper } from './AdminDashboard';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { getFinalPrice } from '../../utils/helpers';

function ProductRow({ product, onEdit, onDelete }) {
  const finalPrice = getFinalPrice(product.price, product.discount);
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b hover:bg-mist/30 transition-colors"
      style={{ borderColor: 'var(--color-mist)' }}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{product.name}</p>
            <p className="text-xs italic" style={{ color: 'var(--color-sage)' }}>{product.scientificName}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm" style={{ color: 'var(--color-sage)' }}>{product.category?.name}</td>
      <td className="py-3 px-4 text-sm font-medium" style={{ color: 'var(--color-forest)' }}>₹{finalPrice}</td>
      <td className="py-3 px-4 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs ${product.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {product.stock} left
        </span>
      </td>
      <td className="py-3 px-4 text-sm">
        <span className={`px-2 py-1 rounded-full text-xs ${product.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {product.isActive ? 'Active' : 'Hidden'}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(product)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
            <HiPencil size={16} />
          </button>
          <button onClick={() => onDelete(product._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
            <HiTrash size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', scientificName: '', price: 200, stock: 10, category: '', description: '', shortDescription: '', discount: 0, isFeatured: false, isNewArrival: false, isBestSeller: false });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: () => productAPI.getAll({ search, limit: 50 }).then(r => r.data.products),
    staleTime: 1 * 60 * 1000,
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then(r => r.data.categories),
    staleTime: 10 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted');
    },
    onError: () => toast.error('Delete failed'),
  });

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || '',
      scientificName: product.scientificName || '',
      price: product.price || 200,
      stock: product.stock || 10,
      category: product.category?._id || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      discount: product.discount || 0,
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('data', JSON.stringify(form));
      images.forEach(f => fd.append('images', f));

      if (editing) {
        await productAPI.update(editing._id, fd);
        toast.success('Product updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Product created!');
      }
      queryClient.invalidateQueries(['admin-products']);
      setModalOpen(false);
      setEditing(null);
      setImages([]);
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const products = data || [];

  return (
    <>
      <Helmet><title>Products — FLORA Admin</title></Helmet>
      <AdminWrapper active="/admin/products" title="Products">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-sage)' }} size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-flora pl-10 w-64"
            />
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ name: '', scientificName: '', price: 200, stock: 10, category: '', description: '', shortDescription: '', discount: 0, isFeatured: false, isNewArrival: false, isBestSeller: false }); setModalOpen(true); }}
            className="btn btn-forest flex items-center gap-2"
          >
            <HiPlus /> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--color-mist)' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--color-mist)', background: 'var(--color-cream)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-sage)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {isLoading
                    ? Array(5).fill(0).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={6} className="py-3 px-4"><div className="skeleton h-10 rounded" /></td>
                        </tr>
                      ))
                    : products.map(p => (
                        <ProductRow key={p._id} product={p} onEdit={handleEdit} onDelete={id => { if (confirm('Delete this product?')) deleteMutation.mutate(id); }} />
                      ))
                  }
                </AnimatePresence>
              </tbody>
            </table>
            {!isLoading && products.length === 0 && (
              <div className="text-center py-16" style={{ color: 'var(--color-sage)' }}>No products found</div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        <AnimatePresence>
          {modalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-ink/60" onClick={() => setModalOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-8 bottom-8 z-[51] max-w-2xl mx-auto bg-white rounded-2xl overflow-y-auto shadow-2xl"
              >
                <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-mist)' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }} className="text-xl font-bold">
                    {editing ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button onClick={() => setModalOpen(false)} style={{ color: 'var(--color-sage)' }}><HiX size={22} /></button>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Monstera Deliciosa' },
                    { label: 'Scientific Name', key: 'scientificName', type: 'text', placeholder: 'e.g. Monstera deliciosa' },
                    { label: 'Short Description', key: 'shortDescription', type: 'text', placeholder: 'One line summary' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>{label}</label>
                      <input type={type} placeholder={placeholder} className="input-flora" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Description *</label>
                    <textarea className="input-flora resize-none" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Price ₹</label>
                      <input type="number" className="input-flora" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Discount %</label>
                      <input type="number" min="0" max="100" className="input-flora" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Stock</label>
                      <input type="number" className="input-flora" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Category</label>
                    <select className="input-flora" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="">Select category</option>
                      {catData?.map(cat => <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-ink)' }}>Product Images</label>
                    <input type="file" multiple accept="image/*" className="input-flora text-sm" onChange={e => setImages(Array.from(e.target.files))} />
                    {images.length > 0 && <p className="text-xs mt-1" style={{ color: 'var(--color-sage)' }}>{images.length} file(s) selected</p>}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {[['isFeatured', 'Featured'], ['isNewArrival', 'New Arrival'], ['isBestSeller', 'Best Seller']].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--color-ink)' }}>
                        <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="accent-forest" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t flex gap-3 justify-end" style={{ borderColor: 'var(--color-mist)' }}>
                  <button onClick={() => setModalOpen(false)} className="btn btn-ghost-dark">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="btn btn-forest">
                    {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </AdminWrapper>
    </>
  );
}
