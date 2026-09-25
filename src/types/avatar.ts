export type AccessoryCategory = 'hat' | 'glasses' | 'wrist' | 'ring' | 'sticker' | 'held' | 'wings';

export interface AvatarAccessory {
  id: string;
  name: string;
  category: AccessoryCategory;
  requiredStars: number;
  description: string;
  bookReference: string;
  color: string;
}

export interface AvatarCustomization {
  skinTone: string;
  equippedIds: string[];
}

export const AVATAR_ACCESSORIES: AvatarAccessory[] = [
  {
    id: 'sticker_flower',
    name: 'Adesivo Florzinha de Pano',
    category: 'sticker',
    requiredStars: 1,
    description: 'Florzinha amarela idêntica à estampa do tecido do vestido.',
    bookReference: 'Página 8 do livro (o tecido florido da mamãe)',
    color: '#facc15',
  },
  {
    id: 'wrist_ribbon',
    name: 'Laço de Fita Métrica',
    category: 'wrist',
    requiredStars: 3,
    description: 'Fita métrica suave amarrada no pulso como um laço elegante.',
    bookReference: 'Página 6 do livro (medindo braços com fitas de lã)',
    color: '#fb923c',
  },
  {
    id: 'ring_button',
    name: 'Anel de Botão de Lã',
    category: 'ring',
    requiredStars: 5,
    description: 'Um botão vermelho com quatro furinhos no dedinho mindinho.',
    bookReference: 'Página 9 do livro (botões coloridos do vestido)',
    color: '#ef4444',
  },
  {
    id: 'glasses_detective',
    name: 'Óculos de Detetive das Frações',
    category: 'glasses',
    requiredStars: 7,
    description: 'Lentes redondas estilosas para enxergar metades e terços em toda parte!',
    bookReference: 'Página 12 do livro (encontrando medidas pela casa inteira)',
    color: '#3b82f6',
  },
  {
    id: 'wrist_ruler',
    name: 'Pulseira Régua de Palmos',
    category: 'wrist',
    requiredStars: 9,
    description: 'Pulseira com traços de medição em frações: 1/4, 2/4 e 3/4.',
    bookReference: 'Página 10 do livro (medindo móveis com palmos)',
    color: '#10b981',
  },
  {
    id: 'sticker_ladybug',
    name: 'Adesivo Joaninha do Jardim',
    category: 'sticker',
    requiredStars: 11,
    description: 'Uma joaninha que passeava entre os passos da menina no jardim.',
    bookReference: 'Página 11 do livro (o jardim medido em passos)',
    color: '#dc2626',
  },
  {
    id: 'hat_bow',
    name: 'Lacinho de Cabelo Duplo',
    category: 'hat',
    requiredStars: 13,
    description: 'Laços de chiquinha iguais aos que a menina usa no livro.',
    bookReference: 'Página 3 do livro (o penteado sapeca da menina)',
    color: '#ec4899',
  },
  {
    id: 'held_ruler',
    name: 'Varinha Régua Dourada',
    category: 'held',
    requiredStars: 15,
    description: 'Régua mágica de madeira com estrelinhas brilhantes.',
    bookReference: 'Página 18 do livro ("Meu corpo é uma régua bem útil!")',
    color: '#eab308',
  },
  {
    id: 'hat_crown',
    name: 'Coroa de Mestre da Régua',
    category: 'hat',
    requiredStars: 18,
    description: 'Coroa brilhante concedida aos grandes conhecedores de frações.',
    bookReference: 'Página 13 ("Nossa linda régua de casa!")',
    color: '#f59e0b',
  },
  {
    id: 'wings_fairy',
    name: 'Asinhas de Fada Costureira',
    category: 'wings',
    requiredStars: 22,
    description: 'Asas mágicas com fios de lã brilhante para voar alto nos estudos!',
    bookReference: 'A magia do carinho da mamãe e da vovó na costura',
    color: '#8b5cf6',
  },
];

export const SKIN_TONES = [
  { id: 'warm_yellow', label: 'Amarelinho Livro', fill: '#fef08a', stroke: '#d97706' },
  { id: 'peach', label: 'Pêssego Claro', fill: '#fed7aa', stroke: '#ea580c' },
  { id: 'tan', label: 'Canela Suave', fill: '#fdba74', stroke: '#c2410c' },
  { id: 'brown', label: 'Morena Calma', fill: '#d97706', stroke: '#92400e' },
  { id: 'cotton_blue', label: 'Luva Algodão Azul', fill: '#bae6fd', stroke: '#0284c7' },
  { id: 'rose', label: 'Rosa Primavera', fill: '#fbcfe8', stroke: '#db2777' },
];
