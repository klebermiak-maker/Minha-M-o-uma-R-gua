import React, { useState } from 'react';
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
} from 'lucide-react';
import { STORY_LEVELS, StoryLevel } from '../utils/fractionData';
import { VisualFractionCanvas } from './VisualFractionCanvas';
import { FractionDisplay } from './FractionDisplay';
import { DressVisualizer } from './DressVisualizer';
import { sound, speakPortuguese } from '../utils/sound';

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
  }>({
    status: 'idle',
    message: '',
  });
  const [showHint, setShowHint] = useState<boolean>(false);

  // Sync state when level changes
  React.useEffect(() => {
    setDenominator(currentLevel.initialDenominator);
    setSelectedIndices([]);
    setFeedback({ status: 'idle', message: '' });
    setShowHint(false);
  }, [currentLevelIndex]);

  const handleToggleSegment = (index: number) => {
    let next: number[];
    if (selectedIndices.includes(index)) {
      next = selectedIndices.filter((i) => i !== index);
    } else {
      next = [...selectedIndices, index].sort((a, b) => a - b);
    }
    setSelectedIndices(next);

    // Immediate check if it matches target!
    const isTarget =
      next.length === currentLevel.targetNumerator &&
      denominator === currentLevel.targetDenominator;

    if (isTarget) {
      setFeedback({
        status: 'success',
        message: `Excelente! Você representou ${next.length}/${denominator} com exatidão!`,
      });
    } else {
      setFeedback({ status: 'idle', message: '' });
    }
  };

  const handleCheckAnswer = () => {
    const num = selectedIndices.length;
    const isCorrect =
      num === currentLevel.targetNumerator &&
      denominator === currentLevel.targetDenominator;

    if (isCorrect) {
      sound.playConfettiPopper();
      sound.playStarEarned();
      setTimeout(() => {
        sound.playApplause();
      }, 250);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#f59e0b', '#10b981', '#ec4899', '#3b82f6'],
        });
      } catch {
        // ignore
      }

      setFeedback({
        status: 'success',
        message: `Parabéns! Você representou ${num}/${denominator} certinho! A mamãe adorou a medição!`,
      });
      speakPortuguese(`Muito bem! Você representou a fração ${num} sobre ${denominator} corretamente!`);
      onCompleteLevel(currentLevel.id);
    } else {
      sound.playHint();
      let hintMsg = '';
      if (denominator !== currentLevel.targetDenominator) {
        hintMsg = `Primeiro divida o todo em ${currentLevel.targetDenominator} partes iguais!`;
      } else if (num < currentLevel.targetNumerator) {
        hintMsg = `Você selecionou ${num} partes, mas precisamos de ${currentLevel.targetNumerator} partes (${currentLevel.targetNumerator}/${currentLevel.targetDenominator}). Selecione mais uma parte!`;
      } else {
        hintMsg = `Você selecionou ${num} partes. Precisamos de apenas ${currentLevel.targetNumerator} partes. Clique para desmarcar ${num - currentLevel.targetNumerator} partes!`;
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
    speakPortuguese(`${currentLevel.bookScene}. ${currentLevel.narrative}. ${currentLevel.question}`);
  };

  const isLevelCompleted = completedLevels.includes(currentLevel.id);

  // Pick illustrative scene banner from generated images based on level
  const sceneBanner =
    currentLevelIndex < 4
      ? '/src/assets/images/scene_mother_knitting_1790319815955.jpg'
      : currentLevelIndex === 4 || currentLevelIndex === 6
      ? '/src/assets/images/scene_garden_steps_1790319827557.jpg'
      : '/src/assets/images/hero_girl_measuring_1790319804200.jpg';

  return (
    <div className="space-y-6">
      {/* Level Selection Ribbon (1 to 10) */}
      <div className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold font-display uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            Capítulos do Livro & Desafios de Fração
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
        {/* Left Column: Interactive Stage & Canvas (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Story Prompt Card */}
          <div className="bg-white/95 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-amber-700 font-handwriting">
                  {currentLevel.bodyMeasurementLabel}
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-display text-amber-950">
                  {currentLevel.title}
                </h2>
              </div>
              <button
                onClick={handleReadScene}
                title="Ouvir a história desta fase"
                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Ouvir Texto</span>
              </button>
            </div>

            {/* Book scene quote */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-2.5 rounded-r-lg text-xs sm:text-sm text-amber-900 italic font-handwriting">
              "{currentLevel.bookScene}"
            </div>

            {/* Context narrative */}
            <p className="text-sm text-stone-700 leading-relaxed">
              {currentLevel.narrative}
            </p>

            {/* Target Question */}
            <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-xl">
              <span className="text-xs font-bold uppercase text-amber-900 block mb-0.5">
                Sua Missão:
              </span>
              <p className="text-sm font-semibold text-stone-900">
                {currentLevel.question}
              </p>
            </div>
          </div>

          {/* Denominator Selector (when allowed in advanced levels) */}
          {currentLevel.allowDenominatorChange && (
            <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-stone-700">
                Em quantas partes iguais você quer dividir o tecido? (Denominador):
              </span>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5, 6, 8].map((den) => (
                  <button
                    key={den}
                    onClick={() => {
                      sound.playTap();
                      setDenominator(den);
                      setSelectedIndices([]);
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      denominator === den
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-amber-300 text-stone-700 hover:bg-amber-100'
                    }`}
                  >
                    {den}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Fraction Canvas */}
          <VisualFractionCanvas
            denominator={denominator}
            selectedIndices={selectedIndices}
            onToggleSegment={handleToggleSegment}
            visualType={currentLevel.visualType}
            bodyMeasurement={currentLevel.bodyMeasurement}
          />

          {/* Immediate Action Buttons & Live Validation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Recomeçar
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  setShowHint(!showHint);
                }}
                className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                Dica da Menina
              </button>
            </div>

            <button
              onClick={handleCheckAnswer}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-amber-200" />
              Verificar Medição!
            </button>
          </div>

          {/* Hint Dropdown */}
          {showHint && (
            <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 animate-in fade-in duration-150">
              <strong className="block text-amber-900 font-bold mb-0.5">Dica:</strong>
              {currentLevel.hint}
            </div>
          )}

          {/* Feedback Banner with Immediate Visual Confirmation */}
          {feedback.message && (
            <div
              className={`p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in duration-200 ${
                feedback.status === 'success'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-amber-100/90 border-amber-400 text-amber-950'
              }`}
            >
              {feedback.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-sm font-semibold">{feedback.message}</p>
                <p className="text-xs opacity-90">{currentLevel.pedagogicalTip}</p>
                {feedback.status === 'success' && currentLevelIndex < STORY_LEVELS.length - 1 && (
                  <button
                    onClick={() => {
                      sound.playTap();
                      onSelectLevelIndex(currentLevelIndex + 1);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-display shadow-xs transition-colors cursor-pointer"
                  >
                    Avançar para a Fase {currentLevelIndex + 2}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
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
                onError={(e) => {
                  // Fallback container
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs text-stone-600 mt-2 italic font-handwriting">
              "O corpo pode se tornar réguas incríveis para medir qualquer coisa!"
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
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
