import React, { useState } from 'react';
import { Scissors, Footprints, Sparkles, Check, PieChart, Layers, Grid } from 'lucide-react';
import { sound } from '../utils/sound';

export type VisualType = 'fabric' | 'measuringTape' | 'checkeredRug' | 'gardenPath' | 'treeTrunk' | 'buttons';
export type DisplayFormat = 'pizza' | 'bar' | 'grid';

interface VisualFractionCanvasProps {
  denominator: number;
  selectedIndices: number[]; // e.g. [0, 1] means segments 0 and 1 are selected
  onToggleSegment: (index: number) => void;
  visualType?: VisualType;
  bodyMeasurement?: 'palmo' | 'pe' | 'passo' | 'bracada';
  interactive?: boolean;
  initialFormat?: DisplayFormat;
  targetFraction?: { num: number; den: number };
}

export const VisualFractionCanvas: React.FC<VisualFractionCanvasProps> = ({
  denominator,
  selectedIndices,
  onToggleSegment,
  visualType = 'fabric',
  bodyMeasurement = 'palmo',
  interactive = true,
  initialFormat = 'pizza',
  targetFraction,
}) => {
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>(initialFormat);

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
        return `${orderIndex}ª fatia`;
    }
  };

  return (
    <div className="w-full bg-white border-2 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      {/* Top Header: Format Selector (Pizza, Bar, Grid) & Measurement Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
        {/* Format Selector Pills */}
        <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-2xl border border-amber-200">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setDisplayFormat('pizza');
            }}
            className={`px-3 py-1.5 rounded-xl font-display text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayFormat === 'pizza'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-200/50'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>🍕 Formato Pizza</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setDisplayFormat('bar');
            }}
            className={`px-3 py-1.5 rounded-xl font-display text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayFormat === 'bar'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-200/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📏 Formato Barra / Fita</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setDisplayFormat('grid');
            }}
            className={`px-3 py-1.5 rounded-xl font-display text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayFormat === 'grid'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-amber-950 hover:bg-amber-200/50'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>🧱 Formato Grade</span>
          </button>
        </div>

        {/* Live Selection Count Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">Pintadas:</span>
          <span className="px-3 py-1 bg-amber-100 border border-amber-300 rounded-xl text-amber-950 font-display font-bold text-sm tabular-nums">
            {selectedCount} de {denominator} partes ({selectedCount}/{denominator})
          </span>
        </div>
      </div>

      {/* Main Interactive Stage based on Selected Format */}

      {/* 1. PIZZA FORMAT (Circular pie with crust, cheese, and pepperoni/basil toppings) */}
      {displayFormat === 'pizza' && (
        <div className="py-2 flex flex-col items-center justify-center">
          <div className="text-xs text-stone-600 mb-2 font-handwriting text-center flex items-center justify-center gap-1.5">
            <span>🍕 Toque nas fatias da pizza para pintar ou despintar:</span>
          </div>

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 max-w-full drop-shadow-md">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full overflow-visible select-none"
            >
              {/* Outer Pizza Crust & Baking Pan Shadow */}
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="#d97706"
                stroke="#b45309"
                strokeWidth="4"
              />
              {/* Golden Cheese Background */}
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="#fef08a"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              {/* Pizza Slices (Circular Arcs) */}
              {segments.map((idx) => {
                const anglePerSlice = 360 / denominator;
                const startAngle = idx * anglePerSlice - 90;
                const endAngle = (idx + 1) * anglePerSlice - 90;
                const midAngle = (startAngle + endAngle) / 2;

                const isSelected = selectedIndices.includes(idx);
                const orderInSelection = selectedIndices.indexOf(idx) + 1;

                // Radius of slice
                const R = 85;
                const cx = 100;
                const cy = 100;

                const radStart = (Math.PI * startAngle) / 180;
                const radEnd = (Math.PI * endAngle) / 180;
                const radMid = (Math.PI * midAngle) / 180;

                const x1 = cx + R * Math.cos(radStart);
                const y1 = cy + R * Math.sin(radStart);
                const x2 = cx + R * Math.cos(radEnd);
                const y2 = cy + R * Math.sin(radEnd);

                const largeArc = anglePerSlice > 180 ? 1 : 0;
                const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                // Topping positions
                const tx = cx + R * 0.55 * Math.cos(radMid);
                const ty = cy + R * 0.55 * Math.sin(radMid);

                const labelX = cx + R * 0.76 * Math.cos(radMid);
                const labelY = cy + R * 0.76 * Math.sin(radMid);

                return (
                  <g
                    key={idx}
                    onClick={() => handleSegmentClick(idx)}
                    className="cursor-pointer transition-transform duration-150 transform hover:scale-102"
                  >
                    {/* Slice Wedge */}
                    <path
                      d={pathData}
                      fill={isSelected ? '#f59e0b' : '#fef9c3'}
                      stroke="#d97706"
                      strokeWidth="2.5"
                      className="transition-colors duration-200"
                    />

                    {/* Sliced Toppings when selected */}
                    {isSelected && (
                      <g className="animate-in zoom-in-50 duration-150">
                        {/* Pepperoni / Tomato slice */}
                        <circle
                          cx={tx}
                          cy={ty}
                          r="9"
                          fill="#dc2626"
                          stroke="#991b1b"
                          strokeWidth="1.5"
                        />
                        {/* Oregano/herb sprinkles */}
                        <circle cx={tx - 3} cy={ty - 3} r="1.2" fill="#15803d" />
                        <circle cx={tx + 3} cy={ty + 2} r="1.2" fill="#15803d" />
                        <circle cx={tx} cy={ty + 4} r="1" fill="#fef08a" />

                        {/* Checkmark badge */}
                        <circle cx={tx} cy={ty} r="5" fill="#ffffff" />
                        <path
                          d={`M ${tx - 2.5} ${ty} L ${tx - 0.5} ${ty + 2} L ${tx + 3} ${ty - 2}`}
                          stroke="#15803d"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </g>
                    )}

                    {/* Unselected dashed plus placeholder */}
                    {!isSelected && (
                      <g opacity="0.45">
                        <circle cx={tx} cy={ty} r="7" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                        <text
                          x={tx}
                          y={ty + 3}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#94a3b8"
                        >
                          +
                        </text>
                      </g>
                    )}

                    {/* Fraction text inside the slice (e.g. 1/4) */}
                    <rect
                      x={labelX - 11}
                      y={labelY - 7}
                      width="22"
                      height="14"
                      rx="4"
                      fill={isSelected ? '#78350f' : '#ffffff'}
                      opacity={isSelected ? 0.95 : 0.85}
                      stroke={isSelected ? '#fbbf24' : '#cbd5e1'}
                      strokeWidth="0.8"
                    />
                    <text
                      x={labelX}
                      y={labelY + 3.5}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill={isSelected ? '#ffffff' : '#451a03'}
                    >
                      1/{denominator}
                    </text>
                  </g>
                );
              })}

              {/* Pizza Center Cap */}
              <circle cx="100" cy="100" r="10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
              <circle cx="100" cy="100" r="4" fill="#fde047" />
            </svg>
          </div>
        </div>
      )}

      {/* 2. BAR / FABRIC / RULER FORMAT */}
      {displayFormat === 'bar' && (
        <div className="py-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-600 px-1">
            <span className="flex items-center gap-1 font-handwriting text-amber-900">
              <Scissors className="w-3.5 h-3.5 text-amber-700" />
              Régua e Tecido do Livro dividido em {denominator} partes iguais
            </span>
            <span className="font-mono text-[11px] text-stone-500">
              Cada parte = 1/{denominator}
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border-2 border-stone-800 bg-stone-100 shadow-md">
            {/* Top stitch / measuring ruler ticks */}
            <div className="h-3 bg-amber-200 border-b border-stone-400 flex justify-between px-1 items-end">
              {Array.from({ length: denominator * 4 + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-px bg-stone-500 ${i % 4 === 0 ? 'h-full bg-stone-800' : 'h-1.5'}`}
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
                        ? 'bg-amber-300/90 hover:bg-amber-400'
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
                            <div className="p-1 rounded-full bg-amber-100/80 border border-amber-500/50 shadow-xs">
                              <svg
                                className="w-7 h-7 sm:w-8 sm:h-8 text-amber-800"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 1.5a1.2 1.2 0 0 1 1.2 1.2v6.5a.6.6 0 0 0 1.2 0V3.8a1.2 1.2 0 0 1 2.4 0v6.2a.6.6 0 0 0 1.2 0V6a1.2 1.2 0 0 1 2.4 0v6.8c0 4.5-3.5 8.2-8 8.2a8.2 8.2 0 0 1-8-8.2V9.8a1.2 1.2 0 0 1 2.4 0v3.2a.6.6 0 0 0 1.2 0V2.7A1.2 1.2 0 0 1 8.4 1.5a1.2 1.2 0 0 1 1.2 1.2v5a.6.6 0 0 0 1.2 0V2.7A1.2 1.2 0 0 1 12 1.5z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="p-1 rounded-full bg-emerald-100 border border-emerald-500/50 shadow-xs">
                              <Footprints className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-800" />
                            </div>
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

      {/* 3. GRID / BLOCKS FORMAT */}
      {displayFormat === 'grid' && (
        <div className="py-4">
          <div className="text-xs text-stone-600 mb-3 font-handwriting text-center">
            Blocos geométricos do tapete xadrez divididos em {denominator} partes:
          </div>

          <div
            className="grid gap-2.5 max-w-md mx-auto"
            style={{
              gridTemplateColumns:
                denominator <= 4
                  ? `repeat(2, minmax(0, 1fr))`
                  : denominator <= 6
                  ? `repeat(3, minmax(0, 1fr))`
                  : `repeat(4, minmax(0, 1fr))`,
            }}
          >
            {segments.map((idx) => {
              const isSelected = selectedIndices.includes(idx);
              const order = selectedIndices.indexOf(idx) + 1;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSegmentClick(idx)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer transform active:scale-95 ${
                    isSelected
                      ? 'bg-amber-400 border-amber-600 shadow-md scale-102 text-amber-950'
                      : 'bg-stone-50 border-stone-300 hover:border-amber-400 hover:bg-amber-50 text-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold">Bloco #{idx + 1}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-900 stroke-3" />}
                  </div>

                  <div className="text-lg font-bold font-mono">
                    1/{denominator}
                  </div>

                  <span className="text-[10px] opacity-80">
                    {isSelected ? `Pintado (${order}º)` : 'Toque p/ pintar'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Fraction Status Footer Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50 border border-amber-200/90 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-950 font-display">
            Sua Fração Atual:
          </span>
          <span className="font-mono font-bold text-amber-900 text-sm px-2.5 py-0.5 bg-white rounded-lg border border-amber-300 shadow-2xs">
            {selectedCount}/{denominator}
          </span>
          <span className="text-stone-600 hidden sm:inline">
            ({selectedCount} partes pintadas de {denominator} no total)
          </span>
        </div>

        <div className="text-stone-700 font-medium">
          {targetFraction && (
            <span className="bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-md font-bold mr-2">
              Meta: {targetFraction.num}/{targetFraction.den}
            </span>
          )}
          {selectedCount === 0 ? (
            <span className="text-stone-500 italic">Toque nas fatias ou blocos para colorir!</span>
          ) : selectedCount === denominator ? (
            <span className="text-emerald-800 font-bold">★ Todo completo (1 inteiro)!</span>
          ) : selectedCount === denominator / 2 ? (
            <span className="text-emerald-800 font-bold">★ Exatamente a metade ({selectedCount}/{denominator} = 1/2)!</span>
          ) : (
            <span>Representa {Math.round((selectedCount / denominator) * 100)}% do todo</span>
          )}
        </div>
      </div>
    </div>
  );
};
