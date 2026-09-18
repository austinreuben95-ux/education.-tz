import React, { useState, useMemo } from 'react';
import { UserProgress } from '../types';

export interface BadgeSpec {
  id: string;
  title: string;
  swahiliTitle: string;
  category: 'streak' | 'mastery' | 'quiz' | 'special';
  icon: string; // FontAwesome icon class
  gradient: string;
  borderStyle: string;
  glowColor: string;
  description: string;
  requirementText: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  isUnlocked: boolean;
  actionHint?: string;
  targetView?: string;
}

export interface BadgesProps {
  user: UserProgress;
  onUpdateUserProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
  onNavigateView?: (viewName: string) => void;
}

export const BADGES_LIST = (user: UserProgress): BadgeSpec[] => {
  const streak = user.streak || 0;
  const topicsCount = user.completedTopics?.length || 0;
  const points = user.points || 0;
  const level = user.level || 1;

  // We can also retrieve custom stats stored in localStorage if any
  let quizCount = 0;
  let perfectScoreCount = 0;
  try {
    const storedQuiz = localStorage.getItem('tz_quiz_completed_count');
    if (storedQuiz) quizCount = parseInt(storedQuiz, 10) || 0;
    const storedPerfect = localStorage.getItem('tz_perfect_score_count');
    if (storedPerfect) perfectScoreCount = parseInt(storedPerfect, 10) || 0;
  } catch {
    // fallback
  }

  return [
    // --- STREAK BADGES ---
    {
      id: 'streak-3',
      title: '3-Day Daily Spark',
      swahiliTitle: 'Moto wa Siku 3',
      category: 'streak',
      icon: 'fa-fire-flame-curved',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      borderStyle: 'border-amber-400',
      glowColor: 'shadow-amber-500/30',
      description: 'Maintain a study streak for 3 consecutive days.',
      requirementText: 'Log in and study 3 days in a row',
      targetCount: 3,
      currentCount: streak,
      xpReward: 100,
      isUnlocked: streak >= 3,
      actionHint: 'Study daily on EducationTZ to extend your streak!'
    },
    {
      id: 'streak-7',
      title: '7-Day NECTA Warrior',
      swahiliTitle: 'Shujaa wa Siku 7',
      category: 'streak',
      icon: 'fa-shield-halved',
      gradient: 'from-orange-600 via-red-600 to-rose-700',
      borderStyle: 'border-orange-400',
      glowColor: 'shadow-orange-500/40',
      description: 'Complete a full 1-week continuous learning streak.',
      requirementText: 'Maintain a 7-day study streak',
      targetCount: 7,
      currentCount: streak,
      xpReward: 250,
      isUnlocked: streak >= 7,
      actionHint: 'Stay disciplined every day of the week!'
    },
    {
      id: 'streak-14',
      title: '14-Day Consistency Master',
      swahiliTitle: 'Mabingwa wa Siku 14',
      category: 'streak',
      icon: 'fa-bolt-lightning',
      gradient: 'from-amber-400 via-yellow-500 to-amber-600',
      borderStyle: 'border-amber-300',
      glowColor: 'shadow-yellow-500/50',
      description: 'Study every single day for two full weeks.',
      requirementText: 'Maintain a 14-day study streak',
      targetCount: 14,
      currentCount: streak,
      xpReward: 500,
      isUnlocked: streak >= 14,
      actionHint: 'Two weeks of constant practice builds exam mastery!'
    },
    {
      id: 'streak-30',
      title: '30-Day Scholar Legend',
      swahiliTitle: 'Mwanachuoni wa Siku 30',
      category: 'streak',
      icon: 'fa-crown',
      gradient: 'from-purple-600 via-indigo-600 to-blue-700',
      borderStyle: 'border-purple-400',
      glowColor: 'shadow-purple-500/50',
      description: 'Complete 1 entire month of uninterrupted daily studying.',
      requirementText: 'Maintain a 30-day study streak',
      targetCount: 30,
      currentCount: streak,
      xpReward: 1000,
      isUnlocked: streak >= 30,
      actionHint: 'A full month streak puts you in the top 1% of students in Tanzania!'
    },

    // --- SUBJECT MASTERY BADGES ---
    {
      id: 'mastery-1',
      title: 'First Step Scholar',
      swahiliTitle: 'Hatua ya Kwanza',
      category: 'mastery',
      icon: 'fa-graduation-cap',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      borderStyle: 'border-emerald-300',
      glowColor: 'shadow-emerald-500/30',
      description: 'Complete and master your very first syllabus topic.',
      requirementText: 'Master 1 topic',
      targetCount: 1,
      currentCount: topicsCount,
      xpReward: 150,
      isUnlocked: topicsCount >= 1,
      actionHint: 'Open any subject in the syllabus and mark topics as completed!'
    },
    {
      id: 'mastery-5',
      title: 'Syllabus Explorer',
      swahiliTitle: 'Mchunguzi wa Mada 5',
      category: 'mastery',
      icon: 'fa-book-open-reader',
      gradient: 'from-blue-600 via-cyan-600 to-teal-500',
      borderStyle: 'border-cyan-300',
      glowColor: 'shadow-cyan-500/40',
      description: 'Master 5 syllabus topics across any NECTA subject.',
      requirementText: 'Master 5 topics',
      targetCount: 5,
      currentCount: topicsCount,
      xpReward: 350,
      isUnlocked: topicsCount >= 5,
      actionHint: 'Explore different subjects and read deep topic summaries!'
    },
    {
      id: 'mastery-10',
      title: 'Subject Veteran',
      swahiliTitle: 'Mkongwe wa Masomo',
      category: 'mastery',
      icon: 'fa-award',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      borderStyle: 'border-indigo-400',
      glowColor: 'shadow-indigo-500/50',
      description: 'Master 10 topics in your syllabus.',
      requirementText: 'Master 10 topics',
      targetCount: 10,
      currentCount: topicsCount,
      xpReward: 750,
      isUnlocked: topicsCount >= 10,
      actionHint: 'Keep working through your grade syllabus to unlock Veteran status!'
    },
    {
      id: 'mastery-25',
      title: 'NECTA Grandmaster',
      swahiliTitle: 'Mwalimu Mkuu wa NECTA',
      category: 'mastery',
      icon: 'fa-trophy',
      gradient: 'from-amber-400 via-orange-500 to-red-600',
      borderStyle: 'border-amber-300',
      glowColor: 'shadow-amber-500/60',
      description: 'Master 25 topics across your primary or secondary curriculum.',
      requirementText: 'Master 25 topics',
      targetCount: 25,
      currentCount: topicsCount,
      xpReward: 1500,
      isUnlocked: topicsCount >= 25,
      actionHint: 'Mastering 25 topics guarantees top Division 1 performance!'
    },

    // --- QUIZ & TEST SERIES BADGES ---
    {
      id: 'quiz-1',
      title: 'Speed Test Beginner',
      swahiliTitle: 'Mwanzo wa Jaribio',
      category: 'quiz',
      icon: 'fa-list-check',
      gradient: 'from-sky-500 via-indigo-500 to-blue-600',
      borderStyle: 'border-sky-300',
      glowColor: 'shadow-sky-500/30',
      description: 'Complete 1 practice assignment or speed test in the Test Bank.',
      requirementText: 'Complete 1 practice quiz or speed test',
      targetCount: 1,
      currentCount: Math.max(quizCount, topicsCount > 0 ? 1 : 0),
      xpReward: 150,
      isUnlocked: (quizCount >= 1) || (topicsCount > 0),
      actionHint: 'Go to Assignments & Tests Bank to practice timed quizzes!'
    },
    {
      id: 'quiz-5',
      title: 'Exam Vault Ace',
      swahiliTitle: 'Bingwa wa NECTA Papers',
      category: 'quiz',
      icon: 'fa-circle-check',
      gradient: 'from-teal-500 via-emerald-600 to-green-700',
      borderStyle: 'border-teal-300',
      glowColor: 'shadow-teal-500/40',
      description: 'Complete 5 practice test papers or homework assignments.',
      requirementText: 'Complete 5 practice tests or assignments',
      targetCount: 5,
      currentCount: Math.max(quizCount, Math.floor(points / 100)),
      xpReward: 450,
      isUnlocked: quizCount >= 5 || points >= 500,
      actionHint: 'Practice previous NECTA CSEE or ACSEE papers in Exam Vault!'
    },
    {
      id: 'quiz-perfect',
      title: '100% Score Champion',
      swahiliTitle: 'Bingwa wa Maksi 100%',
      category: 'quiz',
      icon: 'fa-star',
      gradient: 'from-amber-400 via-yellow-400 to-orange-500',
      borderStyle: 'border-amber-300',
      glowColor: 'shadow-amber-400/50',
      description: 'Achieve a perfect 100% score on any quiz, homework, or speed test.',
      requirementText: 'Get 100% score on a practice test',
      targetCount: 1,
      currentCount: Math.max(perfectScoreCount, points >= 300 ? 1 : 0),
      xpReward: 600,
      isUnlocked: perfectScoreCount >= 1 || points >= 300,
      actionHint: 'Review answer keys carefully before submitting your speed tests!'
    },

    // --- SPECIAL & MILESTONE BADGES ---
    {
      id: 'special-level-3',
      title: 'Level 3 Rising Scholar',
      swahiliTitle: 'Mwanafunzi wa Ngazi ya 3',
      category: 'special',
      icon: 'fa-chart-line',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
      borderStyle: 'border-purple-300',
      glowColor: 'shadow-purple-500/40',
      description: 'Advance your scholar level to Level 3 by earning EP points.',
      requirementText: 'Reach Level 3 (300+ EP)',
      targetCount: 3,
      currentCount: level,
      xpReward: 300,
      isUnlocked: level >= 3 || points >= 300,
      actionHint: 'Earn EP by reading lessons, completing notes, and doing quizzes!'
    },
    {
      id: 'special-ep-1000',
      title: '1,000 EP Points Club',
      swahiliTitle: 'Klabu ya EP 1,000',
      category: 'special',
      icon: 'fa-gem',
      gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
      borderStyle: 'border-cyan-300',
      glowColor: 'shadow-cyan-500/50',
      description: 'Accumulate a total of 1,000 EP points in your study wallet.',
      requirementText: 'Earn 1,000 total EP points',
      targetCount: 1000,
      currentCount: points,
      xpReward: 500,
      isUnlocked: points >= 1000,
      actionHint: 'Swap your EP for Yun AI credits or unlock bonus study materials!'
    },
    {
      id: 'special-planner',
      title: 'Master Planner',
      swahiliTitle: 'Mpangaji Hodari',
      category: 'special',
      icon: 'fa-calendar-days',
      gradient: 'from-violet-600 via-purple-600 to-indigo-700',
      borderStyle: 'border-violet-300',
      glowColor: 'shadow-violet-500/40',
      description: 'Set up your weekly study timetable and music goals in Study Planner.',
      requirementText: 'Use Study Planner & Music Hub',
      targetCount: 1,
      currentCount: 1, // Auto unlocked once user visits
      xpReward: 200,
      isUnlocked: true,
      actionHint: 'Use the Study Planner to build custom study sessions!'
    }
  ];
};

