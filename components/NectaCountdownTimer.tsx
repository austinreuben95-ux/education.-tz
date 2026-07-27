import React, { useState, useEffect, useMemo } from 'react';

export interface NectaCountdownTimerProps {
  initialGrade?: string | null;
  onNavigateToExams?: () => void;
  onNavigateToPlanner?: () => void;
  onOpenYunAI?: (prompt: string) => void;
  onStartQuickStudy?: () => void;
}

export interface NectaExamSpec {
  id: string;
  gradeLabel: string;
  examCode: string;
  fullName: string;
  swahiliTitle: string;
  targetDate: string; // YYYY-MM-DD
  academicYearStart: string; // YYYY-MM-DD
  levelCategory: 'Primary' | 'O-Level' | 'A-Level';
  keySubjects: string[];
  tips: string[];
  badgeColor: string;
}

export const NECTA_EXAM_SCHEDULE: NectaExamSpec[] = [
  {
    id: 'psle-std7',
    gradeLabel: 'Standard 7',
    examCode: 'PSLE',
    fullName: 'Primary School Leaving Examination',
    swahiliTitle: 'Mtihani wa Kumaliza Elimu ya Msingi (Darasa la 7)',
    targetDate: '2026-09-09T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'Primary',
    keySubjects: ['Hisabati', 'Aghalabu/English', 'Kiswahili', 'Sayansi & Teknolojia', 'Maarifa ya Jamii'],
    tips: [
      'Master basic arithmetic, speed multiplication, and word problem conversions.',
      'Review Swahili grammar (Mnyambuliko wa kitenzi) and English tenses.',
      'Practice diagrams for Science & Technology experiments.'
    ],
    badgeColor: 'bg-emerald-500 text-white'
  },
  {
    id: 'sfna-std4',
    gradeLabel: 'Standard 4',
    examCode: 'SFNA',
    fullName: 'Standard Four National Assessment',
    swahiliTitle: 'Pima la Kitaifa la Darasa la Nne',
    targetDate: '2026-10-21T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'Primary',
    keySubjects: ['Hisabati', 'English', 'Kiswahili', 'Sayansi', 'Uraia na Maadili'],
    tips: [
      'Focus on foundational reading comprehension and basic math tables.',
      'Practice drawing simple maps and civic responsibility principles.'
    ],
    badgeColor: 'bg-teal-500 text-white'
  },
  {
    id: 'ftna-form2',
    gradeLabel: 'Form 2',
    examCode: 'FTNA',
    fullName: 'Form Two National Assessment',
    swahiliTitle: 'Tathmini ya Kitaifa ya Kidato cha Pili',
    targetDate: '2026-11-02T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'O-Level',
    keySubjects: ['Physics', 'Chemistry', 'Biology', 'Basic Mathematics', 'Geography', 'History', 'Civics', 'Kiswahili', 'English'],
    tips: [
      'Master Form 1 & 2 formula derivations in Physics and Chemistry math problems.',
      'Practice NECTA format diagrams for Biology organ structures.',
      'Ensure clear essay structure for History and Civics.'
    ],
    badgeColor: 'bg-indigo-600 text-white'
  },
  {
    id: 'csee-form4',
    gradeLabel: 'Form 4',
    examCode: 'CSEE',
    fullName: 'Certificate of Secondary Education Examination',
    swahiliTitle: 'Mtihani wa Kidato cha Nne (O-Level Final)',
    targetDate: '2026-11-09T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'O-Level',
    keySubjects: ['Physics', 'Chemistry', 'Biology', 'Basic Math', 'English', 'Kiswahili', 'Geography', 'History', 'Civics'],
    tips: [
      'Solve at least 5 previous NECTA CSEE past papers (2019–2025).',
      'Pay extra attention to Practical exams (Physics, Chemistry, Biology Paper 3).',
      'Review map reading and calculation formulas in Geography.'
    ],
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    id: 'acsee-form6',
    gradeLabel: 'Form 6',
    examCode: 'ACSEE',
    fullName: 'Advanced Certificate of Secondary Education Examination',
    swahiliTitle: 'Mtihani wa Kidato cha Sita (A-Level Final)',
    targetDate: '2027-05-03T08:00:00',
    academicYearStart: '2026-07-01T00:00:00',
    levelCategory: 'A-Level',
    keySubjects: ['PCB', 'PCM', 'CBG', 'PGM', 'EGM', 'HGK', 'HGL', 'HKL', 'BAM', 'General Studies'],
    tips: [
      'Deep dive into Bamb / Pure Math integration and organic reaction mechanisms.',
      'Ensure comprehensive referencing for GS essay questions.',
      'Time management: practice 3-hour mock exam simulations.'
    ],
    badgeColor: 'bg-rose-600 text-white'
  },
  {
    id: 'terminal-annual',
    gradeLabel: 'Form 1 / 3 / 5',
    examCode: 'ANNUAL',
    fullName: 'National Annual Progression Examinations',
    swahiliTitle: 'Mithani ya Mwaka na Muhula wa Pili',
    targetDate: '2026-11-16T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'O-Level',
    keySubjects: ['All Form Syllabus Subjects'],
    tips: [
      'Ensure complete notes coverage for all topics taught this academic year.',
      'Practice speed tests to prepare for next year\'s NECTA national exam.'
    ],
    badgeColor: 'bg-cyan-600 text-white'
  }
];

