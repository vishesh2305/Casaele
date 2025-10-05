import React from "react"

export default function ContentUpload() {
  const [msg, setMsg] = React.useState('')
  const [err, setErr] = React.useState('')
  function handleSubmit(e){
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      title: form.get('title'),
      description: form.get('description'),
      fileName: form.get('file')?.name || null,
    }
    setErr('')
    if (!payload.title || !payload.fileName) {
      setErr('Title and file are required.')
      setMsg('')
      return
    }
    console.log('Content upload payload:', payload)
    setMsg('Content submitted successfully (demo).')
    e.currentTarget.reset()
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Content Upload</h1>
      {err && <div className="max-w-2xl rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2">{err}</div>}
      {msg && <div className="max-w-2xl rounded-md border border-green-200 bg-green-50 text-green-700 px-4 py-2">{msg}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input name="title" required className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="Enter title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">File Upload</label>
          <input name="file" type="file" required className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows="4" className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="Write a description..." />
        </div>
        <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 transition">Submit</button>
      </form>
    </div>
  )
}



