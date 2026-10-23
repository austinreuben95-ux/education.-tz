import React from 'react';
import { getScholarAvatar } from '../src/data/scholarAvatars';

export interface ScholarAvatarProps {
  avatarId?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showLevel?: boolean;
  level?: number;
  showGlow?: boolean;
  showBorder?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP = {
  xs: {
    container: 'w-6 h-6 text-xs',
    emoji: 'text-xs',
    badge: 'text-[8px] -bottom-1 -right-1 px-1',
  },
  sm: {
    container: 'w-8 h-8 text-sm',
    emoji: 'text-sm',
    badge: 'text-[9px] -bottom-1 -right-1 px-1',
  },
  md: {
    container: 'w-10 h-10 text-base',
    emoji: 'text-lg',
    badge: 'text-[10px] -bottom-1.5 -right-1.5 px-1.5 py-0.2',
  },
  lg: {
    container: 'w-14 h-14 text-xl',
    emoji: 'text-2xl',
    badge: 'text-[11px] -bottom-1.5 -right-1 px-2 py-0.5',
  },
  xl: {
    container: 'w-20 h-20 text-3xl',
    emoji: 'text-3xl',
    badge: 'text-xs -bottom-2 -right-1 px-2.5 py-0.5',
  },
  '2xl': {
    container: 'w-24 h-24 text-4xl',
    emoji: 'text-4xl',
    badge: 'text-xs -bottom-2 -right-1 px-3 py-1',
  },
};

export const ScholarAvatar: React.FC<ScholarAvatarProps> = ({
  avatarId,
  name,
  size = 'md',
  showLevel = false,
  level = 1,
  showGlow = false,
  showBorder = true,
  className = '',
  onClick,
  title,
}) => {
  const avatar = getScholarAvatar(avatarId);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  const tooltipText = title || `${avatar.name} (${avatar.englishTitle}) • ${avatar.motto}`;

  return (
    <div
      onClick={onClick}
      title={tooltipText}
      style={{
        boxShadow: showGlow ? `0 8px 24px -4px ${avatar.glowColor}` : undefined,
      }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none rounded-2xl bg-gradient-to-tr ${avatar.gradient} ${sizeConfig.container} ${
        showBorder ? 'ring-2 ring-white/60 dark:ring-white/20 shadow-md' : ''
      } ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200' : ''} ${className}`}
    >
      {/* Liquid Glass Specular Top Highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />

      {/* Avatar Emoji or Fallback Letter */}
      <span
        className={`relative z-10 filter drop-shadow-sm transform ${sizeConfig.emoji} flex items-center justify-center`}
        role="img"
        aria-label={avatar.name}
      >
        {avatar.emoji}
      </span>

      {/* Optional Level Badge */}
      {showLevel && (
        <span
          className={`absolute z-20 rounded-full bg-amber-400 dark:bg-amber-300 text-slate-950 font-black tracking-tight uppercase shadow-sm border border-white dark:border-slate-900 ${sizeConfig.badge}`}
        >
          L{level}
        </span>
      )}
    </div>
  );
};
