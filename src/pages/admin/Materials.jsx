import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '../../utils/api';

export default function Materials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', content: '', category: '', fileUrl: '', tags: '' })
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiGet('/api/materials')
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])


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

      setForm({ ...form, fileUrl: data.secure_url });
    } catch (error) {
      console.error('Upload failed', error);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setErrorMsg('');
      setSaving(true);
      const payload = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      const saved = editing
        ? await apiSend(`/api/materials/${editing._id}`, 'PUT', payload)
        : await apiSend('/api/materials', 'POST', payload);

      if (editing) setItems(items.map(x => x._id === saved._id ? saved : x));
      else setItems([saved, ...items]);

      setModalOpen(false);
    } catch (err) {
      const msg = err?.message || 'Failed to save material';
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };


  const openEditModal = (material) => {
    setEditing(material);
    setForm({
      title: material.title || '',
      description: material.description || '',
      content: material.content || '',
      category: material.category || '',
      fileUrl: material.fileUrl || '',
      tags: Array.isArray(material.tags) ? material.tags.join(', ') : ''
    });
    setModalOpen(true);
  }



  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Materials</h1>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">Manage learning materials</div>
          <button onClick={()=>{setEditing(null); setForm({ title:'', description: '', content:'', category:'', fileUrl:'', tags: '' }); setModalOpen(true)}} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800">Add Material</button>
        </div>
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">File URL</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td className="px-4 py-3"><div className="h-4 w-56 bg-gray-100 animate-pulse rounded" /></td><td className="px-4 py-3"><div className="h-4 w-24 bg-gray-100 animate-pulse rounded" /></td><td className="px-4 py-3"><div className="h-4 w-40 bg-gray-100 animate-pulse rounded" /></td><td className="px-4 py-3"><div className="h-8 w-24 bg-gray-100 animate-pulse rounded" /></td></tr>
              ))
            ) : items.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{m.title}</td>
                <td className="px-4 py-3 text-gray-700">{m.category || '-'}</td>
                <td className="px-4 py-3 text-gray-700 truncate max-w-xs">{m.fileUrl || '-'}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => openEditModal(m)} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition">Edit</button>
                  <button onClick={async () => { await apiSend(`/api/materials/${m._id}`, 'DELETE'); setItems(items.filter(x => x._id !== m._id)) }} className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow p-6 space-y-4">
            <div className="text-lg font-semibold">{editing ? 'Edit material' : 'Add material'}</div>
            {errorMsg ? <div className="text-sm text-red-600">{errorMsg}</div> : null}
            <div className="grid grid-cols-1 gap-3">
              <label className="block"><span className="text-sm text-gray-700">Title</span><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
              <label className="block"><span className="text-sm text-gray-700">Short Description (for cards)</span><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
              <label className="block"><span className="text-sm text-gray-700">Main Content (for detail page)</span><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
              <label className="block"><span className="text-sm text-gray-700">Category</span><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>
              <label className="block"><span className="text-sm text-gray-700">Tags (comma-separated)</span><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="e.g., A2, Listening, Culture" className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" /></label>

              <label className="block"><span className="text-sm text-gray-700">File Upload</span>
                <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                {uploading && <div className="text-sm text-gray-500 mt-1">Uploading...</div>}
                {form.fileUrl && !uploading && (<div className="text-sm text-green-600 mt-1">Upload complete. URL saved.</div>)}
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button onClick={handleSave} disabled={uploading || saving} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60">{saving ? 'Saving…' : (uploading ? 'Uploading...' : 'Save')}</button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}


