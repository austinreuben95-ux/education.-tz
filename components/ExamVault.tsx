import React, { useState } from 'react';

export interface ExamItem {
  id: string;
  title: string;
  level: 'PSLE' | 'FTNA' | 'CSEE' | 'ACSEE';
  levelFull: string;
  subject: string;
  year: string;
  examType: 'National NECTA' | 'Regional Mock' | 'Terminal Exam';
  questionCount: number;
  durationMinutes: number;
  pdfQuestionsUrl?: string;
  pdfMarkingSchemeUrl?: string;
  examinerReport: {
    summary: string;
    commonPitfalls: string[];
    examinerAdvice: string;
  };
  sampleQuestions: {
    qNum: number;
    question: string;
    options?: string[];
    answerKey: string;
    markingNotes: string;
  }[];
}

const EXAM_VAULT_DATA: ExamItem[] = [
  {
    id: 'csee-math-2023',
    title: 'CSEE Mathematics 2023 Paper 1',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Mathematics',
    year: '2023',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Overall candidate performance was satisfactory, with 68.4% passing. However, many lost marks in Quadratic Equations and Trigonometric ratios.',
      commonPitfalls: [
        'Failing to simplify radical expressions before substituting values.',
        'Misinterpreting word problems involving simultaneous linear equations.',
        'Ignoring negative square roots in quadratic formula steps.'
      ],
      examinerAdvice: 'Candidates must show all clear working steps. Marks are awarded for method even if final arithmetic contains minor errors.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Solve for x: 2x² - 5x + 2 = 0 using the quadratic formula.',
        options: ['x = 2 or x = 0.5', 'x = -2 or x = -0.5', 'x = 3 or x = 1', 'x = 5 or x = 2'],
        answerKey: 'x = 2 or x = 0.5',
        markingNotes: 'Award 1 mark for correct formula setup, 1 mark for discriminant evaluation (b²-4ac = 9), 1 mark for correct roots.'
      },
      {
        qNum: 2,
        question: 'A ladder 5m long rests against a vertical wall. If the foot of the ladder is 3m from the base, find the height reached.',
        options: ['4 meters', '3.5 meters', '2.5 meters', '4.5 meters'],
        answerKey: '4 meters',
        markingNotes: 'Use Pythagoras theorem: h = √(5² - 3²) = √16 = 4m. Award full marks for labeled diagram and working.'
      }
    ]
  },
  {
    id: 'csee-phy-2023',
    title: 'CSEE Physics 1 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Physics',
    year: '2023',
    examType: 'National NECTA',
    questionCount: 11,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Candidates performed strongly in Mechanics but struggled in Current Electricity circuits and Electromagnetic induction calculations.',
      commonPitfalls: [
        'Forgetting SI unit labels in final numerical responses (e.g., writing 20 instead of 20 Amperes or 20 A).',
        'Incorrect parallel resistor combination formula setup (1/Rt = 1/R1 + 1/R2).',
        'Confusing Snell Law angle of incidence with angle to the mirror surface.'
      ],
      examinerAdvice: 'Always state the physics principle or formula first before plugging in numerical values with proper SI units.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Calculate the total resistance when two 6Ω resistors are connected in parallel.',
        options: ['3 Ω', '12 Ω', '6 Ω', '1.5 Ω'],
        answerKey: '3 Ω',
        markingNotes: '1/Rt = 1/6 + 1/6 = 2/6 = 1/3 => Rt = 3 Ω. Penalty of 0.5 marks for omitting the Ohm symbol.'
      }
    ]
  },
  {
    id: 'ftna-sci-2023',
    title: 'FTNA Basic Science 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'Science',
    year: '2023',
    examType: 'National NECTA',
    questionCount: 8,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Performance was high across urban regions. Rural candidates showed weakness in plant cell diagram labeling.',
      commonPitfalls: [
        'Confusing cell wall (plant cells only) with cell membrane (both plant and animal cells).',
        'Incomplete balancing of chemical reaction equations.'
      ],
      examinerAdvice: 'Practice drawing neat, labeled diagrams with straight guidelines and clear title captions.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Which organelle is responsible for cellular respiration and energy production in ATP form?',
        options: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi Apparatus'],
        answerKey: 'Mitochondria',
        markingNotes: 'Mitochondria. Full mark for correct spelling.'
      }
    ]
  },
  {
    id: 'psle-math-2023',
    title: 'PSLE Hisabati (Mathematics) 2023',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'Mathematics',
    year: '2023',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Kiwango cha ufaulu kilikuwa 74.2%. Watahiniwa wengi walipoteza alama kwenye maswali ya sehemu na asilimia.',
      commonPitfalls: [
        'Kutobadili sehemu mseto kuwa sehemu za kawaida kabla ya kuzidisha au kugawanya.',
        'Kutoelewa tofauti ya eneo la mduara na mzingo wa mduara.'
      ],
      examinerAdvice: 'Wanafunzi wasome swali kwa makini na kukagua majibu yao kabla ya kukabidhi karatasi.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Tafuta eneo la mstatili wenye urefu wa sm 12 na upana wa sm 8.',
        options: ['sm² 96', 'sm 40', 'sm² 48', 'sm² 20'],
        answerKey: 'sm² 96',
        markingNotes: 'Eneo = Urefu × Upana = 12 × 8 = sm² 96.'
      }
    ]
  },
  {
    id: 'acsee-chem-2023',
    title: 'ACSEE Chemistry Paper 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Chemistry',
    year: '2023',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'High performance in Physical Chemistry, moderate in Organic mechanisms (electrophilic additions).',
      commonPitfalls: [
        'Omitting curved arrows indicating electron pair movement in organic reaction mechanisms.',
        'Incorrect unit conversions in gas constant R calculations (J mol⁻¹ K⁻¹ vs L atm mol⁻¹ K⁻¹).'
      ],
      examinerAdvice: 'Re-read thermodynamic state definitions and ensure unit consistency in all physical equations.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'State Le Chatelier Principle regarding chemical equilibrium in dynamic systems.',
        options: [
          'If a system at equilibrium is disturbed, the equilibrium shifts to counteract the disturbance.',
          'Energy cannot be created or destroyed in chemical reactions.',
          'The rate of reaction is directly proportional to reactant concentration.',
          'Gases at the same temperature have identical kinetic energies.'
        ],
        answerKey: 'If a system at equilibrium is disturbed, the equilibrium shifts to counteract the disturbance.',
        markingNotes: 'Exact state definition awarded 2 marks.'
      }
    ]
  }
];

