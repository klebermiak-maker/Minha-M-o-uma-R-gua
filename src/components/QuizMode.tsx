import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  Volume2,
  ArrowRight,
  RotateCcw,
  Shirt,
  Award,
  Timer,
  BookOpen,
  Zap,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../utils/fractionData';
import { AVATAR_ACCESSORIES, AvatarAccessory } from '../types/avatar';
import { HandAvatar } from './HandAvatar';
import { TimedQuizChallenge } from './TimedQuizChallenge';
import { QuizInteractiveTutorial } from './QuizInteractiveTutorial';
import { sound, speakPortuguese } from '../utils/sound';
import { GraduationCap } from 'lucide-react';

interface QuizModeProps {
  stars: number;
  onAddStar: () => void;
  onAddBonusStars?: (amount: number) => void;
  equippedIds: string[];
  skinToneId: string;
  onOpenCloset: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  stars,
  onAddStar,
  onAddBonusStars = (amount: number) => {
    for (let i = 0; i < amount; i++) onAddStar();
  },
  equippedIds,
  skinToneId,
  onOpenCloset,
}) => {
  const [subTab, setSubTab] = useState<'tutorial' | 'practice' | 'timed'>('practice');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState<number>(0);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [isAvatarWaving, setIsAvatarWaving] = useState<boolean>(false);
  const [newlyUnlockedItem, setNewlyUnlockedItem] = useState<AvatarAccessory | null>(null);

  const question: QuizQuestion = QUIZ_QUESTIONS[currentIndex] || QUIZ_QUESTIONS[0];

  // Calculate next unlock accessory
  const nextItemToUnlock = AVATAR_ACCESSORIES.find((item) => stars < item.requiredStars);

  const handleSelectOption = (index: number) => {
    if (answeredState === 'correct') return;
    setSelectedOptionIndex(index);
    const chosen = question.options[index];
    const isCorrect = chosen.isCorrect ?? (
      Math.abs(chosen.num / chosen.den - question.numerator / question.denominator) < 0.001
    );

    if (isCorrect) {
      sound.playSuccess();
      setIsAvatarWaving(true);
      setTimeout(() => setIsAvatarWaving(false), 2000);

      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ec4899', '#3b82f6'],
        });
      } catch {
        // ignore
      }

      setAnsweredState('correct');

      if (!solvedIds.includes(question.id)) {
        setSolvedIds([...solvedIds, question.id]);
        setScore((prev) => prev + 1);

        const newStars = stars + 1;
        onAddStar();

        // Check if this star unlocked a brand new item!
        const justUnlocked = AVATAR_ACCESSORIES.find((item) => item.requiredStars === newStars);
        if (justUnlocked) {
          setNewlyUnlockedItem(justUnlocked);
          sound.playUnlockAccessory();
          speakPortuguese(
            `Parabéns! Você desbloqueou o novo acessório: ${justUnlocked.name} para a sua Mãozinha Régua!`
          );
        } else {
          sound.playStarEarned();
          sound.playConfettiPopper();
          speakPortuguese(`Correto! ${question.explanation}`);
        }
      } else {
        sound.playSuccess();
        speakPortuguese(`Correto novamente! ${question.explanation}`);
      }
    } else {
      sound.playHint();
      setAnsweredState('wrong');
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setAnsweredState('idle');
      setNewlyUnlockedItem(null);
    }
  };

  const handleRestartQuiz = () => {
    sound.playTap();
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setAnsweredState('idle');
    setScore(0);
    setSolvedIds([]);
    setNewlyUnlockedItem(null);
  };

  const handleSpeak = () => {
    sound.playTap();
    speakPortuguese(
      `${question.question}. As opções são: ${question.options.map((o) => o.label).join(', ')}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-mode Tab Switcher: Tutorial Interativo vs Prática Calma vs Desafio Cronometrado */}
      <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-1.5 flex flex-wrap items-center justify-center max-w-xl mx-auto shadow-2xs gap-1">
        <button
          onClick={() => {
            sound.playTap();
            setSubTab('tutorial');
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-display text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'tutorial'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-700 hover:text-amber-950 hover:bg-amber-200/50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Tutorial Interativo 🎓</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setSubTab('practice');
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-display text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'practice'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-700 hover:text-amber-950 hover:bg-amber-200/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Prática Livre (10 Questões)</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setSubTab('timed');
          }}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-display text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'timed'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
              : 'text-stone-700 hover:text-amber-950 hover:bg-amber-200/50'
          }`}
        >
          <Timer className="w-4 h-4 text-orange-400 fill-orange-300 animate-pulse" />
          <span>Desafio Cronometrado ⚡</span>
        </button>
      </div>

      {/* Render Selected Quiz Sub-Mode */}
      {subTab === 'tutorial' ? (
        <QuizInteractiveTutorial
          onStartQuiz={() => {
            sound.playTap();
            setSubTab('practice');
          }}
          onStartTimedQuiz={() => {
            sound.playTap();
            setSubTab('timed');
          }}
        />
      ) : subTab === 'timed' ? (
        <TimedQuizChallenge
          stars={stars}
          onAddBonusStars={onAddBonusStars}
          equippedIds={equippedIds}
          skinToneId={skinToneId}
          onOpenCloset={onOpenCloset}
          onOpenTutorial={() => {
            sound.playTap();
            setSubTab('tutorial');
          }}
        />
      ) : (
        /* Regular Practice Mode */
        <div className="space-y-6">
          {/* Quick Tutorial Callout Banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
            <span className="text-amber-950 font-medium">
              💡 Dúvidas sobre frações em pizza ou barras? Reveja o tutorial interativo com explicações visuais!
            </span>
            <button
              onClick={() => {
                sound.playTap();
                setSubTab('tutorial');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold font-display transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Ver Tutorial</span>
            </button>
          </div>

          {/* Quiz Progress & Avatar Companion Header Bar */}
          <div className="bg-white/95 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Avatar and Cheering Speech */}
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div
                  onClick={onOpenCloset}
                  className="relative p-1 rounded-2xl bg-amber-100/80 border-2 border-amber-400 hover:border-amber-600 transition-transform hover:scale-105 cursor-pointer shadow-xs shrink-0"
                  title="Clique para abrir o Guarda-Roupa da Mãozinha Régua"
                >
                  <HandAvatar
                    size="sm"
                    skinToneId={skinToneId}
                    equippedIds={equippedIds}
                    isWaving={isAvatarWaving}
                    interactive={false}
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-600 text-white">
                    <Shirt className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-display">
                      Avatar do Estudante
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-1.5 py-0.2 rounded">
                      Torcendo por você!
                    </span>
                  </div>
                  <p className="text-sm font-bold text-amber-950 font-display">
                    Mãozinha Régua · {equippedIds.length} acessórios vestidos
                  </p>
                  <button
                    onClick={onOpenCloset}
                    className="text-xs text-amber-800 hover:text-amber-950 underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir Guarda-Roupa para Vestir</span>
                    <Shirt className="w-3 h-3 text-amber-700" />
                  </button>
                </div>
              </div>

              {/* Score & Next Unlock Progress Gauge */}
              <div className="w-full sm:w-72 bg-amber-50 border border-amber-300/80 rounded-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                    Estrelas: <strong className="text-amber-900 text-sm">{stars}</strong>
                  </span>
                  <span className="font-medium text-stone-600">
                    {score}/{QUIZ_QUESTIONS.length} respondidos
                  </span>
                </div>

                {/* Progress bar towards next accessory */}
                {nextItemToUnlock ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] text-amber-900">
                      <span className="truncate pr-1">
                        Próximo: <strong>{nextItemToUnlock.name}</strong>
                      </span>
                      <span className="font-bold tabular-nums">
                        {stars}/{nextItemToUnlock.requiredStars} ★
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (stars / nextItemToUnlock.requiredStars) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Coleção Completa! Todos os acessórios desbloqueados!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Brand New Unlock Celebration Banner */}
          {newlyUnlockedItem && (
            <div className="p-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 border-2 border-amber-600 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-amber-700 shadow-sm shrink-0">
                  <Sparkles className="w-6 h-6 fill-amber-400 text-amber-600" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-amber-900 tracking-wider">
                    🎉 Novo Acessório Desbloqueado com seu acerto!
                  </span>
                  <h3 className="font-display font-bold text-base text-amber-950">
                    {newlyUnlockedItem.name}
                  </h3>
                  <p className="text-xs text-amber-900/80">
                    {newlyUnlockedItem.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playTap();
                  onOpenCloset();
                }}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-display font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Shirt className="w-3.5 h-3.5" />
                Vestir no Avatar Agora!
              </button>
            </div>
          )}

          {/* Main Question Card */}
          <div className="max-w-3xl mx-auto bg-white border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-amber-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-800 font-display uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                    Pergunta {currentIndex + 1} de {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-stone-500 font-handwriting">
                    {question.context}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-stone-900 font-display leading-snug">
                  {question.question}
                </p>
              </div>

              <button
                onClick={handleSpeak}
                title="Ouvir a pergunta"
                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Visual fraction strip representation for the quiz */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span className="text-xs text-stone-500 block mb-1.5 font-handwriting">
                Representação visual do problema:
              </span>
              <div
                className="grid h-12 rounded-lg overflow-hidden border-2 border-stone-800 divide-x-2 divide-dashed divide-stone-600"
                style={{
                  gridTemplateColumns: `repeat(${question.denominator}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: question.denominator }).map((_, i) => {
                  const isFilled = i < question.numerator;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isFilled ? 'bg-amber-400 text-amber-950' : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {isFilled ? '1/' + question.denominator : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCorrect = opt.isCorrect ?? (
                  Math.abs(opt.num / opt.den - question.numerator / question.denominator) < 0.001
                );

                let buttonClass =
                  'bg-white border-amber-200 text-stone-800 hover:bg-amber-50 hover:border-amber-400';
                if (isSelected) {
                  if (answeredState === 'correct') {
                    buttonClass =
                      'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                  } else if (answeredState === 'wrong') {
                    buttonClass = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                  }
                } else if (answeredState === 'correct' && isCorrect) {
                  buttonClass = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border-2 text-left font-display font-medium text-sm transition-all flex items-center justify-between cursor-pointer ${buttonClass}`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && answeredState === 'correct' && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isSelected && answeredState === 'wrong' && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback Box */}
            {answeredState !== 'idle' && (
              <div
                className={`p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in duration-200 ${
                  answeredState === 'correct'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {answeredState === 'correct' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-bold">
                    {answeredState === 'correct'
                      ? 'Muito bem, resposta exata!'
                      : 'Ainda não é essa alternativa!'}
                  </p>
                  <p className="text-xs leading-relaxed">{question.explanation}</p>
                  {answeredState === 'wrong' && (
                    <p className="text-xs font-semibold text-rose-800 mt-1">
                      Dica: Pense no total de pedaços iguais embaixo e quantas partes foram usadas em cima!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation & Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleRestartQuiz}
                title="Recomeçar Quiz do início"
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Recomeçar Perguntas
              </button>

              {answeredState === 'correct' && (
                <div>
                  {currentIndex < QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold text-sm shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      Próxima Pergunta
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-right space-y-1">
                      <span className="text-emerald-700 font-bold font-display text-sm block">
                        ★ Você completou todas as 10 perguntas do Quiz!
                      </span>
                      <button
                        onClick={handleRestartQuiz}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Jogar o Quiz Novamente
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
