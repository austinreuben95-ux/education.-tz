import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserProgress } from '../types';
import { playGeminiVoiceAudio } from '../services/geminiService';
import { ScholarAvatar } from './ScholarAvatar';
import {
  FLASHCARD_DECK,
  TRIVIA_ROUNDS,
  PRONUNCIATION_TERMS,
  CROSSWORD_PUZZLE,
  WORD_SEARCH_WORDS,
  WORD_SEARCH_GRID,
  EXAM_SIM_DATA,
  DAILY_PRACTICE_CHALLENGE,
  FlashcardItem
} from '../interactiveGamesData';

interface InteractiveGamesSuiteProps {
  userProgress?: UserProgress;
  onAddXp?: (points: number) => void;
  onNavigateHome?: () => void;
  onOpenYunAI?: (prompt: string) => void;
}

type GameMode = 
  | 'overview'
  | 'quiz'
  | 'flashcards'
  | 'matching'
  | 'memory'
  | 'fill_blanks'
  | 'sentence_builder'
  | 'crossword'
  | 'word_search'
  | 'speed_math'
  | 'trivia'
  | 'true_false'
  | 'diagrams'
  | 'pronunciation'
  | 'hangman'
  | 'mind_map'
  | 'exam_sim'
  | 'mistake_review'
  | 'custom_quiz'
  | 'timeline'
  | 'daily_challenge';

// ==========================================
// SEED DATA FOR MATCHING & MEMORY GAMES
// ==========================================

const MATCHING_PAIRS = [
  { id: '1', term: 'Mitochondria', definition: 'Powerhouse of the cell generating ATP energy' },
  { id: '2', term: "Newton's First Law", definition: 'Inertia: object stays at rest unless acted upon by force' },
  { id: '3', term: 'Ohm’s Law', definition: 'Voltage is directly proportional to current (V = I * R)' },
  { id: '4', term: 'Photosynthesis', definition: 'Plants convert sunlight, water, and CO₂ into glucose and O₂' },
  { id: '5', term: 'Avogadro’s Constant', definition: '6.022 × 10²³ particles per mole of substance' },
  { id: '6', term: 'Osmosis', definition: 'Movement of water molecules across semi-permeable membrane' }
];

const MEMORY_CARDS_DATA = [
  { id: '1', pairId: 'a', content: 'H₂SO₄', label: 'Sulfuric Acid' },
  { id: '2', pairId: 'a', content: 'Sulfuric Acid', label: 'H₂SO₄' },
  { id: '3', pairId: 'b', content: 'NaCl', label: 'Table Salt' },
  { id: '4', pairId: 'b', content: 'Table Salt', label: 'Sodium Chloride' },
  { id: '5', pairId: 'c', content: 'v = u + at', label: '1st Motion Eq.' },
  { id: '6', pairId: 'c', content: '1st Motion Eq.', label: 'v = u + at' },
  { id: '7', pairId: 'd', content: 'DNA', label: 'Deoxyribonucleic Acid' },
  { id: '8', pairId: 'd', content: 'Genetic Material', label: 'Double Helix DNA' },
  { id: '9', pairId: 'e', content: 'πr²', label: 'Area of Circle' },
  { id: '10', pairId: 'e', content: 'Area of Circle', label: 'Formula: πr²' },
  { id: '11', pairId: 'f', content: 'Chlorophyll', label: 'Green Pigment' },
  { id: '12', pairId: 'f', content: 'Light Absorber', label: 'Chlorophyll Pigment' }
];

const FILL_BLANK_QUESTIONS = [
  {
    id: 1,
    sentence: "The law of conservation of [BLANK] states that energy cannot be created or destroyed, only transformed.",
    answer: "energy",
    hint: "Physics fundamental concept of capacity to do work"
  },
  {
    id: 2,
    sentence: "In plant cells, [BLANK] is the cell organelle responsible for carrying out photosynthesis.",
    answer: "chloroplast",
    hint: "Contains the green pigment chlorophyll"
  },
  {
    id: 3,
    sentence: "The SI unit of electrical resistance named after a German physicist is [BLANK].",
    answer: "ohm",
    hint: "Symbol is Ω"
  },
  {
    id: 4,
    sentence: "The process where a solid turns directly into a gas without melting is called [BLANK].",
    answer: "sublimation",
    hint: "Example is dry ice or iodine crystals"
  }
];

const SENTENCE_BUILDER_ITEMS = [
  {
    id: 1,
    subject: "Physics",
    correctOrder: ["The", "rate", "of", "change", "of", "momentum", "is", "proportional", "to", "applied", "force"],
    jumbled: ["force", "momentum", "rate", "applied", "The", "proportional", "is", "of", "to", "change", "of"]
  },
  {
    id: 2,
    subject: "Chemistry",
    correctOrder: ["Acids", "react", "with", "bases", "to", "form", "salt", "and", "water", "only"],
    jumbled: ["only", "water", "react", "bases", "Acids", "with", "and", "form", "to", "salt"]
  }
];

const TRUE_FALSE_QUESTIONS = [
  {
    id: 1,
    q: "Sound travels faster in air than in solid iron or steel.",
    ans: false,
    explanation: "False! Sound travels much faster in solids (~5000 m/s in steel) than in air (~340 m/s) due to closely packed atomic particles."
  },
  {
    id: 2,
    q: "The acceleration due to gravity on Earth is approximately 9.8 m/s².",
    ans: true,
    explanation: "True! Standard sea-level gravitational acceleration on Earth is 9.8 m/s² (often rounded to 10 m/s² for NECTA O-Level calculations)."
  },
  {
    id: 3,
    q: "Pure water has a neutral pH value of 7 at 25°C.",
    ans: true,
    explanation: "True! Neutral water dissociates with [H⁺] = [OH⁻] = 10⁻⁷ mol/dm³, yielding pH 7."
  },
  {
    id: 4,
    q: "Mitochondria are present in bacterial prokaryotic cells.",
    ans: false,
    explanation: "False! Prokaryotes lack membrane-bound organelles like mitochondria and true nuclei."
  }
];

const INTERACTIVE_DIAGRAMS = [
  {
    id: 'eye',
    title: 'The Human Eye (Biology Form 2 & 4)',
    description: 'Tap each anatomical structure to review its optical function in image formation.',
    parts: [
      { id: 'cornea', name: 'Cornea', x: 20, y: 50, desc: 'Transparent curved anterior section that performs ~70% of total light refraction into the eye.' },
      { id: 'lens', name: 'Crystalline Lens', x: 38, y: 50, desc: 'Biconvex flexible structure that changes shape (accommodation) to focus near and far objects.' },
      { id: 'retina', name: 'Retina', x: 75, y: 50, desc: 'Sensory inner layer containing rod and cone photoreceptors that send impulses via optic nerve.' },
      { id: 'optic_nerve', name: 'Optic Nerve', x: 88, y: 65, desc: 'Transmits visual sensory impulses from retinal ganglion cells to the visual cortex of the brain.' },
      { id: 'iris', name: 'Iris & Pupil', x: 32, y: 35, desc: 'Muscular ring regulating the diameter of the pupil and the intensity of entering light.' }
    ]
  },
  {
    id: 'plant_cell',
    title: 'Plant Cell Ultrastructure (Biology Form 1 & 3)',
    description: 'Tap each cell organelle to learn its physiological role in plant metabolism.',
    parts: [
      { id: 'cell_wall', name: 'Cellulose Cell Wall', x: 18, y: 30, desc: 'Rigid outer layer providing turgor pressure resistance and structural support.' },
      { id: 'vacuole', name: 'Large Central Vacuole', x: 50, y: 48, desc: 'Maintains osmotic balance, stores cell sap, and regulates plant turgidity.' },
      { id: 'chloroplast', name: 'Chloroplast', x: 30, y: 70, desc: 'Double-membrane organelle with thylakoids where the light and dark reactions occur.' },
      { id: 'nucleus', name: 'Nucleus & Nucleolus', x: 70, y: 35, desc: 'Contains chromosomes and controls cellular gene expression and protein synthesis.' }
    ]
  }
];

const HISTORICAL_TIMELINE = [
  { year: '1905–1907', title: 'The Maji Maji War', desc: 'Indigenous resistance across southern Tanganyika against German colonial cotton taxation and forced labor led by Kinjikitile Ngwale.' },
  { year: '1929', title: 'Formation of TAA', desc: 'The Tanganyika African Association was founded as a civic union, later transforming into the nationalist independence movement.' },
  { year: '1954', title: 'Founding of TANU', desc: 'Mwalimu Julius Kambarage Nyerere founded the Tanganyika African National Union to spearhead the campaign for self-determination.' },
  { year: '1961', title: 'Tanganyika Independence', desc: 'On December 9, 1961, Tanganyika achieved full national independence with Mwalimu Nyerere as the first Prime Minister.' },
  { year: '1964', title: 'The Historic Union', desc: 'On April 26, 1964, Tanganyika and Zanzibar united to form the United Republic of Tanzania.' },
  { year: '1967', title: 'The Arusha Declaration', desc: 'Tanzania adopted Ujamaa (African Socialism and Self-Reliance) promoting education for self-reliance and communal development.' }
];

