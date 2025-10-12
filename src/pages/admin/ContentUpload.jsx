import React from "react"
import { apiGet } from '../../utils/api'

export default function ContentUpload() {
  const [msg, setMsg] = React.useState('')
  const [err, setErr] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState('')

  async function handleSubmit(e){
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      title: form.get('title'),
      description: form.get('description'),
      imageUrl: imageUrl || null,
    }
    setErr('')
    if (!payload.title || !payload.imageUrl) {
      setErr('Title and image are required.')
      setMsg('')
      return
    }
    console.log('Content upload payload:', payload)
    setMsg('Content submitted successfully.')
    e.currentTarget.reset()
    setImageUrl('')
  }

  async function handleFileChange(e){
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const { timestamp, signature } = await apiGet('/api/cloudinary-signature')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY)
      formData.append('timestamp', timestamp)
      formData.append('signature', signature)
      formData.append('upload_preset', 'casadeele_materials')
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData })
      if (!resp.ok) throw new Error('Upload failed')
      const data = await resp.json()
      setImageUrl(data.secure_url)
      setMsg('Image uploaded successfully.')
    } catch (er) {
      console.error(er)
      setErr('Image upload failed.')
      setMsg('')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Content Upload</h1>
      {err && <div className="max-w-2xl rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2">{err}</div>}
      {msg && <div className="max-w-2xl rounded-md border border-green-200 bg-green-50 text-green-700 px-4 py-2">{msg}</div>}

      <form onSubmit={handleSubmit} className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input 
            name="title" 
            required 
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm 
                       focus:border-red-600 focus:ring-2 focus:ring-red-600/30 focus:bg-white 
                       transition-all duration-200 placeholder-gray-400" 
            placeholder="Enter title" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Image (Cloudinary)</label>
          <input 
            onChange={handleFileChange} 
            type="file" 
            accept="image/*" 
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm 
                       focus:border-red-600 focus:ring-2 focus:ring-red-600/30 focus:bg-white 
                       transition-all duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-md 
                       file:border-0 file:bg-red-600 file:text-white file:text-sm hover:file:bg-red-700 cursor-pointer" 
          />
          {uploading && <div className="text-sm text-gray-500 mt-1">Uploading...</div>}
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="preview" className="h-32 rounded-md border shadow-sm" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea 
            name="description" 
            rows="4" 
            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm 
                       focus:border-red-600 focus:ring-2 focus:ring-red-600/30 focus:bg-white 
                       transition-all duration-200 placeholder-gray-400" 
            placeholder="Write a description..." 
          />
        </div>

        <button 
          type="submit" 
          className="inline-flex items-center px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
