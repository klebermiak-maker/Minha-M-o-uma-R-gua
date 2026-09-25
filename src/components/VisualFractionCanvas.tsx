import React from 'react';
import { Scissors, Footprints, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/sound';

export type VisualType = 'fabric' | 'measuringTape' | 'checkeredRug' | 'gardenPath' | 'treeTrunk' | 'buttons';

interface VisualFractionCanvasProps {
  denominator: number;
  selectedIndices: number[]; // e.g. [0, 1] means segments 0 and 1 are selected
  onToggleSegment: (index: number) => void;
  visualType?: VisualType;
  bodyMeasurement?: 'palmo' | 'pe' | 'passo' | 'bracada';
  interactive?: boolean;
}

export const VisualFractionCanvas: React.FC<VisualFractionCanvasProps> = ({
  denominator,
  selectedIndices,
  onToggleSegment,
  visualType = 'fabric',
  bodyMeasurement = 'palmo',
  interactive = true,
}) => {
  const segments = Array.from({ length: denominator }, (_, i) => i);
  const selectedCount = selectedIndices.length;

  const handleSegmentClick = (index: number) => {
    if (!interactive) return;
    sound.playTap();
    onToggleSegment(index);
  };

  // Helper labels for body measurement units from the book
  const getMeasurementBadge = (orderIndex: number) => {
    switch (bodyMeasurement) {
      case 'palmo':
        return `${orderIndex}º palmo`;
      case 'pe':
        return `${orderIndex}º pé`;
      case 'passo':
        return `${orderIndex}º passo`;
      case 'bracada':
        return `${orderIndex}ª braçada`;
      default:
        return `${orderIndex}ª parte`;
    }
  };

  return (
    <div className="w-full bg-white/90 border-2 border-amber-300 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Canvas Top Bar: Context from the book and live counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            {bodyMeasurement === 'palmo' && (
              <svg className="w-3.5 h-3.5 text-amber-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm4 2a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1zm4 3a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1zM8 4a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1zM4 9a1 1 0 0 0-1 1v4a7 7 0 0 0 14 0V9a1 1 0 0 0-2 0v5a5 5 0 0 1-10 0v-4a1 1 0 0 0-1-1z"/>
              </svg>
            )}
            {bodyMeasurement === 'passo' && <Footprints className="w-3.5 h-3.5 text-amber-700" />}
            {bodyMeasurement === 'pe' && <Footprints className="w-3.5 h-3.5 text-amber-700" />}
            {bodyMeasurement === 'bracada' && <Sparkles className="w-3.5 h-3.5 text-amber-700" />}
            <span>Medindo com {bodyMeasurement === 'palmo' ? 'Palmos da Mão' : bodyMeasurement === 'pe' ? 'Pés (Calcanhar ao Dedão)' : bodyMeasurement === 'passo' ? 'Passos no Jardim' : 'Braçadas da Árvore'}</span>
          </span>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Toque nas partes para colorir ou apagar
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-stone-700">
          <span>Selecionadas:</span>
          <span className="px-2 py-0.5 bg-amber-100 rounded text-amber-900 font-bold tabular-nums">
            {selectedCount} de {denominator} partes
          </span>
        </div>
      </div>

      {/* Main Interactive Stage based on Visual Type */}
      {visualType === 'treeTrunk' ? (
        /* Circular visual representation for tree circumference (Braçadas) */
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div className="text-xs text-stone-600 mb-2 font-handwriting text-center">
            Abraçando o tronco da grande árvore (página 15 do livro)
          </div>
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-amber-900/30 bg-amber-800/20 p-2 shadow-inner flex items-center justify-center">
            {/* Center tree rings */}
            <div className="absolute inset-8 rounded-full border-4 border-dashed border-amber-800/40 bg-amber-700/30 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-950 font-display">Árvore</span>
            </div>

            {/* Circular sectors */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {segments.map((idx) => {
                const anglePerSegment = 360 / denominator;
                const startAngle = idx * anglePerSegment;
                const endAngle = (idx + 1) * anglePerSegment;
                const isSelected = selectedIndices.includes(idx);

                // Calculate SVG arc path
                const x1 = 50 + 44 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 44 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 44 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 44 * Math.sin((Math.PI * endAngle) / 180);
                const largeArcFlag = anglePerSegment > 180 ? 1 : 0;
                const d = `M 50 50 L ${x1} ${y1} A 44 44 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                return (
                  <path
                    key={idx}
                    d={d}
                    onClick={() => handleSegmentClick(idx)}
                    className={`cursor-pointer transition-all duration-200 stroke-white stroke-2 ${
                      isSelected
                        ? 'fill-amber-400 hover:fill-amber-500'
                        : 'fill-stone-200 hover:fill-amber-100'
                    }`}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      ) : visualType === 'buttons' ? (
        /* Discrete items representation: sewing buttons for the girl's dress */
        <div className="py-6 px-2">
          <div className="text-xs text-stone-600 mb-3 font-handwriting text-center">
            Botões de lã colorida para costurar no vestido da menina (página 9)
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-lg mx-auto">
            {segments.map((idx) => {
              const isSelected = selectedIndices.includes(idx);
              const order = selectedIndices.indexOf(idx) + 1;
              return (
                <button
                  key={idx}
                  onClick={() => handleSegmentClick(idx)}
                  className={`relative p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95 ${
                    isSelected
                      ? 'bg-amber-400 border-amber-600 shadow-md scale-105'
                      : 'bg-stone-50 border-dashed border-stone-300 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-inner ${
                      isSelected
                        ? 'bg-amber-100 border-amber-700 text-amber-900'
                        : 'bg-white border-stone-300 text-stone-400'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1.5 p-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold font-display text-stone-700">
                    {isSelected ? `Botão ${order}` : `Parte ${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Linear Strip representation (Fabric, Tape, Rug, Garden) */
        <div className="py-4">
          {/* Visual contextual decoration */}
          <div className="flex items-center justify-between text-xs text-stone-600 mb-2 px-1">
            <span className="flex items-center gap-1 font-handwriting text-amber-900">
              <Scissors className="w-3.5 h-3.5 text-amber-700" />
              {visualType === 'fabric' && 'Rolo de tecido do vestido da mamãe'}
              {visualType === 'measuringTape' && 'Fita de medição com palmos da mamãe'}
              {visualType === 'checkeredRug' && 'Tapete xadrez da sala (página 14)'}
              {visualType === 'gardenPath' && 'Trilha de passos do jardim de flores (página 11)'}
            </span>
            <span className="font-mono text-[11px] text-stone-500">
              Todo dividido em {denominator} partes iguais
            </span>
          </div>

          {/* The fraction strip */}
          <div className="relative overflow-hidden rounded-xl border-2 border-stone-800 bg-stone-100 shadow-md">
            {/* Top stitch / measuring ruler ticks */}
            <div className="h-2 bg-amber-200 border-b border-stone-400 flex justify-between px-1">
              {Array.from({ length: denominator * 4 + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-px bg-stone-500 ${i % 4 === 0 ? 'h-full bg-stone-800' : 'h-1'}`}
                />
              ))}
            </div>

            {/* Segments grid */}
            <div
              className="grid min-h-[110px] sm:min-h-[130px] divide-x-2 divide-dashed divide-stone-600/70"
              style={{
                gridTemplateColumns: `repeat(${denominator}, minmax(0, 1fr))`,
              }}
            >
              {segments.map((idx) => {
                const isSelected = selectedIndices.includes(idx);
                const orderInSelection = selectedIndices.indexOf(idx) + 1;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSegmentClick(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSegmentClick(idx);
                      }
                    }}
                    className={`relative p-2 flex flex-col items-center justify-between transition-all select-none cursor-pointer group ${
                      isSelected
                        ? visualType === 'checkeredRug'
                          ? idx % 2 === 0
                            ? 'bg-amber-300'
                            : 'bg-emerald-300'
                          : visualType === 'gardenPath'
                          ? 'bg-emerald-200/90'
                          : 'bg-amber-300/90 hover:bg-amber-400'
                        : 'bg-stone-50/90 hover:bg-amber-100/60'
                    }`}
                  >
                    {/* Top segment index indicator */}
                    <div className="w-full flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-mono font-medium">#{idx + 1}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5 stroke-3" />
                        </span>
                      )}
                    </div>

                    {/* Middle: Body Measurement visual icon */}
                    <div className="my-auto flex flex-col items-center justify-center">
                      {isSelected ? (
                        <div className="flex flex-col items-center transform scale-100 animate-in fade-in zoom-in-95 duration-150">
                          {bodyMeasurement === 'palmo' ? (
                            /* Hand icon (Palmo) open from thumb to pinky */
                            <div className="p-1 rounded-full bg-amber-100/80 border border-amber-500/50 shadow-xs">
                              <svg
                                className="w-7 h-7 sm:w-8 sm:h-8 text-amber-800"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 1.5a1.2 1.2 0 0 1 1.2 1.2v6.5a.6.6 0 0 0 1.2 0V3.8a1.2 1.2 0 0 1 2.4 0v6.2a.6.6 0 0 0 1.2 0V6a1.2 1.2 0 0 1 2.4 0v6.8c0 4.5-3.5 8.2-8 8.2a8.2 8.2 0 0 1-8-8.2V9.8a1.2 1.2 0 0 1 2.4 0v3.2a.6.6 0 0 0 1.2 0V2.7A1.2 1.2 0 0 1 8.4 1.5a1.2 1.2 0 0 1 1.2 1.2v5a.6.6 0 0 0 1.2 0V2.7A1.2 1.2 0 0 1 12 1.5z" />
                              </svg>
                            </div>
                          ) : bodyMeasurement === 'passo' || bodyMeasurement === 'pe' ? (
                            /* Footprints */
                            <div className="p-1 rounded-full bg-emerald-100 border border-emerald-500/50 shadow-xs">
                              <Footprints className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-800" />
                            </div>
                          ) : (
                            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-amber-700" />
                          )}
                          <span className="mt-1 text-[11px] font-bold font-display text-amber-950 bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
                            {getMeasurementBadge(orderInSelection)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center opacity-40 group-hover:opacity-80 transition-opacity">
                          <span className="text-xl text-stone-400 font-light">+</span>
                          <span className="text-[10px] text-stone-500">toque</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom fraction unit label (e.g. 1/4) */}
                    <div className="w-full text-center border-t border-stone-300/80 pt-1">
                      <span className="text-[10px] sm:text-xs font-mono font-semibold text-stone-700 bg-white/70 px-1.5 py-0.5 rounded">
                        1/{denominator}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Immediate Visual Feedback text ribbon */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50 border border-amber-200/90 rounded-xl px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-amber-950 font-display">
            Fração Atual:
          </span>
          <span className="font-mono font-bold text-amber-800 text-sm px-1.5 py-0.5 bg-white rounded border border-amber-300">
            {selectedCount}/{denominator}
          </span>
          <span className="text-stone-600 hidden sm:inline">
            ({selectedCount} de {denominator} partes do todo)
          </span>
        </div>

        <div className="text-stone-600 text-xs font-medium">
          {selectedCount === 0 ? (
            <span className="text-stone-500 italic">Nenhuma parte pintada ainda.</span>
          ) : selectedCount === denominator ? (
            <span className="text-emerald-700 font-semibold">★ Todo completo (1 inteiro)!</span>
          ) : selectedCount === denominator / 2 ? (
            <span className="text-amber-800 font-semibold">★ Exatamente a metade ({selectedCount}/{denominator} = 1/2)!</span>
          ) : (
            <span>Você cobriu {Math.round((selectedCount / denominator) * 100)}% do todo</span>
          )}
        </div>
      </div>
    </div>
  );
};
