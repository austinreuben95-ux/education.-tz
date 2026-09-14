import React, { useState, useMemo } from 'react';

export type MarkBase = 25 | 50 | 100;
export type CalculationMode = 'average' | 'sum' | 'both';

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
}

export interface GradeThreshold {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  minScore: number;
  maxScore: number;
  minPercent: number;
  maxPercent: number;
  points: number;
  isPass: boolean;
  statusLabel: string;
  englishRemark: string;
  swahiliRemark: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
}

// Grade thresholds dynamically generated based on Base (25, 50, 100)
export function getGradeThresholds(base: MarkBase): GradeThreshold[] {
  if (base === 25) {
    return [
      {
        grade: 'A',
        minScore: 21,
        maxScore: 25,
        minPercent: 84,
        maxPercent: 100,
        points: 1,
        isPass: true,
        statusLabel: 'Distinction (Vyema Sana)',
        englishRemark: 'Excellent',
        swahiliRemark: 'Vyema Sana (Maksi 21 - 25)',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50 text-emerald-950',
        borderClass: 'border-emerald-400',
        badgeClass: 'bg-emerald-600 text-white'
      },
      {
        grade: 'B',
        minScore: 16,
        maxScore: 20,
        minPercent: 64,
        maxPercent: 80,
        points: 2,
        isPass: true,
        statusLabel: 'Very Good (Vyema)',
        englishRemark: 'Very Good',
        swahiliRemark: 'Vyema (Maksi 16 - 20)',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-50 text-blue-950',
        borderClass: 'border-blue-400',
        badgeClass: 'bg-blue-600 text-white'
      },
      {
        grade: 'C',
        minScore: 11,
        maxScore: 15,
        minPercent: 44,
        maxPercent: 60,
        points: 3,
        isPass: true,
        statusLabel: 'Credit Pass (Wastani)',
        englishRemark: 'Good / Credit',
        swahiliRemark: 'Wastani (Maksi 11 - 15)',
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-50 text-amber-950',
        borderClass: 'border-amber-400',
        badgeClass: 'bg-amber-600 text-white'
      },
      {
        grade: 'D',
        minScore: 6,
        maxScore: 10,
        minPercent: 24,
        maxPercent: 40,
        points: 4,
        isPass: true,
        statusLabel: 'Pass Mark (Dhaifu)',
        englishRemark: 'Pass / Satisfactory',
        swahiliRemark: 'Dhaifu (Maksi 6 - 10)',
        colorClass: 'text-orange-600',
        bgClass: 'bg-orange-50 text-orange-950',
        borderClass: 'border-orange-400',
        badgeClass: 'bg-orange-600 text-white'
      },
      {
        grade: 'F',
        minScore: 0,
        maxScore: 5,
        minPercent: 0,
        maxPercent: 20,
        points: 5,
        isPass: false,
        statusLabel: 'Below Pass Mark (Vibaya)',
        englishRemark: 'Fail / Unsatisfactory',
        swahiliRemark: 'Vibaya (Maksi 0 - 5)',
        colorClass: 'text-red-600',
        bgClass: 'bg-red-50 text-red-950',
        borderClass: 'border-red-400',
        badgeClass: 'bg-red-600 text-white'
      }
    ];
  }

  if (base === 50) {
    return [
      {
        grade: 'A',
        minScore: 41,
        maxScore: 50,
        minPercent: 81,
        maxPercent: 100,
        points: 1,
        isPass: true,
        statusLabel: 'Distinction (Vyema Sana)',
        englishRemark: 'Excellent',
        swahiliRemark: 'Vyema Sana (Maksi 41 - 50)',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50 text-emerald-950',
        borderClass: 'border-emerald-400',
        badgeClass: 'bg-emerald-600 text-white'
      },
      {
        grade: 'B',
        minScore: 31,
        maxScore: 40,
        minPercent: 61,
        maxPercent: 80,
        points: 2,
        isPass: true,
        statusLabel: 'Very Good (Vyema)',
        englishRemark: 'Very Good',
        swahiliRemark: 'Vyema (Maksi 31 - 40)',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-50 text-blue-950',
        borderClass: 'border-blue-400',
        badgeClass: 'bg-blue-600 text-white'
      },
      {
        grade: 'C',
        minScore: 21,
        maxScore: 30,
        minPercent: 41,
        maxPercent: 60,
        points: 3,
        isPass: true,
        statusLabel: 'Credit Pass (Wastani)',
        englishRemark: 'Good / Credit',
        swahiliRemark: 'Wastani (Maksi 21 - 30)',
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-50 text-amber-950',
        borderClass: 'border-amber-400',
        badgeClass: 'bg-amber-600 text-white'
      },
      {
        grade: 'D',
        minScore: 11,
        maxScore: 20,
        minPercent: 21,
        maxPercent: 40,
        points: 4,
        isPass: true,
        statusLabel: 'Pass Mark (Dhaifu)',
        englishRemark: 'Pass / Satisfactory',
        swahiliRemark: 'Dhaifu (Maksi 11 - 20)',
        colorClass: 'text-orange-600',
        bgClass: 'bg-orange-50 text-orange-950',
        borderClass: 'border-orange-400',
        badgeClass: 'bg-orange-600 text-white'
      },
      {
        grade: 'F',
        minScore: 0,
        maxScore: 10,
        minPercent: 0,
        maxPercent: 20,
        points: 5,
        isPass: false,
        statusLabel: 'Below Pass Mark (Vibaya)',
        englishRemark: 'Fail / Unsatisfactory',
        swahiliRemark: 'Vibaya (Maksi 0 - 10)',
        colorClass: 'text-red-600',
        bgClass: 'bg-red-50 text-red-950',
        borderClass: 'border-red-400',
        badgeClass: 'bg-red-600 text-white'
      }
    ];
  }

  // Base 100 (Default 100-mark scale)
  return [
    {
      grade: 'A',
      minScore: 81,
      maxScore: 100,
      minPercent: 81,
      maxPercent: 100,
      points: 1,
      isPass: true,
      statusLabel: 'Distinction (Vyema Sana)',
      englishRemark: 'Excellent',
      swahiliRemark: 'Vyema Sana (Maksi 81 - 100)',
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50 text-emerald-950',
      borderClass: 'border-emerald-400',
      badgeClass: 'bg-emerald-600 text-white'
    },
    {
      grade: 'B',
      minScore: 61,
      maxScore: 80,
      minPercent: 61,
      maxPercent: 80,
      points: 2,
      isPass: true,
      statusLabel: 'Very Good (Vyema)',
      englishRemark: 'Very Good',
      swahiliRemark: 'Vyema (Maksi 61 - 80)',
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50 text-blue-950',
      borderClass: 'border-blue-400',
      badgeClass: 'bg-blue-600 text-white'
    },
    {
      grade: 'C',
      minScore: 41,
      maxScore: 60,
      minPercent: 41,
      maxPercent: 60,
      points: 3,
      isPass: true,
      statusLabel: 'Credit Pass (Wastani)',
      englishRemark: 'Good / Credit',
      swahiliRemark: 'Wastani (Maksi 41 - 60)',
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50 text-amber-950',
      borderClass: 'border-amber-400',
      badgeClass: 'bg-amber-600 text-white'
    },
    {
      grade: 'D',
      minScore: 21,
      maxScore: 40,
      minPercent: 21,
      maxPercent: 40,
      points: 4,
      isPass: true,
      statusLabel: 'Pass Mark (Dhaifu)',
      englishRemark: 'Pass / Satisfactory',
      swahiliRemark: 'Dhaifu (Maksi 21 - 40)',
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50 text-orange-950',
      borderClass: 'border-orange-400',
      badgeClass: 'bg-orange-600 text-white'
    },
    {
      grade: 'F',
      minScore: 0,
      maxScore: 20,
      minPercent: 0,
      maxPercent: 20,
      points: 5,
      isPass: false,
      statusLabel: 'Below Pass Mark (Vibaya)',
      englishRemark: 'Fail / Unsatisfactory',
      swahiliRemark: 'Vibaya (Maksi 0 - 20)',
      colorClass: 'text-red-600',
      bgClass: 'bg-red-50 text-red-950',
      borderClass: 'border-red-400',
      badgeClass: 'bg-red-600 text-white'
    }
  ];
}

