import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiGet, apiSend } from '../../utils/api'
import { Editor } from '@tinymce/tinymce-react'

export default function CMSEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [form, setForm] = useState({ title: '', slug: '', content: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew && id) {
      apiGet(`/api/cms/${id}`).then(setForm).catch(() => {})
    }
  }, [id, isNew])

  async function save() {
    setSaving(true)
    const payload = form
    try {
      if (isNew) await apiSend('/api/cms', 'POST', payload)
      else await apiSend(`/api/cms/${id}`, 'PUT', payload)
      navigate('/admin/cms')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{isNew ? 'Add Page' : 'Edit Page'}</h1>
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-5 max-w-3xl">
        
        {/* Title */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Title</span>
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Enter page title..."
            className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 
                       text-gray-800 focus:outline-none focus:border-red-600 focus:ring-2 
                       focus:ring-red-100 transition-all duration-200"
          />
        </label>

        {/* Slug */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Slug (optional)</span>
          <input
            value={form.slug || ''}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            placeholder="e.g. about-us"
            className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 
                       text-gray-800 focus:outline-none focus:border-red-600 focus:ring-2 
                       focus:ring-red-100 transition-all duration-200"
          />
        </label>

        {/* Content Editor */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Content</span>
          <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 transition-all duration-200">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={form.content}
              onEditorChange={(v) => setForm({ ...form, content: v })}
              init={{
                height: 400,
                menubar: false,
                plugins: 'link lists table code fullscreen image media',
                toolbar:
                  'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | table | code fullscreen',
                content_style:
                  'body { font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; font-size:14px; color:#111827; background-color:#fff }'
              }}
            />
          </div>
        </label>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate('/admin/cms')}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 
                       disabled:opacity-60 transition"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