export const Badges: React.FC<BadgesProps> = ({
  user,
  onUpdateUserProgress,
  onNavigateView
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'streak' | 'mastery' | 'quiz' | 'special'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeSpec | null>(null);

  // Claimed badges state stored locally
  const [claimedBadgeIds, setClaimedBadgeIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tz_claimed_badges');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const badges = useMemo(() => BADGES_LIST(user), [user]);

  const filteredBadges = useMemo(() => {
    if (activeCategory === 'all') return badges;
    return badges.filter(b => b.category === activeCategory);
  }, [badges, activeCategory]);

  const unlockedCount = useMemo(() => badges.filter(b => b.isUnlocked).length, [badges]);
  const totalBadges = badges.length;
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  const totalXPEarnedFromBadges = useMemo(() => {
    return badges
      .filter(b => b.isUnlocked && claimedBadgeIds.includes(b.id))
      .reduce((sum, b) => sum + b.xpReward, 0);
  }, [badges, claimedBadgeIds]);

  const handleClaimReward = (badge: BadgeSpec) => {
    if (!badge.isUnlocked || claimedBadgeIds.includes(badge.id)) return;

    const newClaimed = [...claimedBadgeIds, badge.id];
    setClaimedBadgeIds(newClaimed);
    try {
      localStorage.setItem('tz_claimed_badges', JSON.stringify(newClaimed));
    } catch {
      // ignore
    }

    if (onUpdateUserProgress) {
      onUpdateUserProgress(prev => ({
        ...prev,
        points: prev.points + badge.xpReward
      }));
    }

    setToastMessage(`🎉 Congratulations! Claimed +${badge.xpReward} EP Bonus for "${badge.title}"!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fade-in text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[120] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg">
            <i className="fa-solid fa-trophy"></i>
          </div>
          <div>
            <p className="text-xs font-black text-amber-300 uppercase tracking-wider">Badge Reward Claimed!</p>
            <p className="text-sm font-bold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-indigo-900/60">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-indigo-900/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5">
                <i className="fa-solid fa-award"></i> Gamification Center
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <i className="fa-solid fa-fire text-amber-400"></i> {user.streak} Day Streak
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <i className="fa-solid fa-trophy text-amber-400"></i>
              Scholar Badges & Awards 🏆
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 font-medium mt-1.5 max-w-2xl leading-relaxed">
              Earn visual trophies and bonus EP points by maintaining continuous study streaks, mastering syllabus topics, and completing NECTA speed test series!
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="shrink-0 bg-slate-900/90 p-5 rounded-3xl border border-indigo-800/80 shadow-inner flex items-center gap-6">
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Unlocked</span>
              <span className="text-2xl font-black text-amber-400">{unlockedCount} / {totalBadges}</span>
            </div>
            <div className="w-px h-10 bg-slate-800"></div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Badge EP</span>
              <span className="text-2xl font-black text-emerald-400">+{totalXPEarnedFromBadges} EP</span>
            </div>
          </div>
        </div>

        {/* Overall Completion Progress Bar */}
        <div className="relative z-10 pt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-indigo-200">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-amber-400"></i>
              Overall Trophy Collection Progress
            </span>
            <span className="text-amber-300 font-black">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden p-0.5 border border-indigo-900/80">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-md shadow-amber-500/30"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 sm:p-3 rounded-2xl border-2 border-gray-100 shadow-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <i className="fa-solid fa-border-all text-amber-400"></i> All Badges ({badges.length})
        </button>

        <button
          onClick={() => setActiveCategory('streak')}
          className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeCategory === 'streak'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <i className="fa-solid fa-fire text-amber-600"></i> Streaks ({badges.filter(b => b.category === 'streak').length})
        </button>

        <button
          onClick={() => setActiveCategory('mastery')}
          className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeCategory === 'mastery'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <i className="fa-solid fa-book-open-reader text-emerald-600"></i> Subject Mastery ({badges.filter(b => b.category === 'mastery').length})
        </button>

        <button
          onClick={() => setActiveCategory('quiz')}
          className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeCategory === 'quiz'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          <i className="fa-solid fa-list-check text-indigo-600"></i> Quiz Series ({badges.filter(b => b.category === 'quiz').length})
        </button>

        <button
          onClick={() => setActiveCategory('special')}
          className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeCategory === 'special'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          <i className="fa-solid fa-sparkles text-purple-600"></i> Special & Milestones ({badges.filter(b => b.category === 'special').length})
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredBadges.map((badge) => {
          const isClaimed = claimedBadgeIds.includes(badge.id);
          const isUnlocked = badge.isUnlocked;
          const progressPercent = Math.min(100, Math.round((badge.currentCount / badge.targetCount) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-gray-200 hover:border-indigo-400 hover:shadow-xl'
                  : 'bg-gray-50/80 border-gray-200 opacity-80 hover:opacity-100 hover:bg-white'
              }`}
            >
              {/* Unlocked / Claimed Badge Top Banner */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  isUnlocked
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-gray-200 text-gray-700 border-gray-300'
                }`}>
                  {isUnlocked ? (isClaimed ? '✓ Claimed' : '🎉 Unlocked!') : '🔒 Locked'}
                </span>

                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  +{badge.xpReward} EP
                </span>
              </div>

              {/* Main Badge Icon Medallion */}
              <div className="flex flex-col items-center text-center my-3">
                <div className={`relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr ${badge.gradient} shadow-lg ${badge.glowColor} group-hover:scale-110 transition duration-300 flex items-center justify-center`}>
                  <div className={`w-full h-full rounded-xl flex items-center justify-center text-3xl ${
                    isUnlocked ? 'text-white' : 'bg-gray-900/80 text-gray-400'
                  }`}>
                    <i className={`fa-solid ${isUnlocked ? badge.icon : 'fa-lock'}`}></i>
                  </div>

                  {isUnlocked && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white">
                      ✓
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 mt-4 leading-snug group-hover:text-indigo-600 transition">
                  {badge.title}
                </h3>
                <p className="text-[11px] font-bold text-slate-500 tracking-wide mt-0.5">
                  {badge.swahiliTitle}
                </p>
                <p className="text-xs text-gray-600 font-medium mt-2 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Mini Requirement Progress Bar */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                  <span>Requirement:</span>
                  <span className="font-extrabold text-slate-900">
                    {badge.currentCount} / {badge.targetCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {isUnlocked && !isClaimed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaimReward(badge);
                    }}
                    className="w-full mt-2 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-400/20 transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <i className="fa-solid fa-gift"></i>
                    <span>Claim +{badge.xpReward} EP</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden relative text-left my-8">
            {/* Header Banner */}
            <div className={`bg-gradient-to-r ${selectedBadge.gradient} text-white p-6 md:p-8 relative`}>
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 w-9 h-9 rounded-full flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-lg border border-white/30 shrink-0">
                  <i className={`fa-solid ${selectedBadge.icon}`}></i>
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] uppercase border border-white/30">
                    {selectedBadge.category.toUpperCase()} AWARD
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1 leading-tight">{selectedBadge.title}</h2>
                  <p className="text-xs text-white/90 font-medium">{selectedBadge.swahiliTitle}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Badge Description:</h4>
                <p className="text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedBadge.description}
                </p>
              </div>

              {/* Requirement Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Unlocking Criteria:</h4>
                  <span className="text-xs font-extrabold text-indigo-600">
                    {selectedBadge.currentCount} / {selectedBadge.targetCount}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                  <p className="text-xs text-indigo-950 font-bold flex items-center gap-2">
                    <i className="fa-solid fa-circle-info text-indigo-600"></i>
                    {selectedBadge.requirementText}
                  </p>
                  <div className="w-full bg-indigo-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((selectedBadge.currentCount / selectedBadge.targetCount) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Hint */}
              {selectedBadge.actionHint && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <i className="fa-solid fa-lightbulb text-amber-600 text-lg mt-0.5 shrink-0"></i>
                  <div>
                    <h5 className="text-xs font-black text-amber-900 uppercase">Scholar Tip:</h5>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed mt-0.5">
                      {selectedBadge.actionHint}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
                {selectedBadge.isUnlocked && !claimedBadgeIds.includes(selectedBadge.id) && (
                  <button
                    onClick={() => {
                      handleClaimReward(selectedBadge);
                      setSelectedBadge(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <i className="fa-solid fa-gift"></i>
                    <span>Claim +{selectedBadge.xpReward} EP Reward</span>
                  </button>
                )}

                {onNavigateView && (
                  <button
                    onClick={() => {
                      setSelectedBadge(null);
                      if (selectedBadge.category === 'quiz') onNavigateView('ASSIGNMENTS_TESTS');
                      else if (selectedBadge.category === 'mastery') onNavigateView('SYLLABUS');
                      else if (selectedBadge.category === 'streak') onNavigateView('PLANNER');
                      else onNavigateView('SYLLABUS');
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Go Earn This Badge</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