export function matchGrade(score: number, thresholds: GradeThreshold[]): GradeThreshold {
  for (const t of thresholds) {
    if (score >= t.minScore) {
      return t;
    }
  }
  return thresholds[thresholds.length - 1];
}

const PRESET_SUBJECTS_50: ScoreEntry[] = [
  { id: '1', name: 'Kiswahili', score: 44 },
  { id: '2', name: 'English Language', score: 38 },
  { id: '3', name: 'Basic Mathematics', score: 32 },
  { id: '4', name: 'Science & Technology', score: 41 },
  { id: '5', name: 'Social Studies (Maarifa ya Jamii)', score: 36 }
];

const PRESET_SUBJECTS_25: ScoreEntry[] = [
  { id: '1', name: 'Quiz 1: Vocabulary & Comprehension', score: 22 },
  { id: '2', name: 'Quiz 2: Grammar & Tenses', score: 19 },
  { id: '3', name: 'Weekly Assignment: Algebra', score: 17 },
  { id: '4', name: 'Mid-Term Test: Science', score: 21 },
  { id: '5', name: 'Continuous Assessment: Civics', score: 14 }
];

const PRESET_SUBJECTS_100: ScoreEntry[] = [
  { id: '1', name: 'Kiswahili', score: 82 },
  { id: '2', name: 'English Language', score: 74 },
  { id: '3', name: 'Basic Mathematics', score: 65 },
  { id: '4', name: 'Biology', score: 78 },
  { id: '5', name: 'Geography', score: 70 },
  { id: '6', name: 'History', score: 68 },
  { id: '7', name: 'Civics', score: 85 }
];

