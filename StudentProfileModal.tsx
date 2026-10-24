import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { ShareProgressModal } from './ShareProgressModal';
import { ScholarAvatar } from './ScholarAvatar';
import { AvatarPickerModal } from './AvatarPickerModal';
import { getScholarAvatar } from '../src/data/scholarAvatars';
import { updateUserSchoolDetails, updateUserAvatar } from '../services/firebaseService';

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
  onUpdateUserProgress?: (updated: Partial<UserProgress>) => void;
  onOpenAvatarPicker?: () => void;
}

const TANZANIAN_REGIONS = [
  'Dar es Salaam',
  'Arusha',
  'Kilimanjaro',
  'Dodoma',
  'Mwanza',
  'Morogoro',
  'Tanga',
  'Mbeya',
  'Kagera',
  'Iringa',
  'Tabora',
  'Kigoma',
  'Ruvuma',
  'Shinyanga',
  'Mara',
  'Manyara',
  'Pwani',
  'Singida',
  'Lindi',
  'Mtwara',
  'Rukwa',
  'Katavi',
  'Geita',
  'Simiyu',
  'Njombe',
  'Songwe',
  'Unguja Mjini Magharibi',
  'Unguja Kaskazini',
  'Unguja Kusini',
  'Pemba Kaskazini',
  'Pemba Kusini'
];

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
  onOpenAvatarPicker,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // School Profile Form State
  const [schoolName, setSchoolName] = useState(user.schoolOrUniversity || '');
  const [schoolRegion, setSchoolRegion] = useState(user.schoolRegion || user.region || 'Dar es Salaam');
  const [headTeacherName, setHeadTeacherName] = useState(user.headTeacherName || '');
  const [educationStage, setEducationStage] = useState<UserProgress['educationStage']>(
    user.educationStage || 'Secondary'
  );
  const [displayNameInput, setDisplayNameInput] = useState(user.displayName || userName);

  const [isSavingSchool, setIsSavingSchool] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setSchoolName(user.schoolOrUniversity || '');
    setSchoolRegion(user.schoolRegion || user.region || 'Dar es Salaam');
    setHeadTeacherName(user.headTeacherName || '');
    setEducationStage(user.educationStage || 'Secondary');
    setDisplayNameInput(user.displayName || userName);
  }, [user, userName]);

  if (!isOpen) return null;

  const displayName = user.email ? (user.displayName || user.email.split('@')[0]) : displayNameInput;
  const currentAvatar = getScholarAvatar(user.avatarId);

  const handleSaveSchoolProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!schoolName.trim()) return;

    setIsSavingSchool(true);
    setSaveSuccessMsg(null);

    const updatedData: Partial<UserProgress> = {
      schoolOrUniversity: schoolName.trim(),
      schoolRegion: schoolRegion.trim(),
      headTeacherName: headTeacherName.trim(),
      educationStage: educationStage,
      displayName: displayNameInput.trim(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (user.userId) {
        await updateUserSchoolDetails(user.userId, {
          schoolOrUniversity: schoolName.trim(),
          schoolRegion: schoolRegion.trim(),
          headTeacherName: headTeacherName.trim(),
          educationStage: educationStage,
          displayName: displayNameInput.trim()
        });
      } else {
        // Guest or offline mode persistence
        localStorage.setItem('tz_school_name', schoolName.trim());
        localStorage.setItem('tz_school_region', schoolRegion.trim());
        localStorage.setItem('tz_head_teacher', headTeacherName.trim());
        localStorage.setItem('tz_student_name', displayNameInput.trim());
      }

      if (onUpdateUserProgress) {
        onUpdateUserProgress(updatedData);
      }

      setSaveSuccessMsg('Taarifa za shule zimehifadhiwa kikamilifu kwenye Firebase!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Error saving school profile:', err);
    } finally {
      setIsSavingSchool(false);
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    try {
      if (user.userId) {
        await updateUserAvatar(user.userId, avatarId);
      } else {
        localStorage.setItem('tz_selected_avatar', avatarId);
      }
      if (onUpdateUserProgress) {
        onUpdateUserProgress({ avatarId });
      }
    } catch (e) {
      console.error('Error updating avatar:', e);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[100] p-3 sm:p-5 animate-fade-in overflow-y-auto">
        <div className="liquid-glass-card rounded-3xl w-full max-w-2xl shadow-2xl border border-white/60 dark:border-slate-800 overflow-hidden relative text-left my-6 max-h-[92vh] flex flex-col">
          {/* Liquid Glass Header Banner */}
          <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-950 text-white p-5 sm:p-7 relative shrink-0 border-b border-white/10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer active:scale-95"
              aria-label="Funga"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              {/* Scholar Avatar with Liquid Glass Glow & Quick Change Button */}
              <div className="relative group shrink-0">
                <ScholarAvatar
                  avatarId={user.avatarId}
                  size="xl"
                  showLevel
                  level={user.level || 1}
                  showGlow
                />
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-[10px] uppercase shadow-md flex items-center gap-1 cursor-pointer transition active:scale-95 border border-white"
                  title="Badili Avatar / Change Avatar"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-[9px]"></i>
                  <span>Badili</span>
                </button>
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-cyan-200 font-extrabold text-[11px] border border-indigo-400/30 uppercase">
                    {currentAvatar.badge}
                  </span>
                  {user.email === 'austinreuben95@gmail.com' && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                      ADMIN / PRO
                    </span>
                  )}
                  <span className="text-[11px] text-indigo-300 font-medium">
                    {currentAvatar.englishTitle}
                  </span>
                </div>

                <h2 className="text-2xl font-black capitalize text-white truncate">{displayName}</h2>

                <div className="flex items-center gap-2 text-xs text-indigo-200 font-medium truncate">
                  <i className="fa-solid fa-graduation-cap text-sky-400"></i>
                  <span className="truncate">{user.schoolOrUniversity || 'Tanzanian School / University'}</span>
                  {user.schoolRegion && (
                    <>
                      <span>·</span>
                      <span className="text-amber-300">{user.schoolRegion}</span>
                    </>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 italic">
                  "{currentAvatar.motto}"
                </p>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="mt-4 pt-3.5 border-t border-indigo-500/30 flex items-center justify-between gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-masks-theater text-amber-300"></i>
                <span>Chagua Avatar ({currentAvatar.name})</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {onSignOut && user.userId && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignOut();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs flex items-center gap-1.5 border border-rose-400/30 transition active:scale-95 cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket text-[10px]"></i>
                    <span>Toka (Sign Out)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>Share Progress</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1">
            {/* Success Toast */}
            {saveSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-scale-up">
                <i className="fa-solid fa-circle-check text-emerald-600 dark:text-emerald-400 text-base"></i>
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* NEW: SCHOOL PROFILE SECTION */}
            <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-br from-sky-50/70 via-indigo-50/40 to-white/70 dark:from-slate-800/80 dark:via-slate-850/70 dark:to-slate-900/80 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <i className="fa-solid fa-school"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      School Profile (Taarifa za Shule)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ingiza taarifa za shule yako, mkoa na mwalimu mkuu ili zihifadhiwe kwenye Firebase
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Firebase Sync
                </span>
              </div>

              <form onSubmit={handleSaveSchoolProfile} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* School / College Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <i className="fa-solid fa-graduation-cap text-sky-600 text-[10px]"></i>
                      <span>Jina la Shule / Chuo (School Name) *</span>
                    </label>
                    <input
                      type="text"
                      list="tanzanian-schools-list"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Ilboru Secondary School, Feza Boys..."
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <datalist id="tanzanian-schools-list">
                      <option value="Ilboru Secondary School" />
                      <option value="Kibaha Secondary School" />
                      <option value="Tabora Boys Secondary School" />
                      <option value="Tabora Girls Secondary School" />
                      <option value="Mzumbe Secondary School" />
                      <option value="Kilakala Secondary School" />
                      <option value="Feza Boys Secondary School" />
                      <option value="Feza Girls Secondary School" />
                      <option value="Marian Boys High School" />
                      <option value="Marian Girls High School" />
                      <option value="St. Francis Girls Secondary School" />
                      <option value="Loyola High School" />
                      <option value="Jangwani Secondary School" />
                      <option value="Tambaza High School" />
                      <option value="Azania Secondary School" />
                      <option value="Benjamin Mkapa High School" />
                      <option value="Weruweru Secondary School" />
                      <option value="Machame Girls Secondary School" />
                      <option value="Minaki Secondary School" />
                      <option value="Tosamaganga High School" />
                      <option value="University of Dar es Salaam (UDSM)" />
                      <option value="University of Dodoma (UDOM)" />
                      <option value="Sokoine University of Agriculture (SUA)" />
                      <option value="Mbeya University of Science and Technology (MUST)" />
                    </datalist>
                  </div>

                  {/* Region */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <i className="fa-solid fa-map-location-dot text-indigo-600 text-[10px]"></i>
                      <span>Mkoa wa Shule (Region) *</span>
                    </label>
                    <select
                      value={schoolRegion}
                      onChange={(e) => setSchoolRegion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {TANZANIAN_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Head Teacher / Mwalimu Mkuu */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <i className="fa-solid fa-user-tie text-emerald-600 text-[10px]"></i>
                      <span>Mwalimu Mkuu (Head Teacher Name)</span>
                    </label>
                    <input
                      type="text"
                      value={headTeacherName}
                      onChange={(e) => setHeadTeacherName(e.target.value)}
                      placeholder="e.g. Mwl. J. Mwasiti / Dr. Lyimo"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Education Stage */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <i className="fa-solid fa-layer-group text-purple-600 text-[10px]"></i>
                      <span>Ngazi ya Masomo (Stage)</span>
                    </label>
                    <select
                      value={educationStage}
                      onChange={(e) => setEducationStage(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Secondary">Secondary School (O-Level Form 1-4)</option>
                      <option value="High School">High School (A-Level Form 5-6)</option>
                      <option value="Primary">Primary School (Standard 1-7)</option>
                      <option value="University / College">University / College Degree</option>
                      <option value="Other">Other / Independent Candidate</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Taarifa hizi zitaonekana kwenye ripoti zako za maendeleo na kadi ya mwanafunzi.
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSchool}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 shrink-0"
                  >
                    {isSavingSchool ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                        <span>Inahifadhi...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk text-xs"></i>
                        <span>Hifadhi Shule (Save School Profile)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="liquid-glass-pill p-3.5 rounded-2xl text-center border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto mb-1 text-sm font-black">
                  <i className="fa-solid fa-fire"></i>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 dark:text-amber-300 block">
                  Streak
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{user.streak} Days</p>
              </div>

              <div className="liquid-glass-pill p-3.5 rounded-2xl text-center border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/60 dark:bg-indigo-950/30">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mx-auto mb-1 text-sm font-black">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-800 dark:text-indigo-300 block">
                  EP Points
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{user.points} EP</p>
              </div>

              <div className="liquid-glass-pill p-3.5 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-1 text-sm font-black">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 dark:text-emerald-300 block">
                  Mastered
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {user.completedTopics.length} Topics
                </p>
              </div>
            </div>

            {/* Quick Links: Wallet & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="liquid-glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded-xl flex items-center justify-center text-sm font-bold shrink-0">
                    <i className="fa-solid fa-wallet"></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      Study Credits Wallet
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.credits} AI Credits Available
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenWallet) onOpenWallet();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition shrink-0 cursor-pointer"
                >
                  Fungua
                </button>
              </div>

              <div className="liquid-glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center text-sm font-bold shrink-0">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      Scholar Badges & Awards
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Tuzo na rekodi za ufaulu
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenBadges) onOpenBadges();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-xs transition shrink-0 cursor-pointer"
                >
                  Tuzo
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-share-nodes"></i>
                <span>Share Student Report</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition text-center cursor-pointer"
              >
                Funga (Close)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nested Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarId={user.avatarId}
        onSelectAvatar={handleAvatarSelect}
        userName={displayName}
        schoolName={schoolName || 'Tanzanian School / University'}
        level={user.level || 1}
      />

      {/* Share Progress Modal */}
      <ShareProgressModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        studentName={displayName}
        points={user.points}
        streak={user.streak}
        completedTopicsCount={user.completedTopics.length}
        customTitle="Share Student Progress Report"
      />
    </>
  );
};
