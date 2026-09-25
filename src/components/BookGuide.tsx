import React from 'react';
import { BookOpen, Hand, Footprints, Sparkles, Volume2, Heart } from 'lucide-react';
import { sound, speakPortuguese } from '../utils/sound';

export const BookGuide: React.FC = () => {
  const handleReadSection = (title: string, desc: string) => {
    sound.playTap();
    speakPortuguese(`${title}. ${desc}`);
  };

  const bodyUnits = [
    {
      title: 'O Palmo (Régua da Mão)',
      icon: Hand,
      desc: 'O espaço aberto entre a ponta do polegar e a ponta do dedo mindinho da mão aberta. A mamãe usou para medir os ombros, os braços e o tecido do vestido da menina!',
      fractionContext: 'Uma mesa de 4 palmos dividida ao meio tem 2 palmos (1/2 da mesa).',
      badge: 'Unidade de Comprimento',
    },
    {
      title: 'O Pé (Calcanhar ao Dedão)',
      icon: Footprints,
      desc: 'Medida feita caminhando colocando um pé direito bem na frente do esquerdo, do calcanhar à ponta do dedão. A menina mediu o sofá da sala e a distância até o quarto!',
      fractionContext: 'Se um sofá tem 6 pés, 3 pés representam 3/6 (a metade) do sofá.',
      badge: 'Unidade de Distância Curta',
    },
    {
      title: 'O Passo (Passadas no Jardim)',
      icon: Footprints,
      desc: 'A distância de um passo comum ao caminhar. O jardim da menina media 10 passos por 15 passos. Ótimo para medir distâncias maiores no chão.',
      fractionContext: 'Caminhar 2 de 5 passos da trilha de flores é percorrer 2/5 do jardim.',
      badge: 'Unidade de Distância Longa',
    },
    {
      title: 'A Braçada & A Braça',
      icon: Sparkles,
      desc: 'Uma braçada é a medida obtida quando esticamos os dois braços na altura dos ombros ou abraçamos algo bem grosso, como o tronco de uma árvore grande no parque!',
      fractionContext: 'São 4 braçadas para dar a volta no tronco da árvore; 1 braçada equivale a 1/4 da árvore.',
      badge: 'Unidade de Circunferência',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Book Presentation Banner */}
      <div className="bg-white/95 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-36 sm:w-44 aspect-3/4 rounded-xl overflow-hidden border-2 border-amber-400 bg-amber-100 shadow-md shrink-0">
            <img
              src="/src/assets/images/hero_girl_measuring_1790319804200.jpg"
              alt="Capa do livro Minha mão é uma régua"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-display">
                Coleção Tan Tan · Callis Editora
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-950">
              Minha mão é uma régua
            </h2>
            <p className="text-xs text-amber-800 font-semibold font-handwriting">
              Texto de Kim Seong-Eun · Ilustrações de Oh Seung-Min
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-1">
              Este livro conta a história de uma menina muito esperta que está crescendo depressa. Quando suas roupas começam a ficar curtas, sua mãe planeja fazer um vestido novo de lã amarela. Como não têm régua por perto, a mãe usa sua própria mão para medir a largura dos ombros e dos braços. Assim, a menina descobre que o nosso corpo pode ser uma régua mágica para medir o mundo e repartir coisas em frações iguais!
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Body Units from the Book */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-bold font-display text-amber-950 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-700" />
          As Réguas do Nosso Corpo no Livro
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bodyUnits.map((unit, idx) => {
            const Icon = unit.icon;
            return (
              <div
                key={idx}
                className="bg-white border-2 border-amber-200/90 hover:border-amber-400 rounded-2xl p-4 shadow-xs space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-amber-950">
                        {unit.title}
                      </h4>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        {unit.badge}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReadSection(unit.title, unit.desc)}
                    title="Ouvir explicação"
                    className="p-1.5 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {unit.desc}
                </p>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                  <strong className="text-amber-900 block mb-0.5">Frações com esta medida:</strong>
                  {unit.fractionContext}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Didactic Teacher/Parent Guide (from Page 20 of the book) */}
      <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-300" />
          <h3 className="font-display font-bold text-amber-950 text-base">
            Guia para Pais e Professores do 3º Ano do Ensino Fundamental
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          No 3º ano do Ensino Fundamental 1, a aprendizagem de frações parte de situações concretas e intuitivas de partilha (metade, terça parte, quarta parte, etc.) e da percepção do todo contínuo e discreto (BNCC: <strong>EF03MA08</strong> e <strong>EF03MA09</strong>).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-stone-700">
          <div className="p-3 bg-white/90 rounded-xl border border-amber-200">
            <strong className="block text-amber-900 font-display mb-1">1. Partes Iguais</strong>
            Todas as partes divididas de uma fração precisam ter exatamente o mesmo tamanho.
          </div>
          <div className="p-3 bg-white/90 rounded-xl border border-amber-200">
            <strong className="block text-amber-900 font-display mb-1">2. Denominador</strong>
            O número de baixo indica em quantas partes o todo foi repartido.
          </div>
          <div className="p-3 bg-white/90 rounded-xl border border-amber-200">
            <strong className="block text-amber-900 font-display mb-1">3. Numerador</strong>
            O número de cima conta quantas partes foram coloridas, medidas ou utilizadas.
          </div>
        </div>
      </div>
    </div>
  );
};
