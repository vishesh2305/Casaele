import { useEffect, useState } from 'react';
import { apiGet, apiSend } from '../../utils/api';

export default function Materials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  
  // *** CHANGED: Removed displayType from default form state ***
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    fileUrl: '', // This will be the Card Image
    tags: '', 
    imageSource: '', 
    embedIds: [],
    bannerImageUrl: '', // This will be the Banner Image
  })
  
  const [embeds, setEmbeds] = useState([])
  const [materialEmbeds, setMaterialEmbeds] = useState([]) 
  const [uploading, setUploading] = useState(false); // For Card Image
  const [uploadingBanner, setUploadingBanner] = useState(false); // For Banner Image
  const [imgMode, setImgMode] = useState('local');
  const [pinUrl, setPinUrl] = useState('');
  const [pinPreview, setPinPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      apiGet('/api/materials'),
      apiGet('/api/embeds')
    ]).then(([materialsData, embedsData]) => {
      setItems(materialsData)
      setEmbeds(embedsData)
    }).catch(() => {
      setItems([])
      setEmbeds([])
    }).finally(() => setLoading(false))
  }, [])

  // Handler for the card image
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
      if (!response.ok) throw new Error('Cloudinary upload failed');
      const data = await response.json();
      setForm({ ...form, fileUrl: data.secure_url, imageSource: 'local' });
    } catch (error) {
      alert('Card Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Handler for the banner image
  const handleBannerFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBanner(true);
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
      if (!response.ok) throw new Error('Cloudinary upload failed');
      const data = await response.json();
      setForm({ ...form, bannerImageUrl: data.secure_url });
    } catch (error) {
      alert('Banner Image upload failed.');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSave = async () => {
    try {
      setErrorMsg('');
      setSaving(true);
      
      const payload = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        imageSource: form.imageSource || (imgMode === 'pinterest' ? 'pinterest' : 'local'),
        embeds: materialEmbeds.filter(embed => embed.title.trim() && embed.embedCode.trim()),
        // *** CHANGED: Removed displayType from payload ***
        bannerImageUrl: form.bannerImageUrl, 
      };

      const saved = editing
        ? await apiSend(`/api/materials/${editing._id}`, 'PUT', payload)
        : await apiSend('/api/materials', 'POST', payload);

      if (editing) setItems(items.map(x => x._id === saved._id ? saved : x));
      else setItems([saved, ...items]);

      setModalOpen(false);
      setMaterialEmbeds([]); 
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
    // *** CHANGED: Removed displayType from form loading ***
    setForm({
      title: material.title || '',
      description: material.description || '',
      category: material.category || '',
      fileUrl: material.fileUrl || '',
      tags: Array.isArray(material.tags) ? material.tags.join(', ') : '',
      embedIds: material.embedIds?.map(e => e._id) || [],
      imageSource: material.imageSource || '',
      bannerImageUrl: material.bannerImageUrl || '', 
    });
    
    const existingEmbeds = material.embedIds?.map(embed => ({
      title: embed.title || '',
      type: embed.type || 'AI',
      embedCode: embed.embedCode || ''
    })) || [];
    setMaterialEmbeds(existingEmbeds);
    
    setModalOpen(true);
  }
  
  const handleEmbedSelection = (embedId) => {
    setForm(prevForm => {
      const newEmbedIds = prevForm.embedIds.includes(embedId)
        ? prevForm.embedIds.filter(id => id !== embedId)
        : [...prevForm.embedIds, embedId];
      return { ...prevForm, embedIds: newEmbedIds };
    });
  };

  const addMaterialEmbed = () => setMaterialEmbeds(prev => [...prev, { title: '', type: 'AI', embedCode: '' }]);
  const updateMaterialEmbed = (index, field, value) => setMaterialEmbeds(prev => prev.map((embed, i) => i === index ? { ...embed, [field]: value } : embed));
  const removeMaterialEmbed = (index) => setMaterialEmbeds(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Materials</h1>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">Manage learning materials</div>
          <button
            onClick={() => { 
              setEditing(null); 
              setForm({ 
                title: '', 
                description: '', 
                category: '', 
                fileUrl: '', 
                tags: '',
                embedIds: [],
                imageSource: '',
                bannerImageUrl: '', // Reset
              }); 
              setImgMode('local');
              setPinUrl('');
              setPinPreview(null);
              setMaterialEmbeds([]);
              setModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800"
          >
            Add Material
          </button>
        </div>

        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              {/* *** CHANGED: Removed Type column *** */}
              <th className="px-4 py-3">Embeds</th>
              <th className="px-4 py-3">Card Image URL</th>
              <th className="px-4 py-3">Banner Image URL</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3"><div className="h-4 w-56 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-100 animate-pulse rounded" /></td>
                  <td className="px-4 py-3"><div className="h-8 w-24 bg-gray-100 animate-pulse rounded" /></td>
                </tr>
              ))
            ) : items.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{m.title}</td>
                <td className="px-4 py-3 text-gray-700">{m.category || '-'}</td>
                {/* *** CHANGED: Removed Type data cell *** */}
                <td className="px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{m.embedIds?.length || 0}</span>
                    <span className="text-xs text-gray-500">embeds</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700 truncate max-w-xs">{m.fileUrl || '-'}</td>
                <td className="px-4 py-3 text-gray-700 truncate max-w-xs">{m.bannerImageUrl || '-'}</td>
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
          <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-lg font-semibold">{editing ? 'Edit material' : 'Add material'}</div>
            {errorMsg ? <div className="text-sm text-red-600">{errorMsg}</div> : null}

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Title', key: 'title' },
                { label: 'Short Description (for cards)', key: 'description' },
                { label: 'Category', key: 'category' },
                { label: 'Tags (comma-separated)', key: 'tags', placeholder: 'e.g., A2, Listening, Culture' }
              ].map(f => (
                <label key={f.key} className="block">
                  <span className="text-sm text-gray-700">{f.label}</span>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder || ''}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 focus:border-red-500 focus:ring-2 focus:ring-red-400/50 transition duration-150 px-3 py-2 text-sm placeholder-gray-400 hover:border-gray-400"
                  />
                </label>
              ))}

              
              {/* *** CHANGED: Removed Display Type radio buttons *** */}

              {/* Multiple Embeds Section (No change) */}
              <div className="block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Add Multiple Embeds (AI/H5P Content)</span>
                  <button type="button" onClick={addMaterialEmbed} className="px-3 py-1.5 text-xs bg-red-700 text-white rounded-md hover:bg-red-800 transition">
                    + Add Another Embed
                  </button>
                </div>
                {materialEmbeds.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-sm">No embeds added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {materialEmbeds.map((embed, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        {/* ... embed inputs ... (no change here) */}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Legacy Embed Selection (No change) */}
              <div className="block">
                {/* ... legacy embed selection ... (no change here) */}
              </div>

              {/* Card Image Section */}
              <div className="block">
                <span className="text-sm text-gray-700">Card Image Source</span>
                {/* ... imgMode radio buttons ... (no change here) */}
              </div>

              {imgMode === 'local' ? (
                <label className="block">
                  {/* *** CHANGED: Relabeled *** */}
                  <span className="text-sm text-gray-700">Card Image Upload (for material list)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer transition"
                  />
                  {uploading && <div className="text-sm text-gray-500 mt-1">Uploading Card Image...</div>}
                  {form.fileUrl && !uploading && (<div className="text-sm text-green-600 mt-1">Card image upload complete.</div>)}
                </label>
              ) : (
                <div className="grid gap-2">
                  {/* ... pinterest inputs ... (no change here) */}
                </div>
              )}

              {(form.fileUrl || pinPreview) && (
                <div className="mt-2 border rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-1">Card Image Preview</div>
                  <img src={form.fileUrl || pinPreview?.image} alt="preview" className="max-h-40 object-contain rounded-md border border-gray-200" />
                </div>
              )}

              {/* Banner Image Uploader */}
              <label className="block">
                {/* *** CHANGED: Relabeled *** */}
                <span className="text-sm text-gray-700">Banner Image Upload (for detail page)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition"
                />
                {uploadingBanner && <div className="text-sm text-gray-500 mt-1">Uploading Banner Image...</div>}
                {form.bannerImageUrl && !uploadingBanner && (<div className="text-sm text-green-600 mt-1">Banner image upload complete.</div>)}
              </label>
              
              {form.bannerImageUrl && (
                <div className="mt-2 border rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-1">Banner Image Preview</div>
                  <img src={form.bannerImageUrl} alt="banner preview" className="max-h-40 object-contain rounded-md border border-gray-200" />
                </div>
              )}

            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={uploading || uploadingBanner || saving} 
                className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60"
              >
                {saving ? 'Saving…' : (uploading || uploadingBanner ? 'Uploading...' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}