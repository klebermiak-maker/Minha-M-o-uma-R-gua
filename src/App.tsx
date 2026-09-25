/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { StoryMode } from './components/StoryMode';
import { FractionLab } from './components/FractionLab';
import { QuizMode } from './components/QuizMode';
import { BookGuide } from './components/BookGuide';
import { CertificateModal } from './components/CertificateModal';
import { AvatarClosetModal } from './components/AvatarClosetModal';
import { HandAvatar } from './components/HandAvatar';
import { sound } from './utils/sound';
import { BookOpen, Sparkles, Wand2, HelpCircle, Shirt } from 'lucide-react';
import { AVATAR_ACCESSORIES } from './types/avatar';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'story' | 'lab' | 'quiz' | 'guide'>('story');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [stars, setStars] = useState<number>(3); // Initial encouragement stars
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isClosetOpen, setIsClosetOpen] = useState<boolean>(false);

  // Avatar Customization State
  const [equippedIds, setEquippedIds] = useState<string[]>([
    'sticker_flower',
    'wrist_ribbon',
    'ring_button',
  ]);
  const [skinToneId, setSkinToneId] = useState<string>('warm_yellow');

  const handleToggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
  };

  const handleCompleteLevel = (levelId: number) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels((prev) => [...prev, levelId]);
      setStars((prev) => prev + 3);
    }
  };

  const handleAddStar = () => {
    setStars((prev) => prev + 1);
  };

  const handleAddBonusStars = (amount: number) => {
    setStars((prev) => prev + amount);
  };

  const handleToggleAccessory = (id: string) => {
    setEquippedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEquipAllUnlocked = () => {
    const unlockedIds = AVATAR_ACCESSORIES.filter((a) => stars >= a.requiredStars).map((a) => a.id);
    setEquippedIds(unlockedIds);
  };

  const handleUnequipAll = () => {
    setEquippedIds([]);
  };

  const unlockedAccessoriesCount = AVATAR_ACCESSORIES.filter((a) => stars >= a.requiredStars).length;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-800">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          sound.playTap();
          setCurrentTab(tab);
        }}
        stars={stars}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenCertificate={() => {
          sound.playTap();
          setIsCertificateOpen(true);
        }}
        onOpenCloset={() => {
          sound.playTap();
          setIsClosetOpen(true);
        }}
        equippedIds={equippedIds}
        skinToneId={skinToneId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Playful Welcome Banner for 3rd Graders */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 border-2 border-amber-500 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 border border-amber-400/80 text-amber-950 text-xs font-bold font-display shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
                Matemática Divertida · Ensino Fundamental 1 (3º Ano)
              </div>
              <h1 className="text-xl sm:text-3xl font-bold font-display text-amber-950 tracking-tight">
                Aprenda Frações com o Livro "Minha Mão é uma Régua"!
              </h1>
              <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed font-medium">
                Descubra como palmos, pés, passos e braçadas se transformam em frações do dia a dia (metade, terça parte, quartos e muito mais) com feedback visual imediato!
              </p>
            </div>

            {/* Avatar Preview Card & Quick Jump Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
              {/* Interactive Mini Avatar Card */}
              <div
                onClick={() => {
                  sound.playTap();
                  setIsClosetOpen(true);
                }}
                className="flex items-center gap-2.5 bg-white/90 hover:bg-white border-2 border-amber-500/80 p-2.5 rounded-2xl shadow-xs transition-all cursor-pointer hover:scale-102 group shrink-0"
                title="Abrir o Guarda-Roupa para personalizar seu avatar!"
              >
                <div className="w-11 h-13 flex items-center justify-center -my-1">
                  <HandAvatar
                    size="sm"
                    skinToneId={skinToneId}
                    equippedIds={equippedIds}
                    interactive={false}
                  />
                </div>
                <div className="text-left pr-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold font-display text-amber-950 group-hover:text-amber-700">
                      Mãozinha Régua
                    </span>
                    <Shirt className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-[11px] text-stone-600 block">
                    {unlockedAccessoriesCount}/{AVATAR_ACCESSORIES.length} itens do livro
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold underline">
                    Personalizar Avatar →
                  </span>
                </div>
              </div>

              {/* Mode Buttons */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    sound.playTap();
                    setCurrentTab('story');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    currentTab === 'story'
                      ? 'bg-amber-800 text-white'
                      : 'bg-white/90 hover:bg-white text-stone-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  10 Fases do Livro
                </button>

                <button
                  onClick={() => {
                    sound.playTap();
                    setCurrentTab('quiz');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    currentTab === 'quiz'
                      ? 'bg-amber-800 text-white'
                      : 'bg-white/90 hover:bg-white text-stone-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                  Quiz das Frações
                </button>
              </div>
            </div>
          </div>

          {/* Decorative background stitches */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border-8 border-white/20 pointer-events-none" />
          <div className="absolute right-20 -top-10 w-24 h-24 rounded-full border-4 border-dashed border-amber-600/20 pointer-events-none" />
        </div>

        {/* Tab View Router */}
        {currentTab === 'story' && (
          <StoryMode
            currentLevelIndex={currentLevelIndex}
            completedLevels={completedLevels}
            onCompleteLevel={handleCompleteLevel}
            onSelectLevelIndex={setCurrentLevelIndex}
          />
        )}

        {currentTab === 'lab' && <FractionLab />}

        {currentTab === 'quiz' && (
          <QuizMode
            stars={stars}
            onAddStar={handleAddStar}
            onAddBonusStars={handleAddBonusStars}
            equippedIds={equippedIds}
            skinToneId={skinToneId}
            onOpenCloset={() => {
              sound.playTap();
              setIsClosetOpen(true);
            }}
          />
        )}

        {currentTab === 'guide' && <BookGuide />}
      </main>

      {/* Hand Avatar Closet / Wardrobe Customizer Modal */}
      <AvatarClosetModal
        isOpen={isClosetOpen}
        onClose={() => setIsClosetOpen(false)}
        stars={stars}
        equippedIds={equippedIds}
        skinToneId={skinToneId}
        onToggleAccessory={handleToggleAccessory}
        onSelectSkinTone={setSkinToneId}
        onEquipAllUnlocked={handleEquipAllUnlocked}
        onUnequipAll={handleUnequipAll}
      />

      {/* Diploma / Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        stars={stars}
        completedLevelsCount={completedLevels.length}
        equippedIds={equippedIds}
        skinToneId={skinToneId}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-amber-200/80 bg-white/70 py-6 px-4 text-xs text-stone-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-stone-800 font-display">
              Minha Mão é uma Régua · Jogo Pedagógico de Frações
            </p>
            <p className="text-[11px] text-stone-500">
              Baseado na obra de Kim Seong-Eun e Oh Seung-Min (Callis Editora, Coleção Tan Tan).
            </p>
          </div>

          <div className="flex items-center gap-4 text-stone-500 text-[11px]">
            <span>BNCC: EF03MA08 / EF03MA09</span>
            <span>·</span>
            <span>Ensino Fundamental 1 (3º Ano)</span>
            <span>·</span>
            <button
              onClick={() => {
                sound.playTap();
                setCurrentTab('guide');
              }}
              className="text-amber-700 hover:underline cursor-pointer flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3 h-3" />
              Guia Pedagógico
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
