import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, signInWithEmailAndPassword, signOut } from '../../firebase';
import Spinner from '../../components/Common/Spinner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);


  async function verifyAdminStatus(token) {
    try {
      const response = await fetch('/api/admins/check-status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch (error) {
      console.error("Admin check failed:", error);
      return false;
    }
  }



  
  async function handleEmailSignIn(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      
      const isAdmin = await verifyAdminStatus(token);

      if (isAdmin) {
        localStorage.setItem('authToken', token);
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. You do not have admin privileges.');
        await signOut(auth); // Sign out the non-admin user
      }
    } catch (e) {
      switch (e.code) {
        case 'auth/invalid-email':
          setError('The email address is not valid.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
           setError('Access has been temporarily disabled due to many failed login attempts.');
           break;
        default:
          setError('An unexpected error occurred. Please try again.');
          console.error("Firebase Auth Error:", e);
          break;
      }
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 justify-center mb-6">
          <img src="/Horizontal_1.svg" alt="Casa De ELE" className="h-8 w-auto" />
          <span className="text-sm text-gray-500">| Admin Panel</span>
        </div>
        <h1 className="text-xl font-semibold text-center mb-4">Admin Sign In</h1>
        {error && <div className="mb-3 text-sm text-red-600 text-center">{error}</div>}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
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
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800 disabled:opacity-60 transition">
            {loading ? <Spinner /> : null}Sign in
          </button>
        </form>
      </div>
    </div>
  );
}