export const NectaCountdownTimer: React.FC<NectaCountdownTimerProps> = ({
  initialGrade,
  onNavigateToExams,
  onNavigateToPlanner,
  onOpenYunAI,
  onStartQuickStudy
}) => {
  // Determine starting exam based on initialGrade
  const initialExamId = useMemo(() => {
    if (!initialGrade) return 'csee-form4';
    const lower = initialGrade.toLowerCase();
    if (lower.includes('standard 7') || lower.includes('darasa la 7') || lower.includes('primary')) return 'psle-std7';
    if (lower.includes('standard 4') || lower.includes('darasa la 4')) return 'sfna-std4';
    if (lower.includes('form 2') || lower.includes('kidato cha 2')) return 'ftna-form2';
    if (lower.includes('form 4') || lower.includes('kidato cha 4') || lower.includes('secondary')) return 'csee-form4';
    if (lower.includes('form 6') || lower.includes('kidato cha 6') || lower.includes('high school')) return 'acsee-form6';
    return 'csee-form4';
  }, [initialGrade]);

  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);

  useEffect(() => {
    if (initialGrade) {
      setSelectedExamId(initialExamId);
    }
  }, [initialGrade, initialExamId]);

  const activeExam = useMemo(() => {
    return NECTA_EXAM_SCHEDULE.find(e => e.id === selectedExamId) || NECTA_EXAM_SCHEDULE[3];
  }, [selectedExamId]);

  // Realtime countdown calculation
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeDiff = useMemo(() => {
    const target = new Date(activeExam.targetDate).getTime();
    const current = now.getTime();
    const diffMs = Math.max(0, target - current);

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Progress bar calculation
    const start = new Date(activeExam.academicYearStart).getTime();
    const totalDuration = Math.max(1, target - start);
    const elapsed = Math.max(0, current - start);
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

    return { days, hours, minutes, seconds, isExpired: diffMs <= 0, progressPercent };
  }, [now, activeExam]);

  // Urgency status badge
  const urgencyStatus = useMemo(() => {
    if (timeDiff.isExpired) {
      return {
        label: 'NECTA Examination in Progress!',
        swahili: 'Mtihani wa NECTA Unaendelea!',
        color: 'bg-rose-500 text-white animate-pulse',
        icon: 'fa-triangle-exclamation'
      };
    }
    if (timeDiff.days <= 30) {
      return {
        label: 'Final Sprint Phase (< 30 Days)',
        swahili: 'Hatua ya Mwisho - Mazoezi ya Kasi!',
        color: 'bg-rose-500 text-white animate-pulse',
        icon: 'fa-bolt-lightning'
      };
    }
    if (timeDiff.days <= 90) {
      return {
        label: 'Intensive Revision Phase',
        swahili: 'Kipindi cha Kujirudia na Papers!',
        color: 'bg-amber-500 text-slate-950 font-black',
        icon: 'fa-fire'
      };
    }
    return {
      label: 'Syllabus Coverage Phase',
      swahili: 'Kipindi cha Kusoma Mada na Vidokezo',
      color: 'bg-emerald-500 text-slate-950 font-black',
      icon: 'fa-compass'
    };
  }, [timeDiff.days, timeDiff.isExpired]);

  // Format date readable
  const formattedExamDate = useMemo(() => {
    const d = new Date(activeExam.targetDate);
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [activeExam.targetDate]);

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-indigo-900/60 transition-all duration-300">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Grade Selection Selector */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
              <i className="fa-solid fa-flag text-xs"></i> Tanzania NECTA Portal
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${urgencyStatus.color}`}>
              <i className={`fa-solid ${urgencyStatus.icon}`}></i> {urgencyStatus.label}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <i className="fa-solid fa-hourglass-start text-indigo-400 animate-spin-slow"></i>
            NECTA Exam Countdown 🇹🇿
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Official countdown to <span className="text-indigo-300 font-bold">{activeExam.fullName} ({activeExam.examCode})</span>
          </p>
        </div>

        {/* Grade Selector Switcher */}
        <div className="shrink-0 space-y-1.5">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <i className="fa-solid fa-graduation-cap text-indigo-400"></i> Change Grade Exam:
          </label>
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {NECTA_EXAM_SCHEDULE.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                  selectedExamId === exam.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{exam.examCode}</span>
                <span className="text-[10px] opacity-75 font-normal">({exam.gradeLabel})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Countdown Numbers Section */}
      <div className="relative z-10 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 text-center">
        {/* Days Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-indigo-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-400 tracking-tight font-mono">
            {String(timeDiff.days).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-indigo-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>DAYS</span>
            <span className="text-[10px] text-slate-500 font-normal">(Siku)</span>
          </div>
        </div>

        {/* Hours Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-cyan-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 tracking-tight font-mono">
            {String(timeDiff.hours).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-cyan-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>HOURS</span>
            <span className="text-[10px] text-slate-500 font-normal">(Masaa)</span>
          </div>
        </div>

        {/* Minutes Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-amber-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-400 tracking-tight font-mono">
            {String(timeDiff.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-amber-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>MINUTES</span>
            <span className="text-[10px] text-slate-500 font-normal">(Dakika)</span>
          </div>
        </div>

        {/* Seconds Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-rose-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-400 tracking-tight font-mono animate-pulse">
            {String(timeDiff.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-rose-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>SECONDS</span>
            <span className="text-[10px] text-slate-500 font-normal">(Sekunde)</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Academic Calendar Context */}
      <div className="relative z-10 space-y-2 pb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <i className="fa-regular fa-calendar-check text-indigo-400"></i>
            Exam Date: <strong className="text-white">{formattedExamDate}</strong>
          </span>
          <span className="text-indigo-300 font-black">{timeDiff.progressPercent}% Academic Year Completed</span>
        </div>
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-400 h-full rounded-full transition-all duration-1000 shadow-lg shadow-indigo-500/50"
            style={{ width: `${timeDiff.progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Preparation Advice & Key Subjects Bar */}
      <div className="relative z-10 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 grid md:grid-cols-2 gap-4 items-center">
        <div>
          <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5 mb-1">
            <i className="fa-solid fa-lightbulb"></i> NECTA Prep Strategy for {activeExam.examCode}:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            "{activeExam.tips[0]}"
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          {onStartQuickStudy && (
            <button
              onClick={onStartQuickStudy}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-400/30 active:scale-95"
              title="Open a random syllabus topic for immediate study review"
            >
              <i className="fa-solid fa-bolt text-slate-950"></i>
              <span>Quick Study Session ⚡</span>
            </button>
          )}

          {onNavigateToExams && (
            <button
              onClick={onNavigateToExams}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <i className="fa-solid fa-file-signature text-amber-300"></i>
              <span>Past Papers Vault</span>
            </button>
          )}

          {onNavigateToPlanner && (
            <button
              onClick={onNavigateToPlanner}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs transition flex items-center gap-1.5 border border-slate-700 active:scale-95"
            >
              <i className="fa-solid fa-calendar-days text-cyan-400"></i>
              <span>Revision Schedule</span>
            </button>
          )}

          {onOpenYunAI && (
            <button
              onClick={() => onOpenYunAI(`I am preparing for the NECTA ${activeExam.examCode} (${activeExam.gradeLabel}) exam. Please create a tailored 30-day revision plan with key high-yield topics!`)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/30 active:scale-95"
            >
              <i className="fa-solid fa-robot text-slate-950"></i>
              <span>Ask Yun Revision Tips</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
