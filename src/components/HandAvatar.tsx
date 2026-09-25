import React, { useState, useEffect } from 'react';
import { SKIN_TONES } from '../types/avatar';
import { sound, speakPortuguese } from '../utils/sound';

interface HandAvatarProps {
  skinToneId?: string;
  equippedIds?: string[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isWaving?: boolean;
  interactive?: boolean;
  speechOnTap?: boolean;
  className?: string;
}

export const HandAvatar: React.FC<HandAvatarProps> = ({
  skinToneId = 'warm_yellow',
  equippedIds = [],
  size = 'md',
  isWaving: forceWaving = false,
  interactive = false,
  speechOnTap = false,
  className = '',
}) => {
  const [isWaving, setIsWaving] = useState(forceWaving);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setIsWaving(forceWaving);
  }, [forceWaving]);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  const skin = SKIN_TONES.find((s) => s.id === skinToneId) || SKIN_TONES[0];

  const sizeClasses = {
    xs: 'w-8 h-9',
    sm: 'w-14 h-16',
    md: 'w-28 h-32',
    lg: 'w-44 h-52',
    xl: 'w-60 h-72',
  }[size];

  const hasItem = (id: string) => equippedIds.includes(id);

  const handleClick = () => {
    if (!interactive) return;
    sound.playTap();
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1400);

    if (speechOnTap) {
      const phrases = [
        'Olá! Eu sou a Mãozinha Régua! Cada palmo conta uma fração!',
        'Vamos medir mais coisas juntos? O seu progresso está incrível!',
        'Três palmos de quatro é igual a três quartos! Que legal!',
        'Adorei meus novos acessórios do livro!',
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      speakPortuguese(randomPhrase);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none flex items-center justify-center transition-transform ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${sizeClasses} ${className}`}
      title={interactive ? 'Toque na Mãozinha Régua para interagir!' : undefined}
    >
      <svg
        viewBox="0 0 220 260"
        className={`w-full h-full overflow-visible drop-shadow-sm transition-all duration-300 ${
          isWaving ? 'animate-bounce' : ''
        }`}
      >
        {/* Layer 0: Wings (behind the hand) */}
        {hasItem('wings_fairy') && (
          <g id="fairy-wings" className="opacity-90 animate-pulse">
            {/* Left Wing */}
            <path
              d="M 50 120 C 10 70, 0 120, 15 160 C 25 180, 50 170, 60 145 Z"
              fill="#c084fc"
              fillOpacity="0.45"
              stroke="#9333ea"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            {/* Right Wing */}
            <path
              d="M 170 120 C 210 70, 220 120, 205 160 C 195 180, 170 170, 160 145 Z"
              fill="#c084fc"
              fillOpacity="0.45"
              stroke="#9333ea"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            {/* Wing sparkles */}
            <circle cx="25" cy="115" r="3" fill="#fef08a" />
            <circle cx="195" cy="115" r="3" fill="#fef08a" />
          </g>
        )}

        {/* Layer 1: Hand Outline with Palm & 5 Fingers */}
        <g id="hand-body">
          {/* Main Hand Base: Wrist & Palm & 5 Fingers */}
          {/* Thumb on left, 4 fingers on top */}
          <path
            d="
              M 80 230
              L 80 180
              C 65 175, 45 160, 32 145
              C 22 133, 24 116, 38 112
              C 48 109, 58 118, 68 132
              L 74 95
              C 74 72, 92 72, 92 95
              L 94 130
              L 97 60
              C 97 36, 117 36, 117 60
              L 119 125
              L 123 75
              C 123 52, 143 52, 143 75
              L 145 130
              L 150 110
              C 150 90, 168 90, 168 110
              C 168 135, 160 170, 150 185
              L 145 230
              Z
            "
            fill={skin.fill}
            stroke={skin.stroke}
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Crease marks and finger joints */}
          <path d="M 82 100 Q 86 98 90 100" stroke={skin.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 104 68 Q 110 66 116 68" stroke={skin.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 129 82 Q 135 80 141 82" stroke={skin.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 155 118 Q 160 116 165 118" stroke={skin.stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Palm ruler tick marks (Fraction Ruler on the palm) */}
          <g id="palm-ruler" opacity="0.75">
            <line x1="90" y1="195" x2="135" y2="195" stroke={skin.stroke} strokeWidth="2" strokeDasharray="3 3" />
            <line x1="92" y1="190" x2="92" y2="200" stroke={skin.stroke} strokeWidth="2" />
            <line x1="112" y1="188" x2="112" y2="202" stroke={skin.stroke} strokeWidth="2.5" />
            <line x1="135" y1="190" x2="135" y2="200" stroke={skin.stroke} strokeWidth="2" />
            <text x="112" y="210" textAnchor="middle" fontSize="7" fontWeight="bold" fill={skin.stroke} fontFamily="sans-serif">
              1/2
            </text>
          </g>

          {/* Cute Face in the Center of Palm */}
          <g id="face">
            {/* Rosy Cheeks */}
            <circle cx="92" cy="162" r="7" fill="#fca5a5" opacity="0.8" />
            <circle cx="132" cy="162" r="7" fill="#fca5a5" opacity="0.8" />

            {/* Eyes */}
            {isBlinking ? (
              <>
                <path d="M 94 153 Q 101 158 108 153" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 116 153 Q 123 158 130 153" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                {/* Left Eye */}
                <ellipse cx="101" cy="151" rx="5.5" ry="6.5" fill="#1c1917" />
                <circle cx="99.5" cy="148.5" r="2.2" fill="#ffffff" />
                <circle cx="103" cy="153" r="1.1" fill="#ffffff" />

                {/* Right Eye */}
                <ellipse cx="123" cy="151" rx="5.5" ry="6.5" fill="#1c1917" />
                <circle cx="121.5" cy="148.5" r="2.2" fill="#ffffff" />
                <circle cx="125" cy="153" r="1.1" fill="#ffffff" />
              </>
            )}

            {/* Happy Smile */}
            <path
              d="M 104 163 Q 112 173 120 163"
              fill="none"
              stroke="#b91c1c"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Layer 2: Ring (on pinky finger ~ x=159, y=128) */}
        {hasItem('ring_button') && (
          <g id="accessory-ring">
            {/* Ring Band */}
            <ellipse cx="159" cy="130" rx="8" ry="4" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            {/* Red Button */}
            <circle cx="159" cy="126" r="6.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
            {/* 4 button holes */}
            <circle cx="157" cy="124" r="0.9" fill="#450a0a" />
            <circle cx="161" cy="124" r="0.9" fill="#450a0a" />
            <circle cx="157" cy="128" r="0.9" fill="#450a0a" />
            <circle cx="161" cy="128" r="0.9" fill="#450a0a" />
          </g>
        )}

        {/* Layer 3: Glasses (Detective frames) */}
        {hasItem('glasses_detective') && (
          <g id="accessory-glasses">
            {/* Bridge */}
            <line x1="107" y1="151" x2="117" y2="151" stroke="#2563eb" strokeWidth="3" />
            {/* Left Lens Frame */}
            <circle cx="101" cy="151" r="11" fill="#60a5fa" fillOpacity="0.25" stroke="#1d4ed8" strokeWidth="3.5" />
            <line x1="94" y1="147" x2="98" y2="143" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right Lens Frame */}
            <circle cx="123" cy="151" r="11" fill="#60a5fa" fillOpacity="0.25" stroke="#1d4ed8" strokeWidth="3.5" />
            <line x1="116" y1="147" x2="120" y2="143" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Temples */}
            <line x1="90" y1="151" x2="82" y2="152" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
            <line x1="134" y1="151" x2="142" y2="152" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* Layer 4: Stickers on Palm/Thumb */}
        {/* Flower Sticker on Thumb joint */}
        {hasItem('sticker_flower') && (
          <g id="sticker-flower" transform="translate(48, 142)">
            {/* Petals */}
            <circle cx="-5" cy="0" r="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="5" cy="0" r="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="0" cy="-5" r="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="0" cy="5" r="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            {/* Center */}
            <circle cx="0" cy="0" r="3.5" fill="#f97316" />
          </g>
        )}

        {/* Ladybug Sticker on Palm side */}
        {hasItem('sticker_ladybug') && (
          <g id="sticker-ladybug" transform="translate(138, 172)">
            {/* Body */}
            <ellipse cx="0" cy="0" rx="6" ry="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
            {/* Head */}
            <circle cx="0" cy="-6" r="3.2" fill="#1c1917" />
            {/* Center Line */}
            <line x1="0" y1="-3" x2="0" y2="7" stroke="#1c1917" strokeWidth="1" />
            {/* Spots */}
            <circle cx="-2.5" cy="-1" r="1.1" fill="#1c1917" />
            <circle cx="2.5" cy="-1" r="1.1" fill="#1c1917" />
            <circle cx="-2.5" cy="4" r="1.1" fill="#1c1917" />
            <circle cx="2.5" cy="4" r="1.1" fill="#1c1917" />
          </g>
        )}

        {/* Layer 5: Wrist Accessories */}
        {/* Ribbon / Bow on wrist */}
        {hasItem('wrist_ribbon') && (
          <g id="accessory-wrist-ribbon">
            <rect x="76" y="215" width="72" height="10" rx="3" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
            {/* Knot & Bow */}
            <circle cx="112" cy="220" r="5" fill="#ea580c" />
            <path d="M 112 220 Q 98 210 102 226 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" />
            <path d="M 112 220 Q 126 210 122 226 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" />
          </g>
        )}

        {/* Fraction Tape Ruler Bracelet */}
        {hasItem('wrist_ruler') && (
          <g id="accessory-wrist-ruler">
            <rect x="76" y="222" width="72" height="12" rx="3" fill="#fde047" stroke="#854d0e" strokeWidth="2.5" />
            {/* Tick marks */}
            <line x1="86" y1="222" x2="86" y2="234" stroke="#854d0e" strokeWidth="2" />
            <line x1="98" y1="222" x2="98" y2="230" stroke="#854d0e" strokeWidth="1.5" />
            <line x1="112" y1="222" x2="112" y2="234" stroke="#854d0e" strokeWidth="2.5" />
            <line x1="126" y1="222" x2="126" y2="230" stroke="#854d0e" strokeWidth="1.5" />
            <line x1="138" y1="222" x2="138" y2="234" stroke="#854d0e" strokeWidth="2" />
            <text x="112" y="232" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#854d0e">
              RÉGUA
            </text>
          </g>
        )}

        {/* Layer 6: Hats / Head Accessories (on middle finger tips) */}
        {/* Pigtail Ribbon Bows */}
        {hasItem('hat_bow') && (
          <g id="accessory-hat-bow">
            {/* Left Bow on index tip */}
            <g transform="translate(83, 76)">
              <circle cx="0" cy="0" r="3.5" fill="#db2777" />
              <path d="M 0 0 C -10 -8, -12 8, 0 0 Z" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
              <path d="M 0 0 C 10 -8, 12 8, 0 0 Z" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
            </g>
            {/* Right Bow on ring tip */}
            <g transform="translate(133, 56)">
              <circle cx="0" cy="0" r="3.5" fill="#db2777" />
              <path d="M 0 0 C -10 -8, -12 8, 0 0 Z" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
              <path d="M 0 0 C 10 -8, 12 8, 0 0 Z" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {/* Royal Crown on middle finger */}
        {hasItem('hat_crown') && (
          <g id="accessory-crown" transform="translate(107, 24)">
            {/* Crown Base */}
            <path
              d="
                M -22 18
                L -20 2
                L -10 10
                L 0 -5
                L 10 10
                L 20 2
                L 22 18
                Z
              "
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Crown Jewels */}
            <circle cx="-20" cy="1" r="2.5" fill="#ef4444" />
            <circle cx="0" cy="-6" r="3" fill="#3b82f6" />
            <circle cx="20" cy="1" r="2.5" fill="#10b981" />
            {/* Band band jewels */}
            <circle cx="-10" cy="14" r="1.8" fill="#ffffff" />
            <circle cx="0" cy="14" r="2" fill="#ef4444" />
            <circle cx="10" cy="14" r="1.8" fill="#ffffff" />
          </g>
        )}

        {/* Layer 7: Held Item (Golden Ruler Wand) */}
        {hasItem('held_ruler') && (
          <g id="accessory-held-ruler" transform="translate(32, 85) rotate(-22)">
            {/* Wand shaft (wooden ruler) */}
            <rect x="-4" y="-30" width="8" height="95" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            {/* Ruler increments */}
            <line x1="-4" y1="-20" x2="2" y2="-20" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="-4" y1="-10" x2="4" y2="-10" stroke="#ca8a04" strokeWidth="2" />
            <line x1="-4" y1="0" x2="2" y2="0" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="-4" y1="10" x2="4" y2="10" stroke="#ca8a04" strokeWidth="2" />
            <line x1="-4" y1="20" x2="2" y2="20" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="-4" y1="30" x2="4" y2="30" stroke="#ca8a04" strokeWidth="2" />
            {/* Star Topper */}
            <path
              d="M 0 -36 L 2.5 -31 L 8 -30 L 4 -26 L 5.5 -20 L 0 -23 L -5.5 -20 L -4 -26 L -8 -30 L -2.5 -31 Z"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
