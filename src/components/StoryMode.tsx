import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  RefreshCw,
  BookOpen,
  PieChart,
  Target,
} from 'lucide-react';
import { STORY_LEVELS, StoryLevel, getFractionName } from '../utils/fractionData';
import { VisualFractionCanvas } from './VisualFractionCanvas';
import { FractionDisplay } from './FractionDisplay';
import { DressVisualizer } from './DressVisualizer';
import { sound, speakPortuguese } from '../utils/sound';

import sceneMotherKnitting from '../assets/images/scene_mother_knitting_1790319815955.jpg';
import sceneGardenSteps from '../assets/images/scene_garden_steps_1790319827557.jpg';
import heroGirlMeasuring from '../assets/images/hero_girl_measuring_1790319804200.jpg';

interface StoryModeProps {
  currentLevelIndex: number;
  completedLevels: number[];
  onCompleteLevel: (levelId: number) => void;
  onSelectLevelIndex: (index: number) => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({
  currentLevelIndex,
  completedLevels,
  onCompleteLevel,
  onSelectLevelIndex,
}) => {
  const currentLevel: StoryLevel = STORY_LEVELS[currentLevelIndex] || STORY_LEVELS[0];

  const [denominator, setDenominator] = useState<number>(currentLevel.initialDenominator);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'success' | 'retry';
    message: string;
    isEquivalence?: boolean;
  }>({
    status: 'idle',
    message: '',
  });
  const [showHint, setShowHint] = useState<boolean>(false);

  // Sync state when level changes
  useEffect(() => {
    setDenominator(currentLevel.initialDenominator);
    setSelectedIndices([]);
    setFeedback({ status: 'idle', message: '' });
    setShowHint(false);
  }, [currentLevelIndex, currentLevel.initialDenominator]);

  const targetValue = currentLevel.targetNumerator / currentLevel.targetDenominator;
  const isLevelCompleted = completedLevels.includes(currentLevel.id);

  const checkSolution = (num: number, den: number) => {
    if (den === 0) return { isCorrect: false, isEquivalence: false };
    const val = num / den;
    const isCorrect = Math.abs(val - targetValue) < 0.0001;
    const isEquivalence = isCorrect && (num !== currentLevel.targetNumerator || den !== currentLevel.targetDenominator);
    return { isCorrect, isEquivalence };
  };

