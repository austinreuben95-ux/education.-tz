// Rich datasets for the 20 Interactive Quiz & Mini-Game Suite

export interface FlashcardItem {
  id: string;
  subject: string;
  term: string;
  definition: string;
  formulaOrNote?: string;
  swahiliTerm?: string;
  example?: string;
}

export const FLASHCARD_DECK: FlashcardItem[] = [
  {
    id: 'fc-1',
    subject: 'Biology',
    term: 'Osmosis',
    definition: 'The net movement of water molecules from a region of higher water potential to a region of lower water potential through a semi-permeable membrane.',
    formulaOrNote: 'Hypotonic → Isotonic → Hypertonic',
    swahiliTerm: 'Osmosisi / Mvutano wa Maji',
    example: 'Absorption of water by plant root hair cells from soil.'
  },
  {
    id: 'fc-2',
    subject: 'Physics',
    term: 'Newton’s Second Law',
    definition: 'The rate of change of momentum of a body is directly proportional to the applied resultant force and takes place in the direction of the force.',
    formulaOrNote: 'F = m × a (Force = Mass × Acceleration)',
    swahiliTerm: 'Sheria ya Pili ya Newton',
    example: 'Pushing a lighter cart accelerates faster than a heavy cart with the same force.'
  },
  {
    id: 'fc-3',
    subject: 'Chemistry',
    term: 'Avogadro’s Law',
    definition: 'Equal volumes of all gases at the same temperature and pressure contain an equal number of molecules.',
    formulaOrNote: 'V ∝ n (At STP, 1 mole of any gas = 22.4 dm³)',
    swahiliTerm: 'Kanuni ya Avogadro',
    example: '1 mole of O₂ and 1 mole of CO₂ both occupy 22.4 liters at STP.'
  },
  {
    id: 'fc-4',
    subject: 'Mathematics',
    term: 'Quadratic Formula',
    definition: 'Formula used to solve any quadratic equation in the standard form ax² + bx + c = 0.',
    formulaOrNote: 'x = (-b ± √(b² - 4ac)) / (2a)',
    swahiliTerm: 'Fomula ya Mlinganyo wa Pili',
    example: 'Discriminant D = b² - 4ac determines root nature (real, equal, or complex).'
  },
  {
    id: 'fc-5',
    subject: 'Geography',
    term: 'Thermal Inversion',
    definition: 'A meteorological phenomenon where normal temperature lapse rate is inverted, with warm air overlaying cold air at the ground surface.',
    formulaOrNote: 'Traps smog and pollutants in valley floors',
    swahiliTerm: 'Ugeuzaji wa Joto',
    example: 'Smog accumulation over Dar es Salaam or Arusha valleys during cool mornings.'
  },
  {
    id: 'fc-6',
    subject: 'Civics',
    term: 'Rule of Law',
    definition: 'The principle that all people and institutions are subject to and accountable to law that is fairly applied and enforced.',
    formulaOrNote: 'Article 13 of the Constitution of Tanzania (Equality before the Law)',
    swahiliTerm: 'Utawala wa Sheria',
    example: 'No citizen or official is above the legal statutes of the constitution.'
  },
  {
    id: 'fc-7',
    subject: 'Chemistry',
    term: 'Electrolysis',
    definition: 'The chemical decomposition of an ionic compound into its elements produced by passing a direct electric current through an electrolyte.',
    formulaOrNote: 'Anode (+) attracts Anions (-); Cathode (-) attracts Cations (+)',
    swahiliTerm: 'Mwanyuko kwa Umeme (Elektrolisisi)',
    example: 'Extraction of pure copper or industrial production of chlorine gas.'
  },
  {
    id: 'fc-8',
    subject: 'Biology',
    term: 'Mitochondria',
    definition: 'Double-membraned organelle where cellular aerobic respiration occurs, producing ATP energy for biochemical cellular work.',
    formulaOrNote: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP',
    swahiliTerm: 'Mitochondria (Kiwanda cha Nishati cha Seli)',
    example: 'High concentration in active human muscle and heart cells.'
  }
];

