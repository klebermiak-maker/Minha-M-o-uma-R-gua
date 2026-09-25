/**
 * Fraction utilities, names in Portuguese, and book-based story levels.
 * Aligned with BNCC (3º ano do Ensino Fundamental 1 - Matemática: EF03MA08, EF03MA09).
 */

export interface StoryLevel {
  id: number;
  title: string;
  bookScene: string;
  bodyMeasurement: 'palmo' | 'pe' | 'passo' | 'bracada';
  bodyMeasurementLabel: string;
  narrative: string;
  question: string;
  targetNumerator: number;
  targetDenominator: number;
  initialDenominator: number;
  allowDenominatorChange: boolean;
  visualType: 'fabric' | 'measuringTape' | 'checkeredRug' | 'gardenPath' | 'treeTrunk' | 'buttons';
  hint: string;
  pedagogicalTip: string;
}

export const FRACTION_NAMES: Record<number, Record<number, string>> = {
  2: {
    1: 'um meio (ou metade)',
    2: 'dois meios (o todo inteiro)',
  },
  3: {
    1: 'um terço (terça parte)',
    2: 'dois terços',
    3: 'três terços (o todo inteiro)',
  },
  4: {
    1: 'um quarto (quarta parte)',
    2: 'dois quartos (igual à metade!)',
    3: 'três quartos',
    4: 'quatro quartos (o todo inteiro)',
  },
  5: {
    1: 'um quinto (quinta parte)',
    2: 'dois quintos',
    3: 'três quintos',
    4: 'quatro quintos',
    5: 'cinco quintos (o todo inteiro)',
  },
  6: {
    1: 'um sexto (sexta parte)',
    2: 'dois sextos (igual a um terço!)',
    3: 'três sextos (igual à metade!)',
    4: 'quatro sextos (igual a dois terços!)',
    5: 'cinco sextos',
    6: 'seis sextos (o todo inteiro)',
  },
  8: {
    1: 'um oitavo (oitava parte)',
    2: 'dois oitavos (igual a um quarto!)',
    3: 'três oitavos',
    4: 'quatro oitavos (igual à metade!)',
    5: 'cinco oitavos',
    6: 'seis oitavos (igual a três quartos!)',
    7: 'sete oitavos',
    8: 'oito oitavos (o todo inteiro)',
  },
  10: {
    1: 'um décimo (décima parte)',
    2: 'dois décimos (igual a um quinto!)',
    3: 'três décimos',
    4: 'quatro décimos (igual a dois quintos!)',
    5: 'cinco décimos (igual à metade!)',
    6: 'seis décimos (igual a três quintos!)',
    7: 'sete décimos',
    8: 'oito décimos (igual a quatro quintos!)',
    9: 'nove décimos',
    10: 'dez décimos (o todo inteiro)',
  },
};

export function getFractionName(num: number, den: number): string {
  if (num === 0) return 'zero partes (nada pintado)';
  if (num === den) return `${num}/${den} (o todo completo!)`;
  if (FRACTION_NAMES[den] && FRACTION_NAMES[den][num]) {
    return FRACTION_NAMES[den][num];
  }
  const ordinals: Record<number, string> = {
    2: 'meio',
    3: 'terço',
    4: 'quarto',
    5: 'quinto',
    6: 'sexto',
    7: 'sétimo',
    8: 'oitavo',
    9: 'nono',
    10: 'décimo',
  };
  const numWords = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
  const base = ordinals[den] || `avos`;
  const plural = num > 1 ? `${base}s` : base;
  return `${numWords[num] || num} ${plural}`;
}

export function checkEquivalence(num: number, den: number): string | null {
  if (num === 0 || den === 0) return null;
  const val = num / den;
  if (val === 0.5 && den !== 2) {
    return `Observe: ${num}/${den} é equivalente a 1/2 (exatamente a metade do todo)!`;
  }
  if (val === 1) {
    return `Observe: ${num}/${den} é igual a 1 inteiro (todas as partes juntas formam o todo)!`;
  }
  if (Math.abs(val - 1 / 3) < 0.001 && den !== 3) {
    return `Observe: ${num}/${den} tem o mesmo tamanho que 1/3 (uma terça parte)!`;
  }
  if (Math.abs(val - 2 / 3) < 0.001 && den !== 3) {
    return `Observe: ${num}/${den} tem o mesmo tamanho que 2/3!`;
  }
  if (Math.abs(val - 1 / 4) < 0.001 && den !== 4) {
    return `Observe: ${num}/${den} tem o mesmo tamanho que 1/4 (uma quarta parte)!`;
  }
  if (Math.abs(val - 3 / 4) < 0.001 && den !== 4) {
    return `Observe: ${num}/${den} tem o mesmo tamanho que 3/4!`;
  }
  return null;
}