  const handleToggleSegment = (index: number) => {
    let next: number[];
    if (selectedIndices.includes(index)) {
      next = selectedIndices.filter((i) => i !== index);
    } else {
      next = [...selectedIndices, index].sort((a, b) => a - b);
    }
    setSelectedIndices(next);

    const { isCorrect, isEquivalence } = checkSolution(next.length, denominator);

    if (isCorrect) {
      sound.playConfettiPopper();
      sound.playStarEarned();
      setTimeout(() => {
        sound.playApplause();
      }, 250);

      try {
        confetti({
          particleCount: 55,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#f43f5e'],
        });
      } catch {
        // ignore
      }

      const successMsg = isEquivalence
        ? `Sensacional! Você descobriu uma fração equivalente: ${next.length}/${denominator} tem exatamente o mesmo tamanho que ${currentLevel.targetNumerator}/${currentLevel.targetDenominator}!`
        : `Excelente! Você representou ${next.length}/${denominator} com exatidão! A medição está perfeita!`;

      setFeedback({
        status: 'success',
        message: successMsg,
        isEquivalence,
      });

      speakPortuguese(
        isEquivalence
          ? `Muito bem! ${next.length} sobre ${denominator} equivale a ${currentLevel.targetNumerator} sobre ${currentLevel.targetDenominator}!`
          : `Muito bem! Você representou a fração ${next.length} sobre ${denominator} corretamente!`
      );

      onCompleteLevel(currentLevel.id);
    } else {
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const handleCheckAnswer = () => {
    const num = selectedIndices.length;
    const { isCorrect, isEquivalence } = checkSolution(num, denominator);

    if (isCorrect) {
      sound.playConfettiPopper();
      sound.playStarEarned();
      setTimeout(() => {
        sound.playApplause();
      }, 250);

      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#f59e0b', '#10b981', '#ec4899', '#3b82f6'],
        });
      } catch {
        // ignore
      }

      setFeedback({
        status: 'success',
        message: isEquivalence
          ? `Parabéns! ${num}/${denominator} equivale exatamente a ${currentLevel.targetNumerator}/${currentLevel.targetDenominator}!`
          : `Parabéns! Você representou ${num}/${denominator} certinho! A mamãe adorou a medição!`,
        isEquivalence,
      });
      speakPortuguese(`Muito bem! Você acertou a fração da missão!`);
      onCompleteLevel(currentLevel.id);
    } else {
      sound.playHint();
      const currentVal = num / denominator;
      let hintMsg = '';

      if (num === 0) {
        hintMsg = `Toque nas fatias da pizza ou blocos da fita para pintar a fração ${currentLevel.targetNumerator}/${currentLevel.targetDenominator}!`;
      } else if (currentVal < targetValue) {
        hintMsg = `Você selecionou ${num}/${denominator}. Precisamos de ${currentLevel.targetNumerator}/${currentLevel.targetDenominator} (${getFractionName(currentLevel.targetNumerator, currentLevel.targetDenominator)}). Pinte mais uma parte!`;
      } else {
        hintMsg = `Você selecionou ${num}/${denominator}, que é maior que a meta. Desmarque algumas partes para chegar a ${currentLevel.targetNumerator}/${currentLevel.targetDenominator}!`;
      }

      setFeedback({
        status: 'retry',
        message: hintMsg,
      });
    }
  };

  const handleReset = () => {
    sound.playTap();
    setSelectedIndices([]);
    setFeedback({ status: 'idle', message: '' });
  };

  const handleReadScene = () => {
    sound.playTap();
    speakPortuguese(
      `Fase ${currentLevelIndex + 1}: ${currentLevel.title}. Sua missão é: ${currentLevel.question}`
    );
  };

  // Pick illustrative scene banner from generated images based on level
  const sceneBanner =
    currentLevelIndex < 4
      ? sceneMotherKnitting
      : currentLevelIndex === 4 || currentLevelIndex === 6
      ? sceneGardenSteps
      : heroGirlMeasuring;

  return (
    <div className="space-y-6">
      {/* Level Selection Ribbon (1 to 10) */}
      <div className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold font-display uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            Capítulos do Livro & Missões de Fração
          </span>
          <span className="text-xs text-amber-800 font-semibold tabular-nums">
            Fase {currentLevelIndex + 1} de {STORY_LEVELS.length}
          </span>
        </div>

        {/* Level buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STORY_LEVELS.map((level, idx) => {
            const isDone = completedLevels.includes(level.id);
            const isCurrent = idx === currentLevelIndex;
            return (
              <button
                key={level.id}
                onClick={() => {
                  sound.playTap();
                  onSelectLevelIndex(idx);
                }}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400 ring-offset-1'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-white/80 text-stone-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>Fase {idx + 1}</span>
                {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Zone Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Stage & Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Crystal Clear Mission Card */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 border-2 border-amber-500 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 text-amber-950 text-xs font-bold font-display shadow-2xs">
                  <Target className="w-3.5 h-3.5 text-amber-700" />
                  Missão #{currentLevelIndex + 1} · {currentLevel.bodyMeasurementLabel}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-950">
                  {currentLevel.title}
                </h2>
                <p className="text-xs sm:text-sm text-amber-950/85 font-medium leading-relaxed">
                  {currentLevel.narrative}
                </p>
              </div>

              {/* Prominent Target Fraction Badge */}
              <div className="flex items-center gap-3 bg-white/95 border-2 border-amber-600 p-3 rounded-2xl shadow-sm shrink-0">
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block font-display">
                    Sua Meta
                  </span>
                  <div className="text-2xl font-bold font-mono text-amber-950 flex items-center justify-center">
                    {currentLevel.targetNumerator}/{currentLevel.targetDenominator}
                  </div>
                  <span className="text-[10px] text-stone-600 font-semibold block">
                    {getFractionName(currentLevel.targetNumerator, currentLevel.targetDenominator)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReadScene}
                  title="Ouvir a missão da fase"
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Book scene quote */}
            <div className="relative z-10 bg-white/70 border-l-4 border-amber-700 p-2.5 rounded-r-xl text-xs sm:text-sm text-amber-950 italic font-handwriting">
              "{currentLevel.bookScene}"
            </div>
          </div>

          {/* Step 1: Denominator / Slicing Selector */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-950 font-display flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                  1
                </span>
                Quantas fatias ou partes iguais dividir o todo? (Denominador):
              </span>
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                {denominator} partes iguais
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[2, 3, 4, 5, 6, 8, 10].map((den) => {
                const isSelected = denominator === den;
                const isTargetDen = den === currentLevel.targetDenominator;

                return (
                  <button
                    key={den}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setDenominator(den);
                      setSelectedIndices([]);
                    }}
                    className={`flex-1 min-w-[52px] py-2 px-2 rounded-xl text-xs font-bold font-display cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs scale-102 ring-2 ring-amber-400'
                        : isTargetDen
                        ? 'bg-amber-200/90 border-2 border-amber-400 text-amber-950 hover:bg-amber-300'
                        : 'bg-white border border-amber-200 text-stone-700 hover:bg-amber-100'
                    }`}
                  >
                    <span className="block text-sm">{den} fatias</span>
                    <span className="block text-[10px] opacity-80 font-normal">
                      1/{den} {den === 2 ? '(meios)' : den === 3 ? '(terços)' : den === 4 ? '(quartos)' : den === 5 ? '(quintos)' : den === 6 ? '(sextos)' : den === 8 ? '(oitavos)' : '(décimos)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Interactive Fraction Canvas (PIZZA / BARRA / GRADE) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600 px-1">
              <span className="font-bold text-amber-950 font-display flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                Toque nas fatias ou blocos para pintar a fração da missão:
              </span>
            </div>

            <VisualFractionCanvas
              denominator={denominator}
              selectedIndices={selectedIndices}
              onToggleSegment={handleToggleSegment}
              visualType={currentLevel.visualType}
              bodyMeasurement={currentLevel.bodyMeasurement}
              initialFormat="pizza"
              targetFraction={{
                num: currentLevel.targetNumerator,
                den: currentLevel.targetDenominator,
              }}
            />
          </div>

          {/* Step 3: Immediate Actions & Live Validation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Limpar Seleção
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setShowHint(!showHint);
                }}
                className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                Dica da Menina
              </button>
            </div>

            <button
              type="button"
              onClick={handleCheckAnswer}
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-amber-200" />
              Verificar se está Certo!
            </button>
          </div>

          {/* Hint Dropdown */}
          {showHint && (
            <div className="p-4 bg-amber-100/90 border-2 border-amber-300 rounded-2xl text-xs text-amber-950 animate-in fade-in duration-150 space-y-1">
              <strong className="block text-amber-900 font-bold font-display text-sm">
                💡 Dica da Menina do Livro:
              </strong>
              <p>{currentLevel.hint}</p>
              <p className="text-[11px] text-stone-600 pt-1 font-handwriting">
                Você pode trocar entre Formato Pizza (🍕), Barra (📏) ou Grade (🧱) a qualquer momento lá em cima!
              </p>
            </div>
          )}

          {/* Feedback Banner with Immediate Visual Confirmation */}
          {feedback.message && (
            <div
              className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200 ${
                feedback.status === 'success'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
                  : 'bg-amber-100/95 border-amber-400 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedback.status === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-bold leading-snug">{feedback.message}</p>
                  <p className="text-xs opacity-90">{currentLevel.pedagogicalTip}</p>
                </div>
              </div>

              {/* Big Next Level Button */}
              {feedback.status === 'success' && currentLevelIndex < STORY_LEVELS.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onSelectLevelIndex(currentLevelIndex + 1);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <span>Avançar para a Fase {currentLevelIndex + 2}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Mathematical Concept Deck & Dress Visualizer (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Fraction Mathematical Display */}
          <FractionDisplay
            numerator={selectedIndices.length}
            denominator={denominator}
            size="md"
          />

          {/* Dress Visualizer */}
          <DressVisualizer completedLevelsCount={completedLevels.length} totalLevels={10} />

          {/* Scene Illustration with Safe Fallback */}
          <div className="bg-white rounded-2xl border border-amber-300/80 p-3 overflow-hidden shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2 font-display">
              Ilustração da Cena (Livro Callis)
            </span>
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-amber-100/50 border border-amber-200">
              <img
                src={sceneBanner}
                alt="Cena do livro Minha mão é uma régua"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-stone-600 mt-2 italic font-handwriting">
              "O corpo pode se tornar réguas incríveis para medir qualquer coisa!"
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              disabled={currentLevelIndex === 0}
              onClick={() => {
                sound.playTap();
                onSelectLevelIndex(currentLevelIndex - 1);
              }}
              className="flex-1 py-2 px-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 text-xs font-bold font-display flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Fase Anterior
            </button>

            <button
              type="button"
              disabled={currentLevelIndex === STORY_LEVELS.length - 1}
              onClick={() => {
                sound.playTap();
                onSelectLevelIndex(currentLevelIndex + 1);
              }}
              className="flex-1 py-2 px-3 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 text-xs font-bold font-display flex items-center justify-center gap-1 cursor-pointer"
            >
              Próxima Fase
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
