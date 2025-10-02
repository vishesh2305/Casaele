import { useEffect, useMemo, useState } from 'react'

export default function Orders() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState({ key: 'id', dir: 'asc' })
  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('id')}>Order ID</th>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('user')}>User</th>
              <th className="px-4 py-3 cursor-pointer" onClick={()=>setSort('total')}>Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? Array.from({length:5}).map((_,i)=>(
              <tr key={i}>
                <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-100 animate-pulse rounded" /></td>
                <td className="px-4 py-3"><div className="h-8 w-24 bg-gray-100 animate-pulse rounded" /></td>
              </tr>
            )) : sorted.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{r.id}</td>
                <td className="px-4 py-3 text-gray-700">{r.user}</td>
                <td className="px-4 py-3 text-gray-700">{typeof r.total === 'number' ? `$${r.total.toFixed(2)}` : r.total}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'Paid' ? 'bg-green-100 text-green-700' : r.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition">View</button>
                  <button className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Refund</button>
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



