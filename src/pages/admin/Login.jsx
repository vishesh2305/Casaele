import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, signInWithEmailAndPassword } from '../../firebase'
import Spinner from '../../components/Common/Spinner';

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState(null)
  const [error, setError] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

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

  async function handleEmailSignIn(e) {
    e.preventDefault();
    setError('');
    setLoadingEmail(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      navigate('/admin/dashboard');
    } catch (e) {
      // Provide more specific feedback based on the Firebase error code
      switch (e.code) {
        case 'auth/invalid-email':
          setError('The email address is not valid. Please check the format.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/too-many-requests':
           setError('Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.');
           break;
        default:
          setError('An unexpected error occurred. Please check your connection and try again.');
          console.error("Firebase Auth Error:", e); // Log the full error for debugging
          break;
      }
    } finally {
      setLoadingEmail(false);
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
        {error && <div className="mb-3 text-sm text-red-600 text-center">{error}</div>}

        {/* NEW Email & Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4 border-b pb-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              type="email" 
              required 
              className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" 
              placeholder="admin@example.com" 
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              type="password" 
              required 
              className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" disabled={loadingEmail} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60 transition">
            {loadingEmail ? <Spinner /> : null}Sign in with Email
          </button>
        </form>

        <div className="flex items-center gap-2 my-4 text-sm">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button onClick={handleGoogle} disabled={loadingGoogle} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition mb-4">
          {loadingGoogle ? <Spinner className="text-gray-700" /> : <img src="/LogIn/Google__G__logo 1.svg" alt="Google" className="w-5 h-5"/>}
          Sign in with Google
        </button>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" required className="mt-1 w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600" placeholder="+91 98765 43210" />
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

