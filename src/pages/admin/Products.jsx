import { useEffect, useMemo, useState } from 'react'
import { apiGet, apiSend } from '../../utils/api'

export default function Products() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' })
  useEffect(() => {
    apiGet('/api/products')
      .then(data => setRows(data))
      .catch(() => setRows([]))
      .finally(()=>setLoading(false))
  }, [])

  const sorted = useMemo(() => {
    const list = [...rows]
    list.sort((a, b) => {
      const va = (a[sortBy.key] || '').toString().toLowerCase()
      const vb = (b[sortBy.key] || '').toString().toLowerCase()
      if (va < vb) return sortBy.dir === 'asc' ? -1 : 1
      if (va > vb) return sortBy.dir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [rows, sortBy])

  function setSort(key){
    setSortBy(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', stock: '' })

  function openCreate(){ setEditing(null); setForm({ name:'', price:'', description:'', image:'', stock:'' }); setModalOpen(true) }
  function openEdit(item){ setEditing(item); setForm({ name:item.name, price:item.price, description:item.description||'', image:item.image||'', stock:item.stock||0 }); setModalOpen(true) }
  async function saveItem(){
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock||0) }
    const saved = editing
      ? await apiSend(`/api/products/${editing._id}`, 'PUT', payload)
      : await apiSend('/api/products', 'POST', payload)
    if (editing) setRows(rows.map(r => r._id === saved._id ? saved : r))
    else setRows([saved, ...rows])
    setModalOpen(false)
  }
  async function removeItem(id){
    await apiSend(`/api/products/${id}`, 'DELETE')
    setRows(rows.filter(r => r._id !== id))
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
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <span className="text-sm text-gray-700">Name</span>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Price</span>
                <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Description</span>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Image URL</span>
                <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Stock</span>
                <input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={()=>setModalOpen(false)} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button onClick={saveItem} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



