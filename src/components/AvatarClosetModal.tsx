import React from 'react';
import { X, Sparkles, Lock, Check, Shirt, Palette, Volume2 } from 'lucide-react';
import { AVATAR_ACCESSORIES, SKIN_TONES, AvatarAccessory } from '../types/avatar';
import { HandAvatar } from './HandAvatar';
import { sound, speakPortuguese } from '../utils/sound';

interface AvatarClosetModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
  equippedIds: string[];
  skinToneId: string;
  onToggleAccessory: (id: string) => void;
  onSelectSkinTone: (id: string) => void;
  onEquipAllUnlocked: () => void;
  onUnequipAll: () => void;
}

export const AvatarClosetModal: React.FC<AvatarClosetModalProps> = ({
  isOpen,
  onClose,
  stars,
  equippedIds,
  skinToneId,
  onToggleAccessory,
  onSelectSkinTone,
  onEquipAllUnlocked,
  onUnequipAll,
}) => {
  if (!isOpen) return null;

  const unlockedCount = AVATAR_ACCESSORIES.filter((a) => stars >= a.requiredStars).length;
  const nextToUnlock = AVATAR_ACCESSORIES.find((a) => stars < a.requiredStars);

  const handleSpeakIntro = () => {
    sound.playTap();
    speakPortuguese(
      `Este é o Guarda-Roupa da Mãozinha Régua! Você tem ${stars} estrelas e já desbloqueou ${unlockedCount} acessórios do livro.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl border-4 border-amber-400 p-5 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-amber-200/60 transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-amber-300 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-200 text-amber-900">
                <Shirt className="w-5 h-5 text-amber-800" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-950">
                Guarda-Roupa da Mãozinha Régua
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Personalize o avatar do estudante com acessórios e adesivos conquistados no Quiz e nos desafios!
            </p>
          </div>

          <button
            onClick={handleSpeakIntro}
            title="Ouvir instruções"
            className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 transition-colors cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Live Avatar Display & Skin Picker (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border-2 border-amber-300 p-4 flex flex-col items-center shadow-xs">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider font-display mb-1">
              Visual Atual
            </span>

            {/* Live Interactive Hand Avatar */}
            <div className="p-2 flex items-center justify-center">
              <HandAvatar
                skinToneId={skinToneId}
                equippedIds={equippedIds}
                size="lg"
                interactive={true}
                speechOnTap={true}
              />
            </div>

            <span className="text-xs font-handwriting text-stone-500 text-center mb-3">
              Toque na mãozinha para ouvi-la falar e acenar!
            </span>

            {/* Stars Count & Next Milestone */}
            <div className="w-full bg-amber-100/70 border border-amber-300 rounded-xl p-2.5 mb-3 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                  Total de Estrelas:
                </span>
                <span className="tabular-nums text-sm text-amber-800">{stars} ★</span>
              </div>
              <div className="flex items-center justify-between text-stone-600 text-[11px]">
                <span>Desbloqueados:</span>
                <span className="font-semibold text-stone-800">
                  {unlockedCount} de {AVATAR_ACCESSORIES.length} itens
                </span>
              </div>

              {nextToUnlock && (
                <div className="pt-1 border-t border-amber-200 text-[11px] text-amber-900">
                  <span>Próximo desbloqueio: </span>
                  <strong>{nextToUnlock.name}</strong> ({nextToUnlock.requiredStars - stars} estrelas restantes)
                </div>
              )}
            </div>

            {/* Skin Tone Palette */}
            <div className="w-full">
              <span className="text-xs font-bold text-stone-700 font-display flex items-center gap-1 mb-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-700" />
                Tom da Pele / Luva da Régua:
              </span>
              <div className="grid grid-cols-6 gap-1.5">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      sound.playTap();
                      onSelectSkinTone(tone.id);
                    }}
                    title={tone.label}
                    className={`h-7 rounded-lg border-2 transition-all cursor-pointer ${
                      skinToneId === tone.id
                        ? 'ring-2 ring-amber-500 ring-offset-1 scale-110'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: tone.fill, borderColor: tone.stroke }}
                  />
                ))}
              </div>
            </div>

            {/* Quick Bulk Actions */}
            <div className="w-full flex items-center justify-between gap-2 mt-3 pt-2 border-t border-stone-200 text-xs">
              <button
                onClick={() => {
                  sound.playConfettiPopper();
                  onEquipAllUnlocked();
                }}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                Vestir todos disponíveis
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  onUnequipAll();
                }}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Tirar todos
              </button>
            </div>
          </div>

          {/* Right Column: Accessory Grid & Unlocks (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 font-display uppercase tracking-wider">
                Coleção de Acessórios & Adesivos
              </span>
              <span className="text-xs text-stone-500">
                Toque para colocar ou tirar
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {AVATAR_ACCESSORIES.map((item: AvatarAccessory) => {
                const isUnlocked = stars >= item.requiredStars;
                const isEquipped = equippedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isUnlocked) {
                        sound.playHint();
                        speakPortuguese(
                          `Este acessório precisa de ${item.requiredStars} estrelas. Complete mais desafios no Quiz para desbloquear!`
                        );
                        return;
                      }
                      if (!isEquipped) {
                        sound.playStarEarned();
                      } else {
                        sound.playTap();
                      }
                      onToggleAccessory(item.id);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all select-none cursor-pointer flex items-center justify-between gap-3 ${
                      isUnlocked
                        ? isEquipped
                          ? 'bg-amber-100/90 border-amber-500 shadow-xs'
                          : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                        : 'bg-stone-100/80 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Status / Category Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                        style={{ backgroundColor: isUnlocked ? `${item.color}25` : '#e5e7eb' }}
                      >
                        {isUnlocked ? (
                          <div
                            className="w-4 h-4 rounded-full border-2"
                            style={{ backgroundColor: item.color, borderColor: '#78350f' }}
                          />
                        ) : (
                          <Lock className="w-4 h-4 text-stone-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-sm text-stone-900">
                            {item.name}
                          </h4>
                          {isEquipped && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[10px] font-bold">
                              Vestido
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-1">
                          {item.description}
                        </p>
                        <span className="text-[10px] font-handwriting text-amber-800">
                          {item.bookReference}
                        </span>
                      </div>
                    </div>

                    {/* Right side unlock status */}
                    <div className="text-right shrink-0">
                      {isUnlocked ? (
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                            isEquipped
                              ? 'bg-amber-600 text-white border-amber-700'
                              : 'bg-stone-100 text-stone-400 border-stone-300'
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-3" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                          <Sparkles className="w-3 h-3 text-amber-600 fill-amber-400" />
                          <span>{item.requiredStars} ★</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-handwriting">
            Dica: Ganhe mais estrelas acertando as perguntas no Quiz da Régua!
          </span>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-display font-bold shadow-xs cursor-pointer"
          >
            Pronto! Salvar Visual
          </button>
        </div>
      </div>
    </div>
  );
};
