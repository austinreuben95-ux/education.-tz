import React, { useState, useMemo, useEffect } from 'react';

export interface CuratedVideo {
  id: string;
  youtubeId: string;
  title: string;
  subject: string;
  topic: string;
  subtopic?: string;
  level: 'Primary' | 'O-Level' | 'A-Level' | 'Practicals';
  channel: string;
  language: 'Swahili' | 'English';
  duration: string;
  rating?: string;
  views?: string;
  description: string;
  isNectaRevision?: boolean;
  isCustomAdded?: boolean;
}

export const CURATED_VIDEOS_DATABASE: CuratedVideo[] = [
  // 1. Mathematics (O-Level & A-Level & Primary)
  {
    id: 'vid-math-1',
    youtubeId: '0TgLtF3PMOc',
    title: 'Form 1 Basic Mathematics - Simplifying Algebraic Expressions Step-by-Step',
    subject: 'Basic Mathematics',
    topic: 'Algebra & Equations',
    subtopic: 'Simplifying Algebraic Fractions and Linear Equations',
    level: 'O-Level',
    channel: 'Shule Direct',
    language: 'English',
    duration: '14:20',
    rating: '4.9 ★',
    views: '45K views',
    description: 'Learn how to expand brackets, combine like terms, and solve linear equations for Form 1 NECTA exam preparation.',
    isNectaRevision: true
  },
  {
    id: 'vid-math-2',
    youtubeId: 'qM7H5j9Y8U0',
    title: 'Form 4 NECTA Mathematics: Matrix Operations, Determinants & Inverse Matrices',
    subject: 'Basic Mathematics',
    topic: 'Matrices & Transformations',
    subtopic: '2x2 Matrix Inverses and Simultaneous Equations',
    level: 'O-Level',
    channel: 'NECTA Revision Hub',
    language: 'Swahili',
    duration: '18:45',
    rating: '4.8 ★',
    views: '82K views',
    description: 'Jifunze jinsi ya kukokotoa Matrix Inverses na kutatua mifumo ya milinganyo kwa kutumia Matrix kwa Kiswahili.',
    isNectaRevision: true
  },
  {
    id: 'vid-math-3',
    youtubeId: '3JZ_D3ELwOQ',
    title: 'Form 3 Basic Mathematics - Trigonometry Ratios & Word Problems',
    subject: 'Basic Mathematics',
    topic: 'Trigonometry',
    subtopic: 'Sine, Cosine, Tangent and Angles of Elevation',
    level: 'O-Level',
    channel: 'TIE Learning Portal',
    language: 'English',
    duration: '16:10',
    rating: '4.9 ★',
    views: '38K views',
    description: 'Comprehensive walkthrough on finding unknown sides and angles using SOH CAH TOA rules.',
    isNectaRevision: false
  },
  {
    id: 'vid-math-4',
    youtubeId: '8iqn3x8LwO8',
    title: 'Form 2 Basic Mathematics - Quadratic Equations by Factorization',
    subject: 'Basic Mathematics',
    topic: 'Quadratic Equations',
    subtopic: 'Factorization & Completing the Square',
    level: 'O-Level',
    channel: 'Maths Tanzania',
    language: 'Swahili',
    duration: '21:05',
    rating: '5.0 ★',
    views: '94K views',
    description: 'Njia rahisi ya kutatua Quadratic Equations kwa kutumia njia ya Mambo na Kukamilisha Mduara.',
    isNectaRevision: true
  },
  {
    id: 'vid-math-5',
    youtubeId: 'fAwhLgT_vG0',
    title: 'Advanced Mathematics (Form 5 & 6) - Differential Calculus & Applications',
    subject: 'Advanced Mathematics',
    topic: 'Differentiation',
    subtopic: 'Product Rule, Quotient Rule and Maxima/Minima',
    level: 'A-Level',
    channel: 'Tanzania Online High School',
    language: 'English',
    duration: '28:30',
    rating: '4.9 ★',
    views: '32K views',
    description: 'Master differential calculus rules and curve sketching for NECTA ACSEE examination success.',
    isNectaRevision: true
  },

  // 2. Physics & Practicals
  {
    id: 'vid-phy-1',
    youtubeId: 'X3TAROotFfM',
    title: "Form 3 Physics - Ohm's Law and Electric Circuits Walkthrough",
    subject: 'Physics',
    topic: 'Current Electricity',
    subtopic: "Ohm's Law, Resistors in Series and Parallel",
    level: 'O-Level',
    channel: 'Swahili Science Tutorials',
    language: 'Swahili',
    duration: '19:30',
    rating: '4.9 ★',
    views: '67K views',
    description: "Ufafanuzi wa kina wa Ohm's Law (V = IR) na jinsi ya kukokotoa usugu wa mzunguko wa umeme (Resistance).",
    isNectaRevision: true
  },
  {
    id: 'vid-phy-2',
    youtubeId: 'UBVV8pch1dM',
    title: 'Form 4 Physics NECTA - Magnetic Fields & Electromagnetic Induction',
    subject: 'Physics',
    topic: 'Magnetism & Electromagnetism',
    subtopic: 'Solenoids, Faraday Law and Transformers',
    level: 'O-Level',
    channel: 'NECTA Physics Masterclass',
    language: 'Swahili',
    duration: '24:15',
    rating: '4.8 ★',
    views: '51K views',
    description: 'Uchambuzi wa maswali ya mitihani ya NECTA kuhusu Umeme na Sumaku na utendaji kazi wa Transformers.',
    isNectaRevision: true
  },
  {
    id: 'vid-phy-prac-1',
    youtubeId: '0gQ_3e4xV-k',
    title: 'NECTA Form 4 Physics Practical 2A/2B - Mechanics: Spiral Spring & Simple Pendulum',
    subject: 'Physics',
    topic: 'Physics Practical (2A/2B)',
    subtopic: 'Hooke\'s Law, Period of Oscillation and Graph Plotting',
    level: 'Practicals',
    channel: 'NECTA Revision Hub',
    language: 'Swahili',
    duration: '32:10',
    rating: '5.0 ★',
    views: '115K views',
    description: 'Hatua kwa hatua ya kufanya mtihani wa practical ya Physics Form 4 NECTA, kuchora jedwali la vipimo na graph.',
    isNectaRevision: true
  },

  // 3. Chemistry & Practicals
  {
    id: 'vid-chem-1',
    youtubeId: 'cPDptc0wUYI',
    title: 'Form 3 Chemistry - Mole Concept Calculations Made Easy for NECTA',
    subject: 'Chemistry',
    topic: 'Mole Concept & Stoichiometry',
    subtopic: 'Molar Mass, Avogadro Constant & Reacting Masses',
    level: 'O-Level',
    channel: 'Swahili Science Tutorials',
    language: 'Swahili',
    duration: '22:40',
    rating: '5.0 ★',
    views: '125K views',
    description: 'Maswali ya NECTA ya Mole Concept yaliyojibiwa kwa hatua zote kwa ufasaha.',
    isNectaRevision: true
  },
  {
    id: 'vid-chem-prac-1',
    youtubeId: 'pQ7d3k2wVUk',
    title: 'NECTA Form 4 Chemistry Practical 2A - Volumetric Analysis (Acid-Base Titration)',
    subject: 'Chemistry',
    topic: 'Chemistry Practical (2A)',
    subtopic: 'Standard Solutions, Titration Tables, Molarity and % Purity',
    level: 'Practicals',
    channel: 'Swahili Science Tutorials',
    language: 'Swahili',
    duration: '29:45',
    rating: '4.9 ★',
    views: '142K views',
    description: 'Jinsi ya kusoma burette, kuweka viashiria (indicators), kuandika jedwali la titration na kukokotoa molarity.',
    isNectaRevision: true
  },
  {
    id: 'vid-chem-2',
    youtubeId: 'FSyAehMdpyI',
    title: 'Form 2 Chemistry - Ionic vs Covalent Bonding & Molecular Structures',
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    subtopic: 'Electrovalent vs Covalent Bonds and Valence Shells',
    level: 'O-Level',
    channel: 'The Organic Chemistry Tutor',
    language: 'English',
    duration: '15:10',
    rating: '4.9 ★',
    views: '230K views',
    description: 'Visual representations of electron sharing and transfer between metal and non-metal atoms.',
    isNectaRevision: false
  },

  // 4. Biology & Practicals
  {
    id: 'vid-bio-1',
    youtubeId: 'bHIhgxav9LY',
    title: 'Form 4 Biology NECTA - Genetics, Mendel Laws & Punnett Square Crosses',
    subject: 'Biology',
    topic: 'Genetics & Inheritance',
    subtopic: 'Monohybrid Crosses, Genotypes and Phenotypes',
    level: 'O-Level',
    channel: 'NECTA Biology Hub',
    language: 'Swahili',
    duration: '25:10',
    rating: '4.9 ★',
    views: '98K views',
    description: 'Jinsi ya kutatua maswali ya Genetics na Punnett Squares kwenye mitihani ya Kidato cha Nne.',
    isNectaRevision: true
  },
  {
    id: 'vid-bio-prac-1',
    youtubeId: '9L8_Kx7qBwU',
    title: 'NECTA Form 4 Biology Practical 2 - Food Tests (Benedict\'s, Iodine, Biuret, Sudan III)',
    subject: 'Biology',
    topic: 'Biology Practical (Paper 2)',
    subtopic: 'Test for Reducing Sugars, Starch, Proteins and Lipids',
    level: 'Practicals',
    channel: 'Elimu Kwanza TV',
    language: 'Swahili',
    duration: '21:15',
    rating: '5.0 ★',
    views: '160K views',
    description: 'Uchunguzi wa chakula kimaabara: majaribio, uchunguzi, hitimisho na kuandika ripoti ya mtihani wa NECTA.',
    isNectaRevision: true
  },
  {
    id: 'vid-bio-2',
    youtubeId: '89O5qGg760s',
    title: 'Form 1 Biology - Plant vs Animal Cell Structure & Functions',
    subject: 'Biology',
    topic: 'Cell Structure & Organization',
    subtopic: 'Organelles: Nucleus, Mitochondria, Cell Wall',
    level: 'O-Level',
    channel: 'Shule Direct',
    language: 'Swahili',
    duration: '11:20',
    rating: '4.8 ★',
    views: '54K views',
    description: 'Ulinganifu wa seli za mimea na wanyama na kazi za kila sehemu ya seli.',
    isNectaRevision: true
  },

  // 5. Kiswahili
  {
    id: 'vid-kisw-1',
    youtubeId: '5mTo8XyQn2o',
    title: 'Kiswahili Kidato cha 1-4: Ngeli za Nomino na Patano la Kisarufi',
    subject: 'Kiswahili',
    topic: 'Sarufi (Grammar)',
    subtopic: 'Ngeli za Nomino (A-WA, KI-VI, I-ZI, U-I)',
    level: 'O-Level',
    channel: 'Kiswahili na Walimu TZ',
    language: 'Swahili',
    duration: '20:30',
    rating: '5.0 ★',
    views: '140K views',
    description: 'Mbinu rahisi ya kutambua Ngeli za Nomino zote na patano lake la kisarufi kwa ajili ya NECTA.',
    isNectaRevision: true
  },
  {
    id: 'vid-kisw-2',
    youtubeId: 'V6yixyiJkos',
    title: 'Fasihi ya Kiswahili: Uchambuzi wa Riwaya na Tamthilia za NECTA',
    subject: 'Kiswahili',
    topic: 'Fasihi (Literature)',
    subtopic: 'Maudhui, Dhamira na Uhusika katika Tamthilia',
    level: 'O-Level',
    channel: 'Mwalimu Mkuu Kiswahili',
    language: 'Swahili',
    duration: '28:15',
    rating: '4.9 ★',
    views: '88K views',
    description: 'Uchambuzi wa vitabu teule vya NECTA ikiwemo Takadini, Watoto wa Mama Ntilie na Kilio Chetu.',
    isNectaRevision: true
  },

  // 6. English Language
  {
    id: 'vid-eng-1',
    youtubeId: 'gVIFEVLzP4o',
    title: 'Form 1-4 English Language - Mastery of Verb Tenses & Passive Voice',
    subject: 'English Language',
    topic: 'Grammar & Structure',
    subtopic: 'Present Perfect, Past Continuous and Active/Passive Rules',
    level: 'O-Level',
    channel: 'Tanzania English Academy',
    language: 'English',
    duration: '16:50',
    rating: '4.8 ★',
    views: '62K views',
    description: 'Clear rules for changing sentences from Active to Passive Voice with NECTA CSEE exam examples.',
    isNectaRevision: true
  },

  // 7. Geography & History
  {
    id: 'vid-geo-1',
    youtubeId: 'k32D2y7I5Jg',
    title: 'Form 3 Geography - Map Reading, Grid References & Area Calculation',
    subject: 'Geography',
    topic: 'Map Reading & Topography',
    subtopic: '6-Figure Grid Reference and Contour Elevation',
    level: 'O-Level',
    channel: 'Geography Masterclass TZ',
    language: 'Swahili',
    duration: '26:00',
    rating: '4.9 ★',
    views: '73K views',
    description: 'Kupima umbali, kukokotoa eneo kwa grid squares na kutambua miinuko kwenye ramani za NECTA.',
    isNectaRevision: true
  },
  {
    id: 'vid-hist-1',
    youtubeId: '7Q3w9J7rUkI',
    title: 'Form 4 History - Decolonization and Nationalism in Africa & Tanganyika',
    subject: 'History',
    topic: 'Nationalism & Decolonization',
    subtopic: 'TANU, Julius Nyerere and African Independence Movements',
    level: 'O-Level',
    channel: 'Historia ya Tanzania Online',
    language: 'Swahili',
    duration: '22:15',
    rating: '4.8 ★',
    views: '49K views',
    description: 'Historia ya harakati za kupigania uhuru Tanganyika na Afrika, mikakati ya TANU na Nyerere.',
    isNectaRevision: true
  },

  // 8. Primary School (PSLE)
  {
    id: 'vid-psle-1',
    youtubeId: 'e4G7p9N2t_A',
    title: 'Hisabati Darasa la 7 - Sehemu, Asilimia na Maumbo kwa Mtihani wa PSLE',
    subject: 'Hisabati (Primary)',
    topic: 'Sehemu na Asilimia',
    subtopic: 'Kutatua Maswali ya NECTA PSLE Darasa la Saba',
    level: 'Primary',
    channel: 'Elimu ya Msingi TZ',
    language: 'Swahili',
    duration: '18:20',
    rating: '4.9 ★',
    views: '58K views',
    description: 'Mbinu za haraka za kujibu maswali magumu ya mtihani wa kumaliza elimu ya msingi (PSLE).',
    isNectaRevision: true
  },
  {
    id: 'vid-psle-2',
    youtubeId: 'v8J_2Xk3g8Q',
    title: 'Sayansi na Teknolojia Darasa la 6 & 7 - Mfumo wa Upumuaji na Damu',
    subject: 'Sayansi na Teknolojia',
    topic: 'Mwili wa Binadamu',
    subtopic: 'Moyo, Mapafu na Mzunguko wa Damu',
    level: 'Primary',
    channel: 'Shule Direct Primary',
    language: 'Swahili',
    duration: '14:40',
    rating: '4.8 ★',
    views: '41K views',
    description: 'Michoro na ufafanuzi wa sayansi ya msingi kwa maandalizi ya mtihani wa Taifa wa PSLE.',
    isNectaRevision: true
  }
];

