import React from 'react';

export type TopicDifficulty = 'beginner' | 'easy' | 'amateur' | 'hard' | 'extreme';

export const getTopicDifficulty = (
  topic: { id?: string; title?: string; difficulty?: TopicDifficulty },
  index: number = 0
): TopicDifficulty => {
  if (topic.difficulty) return topic.difficulty;
  
  const levels: TopicDifficulty[] = ['beginner', 'easy', 'amateur', 'hard', 'extreme'];
  
  // Deterministic mapping based on topic title & ID hash or index
  let hash = index;
  const str = `${topic.id || ''}-${topic.title || ''}`;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i) * (i + 1);
  }
  
  return levels[Math.abs(hash) % levels.length];
};

export const DifficultyBadge: React.FC<{ difficulty: TopicDifficulty; compact?: boolean }> = ({
  difficulty,
  compact = false,
}) => {
  switch (difficulty) {
    case 'beginner':
      return (
        <span className={`inline-flex items-center gap-1 font-black uppercase rounded-full border shadow-xs ${
          compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        } bg-emerald-100/90 text-emerald-900 border-emerald-300`}>
          <i className="fa-solid fa-seedling text-emerald-600"></i> Beginner
        </span>
      );
    case 'easy':
      return (
        <span className={`inline-flex items-center gap-1 font-black uppercase rounded-full border shadow-xs ${
          compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        } bg-green-100/90 text-green-900 border-green-300`}>
          <i className="fa-solid fa-gauge-simple-low text-green-600"></i> Easy
        </span>
      );
    case 'amateur':
      return (
        <span className={`inline-flex items-center gap-1 font-black uppercase rounded-full border shadow-xs ${
          compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        } bg-sky-100/90 text-sky-900 border-sky-300`}>
          <i className="fa-solid fa-graduation-cap text-sky-600"></i> Amateur
        </span>
      );
    case 'hard':
      return (
        <span className={`inline-flex items-center gap-1 font-black uppercase rounded-full border shadow-xs ${
          compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        } bg-amber-100/90 text-amber-950 border-amber-300`}>
          <i className="fa-solid fa-fire text-amber-600"></i> Hard
        </span>
      );
    case 'extreme':
      return (
        <span className={`inline-flex items-center gap-1 font-black uppercase rounded-full border shadow-xs ${
          compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'
        } bg-rose-100/90 text-rose-950 border-rose-300`}>
          <i className="fa-solid fa-bolt-lightning text-rose-600 animate-pulse"></i> Extreme
        </span>
      );
    default:
      return null;
  }
};

export const TopicCompletedBadge: React.FC<{ isCompleted: boolean; compact?: boolean }> = ({
  isCompleted,
  compact = false,
}) => {
  if (isCompleted) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-black uppercase rounded-full border shadow-sm animate-fade-in ${
        compact ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'
      } bg-emerald-500 text-white border-emerald-400`}>
        <i className="fa-solid fa-circle-check text-white"></i> Completed
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase rounded-full border ${
      compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-0.5 text-[10px]'
    } bg-slate-100 text-slate-500 border-slate-200`}>
      <i className="fa-solid fa-circle-notch text-slate-400"></i> In Progress
    </span>
  );
};
