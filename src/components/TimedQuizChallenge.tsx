import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  Zap,
  Sparkles,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Volume2,
  Trophy,
  ArrowRight,
  Shirt,
  Flame,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../utils/fractionData';
import { HandAvatar } from './HandAvatar';
import { sound, speakPortuguese } from '../utils/sound';

interface TimedQuizChallengeProps {
  stars: number;
  onAddBonusStars: (amount: number) => void;
  equippedIds: string[];
  skinToneId: string;
  onOpenCloset: () => void;
}

const TOTAL_TIME_SECONDS = 30;
const SEQUENCE_TARGET = 5;
const BONUS_STARS_REWARD = 3; // +3 bonus stars on top of 5 base stars = 8 total!

export const TimedQuizChallenge: React.FC<TimedQuizChallengeProps> = ({
  stars,
  onAddBonusStars,
  equippedIds,
  skinToneId,
  onOpenCloset,
}) => {
  const [gameState, setGameState] = useState<'ready' | 'running' | 'won' | 'timeout'>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME_SECONDS);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [earnedStarsInRound, setEarnedStarsInRound] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize randomized sequence of questions for the challenge
  const prepareNewRound = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, SEQUENCE_TARGET);
    setShuffledQuestions(shuffled);
    setCurrentStep(0);
    setStreak(0);
    setSelectedOption(null);
    setAnsweredState('idle');
    setTimeLeft(TOTAL_TIME_SECONDS);
    setEarnedStarsInRound(0);
  };

  useEffect(() => {
    prepareNewRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer loop
  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeOut();
            return 0;
          }
          if (prev <= 6) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleStartGame = () => {
    prepareNewRound();
    sound.playTap();
    setGameState('running');
    speakPortuguese('Começou! Responda à sequência de frações em menos de 30 segundos!');
  };

  const handleTimeOut = () => {
    sound.playHint();
    setGameState('timeout');
    speakPortuguese('Tempo esgotado! Mas você mandou muito bem! Tente de novo para faturar o bônus!');
  };

  const handleSelectOption = (optIndex: number) => {
    if (gameState !== 'running' || answeredState === 'correct') return;

    setSelectedOption(optIndex);
    const currentQ = shuffledQuestions[currentStep];
    const chosen = currentQ.options[optIndex];
    const isCorrect = chosen.isCorrect ?? (
      Math.abs(chosen.num / chosen.den - currentQ.numerator / currentQ.denominator) < 0.001
    );

    if (isCorrect) {
      sound.playSuccess();
      setAnsweredState('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Check if sequence is complete
      if (currentStep + 1 >= SEQUENCE_TARGET) {
        // VICTORY!
        if (timerRef.current) clearInterval(timerRef.current);
        const timeTaken = TOTAL_TIME_SECONDS - (timeLeft - 1);
        const actualTimeTaken = Math.max(1, Math.min(30, timeTaken));

        if (!bestTime || actualTimeTaken < bestTime) {
          setBestTime(actualTimeTaken);
        }

        const totalStarsWon = SEQUENCE_TARGET + BONUS_STARS_REWARD;
        setEarnedStarsInRound(totalStarsWon);
        onAddBonusStars(totalStarsWon);
        setGameState('won');

        sound.playConfettiPopper();
        sound.playBonus();
        sound.playStarEarned();
        setTimeout(() => {
          sound.playApplause();
        }, 260);

        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'],
          });
        } catch {
          // ignore
        }

        speakPortuguese(
          `Sensacional! Você respondeu a sequência de 5 frações em ${actualTimeTaken} segundos e ganhou ${totalStarsWon} estrelas com bônus de velocidade!`
        );
      } else {
        // Fast forward to next question after small visual confirmation (350ms)
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          setSelectedOption(null);
          setAnsweredState('idle');
        }, 380);
      }
    } else {
      sound.playHint();
      setAnsweredState('wrong');
      setStreak(0);
      // Small penalty or quick recovery
      setTimeout(() => {
        setSelectedOption(null);
        setAnsweredState('idle');
      }, 500);
    }
  };

  const currentQ = shuffledQuestions[currentStep] || shuffledQuestions[0];
  const progressPercent = ((TOTAL_TIME_SECONDS - timeLeft) / TOTAL_TIME_SECONDS) * 100;
  const timerUrgent = timeLeft <= 10;

  return (
    <div className="space-y-6">
      {/* Timed Challenge Header Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold font-display">
              <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              Desafio Cronometrado · Corrida das Frações
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display">
              Responda a 5 Frações em Menos de 30 Segundos!
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Mostre que você domina as frações do livro com rapidez! Acerte a sequência inteira antes do cronômetro zerar para faturar <strong>+{BONUS_STARS_REWARD} Estrelas Bônus</strong> de velocidade e desbloquear acessórios mais rápido!
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/20 shrink-0">
            <div className="text-center pr-3 border-r border-white/20">
              <span className="text-[10px] text-amber-200 uppercase block font-display">
                Meta do Desafio
              </span>
              <span className="text-lg font-bold font-display">{SEQUENCE_TARGET} Acertos</span>
            </div>
            <div className="text-center pl-1">
              <span className="text-[10px] text-amber-200 uppercase block font-display">
                Recompensa
              </span>
              <span className="text-lg font-bold font-display text-yellow-300 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 fill-yellow-300" />
                +8 ★
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 -bottom-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-36 -top-12 w-28 h-28 rounded-full bg-yellow-400/20 pointer-events-none" />
      </div>

      {/* Main Game Stage */}
      {gameState === 'ready' && (
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-center shadow-xs space-y-6 max-w-2xl mx-auto">
          {/* Animated Avatar Ready with Running Spirit */}
          <div className="flex flex-col items-center justify-center">
            <div
              onClick={onOpenCloset}
              className="p-3 rounded-full bg-amber-100 border-2 border-amber-400 cursor-pointer hover:scale-105 transition-transform"
              title="Personalizar avatar no guarda-roupa"
            >
              <HandAvatar
                size="md"
                skinToneId={skinToneId}
                equippedIds={equippedIds}
                isWaving={true}
                interactive={false}
              />
            </div>
            <span className="mt-2 text-xs font-bold text-amber-900 font-display">
              A Mãozinha Régua está no ponto de partida!
            </span>
            <button
              onClick={onOpenCloset}
              className="text-[11px] text-amber-700 underline flex items-center gap-1 mt-0.5 cursor-pointer"
            >
              <Shirt className="w-3 h-3" />
              Mudar visual do avatar antes da corrida
            </button>
          </div>

          {/* Rules Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <Timer className="w-5 h-5 text-amber-700 mx-auto mb-1" />
              <strong className="block text-amber-950 font-display">30 Segundos</strong>
              O relógio começa a rodar assim que você clicar em Iniciar.
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <Zap className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <strong className="block text-amber-950 font-display">5 Frações Seguidas</strong>
              Observe as partes pintadas e toque na resposta certa rápido!
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <Trophy className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <strong className="block text-amber-950 font-display">+3 Estrelas Bônus</strong>
              Ganhe 5 estrelas normais + 3 bônus de velocidade para seu avatar!
            </div>
          </div>

          {bestTime && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900">
              <Trophy className="w-4 h-4 text-emerald-600" />
              Seu Melhor Tempo Atual: {bestTime} segundos! ⚡
            </div>
          )}

          {/* Start CTA */}
          <div>
            <button
              onClick={handleStartGame}
              className="px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold text-lg shadow-lg flex items-center gap-2.5 mx-auto transition-all transform active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              Iniciar Corrida das Frações!
            </button>
          </div>
        </div>
      )}

      {gameState === 'running' && currentQ && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Active Timer and Sequence Progress Bar */}
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              {/* Sequence step pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-600 font-display mr-1">
                  Sequência:
                </span>
                {Array.from({ length: SEQUENCE_TARGET }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      idx < currentStep
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : idx === currentStep
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-110'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                ))}
              </div>

              {/* Countdown Display */}
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-display font-bold text-base transition-all ${
                  timerUrgent
                    ? 'bg-rose-100 border-2 border-rose-500 text-rose-700 animate-pulse'
                    : 'bg-amber-100 border border-amber-300 text-amber-950'
                }`}
              >
                <Timer className={`w-4 h-4 ${timerUrgent ? 'text-rose-600' : 'text-amber-700'}`} />
                <span className="tabular-nums text-lg">{timeLeft}s</span>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${
                  timerUrgent ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${100 - progressPercent}%` }}
              />
            </div>

            {/* Streak Flame indicator */}
            {streak > 1 && (
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-orange-600 animate-in fade-in">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
                <span>Sequência de {streak} acertos seguidos! Mantenha o ritmo!</span>
              </div>
            )}
          </div>

          {/* Rapid Question Card */}
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2">
              <span className="text-xs font-semibold text-amber-800 font-handwriting">
                Questão {currentStep + 1} de {SEQUENCE_TARGET} · {currentQ.context}
              </span>
              <span className="text-xs font-bold text-stone-500 font-mono">
                {currentQ.numerator}/{currentQ.denominator}
              </span>
            </div>

            <p className="text-base font-bold font-display text-stone-900 leading-snug">
              {currentQ.question}
            </p>

            {/* Visual fraction strip */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
              <div
                className="grid h-10 rounded-lg overflow-hidden border-2 border-stone-800 divide-x-2 divide-dashed divide-stone-600"
                style={{
                  gridTemplateColumns: `repeat(${currentQ.denominator}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: currentQ.denominator }).map((_, i) => {
                  const isFilled = i < currentQ.numerator;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isFilled ? 'bg-amber-400 text-amber-950' : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {isFilled ? '1/' + currentQ.denominator : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Fast Tap Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect =
                  opt.num === currentQ.numerator && opt.den === currentQ.denominator;

                let btnClass = 'bg-amber-50/60 hover:bg-amber-100 border-amber-200 text-stone-800';
                if (isSelected) {
                  if (answeredState === 'correct') {
                    btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-xs scale-102';
                  } else if (answeredState === 'wrong') {
                    btnClass = 'bg-rose-500 text-white border-rose-600 scale-98';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border-2 text-left font-display font-semibold text-sm transition-all flex items-center justify-between cursor-pointer active:scale-95 ${btnClass}`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && answeredState === 'correct' && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                    {isSelected && answeredState === 'wrong' && (
                      <XCircle className="w-5 h-5 text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'won' && (
        <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 text-center shadow-lg space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
            <Trophy className="w-12 h-12 text-yellow-500 fill-yellow-400" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-display">
              Vitória Relâmpago!
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
              Desafio Concluído em Tempo Recorde!
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Você acertou todas as 5 frações antes dos 30 segundos e garantiu seu bônus de velocidade!
            </p>
          </div>

          {/* Victory Rewards Box */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-xs text-stone-500 block">Tempo Gasto</span>
              <strong className="text-xl font-bold font-display text-amber-900">
                {TOTAL_TIME_SECONDS - timeLeft}s
              </strong>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-2xl">
              <span className="text-xs text-stone-500 block">Estrelas Ganhas</span>
              <strong className="text-xl font-bold font-display text-yellow-600 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                +{earnedStarsInRound} ★
              </strong>
            </div>
          </div>

          {/* Animated Avatar celebrating */}
          <div className="p-3 flex items-center justify-center gap-3 bg-amber-50/80 rounded-2xl border border-amber-200 max-w-md mx-auto">
            <div className="w-12 h-14 flex items-center justify-center">
              <HandAvatar
                size="sm"
                skinToneId={skinToneId}
                equippedIds={equippedIds}
                isWaving={true}
                interactive={false}
              />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-amber-950 font-display block">
                Mãozinha Régua está em festa!
              </span>
              <span className="text-[11px] text-stone-600">
                Use as estrelas conquistadas para vestir novos acessórios no Guarda-Roupa!
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold text-sm shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Jogar Novamente para Bater Recorde!
            </button>

            <button
              onClick={onOpenCloset}
              className="px-5 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-display font-bold text-sm shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Shirt className="w-4 h-4 text-amber-700" />
              Abrir Guarda-Roupa
            </button>
          </div>
        </div>
      )}

      {/* Timeout Screen */}
      {gameState === 'timeout' && (
        <div className="bg-white border-2 border-orange-300 rounded-3xl p-6 sm:p-8 text-center shadow-md space-y-5 max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-orange-100 text-orange-600">
            <Timer className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              O Tempo de 30 Segundos Esgotou!
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Você acertou {currentStep} de {SEQUENCE_TARGET} frações da sequência. Faltou pouquinho para levar o bônus de velocidade!
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 max-w-sm mx-auto text-xs text-amber-900">
            <strong>Dica da Régua:</strong> Observe se as partes pintadas são a metade (1/2), um terço (1/3) ou um quarto (1/4) para responder ainda mais rápido!
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartGame}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold text-sm shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Tentar Novamente Agora!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
