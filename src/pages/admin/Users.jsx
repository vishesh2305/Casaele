import { useEffect, useMemo, useState } from 'react'

export default function Users() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        if (!r.ok) throw new Error('Failed to load users')
        return r.json()
      })
      .then(data => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [])

  const sorted = useMemo(() => {
    const normalized = rows.map(r => ({
      ...r,
      role: r.role || 'user',
      status: r.status || (r.disabled ? 'Disabled' : 'Active')
    }))

    const filtered = normalized.filter(r => {
      const matchesSearch = !search ||
        (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.uid || '').toLowerCase().includes(search.toLowerCase())
      const matchesRole = !roleFilter || (r.role || 'user').toLowerCase() === roleFilter.toLowerCase()
      const matchesStatus = !statusFilter || (r.status || 'Active').toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesRole && matchesStatus
    })

    const list = [...filtered]
    list.sort((a, b) => {
      const va = (a[sortBy.key] || '').toString().toLowerCase()
      const vb = (b[sortBy.key] || '').toString().toLowerCase()
      if (va < vb) return sortBy.dir === 'asc' ? -1 : 1
      if (va > vb) return sortBy.dir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [rows, sortBy, search, roleFilter, statusFilter])

  function setSort(key){
    setSortBy(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Export CSV
              const header = ['Name','Email','UID','Created','Role','Status']
              const lines = sorted.map(u => [
                u.name || '', u.email || '', u.uid || '', u.creationTime || '', (u.role || 'user'), (u.status || 'Active')
              ].map(x => `"${String(x).replaceAll('"','""')}"`).join(','))
              const csv = [header.join(','), ...lines].join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'users.csv'
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
            }}
            className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800"
          >Export CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-3">
        <input
          placeholder="Search by name, email or UID"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className="w-full md:flex-1 rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600"
        />
        <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('name')}>Name</th>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('email')}>Email</th>
              <th className="px-4 py-3">UID</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? Array.from({length:5}).map((_,i)=>(
              <tr key={i}>
                <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-48 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-8 w-24 bg-gray-100 animate-pulse rounded" /></td>
              </tr>
            )) : sorted.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{r.name || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{r.email || '-'}</td>
                <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                  <button onClick={() => { navigator.clipboard?.writeText(r.uid || '') }} className="hover:underline" title="Copy UID">
                    {r.uid || '-'}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{r.creationTime ? new Date(r.creationTime).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-gray-700">{r.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{r.status || 'Active'}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition">Edit</button>
                  <button className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}