export const InteractiveGamesSuite: React.FC<InteractiveGamesSuiteProps> = ({
  userProgress,
  onAddXp,
  onNavigateHome,
  onOpenYunAI
}) => {
  const [activeMode, setActiveMode] = useState<GameMode>('overview');
  const [earnedSessionXp, setEarnedSessionXp] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sound & Accessibility state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [scratchpadOpen, setScratchpadOpen] = useState<boolean>(false);
  const [unitConverterOpen, setUnitConverterOpen] = useState<boolean>(false);

  // Floating Utilities: Pomodoro, Calculator, Ambient Sounds
  const [pomodoroOpen, setPomodoroOpen] = useState<boolean>(false);
  const [pomoSeconds, setPomoSeconds] = useState<number>(25 * 60);
  const [pomoRunning, setPomoRunning] = useState<boolean>(false);
  const [pomoMode, setPomoMode] = useState<'study' | 'break'>('study');

  const [calculatorOpen, setCalculatorOpen] = useState<boolean>(false);
  const [calcDisplay, setCalcDisplay] = useState<string>('0');

  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'whitenoise' | 'focus'>('off');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);

  // 1. Flashcards Deck state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [flashcardFilter, setFlashcardFilter] = useState<string>('ALL');
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  // 2. Matching game state
  const [matchingSelectedTerm, setMatchingSelectedTerm] = useState<string | null>(null);
  const [matchingSolved, setMatchingSolved] = useState<string[]>([]);
  const [matchingScore, setMatchingScore] = useState<number>(0);

  // 3. Memory game state
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);

  // 4. Fill in blanks state
  const [fillInputs, setFillInputs] = useState<Record<number, string>>({});
  const [fillFeedback, setFillFeedback] = useState<Record<number, boolean | null>>({});

  // 5. Sentence builder state
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);
  const [userSentenceWords, setUserSentenceWords] = useState<string[]>([]);
  const [sentenceCorrect, setSentenceCorrect] = useState<boolean | null>(null);

  // 6. Crossword puzzle state
  const [crosswordInputs, setCrosswordInputs] = useState<Record<string, string>>({});
  const [crosswordChecked, setCrosswordChecked] = useState<boolean>(false);

  // 7. Word Search state
  const [foundWords, setFoundWords] = useState<string[]>([]);

  // 8. Speed Math state
  const [mathTimer, setMathTimer] = useState<number>(60);
  const [mathActive, setMathActive] = useState<boolean>(false);
  const [mathScore, setMathScore] = useState<number>(0);
  const [currentMathProblem, setCurrentMathProblem] = useState<{ q: string; ans: number }>({ q: '12 × 8', ans: 96 });
  const [mathInput, setMathInput] = useState<string>('');

  // 9. Trivia state
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [triviaScore, setTriviaScore] = useState<number>(0);
  const [triviaTimer, setTriviaTimer] = useState<number>(15);
  const [triviaActive, setTriviaActive] = useState<boolean>(false);
  const [triviaStreak, setTriviaStreak] = useState<number>(0);
  const [triviaSelectedAnswer, setTriviaSelectedAnswer] = useState<number | null>(null);

  // 10. True or False Sprint state
  const [tfIndex, setTfIndex] = useState<number>(0);
  const [tfScore, setTfScore] = useState<number>(0);
  const [tfStreak, setTfStreak] = useState<number>(0);
  const [tfGameOver, setTfGameOver] = useState<boolean>(false);

  // 11. Diagrams state
  const [selectedDiagram, setSelectedDiagram] = useState(INTERACTIVE_DIAGRAMS[0]);
  const [activeDiagramPart, setActiveDiagramPart] = useState<any>(null);

  // 12. Pronunciation state
  const [playingTermId, setPlayingTermId] = useState<string | null>(null);

  // 13. Hangman state
  const [hangmanWord, setHangmanWord] = useState<string>('PHOTOSYNTHESIS');
  const [hangmanHint, setHangmanHint] = useState<string>('Process by which green plants manufacture carbohydrate food');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [hangmanMistakes, setHangmanMistakes] = useState<number>(0);

  // 14. Mind map state
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root', 'physics_mech']);

  // 15. Practice Exam Simulator state
  const [examActive, setExamActive] = useState<boolean>(false);
  const [examTimeLeft, setExamTimeLeft] = useState<number>(15 * 60); // 15 mins
  const [examAnswers, setExamAnswers] = useState<Record<number, any>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examGrade, setExamGrade] = useState<{ score: number; total: number; grade: string; division: string } | null>(null);

  // 16. Mistake Review state
  const [missedQuestions, setMissedQuestions] = useState<Array<{ id: string; subject: string; question: string; explanation: string; options: string[]; correctIndex: number }>>([
    {
      id: 'mq-1',
      subject: 'Physics',
      question: 'Why does sound travel faster in steel than in air?',
      options: ['Steel has higher atomic density and elasticity', 'Air absorbs sound waves', 'Steel is colder than air', 'Steel creates magnetic resonance'],
      correctIndex: 0,
      explanation: 'Dense, closely-bound atoms in metals transmit kinetic vibrational energy much quicker.'
    },
    {
      id: 'mq-2',
      subject: 'Chemistry',
      question: 'Which of the following is an amphoteric oxide?',
      options: ['Sodium Oxide (Na₂O)', 'Zinc Oxide (ZnO)', 'Calcium Oxide (CaO)', 'Sulfur Dioxide (SO₂)'],
      correctIndex: 1,
      explanation: 'ZnO reacts with both acids and bases to form salts and water, exhibiting amphoteric behavior.'
    }
  ]);
  const [reviewingItem, setReviewingItem] = useState<any | null>(null);
  const [reviewAnswerFeedback, setReviewAnswerFeedback] = useState<string | null>(null);

  // 17. Custom Quiz Maker state
  const [customSubject, setCustomSubject] = useState<string>('Basic Mathematics');
  const [customNumQuestions, setCustomNumQuestions] = useState<number>(5);
  const [customDifficulty, setCustomDifficulty] = useState<string>('Standard NECTA');
  const [customQuizGenerated, setCustomQuizGenerated] = useState<boolean>(false);

  // 18. Daily Challenge state
  const [dailySubmitted, setDailySubmitted] = useState<boolean>(false);
  const [dailySelectedChoice, setDailySelectedChoice] = useState<number | null>(null);

  // Unit converter state
  const [convertType, setConvertType] = useState<'length' | 'mass' | 'temp'>('length');
  const [convertInput, setConvertInput] = useState<number>(100);

  // Scratchpad drawing canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const awardXp = (amount: number) => {
    setEarnedSessionXp(prev => prev + amount);
    if (onAddXp) onAddXp(amount);
    triggerToast(`+${amount} XP Earned! 🏆`);
  };

  // Pomodoro Timer Effect
  useEffect(() => {
    let timer: any;
    if (pomoRunning && pomoSeconds > 0) {
      timer = setInterval(() => setPomoSeconds(s => s - 1), 1000);
    } else if (pomoSeconds === 0 && pomoRunning) {
      if (pomoMode === 'study') {
        setPomoMode('break');
        setPomoSeconds(5 * 60);
        awardXp(50);
        triggerToast("🎉 Pomodoro Focus Block Complete! Take a 5-min break.");
      } else {
        setPomoMode('study');
        setPomoSeconds(25 * 60);
        triggerToast("Break finished! Ready for the next study sprint?");
      }
    }
    return () => clearInterval(timer);
  }, [pomoRunning, pomoSeconds, pomoMode]);

  // Speed Math Timer Effect
  useEffect(() => {
    let timer: any;
    if (mathActive && mathTimer > 0) {
      timer = setInterval(() => setMathTimer(t => t - 1), 1000);
    } else if (mathTimer === 0 && mathActive) {
      setMathActive(false);
      awardXp(mathScore * 10);
    }
    return () => clearInterval(timer);
  }, [mathActive, mathTimer]);

  // Trivia Timer Effect
  useEffect(() => {
    let timer: any;
    if (triviaActive && triviaTimer > 0) {
      timer = setInterval(() => setTriviaTimer(t => t - 1), 1000);
    } else if (triviaActive && triviaTimer === 0) {
      handleTriviaTimeout();
    }
    return () => clearInterval(timer);
  }, [triviaActive, triviaTimer]);

  // Practice Exam Timer Effect
  useEffect(() => {
    let timer: any;
    if (examActive && examTimeLeft > 0 && !examSubmitted) {
      timer = setInterval(() => setExamTimeLeft(t => t - 1), 1000);
    } else if (examActive && examTimeLeft === 0 && !examSubmitted) {
      handleSubmitExam();
    }
    return () => clearInterval(timer);
  }, [examActive, examTimeLeft, examSubmitted]);

  // Ambient sound synthesizer using Web Audio API
  const handleToggleAmbient = (type: 'off' | 'rain' | 'whitenoise' | 'focus') => {
    if (ambientSound === type || type === 'off') {
      if (noiseSourceRef.current) {
        try {
          (noiseSourceRef.current as any).stop?.();
          (noiseSourceRef.current as any).disconnect?.();
        } catch (_) {}
      }
      setAmbientSound('off');
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (noiseSourceRef.current) {
        try {
          (noiseSourceRef.current as any).stop?.();
          (noiseSourceRef.current as any).disconnect?.();
        } catch (_) {}
      }

      if (type === 'focus') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(216, ctx.currentTime); // 432Hz harmonic
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        noiseSourceRef.current = osc;
      } else {
        // Noise buffer for Rain or White Noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02; // Pink/Brownish warm noise
          lastOut = output[i];
          output[i] *= 2.5;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain' ? 800 : 1200;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.05;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();
        noiseSourceRef.current = whiteNoise;
      }

      setAmbientSound(type);
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  };

  // Speed Math Functions
  const generateNewMath = () => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 20) + 2;
    let n2 = Math.floor(Math.random() * 12) + 2;
    let ans = 0;
    if (op === '+') ans = n1 + n2;
    if (op === '-') {
      if (n1 < n2) [n1, n2] = [n2, n1];
      ans = n1 - n2;
    }
    if (op === '×') {
      n1 = Math.floor(Math.random() * 12) + 2;
      n2 = Math.floor(Math.random() * 12) + 2;
      ans = n1 * n2;
    }
    setCurrentMathProblem({ q: `${n1} ${op} ${n2}`, ans });
    setMathInput('');
  };

  const startSpeedMath = () => {
    setMathActive(true);
    setMathTimer(60);
    setMathScore(0);
    generateNewMath();
  };

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathInput) === currentMathProblem.ans) {
      setMathScore(s => s + 1);
      generateNewMath();
    } else {
      triggerToast("Try again!");
      setMathInput('');
    }
  };

  // Matching Handler
  const handleTermClick = (termId: string) => {
    if (matchingSolved.includes(termId)) return;
    setMatchingSelectedTerm(termId);
  };

  const handleDefClick = (pairId: string) => {
    if (!matchingSelectedTerm || matchingSolved.includes(pairId)) return;
    if (matchingSelectedTerm === pairId) {
      setMatchingSolved(prev => [...prev, pairId]);
      setMatchingScore(s => s + 1);
      setMatchingSelectedTerm(null);
      awardXp(25);
    } else {
      triggerToast("Not a match, try again!");
      setMatchingSelectedTerm(null);
    }
  };

  // Memory Game Handler
  const handleCardClick = (index: number) => {
    if (memoryFlipped.length === 2 || memoryFlipped.includes(index)) return;
    const currentCard = MEMORY_CARDS_DATA[index];
    if (memoryMatched.includes(currentCard.pairId)) return;

    const newFlipped = [...memoryFlipped, index];
    setMemoryFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const card1 = MEMORY_CARDS_DATA[newFlipped[0]];
      const card2 = MEMORY_CARDS_DATA[newFlipped[1]];
      if (card1.pairId === card2.pairId) {
        setMemoryMatched(prev => [...prev, card1.pairId]);
        setMemoryFlipped([]);
        awardXp(30);
      } else {
        setTimeout(() => setMemoryFlipped([]), 1000);
      }
    }
  };

  // Fill in blanks handler
  const checkBlankAnswer = (qId: number) => {
    const q = FILL_BLANK_QUESTIONS.find(item => item.id === qId);
    if (!q) return;
    const input = (fillInputs[qId] || '').trim().toLowerCase();
    const isCorrect = input === q.answer.toLowerCase();
    setFillFeedback(prev => ({ ...prev, [qId]: isCorrect }));
    if (isCorrect) awardXp(20);
  };

  // Sentence builder handler
  const addWordToSentence = (word: string) => {
    setUserSentenceWords(prev => [...prev, word]);
  };

  const removeWordFromSentence = (index: number) => {
    setUserSentenceWords(prev => prev.filter((_, i) => i !== index));
  };

  const verifySentence = () => {
    const item = SENTENCE_BUILDER_ITEMS[sentenceIndex];
    const isMatch = userSentenceWords.join(' ') === item.correctOrder.join(' ');
    setSentenceCorrect(isMatch);
    if (isMatch) awardXp(40);
  };

  // True / False handler
  const handleTfAnswer = (userChoice: boolean) => {
    const current = TRUE_FALSE_QUESTIONS[tfIndex];
    if (userChoice === current.ans) {
      setTfScore(s => s + 1);
      setTfStreak(st => st + 1);
      awardXp(15 + tfStreak * 5);
    } else {
      setTfStreak(0);
      triggerToast(`Incorrect: ${current.explanation}`);
    }

    if (tfIndex + 1 < TRUE_FALSE_QUESTIONS.length) {
      setTfIndex(i => i + 1);
    } else {
      setTfGameOver(true);
    }
  };

  // Trivia Handler
  const startTrivia = () => {
    setTriviaActive(true);
    setTriviaIndex(0);
    setTriviaScore(0);
    setTriviaStreak(0);
    setTriviaTimer(15);
    setTriviaSelectedAnswer(null);
  };

  const handleTriviaAnswer = (choiceIndex: number) => {
    if (triviaSelectedAnswer !== null) return;
    setTriviaSelectedAnswer(choiceIndex);
    const q = TRIVIA_ROUNDS[triviaIndex];
    const isCorrect = choiceIndex === q.correctIndex;

    if (isCorrect) {
      const earned = q.points * (1 + triviaStreak * 0.2);
      setTriviaScore(s => Math.round(s + earned));
      setTriviaStreak(st => st + 1);
      awardXp(Math.round(earned));
    } else {
      setTriviaStreak(0);
      // Track as mistake for Mistake Review
      setMissedQuestions(prev => [
        ...prev,
        {
          id: `triv-miss-${Date.now()}`,
          subject: q.subject,
          question: q.question,
          explanation: q.explanation,
          options: q.options,
          correctIndex: q.correctIndex
        }
      ]);
    }

    setTimeout(() => {
      if (triviaIndex + 1 < TRIVIA_ROUNDS.length) {
        setTriviaIndex(i => i + 1);
        setTriviaTimer(15);
        setTriviaSelectedAnswer(null);
      } else {
        setTriviaActive(false);
      }
    }, 1500);
  };

  const handleTriviaTimeout = () => {
    setTriviaStreak(0);
    triggerToast("Time's up for this question!");
    if (triviaIndex + 1 < TRIVIA_ROUNDS.length) {
      setTriviaIndex(i => i + 1);
      setTriviaTimer(15);
      setTriviaSelectedAnswer(null);
    } else {
      setTriviaActive(false);
    }
  };

  // Hangman guess handler
  const handleHangmanGuess = (letter: string) => {
    if (guessedLetters.includes(letter)) return;
    setGuessedLetters(prev => [...prev, letter]);
    if (!hangmanWord.includes(letter)) {
      setHangmanMistakes(m => m + 1);
    }
  };

  const hangmanWon = hangmanWord.split('').every(l => guessedLetters.includes(l));
  const hangmanLost = hangmanMistakes >= 6;

  // Practice Exam Simulator submit
  const handleSubmitExam = () => {
    let score = 0;
    let total = 0;
    EXAM_SIM_DATA.forEach(q => {
      total += q.marks;
      if (examAnswers[q.id] === q.correctAnswer) {
        score += q.marks;
      } else {
        setMissedQuestions(prev => [
          ...prev,
          {
            id: `exam-miss-${q.id}`,
            subject: 'General Science',
            question: q.question,
            explanation: q.explanation,
            options: q.options || [],
            correctIndex: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0
          }
        ]);
      }
    });

    const percent = Math.round((score / total) * 100);
    let grade = 'F';
    let division = 'Division IV / Zero';
    if (percent >= 75) { grade = 'A'; division = 'Division I (Distinction)'; }
    else if (percent >= 65) { grade = 'B'; division = 'Division I / II (Credit)'; }
    else if (percent >= 50) { grade = 'C'; division = 'Division II / III (Pass)'; }
    else if (percent >= 35) { grade = 'D'; division = 'Division IV (Subsidiary)'; }

    setExamGrade({ score, total, grade, division });
    setExamSubmitted(true);
    setExamActive(false);
    awardXp(score * 20);
  };

  // Filtered Flashcards
  const filteredFlashcards = useMemo(() => {
    if (flashcardFilter === 'ALL') return FLASHCARD_DECK;
    return FLASHCARD_DECK.filter(c => c.subject.toUpperCase() === flashcardFilter.toUpperCase());
  }, [flashcardFilter]);

  const currentFlashcard = filteredFlashcards[flashcardIndex] || FLASHCARD_DECK[0];

  // Pronunciation player with Gemini voice
  const handlePronounce = async (term: any) => {
    setPlayingTermId(term.id);
    await playGeminiVoiceAudio({
      text: `${term.term}. In Swahili: ${term.swahiliMeaning}. Definition: ${term.definition}`,
      voiceName: 'Kore',
      language: term.language === 'sw' ? 'sw' : 'en',
      onEnd: () => setPlayingTermId(null),
      onError: () => setPlayingTermId(null)
    });
  };

  // Calculator Functions
  const handleCalcInput = (char: string) => {
    if (char === 'C') {
      setCalcDisplay('0');
      return;
    }
    if (char === '=') {
      try {
        const safe = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        const res = Function(`'use strict'; return (${safe})`)();
        setCalcDisplay(String(res));
      } catch (_) {
        setCalcDisplay('Error');
      }
      return;
    }
    if (calcDisplay === '0' || calcDisplay === 'Error') {
      setCalcDisplay(char);
    } else {
      setCalcDisplay(prev => prev + char);
    }
  };

  // Canvas drawing functions for scratchpad
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = highContrast ? '#ffffff' : '#4f46e5';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div 
      id="interactive-games-suite-container" 
      className={`min-h-screen text-slate-900 pb-20 ${
        dyslexiaFont ? 'font-mono' : 'font-sans'
      } ${highContrast ? 'bg-black text-white' : 'bg-slate-50'}`}
    >
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-950 border-2 border-amber-400 text-amber-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black animate-fade-in">
          <i className="fa-solid fa-sparkles text-amber-400 text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Utilities Drawer Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        {/* Pomodoro Timer button */}
        <button
          onClick={() => setPomodoroOpen(!pomodoroOpen)}
          className={`w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center text-lg transition active:scale-95 ${
            pomoRunning ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 text-amber-400 border border-slate-700'
          }`}
          title="Pomodoro Focus Timer"
        >
          <i className="fa-solid fa-clock"></i>
        </button>

        {/* Ambient background sound button */}
        <button
          onClick={() => handleToggleAmbient(ambientSound === 'off' ? 'rain' : 'off')}
          className={`w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center text-lg transition active:scale-95 ${
            ambientSound !== 'off' ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' : 'bg-slate-900 text-slate-300 border border-slate-700'
          }`}
          title="Toggle Ambient Study Sound"
        >
          <i className={`fa-solid ${ambientSound === 'off' ? 'fa-headphones' : 'fa-water'}`}></i>
        </button>

        {/* On-screen calculator button */}
        <button
          onClick={() => setCalculatorOpen(!calculatorOpen)}
          className="w-12 h-12 rounded-2xl bg-cyan-700 hover:bg-cyan-600 text-white shadow-xl flex items-center justify-center text-lg transition active:scale-95"
          title="On-Screen Scientific Calculator"
        >
          <i className="fa-solid fa-calculator"></i>
        </button>

        {/* Scratchpad drawing canvas button */}
        <button
          onClick={() => setScratchpadOpen(!scratchpadOpen)}
          className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl flex items-center justify-center text-lg transition active:scale-95"
          title="Open Calculation Scratchpad / Drawing Board"
        >
          <i className="fa-solid fa-pen-nib"></i>
        </button>

        {/* Unit converter button */}
        <button
          onClick={() => setUnitConverterOpen(!unitConverterOpen)}
          className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl flex items-center justify-center text-lg transition active:scale-95"
          title="Unit Converter"
        >
          <i className="fa-solid fa-scale-balanced"></i>
        </button>
      </div>

      {/* Floating Pomodoro Timer Widget */}
      {pomodoroOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 border-2 border-amber-400 text-white p-4 rounded-3xl shadow-2xl w-72 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-black uppercase text-amber-400">
              ⏱️ Pomodoro ({pomoMode === 'study' ? '25m Focus' : '5m Break'})
            </span>
            <button onClick={() => setPomodoroOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black font-mono tracking-wider text-amber-300">
              {Math.floor(pomoSeconds / 60).toString().padStart(2, '0')}:{(pomoSeconds % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {pomoMode === 'study' ? 'Stay concentrated on your task' : 'Stretch, rest your eyes, sip water'}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setPomoRunning(!pomoRunning)}
              className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition"
            >
              {pomoRunning ? 'Pause' : 'Start Focus'}
            </button>
            <button
              onClick={() => {
                setPomoRunning(false);
                setPomoSeconds(pomoMode === 'study' ? 25 * 60 : 5 * 60);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Floating Calculator Overlay */}
      {calculatorOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-950 border-2 border-cyan-400 text-white p-4 rounded-3xl shadow-2xl w-64 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-black uppercase text-cyan-400">
              🧮 Scientific / Basic Calc
            </span>
            <button onClick={() => setCalculatorOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-right font-mono text-xl font-black text-cyan-300 overflow-x-auto">
            {calcDisplay}
          </div>
          <div className="grid grid-cols-4 gap-1.5 font-mono text-xs font-black">
            {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalcInput(btn)}
                className={`p-2.5 rounded-xl transition ${
                  btn === '=' ? 'bg-cyan-500 text-slate-950 col-span-1 hover:bg-cyan-400' :
                  ['÷', '×', '-', '+'].includes(btn) ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' :
                  btn === 'C' ? 'bg-rose-900/60 text-rose-300' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scratchpad Canvas Modal */}
      {scratchpadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-indigo-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-pen-fancy text-indigo-600"></i>
                <h4 className="font-black text-sm text-slate-900">Digital Working Board / Rough Calculation Canvas</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100"
                >
                  Clear
                </button>
                <button
                  onClick={() => setScratchpadOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={450}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl cursor-crosshair touch-none"
            />
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Use your mouse or touchscreen to draft formulas, free-body diagrams, and math steps.
            </p>
          </div>
        </div>
      )}

      {/* Unit Converter Modal */}
      {unitConverterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-scale-balanced text-amber-600 text-lg"></i>
                <h4 className="font-black text-base text-slate-900">NECTA Unit Converter</h4>
              </div>
              <button
                onClick={() => setUnitConverterOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div className="flex rounded-xl bg-slate-100 p-1">
                {(['length', 'mass', 'temp'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setConvertType(t)}
                    className={`flex-1 py-1.5 rounded-lg capitalize transition ${
                      convertType === t ? 'bg-white text-indigo-600 shadow-sm font-black' : 'text-slate-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Enter Value:</label>
                <input
                  type="number"
                  value={convertInput}
                  onChange={(e) => setConvertInput(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-sm"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border space-y-2">
                {convertType === 'length' && (
                  <>
                    <div className="flex justify-between"><span>Meters (m):</span><strong className="text-indigo-600">{convertInput} m</strong></div>
                    <div className="flex justify-between"><span>Centimeters (cm):</span><strong>{(convertInput * 100).toFixed(2)} cm</strong></div>
                    <div className="flex justify-between"><span>Kilometers (km):</span><strong>{(convertInput / 1000).toFixed(4)} km</strong></div>
                    <div className="flex justify-between"><span>Millimeters (mm):</span><strong>{(convertInput * 1000).toFixed(1)} mm</strong></div>
                  </>
                )}
                {convertType === 'mass' && (
                  <>
                    <div className="flex justify-between"><span>Kilograms (kg):</span><strong className="text-indigo-600">{convertInput} kg</strong></div>
                    <div className="flex justify-between"><span>Grams (g):</span><strong>{(convertInput * 1000).toFixed(1)} g</strong></div>
                    <div className="flex justify-between"><span>Milligrams (mg):</span><strong>{(convertInput * 1000000).toFixed(0)} mg</strong></div>
                    <div className="flex justify-between"><span>Metric Tonnes:</span><strong>{(convertInput / 1000).toFixed(4)} t</strong></div>
                  </>
                )}
                {convertType === 'temp' && (
                  <>
                    <div className="flex justify-between"><span>Celsius (°C):</span><strong className="text-indigo-600">{convertInput} °C</strong></div>
                    <div className="flex justify-between"><span>Kelvin (K):</span><strong>{(convertInput + 273.15).toFixed(2)} K</strong></div>
                    <div className="flex justify-between"><span>Fahrenheit (°F):</span><strong>{((convertInput * 9/5) + 32).toFixed(2)} °F</strong></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Accessibility Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm"
                title="Back to Dashboard"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-md">
              <i className="fa-solid fa-gamepad"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Interactive Learning & Game Arcade
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                  20 Engines
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Puzzles, mental math sprints, interactive diagrams, flashcards & exam simulators
              </p>
            </div>
          </div>

          {/* Quick Accessibility & Controls Bar */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-amber-300">
              Session XP: +{earnedSessionXp}
            </span>

            <button
              onClick={() => setDyslexiaFont(!dyslexiaFont)}
              className={`p-2 rounded-xl text-xs font-bold transition border ${
                dyslexiaFont ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Toggle Dyslexia-Friendly Monospace Font"
            >
              <i className="fa-solid fa-font"></i>
            </button>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2 rounded-xl text-xs font-bold transition border ${
                highContrast ? 'bg-white text-slate-950 border-white' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Toggle High Contrast Mode"
            >
              <i className="fa-solid fa-circle-half-stroke"></i>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs"
              title="Sound Effects"
            >
              <i className={`fa-solid ${soundEnabled ? 'fa-volume-high text-emerald-400' : 'fa-volume-xmark text-slate-500'}`}></i>
            </button>
          </div>
        </div>

        {/* 20 Game Modes Navigation Pills */}
        <div className="bg-slate-950/80 border-t border-slate-800 px-4 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max text-xs font-extrabold">
            {[
              { id: 'overview', label: 'All 20 Games', icon: 'fa-table-cells' },
              { id: 'daily_challenge', label: 'Daily Challenge', icon: 'fa-calendar-star' },
              { id: 'flashcards', label: 'Flashcard Deck', icon: 'fa-layer-group' },
              { id: 'speed_math', label: 'Speed Math', icon: 'fa-bolt' },
              { id: 'matching', label: 'Subject Matcher', icon: 'fa-link' },
              { id: 'memory', label: 'Memory Flip', icon: 'fa-clone' },
              { id: 'trivia', label: 'Subject Trivia', icon: 'fa-trophy' },
              { id: 'crossword', label: 'Crossword Puzzle', icon: 'fa-square-check' },
              { id: 'word_search', label: 'Word Search', icon: 'fa-magnifying-glass' },
              { id: 'fill_blanks', label: 'Fill in Blank', icon: 'fa-pen-to-square' },
              { id: 'sentence_builder', label: 'Sentence Builder', icon: 'fa-lines-leaning' },
              { id: 'true_false', label: 'True/False Sprint', icon: 'fa-check-double' },
              { id: 'diagrams', label: 'Interactive Diagrams', icon: 'fa-microscope' },
              { id: 'pronunciation', label: 'Audio Pronunciation', icon: 'fa-volume-high' },
              { id: 'hangman', label: 'Word Guess / Hangman', icon: 'fa-spell-check' },
              { id: 'timeline', label: 'History Timeline', icon: 'fa-timeline' },
              { id: 'mind_map', label: 'Concept Map', icon: 'fa-network-wired' },
              { id: 'exam_sim', label: 'Exam Simulator', icon: 'fa-stopwatch' },
              { id: 'mistake_review', label: 'Mistake Review', icon: 'fa-rotate-left' },
              { id: 'custom_quiz', label: 'Custom Quiz Maker', icon: 'fa-sliders' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id as any)}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeMode === m.id
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <i className={`fa-solid ${m.icon} text-[11px]`}></i>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="max-w-7xl mx-auto px-4 pt-6">

        {/* 1. OVERVIEW GRID SHOWCASING ALL 20 ENGINES */}
        {activeMode === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border-2 border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-400 text-slate-950 mb-2 inline-block">
                  NECTA Gamified Learning Vault
                </span>
                <h2 className="text-xl sm:text-2xl font-black">20 Interactive Learning & Exercise Engines</h2>
                <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl">
                  Choose any mini-game below to sharpen mental math, flip formulas, build sentences, practice pronunciation with Gemini voices, and challenge mock exams!
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMode('daily_challenge')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs uppercase shadow-md active:scale-95 transition"
                >
                  ⭐ Daily Challenge (+50 XP)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { mode: 'daily_challenge', title: 'Daily Practice Challenge', desc: 'Single featured NECTA concept buster with streak XP', icon: 'fa-calendar-star', color: 'from-amber-500 to-yellow-500' },
                { mode: 'flashcards', title: 'Flashcard Deck Generator', desc: 'Digital 3D flip cards for formulas and definitions', icon: 'fa-layer-group', color: 'from-blue-600 to-indigo-600' },
                { mode: 'speed_math', title: 'Speed Math Rush', desc: '60-second rapid mental math calculations', icon: 'fa-bolt', color: 'from-amber-500 to-orange-500' },
                { mode: 'matching', title: 'Subject Matching', desc: 'Connect scientific terms to definitions', icon: 'fa-link', color: 'from-indigo-600 to-indigo-500' },
                { mode: 'memory', title: 'Memory Match', desc: '12-card flipping puzzle matching chemical formulas', icon: 'fa-clone', color: 'from-purple-600 to-purple-500' },
                { mode: 'trivia', title: 'Subject Trivia Mode', desc: '15-second timed multi-choice rounds with streak multiplier', icon: 'fa-trophy', color: 'from-yellow-500 to-amber-600' },
                { mode: 'crossword', title: 'Crossword Puzzle', desc: 'Auto-generated crossword puzzle for science vocabulary', icon: 'fa-square-check', color: 'from-emerald-600 to-teal-600' },
                { mode: 'word_search', title: 'Word Search Puzzles', desc: 'Find key NECTA terms in custom letter matrices', icon: 'fa-magnifying-glass', color: 'from-teal-600 to-cyan-600' },
                { mode: 'fill_blanks', title: 'Fill in the Blank', desc: 'Real-time text input checking for NECTA laws', icon: 'fa-pen-to-square', color: 'from-emerald-600 to-emerald-500' },
                { mode: 'sentence_builder', title: 'Sentence Builder', desc: 'Reorder jumbled words for grammar mastery', icon: 'fa-lines-leaning', color: 'from-cyan-600 to-cyan-500' },
                { mode: 'true_false', title: 'True or False Sprint', desc: 'Rapid-fire boolean recall with streak bonuses', icon: 'fa-check-double', color: 'from-rose-600 to-rose-500' },
                { mode: 'diagrams', title: 'Interactive Diagrams', desc: 'Clickable anatomy hotspots with exam notes', icon: 'fa-microscope', color: 'from-teal-600 to-teal-500' },
                { mode: 'pronunciation', title: 'Audio Pronunciation', desc: 'Clickable sound clips using Gemini speech engine', icon: 'fa-volume-high', color: 'from-sky-600 to-blue-600' },
                { mode: 'hangman', title: 'Word Guess / Hangman', desc: 'Educational word puzzle with subject definitions', icon: 'fa-spell-check', color: 'from-orange-600 to-orange-500' },
                { mode: 'timeline', title: 'Historical Timelines', desc: 'Clickable chronology of Tanzania & science', icon: 'fa-timeline', color: 'from-amber-600 to-amber-500' },
                { mode: 'mind_map', title: 'Concept Mind Maps', desc: 'Hierarchical node trees explaining broad topics', icon: 'fa-network-wired', color: 'from-blue-600 to-blue-500' },
                { mode: 'exam_sim', title: 'Practice Exam Simulator', desc: 'Full exam mode with 15-min timer & NECTA grading', icon: 'fa-stopwatch', color: 'from-red-600 to-rose-600' },
                { mode: 'mistake_review', title: 'Mistake Review Mode', desc: 'Targeted re-quizzing on previously missed questions', icon: 'fa-rotate-left', color: 'from-violet-600 to-purple-600' },
                { mode: 'custom_quiz', title: 'Custom Quiz Maker', desc: 'Create tailored tests by topic, grade, and question count', icon: 'fa-sliders', color: 'from-slate-700 to-slate-800' }
              ].map(card => (
                <button
                  key={card.mode}
                  onClick={() => setActiveMode(card.mode as any)}
                  className="bg-white p-5 rounded-3xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group active:scale-98"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}>
                      <i className={`fa-solid ${card.icon}`}></i>
                    </div>
                    <span className="text-xs font-black text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Play <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. DAILY PRACTICE CHALLENGE */}
        {activeMode === 'daily_challenge' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-300 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                    ⭐ {DAILY_PRACTICE_CHALLENGE.title}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{DAILY_PRACTICE_CHALLENGE.date}</span>
                </div>
                <span className="text-xs font-black text-emerald-600">
                  +{DAILY_PRACTICE_CHALLENGE.xpReward} XP Reward
                </span>
              </div>

              <div>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider block mb-1">
                  {DAILY_PRACTICE_CHALLENGE.subject}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {DAILY_PRACTICE_CHALLENGE.question}
                </h3>
              </div>

              <div className="space-y-3">
                {DAILY_PRACTICE_CHALLENGE.options.map((opt, idx) => {
                  const isSelected = dailySelectedChoice === idx;
                  const isCorrect = idx === DAILY_PRACTICE_CHALLENGE.correctIndex;
                  return (
                    <button
                      key={idx}
                      disabled={dailySubmitted}
                      onClick={() => setDailySelectedChoice(idx)}
                      className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-bold transition flex items-center justify-between ${
                        dailySubmitted && isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                          : dailySubmitted && isSelected && !isCorrect
                          ? 'bg-rose-50 border-rose-400 text-rose-900'
                          : isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {dailySubmitted && isCorrect && <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>}
                      {dailySubmitted && isSelected && !isCorrect && <i className="fa-solid fa-circle-xmark text-rose-500 text-sm"></i>}
                    </button>
                  );
                })}
              </div>

              {!dailySubmitted ? (
                <button
                  disabled={dailySelectedChoice === null}
                  onClick={() => {
                    setDailySubmitted(true);
                    if (dailySelectedChoice === DAILY_PRACTICE_CHALLENGE.correctIndex) {
                      awardXp(DAILY_PRACTICE_CHALLENGE.xpReward);
                    } else {
                      triggerToast("Review the detailed explanation below!");
                    }
                  }}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition ${
                    dailySelectedChoice !== null
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit Daily Answer
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>💡 Concept Insight:</span>
                    <span>Community Accuracy: {DAILY_PRACTICE_CHALLENGE.communityCorrectPercent}%</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    {DAILY_PRACTICE_CHALLENGE.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. FLASHCARD DECK GENERATOR */}
        {activeMode === 'flashcards' && (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-black text-slate-400 uppercase">Subjects:</span>
              <div className="flex gap-1.5">
                {['ALL', 'BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'GEOGRAPHY', 'CIVICS'].map(subj => (
                  <button
                    key={subj}
                    onClick={() => {
                      setFlashcardFilter(subj);
                      setFlashcardIndex(0);
                      setIsFlipped(false);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                      flashcardFilter === subj ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Flashcard Box with Flip */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-white rounded-3xl border-2 border-indigo-200 shadow-xl p-8 min-h-[300px] flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-indigo-400 relative group"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black">
                  {currentFlashcard.subject}
                </span>
                <span className="text-slate-400">
                  Card {flashcardIndex + 1} of {filteredFlashcards.length} • Tap to Flip 🔄
                </span>
              </div>

              <div className="py-6 text-center space-y-3">
                {!isFlipped ? (
                  <>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {currentFlashcard.term}
                    </h3>
                    {currentFlashcard.swahiliTerm && (
                      <p className="text-xs font-bold text-slate-400">
                        Swahili: <span className="text-indigo-600">{currentFlashcard.swahiliTerm}</span>
                      </p>
                    )}
                    <span className="inline-block mt-4 text-[11px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                      Click card to reveal definition & formula
                    </span>
                  </>
                ) : (
                  <div className="space-y-4 animate-fade-in text-left">
                    <div>
                      <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Definition:</h4>
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed mt-1">
                        {currentFlashcard.definition}
                      </p>
                    </div>
                    {currentFlashcard.formulaOrNote && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                        <span className="text-[10px] font-black uppercase text-amber-800 block">Formula / Exam Rule:</span>
                        <span className="text-xs font-mono font-black text-amber-950">{currentFlashcard.formulaOrNote}</span>
                      </div>
                    )}
                    {currentFlashcard.example && (
                      <p className="text-xs text-slate-500 italic">
                        Example: {currentFlashcard.example}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playGeminiVoiceAudio({
                      text: `${currentFlashcard.term}. ${currentFlashcard.definition}`,
                      voiceName: 'Kore',
                      language: 'en'
                    });
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-volume-high"></i>
                  <span>Listen Voice</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!masteredCards.includes(currentFlashcard.id)) {
                      setMasteredCards(prev => [...prev, currentFlashcard.id]);
                      awardXp(15);
                    }
                  }}
                  className={`text-xs font-bold px-3 py-1 rounded-xl transition ${
                    masteredCards.includes(currentFlashcard.id)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {masteredCards.includes(currentFlashcard.id) ? '✓ Mastered' : 'Mark as Mastered'}
                </button>
              </div>
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between">
              <button
                disabled={flashcardIndex === 0}
                onClick={() => {
                  setFlashcardIndex(i => i - 1);
                  setIsFlipped(false);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40"
              >
                ◀ Previous
              </button>
              <button
                onClick={() => {
                  setIsFlipped(!isFlipped);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-md"
              >
                Flip Card 🔄
              </button>
              <button
                disabled={flashcardIndex + 1 >= filteredFlashcards.length}
                onClick={() => {
                  setFlashcardIndex(i => i + 1);
                  setIsFlipped(false);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40"
              >
                Next ▶
              </button>
            </div>
          </div>
        )}

        {/* 4. SPEED MATH CHALLENGE */}
        {activeMode === 'speed_math' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-300 shadow-xl text-center space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                  ⚡ 60s Speed Math Challenge
                </span>
                <span className="text-sm font-black text-slate-600">
                  Score: <strong className="text-amber-600 text-base">{mathScore}</strong>
                </span>
              </div>

              {!mathActive && mathTimer === 60 ? (
                <div className="py-8 space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-amber-400/30">
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Mental Math Sprint</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Solve as many multiplication, addition, and subtraction problems as you can in 60 seconds!
                  </p>
                  <button
                    onClick={startSpeedMath}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-400/30 transition transform active:scale-95 cursor-pointer"
                  >
                    Start 60s Rush 🚀
                  </button>
                </div>
              ) : mathTimer > 0 ? (
                <div className="space-y-6 py-4">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center mx-auto text-xl font-black text-amber-600 shadow-sm animate-pulse">
                    {mathTimer}s
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-wide">
                    {currentMathProblem.q} = ?
                  </div>

                  <form onSubmit={handleMathSubmit} className="flex gap-2 max-w-xs mx-auto">
                    <input
                      type="number"
                      autoFocus
                      value={mathInput}
                      onChange={(e) => setMathInput(e.target.value)}
                      placeholder="Answer"
                      className="flex-1 text-center text-2xl font-black p-3 bg-slate-50 border-2 border-indigo-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-300 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md"
                    >
                      Enter
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Time's Up!</h3>
                  <p className="text-sm font-bold text-slate-600">
                    You solved <strong className="text-emerald-600">{mathScore}</strong> math questions correctly.
                  </p>
                  <button
                    onClick={startSpeedMath}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. SUBJECT MATCHING GAME */}
        {activeMode === 'matching' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-indigo-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Term-to-Definition Matcher</h3>
                  <p className="text-xs text-slate-500">Tap a concept on the left, then tap its matching definition on the right.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700">
                  Matched: {matchingSolved.length} / {MATCHING_PAIRS.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Terms */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Scientific Terms</h4>
                  {MATCHING_PAIRS.map(item => {
                    const isSolved = matchingSolved.includes(item.id);
                    const isSelected = matchingSelectedTerm === item.id;
                    return (
                      <button
                        key={item.id}
                        disabled={isSolved}
                        onClick={() => handleTermClick(item.id)}
                        className={`w-full p-4 rounded-2xl border-2 text-left font-black text-xs transition flex items-center justify-between ${
                          isSolved
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-4 ring-indigo-300'
                            : 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-800'
                        }`}
                      >
                        <span>{item.term}</span>
                        {isSolved ? (
                          <i className="fa-solid fa-circle-check text-emerald-600"></i>
                        ) : (
                          <i className="fa-solid fa-chevron-right text-[10px] opacity-40"></i>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Definitions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Definitions & Principles</h4>
                  {[...MATCHING_PAIRS].reverse().map(item => {
                    const isSolved = matchingSolved.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        disabled={isSolved}
                        onClick={() => handleDefClick(item.id)}
                        className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-medium transition flex items-center justify-between ${
                          isSolved
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                            : 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800'
                        }`}
                      >
                        <span className="leading-relaxed">{item.definition}</span>
                        {isSolved && <i className="fa-solid fa-check text-emerald-600 ml-2"></i>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. MEMORY MATCH */}
        {activeMode === 'memory' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-lg text-center space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-900">Chemical & Math Memory Match</h3>
                  <p className="text-xs text-slate-500">Flip cards to match formulas with their names</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-black">
                  <span>Moves: {memoryMoves}</span>
                  <span className="text-purple-600">Pairs: {memoryMatched.length} / 6</span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {MEMORY_CARDS_DATA.map((card, idx) => {
                  const isFlipped = memoryFlipped.includes(idx) || memoryMatched.includes(card.pairId);
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 p-2 flex flex-col items-center justify-center transition-all duration-300 font-bold text-xs ${
                        isFlipped
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md rotate-y-180'
                          : 'bg-slate-100 border-slate-300 hover:border-purple-400 hover:bg-purple-50 text-slate-400'
                      }`}
                    >
                      {isFlipped ? (
                        <div className="space-y-1 animate-fade-in">
                          <span className="font-black text-sm block">{card.content}</span>
                          <span className="text-[10px] text-purple-200 block">{card.label}</span>
                        </div>
                      ) : (
                        <i className="fa-solid fa-question text-xl text-slate-300"></i>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 7. SUBJECT TRIVIA MODE */}
        {activeMode === 'trivia' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-yellow-300 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-yellow-100 text-yellow-800">
                  🏆 Subject Trivia Mode
                </span>
                <div className="flex items-center gap-3 text-xs font-black">
                  <span className="text-amber-600">🔥 Streak: {triviaStreak}x</span>
                  <span>Score: {triviaScore}</span>
                </div>
              </div>

              {!triviaActive && triviaScore === 0 ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-yellow-400 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-md">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Fast-Paced NECTA Trivia</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Answer fast! You have 15 seconds per question. Correct answers with high streaks earn bonus XP multipliers.
                  </p>
                  <button
                    onClick={startTrivia}
                    className="px-8 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase shadow-md active:scale-95 transition"
                  >
                    Start Trivia Rounds 🚀
                  </button>
                </div>
              ) : triviaActive ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Question {triviaIndex + 1} of {TRIVIA_ROUNDS.length} ({TRIVIA_ROUNDS[triviaIndex].subject})</span>
                    <span className="text-rose-500 font-mono font-black">{triviaTimer}s left</span>
                  </div>

                  <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {TRIVIA_ROUNDS[triviaIndex].question}
                  </p>

                  <div className="space-y-2.5">
                    {TRIVIA_ROUNDS[triviaIndex].options.map((opt, idx) => {
                      const isChosen = triviaSelectedAnswer === idx;
                      const isCorrect = idx === TRIVIA_ROUNDS[triviaIndex].correctIndex;
                      return (
                        <button
                          key={idx}
                          disabled={triviaSelectedAnswer !== null}
                          onClick={() => handleTriviaAnswer(idx)}
                          className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs font-bold transition flex items-center justify-between ${
                            triviaSelectedAnswer !== null && isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                              : triviaSelectedAnswer !== null && isChosen && !isCorrect
                              ? 'bg-rose-100 border-rose-400 text-rose-900'
                              : 'bg-slate-50 border-slate-200 hover:border-yellow-400 text-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {triviaSelectedAnswer !== null && isCorrect && <i className="fa-solid fa-circle-check text-emerald-600"></i>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Trivia Round Complete!</h3>
                  <p className="text-sm font-bold text-slate-600">
                    Final Trivia Score: <strong className="text-yellow-600">{triviaScore} pts</strong>
                  </p>
                  <button
                    onClick={startTrivia}
                    className="px-6 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs"
                  >
                    Play Another Round
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. CROSSWORD PUZZLE GENERATOR */}
        {activeMode === 'crossword' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">NECTA Science Crossword</h3>
                  <p className="text-xs text-slate-500">Fill in the letters corresponding to the Across & Down clues</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800">
                  Interactive Grid
                </span>
              </div>

              {/* Clues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs">
                <div>
                  <h4 className="font-black text-emerald-800 uppercase mb-2">Across Clues:</h4>
                  <ul className="space-y-1.5 text-slate-700 font-medium">
                    {CROSSWORD_PUZZLE.clues.filter(c => c.direction === 'across').map(c => (
                      <li key={`ac-${c.num}-${c.word}`}>
                        <strong>{c.num} Across:</strong> {c.clue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-black text-teal-800 uppercase mb-2">Down Clues:</h4>
                  <ul className="space-y-1.5 text-slate-700 font-medium">
                    {CROSSWORD_PUZZLE.clues.filter(c => c.direction === 'down').map(c => (
                      <li key={`dn-${c.num}-${c.word}`}>
                        <strong>{c.num} Down:</strong> {c.clue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Word Inputs */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400">Answer Verification:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CROSSWORD_PUZZLE.clues.map(c => {
                    const key = `${c.num}-${c.direction}`;
                    const val = (crosswordInputs[key] || '').toUpperCase();
                    const isCorrect = val === c.word;
                    return (
                      <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-black text-slate-600 block">
                          {c.num} {c.direction.toUpperCase()} ({c.word.length} letters):
                        </span>
                        <input
                          type="text"
                          maxLength={c.word.length}
                          value={val}
                          onChange={(e) => setCrosswordInputs(prev => ({ ...prev, [key]: e.target.value.toUpperCase() }))}
                          placeholder={`Answer (${c.word.length} letters)`}
                          className={`w-full p-2 bg-white border-2 rounded-lg text-xs font-mono font-black ${
                            crosswordChecked && isCorrect ? 'border-emerald-500 bg-emerald-50' :
                            crosswordChecked && !isCorrect ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setCrosswordChecked(true);
                      const allCorrect = CROSSWORD_PUZZLE.clues.every(c => (crosswordInputs[`${c.num}-${c.direction}`] || '').toUpperCase() === c.word);
                      if (allCorrect) awardXp(50);
                      else triggerToast("Some words need correction!");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md"
                  >
                    Check Crossword Answers
                  </button>
                  <button
                    onClick={() => {
                      setCrosswordInputs({});
                      setCrosswordChecked(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. WORD SEARCH PUZZLE */}
        {activeMode === 'word_search' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">NECTA Topic Word Search</h3>
                  <p className="text-xs text-slate-500">Locate key terms hidden horizontally inside the matrix</p>
                </div>
                <span className="text-xs font-black text-teal-700">
                  Found: {foundWords.length} / {WORD_SEARCH_WORDS.length}
                </span>
              </div>

              {/* 8x8 Letter Grid */}
              <div className="bg-slate-950 p-4 rounded-2xl inline-block mx-auto border-2 border-slate-800">
                <div className="grid grid-cols-8 gap-1 font-mono font-black text-sm">
                  {WORD_SEARCH_GRID.map((row, rIdx) => (
                    <React.Fragment key={rIdx}>
                      {row.map((letter, cIdx) => (
                        <span
                          key={`${rIdx}-${cIdx}`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-900 text-teal-300 flex items-center justify-center hover:bg-teal-700 hover:text-white transition cursor-pointer select-none"
                        >
                          {letter}
                        </span>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Target Words Pill Bank */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 mb-2">Terms to Find:</h4>
                <div className="flex flex-wrap gap-2">
                  {WORD_SEARCH_WORDS.map(word => {
                    const isFound = foundWords.includes(word);
                    return (
                      <button
                        key={word}
                        onClick={() => {
                          if (!isFound) {
                            setFoundWords(prev => [...prev, word]);
                            awardXp(15);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isFound
                            ? 'bg-emerald-100 text-emerald-800 line-through opacity-70'
                            : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                        }`}
                      >
                        <span>{word}</span>
                        {isFound && <i className="fa-solid fa-check text-[10px]"></i>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. AUDIO PRONUNCIATION BUTTONS */}
        {activeMode === 'pronunciation' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-sky-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Audio Pronunciation & Language Terminology</h3>
                  <p className="text-xs text-slate-500">Tap to hear scientific terms spoken clearly in Swahili and English via Gemini Voice</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800">
                  Gemini Voice TTS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRONUNCIATION_TERMS.map(term => {
                  const isPlaying = playingTermId === term.id;
                  return (
                    <div key={term.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase text-sky-600 block">{term.subject}</span>
                          <h4 className="font-black text-base text-slate-900">{term.term}</h4>
                        </div>
                        <button
                          onClick={() => handlePronounce(term)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-md transition active:scale-95 ${
                            isPlaying ? 'bg-sky-600 text-white animate-spin' : 'bg-sky-500 hover:bg-sky-400 text-white'
                          }`}
                          title="Play Voice Audio"
                        >
                          <i className={`fa-solid ${isPlaying ? 'fa-spinner' : 'fa-volume-high'}`}></i>
                        </button>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-mono text-slate-500">Phonetic: [{term.phonetic}]</p>
                        <p className="text-slate-700 font-semibold">Swahili: {term.swahiliMeaning}</p>
                        <p className="text-slate-500 text-[11px] font-normal leading-relaxed">{term.definition}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 11. PRACTICE EXAM SIMULATOR */}
        {activeMode === 'exam_sim' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-red-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800">
                    ⏱️ NECTA Mock Exam Simulator
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Timed Standard Mock Paper</h3>
                </div>
                {examActive && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block">Time Left:</span>
                    <span className="text-xl font-mono font-black text-red-600">
                      {Math.floor(examTimeLeft / 60).toString().padStart(2, '0')}:{(examTimeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>

              {!examActive && !examSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-red-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                    <i className="fa-solid fa-file-signature"></i>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">15-Minute Exam Simulator</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Simulates authentic NECTA conditions with timed sections, strict grading, and Division classification (A to F).
                  </p>
                  <button
                    onClick={() => {
                      setExamActive(true);
                      setExamTimeLeft(15 * 60);
                      setExamAnswers({});
                      setExamSubmitted(false);
                    }}
                    className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase shadow-md active:scale-95"
                  >
                    Start Timed Exam ✍️
                  </button>
                </div>
              ) : examActive ? (
                <div className="space-y-6">
                  {EXAM_SIM_DATA.map(q => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-indigo-600">Question {q.id} (Section {q.section})</span>
                        <span className="text-slate-400">[{q.marks} Mark{q.marks > 1 ? 's' : ''}]</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">{q.question}</p>

                      {q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => setExamAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                                examAnswers[q.id] === optIdx
                                  ? 'bg-red-50 border-red-500 text-red-950 font-black'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {examAnswers[q.id] === optIdx && <i className="fa-solid fa-check text-red-600"></i>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleSubmitExam}
                    className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase shadow-lg shadow-red-600/30"
                  >
                    Final Submit & View Exam Grade
                  </button>
                </div>
              ) : (
                <div className="py-6 space-y-6 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-md">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Exam Results</h3>
                    <p className="text-xs text-slate-500 mt-1">Official NECTA Simulator Assessment</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                    <div className="bg-slate-50 p-3 rounded-2xl border">
                      <span className="text-[10px] font-bold text-slate-400 block">Raw Score:</span>
                      <strong className="text-base font-black text-slate-900">{examGrade?.score} / {examGrade?.total}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border">
                      <span className="text-[10px] font-bold text-slate-400 block">Percentage:</span>
                      <strong className="text-base font-black text-indigo-600">
                        {Math.round(((examGrade?.score || 0) / (examGrade?.total || 1)) * 100)}%
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border">
                      <span className="text-[10px] font-bold text-slate-400 block">Grade:</span>
                      <strong className="text-base font-black text-emerald-600">Grade {examGrade?.grade}</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border">
                      <span className="text-[10px] font-bold text-slate-400 block">Standing:</span>
                      <strong className="text-xs font-black text-slate-800">{examGrade?.division}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setExamSubmitted(false);
                      setExamActive(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                  >
                    Take Another Exam Mock
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 12. MISTAKE REVIEW MODE */}
        {activeMode === 'mistake_review' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-violet-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Mistake Review & Re-Quiz Engine</h3>
                  <p className="text-xs text-slate-500">Targeted reinforcement of questions you previously got wrong</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-violet-100 text-violet-800">
                  {missedQuestions.length} Questions Saved
                </span>
              </div>

              {missedQuestions.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <i className="fa-solid fa-circle-check text-4xl text-emerald-500"></i>
                  <h4 className="font-black text-sm text-slate-800">No Pending Mistakes!</h4>
                  <p className="text-xs text-slate-500">You have successfully mastered all quizzed items.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {missedQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-violet-600">{q.subject}</span>
                        <button
                          onClick={() => setMissedQuestions(prev => prev.filter(m => m.id !== q.id))}
                          className="text-[11px] font-bold text-slate-400 hover:text-rose-500"
                        >
                          Dismiss
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{q.question}</p>
                      <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-200 text-[11px] text-violet-900">
                        <strong>Correction Insight:</strong> {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 13. CUSTOM QUIZ MAKER */}
        {activeMode === 'custom_quiz' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800">
                  🛠️ Custom Quiz Maker
                </span>
                <span className="text-xs font-bold text-slate-400">Tailored Practice Test</span>
              </div>

              <div className="space-y-4 text-xs font-bold text-slate-700">
                <div>
                  <label className="block mb-1 text-slate-600">Select Subject:</label>
                  <select
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full p-3 bg-slate-50 border rounded-xl font-bold"
                  >
                    <option>Basic Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Civics</option>
                    <option>Geography</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-600">Number of Questions:</label>
                  <div className="flex gap-2">
                    {[5, 10, 20].map(n => (
                      <button
                        key={n}
                        onClick={() => setCustomNumQuestions(n)}
                        className={`flex-1 py-2 rounded-xl transition ${
                          customNumQuestions === n ? 'bg-indigo-600 text-white font-black' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {n} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-600">Difficulty Level:</label>
                  <div className="flex gap-2">
                    {['Standard NECTA', 'Advanced (A-Level)', 'Challenging'].map(d => (
                      <button
                        key={d}
                        onClick={() => setCustomDifficulty(d)}
                        className={`flex-1 py-2 rounded-xl transition ${
                          customDifficulty === d ? 'bg-indigo-600 text-white font-black' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCustomQuizGenerated(true);
                    triggerToast(`Generated ${customNumQuestions} ${customSubject} practice questions!`);
                    setActiveMode('exam_sim');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase shadow-md active:scale-95 transition"
                >
                  Generate Practice Test 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 14. FILL IN THE BLANK EXERCISES */}
        {activeMode === 'fill_blanks' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-lg space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900">Fill in the Missing Keyword</h3>
                <span className="text-xs font-bold text-slate-400">NECTA Law Verification</span>
              </div>

              {FILL_BLANK_QUESTIONS.map(q => {
                const feedback = fillFeedback[q.id];
                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                      {q.id}. {q.sentence}
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type missing word..."
                        value={fillInputs[q.id] || ''}
                        onChange={(e) => setFillInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className={`flex-1 p-2 bg-white border-2 rounded-xl text-xs font-bold ${
                          feedback === true ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                          feedback === false ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-slate-200'
                        }`}
                      />
                      <button
                        onClick={() => checkBlankAnswer(q.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                      >
                        Check
                      </button>
                    </div>
                    {feedback === false && (
                      <p className="text-[11px] text-amber-700 font-semibold">Hint: {q.hint}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 15. SENTENCE BUILDER */}
        {activeMode === 'sentence_builder' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-cyan-200 shadow-lg space-y-5 text-center">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black text-cyan-600 uppercase">
                  Grammar & Structure Builder
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Item {sentenceIndex + 1} of {SENTENCE_BUILDER_ITEMS.length}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-cyan-50/50 border-2 border-dashed border-cyan-200 min-h-[90px] flex flex-wrap items-center justify-center gap-2">
                {userSentenceWords.length > 0 ? (
                  userSentenceWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => removeWordFromSentence(idx)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-rose-500 transition"
                      title="Click to remove word"
                    >
                      {word} ✕
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    Tap the scrambled words below in the correct order
                  </span>
                )}
              </div>

              {sentenceCorrect !== null && (
                <div className={`p-3 rounded-xl text-xs font-bold ${sentenceCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {sentenceCorrect ? '✓ Perfect grammatical structure!' : '✗ Order is incorrect. Try rearranging the words.'}
                </div>
              )}

              {/* Scrambled Word Bank */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {SENTENCE_BUILDER_ITEMS[sentenceIndex].jumbled.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => addWordToSentence(w)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-300 font-bold text-xs transition active:scale-95"
                  >
                    {w}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 pt-3">
                <button
                  onClick={() => setUserSentenceWords([])}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={verifySentence}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md"
                >
                  Verify Sentence
                </button>
                {sentenceIndex + 1 < SENTENCE_BUILDER_ITEMS.length && (
                  <button
                    onClick={() => {
                      setSentenceIndex(i => i + 1);
                      setUserSentenceWords([]);
                      setSentenceCorrect(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Next ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 16. TRUE OR FALSE SPRINT */}
        {activeMode === 'true_false' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-rose-200 shadow-xl text-center space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                  🔥 Rapid True/False Sprint
                </span>
                <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                  <i className="fa-solid fa-fire text-amber-500"></i> Streak: {tfStreak}
                </span>
              </div>

              {!tfGameOver ? (
                <div className="space-y-6 py-4">
                  <div className="text-xs font-bold text-slate-400">
                    Question {tfIndex + 1} of {TRUE_FALSE_QUESTIONS.length}
                  </div>

                  <p className="text-lg sm:text-xl font-black text-slate-800 leading-snug min-h-[80px] flex items-center justify-center">
                    "{TRUE_FALSE_QUESTIONS[tfIndex].q}"
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleTfAnswer(true)}
                      className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-lg shadow-emerald-500/30 transition transform active:scale-95"
                    >
                      ✓ TRUE
                    </button>
                    <button
                      onClick={() => handleTfAnswer(false)}
                      className="py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-lg shadow-lg shadow-rose-500/30 transition transform active:scale-95"
                    >
                      ✗ FALSE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-3">
                  <h3 className="text-2xl font-black text-slate-900">Sprint Complete!</h3>
                  <p className="text-sm font-bold text-slate-600">
                    Final Score: <strong className="text-indigo-600">{tfScore}</strong> / {TRUE_FALSE_QUESTIONS.length}
                  </p>
                  <button
                    onClick={() => {
                      setTfIndex(0);
                      setTfScore(0);
                      setTfStreak(0);
                      setTfGameOver(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 17. INTERACTIVE DIAGRAMS */}
        {activeMode === 'diagrams' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedDiagram.title}</h3>
                  <p className="text-xs text-slate-500">{selectedDiagram.description}</p>
                </div>
                <div className="flex gap-2">
                  {INTERACTIVE_DIAGRAMS.map(d => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDiagram(d);
                        setActiveDiagramPart(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        selectedDiagram.id === d.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {d.id === 'eye' ? 'Human Eye' : 'Plant Cell'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagram SVG canvas container */}
              <div className="relative w-full aspect-video sm:aspect-[2/1] bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 flex items-center justify-center p-6">
                <svg className="w-full h-full max-h-72" viewBox="0 0 100 100">
                  {selectedDiagram.id === 'eye' ? (
                    <circle cx="50" cy="50" r="35" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  ) : (
                    <rect x="15" y="15" width="70" height="70" rx="10" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
                  )}
                </svg>

                {/* Hotspot pins */}
                {selectedDiagram.parts.map(part => (
                  <button
                    key={part.id}
                    onClick={() => setActiveDiagramPart(part)}
                    className="absolute w-8 h-8 rounded-full bg-amber-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition ring-4 ring-amber-400/40"
                    style={{ left: `${part.x}%`, top: `${part.y}%` }}
                    title={part.name}
                  >
                    •
                  </button>
                ))}
              </div>

              {/* Active Part Card Details */}
              {activeDiagramPart ? (
                <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 text-left space-y-1 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-teal-950">{activeDiagramPart.name}</h4>
                    <button
                      onClick={() => playGeminiVoiceAudio({ text: `${activeDiagramPart.name}. ${activeDiagramPart.desc}`, voiceName: 'Kore', language: 'sw' })}
                      className="text-teal-700 hover:text-teal-950"
                      title="Pronounce with Gemini Voice"
                    >
                      <i className="fa-solid fa-volume-high text-xs"></i>
                    </button>
                  </div>
                  <p className="text-xs text-teal-800 leading-relaxed font-medium">{activeDiagramPart.desc}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center">
                  Tap any glowing amber point on the diagram above to inspect anatomical structure and function.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 18. HANGMAN / WORD GUESS */}
        {activeMode === 'hangman' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-orange-200 shadow-xl text-center space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-orange-600 uppercase">
                  NECTA Vocabulary Hangman
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Mistakes: {hangmanMistakes} / 6
                </span>
              </div>

              {/* Hint */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-semibold text-amber-900">
                💡 Clue: "{hangmanHint}"
              </div>

              {/* Word Blanks */}
              <div className="flex flex-wrap items-center justify-center gap-2 py-4">
                {hangmanWord.split('').map((char, idx) => (
                  <span
                    key={idx}
                    className="w-8 sm:w-10 h-12 rounded-xl border-b-4 border-slate-800 bg-slate-50 flex items-center justify-center text-lg sm:text-xl font-black text-slate-900 font-mono"
                  >
                    {guessedLetters.includes(char) ? char : ''}
                  </span>
                ))}
              </div>

              {hangmanWon && (
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm">
                  🎉 Excellent! You guessed the word correctly! (+50 XP)
                </div>
              )}
              {hangmanLost && (
                <div className="p-4 rounded-2xl bg-rose-100 text-rose-800 font-bold text-xs">
                  Game Over. The correct word was: <strong>{hangmanWord}</strong>
                </div>
              )}

              {/* Alphabet Keyboard */}
              <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto pt-2">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(letter => {
                  const isGuessed = guessedLetters.includes(letter);
                  return (
                    <button
                      key={letter}
                      disabled={isGuessed || hangmanWon || hangmanLost}
                      onClick={() => handleHangmanGuess(letter)}
                      className={`w-8 h-8 rounded-lg font-black text-xs transition ${
                        isGuessed
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-800 text-white hover:bg-orange-500 shadow-sm active:scale-95'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 19. TANZANIA HISTORY TIMELINE */}
        {activeMode === 'timeline' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Tanzanian Historical Timeline (History Form 1–4)</h3>
                  <p className="text-xs text-slate-500">Key milestones in national sovereignty, anti-colonial resistance & unity</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                  Chronological
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 border-l-4 border-amber-400 space-y-6">
                {HISTORICAL_TIMELINE.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-white ring-4 ring-amber-400/30"></span>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 group-hover:border-amber-400 transition space-y-1">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                        {item.year}
                      </span>
                      <h4 className="font-black text-sm text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 20. CONCEPT MIND MAP VIEWER */}
        {activeMode === 'mind_map' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Syllabus Concept Map Viewer</h3>
                  <p className="text-xs text-slate-500">Hierarchical visual nodes breaking down broad scientific fields</p>
                </div>
                <span className="text-xs font-bold text-blue-600">Click nodes to expand/collapse</span>
              </div>

              <div className="p-6 bg-slate-950 rounded-3xl text-white space-y-4 font-mono text-xs overflow-x-auto">
                <div className="p-3 rounded-xl bg-indigo-600 font-bold inline-block">
                  📘 NECTA Secondary Science Curriculum
                </div>

                <div className="pl-6 border-l-2 border-indigo-400 space-y-3">
                  <div>
                    <button
                      onClick={() => setExpandedNodes(prev => prev.includes('physics') ? prev.filter(n => n !== 'physics') : [...prev, 'physics'])}
                      className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-400 text-indigo-300 font-bold hover:bg-indigo-900"
                    >
                      {expandedNodes.includes('physics') ? '▼' : '►'} 1. Physics (Mechanics & Waves)
                    </button>
                    {expandedNodes.includes('physics') && (
                      <div className="pl-6 pt-2 border-l-2 border-indigo-500/40 space-y-2 text-slate-300">
                        <div>• Kinematics: Displacement, Velocity & Acceleration</div>
                        <div>• Newton's 3 Laws of Motion & Conservation of Momentum</div>
                        <div>• Work, Energy & Power (Joules and Watts)</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => setExpandedNodes(prev => prev.includes('chem') ? prev.filter(n => n !== 'chem') : [...prev, 'chem'])}
                      className="px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-400 text-indigo-300 font-bold hover:bg-indigo-900"
                    >
                      {expandedNodes.includes('chem') ? '▼' : '►'} 2. Chemistry (Matter & Stoichiometry)
                    </button>
                    {expandedNodes.includes('chem') && (
                      <div className="pl-6 pt-2 border-l-2 border-indigo-500/40 space-y-2 text-slate-300">
                        <div>• Atomic Structure: Protons, Neutrons, Electrons & Orbitals</div>
                        <div>• Chemical Bonding: Ionic, Covalent & Metallic</div>
                        <div>• The Mole Concept & Volumetric Analysis</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
