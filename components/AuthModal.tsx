import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { loginWithGoogle, loginWithEmail, signUpWithEmail, logout } from '../services/firebaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user')) {
        setErrorMsg('Sign-in window was closed before completion.');
      } else if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        setErrorMsg('Pop-up window was blocked. Please allow pop-ups for this site.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setErrorMsg('Sign-in request was cancelled.');
      } else {
        setErrorMsg(err?.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      onClose();
    } catch (err: any) {
      let msg = err?.message || 'Authentication error occurred.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters long.';
      } else if (msg.includes('auth/invalid-email')) {
        msg = 'Please enter a valid email address.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await logout();
      onClose();
    } catch (err: any) {
      console.error('Sign out error:', err);
      setErrorMsg('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {currentUser ? (
          /* LOGGED IN VIEW */
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-black mx-auto shadow-inner border-4 border-white">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()
              )}
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-2">
                <i className="fa-solid fa-circle-check mr-1"></i> Signed In
              </span>
              <h2 className="text-2xl font-black text-gray-900">
                {currentUser.displayName || 'Tanzanian Student'}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {currentUser.email}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Account Sync Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <i className="fa-solid fa-cloud"></i> Cloud Active
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>User ID:</span>
                <span className="font-mono text-[10px] text-gray-400">{currentUser.uid.slice(0, 12)}...</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 font-extrabold text-sm border border-red-200 transition flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              {loading ? 'Signing Out...' : 'Sign Out of Account'}
            </button>
          </div>
        ) : (
          /* SIGN IN / SIGN UP FORM */
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-indigo-200 mb-3">
                <i className="fa-solid fa-user-graduate"></i>
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                {mode === 'signin' ? 'Sign In to ElimuTanzania' : 'Create Free Student Account'}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Save study progress, exam scores, notes, and sync across all devices.
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl border-2 border-gray-200 hover:border-indigo-500 bg-white text-gray-700 font-extrabold text-xs transition flex items-center justify-center gap-3 shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] text-gray-400 font-bold uppercase tracking-wider relative">Or with email</span>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation shrink-0"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Amina Juma"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs font-medium text-gray-800"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs font-medium text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs font-medium text-gray-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <i className="fa-solid fa-spinner animate-spin"></i>
                ) : (
                  <i className={`fa-solid ${mode === 'signin' ? 'fa-right-to-bracket' : 'fa-user-plus'}`}></i>
                )}
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              {mode === 'signin' ? (
                <p className="text-xs text-gray-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setMode('signup'); setErrorMsg(''); }}
                    className="font-extrabold text-indigo-600 hover:underline"
                  >
                    Sign Up Free
                  </button>
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Already registered?{' '}
                  <button
                    onClick={() => { setMode('signin'); setErrorMsg(''); }}
                    className="font-extrabold text-indigo-600 hover:underline"
                  >
                    Sign In Here
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
