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
    question: 'Represente a fração 1/2 (a metade do todo) na pizza ou na fita de tecido:',
    targetNumerator: 1,
    targetDenominator: 2,
    initialDenominator: 2,
    allowDenominatorChange: true,
    visualType: 'fabric',
    hint: 'Divida em 2 fatias e pinte 1 fatia (1/2). Ou divida em 4 fatias e pinte 2 fatias (2/4)!',
    pedagogicalTip: '1/2 representa exatamente a metade de qualquer objeto: 1 fatia de 2, ou 2 fatias de 4.',
  },
  {
    id: 2,
    title: 'A Fita de Lã para as Mangas',
    bookScene: '"Nossa, as mangas desta blusa estão muito curtas!", disse a menina.',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos da Mamãe',
    narrative: 'A fita de lã foi dividida em 3 partes iguais. A mamãe precisa de 1 parte (1/3) para costurar a primeira manga.',
    question: 'Represente a fração 1/3 (uma terça parte) pintando 1 de 3 fatias iguais:',
    targetNumerator: 1,
    targetDenominator: 3,
    initialDenominator: 3,
    allowDenominatorChange: true,
    visualType: 'measuringTape',
    hint: 'Divida em 3 fatias e pinte 1 fatia (1/3). Ou divida em 6 e pinte 2 fatias (2/6)!',
    pedagogicalTip: '1/3 significa "um terço" ou "uma terça parte" do todo repartido em 3 partes iguais.',
  },
  {
    id: 3,
    title: 'A Mesa da Cozinha em Palmos',
    bookScene: 'A menina e a mamãe mediram a mesa: "Um palmo, dois palmos, três palmos, quatro palmos!"',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos na Mesa',
    narrative: 'A mesa inteira mede 4 palmos. A toalha xadrez nova vai cobrir 3 quartos (3/4) da mesa.',
    question: 'Represente a fração 3/4 pintando 3 fatias de um total de 4 partes iguais:',
    targetNumerator: 3,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: true,
    visualType: 'fabric',
    hint: 'Divida em 4 fatias e pinte 3 fatias (3/4).',
    pedagogicalTip: 'O número 4 embaixo (denominador) indica o total de fatias. O número 3 em cima (numerador) indica quantas fatias foram pintadas.',
  },
  {
    id: 4,
    title: 'O Tapete Xadrez da Sala',
    bookScene: 'No livro, a mamãe e a menina olham o grande tapete xadrez no chão da sala.',
    bodyMeasurement: 'passo',
    bodyMeasurementLabel: 'Passos da Menina',
    narrative: 'O tapete tem 4 faixas iguais. A menina andou por 2 faixas (2/4 do tapete). Veja que 2/4 é exatamente a metade (1/2)!',
    question: 'Represente a fração 2/4 (ou 1/2) pintando a metade das partes:',
    targetNumerator: 2,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: true,
    visualType: 'checkeredRug',
    hint: 'Pinte 2 de 4 fatias (2/4) ou 1 de 2 fatias (1/2) — ambas representam a metade!',
    pedagogicalTip: '2 de 4 partes é exatamente a metade do todo! 2/4 tem o mesmo tamanho que 1/2.',
  },
  {
    id: 5,
    title: 'A Trilha dos Passos no Jardim',
    bookScene: '"Nosso jardim mede 10 passos por 15 passos. Nossos pés são réguas incríveis!"',
    bodyMeasurement: 'passo',
    bodyMeasurementLabel: 'Passos no Canteiro',
    narrative: 'A trilha de flores do jardim foi repartida em 5 trechos iguais de passos. A menina quer regar 3 desses trechos (3/5).',
    question: 'Represente a fração 3/5 pintando 3 de 5 partes iguais:',
    targetNumerator: 3,
    targetDenominator: 5,
    initialDenominator: 5,
    allowDenominatorChange: true,
    visualType: 'gardenPath',
    hint: 'Divida em 5 fatias e pinte 3 delas para formar 3/5!',
    pedagogicalTip: '3/5 lê-se "três quintos". São 3 pedaços de um total de 5 pedaços iguais da trilha.',
  },
  {
    id: 6,
    title: 'O Sofá Medido com os Pés',
    bookScene: '"Nosso sofá mede pés de largura. Um pé na frente do outro: calcanhar com dedão!"',
    bodyMeasurement: 'pe',
    bodyMeasurementLabel: 'Pés (Calcanhar ao Dedão)',
    narrative: 'O sofá foi dividido em 6 partes iguais de pés. O cachorrinho da família ocupou 4 partes (4/6 do sofá).',
    question: 'Represente a fração 4/6 (ou 2/3) pintando 4 de 6 fatias:',
    targetNumerator: 4,
    targetDenominator: 6,
    initialDenominator: 6,
    allowDenominatorChange: true,
    visualType: 'measuringTape',
    hint: 'Divida em 6 partes e pinte 4 partes (4/6). Ou divida em 3 e pinte 2 (2/3)!',
    pedagogicalTip: '4/6 significa "quatro sextos". É mais da metade do sofá e equivale a 2/3!',
  },
  {
    id: 7,
    title: 'Os Botões de Lã do Vestido',
    bookScene: 'A vovó e a mamãe costuravam roupas com muito carinho e botões redondinhos.',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos de Costura',
    narrative: 'A caixinha de costura tem 6 botões coloridos para o vestido. A mamãe já pregou 5 botões (5/6 do total).',
    question: 'Represente a fração 5/6 pintando 5 de 6 partes do todo:',
    targetNumerator: 5,
    targetDenominator: 6,
    initialDenominator: 6,
    allowDenominatorChange: true,
    visualType: 'buttons',
    hint: 'Divida em 6 fatias e pinte 5 fatias (5/6). Falta só uma para o todo!',
    pedagogicalTip: 'Falta só 1 fatia para completar o inteiro (6/6). 5/6 é quase a pizza ou fita inteira!',
  },
  {
    id: 8,
    title: 'A Grande Árvore e as Braçadas',
    bookScene: '"Para medir a árvore, estique os braços e meça com braçadas!"',
    bodyMeasurement: 'bracada',
    bodyMeasurementLabel: 'Braçadas de Abraço',
    narrative: 'São necessárias 4 braçadas inteiras para dar a volta no tronco da árvore. A menina e o papai já abraçaram 1/4 da árvore.',
    question: 'Represente a fração 1/4 (uma quarta parte) pintando 1 de 4 partes:',
    targetNumerator: 1,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: true,
    visualType: 'treeTrunk',
    hint: 'Divida em 4 fatias de pizza ou blocos e pinte 1 fatia (1/4)!',
    pedagogicalTip: '1/4 chama-se "um quarto" ou "uma quarta parte". São 4 partes iguais para fechar o círculo.',
  },
  {
    id: 9,
    title: 'A Costureira: Crie a Divisão!',
    bookScene: 'Agora a menina virou a "régua da casa" oficial e decide como repartir!',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Oficina da Régua-Mão',
    narrative: 'A mamãe precisa de dois quintos (2/5) do rolo de tecido estampado para os bolsos do vestido.',
    question: 'Divida em 5 partes iguais e pinte 2 partes para formar 2/5:',
    targetNumerator: 2,
    targetDenominator: 5,
    initialDenominator: 5,
    allowDenominatorChange: true,
    visualType: 'fabric',
    hint: 'Selecione 5 fatias no seletor e pinte 2 fatias!',
    pedagogicalTip: 'Primeiro dividimos o inteiro no número de partes iguais (denominador = 5), depois pegamos a quantidade necessária (numerador = 2).',
  },
  {
    id: 10,
    title: 'O Grande Baile do Vestido Sob Medida!',
    bookScene: '"Uau! Ficou ótimo! Como se tivesse sido medido com uma régua de verdade!"',
    bodyMeasurement: 'palmo',
    bodyMeasurementLabel: 'Palmos de Festa',
    narrative: 'O vestido está pronto e a menina está pulando de alegria! Para a faixa final dourada, a mamãe precisa de exatamente 3 quartos (3/4) de fita de seda.',
    question: 'Represente a fração 3/4 pintando 3 de 4 fatias iguais:',
    targetNumerator: 3,
    targetDenominator: 4,
    initialDenominator: 4,
    allowDenominatorChange: true,
    visualType: 'fabric',
    hint: 'Divida em 4 fatias e pinte 3 partes para finalizar com 3/4!',
    pedagogicalTip: 'Parabéns! Você aprendeu as frações básicas usando as medidas do corpo do livro Minha mão é uma régua!',
  },
];