export interface NectaCandidateResult {
  indexNumber: string;
  name: string;
  school: string;
  centerNo: string;
  level: 'PSLE' | 'FTNA' | 'CSEE' | 'ACSEE';
  year: string;
  division: string;
  points: number;
  gpa: string;
  remarks: string;
  subjects: { code: string; name: string; grade: 'A' | 'B' | 'C' | 'D' | 'F'; points: number }[];
}

const DEMO_NECTA_RESULTS: NectaCandidateResult[] = [
  {
    indexNumber: 'S0101/0001',
    name: 'Amina Juma Hassan',
    school: 'KILIMANJARO SECONDARY SCHOOL',
    centerNo: 'S0101',
    level: 'CSEE',
    year: '2023',
    division: 'DIVISION I (POINT 7)',
    points: 7,
    gpa: '1.00',
    remarks: 'EXCELLENT PERFORMANCE - QUALIFIED FOR A-LEVEL SCIENCE COMBINATION',
    subjects: [
      { code: '011', name: 'CIVICS', grade: 'A', points: 1 },
      { code: '012', name: 'HISTORY', grade: 'A', points: 1 },
      { code: '013', name: 'GEOGRAPHY', grade: 'A', points: 1 },
      { code: '021', name: 'KISWAHILI', grade: 'A', points: 1 },
      { code: '022', name: 'ENGLISH LANGUAGE', grade: 'A', points: 1 },
      { code: '031', name: 'PHYSICS', grade: 'A', points: 1 },
      { code: '032', name: 'CHEMISTRY', grade: 'A', points: 1 },
      { code: '033', name: 'BIOLOGY', grade: 'A', points: 1 },
      { code: '041', name: 'BASIC MATHEMATICS', grade: 'A', points: 1 }
    ]
  },
  {
    indexNumber: 'S0102/0045',
    name: 'Baraka Joseph Mwangi',
    school: 'AZANIA SECONDARY SCHOOL',
    centerNo: 'S0102',
    level: 'CSEE',
    year: '2023',
    division: 'DIVISION I (POINT 14)',
    points: 14,
    gpa: '2.00',
    remarks: 'VERY GOOD PERFORMANCE - QUALIFIED FOR HIGH SCHOOL COMBINATION (PCM / PGM)',
    subjects: [
      { code: '011', name: 'CIVICS', grade: 'B', points: 2 },
      { code: '012', name: 'HISTORY', grade: 'B', points: 2 },
      { code: '013', name: 'GEOGRAPHY', grade: 'B', points: 2 },
      { code: '021', name: 'KISWAHILI', grade: 'A', points: 1 },
      { code: '022', name: 'ENGLISH LANGUAGE', grade: 'B', points: 2 },
      { code: '031', name: 'PHYSICS', grade: 'B', points: 2 },
      { code: '032', name: 'CHEMISTRY', grade: 'A', points: 1 },
      { code: '033', name: 'BIOLOGY', grade: 'B', points: 2 },
      { code: '041', name: 'BASIC MATHEMATICS', grade: 'B', points: 2 }
    ]
  },
  {
    indexNumber: 'S0202/0012',
    name: 'Grace Emmanuel Mollel',
    school: 'TABORA GIRLS SECONDARY SCHOOL',
    centerNo: 'S0202',
    level: 'ACSEE',
    year: '2023',
    division: 'DIVISION I (POINT 4)',
    points: 4,
    gpa: '1.33',
    remarks: 'PCB COMBINATION - QUALIFIED FOR UNIVERSITY DEGREE IN MEDICINE (MD)',
    subjects: [
      { code: '131', name: 'PHYSICS', grade: 'A', points: 1 },
      { code: '132', name: 'CHEMISTRY', grade: 'A', points: 1 },
      { code: '133', name: 'BIOLOGY', grade: 'B', points: 2 },
      { code: '111', name: 'GENERAL STUDIES', grade: 'C', points: 3 },
      { code: '141', name: 'BASIC APPLIED MATHEMATICS', grade: 'B', points: 2 }
    ]
  },
  {
    indexNumber: 'P0101/0005',
    name: 'Faraja Kelvin Mshana',
    school: 'MBOZI PRIMARY SCHOOL',
    centerNo: 'P0101',
    level: 'PSLE',
    year: '2023',
    division: 'GRADE A (AVERAGE 245/300)',
    points: 245,
    gpa: 'A',
    remarks: 'SELECTED FOR FORM 1 AT SPECIAL NATIONAL TALENT SCHOOL (ILBORO)',
    subjects: [
      { code: '01', name: 'HISABATI (MATHEMATICS)', grade: 'A', points: 48 },
      { code: '02', name: 'KISWAHILI', grade: 'A', points: 50 },
      { code: '03', name: 'ENGLISH LANGUAGE', grade: 'A', points: 47 },
      { code: '04', name: 'SAYANSI NA TEKNOLOJIA', grade: 'A', points: 49 },
      { code: '05', name: 'MAARIFA YA JAMII', grade: 'A', points: 46 },
      { code: '06', name: 'URAIA NA MAADILI', grade: 'A', points: 45 }
    ]
  }
];

