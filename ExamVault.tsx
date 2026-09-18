import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShareProgressModal } from './ShareProgressModal';
import { ExamItem, ALL_NECTA_PAST_PAPERS } from '../src/data/nectaPastPapersData';

export type { ExamItem };
export { ALL_NECTA_PAST_PAPERS };

const EXAM_VAULT_DATA = ALL_NECTA_PAST_PAPERS;

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

const GRADE_METADATA: Record<string, { label: string; full: string; desc: string; icon: string }> = {
  ALL: {
    label: 'All Grades',
    full: 'All National NECTA Examinations',
    desc: 'Browse complete repository spanning Primary (Std 7) to Advanced Level (Form 6).',
    icon: 'fa-layer-group',
  },
  PSLE: {
    label: 'PSLE (Std 7)',
    full: 'Primary School Leaving Examination',
    desc: 'Standard 7 national examinations for secondary school selection.',
    icon: 'fa-child-reaching',
  },
  FTNA: {
    label: 'FTNA (Form 2)',
    full: 'Form Two National Assessment',
    desc: 'Lower secondary assessment evaluating mastery before senior secondary.',
    icon: 'fa-graduation-cap',
  },
  CSEE: {
    label: 'CSEE (Form 4)',
    full: 'Certificate of Secondary Education Examination',
    desc: 'Ordinary Level (Form IV) national examination certification papers.',
    icon: 'fa-award',
  },
  ACSEE: {
    label: 'ACSEE (Form 6)',
    full: 'Advanced Certificate of Secondary Education Examination',
    desc: 'Advanced Level (Form VI) examinations for university direct entry.',
    icon: 'fa-user-graduate',
  },
};

const ExamVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PAPERS' | 'RESULTS' | 'CALCULATOR' | 'STRATEGY'>('PAPERS');
  const [selectedStrategyLevel, setSelectedStrategyLevel] = useState<'PSLE' | 'CSEE' | 'ACSEE'>('CSEE');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [cbtMode, setCbtMode] = useState<boolean>(false);
  const [cbtAnswers, setCbtAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // View layout: 'grid' vs 'list'
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  // Downloading state and toast alert
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<{ title: string; filename: string } | null>(null);

  // Dynamic fetch state for grade-specific NECTA past papers
  const [fetchedPapers, setFetchedPapers] = useState<ExamItem[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [availableSubjectsForLevel, setAvailableSubjectsForLevel] = useState<{ name: string; count: number }[]>([]);
  const [availableYearsForLevel, setAvailableYearsForLevel] = useState<{ year: string; count: number }[]>([]);
  const [totalForGrade, setTotalForGrade] = useState<number>(ALL_NECTA_PAST_PAPERS.length);

  // Dynamic fetch function that queries papers specific to the selected grade level and filters
  const fetchPapers = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingPapers(true);
    }
    setFetchError(null);

    try {
      const params = new URLSearchParams();
      if (selectedLevel) params.append('level', selectedLevel);
      if (selectedSubject && selectedSubject !== 'ALL') params.append('subject', selectedSubject);
      if (selectedYear && selectedYear !== 'ALL') params.append('year', selectedYear);
      if (searchKeyword.trim()) params.append('q', searchKeyword.trim());

      const res = await fetch(`/api/necta-past-papers?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setFetchedPapers(data.papers || []);
      setTotalForGrade(data.totalForLevel ?? (data.papers ? data.papers.length : 0));
      setAvailableSubjectsForLevel(data.availableSubjects || []);
      setAvailableYearsForLevel(data.availableYears || []);
    } catch (err: any) {
      console.warn("Dynamic API fetch error, switching to resilient local fallback:", err);
      // Fallback calculation using ALL_NECTA_PAST_PAPERS
      const gradePapers = ALL_NECTA_PAST_PAPERS.filter((p) => selectedLevel === 'ALL' || p.level === selectedLevel);
      
      const sMap: Record<string, number> = {};
      const yMap: Record<string, number> = {};
      gradePapers.forEach((p) => {
        sMap[p.subject] = (sMap[p.subject] || 0) + 1;
        yMap[p.year] = (yMap[p.year] || 0) + 1;
      });

      const subjects = Object.keys(sMap).sort().map((name) => ({ name, count: sMap[name] }));
      const years = Object.keys(yMap).sort((a, b) => Number(b) - Number(a)).map((year) => ({ year, count: yMap[year] }));

      setTotalForGrade(gradePapers.length);
      setAvailableSubjectsForLevel(subjects);
      setAvailableYearsForLevel(years);

      const filtered = gradePapers.filter((item) => {
        if (selectedSubject !== 'ALL' && !item.subject.toLowerCase().includes(selectedSubject.toLowerCase())) return false;
        if (selectedYear !== 'ALL' && item.year !== selectedYear) return false;
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSubject = item.subject.toLowerCase().includes(q);
          const matchLevel = item.level.toLowerCase().includes(q) || item.levelFull.toLowerCase().includes(q);
          const matchCode = item.code ? item.code.toLowerCase().includes(q) : false;
          const matchQuestions = item.sampleQuestions.some(sq => sq.question.toLowerCase().includes(q));
          if (!matchTitle && !matchSubject && !matchLevel && !matchCode && !matchQuestions) return false;
        }
        return true;
      });

      setFetchedPapers(filtered);
    } finally {
      setIsLoadingPapers(false);
      setIsRefreshing(false);
    }
  }, [selectedLevel, selectedSubject, selectedYear, searchKeyword]);

  // Trigger dynamic fetch when grade level, subject, year, or search keyword changes
  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  // Change grade level and reset subject/year to avoid mismatched state
  const handleSelectGrade = (newLevel: string) => {
    if (newLevel === selectedLevel) return;
    setSelectedLevel(newLevel);
    setSelectedSubject('ALL');
    setSelectedYear('ALL');
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setSelectedSubject('ALL');
    setSelectedYear('ALL');
    setSearchKeyword('');
  };

  // NECTA Results Lookup state
  const [searchIndex, setSearchIndex] = useState<string>('');
  const [foundCandidate, setFoundCandidate] = useState<NectaCandidateResult | null>(DEMO_NECTA_RESULTS[0]);
  const [searchError, setSearchError] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const NECTA_OFFICIAL_PORTALS = [
    {
      title: 'ACSEE Form 6 Results Portal',
      code: 'ACSEE',
      level: 'Advanced Level (Form VI)',
      description: 'Official National Examination Results for Form Six Advanced Certificate candidates.',
      url: 'https://matokeo.necta.go.tz/acsee',
      icon: 'fa-graduation-cap',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      badge: 'Form 6 ACSEE'
    },
    {
      title: 'CSEE Form 4 Results Portal',
      code: 'CSEE',
      level: 'Ordinary Level (Form IV)',
      description: 'Official National Examination Results for Form Four Certificate of Secondary Education candidates.',
      url: 'https://matokeo.necta.go.tz/csee',
      icon: 'fa-award',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badge: 'Form 4 CSEE'
    },
    {
      title: 'FTNA Form 2 Assessment Portal',
      code: 'FTNA',
      level: 'Secondary Form Two',
      description: 'National Assessment Results for Form Two National Assessment candidates.',
      url: 'https://matokeo.necta.go.tz/ftna',
      icon: 'fa-book-open-reader',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      badge: 'Form 2 FTNA'
    },
    {
      title: 'PSLE Standard 7 Leaving Exam',
      code: 'PSLE',
      level: 'Primary Education (Std VII)',
      description: 'Primary School Leaving Examination results and secondary school selection lists.',
      url: 'https://matokeo.necta.go.tz/psle',
      icon: 'fa-school',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'Std 7 PSLE'
    },
    {
      title: 'NECTA Official Main Website',
      code: 'NECTA_HQ',
      level: 'National Examinations Council',
      description: 'Official announcements, exam timetables, circulars, syllabi, and news from NECTA headquarters.',
      url: 'https://www.necta.go.tz',
      icon: 'fa-building-columns',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      badge: 'NECTA Main HQ'
    },
    {
      title: 'NECTA Online Registration System (ORS)',
      code: 'ORS',
      level: 'School & Private Candidates',
      description: 'Official online portal for school registration, candidate index verification, and exam center details.',
      url: 'https://ors.necta.go.tz',
      icon: 'fa-id-card',
      badgeColor: 'bg-slate-100 text-slate-900 border-slate-200',
      btnColor: 'bg-slate-900 hover:bg-slate-800 text-white',
      badge: 'NECTA ORS Portal'
    }
  ];

  // Embedded iFrame / Portal Navigation & My Website Linking state
  const [activeIframeUrl, setActiveIframeUrl] = useState<string>('https://matokeo.necta.go.tz/csee');
  const [isIframeOpen, setIsIframeOpen] = useState<boolean>(false);
  const [iframePortalTitle, setIframePortalTitle] = useState<string>('Form 4 CSEE Results Portal');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [myWebsiteUrl, setMyWebsiteUrl] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return 'https://my-school.edu.tz';
  });

  const openPortalInIframe = (url: string, title: string) => {
    setActiveIframeUrl(url);
    setIframePortalTitle(title);
    setIsIframeOpen(true);
    setIframeKey(prev => prev + 1);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleExternalRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const generatedEmbedHtml = `<div style="padding:16px; background:#0f172a; color:#ffffff; border-radius:16px; font-family:sans-serif; border:2px solid #334155;">
  <h4 style="margin:0 0 6px 0; color:#fbbf24; font-size:16px;">🇹🇿 Official NECTA Results & Website Gateway</h4>
  <p style="font-size:12px; margin:0 0 12px 0; color:#cbd5e1;">Access Tanzania NECTA Examination Results portals and return seamlessly:</p>
  <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
    <a href="https://matokeo.necta.go.tz/csee" target="_blank" style="background:#059669; color:#fff; padding:8px 14px; border-radius:8px; font-weight:bold; font-size:12px; text-decoration:none;">Form 4 (CSEE) Results</a>
    <a href="https://matokeo.necta.go.tz/acsee" target="_blank" style="background:#9333ea; color:#fff; padding:8px 14px; border-radius:8px; font-weight:bold; font-size:12px; text-decoration:none;">Form 6 (ACSEE) Results</a>
    <a href="https://www.necta.go.tz" target="_blank" style="background:#2563eb; color:#fff; padding:8px 14px; border-radius:8px; font-weight:bold; font-size:12px; text-decoration:none;">NECTA Main Website</a>
  </div>
  <div style="padding-top:10px; border-top:1px solid #334155;">
    <a href="${myWebsiteUrl}" target="_blank" style="color:#38bdf8; font-size:12px; font-weight:bold; text-decoration:none;">← Return to My School / Main Website (${myWebsiteUrl})</a>
  </div>
</div>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(generatedEmbedHtml);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

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

  const filteredExams = fetchedPapers;

  const handleDownloadPaper = (exam: ExamItem) => {
    setDownloadingId(exam.id);
    try {
      const content = `===============================================================
THE NATIONAL EXAMINATIONS COUNCIL OF TANZANIA (NECTA)
${exam.levelFull.toUpperCase()} (${exam.level})
${exam.title.toUpperCase()}
Subject Code: ${exam.code || 'N/A'} | Examination Year: ${exam.year}
Time Allowed: ${exam.durationMinutes} Minutes | Number of Questions: ${exam.questionCount}
===============================================================

INSTRUCTIONS TO CANDIDATES:
1. This paper consists of questions based on the official NECTA syllabus for ${exam.levelFull}.
2. Answer all questions clearly. Show all mathematical and logical steps where applicable.
3. Write your Candidate Index Number clearly on every answer sheet.
4. Cell phones, programmable calculators, and unauthorized materials are strictly prohibited.

===============================================================
OFFICIAL NECTA EXAMINER (CIRA) REPORT & PITFALL ADVICE
===============================================================
Performance Summary:
${exam.examinerReport.summary}

Common Candidate Pitfalls & Error Analysis:
${exam.examinerReport.commonPitfalls.map((p, idx) => `  [${idx + 1}] ${p}`).join('\n')}

Chief Examiner's Guidance for Scoring Grade A:
${exam.examinerReport.examinerAdvice}

===============================================================
EXAMINATION QUESTIONS:
===============================================================
${exam.sampleQuestions.map((q) => {
  let text = `QUESTION ${q.qNum}: ${q.question}\n`;
  if (q.options && q.options.length > 0) {
    text += q.options.map((opt, i) => `   (${String.fromCharCode(65 + i)}) ${opt}`).join('\n') + '\n';
  }
  return text;
}).join('\n')}

===============================================================
OFFICIAL NECTA MARKING SCHEME & STEP-BY-STEP RUBRIC
===============================================================
${exam.sampleQuestions.map((q) => {
  return `QUESTION ${q.qNum}:
  Official Answer Key: ${q.answerKey}
  Marking Scheme Rubric & Step Allocation:
  ${q.markingNotes}
---------------------------------------------------------------`;
}).join('\n')}

===============================================================
Generated by EducationTZ - Tanzania National Exam Preparation
Official Website: https://www.necta.go.tz
===============================================================`;

      const filename = `NECTA_${exam.level}_${exam.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${exam.year}.txt`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadToast({
        title: exam.title,
        filename,
      });
      setTimeout(() => {
        setDownloadToast(null);
      }, 4000);
    } catch (err) {
      console.error("Client blob download error, redirecting to server endpoint:", err);
      window.location.href = `/api/necta-past-papers/download/${exam.id}`;
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 600);
    }
  };

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
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-950 font-bold">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-indigo-600 text-base"></i>
                  <span>NECTA Official Remarks: {foundCandidate.remarks}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    title="Share NECTA Result via WhatsApp or Social Media"
                  >
                    <i className="fa-solid fa-share-nodes text-slate-950"></i> Share Result
                  </button>
                  <button
                    onClick={() => alert(`Printing NECTA Result Statement for ${foundCandidate.name} (${foundCandidate.indexNumber})`)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-[11px] shadow-sm hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-print mr-1"></i> Print Result
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OFFICIAL DIRECT NECTA RESULTS PORTALS & LINKS DIRECTORY */}
          <div id="exams-results-section" className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase border border-emerald-200">
                    <i className="fa-solid fa-globe mr-1"></i> Verified NECTA Domains
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase border border-amber-200">
                    Direct External Links
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-[#008751] fa-arrow-up-right-from-square text-emerald-600"></i>
                  Official NECTA Online Results Directory
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Direct access to official National Examinations Council of Tanzania (NECTA) server portals for all academic levels.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
                  title="Share NECTA Exam Result on WhatsApp or Social Media"
                >
                  <i className="fa-solid fa-share-nodes text-slate-950"></i>
                  <span>Share Result</span>
                </button>

                <button
                  onClick={() => {
                    openPortalInIframe('https://matokeo.necta.go.tz/csee', 'Form 4 CSEE Results Portal');
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <i className="fa-solid fa-window-restore"></i>
                  <span>{isIframeOpen ? 'Change Frame View' : 'Embed Live Portal iFrame'}</span>
                </button>

                <button
                  onClick={() => handleExternalRedirect('https://matokeo.necta.go.tz')}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <i className="fa-solid fa-external-link"></i> Launch NECTA Redirect
                </button>
              </div>
            </div>

            {/* LIVE DYNAMIC IFRAME / REDIRECT PORTAL VIEWER */}
            {isIframeOpen && (
              <div className="bg-slate-900 rounded-2xl border-2 border-indigo-500/50 shadow-2xl overflow-hidden space-y-0 transition-all duration-300">
                {/* iFrame Browser Header Bar */}
                <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-[11px] border border-emerald-500/30 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live NECTA Connection
                    </span>
                    <span className="font-bold text-slate-200 hidden sm:inline">{iframePortalTitle}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex-1 max-w-xl font-mono text-[11px] text-slate-300 truncate">
                    <i className="fa-solid fa-lock text-emerald-400"></i>
                    <span className="truncate">{activeIframeUrl}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIframeKey(prev => prev + 1)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition flex items-center gap-1"
                      title="Refresh Frame"
                    >
                      <i className="fa-solid fa-rotate-right"></i> Refresh
                    </button>
                    <button
                      onClick={() => handleExternalRedirect(activeIframeUrl)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] transition flex items-center gap-1"
                      title="Open in Full Browser Tab"
                    >
                      <span>Full Redirect</span>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                    <button
                      onClick={() => setIsIframeOpen(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold text-[11px] border border-red-500/30 transition"
                      title="Close Frame Viewer"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                {/* iFrame Fallback Alert Banner */}
                <div className="px-4 py-2 bg-amber-950/80 border-b border-amber-800/50 text-[11px] text-amber-200 flex items-center justify-between gap-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-shield-halved text-amber-400"></i>
                    <span>Official government servers (`necta.go.tz`) load live above. If cross-origin framing (`X-Frame-Options`) restricts rendering in your browser:</span>
                  </span>
                  <button
                    onClick={() => handleExternalRedirect(activeIframeUrl)}
                    className="underline font-bold text-amber-300 hover:text-white shrink-0"
                  >
                    Click for Direct Redirect <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>

                {/* Actual Frame */}
                <div className="relative w-full h-[520px] bg-white">
                  <iframe
                    key={iframeKey}
                    src={activeIframeUrl}
                    title={iframePortalTitle}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              </div>
            )}

            {/* Direct Portal Link Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {NECTA_OFFICIAL_PORTALS.map((portal) => (
                <div
                  key={portal.code}
                  className="bg-gray-50/70 hover:bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-xl font-black text-[10px] uppercase border ${portal.badgeColor}`}>
                        {portal.badge}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 font-bold">
                        necta.go.tz
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-black flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition shadow-xs">
                        <i className={`fa-solid ${portal.icon}`}></i>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm leading-snug">{portal.title}</h4>
                        <p className="text-[11px] font-bold text-gray-500">{portal.level}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyUrl(portal.url)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-slate-700 font-extrabold text-[11px] border border-gray-300 transition flex items-center gap-1"
                      title="Copy Direct NECTA Link"
                    >
                      <i className={`fa-solid ${copiedUrl === portal.url ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                      <span>{copiedUrl === portal.url ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => openPortalInIframe(portal.url, portal.title)}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold text-[11px] border border-indigo-200 transition flex items-center gap-1"
                      title="Load Portal in Embedded Frame"
                    >
                      <i className="fa-solid fa-window-maximize text-indigo-600"></i>
                      <span>Frame View</span>
                    </button>

                    <button
                      onClick={() => handleExternalRedirect(portal.url)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${portal.btnColor} shadow-xs cursor-pointer`}
                      title="Direct External Redirect"
                    >
                      <span>Direct Redirect</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* WEBSITE INTEGRATION & EMBED CODE GENERATOR SECTION */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-indigo-500/30 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase tracking-wider border border-amber-400/30">
                    <i className="fa-solid fa-code text-amber-300"></i> Website Link Bridge & Webmaster Tool
                  </div>
                  <h4 className="text-lg font-black text-white">
                    Link NECTA Results to Your Website (`{myWebsiteUrl || 'Your Domain'}`)
                  </h4>
                  <p className="text-xs text-gray-300 font-medium">
                    Configure your website URL below to generate a two-way link bridge between official NECTA portals and your website.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleExternalRedirect(myWebsiteUrl)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs border border-slate-700 transition flex items-center gap-1.5"
                    title="Test Launch My Website"
                  >
                    <i className="fa-solid fa-globe"></i>
                    <span>Test My Website Link</span>
                  </button>

                  <button
                    onClick={handleCopyEmbed}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 ${
                      copiedEmbed
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                    }`}
                  >
                    <i className={`fa-solid ${copiedEmbed ? 'fa-check' : 'fa-code'}`}></i>
                    <span>{copiedEmbed ? 'Bridge HTML Copied!' : 'Copy Bridge HTML Code'}</span>
                  </button>
                </div>
              </div>

              {/* My Website URL Customizer Bar */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-xs font-black text-amber-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                  <i className="fa-solid fa-link"></i> My Website Domain / URL:
                </label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="url"
                    value={myWebsiteUrl}
                    onChange={(e) => setMyWebsiteUrl(e.target.value)}
                    placeholder="https://yourschool.ac.tz"
                    className="w-full bg-slate-900 text-white text-xs font-mono font-bold px-3.5 py-2 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyUrl(myWebsiteUrl)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 shrink-0"
                  >
                    {copiedUrl === myWebsiteUrl ? 'Copied!' : 'Copy Domain'}
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                <pre>{generatedEmbedHtml}</pre>
              </div>
            </div>
          </div>
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
          {/* Grade Level Selector Banner */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-indigo-600"></i> Select Grade Level for Past Papers:
              </span>
              <span className="text-xs text-gray-500 font-bold">
                {totalForGrade} Past Papers Available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { id: 'ALL', code: 'ALL', name: 'All Grades', stage: 'Std 7 to Form 6', count: ALL_NECTA_PAST_PAPERS.length },
                { id: 'PSLE', code: 'PSLE', name: 'Standard 7', stage: 'Primary Leaving', count: ALL_NECTA_PAST_PAPERS.filter(e => e.level === 'PSLE').length },
                { id: 'FTNA', code: 'FTNA', name: 'Form 2', stage: 'National Assessment', count: ALL_NECTA_PAST_PAPERS.filter(e => e.level === 'FTNA').length },
                { id: 'CSEE', code: 'CSEE', name: 'Form 4', stage: 'O-Level Certificate', count: ALL_NECTA_PAST_PAPERS.filter(e => e.level === 'CSEE').length },
                { id: 'ACSEE', code: 'ACSEE', name: 'Form 6', stage: 'A-Level Advanced', count: ALL_NECTA_PAST_PAPERS.filter(e => e.level === 'ACSEE').length }
              ].map((tab) => {
                const isActive = selectedLevel === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectGrade(tab.id)}
                    className={`p-3.5 rounded-2xl text-left transition-all border-2 flex flex-col justify-between group ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-gray-700 border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className={`px-2.5 py-0.5 rounded-md font-black text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        {tab.code}
                      </span>
                      <span className={`text-[11px] font-bold ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {tab.count} papers
                      </span>
                    </div>
                    <div>
                      <div className={`font-black text-sm ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                        {tab.name}
                      </div>
                      <div className={`text-[11px] ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {tab.stage}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Filter & Control Console */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-5">
            {/* Grade Context Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Dynamic Past Papers Repository
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    Grade: <strong className="text-gray-900">{GRADE_METADATA[selectedLevel]?.label || selectedLevel}</strong>
                  </span>
                </div>
                <h4 className="text-lg font-black text-gray-900">
                  {GRADE_METADATA[selectedLevel]?.full || selectedLevel}
                </h4>
                <p className="text-xs text-gray-600 font-medium">
                  {GRADE_METADATA[selectedLevel]?.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => fetchPapers(true)}
                  disabled={isLoadingPapers || isRefreshing}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold text-xs transition flex items-center gap-2 disabled:opacity-50"
                  title="Re-query past papers from dynamic endpoint"
                >
                  <i className={`fa-solid fa-arrows-rotate text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`}></i>
                  <span>{isRefreshing ? 'Fetching...' : 'Refresh Papers'}</span>
                </button>
              </div>
            </div>

            {/* Clearly Presented Available Subject Filters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-book-open text-indigo-500"></i> Available Subjects for {selectedLevel === 'ALL' ? 'All Grades' : selectedLevel} ({availableSubjectsForLevel.length}):
                </span>
                {selectedSubject !== 'ALL' && (
                  <button
                    onClick={() => setSelectedSubject('ALL')}
                    className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <i className="fa-solid fa-xmark"></i> Clear Subject Filter
                  </button>
                )}
              </div>

              {/* Interactive Subject Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedSubject('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 ${
                    selectedSubject === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>All Subjects</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${selectedSubject === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {totalForGrade}
                  </span>
                </button>

                {availableSubjectsForLevel.map((sub) => {
                  const isSubActive = selectedSubject === sub.name;
                  return (
                    <button
                      key={sub.name}
                      onClick={() => setSelectedSubject(isSubActive ? 'ALL' : sub.name)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 ${
                        isSubActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSubActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clearly Presented Available Year Filters */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar-check text-indigo-500"></i> Available Examination Years ({availableYearsForLevel.length}):
                </span>
                {selectedYear !== 'ALL' && (
                  <button
                    onClick={() => setSelectedYear('ALL')}
                    className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <i className="fa-solid fa-xmark"></i> Clear Year Filter
                  </button>
                )}
              </div>

              {/* Interactive Year Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedYear('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 ${
                    selectedYear === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>All Years</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${selectedYear === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {totalForGrade}
                  </span>
                </button>

                {availableYearsForLevel.map((yr) => {
                  const isYrActive = selectedYear === yr.year;
                  return (
                    <button
                      key={yr.year}
                      onClick={() => setSelectedYear(isYrActive ? 'ALL' : yr.year)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 ${
                        isYrActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span>{yr.year}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isYrActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {yr.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Keyword Search & Quick-Select Dropdowns */}
            <div className="pt-3 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 w-full">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input
                  type="text"
                  placeholder={`Search in ${selectedLevel === 'ALL' ? 'all' : selectedLevel} papers by topic, question, or code...`}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Quick Select Dropdowns */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition flex-1 md:flex-none"
                  aria-label="Filter by subject"
                >
                  <option value="ALL">All Subjects ({totalForGrade})</option>
                  {availableSubjectsForLevel.map(s => (
                    <option key={s.name} value={s.name}>{s.name} ({s.count})</option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none transition flex-1 md:flex-none"
                  aria-label="Filter by examination year"
                >
                  <option value="ALL">All Years ({totalForGrade})</option>
                  {availableYearsForLevel.map(y => (
                    <option key={y.year} value={y.year}>{y.year} ({y.count})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary Bar */}
            {(selectedSubject !== 'ALL' || selectedYear !== 'ALL' || searchKeyword.trim()) && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 font-bold">Active Filters:</span>
                  {selectedSubject !== 'ALL' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200">
                      Subject: {selectedSubject}
                      <button onClick={() => setSelectedSubject('ALL')} className="hover:text-red-500"><i className="fa-solid fa-xmark"></i></button>
                    </span>
                  )}
                  {selectedYear !== 'ALL' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200">
                      Year: {selectedYear}
                      <button onClick={() => setSelectedYear('ALL')} className="hover:text-red-500"><i className="fa-solid fa-xmark"></i></button>
                    </span>
                  )}
                  {searchKeyword.trim() && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-extrabold border border-amber-200">
                      Query: "{searchKeyword}"
                      <button onClick={() => setSearchKeyword('')} className="hover:text-red-500"><i className="fa-solid fa-xmark"></i></button>
                    </span>
                  )}
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1 underline"
                >
                  <i className="fa-solid fa-arrow-rotate-left"></i> Reset All Filters
                </button>
              </div>
            )}

            {/* Results Count & Layout Mode Switcher */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-gray-500 border-t border-gray-100">
              <div className="flex items-center gap-3 flex-wrap">
                <span>
                  Showing <strong className="text-indigo-600 font-black">{filteredExams.length}</strong> of{' '}
                  <strong className="text-gray-800 font-black">{totalForGrade}</strong> past papers in{' '}
                  <strong className="text-gray-800">{GRADE_METADATA[selectedLevel]?.label || selectedLevel}</strong>
                </span>
                {isLoadingPapers && (
                  <span className="text-indigo-600 font-bold flex items-center gap-1.5">
                    <i className="fa-solid fa-circle-notch animate-spin"></i> Loading papers...
                  </span>
                )}
              </div>

              {/* View Layout Toggle: Grid View vs List View */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  id="btn-layout-grid"
                  onClick={() => setViewLayout('grid')}
                  className={`px-3 py-1.5 rounded-lg font-black text-xs transition flex items-center gap-1.5 ${
                    viewLayout === 'grid'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Switch to Grid View"
                >
                  <i className="fa-solid fa-grip"></i> Grid
                </button>
                <button
                  id="btn-layout-list"
                  onClick={() => setViewLayout('list')}
                  className={`px-3 py-1.5 rounded-lg font-black text-xs transition flex items-center gap-1.5 ${
                    viewLayout === 'list'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Switch to List View"
                >
                  <i className="fa-solid fa-list"></i> List
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid or CBT Viewer */}
          {!cbtMode ? (
            <>
              {isLoadingPapers ? (
                /* Animated Skeletons during dynamic fetch */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-4 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
                        <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
                      </div>
                      <div className="h-7 w-3/4 bg-gray-200 rounded-lg"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                        <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-10 flex-1 bg-gray-200 rounded-xl"></div>
                        <div className="h-10 flex-1 bg-gray-200 rounded-xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : fetchError ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-black">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-base">Unable to Load Past Papers</h4>
                    <p className="text-xs text-gray-600 mt-1">{fetchError}</p>
                  </div>
                  <button
                    onClick={() => fetchPapers(true)}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition"
                  >
                    <i className="fa-solid fa-arrow-rotate-right mr-1.5"></i> Try Again
                  </button>
                </div>
              ) : filteredExams.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-200 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                    <i className="fa-solid fa-filter-circle-xmark"></i>
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="font-black text-gray-900 text-lg">No Past Papers Found</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      We could not find any past papers matching your current filters in{' '}
                      <strong className="text-gray-800">{GRADE_METADATA[selectedLevel]?.label || selectedLevel}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 transition inline-flex items-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-rotate-left"></i> Reset Subject & Year Filters
                  </button>
                </div>
              ) : viewLayout === 'list' ? (
                /* Dedicated List Item View */
                <div className="space-y-3" role="list">
                  {filteredExams.map((exam) => {
                    const isDownloading = downloadingId === exam.id;
                    return (
                      <div
                        key={exam.id}
                        id={`paper-list-item-${exam.id}`}
                        role="listitem"
                        className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100">
                              {exam.level} • {exam.year}
                            </span>
                            {exam.code && (
                              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                Code: {exam.code}
                              </span>
                            )}
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                              <i className="fa-solid fa-circle-check text-emerald-500"></i> Marking Scheme Included
                            </span>
                          </div>

                          <div>
                            <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {exam.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-0.5">
                              <span>{exam.levelFull}</span>
                              <span>•</span>
                              <span><i className="fa-regular fa-clock mr-1 text-gray-400"></i>{exam.durationMinutes} mins</span>
                              <span>•</span>
                              <span><i className="fa-solid fa-list-check mr-1 text-gray-400"></i>{exam.questionCount} Questions</span>
                            </div>
                          </div>

                          {/* Examiner pitfall snippet */}
                          <div className="text-xs text-amber-900 bg-amber-50/70 border border-amber-200/70 rounded-xl px-3 py-2 flex items-start gap-2">
                            <i className="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
                            <span className="line-clamp-1">
                              <strong className="text-amber-950">Examiner Advice:</strong> {exam.examinerReport.commonPitfalls[0]}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons for List Item */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                          {/* Download Button on Each List Item */}
                          <button
                            id={`download-paper-list-${exam.id}`}
                            onClick={() => handleDownloadPaper(exam)}
                            disabled={isDownloading}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm shadow-emerald-200 flex items-center gap-2 disabled:opacity-50"
                            title={`Download official NECTA ${exam.title} past paper & marking scheme (.txt)`}
                          >
                            <i className={`fa-solid ${isDownloading ? 'fa-circle-notch fa-spin' : 'fa-download'}`}></i>
                            <span>{isDownloading ? 'Downloading...' : 'Download Paper'}</span>
                            <span className="text-[10px] bg-emerald-700/50 px-1.5 py-0.5 rounded text-emerald-100 font-mono">.TXT</span>
                          </button>

                          {/* Marking Scheme */}
                          <button
                            id={`scheme-list-${exam.id}`}
                            onClick={() => setActiveExam(exam)}
                            className="px-3.5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-extrabold text-xs transition flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-book-open"></i> Scheme
                          </button>

                          {/* Timed Practice */}
                          <button
                            id={`cbt-list-${exam.id}`}
                            onClick={() => handleStartCbt(exam)}
                            className="px-3.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-extrabold text-xs transition flex items-center gap-1.5"
                          >
                            <i className="fa-solid fa-pen-to-square"></i> CBT
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredExams.map((exam) => {
                    const isDownloading = downloadingId === exam.id;
                    return (
                      <div
                        key={exam.id}
                        id={`paper-card-${exam.id}`}
                        className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-indigo-300 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-6 group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100">
                                {exam.level} • {exam.year}
                              </span>
                              {exam.code && (
                                <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                  Code: {exam.code}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                <i className="fa-solid fa-circle-check mr-1"></i> Scheme Included
                              </span>
                              <button
                                id={`quick-download-top-${exam.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPaper(exam);
                                }}
                                disabled={isDownloading}
                                className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300 flex items-center justify-center text-xs transition disabled:opacity-50"
                                title={`Quick download ${exam.title}`}
                              >
                                <i className={`fa-solid ${isDownloading ? 'fa-circle-notch fa-spin text-emerald-600' : 'fa-arrow-down-to-line'}`}></i>
                              </button>
                            </div>
                          </div>

                          <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {exam.title}
                          </h3>
                          <div className="flex items-center justify-between mt-1 text-xs text-gray-500 font-medium">
                            <span>{exam.levelFull}</span>
                            <span><i className="fa-regular fa-clock mr-1"></i>{exam.durationMinutes} mins • {exam.questionCount} Questions</span>
                          </div>

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
                          <div className="flex items-center gap-2">
                            <button
                              id={`cbt-btn-${exam.id}`}
                              onClick={() => handleStartCbt(exam)}
                              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                              <i className="fa-solid fa-pen-to-square"></i> Timed Practice
                            </button>

                            <button
                              id={`scheme-btn-${exam.id}`}
                              onClick={() => setActiveExam(exam)}
                              className="px-3.5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-extrabold text-xs transition flex items-center gap-2"
                            >
                              <i className="fa-solid fa-book-open"></i> Marking Scheme
                            </button>
                          </div>

                          {/* Download Button on Each Card */}
                          <button
                            id={`download-paper-grid-${exam.id}`}
                            onClick={() => handleDownloadPaper(exam)}
                            disabled={isDownloading}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm shadow-emerald-200 flex items-center gap-2 disabled:opacity-50"
                            title={`Download official NECTA ${exam.title} past paper & marking scheme (.txt)`}
                          >
                            <i className={`fa-solid ${isDownloading ? 'fa-circle-notch fa-spin' : 'fa-download'}`}></i>
                            <span>{isDownloading ? 'Downloading...' : 'Download Paper'}</span>
                            <span className="text-[10px] bg-emerald-700/50 px-1.5 py-0.5 rounded text-emerald-100 font-mono">.TXT</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
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

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleDownloadPaper(activeExam)}
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-extrabold text-xs transition flex items-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-download text-indigo-600"></i> Download / Print Paper (.txt)
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveExam(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-xs transition"
                >
                  Close
                </button>
                <button
                  onClick={() => handleStartCbt(activeExam)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-stopwatch"></i> Start Timed CBT Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* NECTA Result Share Modal */}
      <ShareProgressModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        customTitle="Share NECTA Exam Result"
        studentName={foundCandidate ? `${foundCandidate.name} (${foundCandidate.indexNumber})` : 'Amina Juma Rashid (S0101/0001)'}
        points={foundCandidate ? foundCandidate.points : 7}
        streak={foundCandidate ? Number(foundCandidate.year) : 2023}
        completedTopicsCount={foundCandidate ? foundCandidate.subjects.length : 9}
        recentAchievement={
          foundCandidate
            ? `${foundCandidate.level} ${foundCandidate.division} at ${foundCandidate.school} — ${foundCandidate.remarks}`
            : 'Form 4 CSEE Division I (Point 7) at Ilboru Secondary School'
        }
        quizResult={
          foundCandidate && foundCandidate.subjects.length > 0
            ? {
                topicTitle: `NECTA ${foundCandidate.level} ${foundCandidate.year} (${foundCandidate.division}) - ${foundCandidate.subjects.map(s => `${s.name}: Grade ${s.grade}`).join(', ')}`,
                score: 100
              }
            : {
                topicTitle: 'NECTA CSEE National Exam Result Statement',
                score: 100
              }
        }
      />
      {/* Download Success Notification Toast */}
      {downloadToast && (
        <div
          id="toast-download-success"
          className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-bounce"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg shrink-0">
            <i className="fa-solid fa-circle-arrow-down"></i>
          </div>
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-gray-100 flex items-center gap-2">
              <span>Paper Downloaded</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-mono px-1.5 py-0.5 rounded">.TXT</span>
            </div>
            <p className="text-gray-300 line-clamp-1">{downloadToast.title}</p>
            <p className="text-[11px] text-gray-400 font-mono">{downloadToast.filename}</p>
          </div>
          <button
            onClick={() => setDownloadToast(null)}
            className="text-gray-400 hover:text-white p-1 text-xs ml-2"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamVault;