export const STORY_LEVELS: StoryLevel[] = [
  {
    id: 1,
    title: 'O Tecido do Vestido Novo',
    bookScene: 'A menina cresceu e as roupas encolheram! A mamãe vai tricotar um vestido novo.',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Régua-Mão (Palmos)',
    narrative: 'A mamãe pegou o tecido amarelo e precisa cortar a metade exata (1/2) para começar a costurar a saia do vestido.',
    question: 'Divida o tecido em 2 partes iguais e pinte 1 parte para representar 1/2 (a metade):',
    targetNumerator: 1,
    targetDenominator: 2,
    initialDenominator: 2,
    allowDenominatorChange: false,
    visualType: 'fabric',
    hint: 'Clique em 1 das 2 partes para colori-la de amarelo com florzinhas!',
    pedagogicalTip: 'O número 2 embaixo (denominador) mostra que o tecido foi dividido em 2 partes iguais. O número 1 em cima (numerador) é a parte que você usou!',
  },
  {
    id: 2,
    title: 'A Fita de Lã para as Mangas',
    bookScene: '"Nossa, as mangas desta blusa estão muito curtas!", disse a menina.',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos da Mamãe',
    narrative: 'A fita de lã foi dividida em 3 partes iguais. A mamãe precisa de 1 parte (1/3) para a primeira manga.',
    question: 'Pinte 1 de 3 partes para formar a fração 1/3 (um terço):',
    targetNumerator: 1,
    targetDenominator: 3,
    initialDenominator: 3,
    allowDenominatorChange: false,
    visualType: 'measuringTape',
    hint: 'A fita já está dividida em 3 pedaços de mesmo tamanho. Toque em 1 pedaço!',
    pedagogicalTip: '1/3 significa "uma terça parte" — uma das três fatias iguais da fita de lã.',
  },
  {
    id: 3,
    title: 'A Mesa da Cozinha em Palmos',
    bookScene: 'A menina e a mamãe mediram a mesa: "Um palmo, dois palmos, três palmos, quatro palmos!"',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos na Mesa',
    narrative: 'A mesa inteira mede 4 palmos. A toalha xadrez nova vai cobrir 3 quartos (3/4) da mesa.',
    question: 'Selecione 3 palmos dos 4 disponíveis para cobrir 3/4 da mesa:',
    targetNumerator: 3,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: false,
    visualType: 'fabric',
    hint: 'Clique em 3 partes da mesa para ver as mãozinhas da mamãe medindo 3/4!',
    pedagogicalTip: 'O numerador 3 indica quantas partes estamos cobrindo. O denominador 4 indica em quantos palmos a mesa foi dividida.',
  },
  {
    id: 4,
    title: 'O Tapete Xadrez da Sala',
    bookScene: 'No livro, a mamãe e a menina olham o grande tapete xadrez no chão da sala.',
    bodyMeasurement: 'passo',
    bodyMeasurementLabel: 'Passos da Menina',
    narrative: 'O tapete tem 4 faixas iguais. A menina andou por 2 faixas (2/4 do tapete). Veja que 2/4 é o mesmo que a metade (1/2)!',
    question: 'Pinte 2 das 4 faixas do tapete para marcar a fração 2/4:',
    targetNumerator: 2,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: false,
    visualType: 'checkeredRug',
    hint: 'Toque em 2 retângulos do tapete para que a menina caminhe sobre eles.',
    pedagogicalTip: '2 de 4 partes é exatamente a metade do tapete! Chamamos isso de fração equivalente: 2/4 = 1/2.',
  },
  {
    id: 5,
    title: 'A Trilha dos Passos no Jardim',
    bookScene: '"Nosso jardim mede 10 passos por 15 passos. Nossos pés são réguas incríveis!"',
    bodyMeasurement: 'passo',
    bodyMeasurementLabel: 'Passos no Canteiro',
    narrative: 'A trilha de flores do jardim foi repartida em 5 trechos iguais de passos. A menina quer regar 3 desses trechos (3/5).',
    question: 'Ajude a menina a avançar por 3 partes de 5 (fração 3/5 da trilha):',
    targetNumerator: 3,
    targetDenominator: 5,
    initialDenominator: 5,
    allowDenominatorChange: false,
    visualType: 'gardenPath',
    hint: 'Clique em 3 partes do canteiro para plantar as flores e dar passos!',
    pedagogicalTip: '3/5 lê-se "três quintos". São 3 pedaços de um total de 5 pedaços iguais da trilha.',
  },
  {
    id: 6,
    title: 'O Sofá Medido com os Pés',
    bookScene: '"Nosso sofá mede pés de largura. Um pé na frente do outro: calcanhar com dedão!"',
    bodyMeasurement: 'pe',
    bodyMeasurementLabel: 'Pés (Calcanhar ao Dedão)',
    narrative: 'O sofá foi dividido em 6 partes iguais de pés. O cachorrinho da família ocupou 4 partes (4/6 do sofá).',
    question: 'Marque 4 pés de 6 no sofá para representar 4/6:',
    targetNumerator: 4,
    targetDenominator: 6,
    initialDenominator: 6,
    allowDenominatorChange: false,
    visualType: 'measuringTape',
    hint: 'Pinte 4 pezinhos no sofá. Veja como o espaço fica marcado!',
    pedagogicalTip: '4/6 significa "quatro sextos". É mais da metade do sofá!',
  },
  {
    id: 7,
    title: 'Os Botões de Lã do Vestido',
    bookScene: 'A vovó e a mamãe costuravam roupas com muito carinho e botões redondinhos.',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos de Costura',
    narrative: 'A caixinha de costura tem 6 botões coloridos para o vestido. A mamãe já pregou 5 botões (5/6 do total).',
    question: 'Selecione 5 dos 6 botões para completar a fração 5/6:',
    targetNumerator: 5,
    targetDenominator: 6,
    initialDenominator: 6,
    allowDenominatorChange: false,
    visualType: 'buttons',
    hint: 'Clique em 5 botões de lã para colocá-los no vestido novo.',
    pedagogicalTip: 'Falta só 1 botão para completar o todo inteiro (6/6). 5/6 é quase tudo!',
  },
  {
    id: 8,
    title: 'A Grande Árvore e as Braçadas',
    bookScene: '"Para medir a árvore, estique os braços e meça com braçadas!"',
    bodyMeasurement: 'bracada',
    bodyMeasurementLabel: 'Braçadas de Abraço',
    narrative: 'São necessárias 4 braçadas inteiras para dar a volta no tronco da árvore. A menina e o papai já abraçaram 1/4 da árvore.',
    question: 'Marque 1 de 4 braçadas para registrar a fração 1/4 ao redor da árvore:',
    targetNumerator: 1,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: false,
    visualType: 'treeTrunk',
    hint: 'Clique em 1 braçada para abraçar a primeira parte do tronco.',
    pedagogicalTip: '1/4 chama-se "um quarto" ou "uma quarta parte". São 4 braçadas para fechar a circunferência.',
  },
  {
    id: 9,
    title: 'A Costureira: Crie a Divisão!',
    bookScene: 'Agora a menina virou a "régua da casa" oficial e decide como repartir!',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Oficina da Régua-Mão',
    narrative: 'A mamãe precisa de dois quintos (2/5) do rolo de tecido estampado. Você precisa escolher a divisão certa (5 partes) e colorir 2 partes!',
    question: 'Configure o tecido para 5 partes iguais e pinte 2 partes (2/5):',
    targetNumerator: 2,
    targetDenominator: 5,
    initialDenominator: 3,
    allowDenominatorChange: true,
    visualType: 'fabric',
    hint: 'Use os botões de divisão para repartir o tecido em 5 partes, depois clique em 2 partes!',
    pedagogicalTip: 'Primeiro dividimos o inteiro no número de partes iguais (denominador = 5), depois pegamos a quantidade necessária (numerador = 2).',
  },
  {
    id: 10,
    title: 'O Grande Baile do Vestido Sob Medida!',
    bookScene: '"Uau! Ficou ótimo! Como se tivesse sido medido com uma régua de verdade!"',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos de Festa',
    narrative: 'O vestido está pronto e a menina está pulando de alegria! Para a faixa final dourada, a mamãe precisa de exatamente 3 quartos (3/4) de fita de seda.',
    question: 'Divida a fita em 4 partes iguais e pinte 3 partes para finalizar com 3/4:',
    targetNumerator: 3,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: true,
    visualType: 'fabric',
    hint: 'Verifique se há 4 partes iguais e pinte 3 delas!',
    pedagogicalTip: 'Parabéns! Você aprendeu as frações básicas usando as medidas do corpo do livro Minha mão é uma régua!',
  },
];

