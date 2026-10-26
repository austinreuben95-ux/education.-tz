import React, { useState } from 'react';
import { UserProgress } from '../types';
import { ScholarAvatar } from './ScholarAvatar';

interface StudentAnalyticsHubProps {
  userProgress?: UserProgress;
  onNavigateHome?: () => void;
  onStartQuiz?: () => void;
  onOpenYunAI?: (prompt: string) => void;
}

export const StudentAnalyticsHub: React.FC<StudentAnalyticsHubProps> = ({
  userProgress,
  onNavigateHome,
  onStartQuiz,
  onOpenYunAI
}) => {
  const [weeklyGoalQuizzes, setWeeklyGoalQuizzes] = useState<number>(5);
  const [completedThisWeek, setCompletedThisWeek] = useState<number>(3);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [savedQuestions, setSavedQuestions] = useState<Array<{ id: string; subject: string; question: string; topic: string }>>([
    { id: '1', subject: 'Physics', topic: "Newton's Laws", question: 'State the principle of conservation of linear momentum and write its mathematical equation.' },
    { id: '2', subject: 'Chemistry', topic: 'The Mole Concept', question: 'Calculate the percentage composition of nitrogen in ammonium nitrate (NH₄NO₃).' },
    { id: '3', subject: 'Basic Mathematics', topic: 'Quadratic Equations', question: 'Find the roots of 3x² - 5x + 2 = 0 using the quadratic formula.' }
  ]);

  const streak = userProgress?.streak || 4;
  const points = userProgress?.points || 450;
  const level = userProgress?.level || Math.floor(points / 200) + 1;
  const scholarName = userProgress?.displayName || 'Tanzanian Scholar';
  const schoolName = userProgress?.schoolOrUniversity || 'Tanzanian Secondary School';

  const BADGES = [
    { id: 'math_master', name: 'Math Master', icon: 'fa-square-root-variable', color: 'from-amber-400 to-yellow-500', earned: true, desc: 'Solved 10+ mathematical problem sets' },
    { id: 'quiz_whiz', name: 'Quiz Whiz', icon: 'fa-award', color: 'from-indigo-600 to-purple-600', earned: true, desc: 'Scored 100% on 3 practice tests' },
    { id: 'physics_prodigy', name: 'Physics Prodigy', icon: 'fa-atom', color: 'from-cyan-500 to-blue-600', earned: true, desc: 'Completed mechanics & dynamics revision' },
    { id: 'streak_titan', name: 'Streak Titan', icon: 'fa-fire', color: 'from-rose-500 to-orange-500', earned: streak >= 3, desc: 'Studied for 3+ consecutive days' },
    { id: 'peer_collaborator', name: 'Study Buddy Legend', icon: 'fa-handshake', color: 'from-emerald-500 to-teal-600', earned: true, desc: 'Solved problems in the collaborative room' }
  ];

  const WEAK_TOPICS = [
    { subject: 'Chemistry', topic: 'Organic Chemistry (Isomerism)', score: 54, priority: 'High', recommendation: 'Review nomenclature of alkenes & alkynes' },
    { subject: 'Basic Mathematics', topic: 'Trigonometry & Bearings', score: 62, priority: 'Medium', recommendation: 'Practice sine and cosine rule word problems' },
    { subject: 'Geography', topic: 'Map Reading & Vertical Exaggeration', score: 68, priority: 'Medium', recommendation: 'Review gradient and cross-section scale calculations' }
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div id="student-analytics-hub-container" className="min-h-screen bg-slate-50 text-slate-900 pb-20 text-left">
      {/* Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm"
                title="Back to Dashboard"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg shadow-md">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">
                Student Progress, Analytics & Goal Setting
              </h1>
              <p className="text-xs text-slate-400">
                Visual score tracking, earned badges, printable reports & weak topic diagnostic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
              title="Print Clean Academic Summary"
            >
              <i className="fa-solid fa-print text-amber-400"></i>
              <span>Print Report</span>
            </button>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <i className="fa-solid fa-certificate"></i>
              <span>View Certificate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black shrink-0">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{points} XP</div>
              <div className="text-xs font-bold text-slate-500">Level {level} Scholar</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-black shrink-0">
              <i className="fa-solid fa-fire"></i>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{streak} Days</div>
              <div className="text-xs font-bold text-slate-500">Daily Study Streak</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black shrink-0">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">14.2 Hours</div>
              <div className="text-xs font-bold text-slate-500">Total Revision Time</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-black shrink-0">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">84.5%</div>
              <div className="text-xs font-bold text-slate-500">Average Quiz Accuracy</div>
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress Bar Card */}
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-calendar-check text-indigo-600"></i>
                <span>Weekly Study Target</span>
              </h3>
              <p className="text-xs text-slate-500">Set targets to stay disciplined ahead of national NECTA exams</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Target:</span>
              <input
                type="number"
                min="1"
                max="20"
                value={weeklyGoalQuizzes}
                onChange={(e) => setWeeklyGoalQuizzes(Math.max(1, Number(e.target.value)))}
                className="w-16 p-1.5 bg-slate-50 border rounded-xl font-bold text-center text-xs"
              />
              <span className="text-xs font-bold text-slate-500">quizzes/week</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>{completedThisWeek} of {weeklyGoalQuizzes} completed</span>
              <span className="text-indigo-600 font-black">{Math.min(100, Math.round((completedThisWeek / weeklyGoalQuizzes) * 100))}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (completedThisWeek / weeklyGoalQuizzes) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Column: Weak Topic Highlighter & Earned Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weak Topic Diagnostic & Recommendations */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Weak Topic Diagnostic</h3>
                  <p className="text-[11px] text-slate-500">Prioritize these topics for rapid grade improvement</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                Action Items
              </span>
            </div>

            <div className="space-y-3">
              {WEAK_TOPICS.map((topic, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">{topic.topic}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800">
                      Score: {topic.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    💡 <strong>Next Step</strong>: {topic.recommendation}
                  </p>
                  <div className="pt-2 flex justify-between items-center text-[11px]">
                    <span className="text-indigo-600 font-bold">{topic.subject}</span>
                    <button
                      onClick={() => onOpenYunAI && onOpenYunAI(`Explain the key formulas and common NECTA exam traps for ${topic.topic} in ${topic.subject}.`)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition"
                    >
                      Ask Yun AI Tutor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Mastery Badges */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-medal"></i>
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Subject Mastery Badges</h3>
                  <p className="text-[11px] text-slate-500">Achievements earned across curriculum challenges</p>
                </div>
              </div>
              <span className="text-xs font-black text-purple-600">
                {BADGES.filter(b => b.earned).length} / {BADGES.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES.map(badge => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition ${
                    badge.earned
                      ? 'bg-slate-50 border-slate-200 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 opacity-40'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center text-lg shadow-md shrink-0`}>
                    <i className={`fa-solid ${badge.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-900">{badge.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bookmarked & Saved Questions Library */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bookmark text-amber-500 text-lg"></i>
              <div>
                <h3 className="font-black text-sm text-slate-900">Saved Questions Library</h3>
                <p className="text-[11px] text-slate-500">Tricky questions bookmarked for revision</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">{savedQuestions.length} Questions Saved</span>
          </div>

          <div className="space-y-2.5">
            {savedQuestions.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase">
                      {item.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-500">• {item.topic}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{item.question}</p>
                </div>
                <button
                  onClick={() => onOpenYunAI && onOpenYunAI(`Step-by-step solution and NECTA examiner marking scheme for: "${item.question}" in ${item.subject}.`)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 self-start sm:self-center transition"
                >
                  Solve with Yun AI
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column: Automated Revision Scheduler & Recent Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Automated Spaced Repetition Revision Scheduler */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Spaced Revision Scheduler</h3>
                  <p className="text-[11px] text-slate-500">Optimal re-study alerts based on cognitive decay curves</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                Due Today
              </span>
            </div>

            <div className="space-y-3">
              {[
                { subject: 'Biology', topic: 'Photosynthesis & Transpiration', due: 'Today (3 days since last test)', urgency: 'High', color: 'border-l-rose-500' },
                { subject: 'Physics', topic: "Newton's 2nd Law & Linear Momentum", due: 'Tomorrow (5 days interval)', urgency: 'Medium', color: 'border-l-amber-500' },
                { subject: 'Basic Mathematics', topic: 'Trigonometric Ratios & Angles', due: 'In 3 days', urgency: 'Low', color: 'border-l-emerald-500' }
              ].map((rev, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl bg-slate-50 border border-slate-200 border-l-4 ${rev.color} flex items-center justify-between gap-3`}>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600">{rev.subject}</span>
                    <h4 className="font-black text-xs text-slate-900">{rev.topic}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{rev.due}</p>
                  </div>
                  <button
                    onClick={() => onStartQuiz ? onStartQuiz() : onOpenYunAI && onOpenYunAI(`Quiz me on ${rev.topic} in ${rev.subject}`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] shrink-0"
                  >
                    Review Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Recent Activity Log</h3>
                  <p className="text-[11px] text-slate-500">History of completed quizzes & study milestones</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">Syncs Live</span>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Completed Speed Math Sprint', score: '18 correct', xp: '+180 XP', time: '12 mins ago', icon: 'fa-bolt', iconColor: 'text-amber-500' },
                { title: 'Form 4 Biology Cell Quiz', score: '92% (A)', xp: '+50 XP', time: '1 hour ago', icon: 'fa-dna', iconColor: 'text-emerald-500' },
                { title: 'Study Buddy Session with Baraka', score: 'Solved Kinematics problem', xp: '+40 XP', time: '3 hours ago', icon: 'fa-user-group', iconColor: 'text-indigo-500' },
                { title: 'Listened to Swahili Pronunciation', score: '6 terms mastered', xp: '+30 XP', time: 'Yesterday', icon: 'fa-volume-high', iconColor: 'text-cyan-500' }
              ].map((act, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <i className={`fa-solid ${act.icon} ${act.iconColor}`}></i>
                    <div>
                      <span className="font-black text-slate-800 block">{act.title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{act.score} • {act.time}</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 shrink-0">{act.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* National Peer Leaderboard Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-ranking-star text-amber-500 text-lg"></i>
              <div>
                <h3 className="font-black text-sm text-slate-900">National NECTA Scholar Leaderboard</h3>
                <p className="text-[11px] text-slate-500">Top performers this week across all Tanzanian regions</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-800">
              Weekly Standings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { rank: 1, name: 'Amina Mwangi', school: 'Feza Girls Secondary', region: 'Dar es Salaam', xp: '2,840 XP', badge: '🥇 1st Place' },
              { rank: 2, name: 'Kelvin Shirima', school: 'Ilboru Secondary', region: 'Arusha', xp: '2,610 XP', badge: '🥈 2nd Place' },
              { rank: 3, name: 'Neema John', school: 'Tabora Girls Secondary', region: 'Tabora', xp: '2,490 XP', badge: '🥉 3rd Place' }
            ].map((leader) => (
              <div key={leader.rank} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border-2 border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-amber-600">{leader.badge}</span>
                  <strong className="text-xs font-black text-indigo-600">{leader.xp}</strong>
                </div>
                <h4 className="font-black text-sm text-slate-900">{leader.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{leader.school} • {leader.region}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Printable Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-400 text-center space-y-6 relative">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-amber-400/30">
                <i className="fa-solid fa-award"></i>
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-amber-600">
                Tanzania National Curriculum Achievement
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Certificate of Academic Distinction
              </h2>
            </div>

            <p className="text-xs text-slate-500">This certifies that</p>
            <div className="text-2xl sm:text-3xl font-black text-indigo-700 font-serif border-b-2 border-indigo-200 pb-2 inline-block max-w-md">
              {scholarName}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              has demonstrated outstanding dedication and mastery of secondary school NECTA curriculum concepts at <strong className="text-slate-900">{schoolName}</strong>, achieving Level {level} with {points} Experience Points.
            </p>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200 text-xs font-bold text-slate-500">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Education TZ Verified ✓</div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-md transition"
              >
                <i className="fa-solid fa-print"></i>
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
