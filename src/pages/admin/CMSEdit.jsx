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
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-4 max-w-3xl">
        <label className="block">
          <span className="text-sm text-gray-700">Title</span>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-700">Slug (optional)</span>
          <input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-700">Content</span>
          <div className="mt-2">
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
                content_style: 'body { font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; font-size:14px }'
              }}
            />
          </div>
        </label>
        <div className="flex justify-end gap-2">
          <button onClick={() => navigate('/admin/cms')} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">Cancel</button>
          <button onClick={save} disabled={saving} className="px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}


