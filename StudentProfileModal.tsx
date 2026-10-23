import React, { useState } from 'react';
import { UserProgress } from './types';
import { ShareProgressModal } from './components/ShareProgressModal';
import { YunAvatar3D } from './components/YunAvatar3D';
import { updateUserSchool, logout } from './firebaseService';
import { POPULAR_TANZANIAN_INSTITUTIONS } from './AuthModal';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProgress;
  userName?: string;
  onOpenWallet?: () => void;
  onOpenPlanner?: () => void;
  onOpenBadges?: () => void;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  onUpdateUserProgress?: (progress: UserProgress) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userName = 'EducationTZ Scholar',
  onOpenWallet,
  onOpenPlanner,
  onOpenBadges,
  onOpenAuth,
  onSignOut,
  onUpdateUserProgress,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [schoolInput, setSchoolInput] = useState(user.schoolOrUniversity || '');
  const [isSavingSchool, setIsSavingSchool] = useState(false);
  const [schoolSaveSuccess, setSchoolSaveSuccess] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isOpen) return null;

  const displayName = user.displayName || (user.email ? user.email.split('@')[0] : userName);
  const currentSchool = user.schoolOrUniversity || 'Tanzanian School / University';

  const handleSaveSchool = async () => {
    if (!schoolInput.trim()) return;
    setIsSavingSchool(true);
    try {
      if (user.userId) {
        await updateUserSchool(user.userId, schoolInput.trim(), displayName);
      }
      if (onUpdateUserProgress) {
        onUpdateUserProgress({
          ...user,
          schoolOrUniversity: schoolInput.trim(),
        });
      }
      setIsEditingSchool(false);
      setSchoolSaveSuccess(true);
      setTimeout(() => setSchoolSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to update school:', e);
    } finally {
      setIsSavingSchool(false);
    }
  };

  const handleSignOutClick = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      if (onSignOut) onSignOut();
      onClose();
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in overflow-y-auto font-sans">
        <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden relative text-left my-8 max-h-[92vh] flex flex-col">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-indigo-500 rounded-3xl p-1 shadow-xl">
                  <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center overflow-hidden">
                    <YunAvatar3D size="md" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase border border-white">
                  Lvl {user.level || 1}
                </span>
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 font-extrabold text-[11px] border border-indigo-400/30 uppercase">
                    Student Profile
                  </span>
                  {user.email === 'austinreuben95@gmail.com' && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                      PRO
                    </span>
                  )}
                  {user.userId ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                      ✓ Connected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      Guest Scholar
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-black capitalize text-white">{displayName}</h2>
                <p className="text-xs text-indigo-200 font-medium">
                  {user.email || 'student@educationtz.app'}
                </p>
              </div>
            </div>

            {/* School / University Attending Card Header */}
            <div className="mt-5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                    School / University Attending
                  </span>
                  <span className="text-xs font-extrabold text-white truncate block">
                    {user.schoolOrUniversity || 'Click Edit to Add Your School / University'}
                  </span>
                </div>
              </div>

              {!isEditingSchool && (
                <button
                  onClick={() => {
                    setSchoolInput(user.schoolOrUniversity || '');
                    setIsEditingSchool(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer active:scale-95"
                >
                  <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                  <span>{user.schoolOrUniversity ? 'Change School' : 'Add School'}</span>
                </button>
              )}
            </div>

            {/* Inline School Editor */}
            {isEditingSchool && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-900 border border-amber-400/50 space-y-2 animate-fade-in">
                <label className="text-[11px] font-bold text-amber-300 block">
                  Select or type your School or University in Tanzania:
                </label>
                <input
                  list="tz-schools-profile-list"
                  type="text"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  placeholder="e.g. Ilboru Secondary, Kibaha, Tabora Boys, UDSM, UDOM..."
                  className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-white text-gray-900 border border-gray-300 focus:border-amber-400 outline-none"
                />
                <datalist id="tz-schools-profile-list">
                  {POPULAR_TANZANIAN_INSTITUTIONS.map((inst, idx) => (
                    <option key={idx} value={inst} />
                  ))}
                </datalist>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsEditingSchool(false)}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSchool}
                    disabled={isSavingSchool || !schoolInput.trim()}
                    className="px-3.5 py-1 rounded-lg text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <i className="fa-solid fa-check text-[10px]"></i>
                    <span>{isSavingSchool ? 'Saving...' : 'Save School'}</span>
                  </button>
                </div>
              </div>
            )}

            {schoolSaveSuccess && (
              <div className="mt-2 text-xs font-bold text-emerald-300 flex items-center gap-1 animate-fade-in">
                <i className="fa-solid fa-circle-check"></i>
                <span>School / University saved to your cloud profile!</span>
              </div>
            )}
          </div>

          {/* Body Content Stats Grid */}
          <div className="p-6 md:p-8 space-y-5 overflow-y-auto">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-100 text-center">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center mx-auto mb-1 text-sm font-black">
                  <i className="fa-solid fa-fire"></i>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 block">
                  Streak
                </span>
                <p className="text-xl font-black text-slate-900">{user.streak} Days</p>
              </div>

              <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100 text-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-700 flex items-center justify-center mx-auto mb-1 text-sm font-black">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-800 block">
                  EP Points
                </span>
                <p className="text-xl font-black text-slate-900">{user.points} EP</p>
              </div>

              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 text-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center mx-auto mb-1 text-sm font-black">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                  Mastered
                </span>
                <p className="text-xl font-black text-slate-900">{user.completedTopics.length} Topics</p>
              </div>
            </div>

            {/* Quick Links & Wallet */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-lg font-bold shrink-0">
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">Study Credits Wallet</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Swap your EP for Yun AI Credits ({user.credits} Credits Available)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenWallet) onOpenWallet();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm transition shrink-0 text-center cursor-pointer active:scale-95"
              >
                Open Wallet
              </button>
            </div>

            {/* Badges & Trophies Showcase Card */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center text-lg font-bold shadow-xs shrink-0">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">Scholar Awards & Badges</h4>
                  <p className="text-[11px] text-slate-600 font-medium">
                    View streak awards, subject trophies, and bonus EP rewards!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenBadges) onOpenBadges();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs transition shrink-0 text-center cursor-pointer active:scale-95"
              >
                View Badges
              </button>
            </div>

            {/* Direct Sign In / Sign Out Action Bar */}
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {user.email || user.userId ? (
                <button
                  onClick={handleSignOutClick}
                  disabled={isSigningOut}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs border border-rose-200 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  title="Sign out of your EducationTZ account"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket text-rose-600"></i>
                  <span>{isSigningOut ? 'Signing out...' : 'Sign Out (Toka)'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span>Sign In to Save Progress</span>
                </button>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <i className="fa-solid fa-share-nodes text-xs"></i>
                  <span>Share Progress</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareProgressModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        studentName={displayName}
        points={user.points}
        streak={user.streak}
        completedTopicsCount={user.completedTopics.length}
        customTitle="Share Progress Report"
      />
    </>
  );
};

export default StudentProfileModal;
