import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber } from '../../firebase'
import Spinner from '../../components/Common/Spinner'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState(null)
  const [error, setError] = useState('')
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingOTP, setLoadingOTP] = useState(false)
  const [loadingVerify, setLoadingVerify] = useState(false)

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
    // If already authenticated, skip login screen
    const token = localStorage.getItem('authToken')
    if (token) navigate('/admin/dashboard')
  }, [])

  async function handleGoogle() {
    try {
      setLoadingGoogle(true)
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      localStorage.setItem('authToken', token)
      navigate('/admin/dashboard')
    } catch (e) {
      setError(e.message || 'Google sign-in failed')
    } finally {
      setLoadingGoogle(false)
    }
  }

  async function handleSendOTP(e){
    e.preventDefault()
    setError('')
    try {
      setLoadingOTP(true)
      const appVerifier = window.recaptchaVerifier
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier)
      setVerificationId(confirmation)
    } catch(e){
      setError(e.message || 'Failed to send OTP')
    } finally {
      setLoadingOTP(false)
    }
  }

  async function handleVerifyOTP(e){
    e.preventDefault()
    if (!verificationId) return
    try {
      setLoadingVerify(true)
      const result = await verificationId.confirm(otp)
      const token = await result.user.getIdToken()
      localStorage.setItem('authToken', token)
      navigate('/admin/dashboard')
    } catch(e){
      setError(e.message || 'Invalid OTP')
    } finally {
      setLoadingVerify(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 justify-center mb-6">
          <img src="/Horizontal_1.svg" alt="Casa De ELE" className="h-8 w-auto" />
          <span className="text-sm text-gray-500">| Admin Panel</span>
        </div>
        <h1 className="text-xl font-semibold text-center mb-4">Sign in</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <button onClick={handleGoogle} disabled={loadingGoogle} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60 transition mb-4">{loadingGoogle ? <Spinner /> : null}Sign in with Google</button>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" required className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="+1 555 123 4567" />
          </div>
          <div id="recaptcha-container" />
          <button type="submit" disabled={loadingOTP} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-60 transition">{loadingOTP ? <Spinner /> : null}Send OTP</button>
        </form>

        {verificationId && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input value={otp} onChange={e=>setOtp(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="Enter OTP" />
            </div>
            <button type="submit" disabled={loadingVerify} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60 transition">{loadingVerify ? <Spinner /> : null}Verify & Continue</button>
          </form>
        )}
      </div>
    </div>
  )
}


