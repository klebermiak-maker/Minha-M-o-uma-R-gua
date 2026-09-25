import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface DressVisualizerProps {
  completedLevelsCount: number; // 0 to 10
  totalLevels?: number;
}

export const DressVisualizer: React.FC<DressVisualizerProps> = ({
  completedLevelsCount,
  totalLevels = 10,
}) => {
  const progressPercent = Math.min(100, Math.round((completedLevelsCount / totalLevels) * 100));

  return (
    <div className="bg-amber-100/50 border border-amber-300/80 rounded-2xl p-4 flex flex-col items-center shadow-xs">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-bold font-display uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
          O Vestido da Menina
        </span>
        <span className="text-xs font-semibold text-amber-800 tabular-nums">
          {completedLevelsCount}/{totalLevels} peças costuradas ({progressPercent}%)
        </span>
      </div>

      {/* SVG Character and Dress in Callis Storybook Style */}
      <div className="relative w-40 h-44 sm:w-44 sm:h-48 flex items-center justify-center my-1">
        <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-sm">
          {/* Head & Hair with cute pigtails (Oh Seung-Min aesthetic) */}
          <g id="head">
            {/* Left pigtail */}
            <path
              d="M 55 50 Q 30 40 40 65 Q 55 58 60 55"
              fill="#451a03"
              stroke="#291003"
              strokeWidth="2"
            />
            {/* Right pigtail */}
            <path
              d="M 145 50 Q 170 40 160 65 Q 145 58 140 55"
              fill="#451a03"
              stroke="#291003"
              strokeWidth="2"
            />

            {/* Face */}
            <ellipse
              cx="100"
              cy="65"
              rx="38"
              ry="34"
              fill="#fed7aa"
              stroke="#ea580c"
              strokeWidth="2"
            />

            {/* Hair bangs */}
            <path
              d="M 64 55 Q 100 40 136 55 Q 100 48 64 55"
              fill="#451a03"
            />

            {/* Rosy cheeks */}
            <circle cx="78" cy="74" r="7" fill="#fca5a5" opacity="0.6" />
            <circle cx="122" cy="74" r="7" fill="#fca5a5" opacity="0.6" />

            {/* Eyes & Smile */}
            <circle cx="82" cy="65" r="3" fill="#1c1917" />
            <circle cx="118" cy="65" r="3" fill="#1c1917" />
            <path
              d="M 90 77 Q 100 87 110 77"
              fill="none"
              stroke="#991b1b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Arms (reaching out happily) */}
          <path
            d="M 65 105 Q 35 90 25 100"
            stroke="#ea580c"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {/* Hands with fingers (Palmos!) */}
          <circle cx="23" cy="100" r="7" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />

          <path
            d="M 135 105 Q 165 90 175 100"
            stroke="#ea580c"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="177" cy="100" r="7" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />

          {/* Legs & Striped Socks as in the book */}
          <path d="M 85 180 L 80 220" stroke="#f97316" strokeWidth="9" strokeLinecap="round" />
          <path d="M 115 180 L 120 220" stroke="#f97316" strokeWidth="9" strokeLinecap="round" />
          {/* Shoes */}
          <ellipse cx="76" cy="225" rx="10" ry="6" fill="#9a3412" />
          <ellipse cx="124" cy="225" rx="10" ry="6" fill="#9a3412" />

          {/* Dress Body: Grows and gets details as completedLevelsCount increases */}
          <g id="dress">
            {/* Base Dress Skirt */}
            <path
              d="M 75 100 L 125 100 L 148 180 L 52 180 Z"
              fill={completedLevelsCount >= 1 ? '#fde047' : '#e5e7eb'}
              stroke="#b45309"
              strokeWidth="2.5"
            />

            {/* Sleeves (Level 2+) */}
            {completedLevelsCount >= 2 && (
              <>
                <path d="M 75 100 L 50 115 L 60 125 L 72 110 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                <path d="M 125 100 L 150 115 L 140 125 L 128 110 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
              </>
            )}

            {/* Pattern Stripes on Chest (Level 4+) */}
            {completedLevelsCount >= 4 && (
              <>
                <line x1="72" y1="120" x2="128" y2="120" stroke="#f97316" strokeWidth="3" strokeDasharray="4 3" />
                <line x1="68" y1="135" x2="132" y2="135" stroke="#f97316" strokeWidth="3" strokeDasharray="4 3" />
              </>
            )}

            {/* Buttons (Level 7+) */}
            {completedLevelsCount >= 7 && (
              <>
                <circle cx="100" cy="112" r="3" fill="#dc2626" stroke="#fff" strokeWidth="1" />
                <circle cx="100" cy="125" r="3" fill="#dc2626" stroke="#fff" strokeWidth="1" />
                <circle cx="100" cy="138" r="3" fill="#dc2626" stroke="#fff" strokeWidth="1" />
              </>
            )}

            {/* Pretty Flower Pattern (Level 9+) */}
            {completedLevelsCount >= 9 && (
              <g fill="#e11d48">
                <circle cx="80" cy="155" r="2.5" />
                <circle cx="120" cy="155" r="2.5" />
                <circle cx="100" cy="165" r="2.5" />
                <circle cx="65" cy="170" r="2" />
                <circle cx="135" cy="170" r="2" />
              </g>
            )}

            {/* Hem Frill (Level 5+) */}
            {completedLevelsCount >= 5 && (
              <path
                d="M 52 180 Q 64 186 76 180 Q 88 186 100 180 Q 112 186 124 180 Q 136 186 148 180"
                fill="none"
                stroke="#c2410c"
                strokeWidth="2"
              />
            )}
          </g>

          {/* Little spark of joy when 100% */}
          {completedLevelsCount === totalLevels && (
            <g>
              <circle cx="35" cy="40" r="4" fill="#f59e0b" />
              <circle cx="165" cy="40" r="4" fill="#f59e0b" />
            </g>
          )}
        </svg>

        {completedLevelsCount === totalLevels && (
          <div className="absolute -top-1 bg-amber-500 text-white text-[11px] font-bold font-display px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-bounce">
            <Sparkles className="w-3 h-3" />
            Vestido Pronto!
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="w-full bg-amber-200/80 rounded-full h-2 overflow-hidden mt-1">
        <div
          className="bg-amber-600 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="text-[11px] text-stone-600 mt-1 font-handwriting">
        {completedLevelsCount === totalLevels
          ? '★ A menina está dançando com o vestido novo sob medida!'
          : 'Acerte as frações para costurar o vestido novo!'}
      </span>
    </div>
  );
};
