import React, { useState } from 'react';
import { QuizMistakeFeedback } from './types';

interface QuizFeedbackCardProps {
  feedback: QuizMistakeFeedback | null;
  isLoading: boolean;
  selectedOptionText: string;
  selectedOptionIndex: number;
  correctOptionText: string;
  correctOptionIndex: number;
  question?: string;
  topicTitle?: string;
  subjectName?: string;
  onAskYunChat?: () => void;
  onReviewNotes?: () => void;
  onTryAgain?: () => void;
}

export const QuizFeedbackCard: React.FC<QuizFeedbackCardProps> = ({
  feedback,
  isLoading,
  selectedOptionText,
  selectedOptionIndex,
  correctOptionText,
  correctOptionIndex,
  question,
  topicTitle,
  subjectName,
  onAskYunChat,
  onReviewNotes,
  onTryAgain,
}) => {
  const chosenLetter = String.fromCharCode(65 + selectedOptionIndex);
  const correctLetter = String.fromCharCode(65 + correctOptionIndex);
  const [highContrastMode, setHighContrastMode] = useState<boolean>(true);

  return (
    <div 
      id="instant-review-feedback-component"
      className={`mt-5 space-y-4 text-left animate-fade-in transition-colors duration-200 ${
        highContrastMode ? 'theme-high-contrast' : ''
      }`}
    >
      {/* High-Contrast Mode & Accessibility Toolbar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <i className="fa-solid fa-graduation-cap text-indigo-600 dark:text-indigo-400"></i>
          <span>Instant Review Feedback</span>
        </span>
        <button
          type="button"
          onClick={() => setHighContrastMode(!highContrastMode)}
          className={`px-3 py-1 rounded-xl text-xs font-black transition flex items-center gap-1.5 border-2 shadow-xs cursor-pointer ${
            highContrastMode
              ? 'bg-slate-950 text-amber-300 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
          title="Toggle High Contrast Display for maximum readability"
        >
          <i className="fa-solid fa-circle-half-stroke"></i>
          <span>{highContrastMode ? 'High Contrast: ON' : 'High Contrast: OFF'}</span>
        </button>
      </div>

      {/* Top Header Alert Banner: High Contrast & Mobile Optimized */}
      <div className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-3xl border-2 shadow-md transition-all ${
        highContrastMode
          ? 'bg-slate-950 border-rose-500 text-white ring-2 ring-rose-500/30'
          : 'bg-rose-50 border-rose-300 text-rose-950'
      }`}>
        <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl shrink-0 shadow-lg shadow-rose-600/40">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-black text-sm sm:text-base tracking-tight text-white dark:text-white">
              Correction & Insight
            </h4>
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs tracking-wider">
              Option {chosenLetter} Incorrect
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-rose-200 dark:text-rose-200 leading-relaxed">
            Yun AI isolated the underlying misconception to help you master this for NECTA exams.
          </p>
        </div>
      </div>

      {/* Loading State: High Contrast Animated Pulse */}
      {isLoading && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 text-white shadow-xl space-y-3.5 border-2 border-indigo-500 ring-2 ring-indigo-500/20 animate-pulse">
          <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
            <i className="fa-solid fa-brain text-amber-400 text-base"></i>
            <span>Yun AI Pedagogical Diagnosis in Progress...</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
            Analyzing why option ({chosenLetter}) was tempting, isolating the specific conceptual gap, and preparing your high-yield study action plan...
          </p>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Loaded Feedback Content */}
      {!isLoading && feedback && (
        <div className="space-y-4">
          {/* 1. Identified Conceptual Gap Card */}
          <div className={`p-4 sm:p-5 rounded-3xl border-2 shadow-sm space-y-2.5 ${
            highContrastMode
              ? 'bg-slate-950 border-amber-400 text-white'
              : 'bg-amber-50 border-amber-300 text-slate-900'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-amber-300">
                <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs shrink-0 font-black shadow-sm">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <span className="uppercase tracking-wider">Diagnosed Conceptual Gap</span>
              </div>
              {feedback.source === 'gemini' && (
                <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                  <i className="fa-solid fa-sparkles"></i> AI Grounded
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed pl-1 sm:pl-2">
              {feedback.conceptualGap}
            </p>
          </div>

          {/* 2. Direct Contrast Comparison: Student's Choice vs Official Solution (Fully Visible, No Truncation!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Student's Choice Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-2 shadow-sm ${
              highContrastMode
                ? 'bg-slate-950 border-rose-500 text-white'
                : 'bg-white border-rose-300 text-slate-900'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-rose-500/40">
                <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-circle-xmark text-sm text-rose-500"></i>
                  <span>Your Pick: Option {chosenLetter}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Flawed
                </span>
              </div>
              {/* Full selected text without line-clamp truncation */}
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 font-bold text-xs sm:text-sm text-rose-100 leading-snug">
                "{selectedOptionText}"
              </div>
              <p className="text-xs font-semibold text-slate-300 leading-relaxed pt-1">
                <strong className="text-rose-300 block mb-0.5">Why this option is incorrect:</strong>
                {feedback.whyOptionIsIncorrect}
              </p>
            </div>

            {/* Official Correct Answer Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-2 shadow-sm ${
              highContrastMode
                ? 'bg-slate-950 border-emerald-400 text-white'
                : 'bg-white border-emerald-300 text-slate-900'
            }`}>
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-emerald-400/40">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-circle-check text-sm text-emerald-400"></i>
                  <span>Correct Answer: Option {correctLetter}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Accurate
                </span>
              </div>
              {/* Full correct text without line-clamp truncation */}
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 font-bold text-xs sm:text-sm text-emerald-100 leading-snug">
                "{correctOptionText}"
              </div>
              <p className="text-xs font-semibold text-slate-300 leading-relaxed pt-1">
                <strong className="text-emerald-300 block mb-0.5">Underlying Scientific Principle:</strong>
                {feedback.underlyingPrinciple}
              </p>
            </div>
          </div>

          {/* 3. WHERE TO FOCUS MORE ON (High-Contrast Revision Roadmap) */}
          <div className={`p-5 sm:p-6 rounded-3xl border-2 space-y-4 shadow-md ${
            highContrastMode
              ? 'bg-slate-950 border-indigo-400 text-white ring-2 ring-indigo-500/20'
              : 'bg-indigo-50/90 border-indigo-200 text-slate-900'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-indigo-500/30">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-indigo-300">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-md">
                  <i className="fa-solid fa-bullseye"></i>
                </span>
                <span className="uppercase tracking-wider">Where You Need to Focus More On</span>
              </div>
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-indigo-600 text-white shadow-xs">
                NECTA Exam Priority
              </span>
            </div>

            {/* Primary Focus Topic Tag */}
            <div className="bg-slate-900/90 p-3.5 sm:p-4 rounded-2xl border border-indigo-400/40 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 block">
                Primary Syllabus Focus:
              </span>
              <p className="font-black text-sm sm:text-base text-white">
                {feedback.whereToFocus.primaryFocusTopic}
              </p>
            </div>

            {/* Key Rule to Memorize */}
            {feedback.whereToFocus.keyTakeaway && (
              <div className="p-4 rounded-2xl bg-slate-900 border-2 border-amber-400 text-white space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-lightbulb text-amber-400 text-sm"></i>
                  <span>Key Rule to Memorize & Apply:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-100 leading-relaxed">
                  {feedback.whereToFocus.keyTakeaway}
                </p>
              </div>
            )}

            {/* Action Steps Checklist */}
            {feedback.whereToFocus.actionSteps && feedback.whereToFocus.actionSteps.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                  Recommended Action Steps:
                </span>
                <ul className="space-y-2">
                  {feedback.whereToFocus.actionSteps.map((step, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 font-bold"
                    >
                      <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common NECTA Trap Callout */}
            {feedback.whereToFocus.nectaTrapToAvoid && (
              <div className="p-4 rounded-2xl bg-amber-950/60 border-2 border-amber-400 text-white space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-shield-halved text-amber-400 text-sm"></i>
                  <span>NECTA Examiner Trap to Avoid:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-100 leading-relaxed">
                  {feedback.whereToFocus.nectaTrapToAvoid}
                </p>
              </div>
            )}
          </div>

          {/* 4. Encouraging Bilingual Tip */}
          {feedback.bilingualQuickTip && (
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-xs sm:text-sm text-cyan-200 font-bold flex items-center gap-3 shadow-md">
              <i className="fa-solid fa-comment-dots text-cyan-400 text-lg shrink-0"></i>
              <span className="leading-relaxed">{feedback.bilingualQuickTip}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Controls: Mobile-Friendly Big Touch Targets */}
      <div className="pt-2 flex flex-col gap-2.5">
        {onAskYunChat && (
          <button
            type="button"
            onClick={onAskYunChat}
            className="w-full min-h-[48px] py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer border-2 border-indigo-400"
            title="Open Yun AI chat with this question and diagnosed gap pre-loaded"
          >
            <i className="fa-solid fa-robot text-amber-300 text-base"></i>
            <span>Ask Yun AI to Clarify This Gap 💬</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {onReviewNotes && (
            <button
              type="button"
              onClick={onReviewNotes}
              className="w-full min-h-[46px] py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer border-2 border-slate-700 hover:border-sky-400 shadow-md"
              title={`Read lesson notes for ${topicTitle || 'this topic'}`}
            >
              <i className="fa-solid fa-book-open text-sky-400"></i>
              <span>Review Topic Notes 📖</span>
            </button>
          )}

          {onTryAgain && (
            <button
              type="button"
              onClick={onTryAgain}
              className="w-full min-h-[46px] py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-md shadow-amber-400/30 border-2 border-amber-300"
              title="Re-attempt this question with your new insight"
            >
              <i className="fa-solid fa-rotate-right text-slate-950"></i>
              <span>Try Again 🔄</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
