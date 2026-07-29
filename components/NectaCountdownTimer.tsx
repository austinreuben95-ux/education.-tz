import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// 9,999,999,999+ / INFINITY MULTI-LINGUAL MOTIVATIONAL QUOTES BANK & GENERATOR
// ==========================================
export interface MotivationalQuote {
  quote: string;
  author: string;
  tag: string;
  lang: string; // SW, EN, FR, AR, ES, ZH, PT, DE, HI, JA
  flag: string;
  langName: string;
}

export const CURATED_MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  // GLOBAL ICONIC & HISTORICAL LEGENDS ⭐
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    tag: "Action & Vision 🏰",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },
  {
    quote: "All our dreams can come true, if we have the courage to pursue them.",
    author: "Walt Disney",
    tag: "Courage & Dreams ✨",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    tag: "Value of Education 💡",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },
  {
    quote: "Tell me and I forget, teach me and I may remember, involve me and I learn.",
    author: "Benjamin Franklin",
    tag: "Active Learning 📚",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },
  {
    quote: "Education is not the learning of facts, but the training of the mind to think.",
    author: "Albert Einstein",
    tag: "Critical Mindset 🧠",
    lang: "EN",
    flag: "🌐",
    langName: "English"
  },
  {
    quote: "Genius is 1% talent and 99% hard work.",
    author: "Albert Einstein",
    tag: "Pure Effort 🔥",
    lang: "EN",
    flag: "🌐",
    langName: "English"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tag: "Passion & Purpose 🚀",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    tag: "Belief & Vision 🌟",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },
  {
    quote: "Dedicating yourself to your craft is what separates the good from the legendary.",
    author: "Kobe Bryant",
    tag: "Mamba Mentality 🐍",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },
  {
    quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
    tag: "Preparation ⏳",
    lang: "EN",
    flag: "🇺🇸",
    langName: "English"
  },

  // KISWAHILI 🇹🇿
  {
    quote: "Elimu ni urithi pekee usiofisidika. Mtihani wa NECTA ni fursa yako ya kuonesha uwezo wako wa kipekee!",
    author: "Mwalimu J.K. Nyerere Spirit",
    tag: "Uzalendo & Masomo 🇹🇿",
    lang: "SW",
    flag: "🇹🇿",
    langName: "Kiswahili"
  },
  {
    quote: "Tofauti kati ya mwanafunzi anayefeli na anayefaulu kwa Distinction ni maandalizi ya leo badala ya kesho!",
    author: "Mbinu za NECTA",
    tag: "Nia na Vitendo ⚡",
    lang: "SW",
    flag: "🇹🇿",
    langName: "Kiswahili"
  },
  {
    quote: "Mti wenye matunda bora ndio unaorushiwa mawe. Changamoto za masomo ni ishara ya ukuaji wako!",
    author: "Methali ya Kiswahili",
    tag: "Subira na Uvumilivu 🌿",
    lang: "SW",
    flag: "🇹🇿",
    langName: "Kiswahili"
  },
  {
    quote: "Kila fomula na dhana unayoelewa leo inakusogeza karibu zaidi na ndoto yako ya Chuo Kikuu!",
    author: "ElimuTanzania Guide",
    tag: "Malengo Makubwa 🎯",
    lang: "SW",
    flag: "🇹🇿",
    langName: "Kiswahili"
  },
  {
    quote: "Bora utoe jasho kwenye chumba cha kujisomea leo kuliko kutoa machozi siku ya matokeo!",
    author: "Ushauri wa Walimu",
    tag: "Nia ya Dhati 🔥",
    lang: "SW",
    flag: "🇹🇿",
    langName: "Kiswahili"
  },

  // ENGLISH 🇬🇧
  {
    quote: "Division One is not born by chance; it is forged by midnight revision, past papers, and unwavering focus.",
    author: "NECTA Excellence Guide",
    tag: "Academic Grit 🏆",
    lang: "EN",
    flag: "🇬🇧",
    langName: "English"
  },
  {
    quote: "Do not pray for an easy exam; pray for the discipline to master every single topic in your syllabus.",
    author: "Scholar's Creed",
    tag: "Mindset Strategy 💡",
    lang: "EN",
    flag: "🇬🇧",
    langName: "English"
  },
  {
    quote: "Small daily study streaks compound into massive academic victories on exam result day.",
    author: "Habit of Champions",
    tag: "Consistency 📈",
    lang: "EN",
    flag: "🇬🇧",
    langName: "English"
  },
  {
    quote: "Success in NECTA is 10% talent and 90% solving past examination papers with active memory recall.",
    author: "NECTA Examiner Insights",
    tag: "Exam Tech 📝",
    lang: "EN",
    flag: "🇬🇧",
    langName: "English"
  },
  {
    quote: "Your brain is a muscle. The harder the past paper problem, the stronger your intellect becomes.",
    author: "Cognitive Science",
    tag: "Mental Strength 🧠",
    lang: "EN",
    flag: "🇬🇧",
    langName: "English"
  },

  // FRENCH 🇫🇷
  {
    quote: "L'éducation est l'arme la plus puissante que vous puissiez utiliser pour changer votre avenir et votre nation.",
    author: "Nelson Mandela",
    tag: "Savoir & Pouvoir 🎓",
    lang: "FR",
    flag: "🇫🇷",
    langName: "Français"
  },
  {
    quote: "Le succès aux examens n'est pas un secret, c'est le résultat de la préparation et du travail acharné.",
    author: "Guide de l'Excellence",
    tag: "Discipline ⚡",
    lang: "FR",
    flag: "🇫🇷",
    langName: "Français"
  },
  {
    quote: "Chaque heure de révision aujourd'hui rapproche vos rêves universitaires de la réalité.",
    author: "Pensée Académique",
    tag: "Avenir Bright 🌟",
    lang: "FR",
    flag: "🇫🇷",
    langName: "Français"
  },

  // ARABIC 🇦🇪
  {
    quote: "العلم نور والجهل تاركٌ لصاحبه في الظلمات. اجعل كل دقيقة من المراجعة خطوة نحو النجاح الباهر!",
    author: "حكمة الأجيال",
    tag: "العلم والنجاح 📖",
    lang: "AR",
    flag: "🇦🇪",
    langName: "العربية"
  },
  {
    quote: "من طلب العلا سهر الليالي، والامتحانات ليست سوى فرصة لإثبات قدراتك العالية.",
    author: "دليل التفوق",
    tag: "الإصرار 💪",
    lang: "AR",
    flag: "🇦🇪",
    langName: "العربية"
  },

  // SPANISH 🇪🇸
  {
    quote: "El éxito en los exámenes no ocurre por casualidad, es la suma de pequeños esfuerzos repetidos día tras día.",
    author: "Filosofía del Estudiante",
    tag: "Perseverancia 🚀",
    lang: "ES",
    flag: "🇪🇸",
    langName: "Español"
  },
  {
    quote: "No estudies para aprobar, estudia para dominar la materia y liderar el mañana con sabiduría.",
    author: "Mente Maestra",
    tag: "Excelencia 🏆",
    lang: "ES",
    flag: "🇪🇸",
    langName: "Español"
  },

  // CHINESE 🇨🇳
  {
    quote: "书山有路勤为径，学海无涯苦作舟。今天的每一份努力，都是明天成功的基石！",
    author: "中国古谚",
    tag: "勤奋求知 📚",
    lang: "ZH",
    flag: "🇨🇳",
    langName: "中文"
  },
  {
    quote: "宝剑锋从磨砺出，梅花香自苦寒来。相信自己，你将在考试中取得卓越成绩！",
    author: "励志指南",
    tag: "坚韧不拔 🔥",
    lang: "ZH",
    flag: "🇨🇳",
    langName: "中文"
  },

  // GERMAN 🇩🇪
  {
    quote: "Der Erfolg bei Prüfungen ist kein Zufall, sondern das Ergebnis von täglicher Vorbereitung und Fokus.",
    author: "Erfolgsformel",
    tag: "Fokus & Ziel 🇩🇪",
    lang: "DE",
    flag: "🇩🇪",
    langName: "Deutsch"
  },
  {
    quote: "Wissen ist Macht. Jede gelöste Aufgabe bringt dich deinem akademischen Traum ein Stück näher.",
    author: "Akademischer Geist",
    tag: "Disziplin 🧠",
    lang: "DE",
    flag: "🇩🇪",
    langName: "Deutsch"
  },

  // PORTUGUESE 🇵🇹
  {
    quote: "A educação é a chave para abrir as portas do mundo. Dedique-se hoje para colher vitórias amanhã!",
    author: "Sabedoria Acadêmica",
    tag: "Foco Total 🌟",
    lang: "PT",
    flag: "🇵🇹",
    langName: "Português"
  },

  // HINDI 🇮🇳
  {
    quote: "कड़ी मेहनत का कोई विकल्प नहीं है। आपकी आज की तैयारी ही कल का शानदार परिणाम बनाएगी!",
    author: "ज्ञान वाक्य",
    tag: "सफलता संकल्प 🇮🇳",
    lang: "HI",
    flag: "🇮🇳",
    langName: "हिन्दी"
  }
];

