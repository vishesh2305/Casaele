import { useEffect, useState } from 'react'
import { apiGet, apiSend } from '../../utils/api'

export default function Materials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title:'', content:'', category:'', fileUrl:'' })
  useEffect(() => {
    apiGet('/api/materials')
      .then(setItems)
      .catch(()=>setItems([]))
      .finally(()=>setLoading(false))
  }, [])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Materials</h1>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">Manage learning materials</div>
          <button onClick={()=>{setEditing(null); setForm({ title:'', content:'', category:'', fileUrl:'' }); setModalOpen(true)}} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800">Add Material</button>
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
            {loading ? Array.from({length:4}).map((_,i)=>(
              <tr key={i}><td className="px-4 py-3"><div className="h-4 w-56 bg-gray-100 animate-pulse rounded"/></td><td className="px-4 py-3"><div className="h-4 w-24 bg-gray-100 animate-pulse rounded"/></td><td className="px-4 py-3"><div className="h-4 w-40 bg-gray-100 animate-pulse rounded"/></td><td className="px-4 py-3"><div className="h-8 w-24 bg-gray-100 animate-pulse rounded"/></td></tr>
            )) : items.map((m, i)=>(
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{m.title}</td>
                <td className="px-4 py-3 text-gray-700">{m.category || '-'}</td>
                <td className="px-4 py-3 text-gray-700 truncate max-w-xs">{m.fileUrl || '-'}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={()=>{setEditing(m); setForm({ title:m.title, content:m.content||'', category:m.category||'', fileUrl:m.fileUrl||'' }); setModalOpen(true)}} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition">Edit</button>
                  <button onClick={async()=>{ await apiSend(`/api/materials/${m._id}`,'DELETE'); setItems(items.filter(x=>x._id!==m._id)) }} className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Delete</button>
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
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <span className="text-sm text-gray-700">Title</span>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Content</span>
                <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Category</span>
                <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">File URL</span>
                <input value={form.fileUrl} onChange={e=>setForm({...form,fileUrl:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={()=>setModalOpen(false)} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button onClick={async()=>{ const payload=form; const saved=editing? await apiSend(`/api/materials/${editing._id}`,'PUT',payload): await apiSend('/api/materials','POST',payload); if(editing) setItems(items.map(x=>x._id===saved._id?saved:x)); else setItems([saved,...items]); setModalOpen(false) }} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


