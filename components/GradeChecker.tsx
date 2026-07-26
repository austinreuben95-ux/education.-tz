import React, { useState } from 'react';

export type ScaleType = '50_MARK' | '100_MARK' | 'NECTA_CSEE' | 'NECTA_ACSEE';

export interface SubjectScore {
  id: string;
  name: string;
  score: number; // raw mark
  maxMark: number; // 50 or 100
}

export interface GradeResult {
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  percentage: number;
  points: number; // NECTA Point value: A=1, B=2, C=3, D=4, E=5, F=5/6
  englishRemark: string;
  swahiliRemark: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  advice: string;
}

export function evaluateGrade(score: number, maxMark: number = 50, scaleType: ScaleType = '50_MARK'): GradeResult {
  const percentage = Math.round((Math.max(0, Math.min(score, maxMark)) / maxMark) * 100);

  if (scaleType === '50_MARK' || maxMark === 50) {
    // User requested 50-Mark Scale: 41-50 A, 31-40 B, 21-30 C, 11-20 D, 0-10 F
    if (score >= 41) {
      return {
        grade: 'A',
        percentage,
        points: 1,
        englishRemark: 'Excellent (Vyema Sana)',
        swahiliRemark: 'Vyema Sana (Maksi 41 - 50)',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50 text-emerald-950',
        borderClass: 'border-emerald-400',
        advice: 'Outstanding performance! You have mastered this subject thoroughly. Keep maintaining this distinction level.'
      };
    } else if (score >= 31) {
      return {
        grade: 'B',
        percentage,
        points: 2,
        englishRemark: 'Very Good (Vyema)',
        swahiliRemark: 'Vyema (Maksi 31 - 40)',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-50 text-blue-950',
        borderClass: 'border-blue-400',
        advice: 'Very strong score! With a little more attention to minor details and past paper practice, you can easily reach Grade A.'
      };
    } else if (score >= 21) {
      return {
        grade: 'C',
        percentage,
        points: 3,
        englishRemark: 'Good / Average (Wastani)',
        swahiliRemark: 'Wastani (Maksi 21 - 30)',
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-50 text-amber-950',
        borderClass: 'border-amber-400',
        advice: 'Satisfactory pass. Review key syllabus sub-topics and practice timed quiz questions to push towards Grade B.'
      };
    } else if (score >= 11) {
      return {
        grade: 'D',
        percentage,
        points: 4,
        englishRemark: 'Pass / Weak (Dhaifu)',
        swahiliRemark: 'Dhaifu (Maksi 11 - 20)',
        colorClass: 'text-orange-600',
        bgClass: 'bg-orange-50 text-orange-950',
        borderClass: 'border-orange-400',
        advice: 'Barely passing. Focus on core topic notes, summary diagrams, and ask Yun AI tutor for step-by-step explanations.'
      };
    } else {
      return {
        grade: 'F',
        percentage,
        points: 5,
        englishRemark: 'Fail / Ununsatisfactory (Vibaya)',
        swahiliRemark: 'Vibaya (Maksi 0 - 10)',
        colorClass: 'text-red-600',
        bgClass: 'bg-red-50 text-red-950',
        borderClass: 'border-red-400',
        advice: 'Requires urgent revision. Start with foundational Form 1/2 concepts, read simplified topic summaries, and take daily practice quizzes.'
      };
    }
  } else if (scaleType === '100_MARK' || maxMark === 100) {
    // 100-Mark Scale corresponding to user request: 81-100 A, 61-80 B, 41-60 C, 21-40 D, 0-20 F
    if (score >= 81) {
      return {
        grade: 'A',
        percentage,
        points: 1,
        englishRemark: 'Excellent (Vyema Sana)',
        swahiliRemark: 'Vyema Sana (Maksi 81 - 100)',
        colorClass: 'text-emerald-600',
        bgClass: 'bg-emerald-50 text-emerald-950',
        borderClass: 'border-emerald-400',
        advice: 'Top tier distinction score! Maintain your revision rhythm and help peers to solidify your knowledge.'
      };
    } else if (score >= 61) {
      return {
        grade: 'B',
        percentage,
        points: 2,
        englishRemark: 'Very Good (Vyema)',
        swahiliRemark: 'Vyema (Maksi 61 - 80)',
        colorClass: 'text-blue-600',
        bgClass: 'bg-blue-50 text-blue-950',
        borderClass: 'border-blue-400',
        advice: 'Solid upper credit mark! Target specific weak subtopics to convert this into a Grade A.'
      };
    } else if (score >= 41) {
      return {
        grade: 'C',
        percentage,
        points: 3,
        englishRemark: 'Good / Credit (Wastani)',
        swahiliRemark: 'Wastani (Maksi 41 - 60)',
        colorClass: 'text-amber-600',
        bgClass: 'bg-amber-50 text-amber-950',
        borderClass: 'border-amber-400',
        advice: 'Good foundation score. Practice speed tests in the Test Bank to boost your speed and accuracy.'
      };
    } else if (score >= 21) {
      return {
        grade: 'D',
        percentage,
        points: 4,
        englishRemark: 'Pass / Satisfactory (Dhaifu)',
        swahiliRemark: 'Dhaifu (Maksi 21 - 40)',
        colorClass: 'text-orange-600',
        bgClass: 'bg-orange-50 text-orange-950',
        borderClass: 'border-orange-400',
        advice: 'Pass mark achieved. Intensive revision on past NECTA paper questions will elevate your grade.'
      };
    } else {
      return {
        grade: 'F',
        percentage,
        points: 5,
        englishRemark: 'Fail / Ununsatisfactory (Vibaya)',
        swahiliRemark: 'Vibaya (Maksi 0 - 20)',
        colorClass: 'text-red-600',
        bgClass: 'bg-red-50 text-red-950',
        borderClass: 'border-red-400',
        advice: 'Below pass threshold. Review basic formulas and principles with Yun AI assistant today.'
      };
    }
  } else if (scaleType === 'NECTA_ACSEE') {
    // Official A-Level NECTA scale: 75-100 A, 65-74 B, 55-64 C, 45-54 D, 35-44 E, 0-34 F
    const p = (score / maxMark) * 100;
    if (p >= 75) return { grade: 'A', percentage: Math.round(p), points: 1, englishRemark: 'Distinction (A)', swahiliRemark: 'Daraja la A', colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-400', advice: 'Principal Pass Grade A.' };
    if (p >= 65) return { grade: 'B', percentage: Math.round(p), points: 2, englishRemark: 'Credit (B)', swahiliRemark: 'Daraja la B', colorClass: 'text-blue-600', bgClass: 'bg-blue-50', borderClass: 'border-blue-400', advice: 'Principal Pass Grade B.' };
    if (p >= 55) return { grade: 'C', percentage: Math.round(p), points: 3, englishRemark: 'Good (C)', swahiliRemark: 'Daraja la C', colorClass: 'text-cyan-600', bgClass: 'bg-cyan-50', borderClass: 'border-cyan-400', advice: 'Principal Pass Grade C.' };
    if (p >= 45) return { grade: 'D', percentage: Math.round(p), points: 4, englishRemark: 'Satisfactory (D)', swahiliRemark: 'Daraja la D', colorClass: 'text-amber-600', bgClass: 'bg-amber-50', borderClass: 'border-amber-400', advice: 'Principal Pass Grade D.' };
    if (p >= 35) return { grade: 'E', percentage: Math.round(p), points: 5, englishRemark: 'Subsidiary (E)', swahiliRemark: 'Daraja la E', colorClass: 'text-orange-600', bgClass: 'bg-orange-50', borderClass: 'border-orange-400', advice: 'Subsidiary Pass Grade E.' };
    return { grade: 'F', percentage: Math.round(p), points: 6, englishRemark: 'Fail (F)', swahiliRemark: 'Daraja la F', colorClass: 'text-red-600', bgClass: 'bg-red-50', borderClass: 'border-red-400', advice: 'Fail Grade F.' };
  } else {
    // Official O-Level NECTA scale: 75-100 A, 65-74 B, 45-64 C, 30-44 D, 0-29 F
    const p = (score / maxMark) * 100;
    if (p >= 75) return { grade: 'A', percentage: Math.round(p), points: 1, englishRemark: 'Distinction (A)', swahiliRemark: 'Daraja la A', colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-400', advice: 'Excellent O-Level Grade A.' };
    if (p >= 65) return { grade: 'B', percentage: Math.round(p), points: 2, englishRemark: 'Very Good (B)', swahiliRemark: 'Daraja la B', colorClass: 'text-blue-600', bgClass: 'bg-blue-50', borderClass: 'border-blue-400', advice: 'Very Good O-Level Grade B.' };
    if (p >= 45) return { grade: 'C', percentage: Math.round(p), points: 3, englishRemark: 'Good (C)', swahiliRemark: 'Daraja la C', colorClass: 'text-amber-600', bgClass: 'bg-amber-50', borderClass: 'border-amber-400', advice: 'Good Credit Pass Grade C.' };
    if (p >= 30) return { grade: 'D', percentage: Math.round(p), points: 4, englishRemark: 'Pass (D)', swahiliRemark: 'Daraja la D', colorClass: 'text-orange-600', bgClass: 'bg-orange-50', borderClass: 'border-orange-400', advice: 'Basic Pass Grade D.' };
    return { grade: 'F', percentage: Math.round(p), points: 5, englishRemark: 'Fail (F)', swahiliRemark: 'Daraja la F', colorClass: 'text-red-600', bgClass: 'bg-red-50', borderClass: 'border-red-400', advice: 'Unsatisfactory Grade F.' };
  }
}

export interface GradeCheckerProps {
  onNavigateToExams?: () => void;
  onOpenYunAI?: (prompt: string) => void;
}

export const GradeChecker: React.FC<GradeCheckerProps> = ({
  onNavigateToExams,
  onOpenYunAI
}) => {
  const [scaleType, setScaleType] = useState<ScaleType>('50_MARK');
  const [maxMark, setMaxMark] = useState<number>(50);
  const [rawScore, setRawScore] = useState<number>(42);

  // Multi-subject batch calculator state
  const [multiSubjects, setMultiSubjects] = useState<SubjectScore[]>([
    { id: '1', name: 'Mathematics', score: 42, maxMark: 50 },
    { id: '2', name: 'Physics', score: 38, maxMark: 50 },
    { id: '3', name: 'Chemistry', score: 45, maxMark: 50 },
    { id: '4', name: 'Biology', score: 35, maxMark: 50 },
    { id: '5', name: 'English Language', score: 40, maxMark: 50 },
    { id: '6', name: 'Kiswahili', score: 48, maxMark: 50 },
    { id: '7', name: 'Geography', score: 33, maxMark: 50 },
  ]);

  const [activeTab, setActiveTab] = useState<'single' | 'matrix' | 'multi'>('single');

  // Handle Scale Change
  const handleScaleChange = (type: ScaleType) => {
    setScaleType(type);
    if (type === '50_MARK') {
      setMaxMark(50);
      if (rawScore > 50) setRawScore(42);
    } else if (type === '100_MARK') {
      setMaxMark(100);
      setRawScore(Math.min(100, rawScore * 2));
    } else {
      setMaxMark(100);
    }
  };

  const currentResult = evaluateGrade(rawScore, maxMark, scaleType);

  // Multi-subject calculations
  const evaluatedMulti = multiSubjects.map(sub => ({
    ...sub,
    res: evaluateGrade(sub.score, sub.maxMark, scaleType)
  }));

  // Best 7 subjects points sum
  const sortedPoints = [...evaluatedMulti].map(s => s.res.points).sort((a, b) => a - b);
  const best7Points = sortedPoints.slice(0, 7).reduce((sum, p) => sum + p, 0);

  let division = 'Division I';
  let divisionBadge = 'bg-emerald-500 text-white';
  let divisionDesc = 'Outstanding Performance! Eligible for top High School combinations & University sponsorship.';

  if (best7Points <= 17) {
    division = 'Division I';
    divisionBadge = 'bg-emerald-600 text-white';
  } else if (best7Points <= 21) {
    division = 'Division II';
    divisionBadge = 'bg-blue-600 text-white';
    divisionDesc = 'Very Good Performance! Strong pass across major core subjects.';
  } else if (best7Points <= 25) {
    division = 'Division III';
    divisionBadge = 'bg-amber-600 text-white';
    divisionDesc = 'Good Pass! Meets general entry criteria for diploma and high school tracks.';
  } else if (best7Points <= 31) {
    division = 'Division IV';
    divisionBadge = 'bg-orange-600 text-white';
    divisionDesc = 'Pass with minimum subject requirements.';
  } else {
    division = 'Division 0 (Fail)';
    divisionBadge = 'bg-red-600 text-white';
    divisionDesc = 'Requires resitting or targeted remedial revision in key subjects.';
  }

  const updateSubjectScore = (id: string, newScore: number) => {
    setMultiSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, score: Math.max(0, Math.min(s.maxMark, newScore)) } : s))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-fade-in text-left">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-indigo-900/60">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1.5">
                <i className="fa-solid fa-calculator"></i> NECTA Grade Evaluator
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <i className="fa-solid fa-check-double text-emerald-400"></i> 50-Mark & 100-Mark Scales
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <i className="fa-solid fa-graduation-cap text-amber-400"></i>
              Grade Checker & Scale Calculator 📊
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 font-medium mt-1.5 max-w-2xl leading-relaxed">
              Instantly evaluate exam marks on the <strong>50-Mark Scale</strong> (41-50 A, 31-40 B, 21-30 C, 11-20 D, 0-10 F) or convert to the <strong>100-Mark Scale</strong> and NECTA Division points!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {onNavigateToExams && (
              <button
                onClick={onNavigateToExams}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <i className="fa-solid fa-file-signature"></i>
                <span>Practice Past Papers</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-xs">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeTab === 'single'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <i className="fa-solid fa-sliders text-amber-400"></i> Single Score Evaluator
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <i className="fa-solid fa-table text-indigo-400"></i> 50 vs 100 Scale Reference Table
        </button>

        <button
          onClick={() => setActiveTab('multi')}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeTab === 'multi'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <i className="fa-solid fa-chart-line text-emerald-400"></i> Multi-Subject NECTA Division Predictor
        </button>
      </div>

      {/* TAB 1: SINGLE SCORE EVALUATOR */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-gear text-indigo-600"></i> Score & Scale Selector
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Choose your exam scale and enter your raw score to see instant letter grades and remarks.
              </p>
            </div>

            {/* Scale Selector Radio Cards */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider block">
                Select Exam Grading Scale:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => handleScaleChange('50_MARK')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                    scaleType === '50_MARK'
                      ? 'bg-amber-50/80 border-amber-400 text-slate-950 shadow-sm'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    scaleType === '50_MARK' ? 'border-amber-600 bg-amber-500 text-slate-950' : 'border-gray-300'
                  }`}>
                    {scaleType === '50_MARK' && <div className="w-2 h-2 rounded-full bg-slate-950"></div>}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">50-Mark Scale (Default)</h4>
                    <p className="text-[10px] text-gray-500 font-medium">41-50 A | 31-40 B | 21-30 C | 11-20 D | 0-10 F</p>
                  </div>
                </div>

                <div
                  onClick={() => handleScaleChange('100_MARK')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                    scaleType === '100_MARK'
                      ? 'bg-blue-50/80 border-blue-400 text-slate-950 shadow-sm'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    scaleType === '100_MARK' ? 'border-blue-600 bg-blue-500 text-white' : 'border-gray-300'
                  }`}>
                    {scaleType === '100_MARK' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">100-Mark Scale (%)</h4>
                    <p className="text-[10px] text-gray-500 font-medium">81-100 A | 61-80 B | 41-60 C | 21-40 D | 0-20 F</p>
                  </div>
                </div>

                <div
                  onClick={() => handleScaleChange('NECTA_CSEE')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                    scaleType === 'NECTA_CSEE'
                      ? 'bg-emerald-50/80 border-emerald-400 text-slate-950 shadow-sm'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    scaleType === 'NECTA_CSEE' ? 'border-emerald-600 bg-emerald-500 text-white' : 'border-gray-300'
                  }`}>
                    {scaleType === 'NECTA_CSEE' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">NECTA CSEE (O-Level)</h4>
                    <p className="text-[10px] text-gray-500 font-medium">75-100 A | 65-74 B | 45-64 C | 30-44 D | 0-29 F</p>
                  </div>
                </div>

                <div
                  onClick={() => handleScaleChange('NECTA_ACSEE')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                    scaleType === 'NECTA_ACSEE'
                      ? 'bg-purple-50/80 border-purple-400 text-slate-950 shadow-sm'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    scaleType === 'NECTA_ACSEE' ? 'border-purple-600 bg-purple-500 text-white' : 'border-gray-300'
                  }`}>
                    {scaleType === 'NECTA_ACSEE' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">NECTA ACSEE (A-Level)</h4>
                    <p className="text-[10px] text-gray-500 font-medium">75 A | 65 B | 55 C | 45 D | 35 E | 0 F</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Input Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">
                  Your Raw Score (out of {maxMark}):
                </label>
                <span className="text-2xl font-black text-indigo-600 font-mono">
                  {rawScore} / {maxMark}
                </span>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max={maxMark}
                value={rawScore}
                onChange={(e) => setRawScore(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              {/* Direct Number Input & Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-gray-500">Quick Score Presets:</span>
                {[
                  Math.round(maxMark * 0.95),
                  Math.round(maxMark * 0.75),
                  Math.round(maxMark * 0.55),
                  Math.round(maxMark * 0.35),
                  Math.round(maxMark * 0.15),
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRawScore(preset)}
                    className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 font-black text-xs transition border border-gray-200"
                  >
                    {preset} pts
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Badge Column */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-xl flex flex-col justify-between space-y-6 text-left">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                  Grade Evaluation Outcome
                </span>
                <span className="text-xs font-bold text-gray-500">
                  Calculated at {currentResult.percentage}%
                </span>
              </div>

              {/* Big Grade Badge Card */}
              <div className={`mt-6 p-6 sm:p-8 rounded-3xl border-2 ${currentResult.bgClass} ${currentResult.borderClass} flex flex-col sm:flex-row items-center gap-6 shadow-lg transition-all`}>
                <div className={`w-28 h-28 rounded-3xl bg-white border-2 ${currentResult.borderClass} flex flex-col items-center justify-center shrink-0 shadow-md`}>
                  <span className={`text-5xl font-black ${currentResult.colorClass}`}>
                    {currentResult.grade}
                  </span>
                  <span className="text-[10px] font-black uppercase text-gray-400 mt-0.5">
                    Grade Letter
                  </span>
                </div>

                <div className="text-center sm:text-left space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/80 text-slate-900 border border-slate-200 shadow-2xs">
                    Point Value: {currentResult.points} Point{currentResult.points > 1 ? 's' : ''}
                  </span>

                  <h2 className={`text-2xl font-black ${currentResult.colorClass}`}>
                    {currentResult.englishRemark}
                  </h2>
                  <p className="text-xs font-extrabold text-slate-700">
                    {currentResult.swahiliRemark}
                  </p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Score: {rawScore} out of {maxMark} ({currentResult.percentage}%)
                  </p>
                </div>
              </div>

              {/* Study Recommendation Box */}
              <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white space-y-2 relative overflow-hidden shadow-md">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-robot"></i> Yun AI Learning Tip:
                </div>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                  {currentResult.advice}
                </p>
              </div>
            </div>

            {/* AI Tutor Action */}
            {onOpenYunAI && (
              <button
                onClick={() => onOpenYunAI(`I got a score of ${rawScore}/${maxMark} (${currentResult.percentage}%, Grade ${currentResult.grade}) in my recent test. What specific strategies should I use to improve my grade to Grade A?`)}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
              >
                <i className="fa-solid fa-brain"></i>
                <span>Ask Yun AI for Personalized Improvement Strategy</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REFERENCE MATRIX TABLE */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-table-list text-amber-500"></i>
                50-Mark & 100-Mark Official Scale Conversion Matrix
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Standard Tanzanian school grading breakdown comparing 50-mark tests and 100-mark examinations.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <i className="fa-solid fa-circle-info text-indigo-600"></i>
              A: 41-50 (50 Scale) = 81-100 (100 Scale)
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase font-black text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Grade</th>
                  <th className="px-4 py-3.5 bg-amber-950/80 text-amber-300">50-Mark Scale Range</th>
                  <th className="px-4 py-3.5 bg-indigo-950/80 text-indigo-200">100-Mark Scale Range (%)</th>
                  <th className="px-4 py-3.5">Swahili Remark (Maelezo)</th>
                  <th className="px-4 py-3.5">NECTA Point Value</th>
                  <th className="px-4 py-3.5">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-slate-800">
                {/* Grade A */}
                <tr className="bg-emerald-50/50 hover:bg-emerald-50 transition">
                  <td className="px-4 py-4 font-black text-lg text-emerald-600">A</td>
                  <td className="px-4 py-4 font-extrabold text-amber-900 bg-amber-50/60">41 – 50 Marks</td>
                  <td className="px-4 py-4 font-extrabold text-indigo-900 bg-indigo-50/60">81% – 100%</td>
                  <td className="px-4 py-4 font-bold text-slate-900">Vyema Sana (Excellent)</td>
                  <td className="px-4 py-4 font-black text-emerald-700">1 Point</td>
                  <td className="px-4 py-4 text-emerald-800 text-[11px] font-semibold">Distinction / Distinction level</td>
                </tr>

                {/* Grade B */}
                <tr className="bg-blue-50/50 hover:bg-blue-50 transition">
                  <td className="px-4 py-4 font-black text-lg text-blue-600">B</td>
                  <td className="px-4 py-4 font-extrabold text-amber-900 bg-amber-50/60">31 – 40 Marks</td>
                  <td className="px-4 py-4 font-extrabold text-indigo-900 bg-indigo-50/60">61% – 80%</td>
                  <td className="px-4 py-4 font-bold text-slate-900">Vyema (Very Good)</td>
                  <td className="px-4 py-4 font-black text-blue-700">2 Points</td>
                  <td className="px-4 py-4 text-blue-800 text-[11px] font-semibold">Very Good / High Credit</td>
                </tr>

                {/* Grade C */}
                <tr className="bg-amber-50/50 hover:bg-amber-50 transition">
                  <td className="px-4 py-4 font-black text-lg text-amber-600">C</td>
                  <td className="px-4 py-4 font-extrabold text-amber-900 bg-amber-50/60">21 – 30 Marks</td>
                  <td className="px-4 py-4 font-extrabold text-indigo-900 bg-indigo-50/60">41% – 60%</td>
                  <td className="px-4 py-4 font-bold text-slate-900">Wastani (Good / Credit)</td>
                  <td className="px-4 py-4 font-black text-amber-700">3 Points</td>
                  <td className="px-4 py-4 text-amber-800 text-[11px] font-semibold">Satisfactory / Credit Pass</td>
                </tr>

                {/* Grade D */}
                <tr className="bg-orange-50/50 hover:bg-orange-50 transition">
                  <td className="px-4 py-4 font-black text-lg text-orange-600">D</td>
                  <td className="px-4 py-4 font-extrabold text-amber-900 bg-amber-50/60">11 – 20 Marks</td>
                  <td className="px-4 py-4 font-extrabold text-indigo-900 bg-indigo-50/60">21% – 40%</td>
                  <td className="px-4 py-4 font-bold text-slate-900">Dhaifu (Pass)</td>
                  <td className="px-4 py-4 font-black text-orange-700">4 Points</td>
                  <td className="px-4 py-4 text-orange-800 text-[11px] font-semibold">Weak Pass / Basic Pass</td>
                </tr>

                {/* Grade F */}
                <tr className="bg-red-50/50 hover:bg-red-50 transition">
                  <td className="px-4 py-4 font-black text-lg text-red-600">F</td>
                  <td className="px-4 py-4 font-extrabold text-amber-900 bg-amber-50/60">0 – 10 Marks</td>
                  <td className="px-4 py-4 font-extrabold text-indigo-900 bg-indigo-50/60">0% – 20%</td>
                  <td className="px-4 py-4 font-bold text-slate-900">Vibaya (Fail)</td>
                  <td className="px-4 py-4 font-black text-red-700">5 Points</td>
                  <td className="px-4 py-4 text-red-800 text-[11px] font-semibold">Fail / Unsatisfactory</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-SUBJECT DIVISION PREDICTOR */}
      {activeTab === 'multi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Subject Inputs Column */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-ol text-emerald-600"></i>
                  Multi-Subject NECTA Points Calculator
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Enter raw marks for your subjects (out of 50 or 100) to calculate total NECTA points and overall Division.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMultiSubjects(prev => prev.map(s => ({ ...s, maxMark: s.maxMark === 50 ? 100 : 50 })))}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs transition border border-indigo-200"
                >
                  Toggle All Max Marks (50 / 100)
                </button>
              </div>
            </div>

            {/* Subject Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {multiSubjects.map((sub) => {
                const subRes = evaluateGrade(sub.score, sub.maxMark, scaleType);
                return (
                  <div key={sub.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{sub.name}</span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-black ${subRes.colorClass} bg-white border border-gray-200`}>
                        Grade {subRes.grade} ({subRes.points} pt)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={sub.maxMark}
                        value={sub.score}
                        onChange={(e) => updateSubjectScore(sub.id, Number(e.target.value))}
                        className="w-24 px-3 py-1.5 rounded-xl border border-gray-300 font-mono font-bold text-sm bg-white focus:ring-2 focus:ring-indigo-500 text-center"
                      />
                      <span className="text-xs font-extrabold text-gray-400">/ {sub.maxMark} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Division Summary Card Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-xl space-y-6 flex flex-col justify-between text-left">
            <div>
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider block">
                  Overall NECTA Points Summary
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Best 7 Subjects Calculation
                </h3>
              </div>

              {/* Division Badge Box */}
              <div className="mt-6 p-6 rounded-3xl bg-slate-950 text-white space-y-4 shadow-xl border border-slate-800 text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Predicted NECTA Division
                </span>

                <div className={`inline-block px-5 py-2 rounded-2xl text-2xl font-black ${divisionBadge} shadow-md`}>
                  {division}
                </div>

                <div className="pt-2">
                  <span className="text-4xl font-black text-amber-400 font-mono">{best7Points}</span>
                  <span className="text-xs text-slate-400 font-bold block mt-1">Total Points (Best 7)</span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed pt-2 border-t border-slate-800">
                  {divisionDesc}
                </p>
              </div>

              {/* Division Points Scale Legend */}
              <div className="mt-6 space-y-2 text-xs font-semibold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <span className="font-black text-slate-900 uppercase tracking-wider block mb-1">
                  NECTA Division Points Key:
                </span>
                <p>• <strong>Division I:</strong> 7 – 17 Points</p>
                <p>• <strong>Division II:</strong> 18 – 21 Points</p>
                <p>• <strong>Division III:</strong> 22 – 25 Points</p>
                <p>• <strong>Division IV:</strong> 26 – 31 Points</p>
                <p>• <strong>Division 0:</strong> 32 – 35 Points</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