const MULTI_LANG_GENERATOR_PACKS = [
  {
    lang: "SW", flag: "🇹🇿", langName: "Kiswahili",
    prefixes: ["Shujaa wa NECTA", "Mwanafunzi Mfano", "Mbingwa wa Kesho", "Mzalendo Msomi"],
    actions: ["anayewasha taa ya kujisomea kila siku", "anayeelewa fomula na mada zote kwa undani", "anayejiamini na kusoma past papers kwa bidii"],
    outcomes: ["huibuka na Distinction na kuleta heshima nchini! 🇹🇿", "huweka msingi imara wa masomo ya Chuo Kikuu! 🎓", "hufungua milango ya mafanikio makubwa! 🌟"]
  },
  {
    lang: "EN", flag: "🇬🇧", langName: "English",
    prefixes: ["Future Top Scholar", "Division One Prospect", "Relentless Scholar", "Visionary Achiever"],
    actions: ["who turns difficult past paper questions into stepping stones", "who replaces doubt with structured study plans", "who masters core syllabus topics daily"],
    outcomes: ["is guaranteed to unlock a Division 1 Distinction! 🏆", "conquers every NECTA exam paper with total clarity! ⚡", "proves that hard work always triumphs! 🔥"]
  },
  {
    lang: "FR", flag: "🇫🇷", langName: "Français",
    prefixes: ["Étudiant Visionnaire", "Champion Académique", "Esprit Brillant"],
    actions: ["qui révise avec discipline et méthode", "qui transforme chaque difficulté en opportunité"],
    outcomes: ["décrochera une mention excellente à l'examen! 🏆", "ouvrira les portes des plus grandes universités! 🎓"]
  },
  {
    lang: "AR", flag: "🇦🇪", langName: "العربية",
    prefixes: ["طالب العلياء", "بطل الامتحانات", "المتفوق المبدع"],
    actions: ["الذي يراجع دروسه بشغف وإصرار يومي", "الذي يحل أسئلة الامتحانات السابقة بكل ثقة"],
    outcomes: ["يحقق أعلى الدرجات ويمهد طريقه نحو المستقبل! 🌟", "ينال شرف النجاح الباهر بإذن الله! 🏆"]
  },
  {
    lang: "ES", flag: "🇪🇸", langName: "Español",
    prefixes: ["Estudiante Excelente", "Futuro Líder", "Mente Brillante"],
    actions: ["que practica diariamente con determinación", "que domina cada tema de su programa de estudios"],
    outcomes: ["¡alcanzará la máxima calificación en sus exámenes! 🏆", "¡construirá un futuro lleno de éxito académico! 🌟"]
  },
  {
    lang: "ZH", flag: "🇨🇳", langName: "中文",
    prefixes: ["卓越学子", "未来的领袖", "勤奋的求知者"],
    actions: ["每天坚持深度复习与练习", "用智慧和汗水克服所有难题"],
    outcomes: ["必定在考试中摘取优异成绩！🏆", "必将开启通往辉煌未来的大门！🌟"]
  }
];

