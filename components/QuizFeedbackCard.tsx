import React from 'react';
import { QuizMistakeFeedback } from '../types';

interface QuizFeedbackCardProps {
  feedback: QuizMistakeFeedback | null;
  isLoading: boolean;
  selectedOptionText: string;
  selectedOptionIndex: number;
  correctOptionText: string;
  correctOptionIndex: number;
  question: string;
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
  topicTitle,
  subjectName,
  onAskYunChat,
  onReviewNotes,
  onTryAgain,
}) => {
  const chosenLetter = String.fromCharCode(65 + selectedOptionIndex);
  const correctLetter = String.fromCharCode(65 + correctOptionIndex);

  return (
    <div className="mt-5 space-y-4 text-left animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/90 border-2 border-rose-200 text-rose-950">
        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg shrink-0 shadow-md">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-black text-sm text-rose-950">Not Quite Right</h4>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800">
              Incorrect Option ({chosenLetter})
            </span>
          </div>
          <p className="text-xs text-rose-800 font-medium mt-0.5 leading-relaxed">
            Yun AI has diagnosed your answer to reveal the exact conceptual gap and guide your revision.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg space-y-3 border border-slate-800 animate-pulse">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <i className="fa-solid fa-brain"></i>
            <span>Yun AI Pedagogical Diagnosis in Progress...</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Analyzing why option ({chosenLetter}) was tempting, isolating the underlying misconception, and generating your high-yield NECTA focus roadmap...
          </p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Loaded Feedback Content */}
      {!isLoading && feedback && (
        <div className="space-y-3.5">
          {/* 1. Identified Conceptual Gap */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs shrink-0 font-black">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <span>Identified Conceptual Gap</span>
              {feedback.source === 'gemini' && (
                <span className="ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 flex items-center gap-1">
                  <i className="fa-solid fa-sparkles text-amber-600"></i> AI Analyzed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              {feedback.conceptualGap}
            </p>
          </div>

          {/* 2. Direct Contrast: Why Your Choice Was Flawed vs Correct Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Student's Choice */}
            <div className="p-3.5 rounded-xl bg-white border-2 border-rose-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-700 font-black text-[11px]">
                <i className="fa-solid fa-circle-xmark"></i>
                <span>Your Pick: Option {chosenLetter}</span>
              </div>
              <p className="font-semibold text-slate-700 text-[11px] line-clamp-2">
                "{selectedOptionText}"
              </p>
              <p className="text-[11px] text-slate-600 font-normal leading-relaxed pt-1 border-t border-rose-100">
                {feedback.whyOptionIsIncorrect}
              </p>
            </div>

            {/* Official Correct Answer */}
            <div className="p-3.5 rounded-xl bg-white border-2 border-emerald-300 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-800 font-black text-[11px]">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>Correct: Option {correctLetter}</span>
              </div>
              <p className="font-semibold text-slate-900 text-[11px] line-clamp-2">
                "{correctOptionText}"
              </p>
              <p className="text-[11px] text-slate-600 font-normal leading-relaxed pt-1 border-t border-emerald-100">
                {feedback.underlyingPrinciple}
              </p>
            </div>
          </div>

          {/* 3. WHERE TO FOCUS MORE ON (The core syllabus priority) */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-indigo-950 font-black text-xs">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0">
                  <i className="fa-solid fa-bullseye"></i>
                </span>
                <span>Where You Need to Focus More On</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
                Revision Priority
              </span>
            </div>

            {/* Primary Focus Topic Tag */}
            <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                Primary Syllabus Focus:
              </span>
              <p className="font-extrabold text-xs text-slate-900">
                {feedback.whereToFocus.primaryFocusTopic}
              </p>
            </div>

            {/* Key Takeaway / Mnemonic Rule */}
            {feedback.whereToFocus.keyTakeaway && (
              <div className="p-3 rounded-xl bg-indigo-900 text-white space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                  <i className="fa-solid fa-lightbulb"></i>
                  <span>Key Rule to Memorize:</span>
                </div>
                <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                  {feedback.whereToFocus.keyTakeaway}
                </p>
              </div>
            )}

            {/* Action Steps Checklist */}
            {feedback.whereToFocus.actionSteps && feedback.whereToFocus.actionSteps.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-slate-700 block">
                  Recommended Revision Steps:
                </span>
                <ul className="space-y-1.5">
                  {feedback.whereToFocus.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-900 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common NECTA Trap */}
            {feedback.whereToFocus.nectaTrapToAvoid && (
              <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-xs space-y-1">
                <div className="flex items-center gap-1 text-amber-900 font-black text-[11px]">
                  <i className="fa-solid fa-shield-halved text-amber-700"></i>
                  <span>NECTA Examiner Trap to Avoid:</span>
                </div>
                <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
                  {feedback.whereToFocus.nectaTrapToAvoid}
                </p>
              </div>
            )}
          </div>

          {/* 4. Encouraging Bilingual Tip */}
          {feedback.bilingualQuickTip && (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium italic flex items-center gap-2">
              <i className="fa-solid fa-comment-dots text-indigo-600 text-sm shrink-0"></i>
              <span>{feedback.bilingualQuickTip}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Controls: Ask Yun, Review Notes, Try Again */}
      <div className="pt-2 flex flex-col gap-2">
        {onAskYunChat && (
          <button
            type="button"
            onClick={onAskYunChat}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            title="Open Yun AI chat with this question and diagnosed gap pre-loaded"
          >
            <i className="fa-solid fa-robot text-amber-300"></i>
            <span>Ask Yun AI to Clarify This Gap 💬</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {onReviewNotes && (
            <button
              type="button"
              onClick={onReviewNotes}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs shadow-sm transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              title={`Read lesson notes for ${topicTitle || 'this topic'}`}
            >
              <i className="fa-solid fa-book-open text-sky-300"></i>
              <span>Review Notes 📖</span>
            </button>
          )}

          {onTryAgain && (
            <button
              type="button"
              onClick={onTryAgain}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-sm shadow-amber-200 transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              title="Re-attempt this question with your new insight"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Try Again 🔄</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
