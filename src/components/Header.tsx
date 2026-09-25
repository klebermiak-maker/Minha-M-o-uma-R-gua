import React from 'react';
import { Volume2, VolumeX, Sparkles, Award, Shirt } from 'lucide-react';
import { sound } from '../utils/sound';
import { HandAvatar } from './HandAvatar';

interface HeaderProps {
  currentTab: 'story' | 'lab' | 'quiz' | 'guide';
  onSelectTab: (tab: 'story' | 'lab' | 'quiz' | 'guide') => void;
  stars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCertificate: () => void;
  onOpenCloset: () => void;
  equippedIds: string[];
  skinToneId: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  stars,
  soundEnabled,
  onToggleSound,
  onOpenCertificate,
  onOpenCloset,
  equippedIds,
  skinToneId,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('story')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-amber-950 group-hover:text-amber-800 transition-colors">
            Minha Mão é uma Régua
          </span>
          <span className="hidden md:inline ml-2 text-xs text-amber-700/80 font-handwriting">
            · Frações no 3º Ano
          </span>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onSelectTab('story')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'story'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            Aventuras do Livro
          </button>

          <button
            onClick={() => onSelectTab('lab')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'lab'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            Oficina de Frações
          </button>

          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'quiz'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            Quiz da Régua
          </button>

          <button
            onClick={() => onSelectTab('guide')}
            className={`hidden sm:inline-flex px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'guide'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            O Livro & o Corpo
          </button>
        </nav>

        {/* Zone 3: Avatar, Stars & Certificate Actions */}
        <div className="flex items-center gap-2">
          {/* Avatar button */}
          <button
            onClick={onOpenCloset}
            title="Abrir Guarda-Roupa da Mãozinha Régua (Personalizar Avatar)"
            className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 text-amber-950 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-6 h-7 flex items-center justify-center -my-1">
              <HandAvatar
                size="xs"
                skinToneId={skinToneId}
                equippedIds={equippedIds}
                interactive={false}
              />
            </div>
            <span className="hidden md:inline text-xs font-bold font-display group-hover:text-amber-800">
              Avatar
            </span>
            <Shirt className="w-3.5 h-3.5 text-amber-700" />
          </button>

          {/* Stars display */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 border border-amber-300/80 rounded-lg text-amber-900 text-xs sm:text-sm font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
            <span className="tabular-nums">{stars}</span>
            <span className="hidden lg:inline text-amber-700 font-normal text-xs">estrelas</span>
          </div>

          {/* Certificate button */}
          <button
            onClick={onOpenCertificate}
            title="Ver Certificado de Mestre das Frações"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-orange-100 hover:bg-orange-200 border border-orange-300/80 text-orange-900 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Award className="w-4 h-4 text-orange-600" />
            <span className="hidden lg:inline">Certificado</span>
          </button>

          {/* Sound toggle button */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playTap();
            }}
            title={soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-amber-100/80 transition-colors cursor-pointer"
            aria-label="Controle de Som"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-800" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
