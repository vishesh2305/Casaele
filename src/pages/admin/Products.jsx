import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend } from '../../utils/api';

export default function Products() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', discountPrice: '', productType: 'Digital', description: '', images: [], stock: '', imageSource: '' });
  const [imgMode, setImgMode] = useState('local');
  const [pinUrl, setPinUrl] = useState('');
  const [pinPreview, setPinPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiGet('/api/products')
      .then(data => setRows(data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const uploadedImageUrls = [];
    try {
      for (const file of files) {
        const { timestamp, signature } = await apiGet('/api/cloudinary-signature');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('upload_preset', 'casadeele_materials');
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || 'Cloudinary upload failed');
        }
        const data = await response.json();
        uploadedImageUrls.push(data.secure_url);
      }
      setForm({ ...form, images: [...form.images, ...uploadedImageUrls], imageSource: 'local' });
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`File upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  async function fetchPinterest() {
    try {
      setUploading(true);
      const res = await apiSend('/api/pinterest/fetch', 'POST', { url: pinUrl });
      const ok = res && (res.success === true) && res.data;
      const data = ok ? res.data : res;
      setPinPreview(data);
      setForm({ ...form, images: [...form.images, data.imageUrl || data.image || ''], imageSource: 'pinterest' });
    } catch (e) {
      alert(e?.message || 'Failed to fetch Pinterest data');
    } finally {
      setUploading(false);
    }
  }

  const sorted = useMemo(() => {
    const list = [...rows];
    list.sort((a, b) => {
      const va = (a[sortBy.key] || '').toString().toLowerCase();
      const vb = (b[sortBy.key] || '').toString().toLowerCase();
      if (va < vb) return sortBy.dir === 'asc' ? -1 : 1;
      if (va > vb) return sortBy.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [rows, sortBy]);

  function setSort(key) {
    setSortBy(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  }

  function openCreate() { setEditing(null); setForm({ name: '', price: '', discountPrice: '', productType: 'Digital', description: '', images: [], stock: '' }); setModalOpen(true); }
  function openEdit(item) { setEditing(item); setForm({ name: item.name, price: item.price, discountPrice: item.discountPrice || '', productType: item.productType || 'Digital', description: item.description || '', images: item.images || [], stock: item.stock || 0 }); setModalOpen(true); }

  async function saveItem() {
    try {
      setErrorMsg('');
      setSaving(true);
      if (form.images.length === 0) { setErrorMsg('Please upload at least one image.'); setSaving(false); return; }
      const nonNegativeStock = Math.max(0, Number(form.stock || 0));
      const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || null, stock: nonNegativeStock, imageSource: form.imageSource || (imgMode === 'pinterest' ? 'pinterest' : 'local') };
      const saved = editing
        ? await apiSend(`/api/products/${editing._id}`, 'PUT', payload)
        : await apiSend('/api/products', 'POST', payload);
      if (editing) setRows(rows.map(r => r._id === saved._id ? saved : r));
      else setRows([saved, ...rows]);
      setModalOpen(false);
    } catch (err) {
      const msg = err?.message || 'Failed to save product';
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id) {
    await apiSend(`/api/products/${id}`, 'DELETE');
    setRows(rows.filter(r => r._id !== id));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">Manage your products</div>
          <button onClick={openCreate} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800">Add Product</button>
        </div>
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSort('name')}>Product Name</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSort('price')}>Price</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSort('stock')}>Stock</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSort('category')}>Category</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-8 w-24 bg-gray-100 animate-pulse rounded" /></td>
                </tr>
              )) : sorted.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                  <td className="px-4 py-3 text-gray-700">{typeof r.price === 'number' ? `₹${r.price.toFixed(2)}` : r.price}</td>
                  <td className="px-4 py-3 text-gray-700">{r.stock}</td>
                  <td className="px-4 py-3 text-gray-700">{r.category}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => openEdit(r)} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition">Edit</button>
                    <button onClick={() => removeItem(r._id)} className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">{editing ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700 transition">✖</button>
            </div>
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {errorMsg && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errorMsg}</div>}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Basic Information</h3>
                <label className="block">
                  <span className="text-sm text-gray-700">Product Name</span>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm text-gray-700">Price (₹)</span>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g., 999" className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-700">Discount Price (₹)</span>
                    <input type="number" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} placeholder="Optional" className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm text-gray-700">Product Type</span>
                  <select value={form.productType} onChange={e => setForm({ ...form, productType: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition">
                    <option value="Digital">Digital</option>
                    <option value="Physical">Physical</option>
                    <option value="Both">Both</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">Description</span>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows="3" placeholder="Brief product description..." className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition" />
                </label>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Product Images</h3>
                <div className="flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="imgMode" checked={imgMode === 'local'} onChange={() => setImgMode('local')} /> Local Upload
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="imgMode" checked={imgMode === 'pinterest'} onChange={() => setImgMode('pinterest')} /> Pinterest URL
                  </label>
                </div>
                {imgMode === 'local' ? (
                  <label className="block">
                    <span className="text-sm text-gray-700">Upload Images</span>
                    <input type="file" multiple onChange={handleFileChange} className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200 focus:outline-none" />
                    {uploading && <div className="text-sm text-gray-500 mt-2 animate-pulse">Uploading...</div>}
                  </label>
                ) : (
                  <div className="grid gap-2">
                    <label className="block">
                      <span className="text-sm text-gray-700">Pinterest Link</span>
                      <input value={pinUrl} onChange={e => setPinUrl(e.target.value)} placeholder="https://www.pinterest.com/..." className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition" />
                    </label>
                    <button type="button" onClick={fetchPinterest} disabled={uploading || !pinUrl} className="w-fit px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition disabled:opacity-50">Fetch Image</button>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {form.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image} alt="preview" className="h-24 w-full object-cover rounded-lg border" />
                      <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== index) })} className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Inventory</h3>
                <label className="block">
                  <span className="text-sm text-gray-700">Stock Quantity</span>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="e.g., 100" className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition" />
                </label>
              </div>
            </div>
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">Cancel</button>
              <button onClick={saveItem} disabled={uploading || saving} className="px-5 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-60 transition">{saving ? 'Saving…' : uploading ? 'Uploading...' : 'Save Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
