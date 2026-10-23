import React, { useState } from 'react';
import { SCHOLAR_AVATARS, ScholarAvatar as ScholarAvatarType, getScholarAvatar } from '../src/data/scholarAvatars';
import { ScholarAvatar } from './ScholarAvatar';

export interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarId?: string;
  onSelectAvatar: (avatarId: string) => void;
  userName?: string;
  schoolName?: string;
  level?: number;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatarId = 'scholar-stem',
  onSelectAvatar,
  userName = 'Mwanafunzi',
  schoolName = 'Tanzanian School / University',
  level = 1,
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentAvatarId);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: 'Yote (All Avatars)', icon: 'fa-shapes' },
    { id: 'STEM', label: 'Sayansi & Hesabu (STEM)', icon: 'fa-atom' },
    { id: 'Nature & Heritage', label: 'Asili & Urithi (Nature)', icon: 'fa-mountain-sun' },
    { id: 'Humanities', label: 'Fasihi & Sheria (Humanities)', icon: 'fa-book-open' },
    { id: 'Leadership', label: 'Uongozi & Ufaulu (Leadership)', icon: 'fa-crown' },
  ];

  const filteredAvatars = activeCategory === 'ALL'
    ? SCHOLAR_AVATARS
    : SCHOLAR_AVATARS.filter(a => a.category === activeCategory);

  const activeAvatar = getScholarAvatar(selectedId);

  const handleConfirm = () => {
    onSelectAvatar(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Liquid Glass Header */}
        <div className="relative px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 dark:from-sky-950/40 dark:via-indigo-950/40 dark:to-purple-950/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 text-lg">
                <i className="fa-solid fa-masks-theater"></i>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Chagua Avatar Yako</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-cyan-300 border border-sky-300 dark:border-sky-800">
                    Scholar Avatars
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Chagua utambulisho unaoakisi shauku yako ya kimasomo na malengo ya NECTA
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition active:scale-95 cursor-pointer"
              aria-label="Funga"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          {/* Live Preview Card */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-3.5">
            <ScholarAvatar
              avatarId={selectedId}
              size="lg"
              showLevel
              level={level}
              showGlow
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {userName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 truncate">
                  {schoolName}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  {activeAvatar.name}
                </span>
                <span className="text-[10px] text-slate-400">·</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  "{activeAvatar.motto}"
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 overflow-x-auto scrollbar-hide flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <i className={`fa-solid ${cat.icon} text-xs`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Avatar Selection Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[50vh]">
          {filteredAvatars.map((avatar) => {
            const isSelected = selectedId === avatar.id;
            return (
              <div
                key={avatar.id}
                onClick={() => setSelectedId(avatar.id)}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center text-center select-none ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-50/90 to-sky-50/90 dark:from-indigo-950/60 dark:to-sky-950/60 border-indigo-500 dark:border-cyan-400 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-750 hover:border-slate-300'
                }`}
              >
                {/* Active checkmark */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shadow-sm animate-scale-up">
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}

                {/* Avatar Display */}
                <ScholarAvatar
                  avatarId={avatar.id}
                  size="lg"
                  showGlow={isSelected}
                  className="mb-2 group-hover:scale-105 transition-transform"
                />

                <span className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight line-clamp-1">
                  {avatar.name}
                </span>

                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-1">
                  {avatar.englishTitle}
                </span>

                <span className={`mt-2 text-[9px] font-black px-2 py-0.5 rounded-full ${avatar.bgSoft} ${avatar.textColor} border border-current/20`}>
                  {avatar.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Avatar iliyochaguliwa: <strong className="text-slate-900 dark:text-white">{activeAvatar.name}</strong>
          </div>

          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              Ghairi (Cancel)
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-check text-xs"></i>
              <span>Weka Avatar Hii</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
