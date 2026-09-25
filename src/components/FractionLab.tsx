import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Wand2,
  Sparkles,
  Volume2,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { VisualFractionCanvas, VisualType } from './VisualFractionCanvas';
import { FractionDisplay } from './FractionDisplay';
import { sound, speakPortuguese } from '../utils/sound';
import { getFractionName, checkEquivalence } from '../utils/fractionData';

export const FractionLab: React.FC = () => {
  const [visualType, setVisualType] = useState<VisualType>('fabric');
  const [denominator, setDenominator] = useState<number>(4);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 1]);
  const [randomGoal, setRandomGoal] = useState<{ num: number; den: number } | null>(null);
  const [goalFeedback, setGoalFeedback] = useState<string | null>(null);

  const bodyMeasurement =
    visualType === 'gardenPath'
      ? 'passo'
      : visualType === 'checkeredRug'
      ? 'pe'
      : visualType === 'treeTrunk'
      ? 'bracada'
      : 'palmo';

  const handleToggleSegment = (index: number) => {
    let next: number[];
    if (selectedIndices.includes(index)) {
      next = selectedIndices.filter((i) => i !== index);
    } else {
      next = [...selectedIndices, index].sort((a, b) => a - b);
    }
    setSelectedIndices(next);

    // Check if matching random goal
    if (randomGoal) {
      if (next.length === randomGoal.num && denominator === randomGoal.den) {
        sound.playSuccess();
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {
          // ignore
        }
        setGoalFeedback(`Parabéns! Você alcançou o desafio surpresa: ${randomGoal.num}/${randomGoal.den}!`);
        speakPortuguese(`Excelente! Você formou ${randomGoal.num} sobre ${randomGoal.den}!`);
      } else {
        setGoalFeedback(null);
      }
    }
  };

  const handleGenerateRandomGoal = () => {
    sound.playTap();
    const possibleDenominators = [2, 3, 4, 5, 6, 8];
    const targetDen = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
    const targetNum = Math.floor(Math.random() * targetDen) + 1;

    setRandomGoal({ num: targetNum, den: targetDen });
    setDenominator(targetDen);
    setSelectedIndices([]);
    setGoalFeedback(null);

    const goalName = getFractionName(targetNum, targetDen);
    speakPortuguese(`Desafio da menina: represente a fração ${targetNum} sobre ${targetDen}, ou seja, ${goalName}!`);
  };

  const handleFillAll = () => {
    sound.playTap();
    setSelectedIndices(Array.from({ length: denominator }, (_, i) => i));
  };

  const handleFillHalf = () => {
    sound.playTap();
    const half = Math.floor(denominator / 2);
    setSelectedIndices(Array.from({ length: half }, (_, i) => i));
  };

  const handleClear = () => {
    sound.playTap();
    setSelectedIndices([]);
    setGoalFeedback(null);
  };

  const currentNum = selectedIndices.length;
  const equivalenceText = checkEquivalence(currentNum, denominator);

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white/95 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-display">
              Laboratório Interativo Livre
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-950">
              Oficina de Frações da Régua-Mão
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Escolha um objeto do livro "Minha mão é uma régua", reparta em partes iguais e pinte como quiser com feedback visual imediato!
            </p>
          </div>

          <button
            onClick={handleGenerateRandomGoal}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-display font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            Desafio Surpresa da Menina!
          </button>
        </div>

        {/* Surprise Goal Alert */}
        {randomGoal && (
          <div className="mt-4 p-3.5 bg-orange-50 border-2 border-dashed border-orange-400 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-orange-900 uppercase">
                  Meta Surpresa:
                </span>
                <p className="text-sm font-bold text-orange-950">
                  Forme a fração <strong className="text-orange-700 text-base">{randomGoal.num}/{randomGoal.den}</strong> ({getFractionName(randomGoal.num, randomGoal.den)})
                </p>
              </div>
            </div>
            {goalFeedback && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {goalFeedback}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Canvas & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Object Selector */}
          <div className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-4">
            <span className="text-xs font-bold text-amber-900 block mb-2 font-display">
              1. Escolha o Objeto do Livro para Fracionar:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { type: 'fabric', label: 'Tecido do Vestido', desc: 'Palmos da costura' },
                { type: 'measuringTape', label: 'Régua de Palmos', desc: 'Fita da mamãe' },
                { type: 'checkeredRug', label: 'Tapete Xadrez', desc: 'Passos na sala' },
                { type: 'gardenPath', label: 'Trilha do Jardim', desc: 'Passos no jardim' },
                { type: 'treeTrunk', label: 'Tronco da Árvore', desc: 'Braçadas redondas' },
                { type: 'buttons', label: 'Botões do Vestido', desc: 'Conjunto de lã' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    sound.playTap();
                    setVisualType(item.type as VisualType);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    visualType === item.type
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-white border-amber-200 text-stone-700 hover:bg-amber-50'
                  }`}
                >
                  <span className="font-bold text-xs font-display block">{item.label}</span>
                  <span className={`text-[10px] block ${visualType === item.type ? 'text-amber-100' : 'text-stone-500'}`}>
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Denominator Picker */}
          <div className="bg-white border border-amber-300 rounded-2xl p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-stone-800 font-display">
                2. Em quantas partes iguais dividir o todo? (Denominador):
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {denominator} partes
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    sound.playTap();
                    setDenominator(num);
                    setSelectedIndices((prev) => prev.filter((i) => i < num));
                  }}
                  className={`flex-1 min-w-[42px] py-2 rounded-xl text-xs font-bold font-display cursor-pointer transition-colors ${
                    denominator === num
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 border border-amber-300 text-stone-700 hover:bg-amber-100'
                  }`}
                >
                  1/{num}
                  <span className="block text-[10px] opacity-80 font-normal">
                    {num === 2 ? 'Meios' : num === 3 ? 'Terços' : num === 4 ? 'Quartos' : num === 5 ? 'Quintos' : num === 6 ? 'Sextos' : num === 8 ? 'Oitavos' : 'Décimos'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* The Canvas */}
          <VisualFractionCanvas
            denominator={denominator}
            selectedIndices={selectedIndices}
            onToggleSegment={handleToggleSegment}
            visualType={visualType}
            bodyMeasurement={bodyMeasurement}
          />

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleFillHalf}
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-medium cursor-pointer"
              >
                Pintar Metade (1/2)
              </button>
              <button
                onClick={handleFillAll}
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-medium cursor-pointer"
              >
                Pintar Tudo ({denominator}/{denominator})
              </button>
            </div>

            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar Seleção
            </button>
          </div>

          {/* Visual Equivalency Strip Comparison */}
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block font-display">
              Comparador Visual com a Metade (1/2):
            </span>

            {/* Current Fraction Strip Preview */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-600">
                <span>Sua Fração ({currentNum}/{denominator}):</span>
                <span className="font-bold text-amber-900">{Math.round((currentNum / denominator) * 100)}%</span>
              </div>
              <div className="w-full h-5 bg-stone-200 rounded-lg overflow-hidden flex border border-stone-300">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(currentNum / denominator) * 100}%` }}
                />
              </div>
            </div>

            {/* Reference 1/2 Strip */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-600">
                <span>Referência: Metade Exata (1/2):</span>
                <span className="font-bold text-stone-700">50%</span>
              </div>
              <div className="w-full h-5 bg-stone-200 rounded-lg overflow-hidden flex border border-stone-300">
                <div className="bg-emerald-500 h-full w-1/2" />
              </div>
            </div>

            <p className="text-xs text-stone-600 italic">
              {currentNum / denominator === 0.5 ? (
                <strong className="text-emerald-800">
                  ★ Uau! Sua fração {currentNum}/{denominator} tem exatamente o mesmo tamanho que 1/2!
                </strong>
              ) : currentNum / denominator > 0.5 ? (
                <span>
                  Sua fração {currentNum}/{denominator} é <strong>maior</strong> que a metade (1/2).
                </span>
              ) : currentNum > 0 ? (
                <span>
                  Sua fração {currentNum}/{denominator} é <strong>menor</strong> que a metade (1/2).
                </span>
              ) : (
                <span>Toque nas partes para colorir e comparar!</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Column: Mathematical Details Deck (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <FractionDisplay
            numerator={currentNum}
            denominator={denominator}
            size="lg"
          />

          {/* Book connection explanatory card */}
          <div className="bg-white rounded-2xl border border-amber-300/80 p-4 space-y-2.5 shadow-xs">
            <h3 className="font-display font-bold text-amber-950 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Como Funciona a Régua do Corpo?
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              No livro <em>Minha mão é uma régua</em>, a mamãe e a menina descobrem que não precisam de régua de plástico para medir as coisas:
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Palmo:</strong> distância da ponta do dedão à ponta do dedo mindinho da mão aberta.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Pé:</strong> do calcanhar ao dedão, colocando um pé na frente do outro.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Braçada:</strong> braços abertos ao redor de uma árvore grossa.</span>
              </li>
            </ul>
          </div>

          {/* Didactic tip for 3rd graders */}
          <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
            <span className="font-display font-bold uppercase tracking-wider text-amber-900 block">
              Dica Pedagógica do 3º Ano
            </span>
            <p>
              <strong>Numerador (em cima):</strong> quantas partes foram pintadas ou usadas.
            </p>
            <p>
              <strong>Denominador (embaixo):</strong> em quantas partes iguais o inteiro foi repartido.
            </p>
            {equivalenceText && (
              <div className="p-2 bg-white/90 rounded-lg text-amber-900 font-semibold border border-amber-300">
                {equivalenceText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