export const SUBJECT_OPTIONS = [
  'All Subjects',
  'Basic Mathematics',
  'Advanced Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Kiswahili',
  'English Language',
  'Geography',
  'History',
  'Civics',
  'Commerce',
  'Bookkeeping',
  'Sayansi na Teknolojia',
  'Hisabati (Primary)'
];

export const POPULAR_TOPICS = [
  'NECTA Practicals',
  'Quadratic Equations',
  'Cell Division & Genetics',
  "Ohm's Law & Circuits",
  'Mole Concept & Titration',
  'Ngeli za Nomino & Fasihi',
  'Matrices & Vectors',
  'Map Reading & Grid Ref',
  'Calculus A-Level',
  'Food Tests Biology'
];

export const YOUTUBE_CHANNELS_PRESETS = [
  { name: 'Shule Direct', query: 'Shule Direct Tanzania syllabus' },
  { name: 'NECTA Revision Hub', query: 'NECTA form 4 past paper revision' },
  { name: 'Swahili Science Tutorials', query: 'Swahili science physics chemistry biology' },
  { name: 'Tanzania Online High School', query: 'Tanzania Online High School A level ACSEE' },
  { name: 'Elimu Kwanza', query: 'Elimu Kwanza practicals NECTA' },
  { name: 'The Organic Chemistry Tutor', query: 'Organic Chemistry Tutor mathematics physics' },
  { name: 'Khan Academy', query: 'Khan Academy science lessons' }
];

