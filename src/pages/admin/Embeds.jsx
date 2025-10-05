import React, { useEffect, useState } from 'react'

function useAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function Embeds() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', type: 'H5P', embedCode: '' })
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 5
  const headers = useAuthHeaders()

  async function fetchEmbeds() {
    try {
      setLoading(true)
      const res = await fetch('/api/embeds', { headers })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setItems(data)
    } catch (e) {
      setError(e?.message || 'Failed to load embeds')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmbeds() }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/embeds/${editingId}` : '/api/embeds'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error(await res.text())
      setForm({ title: '', type: 'H5P', embedCode: '' })
      setEditingId(null)
      fetchEmbeds()
    } catch (e) {
      setError(e?.message || 'Save failed')
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this embed?')) return
    try {
      const res = await fetch(`/api/embeds/${id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error(await res.text())
      setItems(items.filter(i => i._id !== id))
    } catch (e) {
      setError(e?.message || 'Delete failed')
    }
  }

  function onEdit(item) {
    setEditingId(item._id)
    setForm({ title: item.title, type: item.type, embedCode: item.embedCode })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function Preview({ code }) {
    const [isLoading, setIsLoading] = useState(true)
    const wrapRef = React.useRef(null)
    useEffect(() => {
      setIsLoading(true)
      const node = wrapRef.current
      if (!node) return
      // Try to hook the first iframe load event if present
      const iframe = node.querySelector('iframe')
      if (iframe) {
        const onLoad = () => setIsLoading(false)
        iframe.addEventListener('load', onLoad)
        // Fallback timeout in case no load fires
        const t = setTimeout(() => setIsLoading(false), 1500)
        return () => { iframe.removeEventListener('load', onLoad); clearTimeout(t) }
      }
      // General fallback
      const t = setTimeout(() => setIsLoading(false), 800)
      return () => clearTimeout(t)
    }, [code])

    if (!code) return null
    return (
      <div className="relative rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <svg className="h-6 w-6 animate-spin text-red-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}
        <div className="aspect-video w-full">
          <div ref={wrapRef} className="w-full h-full p-0 m-0" dangerouslySetInnerHTML={{ __html: code }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">AI / H5P Manager</h1>

      {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{String(error)}</div> : null}

      <form onSubmit={onSubmit} className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" value={form.title} onChange={onChange} required className="w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="e.g., Speaking Exercise" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={form.type} onChange={onChange} className="w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600">
              <option value="H5P">H5P</option>
              <option value="AI">AI</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Embed Code</label>
            <textarea name="embedCode" rows="5" value={form.embedCode} onChange={onChange} className="w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="Paste iframe/script snippet here"></textarea>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition">
            {editingId ? 'Update' : 'Add'} Embed
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', type: 'H5P', embedCode: '' }) }} className="text-sm text-gray-600 hover:text-gray-900">
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      {/* List */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm font-medium">Embeds</div>
          <div className="flex items-center gap-3">
            <button onClick={fetchEmbeds} className="text-sm text-red-700 hover:underline">Refresh</button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? <div className="p-4 text-sm text-gray-500">Loading…</div> : null}
          {!loading && items.length === 0 ? <div className="p-4 text-sm text-gray-500">No embeds yet.</div> : null}
          {items
            .slice((page - 1) * pageSize, page * pageSize)
            .map(item => (
            <div key={item._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.type} • {new Date(item.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(item)} className="text-sm text-gray-700 hover:underline">Edit</button>
                  <button onClick={() => onDelete(item._id)} className="text-sm text-red-700 hover:underline">Delete</button>
                </div>
              </div>
              <Preview code={item.embedCode} />
            </div>
          ))}
        </div>
        {items.length > pageSize && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
            <div className="text-gray-500">Page {page} of {Math.ceil(items.length / pageSize)}</div>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded border text-gray-700 disabled:opacity-50">Prev</button>
              <button disabled={page >= Math.ceil(items.length / pageSize)} onClick={() => setPage(p => Math.min(Math.ceil(items.length / pageSize), p + 1))} className="px-3 py-1 rounded border text-gray-700 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


