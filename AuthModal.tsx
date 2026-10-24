import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  signUpWithEmail, 
  loginAsGuestScholar, 
  updateUserSchool, 
  logout 
} from './firebaseService';
import { UserProgress } from './types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  userProgress?: UserProgress | null;
  onUpdateUserProgress?: (progress: UserProgress) => void;
}

export const POPULAR_TANZANIAN_INSTITUTIONS = [
  'University of Dar es Salaam (UDSM)',
  'University of Dodoma (UDOM)',
  'Sokoine University of Agriculture (SUA)',
  'Mbeya University of Science & Technology (MUST)',
  'Ardhi University (ARU)',
  'Dar es Salaam Institute of Technology (DIT)',
  'Muhimbili University of Health & Allied Sciences (MUHAS)',
  'State University of Zanzibar (SUZA)',
  'Ilboru Secondary School',
  'Kibaha High School',
  'Tabora Boys Secondary School',
  'Tabora Girls Secondary School',
  'Kilakala Girls High School',
  'Mzumbe Secondary School',
  'Marian Girls High School',
  'St. Francis Girls Secondary',
  'Feza Boys / Feza Girls',
  'Jangwani Secondary School',
  'Azania Secondary School',
  'Tambaza Secondary School'
];

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser,
  userProgress,
  onUpdateUserProgress
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'guest'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [schoolOrUniversity, setSchoolOrUniversity] = useState(userProgress?.schoolOrUniversity || '');
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [editSchoolValue, setEditSchoolValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopupBlockedFallback, setShowPopupBlockedFallback] = useState(false);

  useEffect(() => {
    if (userProgress?.schoolOrUniversity) {
      setSchoolOrUniversity(userProgress.schoolOrUniversity);
      setEditSchoolValue(userProgress.schoolOrUniversity);
    }
  }, [userProgress]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setShowPopupBlockedFallback(false);
    setLoading(true);

    try {
      await loginWithGoogle(schoolOrUniversity);
      setSuccessMsg('Successfully signed in with Google!');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      if (errCode === 'auth/popup-closed-by-user' || errMsg.includes('popup-closed-by-user')) {
        setErrorMsg('Sign-in popup was closed before completing authentication.');
      } else if (errCode === 'auth/popup-blocked' || errMsg.includes('popup-blocked')) {
        setErrorMsg('Pop-up window was blocked by your browser or iframe security settings.');
        setShowPopupBlockedFallback(true);
      } else if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized-domain')) {
        setErrorMsg('Current domain is in preview sandbox. Use Instant Scholar Login below to bypass.');
        setShowPopupBlockedFallback(true);
      } else {
        setErrorMsg(errMsg || 'Google Sign-In encountered an issue. Try Email or Quick Scholar Login.');
        setShowPopupBlockedFallback(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMsg('Welcome back! Signed in successfully.');
      } else {
        await signUpWithEmail(email, password, displayName, schoolOrUniversity);
        setSuccessMsg('Account created successfully! Welcome to EducationTZ.');
      }
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      console.error('Email auth error:', err);
      let msg = err?.message || 'Authentication error occurred.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = 'Incorrect email or password. Please re-check your details.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Switch to Sign In.';
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

  const handleGuestLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const name = displayName.trim() || 'Tanzanian Scholar';
      const inst = schoolOrUniversity.trim() || 'Ilboru Secondary School';
      await loginAsGuestScholar(name, inst);
      setSuccessMsg(`Welcome, ${name}! Signed in successfully.`);
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      console.error('Guest login failed:', err);
      setErrorMsg(err?.message || 'Failed to initialize instant session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchoolEdit = async () => {
    if (!currentUser || !editSchoolValue.trim()) return;
    setLoading(true);
    try {
      await updateUserSchool(currentUser.uid, editSchoolValue.trim(), displayName || currentUser.displayName || undefined);
      setSchoolOrUniversity(editSchoolValue.trim());
      setIsEditingSchool(false);
      setSuccessMsg('School / University updated successfully!');
      if (onUpdateUserProgress && userProgress) {
        onUpdateUserProgress({
          ...userProgress,
          schoolOrUniversity: editSchoolValue.trim()
        });
      }
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to update school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await logout();
      setSuccessMsg('Signed out successfully.');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setErrorMsg('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-fade-in text-left font-sans">
      <div className="liquid-glass-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
          title="Funga (Close)"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {currentUser ? (
          /* ========================================================================= */
          /* 1. CURRENTLY LOGGED IN VIEW WITH SCHOOL / UNIVERSITY & SIGN OUT           */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-tz-blue via-indigo-600 to-tz-purple text-white flex items-center justify-center text-3xl font-black mx-auto shadow-lg shadow-sky-500/20 border-4 border-white dark:border-slate-800">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (currentUser.displayName || currentUser.email || 'S')[0].toUpperCase()
                )}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Signed In Active Account
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                  {currentUser.displayName || userProgress?.displayName || 'Tanzanian Scholar'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {currentUser.email || 'student@educationtz.app'}
                </p>
              </div>
            </div>

            {/* School / University Information Card */}
            <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/50 p-4 sm:p-5 rounded-2xl border-2 border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <i className="fa-solid fa-graduation-cap text-indigo-600"></i>
                  School / University Attending
                </span>
                {!isEditingSchool && (
                  <button
                    onClick={() => {
                      setIsEditingSchool(true);
                      setEditSchoolValue(schoolOrUniversity || userProgress?.schoolOrUniversity || '');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <i className="fa-solid fa-pen-to-square text-[11px]"></i>
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {!isEditingSchool ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-sm">
                    <i className="fa-solid fa-school"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
                      {schoolOrUniversity || userProgress?.schoolOrUniversity || 'No School Specified Yet'}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Your study records, quiz ranks & certificates will display this institution.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1 animate-fade-in">
                  <input
                    list="tz-schools-list-edit"
                    type="text"
                    value={editSchoolValue}
                    onChange={(e) => setEditSchoolValue(e.target.value)}
                    placeholder="Type or select your School or University..."
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-300 focus:border-indigo-600 outline-none text-xs font-bold text-gray-900 bg-white"
                  />
                  <datalist id="tz-schools-list-edit">
                    {POPULAR_TANZANIAN_INSTITUTIONS.map((inst, idx) => (
                      <option key={idx} value={inst} />
                    ))}
                  </datalist>

                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button
                      onClick={() => setIsEditingSchool(false)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSchoolEdit}
                      disabled={loading || !editSchoolValue.trim()}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <i className="fa-solid fa-check"></i>
                      <span>Save School</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats Snapshot */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-black uppercase text-amber-700 block">Streak</span>
                <span className="text-lg font-black text-amber-900">{userProgress?.streak || 1} Days 🔥</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                <span className="text-[10px] font-black uppercase text-indigo-700 block">Study Points</span>
                <span className="text-lg font-black text-indigo-900">{userProgress?.points || 100} EP 🏆</span>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-rose-600"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Direct Big Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs sm:text-sm border-2 border-rose-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-rose-600"></i>
              <span>{loading ? 'Signing out...' : 'Sign Out of Account (Toka)'}</span>
            </button>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. SIGN IN / SIGN UP FORM WITH SCHOOL SELECTOR & POPUP-RESISTANT FALLBACK */
          /* ========================================================================= */
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-tz-blue via-indigo-600 to-tz-purple text-white flex items-center justify-center text-xl mx-auto shadow-md shadow-indigo-200 mb-2">
                <i className="fa-solid fa-user-graduate"></i>
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                {mode === 'signup'
                  ? 'Join EducationTZ'
                  : mode === 'guest'
                  ? 'Instant Student Login'
                  : 'Sign In to EducationTZ'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Sync syllabus notes, past paper rankings, and AI tutor progress across all your devices.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); setShowPopupBlockedFallback(false); }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                  mode === 'signin' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); setShowPopupBlockedFallback(false); }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                  mode === 'signup' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setMode('guest'); setErrorMsg(''); setShowPopupBlockedFallback(false); }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center ${
                  mode === 'guest' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Instant 1-Click Guest Login without Password"
              >
                Instant ⚡
              </button>
            </div>

            {/* Google Sign In Button */}
            {mode !== 'guest' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-gray-200 hover:border-indigo-500 bg-white text-gray-700 font-extrabold text-xs transition flex items-center justify-center gap-3 shadow-xs hover:shadow-sm cursor-pointer active:scale-98"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="bg-white px-3 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider relative">
                    Or with Email & Password
                  </span>
                </div>
              </div>
            )}

            {/* Popup Blocked / Cross-Origin Help Banner */}
            {showPopupBlockedFallback && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <i className="fa-solid fa-shield-halved text-amber-600"></i>
                  <span>Browser Security Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Third-party cookie or popup restrictions prevented Google sign-in. You can use <strong>Instant Student Sign-In</strong> or standard Email Sign-In without any popups:
                </p>
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i className="fa-solid fa-bolt"></i>
                  <span>Continue with Instant Student Login</span>
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation shrink-0 text-sm"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <i className="fa-solid fa-circle-check shrink-0 text-sm"></i>
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM BODY */}
            {mode === 'guest' ? (
              /* INSTANT GUEST SCHOLAR FORM */
              <div className="space-y-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider">
                    ⚡ Instant Friction-Free Scholar Access
                  </span>
                  <p className="text-xs text-gray-600 font-medium">
                    No password required! Immediately activates your cloud study profile and syllabus tracker.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">
                    Your Name or Nickname
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Baraka Mwita"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 outline-none text-xs font-semibold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">
                    School or University You Are Studying
                  </label>
                  <input
                    list="tz-schools-list-guest"
                    type="text"
                    value={schoolOrUniversity}
                    onChange={(e) => setSchoolOrUniversity(e.target.value)}
                    placeholder="e.g. Ilboru Secondary, Kibaha, or UDSM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 outline-none text-xs font-semibold text-gray-900 bg-white"
                  />
                  <datalist id="tz-schools-list-guest">
                    {POPULAR_TANZANIAN_INSTITUTIONS.map((inst, idx) => (
                      <option key={idx} value={inst} />
                    ))}
                  </datalist>
                </div>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 cursor-pointer active:scale-98"
                >
                  <i className="fa-solid fa-bolt"></i>
                  <span>{loading ? 'Starting Session...' : 'Start Learning as Student'}</span>
                </button>
              </div>
            ) : (
              /* EMAIL SIGN IN OR SIGN UP FORM */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neema Peter"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs font-medium text-gray-800"
                      required
                    />
                  </div>
                )}

                {/* School or University Input (Shown during Signup and available during Signin) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1 flex items-center justify-between">
                      <span>School or University You Are Studying</span>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase">Tanzania</span>
                    </label>
                    <input
                      list="tz-schools-list-signup"
                      type="text"
                      placeholder="e.g. Tabora Boys, Marian Girls, UDSM, UDOM..."
                      value={schoolOrUniversity}
                      onChange={(e) => setSchoolOrUniversity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs font-medium text-gray-800"
                    />
                    <datalist id="tz-schools-list-signup">
                      {POPULAR_TANZANIAN_INSTITUTIONS.map((inst, idx) => (
                        <option key={idx} value={inst} />
                      ))}
                    </datalist>

                    {/* Quick Pick Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-gray-400 font-bold">Quick Select:</span>
                      {['UDSM', 'UDOM', 'SUA', 'MUST', 'Ilboru', 'Kibaha', 'Tabora Boys'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSchoolOrUniversity(p)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 transition cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs font-medium text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-xs font-medium text-gray-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    <i className={`fa-solid ${mode === 'signin' ? 'fa-right-to-bracket' : 'fa-user-plus'}`}></i>
                  )}
                  <span>{mode === 'signin' ? 'Sign In to Account' : 'Create Student Account'}</span>
                </button>
              </form>
            )}

            {/* Footer switcher */}
            <div className="text-center pt-2 border-t border-gray-100">
              {mode === 'signin' ? (
                <p className="text-xs text-gray-500">
                  New to EducationTZ?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(''); }}
                    className="font-extrabold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMsg(''); }}
                    className="font-extrabold text-indigo-600 hover:underline cursor-pointer"
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