export interface AverageSumCalculatorProps {
  onBack?: () => void;
}

export const AverageSumCalculator: React.FC<AverageSumCalculatorProps> = ({ onBack }) => {
  const [markBase, setMarkBase] = useState<MarkBase>(50);
  const [calcMode, setCalcMode] = useState<CalculationMode>('both');
  const [scores, setScores] = useState<ScoreEntry[]>(PRESET_SUBJECTS_50);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newScoreVal, setNewScoreVal] = useState<number>(35);
  const [quickPasteText, setQuickPasteText] = useState('');
  const [showQuickPaste, setShowQuickPaste] = useState(false);

  // Switch base and adjust default preset
  const handleSelectBase = (base: MarkBase) => {
    setMarkBase(base);
    if (base === 25) {
      setScores(PRESET_SUBJECTS_25);
      setNewScoreVal(18);
    } else if (base === 50) {
      setScores(PRESET_SUBJECTS_50);
      setNewScoreVal(35);
    } else {
      setScores(PRESET_SUBJECTS_100);
      setNewScoreVal(70);
    }
  };

  const thresholds = useMemo(() => getGradeThresholds(markBase), [markBase]);

  // Pass mark threshold (Grade D min score)
  const passMarkThreshold = useMemo(() => {
    const gradeD = thresholds.find((t) => t.grade === 'D');
    return gradeD ? gradeD.minScore : Math.round(markBase * 0.21);
  }, [thresholds, markBase]);

  // Calculate sum and average
  const { sum, average, averagePercent, count, activeGrade, isPassed, marginToPass } = useMemo(() => {
    const validScores = scores.filter((s) => !isNaN(s.score));
    const cnt = validScores.length;
    const s = validScores.reduce((acc, curr) => acc + curr.score, 0);
    const avg = cnt > 0 ? s / cnt : 0;
    const avgP = markBase > 0 ? (avg / markBase) * 100 : 0;
    const gr = matchGrade(avg, thresholds);
    const passed = gr.isPass;
    const margin = avg - passMarkThreshold;

    return {
      sum: s,
      average: Number(avg.toFixed(2)),
      averagePercent: Number(avgP.toFixed(1)),
      count: cnt,
      activeGrade: gr,
      isPassed: passed,
      marginToPass: Number(margin.toFixed(2))
    };
  }, [scores, markBase, thresholds, passMarkThreshold]);

  // Update a single score
  const handleUpdateScore = (id: string, newScore: number) => {
    const clamped = Math.max(0, Math.min(markBase, isNaN(newScore) ? 0 : newScore));
    setScores((prev) => prev.map((item) => (item.id === id ? { ...item, score: clamped } : item)));
  };

  // Add new item
  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSubjectName.trim() || `Assessment ${scores.length + 1}`;
    const clamped = Math.max(0, Math.min(markBase, newScoreVal));
    setScores((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        score: clamped
      }
    ]);
    setNewSubjectName('');
  };

  // Remove item
  const handleRemoveScore = (id: string) => {
    if (scores.length <= 1) {
      alert('At least 1 score entry is needed for calculation.');
      return;
    }
    setScores((prev) => prev.filter((s) => s.id !== id));
  };

  // Quick Paste Numbers handler
  const handleLoadQuickPaste = () => {
    if (!quickPasteText.trim()) return;
    const parsed = quickPasteText
      .split(/[\s,;\n\t]+/)
      .map((val) => parseFloat(val.trim()))
      .filter((n) => !isNaN(n));

    if (parsed.length === 0) {
      alert('Please enter valid numeric scores separated by commas or spaces.');
      return;
    }

    const newEntries: ScoreEntry[] = parsed.map((num, idx) => ({
      id: `${Date.now()}_${idx}`,
      name: `Subject / Test ${idx + 1}`,
      score: Math.max(0, Math.min(markBase, num))
    }));

    setScores(newEntries);
    setQuickPasteText('');
    setShowQuickPaste(false);
  };

  return (
    <div id="average-sum-calculator-container" className="max-w-7xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                <i className="fa-solid fa-calculator mr-1"></i> Multi-Scale Calculator
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Over 25 | Over 50 | Over 100
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <i className="fa-solid fa-scale-balanced text-amber-400"></i>
              Calculate Average & Sum with Pass Mark (A, B, C, D, F)
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 font-medium mt-1 max-w-2xl leading-relaxed">
              Calculate your overall <strong>Average</strong> or <strong>Sum</strong>, pick your grading scale (<strong>Over 25</strong>, <strong>Over 50</strong>, or <strong>Over 100</strong>), and view your exact A, B, C, D, F pass mark standing!
            </p>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition flex items-center gap-1.5 border border-slate-700"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: SECTION SAYING "OVER 50 OR 100 OR 25" (TOTAL MARK SCALE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
              Step 1: Choose Grading Mark Scale
            </span>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
              <i className="fa-solid fa-bullseye text-amber-500"></i>
              Section: Select Total Marks (Over 25, 50, or 100)
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
            Current Scale: <strong className="text-indigo-700">Over {markBase} Marks</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* OVER 25 CARD */}
          <div
            id="scale-option-over-25"
            onClick={() => handleSelectBase(25)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              markBase === 25
                ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/20 scale-[1.01]'
                : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                markBase === 25 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
              }`}>
                / 25 Marks
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                markBase === 25 ? 'border-amber-600 bg-amber-500 text-slate-950' : 'border-slate-300'
              }`}>
                {markBase === 25 && <div className="w-2 h-2 rounded-full bg-slate-950"></div>}
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Over 25</span>
                <span className="text-xs font-extrabold text-amber-700">(Quizzes & CATs)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Standard for continuous assessment tests, weekly homework quizzes, and practical short papers.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-bold text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Grade A (Vyema Sana):</span>
                <strong className="text-emerald-700">21 – 25 Marks</strong>
              </div>
              <div className="flex justify-between">
                <span>Pass Mark (Grade D):</span>
                <strong className="text-orange-700">≥ 6 / 25 Marks</strong>
              </div>
            </div>
          </div>

          {/* OVER 50 CARD */}
          <div
            id="scale-option-over-50"
            onClick={() => handleSelectBase(50)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              markBase === 50
                ? 'bg-indigo-50/90 border-indigo-600 shadow-md ring-2 ring-indigo-500/20 scale-[1.01]'
                : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                markBase === 50 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                / 50 Marks (PSLE Standard)
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                markBase === 50 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
              }`}>
                {markBase === 50 && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Over 50</span>
                <span className="text-xs font-extrabold text-indigo-700">(PSLE / Mid-Term)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Official NECTA scale for Primary School Leaving Examination (PSLE) and secondary terminal tests.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-bold text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Grade A (Vyema Sana):</span>
                <strong className="text-emerald-700">41 – 50 Marks</strong>
              </div>
              <div className="flex justify-between">
                <span>Pass Mark (Grade D):</span>
                <strong className="text-orange-700">≥ 11 / 50 Marks</strong>
              </div>
            </div>
          </div>

          {/* OVER 100 CARD */}
          <div
            id="scale-option-over-100"
            onClick={() => handleSelectBase(100)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              markBase === 100
                ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/20 scale-[1.01]'
                : 'bg-slate-50/70 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                markBase === 100 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                / 100 Marks (%)
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                markBase === 100 ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
              }`}>
                {markBase === 100 && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Over 100</span>
                <span className="text-xs font-extrabold text-emerald-700">(National & Percentage)</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Standard full percentage scale for secondary CSEE/ACSEE national papers, mock exams, and overall scores.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-bold text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Grade A (Vyema Sana):</span>
                <strong className="text-emerald-700">81 – 100 Marks</strong>
              </div>
              <div className="flex justify-between">
                <span>Pass Mark (Grade D):</span>
                <strong className="text-orange-700">≥ 21 / 100 Marks</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CALCULATION MODE & LIVE RESULTS WITH THE AVERAGE THE PERSON HAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Calculation Results & Pass Mark Standing */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
                  Step 2: Choose Calculation Target
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Calculate Average or Sum
                </h3>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCalcMode('average')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                    calcMode === 'average'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className="fa-solid fa-chart-pie text-[10px]"></i> Average
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('sum')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                    calcMode === 'sum'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className="fa-solid fa-plus text-[10px]"></i> Sum
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('both')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                    calcMode === 'both'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className="fa-solid fa-equals text-[10px]"></i> Both
                </button>
              </div>
            </div>

            {/* RESULTS BANNER: THE AVERAGE THE PERSON HAS & THE PASS MARK STANDING */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white space-y-5 shadow-xl border border-slate-800 text-center relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

              {/* Status Header */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-user-graduate text-amber-400"></i>
                  Evaluated Over {markBase} Mark Scale
                </span>
                <span>{count} Subject{count === 1 ? '' : 's'} Calculated</span>
              </div>

              {/* Average & Sum Stats Grid */}
              <div className={`grid gap-3 ${calcMode === 'both' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {(calcMode === 'average' || calcMode === 'both') && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      The Average The Person Has (Wastani)
                    </span>
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                        {average}
                      </span>
                      <span className="text-sm font-black text-slate-400">/ {markBase}</span>
                    </div>
                    <span className="text-xs font-extrabold text-cyan-300 mt-1 inline-block bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                      {averagePercent}% Percentage
                    </span>
                  </div>
                )}

                {(calcMode === 'sum' || calcMode === 'both') && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Total Sum Calculated (Jumla)
                    </span>
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight">
                        {sum}
                      </span>
                      <span className="text-sm font-black text-slate-400">/ {count * markBase}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-300 mt-1 inline-block bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                      Max Possible: {count * markBase} Marks
                    </span>
                  </div>
                )}
              </div>

              {/* Achieved Grade & Pass Mark Standing */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Assigned Letter Grade & Pass Mark Standing
                </span>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className={`px-5 py-2 rounded-2xl text-2xl sm:text-3xl font-black ${activeGrade.badgeClass} shadow-md flex items-center gap-2`}>
                    <span>Grade {activeGrade.grade}</span>
                    <span className="text-xs font-black opacity-90">({activeGrade.points} Pt)</span>
                  </div>

                  {isPassed ? (
                    <div className="px-4 py-2 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/80 text-emerald-300 text-xs font-black uppercase tracking-wide flex items-center gap-2 shadow-xs">
                      <i className="fa-solid fa-circle-check text-emerald-400 text-base"></i>
                      <span>PASSED (Above Pass Mark)</span>
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-2xl bg-red-950/90 border-2 border-red-500/80 text-red-300 text-xs font-black uppercase tracking-wide flex items-center gap-2 shadow-xs">
                      <i className="fa-solid fa-circle-xmark text-red-400 text-base"></i>
                      <span>BELOW PASS MARK (Grade F)</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-300 font-medium leading-relaxed pt-2 border-t border-slate-800/80">
                  <p className="font-bold text-white">{activeGrade.statusLabel} • {activeGrade.swahiliRemark}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isPassed
                      ? `Your average (${average}) is +${marginToPass} marks above the minimum pass mark (${passMarkThreshold} / ${markBase}).`
                      : `Your average (${average}) is ${Math.abs(marginToPass)} marks short of the minimum pass mark (${passMarkThreshold} / ${markBase}).`}
                  </p>
                </div>
              </div>

              {/* Dynamic Visual Grade Meter with Student Average Pointer */}
              <div className="space-y-2 pt-1 text-left">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span>Grade Spectrum (F → A):</span>
                  <span className="text-amber-400 font-mono font-black">
                    Your Position: {average} / {markBase}
                  </span>
                </div>

                <div className="relative w-full h-5 rounded-full overflow-hidden flex bg-slate-800 p-0.5 border border-slate-700">
                  <div style={{ width: '20%' }} className="h-full bg-red-600 rounded-l-full" title="Grade F"></div>
                  <div style={{ width: '20%' }} className="h-full bg-orange-500" title="Grade D (Pass Mark)"></div>
                  <div style={{ width: '20%' }} className="h-full bg-amber-500" title="Grade C"></div>
                  <div style={{ width: '20%' }} className="h-full bg-blue-500" title="Grade B"></div>
                  <div style={{ width: '20%' }} className="h-full bg-emerald-500 rounded-r-full" title="Grade A"></div>
                </div>

                <div className="flex justify-between text-[10px] font-extrabold text-slate-400 px-1">
                  <span>F (0 - {thresholds[4].maxScore})</span>
                  <span className="text-orange-400 font-black">D (Pass: ≥{passMarkThreshold})</span>
                  <span>C</span>
                  <span>B</span>
                  <span className="text-emerald-400">A ({thresholds[0].minScore} - {markBase})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SECTION SHOWING A, B, C, D, F AS THE PASS MARK BREAKDOWN */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
                  Official Standard
                </span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-indigo-600"></i>
                  A, B, C, D, F Pass Mark Scale (Over {markBase})
                </h3>
              </div>
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Pass Mark = Grade D (≥{passMarkThreshold})
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Below is the official pass mark threshold for the <strong>Over {markBase}</strong> scale. The row matching your current average is actively highlighted!
            </p>

            {/* A, B, C, D, F Pass Mark Breakdown Cards */}
            <div className="space-y-2.5">
              {thresholds.map((t) => {
                const isCurrentGrade = activeGrade.grade === t.grade;
                const isPassMarkRow = t.grade === 'D';

                return (
                  <div
                    key={t.grade}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isCurrentGrade
                        ? 'bg-indigo-50/90 border-indigo-600 shadow-md ring-2 ring-indigo-500/30 scale-[1.01]'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl font-black text-lg flex items-center justify-center shrink-0 ${t.badgeClass} shadow-xs`}>
                        {t.grade}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">
                            {t.minScore} – {t.maxScore} Marks
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {t.minPercent}% – {t.maxPercent}%
                          </span>
                          {isPassMarkRow && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-300">
                              ⚡ Minimum Pass Mark
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-extrabold text-slate-700 mt-0.5">
                          {t.statusLabel}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {isCurrentGrade ? (
                        <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                          <i className="fa-solid fa-check"></i>
                          <span>Your Grade</span>
                        </span>
                      ) : t.isPass ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                          Pass (Vyema)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100/80 px-2.5 py-1 rounded-lg border border-red-300">
                          Fail (Chini)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanatory Pass Mark Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1.5">
              <div className="flex items-center gap-2 font-black text-amber-950">
                <i className="fa-solid fa-lightbulb text-amber-600"></i>
                <span>Tanzanian Academic Pass Mark Guideline (Over {markBase}):</span>
              </div>
              <p className="leading-relaxed">
                • <strong>Minimum Pass Mark:</strong> Grade D ({passMarkThreshold} / {markBase} marks) is the recognized pass standard.
              </p>
              <p className="leading-relaxed">
                • <strong>Credit Pass:</strong> Grade C and above ({thresholds[2].minScore}+ marks) is recommended for competitive secondary combinations and subject qualifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SUBJECT SCORE INPUTS & PRESETS TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block">
              Step 3: Enter Individual Marks
            </span>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-pen-to-square text-indigo-600"></i>
              Manage Subjects & Assessment Marks (Over {markBase})
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Edit the scores below or use Quick Paste to enter a list of marks directly.
            </p>
          </div>

          {/* Quick Actions & Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQuickPaste(!showQuickPaste)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 border border-slate-300"
            >
              <i className="fa-solid fa-paste text-indigo-600"></i>
              <span>{showQuickPaste ? 'Hide Quick Paste' : 'Quick Paste Numbers'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (markBase === 25) setScores(PRESET_SUBJECTS_25);
                else if (markBase === 50) setScores(PRESET_SUBJECTS_50);
                else setScores(PRESET_SUBJECTS_100);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition border border-indigo-200"
            >
              Reset Default Subjects
            </button>
            <button
              type="button"
              onClick={() => setScores([{ id: Date.now().toString(), name: 'Assessment 1', score: Math.round(markBase * 0.7) }])}
              className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition border border-red-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Quick Paste Modal / Box */}
        {showQuickPaste && (
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-indigo-200 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-bolt text-amber-500"></i> Fast Paste Scores List
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">Separated by commas, spaces, or lines</span>
            </div>
            <textarea
              rows={2}
              placeholder={`Example for Over ${markBase}: ${markBase === 25 ? '18, 22, 19, 24, 15' : markBase === 50 ? '42, 38, 45, 31, 49' : '82, 74, 65, 78, 85'}`}
              value={quickPasteText}
              onChange={(e) => setQuickPasteText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowQuickPaste(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLoadQuickPaste}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition shadow-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-down"></i>
                <span>Load & Calculate</span>
              </button>
            </div>
          </div>
        )}

        {/* Subjects Scores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scores.map((item, idx) => {
            const itemGrade = matchGrade(item.score, thresholds);
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-800 truncate" title={item.name}>
                    {idx + 1}. {item.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${itemGrade.badgeClass}`}>
                      {itemGrade.grade}
                    </span>
                    {scores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveScore(item.id)}
                        className="w-6 h-6 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-600 text-xs flex items-center justify-center transition"
                        title="Delete score"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max={markBase}
                      step="0.5"
                      value={item.score}
                      onChange={(e) => handleUpdateScore(item.id, parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-black text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center shadow-inner"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-500 shrink-0">
                    / {markBase} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>{itemGrade.englishRemark}</span>
                  <span>{Math.round((item.score / markBase) * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Subject / Score Row */}
        <form onSubmit={handleAddScore} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            placeholder="Add new subject name (e.g. Geography, Test 4, Project)"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl font-medium text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={markBase}
              step="0.5"
              value={newScoreVal}
              onChange={(e) => setNewScoreVal(parseFloat(e.target.value) || 0)}
              className="w-24 px-3 py-2.5 border border-slate-300 rounded-xl font-mono font-black text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              title={`Score out of ${markBase}`}
            />
            <span className="text-xs font-black text-slate-500">/ {markBase}</span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Add Subject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AverageSumCalculator;
