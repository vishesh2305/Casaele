import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend } from '../../utils/api';

export default function Products() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', stock: '', imageSource: '' });
  const [imgMode, setImgMode] = useState('local'); // 'local' | 'pinterest'
  const [pinUrl, setPinUrl] = useState('');
  const [pinPreview, setPinPreview] = useState(null);
  const [uploading, setUploading] = useState(false); // ✅ State for upload progress
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiGet('/api/products')
      .then(data => setRows(data))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ COPIED & ADAPTED: Cloudinary upload logic from Materials.jsx
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { timestamp, signature } = await apiGet('/api/cloudinary-signature');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('upload_preset', 'casadeele_materials'); // Use the same preset for consistency

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
      setForm({ ...form, image: data.secure_url, imageSource: 'local' });

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
      // expect res to include title and image url
      setPinPreview(res);
      setForm({ ...form, image: res.image || res.imageUrl || '', imageSource: 'pinterest' });
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

  function openCreate() { setEditing(null); setForm({ name: '', price: '', description: '', image: '', stock: '' }); setModalOpen(true); }
  function openEdit(item) { setEditing(item); setForm({ name: item.name, price: item.price, description: item.description || '', image: item.image || '', stock: item.stock || 0 }); setModalOpen(true); }
  
  async function saveItem() {
    try {
      setErrorMsg('');
      setSaving(true);
      if (!form.image) { setErrorMsg('Please select an image (local or Pinterest).'); setSaving(false); return; }
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock || 0), imageSource: form.imageSource || (imgMode === 'pinterest' ? 'pinterest' : 'local') };
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
        {/* Table remains the same */}
        <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('name')}>Product Name</th>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('price')}>Price</th>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('stock')}>Stock</th>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('category')}>Category</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? Array.from({length:5}).map((_,i)=>(
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
                <td className="px-4 py-3 text-gray-700">{typeof r.price === 'number' ? `$${r.price.toFixed(2)}` : r.price}</td>
                <td className="px-4 py-3 text-gray-700">{r.stock}</td>
                <td className="px-4 py-3 text-gray-700">{r.category}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={()=>openEdit(r)} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition">Edit</button>
                  <button onClick={()=>removeItem(r._id)} className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow p-6 space-y-4">
            <div className="text-lg font-semibold">{editing ? 'Edit product' : 'Add product'}</div>
            {errorMsg ? <div className="text-sm text-red-600">{errorMsg}</div> : null}
            <div className="grid grid-cols-1 gap-3">
              <label className="block"><span className="text-sm text-gray-700">Name</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
              <label className="block"><span className="text-sm text-gray-700">Price</span><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
              <label className="block"><span className="text-sm text-gray-700">Description</span><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
              
              {/* Image source toggle */}
              <div className="block">
                <span className="text-sm text-gray-700">Image Source</span>
                <div className="mt-1 flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="imgMode" checked={imgMode==='local'} onChange={()=>setImgMode('local')} /> Local Upload
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="imgMode" checked={imgMode==='pinterest'} onChange={()=>setImgMode('pinterest')} /> Pinterest URL
                  </label>
                </div>
              </div>

              {imgMode==='local' ? (
                <label className="block"><span className="text-sm text-gray-700">Upload Image</span>
                  <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                  {uploading && <div className="text-sm text-gray-500 mt-1">Uploading...</div>}
                </label>
              ) : (
                <div className="grid gap-2">
                  <label className="block"><span className="text-sm text-gray-700">Pinterest Link</span>
                    <input value={pinUrl} onChange={e=>setPinUrl(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="https://www.pinterest..." />
                  </label>
                  <div>
                    <button type="button" onClick={fetchPinterest} disabled={uploading || !pinUrl} className="px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-60">Fetch</button>
                  </div>
                </div>
              )}

              {/* Preview */}
              {(form.image || pinPreview) && (
                <div className="mt-2 border rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-1">Preview</div>
                  <img src={form.image || pinPreview?.image} alt="preview" className="max-h-40 object-contain" />
                </div>
              )}

              <label className="block"><span className="text-sm text-gray-700">Stock</span><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={()=>setModalOpen(false)} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button onClick={saveItem} disabled={uploading || saving} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60">{saving ? 'Saving…' : (uploading ? "Uploading..." : "Save")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}