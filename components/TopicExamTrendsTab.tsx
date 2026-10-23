import React, { useState, useEffect } from 'react';
import { Topic, Subject, GradeSyllabus } from '../types';
import { fetchTopicExamTrends, TopicExamTrendsResult } from '../services/geminiService';

interface TopicExamTrendsTabProps {
  topic: Topic;
  subject: Subject;
  grade?: GradeSyllabus | null;
  onOpenYunChat?: (prompt: string) => void;
}

export const TopicExamTrendsTab: React.FC<TopicExamTrendsTabProps> = ({
  topic,
  subject,
  grade,
  onOpenYunChat,
}) => {
  const [trends, setTrends] = useState<TopicExamTrendsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState<number | null>(null);
  const [copiedSummaryToast, setCopiedSummaryToast] = useState<boolean>(false);

  // Determine NECTA exam code based on grade
  const examCode = React.useMemo(() => {
    const g = (grade?.grade || '').toLowerCase();
    if (g.includes('form 4') || g.includes('kidato cha 4') || g.includes('secondary')) return 'CSEE';
    if (g.includes('form 2') || g.includes('kidato cha 2')) return 'FTNA';
    if (g.includes('form 6') || g.includes('kidato cha 6') || g.includes('high')) return 'ACSEE';
    if (g.includes('standard 7') || g.includes('darasa la 7')) return 'PSLE';
    if (g.includes('standard 4') || g.includes('darasa la 4')) return 'SFNA';
    return 'CSEE';
  }, [grade]);

  const loadTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTopicExamTrends({
        topic: topic.title,
        subject: subject.name,
        grade: grade?.grade || 'Form 4',
        examCode,
      });
      setTrends(data);
    } catch (err: any) {
      console.error('Failed to load topic trends:', err);
      setError('Failed to load exam trend insights. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, [topic.id, subject.name, grade?.grade]);

  const handleCopyQuestion = (questionText: string, idx: number) => {
    navigator.clipboard.writeText(questionText);
    setCopiedQuestionIdx(idx);
    setTimeout(() => setCopiedQuestionIdx(null), 2000);
  };

  const handleCopyFullSummary = () => {
    if (!trends) return;
    const text = `NECTA EXAM TRENDS ANALYSIS 🇹🇿
Topic: ${trends.topic}
Subject: ${trends.subject} (${trends.grade} - ${trends.examCode})
Overall Frequency: ${trends.overallFrequency}
Average Marks: ~${trends.averageMarks} Marks

QUESTION TYPE DISTRIBUTION:
${trends.questionTypeDistribution
  .map(
    (q) => `• ${q.type} (${q.percentage}%):
  Frequency: ${q.frequencyLabel}
  Description: ${q.description}
  Sample Question: "${q.samplePastPaperQuestion}"
  Marking Scheme: ${q.keyMarkingCriterion}`
  )
  .join('\n\n')}

CIRA EXAMINER WARNING:
${trends.ciraExaminerTrap}

REVISION STRATEGY:
${trends.recommendedPreparationStrategy}
${trends.kiswahiliStrategicTip ? `\nKISWAHILI STRATEGIC TIP:\n${trends.kiswahiliStrategicTip}` : ''}
`;
    navigator.clipboard.writeText(text);
    setCopiedSummaryToast(true);
    setTimeout(() => setCopiedSummaryToast(false), 2500);
  };

  const handlePracticeWithYun = (sampleQuestion?: string, questionType?: string) => {
    if (!onOpenYunChat) return;
    const prompt = sampleQuestion
      ? `I am revising the topic "${topic.title}" in ${subject.name} (${grade?.grade || 'Form 4'}). 
According to NECTA past paper trends, "${questionType || 'this question type'}" is high frequency.
Please guide me through solving this typical past paper problem step-by-step and provide the official marking scheme breakdown:

"${sampleQuestion}"`
      : `I am preparing for the ${examCode} exam in ${subject.name}. Please give me 3 high-yield NECTA past-paper style practice questions on the topic "${topic.title}", focusing on the most frequently tested question types!`;

    onOpenYunChat(prompt);
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-inner border border-indigo-100">
          <i className="fa-solid fa-chart-pie animate-spin"></i>
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-gray-900 text-lg">Analyzing NECTA Past Paper Trends...</h4>
          <p className="text-xs text-gray-500 max-w-md">
            Examining past examination papers (2017–2025) and national CIRA reports for <strong className="text-indigo-600 font-extrabold">{topic.title}</strong> in {subject.name}.
          </p>
        </div>
        <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 animate-pulse w-3/4 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !trends) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <h4 className="font-black text-gray-800 text-base">Unable to Load Exam Trends</h4>
          <p className="text-xs text-gray-500 mt-1">{error || 'Something went wrong while retrieving trend data.'}</p>
        </div>
        <button
          onClick={loadTrends}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <i className="fa-solid fa-arrows-rotate"></i> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <i className="fa-solid fa-award"></i> NECTA {trends.examCode} Exam Trends
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold text-[11px]">
                {trends.grade} • {trends.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {trends.modelUsed || 'AI Grounded Analysis'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {trends.topic}
            </h3>

            <p className="text-xs sm:text-sm text-indigo-200 font-medium max-w-2xl leading-relaxed">
              Empirical analysis of 8+ years of NECTA national examination papers, testing frequencies, question types, and CIRA candidate performance metrics.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyFullSummary}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95 shadow-sm"
              title="Copy complete topic examination summary to clipboard"
            >
              <i className={`fa-solid ${copiedSummaryToast ? 'fa-check text-emerald-400' : 'fa-copy'}`}></i>
              <span>{copiedSummaryToast ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={loadTrends}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
              title="Refresh past paper trend analysis using Gemini AI"
            >
              <i className="fa-solid fa-rotate text-xs"></i>
              <span>Re-Analyze ⚡</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <i className="fa-solid fa-chart-line absolute -right-6 -bottom-8 text-9xl text-white/5 pointer-events-none rotate-12"></i>
      </div>

      {/* High-Level Empirical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Frequency Rate */}
        <div className="bg-white p-5 rounded-3xl border-2 border-indigo-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Exam Appearance</span>
            <h4 className="text-sm sm:text-base font-black text-gray-900 leading-tight mt-0.5">
              {trends.overallFrequency}
            </h4>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <i className="fa-solid fa-arrow-trend-up text-[9px]"></i> High-Yield Syllabus Topic
            </span>
          </div>
        </div>

        {/* Average Marks Weight */}
        <div className="bg-white p-5 rounded-3xl border-2 border-amber-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-bullseye"></i>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Average Marks Per Paper</span>
            <h4 className="text-xl font-black text-amber-600 leading-tight mt-0.5">
              ~{trends.averageMarks} Marks
            </h4>
            <span className="text-[10px] text-gray-500 font-medium">
              Typically 10%–16% of total paper marks
            </span>
          </div>
        </div>

        {/* Typical Paper Sections */}
        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Paper Sections Appeared</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {trends.typicalPaperSections.map((sec, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200"
                >
                  {sec.split('(')[0].trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: QUESTION TYPE FREQUENCY DISTRIBUTION */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
          <div>
            <h4 className="font-black text-lg text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-chart-column text-indigo-600"></i>
              Frequency of Question Types in NECTA Exams
            </h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Historical distribution of how questions on <strong className="text-gray-800">{topic.title}</strong> are framed in national exam papers.
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100">
            {trends.questionTypeDistribution.length} Distinct Question Styles
          </span>
        </div>

        {/* Distribution Cards */}
        <div className="space-y-5">
          {trends.questionTypeDistribution.map((item, idx) => {
            const barColors = [
              'from-indigo-600 to-blue-500',
              'from-amber-500 to-yellow-400',
              'from-emerald-500 to-teal-400',
              'from-purple-600 to-pink-500',
            ];
            const badgeColors = [
              'bg-indigo-50 text-indigo-700 border-indigo-200',
              'bg-amber-50 text-amber-800 border-amber-200',
              'bg-emerald-50 text-emerald-800 border-emerald-200',
              'bg-purple-50 text-purple-800 border-purple-200',
            ];
            const colorIdx = idx % barColors.length;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all bg-stone-50/40 space-y-3.5"
              >
                {/* Title & Percentage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="font-black text-sm sm:text-base text-gray-900">
                      {item.type}
                    </h5>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badgeColors[colorIdx]}`}>
                      {item.frequencyLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-indigo-700">
                      {item.percentage}%
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Frequency Weight
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColors[colorIdx]} transition-all duration-700`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>

                {/* Description of what examiners test */}
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Authentic Past Paper Sample Question Box */}
                {item.samplePastPaperQuestion && (
                  <div className="p-3.5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 flex items-center gap-1">
                        <i className="fa-solid fa-file-pen"></i> Authentic NECTA-Style Sample Question:
                      </span>
                      <button
                        onClick={() => handleCopyQuestion(item.samplePastPaperQuestion, idx)}
                        className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer"
                        title="Copy question text"
                      >
                        <i className={`fa-solid ${copiedQuestionIdx === idx ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                        <span>{copiedQuestionIdx === idx ? 'Copied' : 'Copy Question'}</span>
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-gray-800 italic bg-gray-50/70 p-2.5 rounded-lg border-l-4 border-amber-400">
                      "{item.samplePastPaperQuestion}"
                    </p>

                    {/* Marking Scheme Criterion */}
                    {item.keyMarkingCriterion && (
                      <div className="text-[11px] text-emerald-700 font-medium flex items-start gap-1.5 pt-1">
                        <i className="fa-solid fa-check-double text-emerald-600 mt-0.5 shrink-0"></i>
                        <span>
                          <strong className="font-extrabold text-emerald-800">NECTA Marking Scheme Key:</strong> {item.keyMarkingCriterion}
                        </span>
                      </div>
                    )}

                    {/* Practice button for this specific question type */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handlePracticeWithYun(item.samplePastPaperQuestion, item.type)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <i className="fa-solid fa-robot text-indigo-600"></i>
                        <span>Practice with Yun AI</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Year-by-Year Historical Appearances */}
      {trends.yearlyAppearances && trends.yearlyAppearances.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="font-black text-base text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-timeline text-amber-500"></i>
              Year-by-Year Past Paper Appearances
            </h4>
            <span className="text-xs font-bold text-gray-500">
              Exam Sitters: {trends.examCode} (2018–2024)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {trends.yearlyAppearances.map((appr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-stone-50 flex items-start gap-3 shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-300 font-black text-sm flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span>{appr.year}</span>
                  <span className="text-[9px] text-slate-400 font-medium">{appr.marks}M</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-indigo-700 uppercase">{appr.paper}</span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      {appr.questionNumber}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    {appr.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CIRA Examiner Report Trap & Pitfall Warning Box */}
      {trends.ciraExaminerTrap && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-400/80 text-amber-950 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider">
            <i className="fa-solid fa-triangle-exclamation text-amber-600 text-sm"></i>
            <span>Official NECTA CIRA Report Warning</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
            {trends.ciraExaminerTrap}
          </p>
        </div>
      )}

      {/* Bilingual Kiswahili Strategic Pro-Tip */}
      {trends.kiswahiliStrategicTip && (
        <div className="p-5 rounded-3xl bg-emerald-500/10 border-2 border-emerald-400/80 text-emerald-950 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
            <i className="fa-solid fa-flag text-emerald-600 text-sm"></i>
            <span>Mwongozo wa Kimkakati wa NECTA (Kiswahili) 🇹🇿</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
            {trends.kiswahiliStrategicTip}
          </p>
        </div>
      )}

      {/* Recommended Preparation Action Strategy Box */}
      {trends.recommendedPreparationStrategy && (
        <div className="p-5 rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-indigo-950 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-black text-xs uppercase tracking-wider">
              <i className="fa-solid fa-chess-knight text-indigo-600"></i>
              <span>Recommended Topic Revision Strategy</span>
            </div>
            <button
              onClick={() => handlePracticeWithYun()}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-amber-300"></i>
              <span>Practice All Types with Yun</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm font-medium text-indigo-900 leading-relaxed">
            {trends.recommendedPreparationStrategy}
          </p>
        </div>
      )}
    </div>
  );
};