export function getMotivationalQuote(index: number, selectedLang: string = 'ALL'): MotivationalQuote & { id: number; isGenerated: boolean } {
  let list = CURATED_MOTIVATIONAL_QUOTES;
  if (selectedLang !== 'ALL') {
    list = list.filter(q => q.lang === selectedLang);
  }

  if (list.length > 0 && index < list.length) {
    return {
      id: index + 1,
      ...list[index],
      isGenerated: false,
    };
  }

  // Infinite Multi-Lingual Generator
  const packIndex = index % MULTI_LANG_GENERATOR_PACKS.length;
  const pack = MULTI_LANG_GENERATOR_PACKS[packIndex];

  const prefix = pack.prefixes[index % pack.prefixes.length];
  const action = pack.actions[(index * 3) % pack.actions.length];
  const outcome = pack.outcomes[(index * 7) % pack.outcomes.length];

  return {
    id: index + 1,
    quote: `${prefix} ${action} ${outcome}`,
    author: `Global Motivation Engine (${pack.langName})`,
    tag: `Infinity Generator ♾️`,
    lang: pack.lang,
    flag: pack.flag,
    langName: pack.langName,
    isGenerated: true,
  };
}

export interface NectaCountdownTimerProps {
  initialGrade?: string | null;
  onNavigateToExams?: () => void;
  onNavigateToPlanner?: () => void;
  onOpenYunAI?: (prompt: string) => void;
  onStartQuickStudy?: () => void;
}

