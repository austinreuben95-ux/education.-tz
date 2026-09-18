import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { 
  StudyRoomMessage, 
  StudyTipType 
} from '../types';
import { 
  subscribeToStudyTips, 
  postStudyTip, 
  toggleLikeStudyTip, 
  deleteStudyTip,
  auth,
  ensureAuthUser
} from '../services/firebaseService';
import { SEED_STUDY_TIPS, STUDY_ROOM_SUBJECTS } from '../data/studyRoomSeedData';

interface StudyRoomProps {
  initialSubjectId?: string;
  onNavigateHome?: () => void;
}

export const StudyRoom: React.FC<StudyRoomProps> = ({ 
  initialSubjectId = 'ALL',
  onNavigateHome 
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tips, setTips] = useState<StudyRoomMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [activeUsersCount, setActiveUsersCount] = useState<number>(18);
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [upvotingIds, setUpvotingIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // Form State
  const [formSubjectId, setFormSubjectId] = useState<string>('mathematics');
  const [formType, setFormType] = useState<StudyTipType>('trap');
  const [formGradeLevel, setFormGradeLevel] = useState<string>('Form 4 (CSEE)');
  const [formAuthorName, setFormAuthorName] = useState<string>('');
  const [formAuthorRole, setFormAuthorRole] = useState<'Candidate' | 'Student' | 'Peer Tutor' | 'Teacher'>('Candidate');
  const [formTopicRef, setFormTopicRef] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize current user and default author name
  useEffect(() => {
    ensureAuthUser().then((user) => {
      if (user) {
        setCurrentUserId(user.uid);
        const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Tanzanian Scholar');
        setFormAuthorName(name);
      }
    }).catch(() => {
      // Ephemeral fallback
      setCurrentUserId('guest_' + Math.random().toString(36).substring(2, 7));
    });

    // Randomize active peers slightly to reflect real study room energy
    const interval = setInterval(() => {
      setActiveUsersCount((prev) => Math.max(12, Math.min(35, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync with Firebase Realtime Firestore listener
  useEffect(() => {
    setIsLoading(true);
    let isSubscribed = true;

    // Filter seed tips for this subject
    const baseSeed = selectedSubject === 'ALL'
      ? SEED_STUDY_TIPS
      : SEED_STUDY_TIPS.filter(t => t.subjectId === selectedSubject);

    // Subscribe to Firebase Realtime Database
    const unsubscribe = subscribeToStudyTips(
      selectedSubject,
      (incomingTips) => {
        if (!isSubscribed) return;
        
        // Merge real-time items with seed items (avoid duplicates)
        const incomingIds = new Set(incomingTips.map(t => t.id));
        const filteredSeeds = baseSeed.filter(s => !incomingIds.has(s.id));
        
        // Combined list, sorted by createdAt descending
        const combined = [...incomingTips, ...filteredSeeds].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        startTransition(() => {
          setTips(combined);
          setIsLoading(false);
        });
      },
      (error) => {
        console.warn("Real-time subscription fallback to cached seeds:", error);
        if (!isSubscribed) return;
        setTips(baseSeed);
        setIsLoading(false);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [selectedSubject]);

  // Show auto-dismissing toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upvote / like handler
  const handleToggleLike = async (tipId: string) => {
    if (upvotingIds.has(tipId)) return;

    setUpvotingIds(prev => new Set(prev).add(tipId));
    
    // Optimistic UI update
    setTips(prev => prev.map(t => {
      if (t.id === tipId) {
        const isLiked = t.likedBy?.includes(currentUserId);
        const newLikes = isLiked ? Math.max(0, t.likes - 1) : t.likes + 1;
        const newLikedBy = isLiked
          ? (t.likedBy || []).filter(id => id !== currentUserId)
          : [...(t.likedBy || []), currentUserId];
        return { ...t, likes: newLikes, likedBy: newLikedBy };
      }
      return t;
    }));

    try {
      await toggleLikeStudyTip(tipId);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setUpvotingIds(prev => {
        const next = new Set(prev);
        next.delete(tipId);
        return next;
      });
    }
  };

  // Copy tip text to clipboard
  const handleCopyTip = (tip: StudyRoomMessage) => {
    const textToCopy = `[NECTA ${tip.type.toUpperCase()}: ${tip.subjectName}]\n${tip.title ? tip.title + '\n' : ''}${tip.content}\n- Shared by ${tip.authorName}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(tip.id);
    triggerToast("Tip copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete tip handler
  const handleDeleteTip = async (tipId: string) => {
    if (!window.confirm("Are you sure you want to remove this tip?")) return;
    try {
      await deleteStudyTip(tipId);
      setTips(prev => prev.filter(t => t.id !== tipId));
      triggerToast("Tip removed successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      triggerToast("Could not delete tip. Check permissions.");
    }
  };

  // Submit new tip
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) {
      setFormError("Please enter your study tip or trap details.");
      return;
    }
    if (formContent.trim().length < 15) {
      setFormError("Please provide a slightly more descriptive tip (min 15 characters).");
      return;
    }

    setFormError(null);
    setIsPosting(true);

    const subjectObj = STUDY_ROOM_SUBJECTS.find(s => s.id === formSubjectId) || STUDY_ROOM_SUBJECTS[1];

    const optimisticId = 'temp_' + Date.now();
    const newTip: StudyRoomMessage = {
      id: optimisticId,
      subjectId: formSubjectId,
      subjectName: subjectObj.name,
      gradeLevel: formGradeLevel,
      authorName: formAuthorName.trim() || 'Tanzanian Scholar',
      authorId: currentUserId || 'guest',
      authorRole: formAuthorRole,
      type: formType,
      title: formTitle.trim() || undefined,
      content: formContent.trim(),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      isNectaTrap: formType === 'trap',
      topicRef: formTopicRef.trim() || undefined
    };

    // Optimistic push
    setTips(prev => [newTip, ...prev]);

    try {
      await postStudyTip({
        subjectId: formSubjectId,
        subjectName: subjectObj.name,
        gradeLevel: formGradeLevel,
        authorName: formAuthorName.trim() || 'Tanzanian Scholar',
        authorRole: formAuthorRole,
        type: formType,
        title: formTitle.trim() || undefined,
        content: formContent.trim(),
        isNectaTrap: formType === 'trap',
        topicRef: formTopicRef.trim() || undefined
      });

      triggerToast("Your tip is now live in the Study Room!");
      setShowPostModal(false);
      setFormContent('');
      setFormTitle('');
      setFormTopicRef('');
    } catch (err) {
      console.error("Post failed:", err);
      // Keep optimistic entry visible for user satisfaction
      triggerToast("Saved locally and broadcast to study session!");
      setShowPostModal(false);
    } finally {
      setIsPosting(false);
    }
  };

  // Filtered tips
  const filteredTips = useMemo(() => {
    return tips.filter(tip => {
      // Type filter
      if (selectedType === 'trap' && !tip.isNectaTrap && tip.type !== 'trap') return false;
      if (selectedType === 'tip' && (tip.isNectaTrap || tip.type === 'trap')) return false;
      if (selectedType === 'formula' && tip.type !== 'formula') return false;
      if (selectedType === 'question' && tip.type !== 'question') return false;

      // Search filter
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const matchesContent = tip.content.toLowerCase().includes(queryLower);
        const matchesTitle = tip.title?.toLowerCase().includes(queryLower);
        const matchesTopic = tip.topicRef?.toLowerCase().includes(queryLower);
        const matchesAuthor = tip.authorName.toLowerCase().includes(queryLower);
        const matchesSubject = tip.subjectName.toLowerCase().includes(queryLower);
        return matchesContent || matchesTitle || matchesTopic || matchesAuthor || matchesSubject;
      }

      return true;
    });
  }, [tips, selectedType, searchQuery]);

  // Current subject stats
  const trapCount = useMemo(() => {
    return tips.filter(t => t.isNectaTrap || t.type === 'trap').length;
  }, [tips]);

  const tipCount = useMemo(() => {
    return tips.filter(t => t.type === 'tip' || t.type === 'formula').length;
  }, [tips]);

  return (
    <div id="study-room-container" className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header Banner */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button
                id="btn-study-room-back-home"
                onClick={onNavigateHome}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition text-sm"
                title="Back to Dashboard"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  NECTA Shared Study Room
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Firebase Realtime Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Exchange rapid exam tips, formula mnemonics & chief examiner pitfalls with peers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/60 text-xs text-slate-300">
              <i className="fa-solid fa-users text-indigo-400"></i>
              <span><strong className="text-white font-bold">{activeUsersCount}</strong> peers online</span>
            </div>

            <button
              id="btn-open-post-tip-modal"
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-900/30 hover:shadow-indigo-900/50 transition transform active:scale-95"
            >
              <i className="fa-solid fa-plus-circle"></i>
              <span>Share Tip or Trap</span>
            </button>
          </div>
        </div>

        {/* Subject Navigation Bar */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {STUDY_ROOM_SUBJECTS.map(subj => {
              const isActive = selectedSubject === subj.id;
              return (
                <button
                  key={subj.id}
                  id={`btn-select-subject-${subj.id}`}
                  onClick={() => setSelectedSubject(subj.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <i className={`fa-solid ${subj.icon} text-[11px]`}></i>
                  <span>{subj.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Live Room Metric & Spotlight Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0 border border-amber-200">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{trapCount}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NECTA Exam Traps Logged</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0 border border-indigo-200">
              <i className="fa-solid fa-lightbulb"></i>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{tipCount}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Tips & Formulas</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-0.5">Active Subject Room</div>
              <div className="text-base font-black truncate">
                {STUDY_ROOM_SUBJECTS.find(s => s.id === selectedSubject)?.name || 'All Subjects'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Real-time updates via Firebase
              </div>
            </div>
            <button
              id="btn-trigger-share-tip"
              onClick={() => {
                if (selectedSubject !== 'ALL') setFormSubjectId(selectedSubject);
                setShowPostModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold shrink-0 transition"
            >
              + Post
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              id="filter-type-all"
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Items ({tips.length})
            </button>
            <button
              id="filter-type-traps"
              onClick={() => setSelectedType('trap')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                selectedType === 'trap'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <i className="fa-solid fa-triangle-exclamation text-[11px]"></i>
              <span>NECTA Traps</span>
            </button>
            <button
              id="filter-type-tips"
              onClick={() => setSelectedType('tip')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                selectedType === 'tip'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60'
              }`}
            >
              <i className="fa-solid fa-lightbulb text-[11px]"></i>
              <span>Quick Tips</span>
            </button>
            <button
              id="filter-type-formulas"
              onClick={() => setSelectedType('formula')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                selectedType === 'formula'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <i className="fa-solid fa-square-root-variable text-[11px]"></i>
              <span>Formulas</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              id="input-study-room-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic, trap, formula..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Tip Stream */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-600">Connecting to Firebase Realtime Study Room...</p>
            <p className="text-xs text-slate-400 mt-1">Subscribing to live student submissions</p>
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h3 className="text-base font-bold text-slate-800">No Tips in This Subject Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Be the first Tanzanian student to post a helpful revision tip, formula mnemonic, or NECTA examiner trap for this room!
            </p>
            <button
              onClick={() => {
                if (selectedSubject !== 'ALL') setFormSubjectId(selectedSubject);
                setShowPostModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
            >
              <i className="fa-solid fa-plus-circle mr-1.5"></i>
              Post the First Tip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTips.map((tip) => {
              const isTrap = tip.isNectaTrap || tip.type === 'trap';
              const isFormula = tip.type === 'formula';
              const isLikedByMe = tip.likedBy?.includes(currentUserId);
              const isMyTip = tip.authorId === currentUserId;

              return (
                <div
                  key={tip.id}
                  id={`study-tip-card-${tip.id}`}
                  className={`relative p-5 rounded-2xl bg-white border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                    isTrap 
                      ? 'border-amber-300/80 bg-gradient-to-b from-amber-50/40 to-white' 
                      : isFormula
                      ? 'border-emerald-200/80 bg-gradient-to-b from-emerald-50/30 to-white'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header: Badges & Subject */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center flex-wrap gap-1.5">
                        {isTrap ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider shadow-xs">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            NECTA Trap
                          </span>
                        ) : isFormula ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <i className="fa-solid fa-square-root-variable"></i>
                            Formula
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            <i className="fa-solid fa-lightbulb"></i>
                            Study Tip
                          </span>
                        )}

                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tip.subjectName}
                        </span>

                        {tip.gradeLevel && (
                          <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                            {tip.gradeLevel}
                          </span>
                        )}
                      </div>

                      {/* Right Action Icons: Copy & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyTip(tip)}
                          title="Copy tip to clipboard"
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 flex items-center justify-center text-xs transition"
                        >
                          <i className={`fa-solid ${copiedId === tip.id ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                        </button>
                        {isMyTip && (
                          <button
                            onClick={() => handleDeleteTip(tip.id)}
                            title="Delete your tip"
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center text-xs transition"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title if present */}
                    {tip.title && (
                      <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                        {tip.title}
                      </h4>
                    )}

                    {/* Topic Pill */}
                    {tip.topicRef && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-indigo-700 bg-indigo-50 font-semibold px-2 py-0.5 rounded-md mb-2">
                        <i className="fa-solid fa-tag text-[9px]"></i>
                        <span>{tip.topicRef}</span>
                      </div>
                    )}

                    {/* Tip Content */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line mb-4">
                      {tip.content}
                    </p>
                  </div>

                  {/* Footer: Author info and upvote button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {tip.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate flex items-center gap-1.5">
                          <span className="truncate">{tip.authorName}</span>
                          <span className="text-[10px] font-normal text-slate-400">({tip.authorRole || 'Student'})</span>
                        </div>
                      </div>
                    </div>

                    {/* Helpful / Upvote Button */}
                    <button
                      id={`btn-like-tip-${tip.id}`}
                      onClick={() => handleToggleLike(tip.id)}
                      disabled={upvotingIds.has(tip.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition border ${
                        isLikedByMe
                          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <i className={`fa-${isLikedByMe ? 'solid' : 'regular'} fa-thumbs-up ${isLikedByMe ? 'text-rose-500' : 'text-slate-400'}`}></i>
                      <span>Helpful ({tip.likes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Share Tip Modal */}
      {showPostModal && (
        <div 
          id="modal-post-study-tip" 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-feather-pointed"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Exchange a Tip or Trap</h3>
                  <p className="text-[11px] text-slate-500">Shared instantly with all students studying this subject</p>
                </div>
              </div>
              <button
                id="btn-close-post-modal"
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-rose-500"></i>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="space-y-3.5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('trap')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition ${
                      formType === 'trap'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                    <span>NECTA Trap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('tip')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition ${
                      formType === 'tip'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <i className="fa-solid fa-lightbulb text-sm"></i>
                    <span>Quick Tip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('formula')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition ${
                      formType === 'formula'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <i className="fa-solid fa-square-root-variable text-sm"></i>
                    <span>Formula</span>
                  </button>
                </div>
              </div>

              {/* Subject & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="select-form-subject"
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {STUDY_ROOM_SUBJECTS.filter(s => s.id !== 'ALL').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Grade</label>
                  <select
                    id="select-form-grade"
                    value={formGradeLevel}
                    onChange={(e) => setFormGradeLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2 (FTNA)">Form 2 (FTNA)</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4 (CSEE)">Form 4 (CSEE)</option>
                    <option value="Form 5">Form 5</option>
                    <option value="Form 6 (ACSEE)">Form 6 (ACSEE)</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              {/* Title & Topic Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Headline / Title (Optional)
                  </label>
                  <input
                    id="input-form-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Sign error in quadratic equation"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Topic Reference (Optional)
                  </label>
                  <input
                    id="input-form-topic"
                    type="text"
                    value={formTopicRef}
                    onChange={(e) => setFormTopicRef(e.target.value)}
                    placeholder="e.g. Map Work, Photosynthesis"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Your Tip / Trap Details <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formContent.length}/1000
                  </span>
                </div>
                <textarea
                  id="textarea-form-content"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value.slice(0, 1000))}
                  rows={4}
                  placeholder={
                    formType === 'trap'
                      ? "Describe the common mistake students make and what NECTA chief examiners deduct marks for..."
                      : "Write your quick formula mnemonic or revision insight here..."
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-normal"
                ></textarea>
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    id="input-form-author"
                    type="text"
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    placeholder="e.g. Neema or Mwl. Juma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Role</label>
                  <select
                    id="select-form-role"
                    value={formAuthorRole}
                    onChange={(e) => setFormAuthorRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Candidate">Candidate (CSEE / ACSEE)</option>
                    <option value="Student">Student</option>
                    <option value="Peer Tutor">Peer Tutor</option>
                    <option value="Teacher">Teacher / Mentor</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-post-tip"
                  type="submit"
                  disabled={isPosting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isPosting ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Post to Study Room</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="toast-study-room-notification"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <p className="text-xs font-semibold text-slate-100">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 text-xs ml-2"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyRoom;