export const VideoLessonsSearch: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | 'Swahili' | 'English'>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Primary' | 'O-Level' | 'A-Level' | 'Practicals'>('All');

  // Custom User Saved Videos in LocalStorage
  const [customSavedVideos, setCustomSavedVideos] = useState<CuratedVideo[]>(() => {
    try {
      const saved = localStorage.getItem('edu_tz_custom_youtube_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currently playing video state
  const [activeVideo, setActiveVideo] = useState<CuratedVideo>(CURATED_VIDEOS_DATABASE[0]);

  // YouTube Search & Embed Input Box State
  const [ytInputUrlOrSearch, setYtInputUrlOrSearch] = useState<string>('');
  const [ytCustomTitle, setYtCustomTitle] = useState<string>('');
  const [ytCustomSubject, setYtCustomSubject] = useState<string>('Basic Mathematics');
  const [isYoutubeFinderOpen, setIsYoutubeFinderOpen] = useState<boolean>(false);
  const [embedNotification, setEmbedNotification] = useState<string | null>(null);

  // Video Revision Notes State (auto-saved per active video ID)
  const [userNotes, setUserNotes] = useState<string>('');
  const [notesSavedIndicator, setNotesSavedIndicator] = useState<boolean>(false);

  // Theater / Full view toggle
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  // Load notes for current active video
  useEffect(() => {
    if (activeVideo?.id) {
      try {
        const savedNotes = localStorage.getItem(`edu_tz_notes_${activeVideo.id}`);
        setUserNotes(savedNotes || '');
      } catch {
        setUserNotes('');
      }
    }
  }, [activeVideo?.id]);

  // Save notes handler
  const handleSaveNotes = (text: string) => {
    setUserNotes(text);
    if (activeVideo?.id) {
      try {
        localStorage.setItem(`edu_tz_notes_${activeVideo.id}`, text);
        setNotesSavedIndicator(true);
        setTimeout(() => setNotesSavedIndicator(false), 2000);
      } catch {
        // storage ignored
      }
    }
  };

  // Helper to extract YouTube Video ID from any URL, embed iframe code, or direct ID
  const extractYouTubeId = (input: string): string | null => {
    const clean = input.trim();
    if (!clean) return null;

    // Direct 11-character alphanumeric ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }

    // Standard YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = clean.match(/(?:v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    }

    // Iframe src match
    const iframeMatch = clean.match(/src="[^"]*\/embed\/([a-zA-Z0-9_-]{11})[^"]*"/);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1];
    }

    return null;
  };

  // Handle direct YouTube Embed / Import
  const handleEmbedYouTubeVideo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const extractedId = extractYouTubeId(ytInputUrlOrSearch);

    if (!extractedId) {
      // If it's a search term rather than a direct link, construct YouTube live search
      const query = encodeURIComponent(ytInputUrlOrSearch.trim());
      window.open(`https://www.youtube.com/results?search_query=NECTA+Tanzania+${query}`, '_blank');
      setEmbedNotification(`Opening YouTube search for "NECTA Tanzania ${ytInputUrlOrSearch}" in a new tab...`);
      setTimeout(() => setEmbedNotification(null), 4000);
      return;
    }

    const newVideo: CuratedVideo = {
      id: `custom-yt-${Date.now()}`,
      youtubeId: extractedId,
      title: ytCustomTitle.trim() || `YouTube Lesson (${extractedId})`,
      subject: ytCustomSubject,
      topic: 'Custom YouTube Search Tutorial',
      subtopic: 'Student Embedded Video',
      level: 'O-Level',
      channel: 'YouTube Video',
      language: 'English',
      duration: 'Online Lesson',
      rating: '5.0 ★',
      views: 'Student Added',
      description: `Embedded custom YouTube study lesson for ${ytCustomSubject}. Saved to your personal browser video playlist.`,
      isNectaRevision: true,
      isCustomAdded: true
    };

    const updated = [newVideo, ...customSavedVideos.filter(v => v.youtubeId !== extractedId)];
    setCustomSavedVideos(updated);
    try {
      localStorage.setItem('edu_tz_custom_youtube_videos', JSON.stringify(updated));
    } catch {
      // storage
    }

    setActiveVideo(newVideo);
    setYtInputUrlOrSearch('');
    setYtCustomTitle('');
    setIsYoutubeFinderOpen(false);
    setEmbedNotification(`Successfully loaded and embedded YouTube Video: "${newVideo.title}"!`);
    setTimeout(() => setEmbedNotification(null), 4000);
  };

  // Remove custom saved video
  const handleRemoveCustomVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customSavedVideos.filter(v => v.id !== id);
    setCustomSavedVideos(updated);
    try {
      localStorage.setItem('edu_tz_custom_youtube_videos', JSON.stringify(updated));
    } catch {
      // storage
    }
  };

  // All available videos combined
  const allVideos = useMemo(() => {
    return [...customSavedVideos, ...CURATED_VIDEOS_DATABASE];
  }, [customSavedVideos]);

  // Filtered videos based on search inputs
  const filteredVideos = useMemo(() => {
    return allVideos.filter((vid) => {
      // Subject Filter
      if (selectedSubject !== 'All Subjects' && vid.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }
      // Language Filter
      if (selectedLanguage !== 'All' && vid.language !== selectedLanguage) {
        return false;
      }
      // Level Filter
      if (selectedLevel !== 'All' && vid.level !== selectedLevel) {
        return false;
      }
      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = vid.title.toLowerCase().includes(q);
        const matchesTopic = vid.topic.toLowerCase().includes(q);
        const matchesSubtopic = vid.subtopic ? vid.subtopic.toLowerCase().includes(q) : false;
        const matchesSubject = vid.subject.toLowerCase().includes(q);
        const matchesChannel = vid.channel.toLowerCase().includes(q);
        return matchesTitle || matchesTopic || matchesSubtopic || matchesSubject || matchesChannel;
      }
      return true;
    });
  }, [allVideos, selectedSubject, searchQuery, selectedLanguage, selectedLevel]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-slate-100 font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-2xl border border-indigo-500/30 shadow-2xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-bold uppercase tracking-widest">
              <i className="fa-solid fa-graduation-cap text-indigo-400"></i> Education-TZ Media Portal & Video Tutorials
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Tanzania Video Lessons & YouTube Hub
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Watch official Tanzanian curriculum video walkthroughs in Swahili & English, or search and embed any YouTube educational lesson directly inside your portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsYoutubeFinderOpen(true)}
              className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-900/40 transition shrink-0 active:scale-95 border border-red-400/30"
              title="Search YouTube or paste a link to watch inside Education-TZ"
            >
              <i className="fa-brands fa-youtube text-amber-300 text-base"></i>
              <span>Search / Embed from YouTube</span>
            </button>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center min-w-[110px]">
              <span className="block text-2xl font-bold text-indigo-400">{filteredVideos.length}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lessons Found</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center min-w-[110px]">
              <span className="block text-2xl font-bold text-emerald-400">NECTA</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {embedNotification && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/90 border-2 border-emerald-500 text-emerald-100 flex items-center gap-3 shadow-xl animate-fade-in">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <span className="text-sm font-semibold">{embedNotification}</span>
        </div>
      )}

      {/* YouTube Search & Embed Live Dialog / Card */}
      {isYoutubeFinderOpen && (
        <div className="mb-8 p-6 bg-slate-900 border-2 border-red-500/50 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center text-lg border border-red-500/30">
                <i className="fa-brands fa-youtube text-red-400"></i>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Search YouTube or Embed Lesson in Website</h3>
                <p className="text-xs text-slate-400">Enter a YouTube URL, video link, or topic keywords to play directly inside Education-TZ.</p>
              </div>
            </div>
            <button
              onClick={() => setIsYoutubeFinderOpen(false)}
              className="text-slate-400 hover:text-white text-sm p-1.5 rounded-lg bg-slate-800"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form onSubmit={handleEmbedYouTubeVideo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  YouTube Link, Video ID or Search Query *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://youtu.be/0TgLtF3PMOc or NECTA Physics Practical"
                    value={ytInputUrlOrSearch}
                    onChange={(e) => setYtInputUrlOrSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 outline-none transition"
                  />
                  <i className="fa-brands fa-youtube absolute left-3.5 top-3 text-red-500 text-sm"></i>
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Custom Lesson Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Form 4 Chemistry Titration"
                  value={ytCustomTitle}
                  onChange={(e) => setYtCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Subject Category
                </label>
                <select
                  value={ytCustomSubject}
                  onChange={(e) => setYtCustomSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition cursor-pointer"
                >
                  {SUBJECT_OPTIONS.filter(s => s !== 'All Subjects').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Channels & Suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Tanzanian YouTube Channels & Queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {YOUTUBE_CHANNELS_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setYtInputUrlOrSearch(preset.query);
                      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(preset.query)}`, '_blank');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-red-600/30 border border-slate-700 hover:border-red-500/50 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5"
                  >
                    <i className="fa-brands fa-youtube text-red-400 text-[11px]"></i>
                    <span>{preset.name}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[9px] text-slate-400"></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsYoutubeFinderOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-red-900/30"
              >
                <i className="fa-solid fa-play"></i> Embed & Watch Lesson in Portal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Sticky Video Player Stage */}
      {activeVideo && (
        <div className={`mb-10 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isTheaterMode ? 'p-2 ring-4 ring-indigo-500/40' : ''
        }`}>
          <div className={`grid grid-cols-1 ${isTheaterMode ? 'lg:grid-cols-1' : 'lg:grid-cols-12'}`}>
            {/* Embed Player */}
            <div className={`${isTheaterMode ? 'w-full aspect-[21/9] md:aspect-video' : 'lg:col-span-8'} bg-black aspect-video relative flex items-center justify-center`}>
              <iframe
                className="w-full h-full absolute top-0 left-0"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Info & Notes Panel */}
            <div className={`${isTheaterMode ? 'w-full mt-4' : 'lg:col-span-4'} p-6 bg-slate-900/90 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 space-y-4`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md text-xs font-bold uppercase tracking-wider">
                      {activeVideo.subject}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-bold">
                      {activeVideo.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTheaterMode(!isTheaterMode)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-bold transition flex items-center gap-1"
                      title={isTheaterMode ? "Exit Theater Mode" : "Expand Theater Mode"}
                    >
                      <i className={`fa-solid ${isTheaterMode ? 'fa-compress' : 'fa-expand'}`}></i>
                      <span>{isTheaterMode ? 'Default' : 'Theater'}</span>
                    </button>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                      activeVideo.language === 'Swahili'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      <i className="fa-solid fa-language mr-1"></i> {activeVideo.language}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white leading-snug">
                  {activeVideo.title}
                </h2>

                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                      <i className="fa-solid fa-user-tie text-indigo-400"></i> {activeVideo.channel}
                    </span>
                    <span>
                      <i className="fa-regular fa-clock mr-1"></i> {activeVideo.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold">{activeVideo.rating || '5.0 ★'}</span>
                    <span className="text-slate-400">{activeVideo.views || 'Tanzania Syllabus'}</span>
                  </div>
                  {activeVideo.subtopic && (
                    <p className="text-indigo-300/90 font-medium pt-1 border-t border-slate-700/50">
                      <strong className="text-slate-400">Unit:</strong> {activeVideo.subtopic}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeVideo.description}
                </p>

                {/* Live In-Session Lesson Notes Taker */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-pencil"></i> Lesson Revision Notes (Auto-saved)
                    </label>
                    {notesSavedIndicator && (
                      <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                        <i className="fa-solid fa-check"></i> Saved
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Type personal study key takeaways, formulas, or questions while watching..."
                    value={userNotes}
                    onChange={(e) => handleSaveNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 mt-4">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="fa-brands fa-youtube"></i> Watch on YouTube Fullscreen
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Topic Search Input */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Search Video Topics or Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Practicals, Titration, Matrices, Genetics, Map Reading..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 outline-none transition"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-500 text-sm"></i>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-sm"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Level Filter */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Curriculum Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition cursor-pointer"
            >
              <option value="All">All Curriculum Levels</option>
              <option value="Practicals">NECTA Science Practicals (Lab)</option>
              <option value="O-Level">Form 1 - Form 4 (CSEE)</option>
              <option value="A-Level">Form 5 - Form 6 (ACSEE)</option>
              <option value="Primary">Primary PSLE (Std 1 - 7)</option>
            </select>
          </div>

          {/* Subject Dropdown */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition cursor-pointer"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Language
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
              {(['All', 'Swahili', 'English'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`py-2 rounded-lg text-xs font-bold transition text-center ${
                    selectedLanguage === lang
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'All' ? 'All' : lang.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Topic Chips */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Trending Topics:
          </span>
          {POPULAR_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSearchQuery(topic)}
              className="px-3 py-1 bg-slate-800/70 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 border border-slate-700/60 rounded-full text-xs font-medium transition shrink-0"
            >
              <i className="fa-solid fa-play text-[10px] text-indigo-400 mr-1.5"></i>
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-play-circle text-indigo-400"></i> Video Tutorials ({filteredVideos.length})
          </h3>
          {(selectedSubject !== 'All Subjects' || searchQuery !== '' || selectedLanguage !== 'All' || selectedLevel !== 'All') && (
            <button
              onClick={() => {
                setSelectedSubject('All Subjects');
                setSearchQuery('');
                setSelectedLanguage('All');
                setSelectedLevel('All');
              }}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredVideos.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-3 my-6">
            <i className="fa-solid fa-magnifying-glass text-4xl text-slate-600"></i>
            <h4 className="text-base font-bold text-slate-300">No matching video lessons found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Can't find what you need? Use the <strong>Search / Embed from YouTube</strong> tool above to search YouTube and embed any video lesson into your portal!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setIsYoutubeFinderOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <i className="fa-brands fa-youtube"></i> Search on YouTube
              </button>
              <button
                onClick={() => {
                  setSelectedSubject('All Subjects');
                  setSearchQuery('');
                  setSelectedLanguage('All');
                  setSelectedLevel('All');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
              >
                Clear Search Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isSelected = activeVideo?.id === video.id;
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`group cursor-pointer bg-slate-900 rounded-2xl border transition overflow-hidden flex flex-col justify-between hover:shadow-2xl ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-900/90'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition flex items-center justify-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-900/80 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'
                        }`}>
                          <i className="fa-solid fa-play ml-0.5 text-sm"></i>
                        </div>
                      </div>

                      {/* Duration Tag */}
                      <span className="absolute bottom-2 right-2 bg-slate-950/80 text-slate-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                        {video.duration}
                      </span>

                      {/* Language / Level Badge */}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        video.language === 'Swahili'
                          ? 'bg-amber-500/90 text-slate-950'
                          : 'bg-blue-600/90 text-white'
                      }`}>
                        {video.language}
                      </span>

                      {video.isCustomAdded && (
                        <button
                          onClick={(e) => handleRemoveCustomVideo(video.id, e)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-[10px] shadow"
                          title="Remove custom video from list"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-400 uppercase tracking-wide">
                          {video.subject}
                        </span>
                        <span className="text-slate-400 font-semibold">{video.level}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition">
                        {video.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {video.topic} &bull; {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate max-w-[160px]">
                      <i className="fa-solid fa-user-tie text-indigo-400 mr-1"></i> {video.channel}
                    </span>
                    <span className="text-indigo-400 font-bold group-hover:underline flex items-center gap-1">
                      {isSelected ? 'Currently Playing' : 'Watch Lesson'} <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLessonsSearch;
