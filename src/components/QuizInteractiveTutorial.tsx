import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  PieChart,
  Layers,
  Sparkles,
  Volume2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';
import { sound, speakPortuguese } from '../utils/sound';
import { getFractionName } from '../utils/fractionData';

interface QuizInteractiveTutorialProps {
  onStartQuiz: () => void;
  onStartTimedQuiz?: () => void;
}

export const QuizInteractiveTutorial: React.FC<QuizInteractiveTutorialProps> = ({
  onStartQuiz,
  onStartTimedQuiz,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Interactive playground states
  const [interactiveShape, setInteractiveShape] = useState<'pizza' | 'rect'>('pizza');
  const [interactiveDen, setInteractiveDen] = useState<number>(4);
  const [interactiveSelected, setInteractiveSelected] = useState<number[]>([0, 1]);

  // Equivalence demonstration state
  const [equivChoice, setEquivChoice] = useState<'1/2' | '2/4' | '4/8'>('1/2');

  // Mini warmup challenge
  const [warmupSelected, setWarmupSelected] = useState<number[]>([]);
  const [warmupPassed, setWarmupPassed] = useState<boolean>(false);

  const steps = [
    {
      id: 'concept',
      title: '1. O que é uma Fração?',
      subtitle: 'Entendendo as partes de um todo',
    },
    {
      id: 'pizza',
      title: '2. Fração no Formato Pizza (Círculo)',
      subtitle: 'Como fatiar e representar pedaços redondos',
    },
    {
      id: 'rect',
      title: '3. Fração no Formato Retângulo (Barra / Fita)',
      subtitle: 'Como dividir tiras e faixas em partes iguais',
    },
    {
      id: 'equivalence',
      title: '4. O Segredo das Frações Equivalentes',
      subtitle: 'Frações diferentes com o mesmo tamanho exato!',
    },
    {
      id: 'warmup',
      title: '5. Mini Treino Rápido (Aquecimento)',
      subtitle: 'Teste você mesmo antes de iniciar o Quiz!',
    },
  ];

  const handleToggleInteractive = (idx: number) => {
    sound.playTap();
    if (interactiveSelected.includes(idx)) {
      setInteractiveSelected(interactiveSelected.filter((i) => i !== idx));
    } else {
      setInteractiveSelected([...interactiveSelected, idx].sort((a, b) => a - b));
    }
  };

  const handleToggleWarmup = (idx: number) => {
    sound.playTap();
    let next: number[];
    if (warmupSelected.includes(idx)) {
      next = warmupSelected.filter((i) => i !== idx);
    } else {
      next = [...warmupSelected, idx].sort((a, b) => a - b);
    }
    setWarmupSelected(next);

    // Warmup goal: represent 2/4 (half)
    if (next.length === 2) {
      sound.playConfettiPopper();
      sound.playStarEarned();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ec4899', '#3b82f6'],
        });
      } catch {
        // ignore
      }
      setWarmupPassed(true);
      speakPortuguese('Parabéns! Você representou 2 quartos com perfeição! Está pronto para o Quiz!');
    } else {
      setWarmupPassed(false);
    }
  };

  const readStepAloud = () => {
    sound.playTap();
    if (currentStep === 0) {
      speakPortuguese(
        'Uma fração é uma forma de representar pedaços de um todo dividido em partes iguais. O número de cima é o numerador: quantas partes pegamos. O número de baixo é o denominador: em quantas partes o todo foi dividido.'
      );
    } else if (currentStep === 1) {
      speakPortuguese(
        'No formato pizza, desenhamos um círculo dividido em fatias iguais do centro até a borda. Cada fatia é uma fração!'
      );
    } else if (currentStep === 2) {
      speakPortuguese(
        'No formato retângulo ou barra, como a fita e o tecido do livro, dividimos o comprimento em tiras iguais.'
      );
    } else if (currentStep === 3) {
      speakPortuguese(
        'Frações equivalentes têm números diferentes, mas representam a mesma quantidade! Por exemplo: um meio, dois quartos e quatro oitavos são exatamente a metade!'
      );
    } else {
      speakPortuguese(
        'Agora é sua vez no aquecimento: pinte duas de quatro fatias para formar dois quartos!'
      );
    }
  };

  return (
    <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header with Title and Read Aloud */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-amber-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-display">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Tutorial Visual Interativo
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-950">
            Como as Frações Funcionam nas Formas
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Aprenda a reconhecer frações em pizzas e retângulos antes de responder às questões do Quiz!
          </p>
        </div>

        <button
          type="button"
          onClick={readStepAloud}
          className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold font-display flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Volume2 className="w-4 h-4 text-amber-800" />
          <span>Ouvir Explicação</span>
        </button>
      </div>

      {/* Step Progress Navigation Dots */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => {
              sound.playTap();
              setCurrentStep(idx);
            }}
            className={`flex-1 min-w-[100px] py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
              currentStep === idx
                ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-bold'
                : idx < currentStep
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-amber-50'
            }`}
          >
            <span className="block text-[10px] uppercase tracking-wider opacity-85">
              Passo {idx + 1}
            </span>
            <span className="block text-xs truncate font-display">
              {idx === 0 ? 'Conceito' : idx === 1 ? 'Pizza' : idx === 2 ? 'Retângulo' : idx === 3 ? 'Equivalência' : 'Treino'}
            </span>
          </button>
        ))}
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="min-h-[340px] flex flex-col justify-between">
        {/* ===================== STEP 1: CONCEITO ===================== */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-6 space-y-4">
              <h3 className="text-lg font-bold font-display text-amber-950 flex items-center gap-2">
                <span>Partes de uma Fração: Numerador e Denominador</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Fraction Anatomy Card */}
                <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="flex items-center gap-4">
                    {/* The Fraction Fraction */}
                    <div className="flex flex-col items-center text-4xl sm:text-5xl font-mono font-bold text-amber-950">
                      <div className="text-amber-700 bg-amber-100 px-4 py-1 rounded-xl border border-amber-300">
                        3
                      </div>
                      <div className="w-16 h-1.5 bg-stone-800 my-1 rounded-full" />
                      <div className="text-blue-700 bg-blue-100 px-4 py-1 rounded-xl border border-blue-300">
                        4
                      </div>
                    </div>

                    {/* Annotations */}
                    <div className="text-left space-y-3">
                      <div className="bg-amber-50 border border-amber-300 p-2 rounded-xl">
                        <span className="text-xs font-bold text-amber-900 block font-display">
                          ⬆ NUMERADOR (3)
                        </span>
                        <span className="text-[11px] text-stone-600">
                          Quantas partes foram <strong>pintadas</strong> ou usadas.
                        </span>
                      </div>

                      <div className="bg-blue-50 border border-blue-300 p-2 rounded-xl">
                        <span className="text-xs font-bold text-blue-900 block font-display">
                          ⬇ DENOMINADOR (4)
                        </span>
                        <span className="text-[11px] text-stone-600">
                          Total de <strong>partes iguais</strong> em que o todo foi dividido.
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-stone-700 font-display bg-stone-100 px-3 py-1 rounded-full">
                    Lê-se: "Três quartos"
                  </span>
                </div>

                {/* Practical Rule for Children */}
                <div className="space-y-3">
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1.5">
                    <span className="text-xs font-bold text-emerald-900 font-display flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Regra de Ouro da Matemática:
                    </span>
                    <p className="text-xs sm:text-sm text-emerald-950">
                      As partes precisam ser sempre de <strong>tamanhos exatamente iguais</strong>! Não vale uma fatia gigante e outra pequenininha.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-100/70 border border-amber-300 rounded-2xl space-y-1">
                    <span className="text-xs font-bold text-amber-950 font-display">
                      No livro "Minha mão é uma régua":
                    </span>
                    <p className="text-xs text-amber-900">
                      Usamos palmos, pés e passos para medir e dividir tecidos, sofás e tapetes em pedaços do mesmo tamanho!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 2: FORMATO PIZZA ===================== */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-amber-950 flex items-center gap-1.5">
                    <PieChart className="w-5 h-5 text-amber-700" />
                    Representação Circular (Pizza / Torta)
                  </h3>
                  <p className="text-xs text-stone-600">
                    O círculo completo representa <strong>1 inteiro</strong>. Cada fatia que corta do centro é uma fração!
                  </p>
                </div>

                {/* Slices selector */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-stone-600 px-1">Fatiar em:</span>
                  {[2, 3, 4, 6, 8].map((den) => (
                    <button
                      key={den}
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setInteractiveDen(den);
                        setInteractiveSelected([0]);
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                        interactiveDen === den
                          ? 'bg-amber-600 text-white'
                          : 'text-stone-700 hover:bg-amber-100'
                      }`}
                    >
                      {den}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pizza Demonstration Stage */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* SVG Pizza */}
                <div className="md:col-span-6 flex flex-col items-center justify-center py-2">
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 drop-shadow-md">
                    <svg viewBox="0 0 200 200" className="w-full h-full select-none">
                      {/* Crust */}
                      <circle cx="100" cy="100" r="95" fill="#d97706" stroke="#b45309" strokeWidth="4" />
                      {/* Cheese */}
                      <circle cx="100" cy="100" r="86" fill="#fef08a" stroke="#f59e0b" strokeWidth="2" />

                      {/* Slices */}
                      {Array.from({ length: interactiveDen }, (_, idx) => {
                        const angle = 360 / interactiveDen;
                        const start = idx * angle - 90;
                        const end = (idx + 1) * angle - 90;
                        const mid = (start + end) / 2;
                        const isSelected = interactiveSelected.includes(idx);

                        const R = 85;
                        const cx = 100;
                        const cy = 100;

                        const radStart = (Math.PI * start) / 180;
                        const radEnd = (Math.PI * end) / 180;
                        const radMid = (Math.PI * mid) / 180;

                        const x1 = cx + R * Math.cos(radStart);
                        const y1 = cy + R * Math.sin(radStart);
                        const x2 = cx + R * Math.cos(radEnd);
                        const y2 = cy + R * Math.sin(radEnd);

                        const largeArc = angle > 180 ? 1 : 0;
                        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        const tx = cx + R * 0.55 * Math.cos(radMid);
                        const ty = cy + R * 0.55 * Math.sin(radMid);
                        const lx = cx + R * 0.75 * Math.cos(radMid);
                        const ly = cy + R * 0.75 * Math.sin(radMid);

                        return (
                          <g
                            key={idx}
                            onClick={() => handleToggleInteractive(idx)}
                            className="cursor-pointer transition-transform hover:scale-102"
                          >
                            <path
                              d={pathData}
                              fill={isSelected ? '#f59e0b' : '#fef9c3'}
                              stroke="#d97706"
                              strokeWidth="2.5"
                            />
                            {isSelected && (
                              <circle cx={tx} cy={ty} r="8" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                            )}
                            <rect
                              x={lx - 10}
                              y={ly - 6}
                              width="20"
                              height="12"
                              rx="3"
                              fill={isSelected ? '#78350f' : '#ffffff'}
                              stroke="#cbd5e1"
                              strokeWidth="0.5"
                            />
                            <text
                              x={lx}
                              y={ly + 3}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fontFamily="monospace"
                              fill={isSelected ? '#ffffff' : '#451a03'}
                            >
                              1/{interactiveDen}
                            </text>
                          </g>
                        );
                      })}

                      <circle cx="100" cy="100" r="10" fill="#b45309" />
                      <circle cx="100" cy="100" r="4" fill="#fde047" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-2 font-handwriting">
                    Toque nas fatias para comer ou devolver!
                  </span>
                </div>

                {/* Explanation Card */}
                <div className="md:col-span-6 space-y-3">
                  <div className="p-4 bg-white border-2 border-amber-300 rounded-2xl shadow-xs space-y-2">
                    <span className="text-xs font-bold text-amber-900 block font-display">
                      Fração que você formou:
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-mono font-bold text-amber-950 bg-amber-100 px-3 py-1 rounded-xl border border-amber-400">
                        {interactiveSelected.length}/{interactiveDen}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-stone-800 block">
                          {getFractionName(interactiveSelected.length, interactiveDen)}
                        </span>
                        <span className="text-xs text-stone-600">
                          {interactiveSelected.length} {interactiveSelected.length === 1 ? 'fatia pintada' : 'fatias pintadas'} de {interactiveDen} no total.
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    💡 <strong>Dica do Quiz:</strong> Quando o Quiz perguntar sobre uma pizza dividida em 4 fatias com 3 comidas, a resposta é <strong>3/4 (três quartos)</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 3: FORMATO RETÂNGULO ===================== */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-amber-950 flex items-center gap-1.5">
                    <Layers className="w-5 h-5 text-amber-700" />
                    Representação Retangular (Barra / Fita Métrica)
                  </h3>
                  <p className="text-xs text-stone-600">
                    O comprimento inteiro representa o <strong>tecido ou toalha</strong>. Dividimos em faixas de mesma largura.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-stone-600 px-1">Dividir em:</span>
                  {[2, 3, 4, 5, 6].map((den) => (
                    <button
                      key={den}
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setInteractiveDen(den);
                        setInteractiveSelected([0, 1]);
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                        interactiveDen === den
                          ? 'bg-amber-600 text-white'
                          : 'text-stone-700 hover:bg-amber-100'
                      }`}
                    >
                      {den}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strip Canvas */}
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-2xl border-2 border-stone-800 bg-stone-100 shadow-md">
                  {/* Ruler marks */}
                  <div className="h-3 bg-amber-200 border-b border-stone-400 flex justify-between px-1 items-end">
                    {Array.from({ length: interactiveDen * 4 + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-px bg-stone-500 ${i % 4 === 0 ? 'h-full bg-stone-800' : 'h-1.5'}`}
                      />
                    ))}
                  </div>

                  {/* Slices */}
                  <div
                    className="grid min-h-[90px] divide-x-2 divide-dashed divide-stone-600/70"
                    style={{
                      gridTemplateColumns: `repeat(${interactiveDen}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: interactiveDen }, (_, idx) => {
                      const isSelected = interactiveSelected.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleInteractive(idx)}
                          className={`p-3 flex flex-col items-center justify-between cursor-pointer transition-colors select-none ${
                            isSelected
                              ? 'bg-amber-300 hover:bg-amber-400 text-amber-950'
                              : 'bg-white hover:bg-amber-50 text-stone-500'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold">#{idx + 1}</span>
                          <span className="text-base font-bold font-mono">
                            1/{interactiveDen}
                          </span>
                          <span className="text-[10px] font-semibold">
                            {isSelected ? '✓ Pintado' : '+ Toque'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-300 text-xs">
                  <span className="font-semibold text-stone-700">
                    Fração representada na fita:
                  </span>
                  <span className="font-bold text-amber-950 text-sm font-mono bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {interactiveSelected.length}/{interactiveDen} ({getFractionName(interactiveSelected.length, interactiveDen)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 4: EQUIVALÊNCIA ===================== */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  O Que São Frações Equivalentes?
                </h3>
                <p className="text-xs text-stone-600">
                  São frações com números diferentes que <strong>representam exatamente o mesmo tamanho</strong>!
                </p>
              </div>

              {/* Equivalence Visual Comparison: 1/2 vs 2/4 vs 4/8 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1/2 Card */}
                <div
                  onClick={() => setEquivChoice('1/2')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-2 ${
                    equivChoice === '1/2'
                      ? 'bg-amber-200/90 border-amber-600 shadow-sm scale-102'
                      : 'bg-white border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <span className="text-2xl font-bold font-mono text-amber-950">1/2</span>
                  <span className="text-xs font-semibold text-stone-700">1 fatia de 2</span>
                  <div className="w-20 h-20 rounded-full border-2 border-amber-600 overflow-hidden relative bg-stone-100">
                    <div className="w-10 h-20 bg-amber-400 absolute left-0 top-0 border-r border-amber-600" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-900">A metade exata</span>
                </div>

                {/* 2/4 Card */}
                <div
                  onClick={() => setEquivChoice('2/4')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-2 ${
                    equivChoice === '2/4'
                      ? 'bg-amber-200/90 border-amber-600 shadow-sm scale-102'
                      : 'bg-white border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <span className="text-2xl font-bold font-mono text-amber-950">2/4</span>
                  <span className="text-xs font-semibold text-stone-700">2 fatias de 4</span>
                  <div className="w-20 h-20 rounded-full border-2 border-amber-600 overflow-hidden relative bg-stone-100">
                    <div className="w-10 h-20 bg-amber-400 absolute left-0 top-0 border-r border-amber-600" />
                    <div className="w-20 h-px bg-amber-600 absolute top-10 left-0" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-900">O mesmo tamanho que 1/2!</span>
                </div>

                {/* 4/8 Card */}
                <div
                  onClick={() => setEquivChoice('4/8')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-2 ${
                    equivChoice === '4/8'
                      ? 'bg-amber-200/90 border-amber-600 shadow-sm scale-102'
                      : 'bg-white border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <span className="text-2xl font-bold font-mono text-amber-950">4/8</span>
                  <span className="text-xs font-semibold text-stone-700">4 fatias de 8</span>
                  <div className="w-20 h-20 rounded-full border-2 border-amber-600 overflow-hidden relative bg-stone-100">
                    <div className="w-10 h-20 bg-amber-400 absolute left-0 top-0 border-r border-amber-600" />
                    <div className="w-20 h-px bg-amber-600 absolute top-10 left-0" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-900">Também é a metade!</span>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm text-stone-800">
                ⭐ <strong>No Quiz:</strong> Se uma pergunta mostrar 2 partes pintadas de 4, a fração pode ser chamada de <strong>2/4</strong> ou de <strong>1/2 (a metade)</strong>! Ambas estão certas!
              </div>
            </div>
          </div>
        )}

        {/* ===================== STEP 5: WARMUP ===================== */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 border-2 border-amber-500 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-white/90 text-amber-900">
                  <Award className="w-5 h-5 text-amber-700" />
                </span>
                <div>
                  <h3 className="text-lg font-bold font-display text-amber-950">
                    Missão de Aquecimento: Prove que você aprendeu!
                  </h3>
                  <p className="text-xs text-amber-950/90">
                    Pinte <strong>2 fatias das 4 disponíveis</strong> para representar <strong>2/4 (a metade)</strong>:
                  </p>
                </div>
              </div>

              {/* Interactive Warmup Slices */}
              <div className="bg-white/95 rounded-2xl p-4 border border-amber-300 space-y-4">
                <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
                  {[0, 1, 2, 3].map((idx) => {
                    const isSelected = warmupSelected.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleWarmup(idx)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer transform active:scale-95 ${
                          isSelected
                            ? 'bg-amber-400 border-amber-600 shadow-xs scale-102 text-amber-950 font-bold'
                            : 'bg-stone-50 border-stone-300 text-stone-600 hover:bg-amber-50 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold">Fatia {idx + 1}</span>
                        <span className="text-sm font-bold font-mono">1/4</span>
                        <span className="text-[10px]">
                          {isSelected ? '✓ Pintada' : '+ Tocar'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Warmup Result Banner */}
                {warmupPassed ? (
                  <div className="p-3 bg-emerald-100 border border-emerald-400 rounded-xl text-emerald-950 flex items-center justify-between gap-2 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold">
                        Excelente! Você pintou 2/4 (a metade)! Você está 100% pronto para o Quiz!
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={onStartQuiz}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Ir Para o Quiz Oficial ➔
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-xs text-stone-500 font-medium">
                    {warmupSelected.length === 0
                      ? 'Clique em 2 fatias acima para praticar!'
                      : `Você selecionou ${warmupSelected.length} de 4 partes. ${
                          warmupSelected.length < 2
                            ? 'Pinte mais 1 fatia!'
                            : 'Desmarque fatias para ficar com apenas 2!'
                        }`}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-200">
        <button
          type="button"
          disabled={currentStep === 0}
          onClick={() => {
            sound.playTap();
            setCurrentStep((prev) => prev - 1);
          }}
          className="px-4 py-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-stone-700 text-xs font-bold font-display flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Passo Anterior</span>
        </button>

        <div className="flex items-center gap-2">
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setCurrentStep((prev) => prev + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-display flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <span>Próximo Passo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartQuiz}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs sm:text-sm font-bold font-display flex items-center gap-2 shadow-md cursor-pointer transition-transform transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-emerald-200" />
              <span>Iniciar os Desafios do Quiz! 🚀</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStartQuiz}
            className="px-3 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 underline cursor-pointer"
          >
            Pular Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
