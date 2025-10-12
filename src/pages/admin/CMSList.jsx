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
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">CMS Pages</h1>
        <button
          onClick={() => navigate('/admin/cms/new')}
          className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 shadow-sm transition-all duration-200"
        >
          + Add Page
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl bg-white shadow-md border border-gray-200 overflow-hidden">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm font-medium">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-3">
                    <div className="h-4 w-56 bg-gray-100 animate-pulse rounded" />
                  </td>
                  <td />
                  <td />
                  <td />
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No CMS pages found.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {p.title}
                  </td>
                  <td className="px-5 py-3 text-gray-700">{p.slug || '—'}</td>
                  <td className="px-5 py-3 text-gray-700">
                    {new Date(p.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 flex justify-end gap-2">
                    <Link
                      to={`/admin/cms/edit/${p._id}`}
                      className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(p._id)}
                      className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