export interface NectaExamSpec {
  id: string;
  gradeLabel: string;
  examCode: string;
  fullName: string;
  swahiliTitle: string;
  targetDate: string; // YYYY-MM-DD
  academicYearStart: string; // YYYY-MM-DD
  levelCategory: 'Primary' | 'O-Level' | 'A-Level';
  keySubjects: string[];
  tips: string[];
  badgeColor: string;
}

export const NECTA_EXAM_SCHEDULE: NectaExamSpec[] = [
  {
    id: 'psle-std7',
    gradeLabel: 'Standard 7',
    examCode: 'PSLE',
    fullName: 'Primary School Leaving Examination',
    swahiliTitle: 'Mtihani wa Kumaliza Elimu ya Msingi (Darasa la 7)',
    targetDate: '2026-09-09T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'Primary',
    keySubjects: ['Hisabati', 'Aghalabu/English', 'Kiswahili', 'Sayansi & Teknolojia', 'Maarifa ya Jamii'],
    tips: [
      'Master basic arithmetic, speed multiplication, and word problem conversions.',
      'Review Swahili grammar (Mnyambuliko wa kitenzi) and English tenses.',
      'Practice diagrams for Science & Technology experiments.'
    ],
    badgeColor: 'bg-emerald-500 text-white'
  },
  {
    id: 'sfna-std4',
    gradeLabel: 'Standard 4',
    examCode: 'SFNA',
    fullName: 'Standard Four National Assessment',
    swahiliTitle: 'Pima la Kitaifa la Darasa la Nne',
    targetDate: '2026-10-21T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'Primary',
    keySubjects: ['Hisabati', 'English', 'Kiswahili', 'Sayansi', 'Uraia na Maadili'],
    tips: [
      'Focus on foundational reading comprehension and basic math tables.',
      'Practice drawing simple maps and civic responsibility principles.'
    ],
    badgeColor: 'bg-teal-500 text-white'
  },
  {
    id: 'ftna-form2',
    gradeLabel: 'Form 2',
    examCode: 'FTNA',
    fullName: 'Form Two National Assessment',
    swahiliTitle: 'Tathmini ya Kitaifa ya Kidato cha Pili',
    targetDate: '2026-11-02T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'O-Level',
    keySubjects: ['Physics', 'Chemistry', 'Biology', 'Basic Mathematics', 'Geography', 'History', 'Civics', 'Kiswahili', 'English'],
    tips: [
      'Master Form 1 & 2 formula derivations in Physics and Chemistry math problems.',
      'Practice NECTA format diagrams for Biology organ structures.',
      'Ensure clear essay structure for History and Civics.'
    ],
    badgeColor: 'bg-indigo-600 text-white'
  },
  {
    id: 'csee-form4',
    gradeLabel: 'Form 4',
    examCode: 'CSEE',
    fullName: 'Certificate of Secondary Education Examination',
    swahiliTitle: 'Mtihani wa Kidato cha Nne (O-Level Final)',
    targetDate: '2026-11-09T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'O-Level',
    keySubjects: ['Physics', 'Chemistry', 'Biology', 'Basic Math', 'English', 'Kiswahili', 'Geography', 'History', 'Civics'],
    tips: [
      'Solve at least 5 previous NECTA CSEE past papers (2019–2025).',
      'Pay extra attention to Practical exams (Physics, Chemistry, Biology Paper 3).',
      'Review map reading and calculation formulas in Geography.'
    ],
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    id: 'acsee-form6',
    gradeLabel: 'Form 6',
    examCode: 'ACSEE',
    fullName: 'Advanced Certificate of Secondary Education Examination',
    swahiliTitle: 'Mtihani wa Kidato cha Sita (A-Level Final)',
    targetDate: '2027-05-03T08:00:00',
    academicYearStart: '2026-07-01T00:00:00',
    levelCategory: 'A-Level',
    keySubjects: ['PCB', 'PCM', 'CBG', 'PGM', 'EGM', 'HGK', 'HGL', 'HKL', 'BAM', 'General Studies'],
    tips: [
      'Deep dive into Bamb / Pure Math integration and organic reaction mechanisms.',
      'Ensure comprehensive referencing for GS essay questions.',
      'Time management: practice 3-hour mock exam simulations.'
    ],
    badgeColor: 'bg-rose-600 text-white'
  },
  {
    id: 'terminal-annual',
    gradeLabel: 'Form 1 / 3 / 5',
    examCode: 'ANNUAL',
    fullName: 'National Annual Progression Examinations',
    swahiliTitle: 'Mithani ya Mwaka na Muhula wa Pili',
    targetDate: '2026-11-16T08:00:00',
    academicYearStart: '2026-01-12T00:00:00',
    levelCategory: 'O-Level',
    keySubjects: ['All Form Syllabus Subjects'],
    tips: [
      'Ensure complete notes coverage for all topics taught this academic year.',
      'Practice speed tests to prepare for next year\'s NECTA national exam.'
    ],
    badgeColor: 'bg-cyan-600 text-white'
  }
];