export interface QuizQuestion {
  id: number;
  question: string;
  imagePrompt: string;
  numerator: number;
  denominator: number;
  options: { num: number; den: number; label: string; isCorrect: boolean }[];
  explanation: string;
  context: string;
  correctOptionIndex: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'A mamãe dividiu uma fita de tecido em 2 partes iguais e usou 1 parte. Que fração do tecido ela usou?',
    imagePrompt: 'Fita dividida em 2 partes com 1 pintada',
    numerator: 1,
    denominator: 2,
    correctOptionIndex: 0,
    options: [
      { num: 1, den: 2, label: '1/2 (Um meio)', isCorrect: true },
      { num: 2, den: 1, label: '2/1 (Dois inteiros)', isCorrect: false },
      { num: 1, den: 3, label: '1/3 (Um terço)', isCorrect: false },
      { num: 1, den: 4, label: '1/4 (Um quarto)', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 3, den: 4, label: '3/4 (Três quartos)', isCorrect: true },
      { num: 4, den: 3, label: '4/3 (Quatro terços)', isCorrect: false },
      { num: 1, den: 4, label: '1/4 (Um quarto)', isCorrect: false },
      { num: 3, den: 10, label: '3/10 (Três décimos)', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 1, den: 2, label: '1/2 (A metade exata!)', isCorrect: true },
      { num: 1, den: 4, label: '1/4 (Um quarto)', isCorrect: false },
      { num: 3, den: 4, label: '3/4 (Três quartos)', isCorrect: false },
      { num: 4, den: 4, label: '4/4 (O sofá todo)', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 2, den: 5, label: '2/5 (Dois quintos)', isCorrect: true },
      { num: 5, den: 2, label: '5/2', isCorrect: false },
      { num: 3, den: 5, label: '3/5 (Três quintos)', isCorrect: false },
      { num: 2, den: 3, label: '2/3 (Dois terços)', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 4, den: 4, label: '4/4 (Um todo inteiro)', isCorrect: true },
      { num: 1, den: 4, label: '1/4 (Apenas uma braçada)', isCorrect: false },
      { num: 2, den: 4, label: '2/4 (A metade)', isCorrect: false },
      { num: 0, den: 4, label: '0/4', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 1, den: 3, label: '1/3 (Um terço)', isCorrect: true },
      { num: 3, den: 1, label: '3/1', isCorrect: false },
      { num: 1, den: 2, label: '1/2 (Um meio)', isCorrect: false },
      { num: 2, den: 3, label: '2/3 (Dois terços)', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 5, den: 6, label: '5/6 (Cinco sextos)', isCorrect: true },
      { num: 1, den: 6, label: '1/6 (Apenas um botão)', isCorrect: false },
      { num: 6, den: 5, label: '6/5', isCorrect: false },
      { num: 4, den: 6, label: '4/6', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 1, den: 2, label: '1/2 (Exatamente a metade do sofá!)', isCorrect: true },
      { num: 1, den: 3, label: '1/3', isCorrect: false },
      { num: 1, den: 4, label: '1/4', isCorrect: false },
      { num: 2, den: 3, label: '2/3', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 1, den: 4, label: '1/4 (Uma quarta parte)', isCorrect: true },
      { num: 1, den: 2, label: '1/2', isCorrect: false },
      { num: 3, den: 8, label: '3/8', isCorrect: false },
      { num: 2, den: 4, label: '2/4', isCorrect: false },
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
    correctOptionIndex: 0,
    options: [
      { num: 7, den: 10, label: '7/10 (Sete décimos)', isCorrect: true },
      { num: 10, den: 7, label: '10/7', isCorrect: false },
      { num: 3, den: 10, label: '3/10', isCorrect: false },
      { num: 7, den: 8, label: '7/8', isCorrect: false },
    ],
    explanation: 'Foram medidos 7 palmos de um total de 10 palmos iguais, formando 7/10 (sete décimos)!',
    context: 'Medindo os armários com palmos',
  },
];
