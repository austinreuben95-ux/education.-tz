import React, { useState, useMemo } from 'react';

export interface CuratedVideo {
  id: string;
  youtubeId: string;
  title: string;
  subject: string;
  topic: string;
  subtopic?: string;
  level: 'Primary' | 'O-Level' | 'A-Level';
  channel: string;
  language: 'Swahili' | 'English';
  duration: string;
  rating?: string;
  views?: string;
  description: string;
  isNectaRevision?: boolean;
}

export const CURATED_VIDEOS_DATABASE: CuratedVideo[] = [
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
    id: 'vid-phy-1',
    youtubeId: 'X3TAROotFfM',
    title: "Form 3 Physics - Ohm's Law and Electric Circuits Walkthrough",
    subject: 'Physics',
    topic: "Current Electricity",
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
    id: 'vid-phy-3',
    youtubeId: '8iqn3x8LwO8',
    title: 'Form 2 Physics - Work, Energy, Power & Mechanical Advantage',
    subject: 'Physics',
    topic: 'Work, Energy, and Power',
    subtopic: 'Kinetic & Potential Energy Formulas',
    level: 'O-Level',
    channel: 'Khan Academy Physics',
    language: 'English',
    duration: '12:50',
    rating: '4.9 ★',
    views: '110K views',
    description: 'Step-by-step calculation of Work Done (Force x Distance), Power, and Kinetic Energy transformations.',
    isNectaRevision: false
  },
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
  {
    id: 'vid-chem-3',
    youtubeId: 'gZnv-8bA8lE',
    title: 'Form 2 Chemistry - Acids, Bases, pH Scale & Neutralization Titration',
    subject: 'Chemistry',
    topic: 'Acids, Bases, and Salts',
    subtopic: 'pH Measurement and Titration Indicators',
    level: 'O-Level',
    channel: 'Shule Direct',
    language: 'English',
    duration: '13:45',
    rating: '4.7 ★',
    views: '42K views',
    description: 'Properties of acids and bases, pH scale usage, and acid-base salt formation reactions.',
    isNectaRevision: true
  },
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
  {
    id: 'vid-bio-3',
    youtubeId: '1E_m3e5Y3_8',
    title: 'Form 2 Biology - Human Digestive System & Enzyme Action',
    subject: 'Biology',
    topic: 'Human Nutrition & Digestion',
    subtopic: 'Alimentary Canal and Digestive Enzymes',
    level: 'O-Level',
    channel: 'Khan Academy Biology',
    language: 'English',
    duration: '17:05',
    rating: '4.9 ★',
    views: '180K views',
    description: 'Full anatomical journey of food through mouth, stomach, duodenum, and intestine with enzyme actions.',
    isNectaRevision: false
  },
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
  {
    id: 'vid-eng-2',
    youtubeId: 'rfscVS0vtbw',
    title: 'Form 3 & 4 English Literature - How to Analyze Poetry & Figures of Speech',
    subject: 'English Language',
    topic: 'Literature in English',
    subtopic: 'Poetic Devices: Metaphor, Simile, Personification, Imagery',
    level: 'O-Level',
    channel: 'Literature Masterclasses',
    language: 'English',
    duration: '14:40',
    rating: '4.9 ★',
    views: '41K views',
    description: 'Step-by-step poetic analysis guide for NECTA Form 4 literature papers.',
    isNectaRevision: true
  },
  {
    id: 'vid-geo-1',
    youtubeId: 'k32D2y7I5Jg',
    title: 'Form 3 Geography - Map Reading, Grid References & Area Calculation',
    subject: 'Geography',
    topic: 'Map Reading & Topography',
    subtopic: '6-Figure Grid Reference and Contour Elevation',
    level: 'O-Level',
    channel: 'Geography TZ',
    language: 'Swahili',
    duration: '22:15',
    rating: '4.9 ★',
    views: '105K views',
    description: 'Jifunze kusoma Ramani za Topographical, kutafuta 6-figure grid reference, na kukokotoa eneo (Area).',
    isNectaRevision: true
  },
  {
    id: 'vid-geo-2',
    youtubeId: 'fNk_zzaMoSs',
    title: 'Form 2 & 3 Geography - Photograph Interpretation & Landforms',
    subject: 'Geography',
    topic: 'Photograph Interpretation',
    subtopic: 'Ground, Oblique and Aerial Photographs',
    level: 'O-Level',
    channel: 'Shule Direct',
    language: 'Swahili',
    duration: '15:20',
    rating: '4.7 ★',
    views: '34K views',
    description: 'Aina za picha za kijiografia na jinsi ya kutambua shughuli za kibinadamu na umbo la nchi.',
    isNectaRevision: true
  },
  {
    id: 'vid-hist-1',
    youtubeId: 'NybHckSEQBI',
    title: 'Form 4 History - Decolonization & Independence Struggle in Tanganyika',
    subject: 'History',
    topic: 'Decolonization & Independence',
    subtopic: 'Role of TANU, Mwalimu Nyerere & Zanzibar Revolution (ASP)',
    level: 'O-Level',
    channel: 'History of Tanzania Series',
    language: 'Swahili',
    duration: '26:00',
    rating: '5.0 ★',
    views: '115K views',
    description: 'Uchambuzi wa kihistoria wa harakati za kudai uhuru wa Tanganyika (1954-1961) na Mapinduzi ya Zanzibar.',
    isNectaRevision: true
  },
  {
    id: 'vid-civ-1',
    youtubeId: 'fNk_zzaMoSs',
    title: 'Form 1 Civics - Pillars of the Tanzanian Constitution & Government Arms',
    subject: 'Civics',
    topic: 'Our Nation & Constitution',
    subtopic: 'Executive, Judiciary and Parliament (Bunge)',
    level: 'O-Level',
    channel: 'Civics & Patriotism TZ',
    language: 'Swahili',
    duration: '18:10',
    rating: '4.8 ★',
    views: '49K views',
    description: 'Mihimili mitatu ya Serikali ya Tanzania na haki za msingi za raia kulingana na Katiba ya Jamhuri.',
    isNectaRevision: true
  },
  {
    id: 'vid-prim-1',
    youtubeId: '5349I6o_e1U',
    title: 'Darasa la 6 & 7 Sayansi: Mfumo wa Mzunguko wa Damu na Kazi za Moyo',
    subject: 'Sayansi na Teknolojia',
    topic: 'Mfumo wa Mzunguko wa Damu',
    subtopic: 'Moyo, Mipira ya Damu na Seli za Damu',
    level: 'Primary',
    channel: 'Primary Science TZ',
    language: 'Swahili',
    duration: '13:50',
    rating: '4.9 ★',
    views: '76K views',
    description: 'Somo la Sayansi kwa wanafunzi wa shule za msingi kuandaa mtihani wa Darasa la Pitia la PSLE.',
    isNectaRevision: true
  },
  {
    id: 'vid-book-1',
    youtubeId: 'g8m5A_O1LMc',
    title: 'Form 1 & 2 Bookkeeping - The Double Entry System & Ledger Posting',
    subject: 'Bookkeeping',
    topic: 'Double Entry Principles',
    subtopic: 'Debit and Credit Rules for Assets and Liabilities',
    level: 'O-Level',
    channel: 'Commerce & Accounting TZ',
    language: 'English',
    duration: '19:15',
    rating: '4.9 ★',
    views: '58K views',
    description: 'Golden rules of accounting: Debit the receiver, Credit the giver. Practical ledger postings.',
    isNectaRevision: true
  }
];