export const NectaCountdownTimer: React.FC<NectaCountdownTimerProps> = ({
  initialGrade,
  onNavigateToExams,
  onNavigateToPlanner,
  onOpenYunAI,
  onStartQuickStudy
}) => {
  // Determine starting exam based on initialGrade
  const initialExamId = useMemo(() => {
    if (!initialGrade) return 'csee-form4';
    const lower = initialGrade.toLowerCase();
    if (lower.includes('standard 7') || lower.includes('darasa la 7') || lower.includes('primary')) return 'psle-std7';
    if (lower.includes('standard 4') || lower.includes('darasa la 4')) return 'sfna-std4';
    if (lower.includes('form 2') || lower.includes('kidato cha 2')) return 'ftna-form2';
    if (lower.includes('form 4') || lower.includes('kidato cha 4') || lower.includes('secondary')) return 'csee-form4';
    if (lower.includes('form 6') || lower.includes('kidato cha 6') || lower.includes('high school')) return 'acsee-form6';
    return 'csee-form4';
  }, [initialGrade]);

  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);

  useEffect(() => {
    if (initialGrade) {
      setSelectedExamId(initialExamId);
    }
  }, [initialGrade, initialExamId]);

  const activeExam = useMemo(() => {
    return NECTA_EXAM_SCHEDULE.find(e => e.id === selectedExamId) || NECTA_EXAM_SCHEDULE[3];
  }, [selectedExamId]);

  // Realtime countdown calculation
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeDiff = useMemo(() => {
    const target = new Date(activeExam.targetDate).getTime();
    const current = now.getTime();
    const diffMs = Math.max(0, target - current);

    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Progress bar calculation
    const start = new Date(activeExam.academicYearStart).getTime();
    const totalDuration = Math.max(1, target - start);
    const elapsed = Math.max(0, current - start);
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

    return { days, hours, minutes, seconds, isExpired: diffMs <= 0, progressPercent };
  }, [now, activeExam]);

  // Urgency status badge
  const urgencyStatus = useMemo(() => {
    if (timeDiff.isExpired) {
      return {
        label: 'NECTA Examination in Progress!',
        swahili: 'Mtihani wa NECTA Unaendelea!',
        color: 'bg-rose-500 text-white animate-pulse',
        icon: 'fa-triangle-exclamation'
      };
    }
    if (timeDiff.days <= 30) {
      return {
        label: 'Final Sprint Phase (< 30 Days)',
        swahili: 'Hatua ya Mwisho - Mazoezi ya Kasi!',
        color: 'bg-rose-500 text-white animate-pulse',
        icon: 'fa-bolt-lightning'
      };
    }
    if (timeDiff.days <= 90) {
      return {
        label: 'Intensive Revision Phase',
        swahili: 'Kipindi cha Kujirudia na Papers!',
        color: 'bg-amber-500 text-slate-950 font-black',
        icon: 'fa-fire'
      };
    }
    return {
      label: 'Syllabus Coverage Phase',
      swahili: 'Kipindi cha Kusoma Mada na Vidokezo',
      color: 'bg-emerald-500 text-slate-950 font-black',
      icon: 'fa-compass'
    };
  }, [timeDiff.days, timeDiff.isExpired]);

  // Format date readable
  const formattedExamDate = useMemo(() => {
    const d = new Date(activeExam.targetDate);
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [activeExam.targetDate]);

  // ==========================================
  // 15-SECOND AUTO-REFRESHING MOTIVATIONAL WORD ENGINE
  // ==========================================
  const [selectedQuoteLang, setSelectedQuoteLang] = useState<string>('ALL');
  const [quoteIndex, setQuoteIndex] = useState<number>(() => Math.floor(Math.random() * 20));
  const [secondsLeft, setSecondsLeft] = useState<number>(15);
  const [isQuotePaused, setIsQuotePaused] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [isSpeakingQuote, setIsSpeakingQuote] = useState<boolean>(false);

  useEffect(() => {
    if (isQuotePaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setQuoteIndex((q) => q + 1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isQuotePaused]);

  const currentMotivationalQuote = useMemo(() => {
    return getMotivationalQuote(quoteIndex, selectedQuoteLang);
  }, [quoteIndex, selectedQuoteLang]);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => prev + 1);
    setSecondsLeft(15);
  };

  const handlePrevQuote = () => {
    setQuoteIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setSecondsLeft(15);
  };

  const handleCopyQuote = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${currentMotivationalQuote.quote} - ${currentMotivationalQuote.author}`);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleSpeakQuote = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setIsSpeakingQuote(false);
      return;
    }
    const cleanText = `${currentMotivationalQuote.quote}. ${currentMotivationalQuote.author}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;

    // Language mapping for browser speech synthesis
    const langMap: Record<string, string> = {
      SW: 'sw-TZ',
      EN: 'en-US',
      FR: 'fr-FR',
      AR: 'ar-SA',
      ES: 'es-ES',
      ZH: 'zh-CN',
      DE: 'de-DE',
      PT: 'pt-PT',
      HI: 'hi-IN',
    };

    const targetLangCode = langMap[currentMotivationalQuote.lang] || 'en-US';
    utterance.lang = targetLangCode;

    const voices = synth.getVoices();
    const desiredPrefix = currentMotivationalQuote.lang.toLowerCase();
    const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(desiredPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeakingQuote(true);
    utterance.onend = () => setIsSpeakingQuote(false);
    utterance.onerror = () => setIsSpeakingQuote(false);
    synth.speak(utterance);
  };

  const AVAILABLE_QUOTE_LANGUAGES = [
    { code: 'ALL', label: 'All Languages 🌐' },
    { code: 'SW', label: 'Kiswahili 🇹🇿' },
    { code: 'EN', label: 'English 🇬🇧' },
    { code: 'FR', label: 'Français 🇫🇷' },
    { code: 'AR', label: 'العربية 🇦🇪' },
    { code: 'ES', label: 'Español 🇪🇸' },
    { code: 'ZH', label: '中文 🇨🇳' },
    { code: 'DE', label: 'Deutsch 🇩🇪' },
    { code: 'PT', label: 'Português 🇵🇹' },
    { code: 'HI', label: 'हिन्दी 🇮🇳' },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-indigo-900/60 transition-all duration-300">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* 15-SECOND AUTO-REFRESHING MOTIVATIONAL WORD BANNER ON TOP OF NECTA COUNTDOWN */}
      <div className="relative z-10 mb-8 bg-gradient-to-r from-amber-500/15 via-indigo-950/80 to-purple-900/30 rounded-3xl p-5 sm:p-6 border-2 border-amber-400/40 shadow-xl backdrop-blur-md overflow-hidden">
        {/* Animated Progress Bar at the top of the banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-1000 ease-linear shadow-lg shadow-amber-400/50"
            style={{ width: `${(secondsLeft / 15) * 100}%` }}
          />
        </div>

        <div className="flex flex-col gap-4">
          {/* Top Bar: Badges + Language Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/20 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm animate-pulse">
                <i className="fa-solid fa-fire text-amber-900"></i> Motivational Boost
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700">
                <i className="fa-solid fa-arrows-rotate text-amber-400"></i> Refreshes in {secondsLeft}s
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
                <i className="fa-solid fa-infinity text-amber-300"></i> Quote #{currentMotivationalQuote.id.toLocaleString()} of ∞
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {currentMotivationalQuote.flag} {currentMotivationalQuote.langName}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-amber-300">
                {currentMotivationalQuote.tag}
              </span>
            </div>

            {/* Language Selector Chips */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
              {AVAILABLE_QUOTE_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setSelectedQuoteLang(l.code);
                    setQuoteIndex(0);
                    setSecondsLeft(15);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer shrink-0 ${
                    selectedQuoteLang === l.code
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Quote Content & Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="relative pl-4 border-l-4 border-amber-400 py-1">
                <p className="text-sm sm:text-base md:text-lg font-black text-amber-100 leading-snug tracking-tight">
                  <i className="fa-solid fa-quote-left text-amber-400/50 mr-2 text-xs sm:text-sm"></i>
                  {currentMotivationalQuote.quote}
                  <i className="fa-solid fa-quote-right text-amber-400/50 ml-2 text-xs sm:text-sm"></i>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-amber-400/90">— {currentMotivationalQuote.author}</span>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-md">
              <button
                onClick={handlePrevQuote}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Previous Quote"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>

              <button
                onClick={() => setIsQuotePaused(!isQuotePaused)}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1 transition cursor-pointer ${
                  isQuotePaused
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title={isQuotePaused ? 'Resume 15s Timer' : 'Pause Timer to Reflect'}
              >
                <i className={`fa-solid ${isQuotePaused ? 'fa-play' : 'fa-pause'} text-[10px]`}></i>
                <span>{isQuotePaused ? 'Paused' : '15s Auto'}</span>
              </button>

              <button
                onClick={handleNextQuote}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                title="Next Motivational Quote"
              >
                <i className="fa-solid fa-arrows-rotate text-xs"></i>
                <span>Next</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="p-2 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800 transition cursor-pointer relative"
                title="Copy Motivational Quote"
              >
                <i className={`fa-solid ${copiedToast ? 'fa-check text-emerald-400' : 'fa-copy'} text-xs`}></i>
                {copiedToast && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                    Copied!
                  </span>
                )}
              </button>

              <button
                onClick={handleSpeakQuote}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isSpeakingQuote
                    ? 'text-amber-400 bg-amber-400/20 animate-pulse'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={`Read Quote Aloud (${currentMotivationalQuote.langName})`}
              >
                <i className="fa-solid fa-volume-high text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Grade Selection Selector */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
              <i className="fa-solid fa-flag text-xs"></i> Tanzania NECTA Portal
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${urgencyStatus.color}`}>
              <i className={`fa-solid ${urgencyStatus.icon}`}></i> {urgencyStatus.label}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <i className="fa-solid fa-hourglass-start text-indigo-400 animate-spin-slow"></i>
            NECTA Exam Countdown 🇹🇿
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Official countdown to <span className="text-indigo-300 font-bold">{activeExam.fullName} ({activeExam.examCode})</span>
          </p>
        </div>

        {/* Grade Selector Switcher */}
        <div className="shrink-0 space-y-1.5">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <i className="fa-solid fa-graduation-cap text-indigo-400"></i> Change Grade Exam:
          </label>
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {NECTA_EXAM_SCHEDULE.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 ${
                  selectedExamId === exam.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{exam.examCode}</span>
                <span className="text-[10px] opacity-75 font-normal">({exam.gradeLabel})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Countdown Numbers Section */}
      <div className="relative z-10 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 text-center">
        {/* Days Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-indigo-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-400 tracking-tight font-mono">
            {String(timeDiff.days).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-indigo-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>DAYS</span>
            <span className="text-[10px] text-slate-500 font-normal">(Siku)</span>
          </div>
        </div>

        {/* Hours Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-cyan-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 tracking-tight font-mono">
            {String(timeDiff.hours).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-cyan-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>HOURS</span>
            <span className="text-[10px] text-slate-500 font-normal">(Masaa)</span>
          </div>
        </div>

        {/* Minutes Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-amber-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-400 tracking-tight font-mono">
            {String(timeDiff.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-amber-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>MINUTES</span>
            <span className="text-[10px] text-slate-500 font-normal">(Dakika)</span>
          </div>
        </div>

        {/* Seconds Box */}
        <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border-2 border-slate-800/80 shadow-inner group hover:border-rose-500/50 transition-all">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-400 tracking-tight font-mono animate-pulse">
            {String(timeDiff.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs font-black uppercase text-rose-300 tracking-widest mt-2 flex items-center justify-center gap-1">
            <span>SECONDS</span>
            <span className="text-[10px] text-slate-500 font-normal">(Sekunde)</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Academic Calendar Context */}
      <div className="relative z-10 space-y-2 pb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <i className="fa-regular fa-calendar-check text-indigo-400"></i>
            Exam Date: <strong className="text-white">{formattedExamDate}</strong>
          </span>
          <span className="text-indigo-300 font-black">{timeDiff.progressPercent}% Academic Year Completed</span>
        </div>
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-400 h-full rounded-full transition-all duration-1000 shadow-lg shadow-indigo-500/50"
            style={{ width: `${timeDiff.progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Preparation Advice & Key Subjects Bar */}
      <div className="relative z-10 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 grid md:grid-cols-2 gap-4 items-center">
        <div>
          <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5 mb-1">
            <i className="fa-solid fa-lightbulb"></i> NECTA Prep Strategy for {activeExam.examCode}:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            "{activeExam.tips[0]}"
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          {onStartQuickStudy && (
            <button
              onClick={onStartQuickStudy}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-400/30 active:scale-95"
              title="Open a random syllabus topic for immediate study review"
            >
              <i className="fa-solid fa-bolt text-slate-950"></i>
              <span>Quick Study Session ⚡</span>
            </button>
          )}

          {onNavigateToExams && (
            <button
              onClick={onNavigateToExams}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <i className="fa-solid fa-file-signature text-amber-300"></i>
              <span>Past Papers Vault</span>
            </button>
          )}

          {onNavigateToPlanner && (
            <button
              onClick={onNavigateToPlanner}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs transition flex items-center gap-1.5 border border-slate-700 active:scale-95"
            >
              <i className="fa-solid fa-calendar-days text-cyan-400"></i>
              <span>Revision Schedule</span>
            </button>
          )}

          {onOpenYunAI && (
            <button
              onClick={() => onOpenYunAI(`I am preparing for the NECTA ${activeExam.examCode} (${activeExam.gradeLabel}) exam. Please create a tailored 30-day revision plan with key high-yield topics!`)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/30 active:scale-95"
            >
              <i className="fa-solid fa-robot text-slate-950"></i>
              <span>Ask Yun Revision Tips</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
