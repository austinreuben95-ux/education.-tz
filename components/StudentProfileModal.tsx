import React, { useState } from 'react';
import { UserProgress } from '../types';
import { ShareProgressModal } from './ShareProgressModal';
import { YunAvatar3D } from './YunAvatar3D';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProgress;
  userName?: string;
  onOpenWallet?: () => void;
  onOpenPlanner?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userName = 'EducationTZ Scholar',
  onOpenWallet,
  onOpenPlanner,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!isOpen) return null;

  const displayName = user.email ? user.email.split('@')[0] : userName;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden relative text-left my-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition"
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
                </div>
                <h2 className="text-2xl font-black capitalize text-white">{displayName}</h2>
                <p className="text-xs text-indigo-200 font-medium">
                  {user.email || 'student@educationtz.app'}
                </p>
              </div>
            </div>

            {/* Quick Share Progress Action Card Banner */}
            <div className="mt-6 pt-5 border-t border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                  Classroom Milestones
                </span>
                <p className="text-xs text-gray-200 font-medium">
                  Share your recent learning results with parents or classmates!
                </p>
              </div>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <i className="fa-solid fa-share-nodes text-xs"></i>
                <span>Share Progress</span>
              </button>
            </div>
          </div>

          {/* Body Content Stats Grid */}
          <div className="p-6 md:p-8 space-y-6">
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
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-lg font-bold">
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
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm transition shrink-0 text-center"
              >
                Open Wallet
              </button>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-share-nodes"></i>
                <span>Share Student Progress Report</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition text-center"
              >
                Close
              </button>
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
