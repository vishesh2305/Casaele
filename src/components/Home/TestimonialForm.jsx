import { useState } from "react";
import { apiSend } from "../../utils/api";

function TestimonialForm() {
  const [name, setName] = useState("")
  const [rating, setRating] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNotice("")
    if (!name.trim() || !message.trim()) {
      setNotice("Please fill name and comment")
      return
    }
    setLoading(true)
    try {
      await apiSend('/api/testimonials/add', 'POST', { name: name.trim(), message: message.trim(), rating: rating ? Number(rating) : undefined })
      setNotice("Thanks! Your testimonial is pending approval.")
      setName("")
      setRating("")
      setMessage("")
    } catch (e) {
      setNotice(e?.message || 'Failed to submit testimonial')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-center font-medium text-2xl sm:text-3xl mb-10">
        Write a testimonial
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
        <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Your Name *" className="border border-gray-300 placeholder-gray-500 px-5 py-3 rounded-lg w-full sm:w-[225px] focus:outline-none focus:ring-2 focus:ring-red-500" />
        <input value={rating} onChange={e=>setRating(e.target.value)} type="number" step="0.1" min="0" max="5" placeholder="Rating (0-5, optional)" className="border border-gray-300 placeholder-gray-500 px-5 py-3 rounded-lg w-full sm:w-[225px] focus:outline-none focus:ring-2 focus:ring-red-500" />
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Comment" className="border border-gray-300 placeholder-gray-500 rounded-xl px-5 py-3 w-full sm:w-[600px] h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
        <div className="w-full sm:w-[600px]">
          <button disabled={loading} className="bg-[rgba(173,21,24,1)] hover:bg-red-700 text-white w-full py-3 rounded-full transition-all disabled:opacity-60">
            {loading ? 'Submitting...' : 'Post'}
          </button>
          {notice && <div className="mt-2 text-sm text-gray-600">{notice}</div>}
        </div>
      </form>
    </div>
  );
}

export default TestimonialForm;