export interface QuizQuestion {
  id: number;
  question: string;
  imagePrompt: string;
  numerator: number;
  denominator: number;
  options: { num: number; den: number; label: string }[];
  explanation: string;
  context: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'A mamãe dividiu uma fita de tecido em 2 partes iguais e usou 1 parte. Que fração do tecido ela usou?',
    imagePrompt: 'Fita dividida em 2 partes com 1 pintada',
    numerator: 1,
    denominator: 2,
    options: [
      { num: 1, den: 2, label: '1/2 (Um meio)' },
      { num: 2, den: 1, label: '2/1 (Dois inteiros)' },
      { num: 1, den: 3, label: '1/3 (Um terço)' },
      { num: 1, den: 4, label: '1/4 (Um quarto)' },
    ],
    explanation: 'Como a fita foi dividida em 2 partes iguais e usamos 1 parte, a fração é 1/2 (a metade!).',
    context: 'A saia do vestido da menina',
  },
  {
    id: 2,
    question: 'A menina mediu a mesa da cozinha em 4 palmos. A toalha cobriu 3 palmos. Qual é a fração da mesa coberta?',
    imagePrompt: 'Mesa com 4 palmos, 3 cobertos',
    numerator: 3,
    denominator: 4,
    options: [
      { num: 3, den: 4, label: '3/4 (Três quartos)' },
      { num: 4, den: 3, label: '4/3 (Quatro terços)' },
      { num: 1, den: 4, label: '1/4 (Um quarto)' },
      { num: 3, den: 10, label: '3/10 (Três décimos)' },
    ],
    explanation: 'O total de palmos é 4 (denominador) e cobrimos 3 palmos (numerador), formando 3/4.',
    context: 'A mesa medida com palmos',
  },
  {
    id: 3,
    question: 'No livro, o sofá mede vários pés. Se dividirmos o sofá em 4 partes iguais e pintarmos 2 partes (2/4), isso equivale a qual fração?',
    imagePrompt: '2 partes de 4 pintadas',
    numerator: 2,
    denominator: 4,
    options: [
      { num: 1, den: 2, label: '1/2 (A metade exata!)' },
      { num: 1, den: 4, label: '1/4 (Um quarto)' },
      { num: 3, den: 4, label: '3/4 (Três quartos)' },
      { num: 4, den: 4, label: '4/4 (O sofá todo)' },
    ],
    explanation: '2 partes de 4 é exatamente a metade do sofá! Dizemos que 2/4 é equivalente a 1/2.',
    context: 'O sofá medido com pés',
  },
  {
    id: 4,
    question: 'O jardim da casa mede passos de distância. A menina caminhou 2 passos de uma trilha de 5 passos. Que fração da trilha ela andou?',
    imagePrompt: 'Trilha com 5 passos, 2 percorridos',
    numerator: 2,
    denominator: 5,
    options: [
      { num: 2, den: 5, label: '2/5 (Dois quintos)' },
      { num: 5, den: 2, label: '5/2' },
      { num: 3, den: 5, label: '3/5 (Três quintos)' },
      { num: 2, den: 3, label: '2/3 (Dois terços)' },
    ],
    explanation: 'A trilha inteira tem 5 partes iguais e a menina percorreu 2 passos, logo caminhou 2/5.',
    context: 'O jardim medido em passos',
  },
  {
    id: 5,
    question: 'Para abraçar uma árvore grossa, são necessárias 4 braçadas. A menina deu 4 braçadas completas ao redor. Que fração representa a volta completa?',
    imagePrompt: '4 de 4 partes preenchidas',
    numerator: 4,
    denominator: 4,
    options: [
      { num: 4, den: 4, label: '4/4 (Um todo inteiro)' },
      { num: 1, den: 4, label: '1/4 (Apenas uma braçada)' },
      { num: 2, den: 4, label: '2/4 (A metade)' },
      { num: 0, den: 4, label: '0/4' },
    ],
    explanation: 'Quando pegamos todas as 4 partes de 4 (4/4), temos o contorno inteiro da árvore: 1 inteiro!',
    context: 'A árvore medida em braçadas',
  },
  {
    id: 6,
    question: 'A mamãe cortou uma fita de lã em 3 pedaços de mesmo tamanho para as mangas do vestido e usou 1 pedaço. Que fração é essa?',
    imagePrompt: '1 parte de 3 fatias de fita',
    numerator: 1,
    denominator: 3,
    options: [
      { num: 1, den: 3, label: '1/3 (Um terço)' },
      { num: 3, den: 1, label: '3/1' },
      { num: 1, den: 2, label: '1/2 (Um meio)' },
      { num: 2, den: 3, label: '2/3 (Dois terços)' },
    ],
    explanation: '1 parte selecionada de um total de 3 partes iguais chama-se 1/3 (uma terça parte).',
    context: 'As mangas do vestido de lã',
  },
  {
    id: 7,
    question: 'A caixinha de costura da vovó tem 6 botões vermelhos. A mamãe costurou 5 botões no vestido. Qual fração representa os botões costurados?',
    imagePrompt: '5 de 6 botões costurados',
    numerator: 5,
    denominator: 6,
    options: [
      { num: 5, den: 6, label: '5/6 (Cinco sextos)' },
      { num: 1, den: 6, label: '1/6 (Apenas um botão)' },
      { num: 6, den: 5, label: '6/5' },
      { num: 4, den: 6, label: '4/6' },
    ],
    explanation: 'O total de botões é 6 (denominador) e foram costurados 5 (numerador), totalizando 5/6!',
    context: 'Os botões de lã do vestido novo',
  },
  {
    id: 8,
    question: 'O sofá da sala mede 6 pés de comprimento. O irmãozinho sentou em 3 pés do sofá (3/6). A qual fração conhecida 3/6 é equivalente?',
    imagePrompt: '3 partes de 6 no sofá',
    numerator: 3,
    denominator: 6,
    options: [
      { num: 1, den: 2, label: '1/2 (Exatamente a metade do sofá!)' },
      { num: 1, den: 3, label: '1/3' },
      { num: 1, den: 4, label: '1/4' },
      { num: 2, den: 3, label: '2/3' },
    ],
    explanation: 'Como 3 é a metade exata de 6, 3/6 representa exatamente a metade (1/2) do sofá!',
    context: 'O sofá medido com pés (calcanhar com dedão)',
  },
  {
    id: 9,
    question: 'O tapete da sala tem 8 faixas coloridas. A menina pulou por 2 faixas (2/8). Essa fração tem o mesmo tamanho que qual outra fração?',
    imagePrompt: '2 partes de 8 faixas',
    numerator: 2,
    denominator: 8,
    options: [
      { num: 1, den: 4, label: '1/4 (Uma quarta parte)' },
      { num: 1, den: 2, label: '1/2' },
      { num: 3, den: 8, label: '3/8' },
      { num: 2, den: 4, label: '2/4' },
    ],
    explanation: '2 de 8 partes é o mesmo que 1 de 4 partes (2/8 = 1/4), pois dividimos numerador e denominador por 2!',
    context: 'O tapete xadrez da sala',
  },
  {
    id: 10,
    question: 'A régua-mão da menina foi dividida em 10 palmos iguais. Ela mediu um armário e marcou 7 palmos. Qual é a fração registrada?',
    imagePrompt: '7 partes de 10 na régua',
    numerator: 7,
    denominator: 10,
    options: [
      { num: 7, den: 10, label: '7/10 (Sete décimos)' },
      { num: 10, den: 7, label: '10/7' },
      { num: 3, den: 10, label: '3/10' },
      { num: 7, den: 8, label: '7/8' },
    ],
    explanation: 'Foram medidos 7 palmos de um total de 10 palmos iguais, formando 7/10 (sete décimos)!',
    context: 'Medindo os armários com palmos',
  },
];
