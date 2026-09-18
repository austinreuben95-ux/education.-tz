import React from 'react';

interface YunAvatar3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  state?: 'idle' | 'thinking' | 'speaking';
  showLabel?: boolean;
  className?: string;
}

export const YunAvatar3D: React.FC<YunAvatar3DProps> = ({
  size = 'md',
  state = 'idle',
  showLabel = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const ringSizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36'
  };

  const avatarImg = '/src/assets/images/yun_3d_avatar_1784881505626.jpg';

  return (
    <div className={`relative flex items-center justify-center shrink-0 group ${className}`}>
      {/* Outer Siri Glow Aura - Vibrant neon gradient */}
      <div
        className={`absolute rounded-full transition-all duration-700 blur-md ${ringSizes[size]} ${
          state === 'thinking'
            ? 'bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 opacity-90 animate-spin'
            : state === 'speaking'
            ? 'bg-gradient-to-r from-indigo-500 via-rose-500 to-cyan-300 opacity-100 animate-pulse scale-110'
            : 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 opacity-60 group-hover:opacity-90'
        }`}
      />

      {/* Rotating Neon Glass Orbit Ring */}
      <div
        className={`absolute rounded-full border-2 border-dashed border-cyan-300/60 pointer-events-none transition-all ${ringSizes[size]} ${
          state === 'thinking' ? 'animate-spin' : state === 'speaking' ? 'animate-ping opacity-40' : 'animate-spin-slow'
        }`}
      />

      {/* Main 3D Glossy Sphere Image Container */}
      <div
        className={`relative rounded-full overflow-hidden border-2 border-white/80 shadow-2xl shadow-cyan-500/30 transition-transform duration-300 ${sizeClasses[size]} ${
          state === 'speaking' ? 'scale-105 ring-4 ring-cyan-400/50' : 'hover:scale-105'
        }`}
      >
        <img
          src={avatarImg}
          alt="Yun 3D Siri AI Orb"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Fallback gradient orb if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Gloss Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-cyan-200/40 pointer-events-none rounded-full" />

        {/* State Indicators */}
        {state === 'thinking' && (
          <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[1px] flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-fuchsia-300 rounded-full animate-bounce [animation-delay:0.15s]" />
            <div className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        )}

        {state === 'speaking' && (
          <div className="absolute inset-x-0 bottom-1 flex items-end justify-center gap-0.5 h-3">
            <div className="w-1 bg-cyan-300 rounded-full animate-pulse h-2" />
            <div className="w-1 bg-fuchsia-400 rounded-full animate-pulse h-3 [animation-delay:0.1s]" />
            <div className="w-1 bg-yellow-300 rounded-full animate-pulse h-2.5 [animation-delay:0.2s]" />
            <div className="w-1 bg-cyan-300 rounded-full animate-pulse h-1.5 [animation-delay:0.3s]" />
          </div>
        )}
      </div>

      {/* Optional Siri-style status badge */}
      {showLabel && (
        <div className="absolute -bottom-2 bg-slate-900/90 text-[10px] font-black text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40 shadow-lg tracking-wider uppercase backdrop-blur-md">
          {state === 'thinking' ? 'Yun Thinking...' : state === 'speaking' ? 'Yun Speaking' : 'Yun AI'}
        </div>
      )}
    </div>
  );
};

export default YunAvatar3D;