export interface TriviaQuestion {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export const TRIVIA_ROUNDS: TriviaQuestion[] = [
  {
    id: 't-1',
    subject: 'Physics',
    question: 'What is the SI unit of electric potential difference (electromotive force)?',
    options: ['Ampere (A)', 'Volt (V)', 'Ohm (Ω)', 'Watt (W)'],
    correctIndex: 1,
    explanation: 'Electric potential difference and EMF are measured in Volts (V), defined as 1 Joule per Coulomb.',
    points: 20
  },
  {
    id: 't-2',
    subject: 'Biology',
    question: 'Which blood vessel carries oxygenated blood from the lungs directly to the left atrium of the heart?',
    options: ['Pulmonary Artery', 'Pulmonary Vein', 'Vena Cava', 'Aorta'],
    correctIndex: 1,
    explanation: 'The Pulmonary Vein is the only vein in the human circulatory system that transports oxygenated blood.',
    points: 25
  },
  {
    id: 't-3',
    subject: 'Chemistry',
    question: 'What is the oxidation state of sulfur in concentrated Sulfuric Acid (H₂SO₄)?',
    options: ['+4', '+6', '-2', '+2'],
    correctIndex: 1,
    explanation: '2(+1) + S + 4(-2) = 0 => +2 + S - 8 = 0 => S = +6.',
    points: 30
  },
  {
    id: 't-4',
    subject: 'History',
    question: 'In which year did the Tanganyika African National Union (TANU) formally lead Tanganyika to independence?',
    options: ['1960', '1961', '1964', '1977'],
    correctIndex: 1,
    explanation: 'Tanganyika achieved national independence on 9th December 1961.',
    points: 20
  },
  {
    id: 't-5',
    subject: 'Mathematics',
    question: 'What is the sum of interior angles of a regular hexagon (6 sides)?',
    options: ['360°', '540°', '720°', '900°'],
    correctIndex: 2,
    explanation: 'Sum = (n - 2) × 180° = (6 - 2) × 180° = 4 × 180° = 720°.',
    points: 25
  }
];

export interface PronunciationTerm {
  id: string;
  term: string;
  phonetic: string;
  language: string;
  subject: string;
  swahiliMeaning: string;
  definition: string;
}

export const PRONUNCIATION_TERMS: PronunciationTerm[] = [
  {
    id: 'pr-1',
    term: 'Photosynthesis',
    phonetic: 'foh-toh-SIN-thuh-sis',
    language: 'en',
    subject: 'Biology',
    swahiliMeaning: 'Mchakato wa mimea kujitengenezea chakula kwa mwanga',
    definition: 'Process by which green plants and organisms synthesize nutrients from CO₂ and water.'
  },
  {
    id: 'pr-2',
    term: 'Uchavushaji',
    phonetic: 'oo-chah-voo-SHAH-jee',
    language: 'sw',
    subject: 'Biolojia (Swahili)',
    swahiliMeaning: 'Uhamishaji wa chavua kutoka chavulio hadi kwenye kepi',
    definition: 'Pollination: transfer of pollen grains from anther to stigma.'
  },
  {
    id: 'pr-3',
    term: 'Stoichiometry',
    phonetic: 'stoy-kee-AH-muh-tree',
    language: 'en',
    subject: 'Chemistry',
    swahiliMeaning: 'Hesabu za idadi ya molekuli katika mmenyuko wa kikemia',
    definition: 'The quantitative relationship between reactants and products in a chemical reaction.'
  },
  {
    id: 'pr-4',
    term: 'Kani ya Mvutano',
    phonetic: 'KAH-nee yah mvoo-TAH-noh',
    language: 'sw',
    subject: 'Fizikia (Swahili)',
    swahiliMeaning: 'Nguvu inayovuta vitu kuelekea kitovu cha dunia',
    definition: 'Gravitational Force: the mutual attraction between masses.'
  },
  {
    id: 'pr-5',
    term: 'Diffraction',
    phonetic: 'dih-FRAK-shun',
    language: 'en',
    subject: 'Physics',
    swahiliMeaning: 'Kupinda kwa mawimbi yanapopita kwenye kizuizi au mpasuko mwembamba',
    definition: 'The bending of light or sound waves around corners or narrow obstacles.'
  },
  {
    id: 'pr-6',
    term: 'Endothermic',
    phonetic: 'en-doh-THUR-mik',
    language: 'en',
    subject: 'Chemistry',
    swahiliMeaning: 'Mmenyuko unaonyonya joto kutoka kwenye mazingira',
    definition: 'A chemical reaction or process accompanied by the absorption of heat.'
  }
];

export interface CrosswordClue {
  num: number;
  direction: 'across' | 'down';
  word: string;
  clue: string;
  x: number;
  y: number;
}

export const CROSSWORD_PUZZLE = {
  gridSize: 7,
  clues: [
    { num: 1, direction: 'across', word: 'ATOM', clue: 'Smallest particle of an element retaining chemical identity (4 letters)', x: 0, y: 1 },
    { num: 2, direction: 'across', word: 'FORCE', clue: 'An interaction that causes mass to accelerate, measured in Newtons (5 letters)', x: 1, y: 3 },
    { num: 3, direction: 'across', word: 'MOLE', clue: 'SI base unit of chemical amount with 6.022×10²³ entities (4 letters)', x: 2, y: 5 },
    { num: 1, direction: 'down', word: 'ACID', clue: 'Proton donor having a pH below 7 (4 letters)', x: 0, y: 1 },
    { num: 4, direction: 'down', word: 'CELL', clue: 'Basic structural and functional unit of all living organisms (4 letters)', x: 4, y: 0 }
  ] as CrosswordClue[]
};

export const WORD_SEARCH_WORDS = [
  'ENERGY',
  'FORCE',
  'GRAVITY',
  'CELL',
  'MOLE',
  'VECTOR',
  'OSMOSIS'
];

export const WORD_SEARCH_GRID = [
  ['E', 'N', 'E', 'R', 'G', 'Y', 'A', 'B'],
  ['F', 'O', 'R', 'C', 'E', 'M', 'N', 'V'],
  ['G', 'R', 'A', 'V', 'I', 'T', 'Y', 'E'],
  ['X', 'P', 'C', 'E', 'L', 'L', 'Z', 'C'],
  ['Q', 'O', 'S', 'M', 'O', 'S', 'I', 'S'],
  ['M', 'O', 'L', 'E', 'K', 'L', 'O', 'O'],
  ['V', 'E', 'C', 'T', 'O', 'R', 'P', 'R'],
  ['W', 'A', 'V', 'E', 'J', 'O', 'U', 'L']
];

export interface ExamSimQuestion {
  id: number;
  section: 'A' | 'B';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  marks: number;
}

export const EXAM_SIM_DATA: ExamSimQuestion[] = [
  {
    id: 1,
    section: 'A',
    question: 'Which of the following physical quantities is a fundamental SI base quantity?',
    options: ['Velocity', 'Thermodynamic Temperature', 'Force', 'Electric Resistance'],
    correctAnswer: 1,
    explanation: 'Temperature (Kelvin) is one of the 7 SI fundamental base quantities.',
    marks: 1
  },
  {
    id: 2,
    section: 'A',
    question: 'A car starts from rest and accelerates uniformly at 2 m/s² for 5 seconds. What is its final velocity?',
    options: ['5 m/s', '10 m/s', '15 m/s', '20 m/s'],
    correctAnswer: 1,
    explanation: 'v = u + at = 0 + (2 × 5) = 10 m/s.',
    marks: 1
  },
  {
    id: 3,
    section: 'A',
    question: 'The reagent used to test for the presence of reducing sugars such as glucose is:',
    options: ['Iodine Solution', 'Benedict’s Solution', 'Biuret Reagent', 'DCPIP'],
    correctAnswer: 1,
    explanation: 'Benedict’s solution produces a brick-red precipitate when boiled with reducing sugars.',
    marks: 1
  },
  {
    id: 4,
    section: 'B',
    question: 'Calculate the volume occupied by 0.5 moles of carbon dioxide gas at STP (Molar volume = 22.4 dm³/mol).',
    options: ['5.6 dm³', '11.2 dm³', '22.4 dm³', '44.8 dm³'],
    correctAnswer: 1,
    explanation: 'Volume = moles × 22.4 dm³ = 0.5 × 22.4 = 11.2 dm³.',
    marks: 2
  },
  {
    id: 5,
    section: 'B',
    question: 'State Archimedes’ Principle regarding buoyant upthrust force on a submerged body.',
    options: [
      'Upthrust equals total weight of the body',
      'Upthrust equals the weight of fluid displaced by the submerged body',
      'Pressure decreases with depth in fluids',
      'Floating bodies experience zero gravity'
    ],
    correctAnswer: 1,
    explanation: 'Archimedes’ principle: A body immersed in fluid experiences an upward buoyant force equal to the weight of fluid displaced.',
    marks: 2
  }
];

export interface DailyChallengeItem {
  date: string;
  subject: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  communityCorrectPercent: number;
  xpReward: number;
}

export const DAILY_PRACTICE_CHALLENGE: DailyChallengeItem = {
  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  subject: 'Physics & General Science',
  title: 'Daily NECTA Concept Buster',
  question: 'Why does a convex lens converge parallel rays of light while a concave lens diverges them?',
  options: [
    'Convex lens is thicker in the center causing refraction toward the principal axis',
    'Concave lens absorbs light while convex reflects it',
    'Convex lens has negative focal length',
    'Light travels faster inside glass than in air'
  ],
  correctIndex: 0,
  explanation: 'Because a convex lens is thicker at its center than at its edges, the rays striking the outer portions are refracted inward toward the principal focus, causing convergence.',
  communityCorrectPercent: 84,
  xpReward: 50
};