export interface ExamStrategyGuide {
  level: 'PSLE' | 'CSEE' | 'ACSEE';
  title: string;
  badge: string;
  subtitle: string;
  targetAudience: string;
  keyFocusAreas: string[];
  commonPitfalls: {
    id: string;
    title: string;
    subject: string;
    description: string;
    mistakeExample: string;
    solution: string;
    marksLost: string;
  }[];
  scoringTips: {
    title: string;
    tip: string;
    actionableStep: string;
  }[];
}

const EXAM_STRATEGY_DATA: Record<'PSLE' | 'CSEE' | 'ACSEE', ExamStrategyGuide> = {
  PSLE: {
    level: 'PSLE',
    title: 'Primary School Leaving Examination (PSLE / Standard 7) Strategy',
    badge: 'Std 7 National Exam',
    subtitle: 'Master multiple-choice speed, OMR shading accuracy, and word-problem comprehension for top secondary school selection.',
    targetAudience: 'Standard 7 Candidates, Primary Teachers & Parents',
    keyFocusAreas: [
      'OMR Sheet Error Prevention',
      'Hisabati (Math) Word Problem Parsing',
      'Kiswahili & English Grammar Precision',
      'Sayansi Diagram Identification'
    ],
    commonPitfalls: [
      {
        id: 'psle-1',
        title: 'Misinterpreting Hisabati Word Problems & Unit Confusion',
        subject: 'Hisabati (Mathematics)',
        description: 'Candidates confuse perimeter and area formulas or calculate answers without converting units (e.g. centimeters to meters).',
        mistakeExample: 'Calculating Area = 2 × (L + W) instead of Area = L × W, or adding 50cm and 2m without converting.',
        solution: 'Always underline key terms ("Mzunguko" vs "Eneo") and convert all measurements to the same unit before computing.',
        marksLost: 'Up to 20% of Math Paper Marks'
      },
      {
        id: 'psle-2',
        title: 'OMR Answer Sheet Shading & Double Marking Errors',
        subject: 'All Subjects (OMR Sheet)',
        description: 'Light or incomplete pencil marks, or accidentally shading two circles for a single question causes optical scanners to invalidate the answer.',
        mistakeExample: 'Using a hard HB/2H pencil lightly, or leaving erasure marks in another circle.',
        solution: 'Use a soft HB pencil, shade fully inside the circle, and erase completely if changing an answer.',
        marksLost: '1-5 Entire Questions Invalidated'
      },
      {
        id: 'psle-3',
        title: 'Passage Comprehension Rushing in English & Kiswahili',
        subject: 'Languages (English & Kiswahili)',
        description: 'Answering comprehension questions based on general knowledge or assumptions rather than facts stated directly in the text passage.',
        mistakeExample: 'Choosing an answer that sounds logically true in real life but is not supported by the passage.',
        solution: 'Read the comprehension passage TWICE. Locate and underline the exact sentence that proves your chosen option.',
        marksLost: '4-8 Marks per Language Paper'
      },
      {
        id: 'psle-4',
        title: 'Misidentifying Organ Functions in Sayansi na Teknolojia',
        subject: 'Sayansi (Science & Tech)',
        description: 'Confusing digestive system organs, plant reproduction parts, or simple circuit polarity.',
        mistakeExample: 'Mixing up the role of small intestine (Ufyonzaji) with stomach (Umenyaji).',
        solution: 'Memorize clear primary functions for each biological system using visual flashcards and diagrams.',
        marksLost: '3-6 Key Science Marks'
      }
    ],
    scoringTips: [
      {
        title: 'Process of Elimination for 4-Option MCQs',
        tip: 'Cross off the two obviously incorrect options first.',
        actionableStep: 'If stuck between two choices, re-read the precise wording in the question stem.'
      },
      {
        title: 'Time Allocation Rule (1 Minute Per Question)',
        tip: 'Do not spend more than 2 minutes on a single difficult math question.',
        actionableStep: 'Circle hard questions and return to them after completing all easy questions.'
      },
      {
        title: 'Final 10-Minute OMR Audit',
        tip: 'Verify that question number 25 on your question paper matches bubble 25 on the answer sheet.',
        actionableStep: 'Check for offset shading slips that shift your answers down by one row.'
      }
    ]
  },
  CSEE: {
    level: 'CSEE',
    title: 'Form 4 CSEE Examination Strategy & Examiner Pitfall Guide',
    badge: 'Form 4 National Exam',
    subtitle: 'Learn exact NECTA marking criteria, unit deduction rules, essay structure frameworks, and practical data handling.',
    targetAudience: 'Form 4 Candidates, Teachers & Subject Department Heads',
    keyFocusAreas: [
      'NECTA Unit & Formula Penalty Prevention',
      'Structured Essay Formatting (Arts & Humanities)',
      'Science Practical Data & Graph Precision',
      'Command Verbs Decoding (State vs Explain vs Evaluate)'
    ],
    commonPitfalls: [
      {
        id: 'csee-1',
        title: 'Omitting Units & Skipping Intermediate Working in Math & Physics',
        subject: 'Basic Mathematics & Physics',
        description: 'NECTA marking schemes strictly penalize missing units (e.g., N, m/s², cm³) and un-boxed final answers.',
        mistakeExample: 'Writing "Velocity = 25" without "m/s", or writing down only the final answer without showing the formula used.',
        solution: 'Follow the 4-step answer format: 1. Formula, 2. Values Substituted, 3. Calculation Steps, 4. Answer with Units in a Box.',
        marksLost: '0.5 to 1.5 Marks per Calculation Question'
      },
      {
        id: 'csee-2',
        title: 'Unstructured Essays Without Introduction & Local Examples in History/Geography',
        subject: 'History, Geography & Civics',
        description: 'Writing wall-of-text paragraphs without a clear thesis statement, distinct paragraph breaks, or relevant Tanzanian case studies.',
        mistakeExample: 'Writing a 2-page continuous essay without headings, introduction, or citing examples like Mchuchuma, Stiegler’s Gorge, or SADC.',
        solution: 'Use the 1+5+1 Essay Rule: 1 Paragraph Intro (definition + scope), 5 Point Paragraphs (Point + Explanation + Example), 1 Conclusion.',
        marksLost: 'Up to 40% of Section C Essay Marks'
      },
      {
        id: 'csee-3',
        title: 'Incorrect Diagram Labeling in Biology & Chemistry',
        subject: 'Biology & Chemistry',
        description: 'Drawing biological diagrams using freehand unruled pointer lines, crossing lines, or omitting capitalized diagram titles.',
        mistakeExample: 'Drawing a cell diagram without a title like "DIAGRAM OF A PLANT CELL" or drawing slanted, crossing label lines.',
        solution: 'Use a ruler for horizontal label lines, never cross lines, write titles in BLOCK CAPITALS, and draw with a sharp pencil.',
        marksLost: '2-4 Marks per Diagram Question'
      },
      {
        id: 'csee-4',
        title: 'Chemistry Titration Data & Rounding Anomalies',
        subject: 'Chemistry Practical & Alternative to Practical',
        description: 'Recording titration volumes with inconsistent decimal places or reporting titre values that vary by more than 0.2 cm³.',
        mistakeExample: 'Writing burette readings as "24.5" instead of "24.50" or averaging non-concordant titres.',
        solution: 'Record all burette readings to 2 decimal places ending in .00 or .50, and ensure concordant values within 0.20 cm³.',
        marksLost: 'Full Practical Table Marks (5-8 Marks)'
      }
    ],
    scoringTips: [
      {
        title: 'Decode NECTA Command Verbs',
        tip: '"State" = brief phrase; "Explain" = statement + cause + effect; "Evaluate" = pros + cons + verdict.',
        actionableStep: 'Never write a 1-page essay when the prompt says "State 3 factors". Match answer depth to verb & marks.'
      },
      {
        title: 'Section Strategy for Division 1 Points',
        tip: 'Section A & B carry compulsory foundation marks; secure 100% of short-answer marks before tackling Section C.',
        actionableStep: 'Complete Section A multiple choice and short answers in the first 45 minutes.'
      },
      {
        title: 'Calculation Partial Credit Safety Net',
        tip: 'Even if your arithmetic is wrong, writing the correct formula earns up to 50% method marks.',
        actionableStep: 'Always state the general formula (e.g., F = ma) before plugging in numbers.'
      }
    ]
  },
  ACSEE: {
    level: 'ACSEE',
    title: 'Form 6 ACSEE Advanced Level Strategy & Examiner Masterclass',
    badge: 'Form 6 High School Exam',
    subtitle: 'Master university-entrance combination strategies, deep analytical essays, advanced proof rigor, and practical error analysis.',
    targetAudience: 'Form 6 Candidates, High School Combination Tutors & Head Teachers',
    keyFocusAreas: [
      'Advanced Essay Rigor in GS & Humanities',
      'Rigorous Mathematical Proofs & Differentiation',
      'Practical Paper Error Analysis & Line of Best Fit Graphs',
      'Combination Point Optimization (PCB, PCM, EGM, HGL, HKL)'
    ],
    commonPitfalls: [
      {
        id: 'acsee-1',
        title: 'Shallow Policy References in General Studies (GS) & Economics',
        subject: 'General Studies (GS) & Economics',
        description: 'Candidates write generic opinions without citing official national policies, UN/AU frameworks, or economic data.',
        mistakeExample: 'Discussing industrialization without referencing Tanzania Development Vision 2025, FYDP III, or SADC trade agreements.',
        solution: 'Incorporate named policy frameworks, statistics, and current global/regional socio-economic events into every major essay.',
        marksLost: '5-10 Marks on GS & Economics Essays'
      },
      {
        id: 'acsee-2',
        title: 'Skipping Proof Steps & Sign Errors in Advanced Mathematics',
        subject: 'Advanced Mathematics & BAM',
        description: 'Skipping intermediate algebraic steps in calculus, integration by parts, or complex number derivations.',
        mistakeExample: 'Jumping straight from integration setup to final answer without showing substitution or limits evaluation.',
        solution: 'Show every step explicitly. High level examiners award marks per logical line of mathematical deduction.',
        marksLost: '3-6 Marks on 10-Mark Math Questions'
      },
      {
        id: 'acsee-3',
        title: 'Flawed Graph Axis Scaling & Best Fit Lines in Physics Paper 3',
        subject: 'Physics Practical (Paper 3A/3B)',
        description: 'Using awkward graph scale ratios (e.g. 1 unit = 3 cm), plotting points inaccurately, or drawing forced best-fit lines.',
        mistakeExample: 'Choosing scales like 1:3 or 1:7 that make plotting points difficult, or drawing a zig-zag line instead of a smooth straight line.',
        solution: 'Use standard scale factors (1:1, 1:2, 1:5, 1:10), ensure plotted points cover >50% of graph paper, and calculate slope using large triangles.',
        marksLost: '6-10 Marks on Physics Practical Graphs'
      },
      {
        id: 'acsee-4',
        title: 'Omitting Electron Push Arrows & Reaction Intermediate States in Organic Chemistry',
        subject: 'Chemistry Paper 1 & 2',
        description: 'Writing overall organic reactions without showing mechanism electron flow, carbocation intermediates, or catalyst conditions.',
        mistakeExample: 'Writing electrophilic addition of HBr to alkene without drawing the curved electron movement arrows.',
        solution: 'Practice step-by-step mechanism mechanisms showing full arrow movements from electron-rich to electron-poor centers.',
        marksLost: '4-8 Marks in Organic Chemistry'
      }
    ],
    scoringTips: [
      {
        title: 'Precision in Practical Data Tables',
        tip: 'In Science Paper 3, record raw measurements to the exact precision of the instrument.',
        actionableStep: 'Burette readings to 2 decimal places; stopwatches to 1 or 2 decimal places; micrometer screw gauge to 0.01 mm.'
      },
      {
        title: 'Master Advanced Command Verbs',
        tip: '"Critically Analyze" requires analyzing underlying assumptions, counter-arguments, and synthesizing a balanced conclusion.',
        actionableStep: 'Structure advanced essays with a clear thematic framework rather than random list points.'
      },
      {
        title: 'Combination Strategy & Principal Pass Planning',
        tip: 'Ensure all 3 combination subjects score Grade C or higher to secure university direct entry cut-offs.',
        actionableStep: 'Balance study hours according to subject credit weights and weak topics identified in Mocks.'
      }
    ]
  }
};

const ExamVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PAPERS' | 'RESULTS' | 'CALCULATOR' | 'STRATEGY'>('PAPERS');
  const [selectedStrategyLevel, setSelectedStrategyLevel] = useState<'PSLE' | 'CSEE' | 'ACSEE'>('CSEE');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [cbtMode, setCbtMode] = useState<boolean>(false);
  const [cbtAnswers, setCbtAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // NECTA Results Lookup state
  const [searchIndex, setSearchIndex] = useState<string>('');
  const [foundCandidate, setFoundCandidate] = useState<NectaCandidateResult | null>(DEMO_NECTA_RESULTS[0]);
  const [searchError, setSearchError] = useState<string>('');

  // Division Calculator state
  const [calcGrades, setCalcGrades] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'F'>>({
    'CIVICS': 'A',
    'HISTORY': 'B',
    'GEOGRAPHY': 'B',
    'KISWAHILI': 'A',
    'ENGLISH': 'A',
    'PHYSICS': 'B',
    'CHEMISTRY': 'A',
    'BIOLOGY': 'B',
    'BASIC MATH': 'B'
  });

  const handleSearchResult = (indexToSearch?: string) => {
    const query = (indexToSearch || searchIndex).trim().toUpperCase();
    if (!query) {
      setSearchError('Please enter a candidate index number (e.g. S0101/0001).');
      return;
    }
    const match = DEMO_NECTA_RESULTS.find(c => c.indexNumber.toUpperCase() === query);
    if (match) {
      setFoundCandidate(match);
      setSearchError('');
    } else {
      setSearchError(`No candidate found for index "${query}". Try S0101/0001, S0102/0045, S0202/0012, or P0101/0005.`);
    }
  };

  const calculateCseePoints = () => {
    const gradeValues: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, F: 5 };
    const pointsList = Object.values(calcGrades).map(g => gradeValues[String(g)] || 5);
    pointsList.sort((a, b) => a - b);
    const best7 = pointsList.slice(0, 7);
    const sum = best7.reduce((acc, curr) => acc + curr, 0);

    let div = 'DIVISION I';
    if (sum >= 7 && sum <= 17) div = 'DIVISION I';
    else if (sum >= 18 && sum <= 21) div = 'DIVISION II';
    else if (sum >= 22 && sum <= 25) div = 'DIVISION III';
    else if (sum >= 26 && sum <= 31) div = 'DIVISION IV';
    else div = 'FAIL / DIVISION 0';

    return { sum, div, best7Count: best7.length };
  };

  const filteredExams = EXAM_VAULT_DATA.filter((item) => {
    if (selectedLevel !== 'ALL' && item.level !== selectedLevel) return false;
    if (selectedSubject !== 'ALL' && !item.subject.toLowerCase().includes(selectedSubject.toLowerCase())) return false;
    if (selectedYear !== 'ALL' && item.year !== selectedYear) return false;
    return true;
  });

  const handleStartCbt = (exam: ExamItem) => {
    setActiveExam(exam);
    setCbtMode(true);
    setCbtAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (qNum: number, ans: string) => {
    setCbtAnswers(prev => ({ ...prev, [qNum]: ans }));
  };

  const calculateCbtScore = () => {
    if (!activeExam) return 0;
    let correct = 0;
    activeExam.sampleQuestions.forEach(q => {
      if (cbtAnswers[q.qNum] === q.answerKey) correct++;
    });
    return Math.round((correct / activeExam.sampleQuestions.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Banner */}
      <div className="bg-vibrant-gradient text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 font-extrabold text-xs uppercase tracking-wider border border-white/20">
            <i className="fa-solid fa-file-signature"></i> NECTA Official Exam Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            National Exam Vault, Marking Schemes & Examiner Reports
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Access authentic NECTA past papers, regional Mocks, official marking keys, and <strong className="text-amber-300">CIRA Examiner Reports</strong> revealing exactly where candidates lose marks.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('PAPERS')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
            activeTab === 'PAPERS'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <i className="fa-solid fa-file-pdf"></i> Past Papers & Marking Schemes
        </button>
        <button
          onClick={() => setActiveTab('RESULTS')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
            activeTab === 'RESULTS'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <i className="fa-solid fa-square-poll-vertical"></i> NECTA Results Portal & Statement Lookup
        </button>
        <button
          onClick={() => setActiveTab('CALCULATOR')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
            activeTab === 'CALCULATOR'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <i className="fa-solid fa-calculator"></i> NECTA Division & Points Calculator
        </button>
        <button
          onClick={() => setActiveTab('STRATEGY')}
          className={`px-5 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
            activeTab === 'STRATEGY'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-200 scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <i className="fa-solid fa-lightbulb"></i> Exam Strategy & Examiner Pitfalls
        </button>
      </div>

      {/* TAB 2: NECTA Results Portal */}
      {activeTab === 'RESULTS' && (
        <div className="space-y-6 animate-fade-in">
          {/* Index Search Box */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass text-emerald-600"></i> Candidate Result Search
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Enter candidate examination index number (e.g. S0101/0001 or P0101/0005)
                </p>
              </div>

              {/* Sample Quick Demo Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold text-gray-400">Try Demos:</span>
                {DEMO_NECTA_RESULTS.map(demo => (
                  <button
                    key={demo.indexNumber}
                    onClick={() => {
                      setSearchIndex(demo.indexNumber);
                      handleSearchResult(demo.indexNumber);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[11px] hover:bg-emerald-100 transition"
                  >
                    {demo.indexNumber}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchIndex}
                onChange={(e) => setSearchIndex(e.target.value)}
                placeholder="Enter Index Number e.g. S0101/0001"
                className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-black outline-none focus:border-emerald-500 focus:bg-white transition"
              />
              <button
                onClick={() => handleSearchResult()}
                className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-md hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <i className="fa-solid fa-search"></i> Check Result
              </button>
            </div>

            {searchError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-red-500"></i> {searchError}
              </div>
            )}
          </div>

          {/* Statement of Results Output Card */}
          {foundCandidate && (
            <div className="bg-white rounded-3xl p-8 border-2 border-emerald-200 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-sm">
                OFFICIAL NECTA RESULT STATEMENT
              </div>

              {/* Header Info */}
              <div className="border-b border-gray-100 pb-6 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xl">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                      {foundCandidate.level} EXAMINATION RESULTS • {foundCandidate.year}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900">{foundCandidate.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-bold block">INDEX NUMBER:</span>
                    <strong className="text-gray-900 font-black">{foundCandidate.indexNumber}</strong>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-bold block">SCHOOL / CENTER:</span>
                    <strong className="text-gray-900 font-black">{foundCandidate.school} ({foundCandidate.centerNo})</strong>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-emerald-700 font-bold block">OVERALL PERFORMANCE:</span>
                    <strong className="text-emerald-950 font-black text-sm">{foundCandidate.division}</strong>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="space-y-3">
                <h4 className="font-black text-gray-900 text-sm flex items-center justify-between">
                  <span>Subject Performance Breakdown:</span>
                  <span className="text-xs text-gray-500 font-normal">Standard NECTA Grading Scale</span>
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-black">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Subject Name</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Points / Score</th>
                        <th className="p-3 text-right">Performance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {foundCandidate.subjects.map((sub, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-gray-500">{sub.code}</td>
                          <td className="p-3 font-extrabold text-gray-900">{sub.name}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                              sub.grade === 'A' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              sub.grade === 'B' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              sub.grade === 'C' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              Grade {sub.grade}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-gray-700">{sub.points}</td>
                          <td className="p-3 text-right font-bold text-emerald-700">
                            {sub.grade === 'A' ? 'Distinction' : sub.grade === 'B' ? 'Credit' : sub.grade === 'C' ? 'Pass' : 'Satisfactory'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks Banner */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs text-indigo-950 font-bold">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-indigo-600 text-base"></i>
                  <span>NECTA Official Remarks: {foundCandidate.remarks}</span>
                </div>
                <button
                  onClick={() => alert(`Printing NECTA Result Statement for ${foundCandidate.name} (${foundCandidate.indexNumber})`)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-[11px] shadow-sm hover:bg-indigo-700 transition"
                >
                  <i className="fa-solid fa-print mr-1"></i> Print Result
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Division Calculator */}
      {activeTab === 'CALCULATOR' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-purple-200 shadow-xl space-y-6 animate-fade-in">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-calculator text-purple-600"></i> NECTA CSEE Form 4 Division Calculator
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Select your anticipated or practice grades to calculate your total NECTA points and overall Division classification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grade Selector Controls */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-black text-gray-900 text-sm">Select Expected Subject Grades:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(calcGrades).map(sub => (
                  <div key={sub} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-gray-800">{sub}</span>
                    <select
                      value={calcGrades[sub]}
                      onChange={(e) => setCalcGrades({ ...calcGrades, [sub]: e.target.value as any })}
                      className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 font-black text-xs text-purple-900 outline-none focus:border-purple-600"
                    >
                      <option value="A">Grade A (1 Pt)</option>
                      <option value="B">Grade B (2 Pts)</option>
                      <option value="C">Grade C (3 Pts)</option>
                      <option value="D">Grade D (4 Pts)</option>
                      <option value="F">Grade F (5 Pts)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Calculation Result Sidebar */}
            <div className="bg-purple-950 text-white rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider block">
                  NECTA POINTS SUMMARY
                </span>

                <div className="space-y-1">
                  <div className="text-3xl font-black text-amber-300">
                    {calculateCseePoints().div}
                  </div>
                  <div className="text-sm font-bold text-purple-200">
                    Total Points: <strong className="text-white text-lg">{calculateCseePoints().sum} Points</strong> (Best 7 Subjects)
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs leading-relaxed space-y-2">
                  <strong className="text-purple-200 block border-b border-white/10 pb-1">NECTA Division Thresholds:</strong>
                  <div>• <strong>Div I:</strong> 7 - 17 Points</div>
                  <div>• <strong>Div II:</strong> 18 - 21 Points</div>
                  <div>• <strong>Div III:</strong> 22 - 25 Points</div>
                  <div>• <strong>Div IV:</strong> 26 - 31 Points</div>
                </div>
              </div>

              <button
                onClick={() => alert(`Your estimated NECTA result is ${calculateCseePoints().div} with ${calculateCseePoints().sum} points!`)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition"
              >
                Save Calculation Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NECTA Level Exam Strategy Guides & Examiner Pitfalls */}
      {activeTab === 'STRATEGY' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-[11px] uppercase tracking-wider">
                  <i className="fa-solid fa-shield-halved text-amber-400"></i> NECTA Examiner Pitfall Prevention
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  NECTA Exam Strategy & Pitfall Guides
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Toggle between NECTA exam levels (<strong className="text-amber-300">PSLE</strong>, <strong className="text-cyan-300">CSEE</strong>, <strong className="text-purple-300">ACSEE</strong>) to discover real examiner marking insights, penalization traps, unit error rules, and high-scoring essay techniques.
                </p>
              </div>

              {/* Level Switcher Pills */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md self-start md:self-center">
                {(['PSLE', 'CSEE', 'ACSEE'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedStrategyLevel(lvl)}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                      selectedStrategyLevel === lvl
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {lvl} Level
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Guide Content */}
          {(() => {
            const guide = EXAM_STRATEGY_DATA[selectedStrategyLevel];
            return (
              <div className="space-y-6">
                {/* Level Title & Focus Areas */}
                <div className="bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase tracking-wider">
                        {guide.badge}
                      </span>
                      <span className="text-xs font-bold text-gray-400">Target: {guide.targetAudience}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">{guide.title}</h3>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{guide.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {guide.keyFocusAreas.map((area, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-[11px] border border-slate-200">
                        <i className="fa-solid fa-check text-emerald-600 mr-1.5"></i> {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Common Examiner Pitfalls Cards */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation text-amber-500"></i> Critical NECTA Examiner Pitfalls ({guide.level})
                    </h4>
                    <span className="text-xs font-bold text-gray-500">Deducting points identified in CIRA reports</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {guide.commonPitfalls.map((pitfall) => (
                      <div key={pitfall.id} className="bg-white rounded-3xl p-6 border-2 border-red-100 shadow-sm space-y-4 hover:border-red-300 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-black text-[10px] uppercase border border-red-200">
                            {pitfall.subject}
                          </span>
                          <span className="text-[11px] font-black text-red-600 bg-red-100/80 px-2.5 py-0.5 rounded-lg">
                            Loss: {pitfall.marksLost}
                          </span>
                        </div>

                        <div>
                          <h5 className="font-black text-gray-900 text-base mb-1">{pitfall.title}</h5>
                          <p className="text-xs text-gray-600 font-medium leading-relaxed">{pitfall.description}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 text-xs space-y-1">
                          <strong className="text-red-900 font-black block flex items-center gap-1.5">
                            <i className="fa-solid fa-xmark text-red-600"></i> Common Mistake Example:
                          </strong>
                          <p className="text-red-800 font-medium italic">{pitfall.mistakeExample}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                          <strong className="text-emerald-950 font-black block flex items-center gap-1.5">
                            <i className="fa-solid fa-circle-check text-emerald-600"></i> NECTA Examiner Solution:
                          </strong>
                          <p className="text-emerald-900 font-semibold">{pitfall.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Scoring Tips & Checklist */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xl font-black flex items-center gap-2 text-amber-300">
                        <i className="fa-solid fa-star"></i> Pro Scoring Action Checklist ({guide.level})
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">Key habits recommended by senior national examination markers</p>
                    </div>
                    <button
                      onClick={() => alert(`Downloaded ${guide.level} Exam Strategy Guide & Pitfalls Checklist`)}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition shrink-0"
                    >
                      <i className="fa-solid fa-download mr-1.5"></i> Download {guide.level} Strategy Guide
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {guide.scoringTips.map((tipItem, tIdx) => (
                      <div key={tIdx} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 font-black flex items-center justify-center text-xs border border-amber-400/30">
                          0{tIdx + 1}
                        </div>
                        <h5 className="font-black text-sm text-white">{tipItem.title}</h5>
                        <p className="text-xs text-gray-300 font-medium leading-relaxed">{tipItem.tip}</p>
                        <div className="pt-2 border-t border-slate-700/60 text-[11px] text-amber-300 font-bold">
                          👉 {tipItem.actionableStep}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 1: Main Grid or CBT Viewer */}
      {activeTab === 'PAPERS' && (
        <>
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              >
                <option value="ALL">All Exam Levels</option>
                <option value="PSLE">PSLE (Standard 7)</option>
                <option value="FTNA">FTNA (Form 2)</option>
                <option value="CSEE">CSEE (Form 4)</option>
                <option value="ACSEE">ACSEE (Form 6)</option>
              </select>

              {/* Subject Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              >
                <option value="ALL">All Subjects</option>
                <option value="Mathematics">Mathematics / Hisabati</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Science">Basic Science</option>
              </select>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              >
                <option value="ALL">All NECTA Years</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>

            <div className="text-xs font-bold text-gray-500">
              Showing <span className="text-indigo-600 font-black">{filteredExams.length}</span> Exam Papers
            </div>
          </div>

      {/* Main Grid or CBT Viewer */}
      {!cbtMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-indigo-300 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-6 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100">
                    {exam.level} • {exam.year}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    <i className="fa-solid fa-circle-check mr-1"></i> Marking Scheme Included
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">{exam.levelFull}</p>

                {/* Examiner's Pitfall Box */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                    <span>NECTA Examiner Report (CIRA) Insight</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    "{exam.examinerReport.summary}"
                  </p>
                  <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-900">
                    <strong>Common Mistake:</strong> {exam.examinerReport.commonPitfalls[0]}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleStartCbt(exam)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-pen-to-square"></i> Timed Practice
                </button>

                <button
                  onClick={() => setActiveExam(exam)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-extrabold text-xs transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-book-open"></i> Marking Scheme & CIRA Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Interactive CBT Quiz Renderer */
        <div className="bg-white rounded-3xl p-8 border-2 border-indigo-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Interactive CBT Simulator
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">{activeExam?.title}</h2>
            </div>
            <button
              onClick={() => setCbtMode(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-200 transition"
            >
              <i className="fa-solid fa-xmark mr-1"></i> Exit Exam
            </button>
          </div>

          {!showResults ? (
            <div className="space-y-8">
              {activeExam?.sampleQuestions.map((q) => (
                <div key={q.qNum} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <div className="font-extrabold text-base text-gray-900">
                    Question {q.qNum}: {q.question}
                  </div>

                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerSelect(q.qNum, opt)}
                          className={`p-3.5 rounded-xl text-left font-bold text-sm border-2 transition ${
                            cbtAnswers[q.qNum] === opt
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => setShowResults(true)}
                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black text-base shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition"
              >
                Submit Exam Answers & Get Grade
              </button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 font-black text-3xl flex items-center justify-center mx-auto shadow-inner">
                {calculateCbtScore()}%
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  {calculateCbtScore() >= 60 ? 'Exam Passed! Excellent Work' : 'Keep Practicing!'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Review the marking notes and examiner feedback below.</p>
              </div>

              <div className="text-left space-y-4 max-w-2xl mx-auto">
                <h4 className="font-black text-gray-800 text-sm">Question Breakdown & Marking Notes:</h4>
                {activeExam?.sampleQuestions.map(q => (
                  <div key={q.qNum} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-sm text-gray-900">Q{q.qNum}: {q.question}</div>
                    <div className="text-xs text-gray-700">Correct Answer: <strong className="text-emerald-700">{q.answerKey}</strong></div>
                    <div className="text-xs text-indigo-900 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                      <strong>Marking Scheme Notes:</strong> {q.markingNotes}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCbtMode(false)}
                className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm shadow-md"
              >
                Return to Exam Vault
              </button>
            </div>
          )}
        </div>
      )}
      </>
      )}

      {/* Detailed Report Modal / Sheet */}
      {activeExam && !cbtMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setActiveExam(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>

            <div>
              <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {activeExam.level} • {activeExam.year}
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">{activeExam.title}</h2>
              <p className="text-xs text-gray-500 font-medium">{activeExam.levelFull}</p>
            </div>

            {/* Examiner Report Section */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                <i className="fa-solid fa-shield-halved text-amber-600"></i> NECTA Examiner's Report (CIRA)
              </div>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">{activeExam.examinerReport.summary}</p>

              <div className="pt-2 border-t border-amber-200">
                <div className="text-xs font-bold text-amber-900 mb-1.5">Where Candidates Lose Marks:</div>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-950">
                  {activeExam.examinerReport.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx}>{pitfall}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-amber-200 text-xs text-amber-900">
                <strong>Chief Examiner's Advice:</strong> {activeExam.examinerReport.examinerAdvice}
              </div>
            </div>

            {/* Sample Marking Keys */}
            <div className="space-y-3">
              <h3 className="font-black text-gray-900 text-sm">Sample Marking Scheme Keys</h3>
              {activeExam.sampleQuestions.map((q) => (
                <div key={q.qNum} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
                  <div className="font-bold text-gray-800">Q{q.qNum}: {q.question}</div>
                  <div className="text-emerald-700 font-bold">Answer: {q.answerKey}</div>
                  <div className="text-gray-600 bg-white p-2 rounded border border-gray-100">
                    <strong>Steps & Allocation:</strong> {q.markingNotes}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => handleStartCbt(activeExam)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md"
              >
                Start Timed CBT Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamVault;
