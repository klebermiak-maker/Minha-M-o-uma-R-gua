import React from 'react';
import { Volume2, Equal } from 'lucide-react';
import { getFractionName, checkEquivalence } from '../utils/fractionData';
import { sound, speakPortuguese } from '../utils/sound';

interface FractionDisplayProps {
  numerator: number;
  denominator: number;
  highlightEquivalent?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  numerator,
  denominator,
  highlightEquivalent = true,
  size = 'md',
}) => {
  const fractionName = getFractionName(numerator, denominator);
  const equivalence = highlightEquivalent ? checkEquivalence(numerator, denominator) : null;

  const handleSpeak = () => {
    sound.playTap();
    speakPortuguese(`A fração é ${numerator} sobre ${denominator}, ou seja, ${fractionName}`);
  };

  const scaleClasses = {
    sm: {
      box: 'p-2',
      num: 'text-xl',
      name: 'text-xs',
      sub: 'text-[10px]',
    },
    md: {
      box: 'p-3',
      num: 'text-2xl sm:text-3xl',
      name: 'text-sm sm:text-base',
      sub: 'text-xs',
    },
    lg: {
      box: 'p-4',
      num: 'text-3xl sm:text-4xl',
      name: 'text-base sm:text-lg',
      sub: 'text-xs sm:text-sm',
    },
  }[size];

  return (
    <div className={`bg-amber-100/70 border border-amber-300 rounded-xl ${scaleClasses.box} shadow-xs`}>
      <div className="flex items-center justify-between gap-4">
        {/* The Mathematical Fraction Card */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center font-display font-bold text-stone-900 bg-white border border-amber-300/80 rounded-lg px-3 py-1.5 shadow-xs">
            {/* Numerator */}
            <div className="flex items-center gap-1">
              <span className={`${scaleClasses.num} text-amber-700 tabular-nums`}>
                {numerator}
              </span>
            </div>
            {/* Fraction Line */}
            <div className="w-full h-0.5 bg-amber-800 my-0.5 rounded-full" />
            {/* Denominator */}
            <div className="flex items-center gap-1">
              <span className={`${scaleClasses.num} text-stone-800 tabular-nums`}>
                {denominator}
              </span>
            </div>
          </div>

          {/* Reading & Breakdown */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className={`font-display font-bold text-amber-950 capitalize ${scaleClasses.name}`}>
                {fractionName}
              </span>
              <button
                onClick={handleSpeak}
                title="Ouvir leitura da fração"
                className="p-1 rounded-md text-amber-700 hover:text-amber-900 hover:bg-amber-200/60 transition-colors cursor-pointer"
                aria-label="Ouvir como se lê a fração"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className={`text-stone-600 ${scaleClasses.sub} flex flex-wrap items-center gap-x-2`}>
              <span>
                <strong className="text-amber-800">{numerator}</strong> {numerator === 1 ? 'parte pintada' : 'partes pintadas'} (numerador)
              </span>
              <span className="text-stone-400">·</span>
              <span>
                de <strong className="text-stone-800">{denominator}</strong> partes iguais (denominador)
              </span>
            </div>
          </div>
        </div>

        {/* Visual percentage mini gauge */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-medium text-stone-500">Preenchimento</span>
          <span className="text-base font-bold font-display text-amber-900 tabular-nums">
            {Math.round((numerator / Math.max(denominator, 1)) * 100)}%
          </span>
        </div>
      </div>

      {/* Equivalence banner if applicable */}
      {equivalence && (
        <div className="mt-2.5 pt-2 border-t border-amber-200 flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-md">
          <Equal className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-medium">{equivalence}</span>
        </div>
      )}
    </div>
  );
};