export const SUBJECT_OPTIONS = [
  'All Subjects',
  'Basic Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Kiswahili',
  'English Language',
  'Civics',
  'Geography',
  'History',
  'Bookkeeping',
  'Sayansi na Teknolojia'
];

export const POPULAR_TOPICS = [
  'Quadratic Equations',
  'Cell Division',
  "Ohm's Law",
  'Mole Concept',
  'Ngeli za Nomino',
  'Matrices',
  'Decolonization',
  'Map Reading'
];

export const VideoLessonsSearch: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | 'Swahili' | 'English'>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Primary' | 'O-Level' | 'A-Level'>('All');
  
  // Currently playing video state
  const [activeVideo, setActiveVideo] = useState<CuratedVideo>(CURATED_VIDEOS_DATABASE[0]);

  // Filtered videos based on search inputs
  const filteredVideos = useMemo(() => {
    return CURATED_VIDEOS_DATABASE.filter((vid) => {
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
  }, [selectedSubject, searchQuery, selectedLanguage, selectedLevel]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-slate-100 font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-2xl border border-indigo-500/30 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-bold uppercase tracking-widest">
              <i className="fa-solid fa-graduation-cap text-indigo-400"></i> Education-TZ Media Portal
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Tanzania Curriculum Video Lessons
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Watch curated, top-rated video walkthroughs from trusted Tanzanian teachers and NECTA revision experts in Swahili and English.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-center min-w-[110px]">
              <span className="block text-xl font-bold text-indigo-400">{filteredVideos.length}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lessons Found</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-center min-w-[110px]">
              <span className="block text-xl font-bold text-amber-400">NECTA</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Video Player Stage */}
      {activeVideo && (
        <div className="mb-10 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Embed Player */}
            <div className="lg:col-span-8 bg-black aspect-video relative flex items-center justify-center">
              <iframe
                className="w-full h-full absolute top-0 left-0"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Info Panel */}
            <div className="lg:col-span-4 p-6 bg-slate-900/90 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md text-xs font-bold uppercase tracking-wider">
                    {activeVideo.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      activeVideo.language === 'Swahili'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      <i className="fa-solid fa-language mr-1"></i> {activeVideo.language}
                    </span>
                    {activeVideo.isNectaRevision && (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-xs font-bold">
                        NECTA Revision
                      </span>
                    )}
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
                    <span className="text-amber-400 font-bold">{activeVideo.rating}</span>
                    <span className="text-slate-400">{activeVideo.views}</span>
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
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 mt-4">
                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="fa-brands fa-youtube"></i> Watch on YouTube
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
          <div className="md:col-span-6 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Search Topic or Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Quadratic Equations, Cell Division, Ohm's Law..."
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

          {/* Subject Dropdown */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Subject Selector
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
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Explanation Language
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
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Topic Chips */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Popular Topics:
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
          {(selectedSubject !== 'All Subjects' || searchQuery !== '' || selectedLanguage !== 'All') && (
            <button
              onClick={() => {
                setSelectedSubject('All Subjects');
                setSearchQuery('');
                setSelectedLanguage('All');
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
              Try adjusting your topic search query or select "All Subjects" to view available NECTA tutorial lessons.
            </p>
            <button
              onClick={() => {
                setSelectedSubject('All Subjects');
                setSearchQuery('');
                setSelectedLanguage('All');
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
            >
              Clear Search Filters
            </button>
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

                      {/* Language Badge */}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        video.language === 'Swahili'
                          ? 'bg-amber-500/90 text-slate-950'
                          : 'bg-blue-600/90 text-white'
                      }`}>
                        {video.language}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-400 uppercase tracking-wide">
                          {video.subject}
                        </span>
                        <span className="text-slate-400">{video.level}</span>
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
