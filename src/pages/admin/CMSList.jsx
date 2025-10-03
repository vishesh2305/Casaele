import { useEffect, useState } from 'react'
import { apiGet, apiSend } from '../../utils/api'
import { Link, useNavigate } from 'react-router-dom'

export default function CMSList() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    apiGet('/api/cms')
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [])

  async function remove(id) {
    await apiSend(`/api/cms/${id}`, 'DELETE')
    setRows(rows.filter(r => r._id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">CMS Pages</h1>
        <button onClick={() => navigate('/admin/cms/new')} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800">Add Page</button>
      </div>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}><td className="px-4 py-3"><div className="h-4 w-56 bg-gray-100 animate-pulse rounded" /></td><td /><td /><td /></tr>
            )) : rows.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                <td className="px-4 py-3 text-gray-700">{p.slug}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(p.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-3 space-x-2">
                  <Link to={`/admin/cms/edit/${p._id}`} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Edit</Link>
                  <button onClick={() => remove(p._id)} className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


