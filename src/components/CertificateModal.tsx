import React, { useState } from 'react';
import { X, Award, Printer, Sparkles, CheckCircle } from 'lucide-react';
import { sound } from '../utils/sound';
import { HandAvatar } from './HandAvatar';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
  completedLevelsCount: number;
  equippedIds?: string[];
  skinToneId?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stars,
  completedLevelsCount,
  equippedIds = [],
  skinToneId = 'warm_yellow',
}) => {
  const [studentName, setStudentName] = useState<string>('Estudante do 3º Ano');

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-400 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:border-8 print:p-8 print:shadow-none">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-amber-200/60 transition-colors print:hidden cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border & Header */}
        <div className="text-center space-y-2 border-b-2 border-dashed border-amber-300 pb-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-200 text-amber-900 mb-1">
            <Award className="w-8 h-8 text-amber-700" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-amber-950 uppercase tracking-wide">
            Certificado de Mestre das Frações
          </h2>
          <p className="text-xs sm:text-sm font-handwriting text-amber-800">
            Inspirado no livro didático <strong>"Minha mão é uma régua"</strong> · Coleção Tan Tan
          </p>
        </div>

        {/* Certificate Body */}
        <div className="text-center space-y-4 py-2">
          <p className="text-xs sm:text-sm text-stone-600">
            Certificamos com muito orgulho que o(a) aluno(a):
          </p>

          <div className="max-w-md mx-auto print:border-b-2 print:border-stone-800">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full text-center text-xl sm:text-2xl font-bold font-display text-amber-900 bg-transparent border-b-2 border-amber-500 focus:outline-none focus:border-amber-700 py-1"
              placeholder="Digite seu nome aqui"
            />
            <span className="text-[10px] text-stone-400 block mt-1 print:hidden">
              (Clique para personalizar seu nome no certificado)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
            concluiu com êxito os desafios pedagógicos de <strong>frações básicas</strong>, utilizando o próprio corpo como régua de medição (palmos, pés, passos e braçadas), com compreensão de numerador e denominador e representação de partes do todo.
          </p>

          {/* Student Customized Avatar Stamped on Certificate */}
          <div className="flex flex-col items-center justify-center pt-1 pb-1">
            <div className="p-2 rounded-2xl bg-white border-2 border-amber-300 shadow-xs flex items-center gap-3">
              <div className="w-12 h-14 flex items-center justify-center">
                <HandAvatar
                  size="sm"
                  skinToneId={skinToneId}
                  equippedIds={equippedIds}
                  interactive={false}
                />
              </div>
              <div className="text-left pr-2">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider font-display block">
                  Avatar Oficial da Régua-Mão
                </span>
                <span className="text-xs font-semibold text-stone-800">
                  {equippedIds.length} acessórios e adesivos conquistados
                </span>
              </div>
            </div>
          </div>

          {/* Badges / Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-1">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
              <span className="text-xs font-bold text-amber-950">
                {stars} Estrelas Conquistadas
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-2xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-amber-950">
                {completedLevelsCount} Peças do Vestido Costuradas
              </span>
            </div>
          </div>
        </div>

        {/* Seal and Signatures */}
        <div className="pt-4 border-t-2 border-dashed border-amber-300 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="text-center">
            <div className="w-24 sm:w-28 border-b border-stone-600 mb-1 mx-auto" />
            <span className="font-handwriting text-stone-700">A Menina Esperta</span>
            <span className="block text-[10px] text-stone-500">Régua Oficial da Casa</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-amber-200/80 flex items-center justify-center p-1 shadow-inner">
              <img
                src="/src/assets/images/badge_fraction_master_1790319843531.jpg"
                alt="Selo de Frações"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] font-bold text-amber-900 mt-1 uppercase">Selo de Honra</span>
          </div>

          <div className="text-center">
            <div className="w-24 sm:w-28 border-b border-stone-600 mb-1 mx-auto" />
            <span className="font-handwriting text-stone-700">A Mamãe Costureira</span>
            <span className="block text-[10px] text-stone-500">Data: {currentDate}</span>
          </div>
        </div>

        {/* Print / Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-display shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Certificado
          </button>
        </div>
      </div>
    </div>
  );
};
