import React, { useState, useMemo } from 'react';

export interface DictTerm {
  id: string;
  english: string;
  swahili: string;
  category: 'Science' | 'Mathematics' | 'Social Studies' | 'ICT & Tech' | 'Languages';
  definitionEn: string;
  definitionSw: string;
  exampleEn: string;
  exampleSw: string;
  pronunciation?: string;
  subjectTag: string;
}

const DICTIONARY_DATA: DictTerm[] = [
  // Science & Biology
  {
    id: 'd1',
    english: 'Photosynthesis',
    swahili: 'Fotosinthesis (Mchakato wa Utengenezaji Chakula)',
    category: 'Science',
    definitionEn: 'The process by which green plants and some organisms use sunlight to synthesize nutrients from carbon dioxide and water.',
    definitionSw: 'Mchakato ambao mimea ya kijani hutumia mwanga wa jua, maji na hewa ya ukaa kutengeneza chakula na kutoa oksijeni.',
    exampleEn: 'Leaves contain chlorophyll which is essential for photosynthesis.',
    exampleSw: 'Majani yana kemikali ya klorofili ambayo ni muhimu kwa utengenezaji wa chakula.',
    pronunciation: 'foh-toh-SIN-thuh-sis',
    subjectTag: 'Biology'
  },
  {
    id: 'd2',
    english: 'Mitochondria',
    swahili: 'Mitochondria (Mkusanya Nishati wa Seli)',
    category: 'Science',
    definitionEn: 'An organelle found in large numbers in most cells, known as the powerhouse of the cell.',
    definitionSw: 'Sehemu ya seli inayohusika na kutoa na kuhifadhi nishati inayohitajiwa na viumbe hai.',
    exampleEn: 'Mitochondria convert glucose into ATP energy for cellular function.',
    exampleSw: 'Mitochondria hubadilisha sukari kuwa nishati ya ATP kwa ajili ya utendaji wa seli.',
    pronunciation: 'my-tuh-KON-dree-uh',
    subjectTag: 'Biology'
  },
  {
    id: 'd3',
    english: 'Respiration',
    swahili: 'Pumzi ya Seli / Mfumuko wa Nishati',
    category: 'Science',
    definitionEn: 'The biochemical process in cells by which organisms obtain energy from glucose and oxygen.',
    definitionSw: 'Mchakato wa kibiokemia ambapo viumbe hai huvunja nishati kutoka kwenye chakula kwa msaada wa oksijeni.',
    exampleEn: 'Aerobic respiration requires oxygen to release stored chemical energy.',
    exampleSw: 'Upumuaji wa kioksijeni unahitaji hewa ya oksijeni kutoa nishati iliyohifadhiwa.',
    pronunciation: 'res-puh-RAY-shuhn',
    subjectTag: 'Biology'
  },
  {
    id: 'd4',
    english: 'Osmosis',
    swahili: 'Osmosisi (Upenyaji wa Maji)',
    category: 'Science',
    definitionEn: 'Movement of water molecules from a region of higher water concentration to lower concentration through a semi-permeable membrane.',
    definitionSw: 'Upenyaji wa molekuli za maji kutoka eneo lenye msongamano mkubwa wa maji kwenda eneo lenye msongamano mdogo kupitia utando unaopenyeka.',
    exampleEn: 'Plant roots absorb soil water primarily through osmosis.',
    exampleSw: 'Mizo ya mimea unanyonya maji ya udongo kupitia mchakato wa osmosisi.',
    pronunciation: 'oz-MOH-sis',
    subjectTag: 'Biology'
  },
  {
    id: 'd5',
    english: 'Hypotenuse',
    swahili: 'Kizio Kiegemeo / Upande Mrefu wa Pembotatu',
    category: 'Mathematics',
    definitionEn: 'The longest side of a right-angled triangle, opposite the right angle.',
    definitionSw: 'Upande mrefu zaidi katika pembotatu mraba, unaokabili pembe mraba (digrii 90).',
    exampleEn: 'Using Pythagoras theorem, the square of the hypotenuse equals the sum of squares of other sides.',
    exampleSw: 'Kwa kutumia kanuni ya Pythagoras, mraba wa kizio kiegemeo ni sawa na jumla ya mraba ya pande nyingine mbili.',
    pronunciation: 'hy-POT-n-oos',
    subjectTag: 'Mathematics'
  },
  {
    id: 'd6',
    english: 'Perpendicular',
    swahili: 'Wino Mraba / Mnyofu kwa Pembe ya 90°',
    category: 'Mathematics',
    definitionEn: 'A line meeting another line at a right angle (90 degrees).',
    definitionSw: 'Mstari unaokutana na mstari mwingine katika pembe mraba ya digrii 90.',
    exampleEn: 'The altitude of a triangle is perpendicular to its base.',
    exampleSw: 'Kimo cha pembotatu ni mstari wino mraba kuelekea chini kwenye msingi wake.',
    pronunciation: 'pur-puhn-DIK-yuh-ler',
    subjectTag: 'Mathematics'
  },
  {
    id: 'd7',
    english: 'Algorithm',
    swahili: 'Kanuni / Mfuatano wa Hatua',
    category: 'ICT & Tech',
    definitionEn: 'A process or set of rules to be followed in calculations or problem-solving operations, especially by a computer.',
    definitionSw: 'Mlolongo wa hatua zilizopangwa vyema zinazofuatwa kutatua tatizo fulani la kihisabati au kikompyuta.',
    exampleEn: 'Sorting algorithms arrange data in ascending or descending numerical order.',
    exampleSw: 'Kanuni za kupanga huweka takwimu katika mpangilio wa kuongezeka au kupungua.',
    pronunciation: 'AL-guh-rith-uhm',
    subjectTag: 'ICT'
  },
  {
    id: 'd8',
    english: 'Equator',
    swahili: 'Ikweta (Mstari wa Katikati ya Dunia)',
    category: 'Social Studies',
    definitionEn: 'An imaginary line drawn around the Earth equally distant from both poles, dividing the Earth into Northern and Southern hemispheres.',
    definitionSw: 'Mstari wa dhahania unaoigawa dunia katika vipande viwili sawa: Nusudunia ya Kaskazini na Nusudunia ya Kusini.',
    exampleEn: 'Tanzania lies a few degrees south of the Equator.',
    exampleSw: 'Tanzania ipo umbali mfupi wa digrii chache kusini mwa Mstari wa Ikweta.',
    pronunciation: 'ih-KWAY-ter',
    subjectTag: 'Geography'
  },
  {
    id: 'd9',
    english: 'Constitution',
    swahili: 'Katiba (Sheria Kuu ya Nchi)',
    category: 'Social Studies',
    definitionEn: 'A body of fundamental principles according to which a state or organization is acknowledged to be governed.',
    definitionSw: 'Mfumo wa sheria kuu na misingi ya kiutawala inayoelekeza jinsi nchi au shirika linavyoongozwa.',
    exampleEn: 'The Constitution of Tanzania establishes three branches of government.',
    exampleSw: 'Katiba ya Tanzania inaanzisha mihimili mitatu ya serikali.',
    pronunciation: 'kon-stih-TOO-shuhn',
    subjectTag: 'Civics'
  },
  {
    id: 'd10',
    english: 'Oxidation',
    swahili: 'Oksidishaji / Mwitikio wa Oksijeni',
    category: 'Science',
    definitionEn: 'The process or result of oxidizing or being oxidized; loss of electrons during a chemical reaction.',
    definitionSw: 'Mwitikio wa kikemia ambapo elementi au kampaundi huongezewa oksijeni au kupoteza elektroni (kama vile kutu kwenye chuma).',
    exampleEn: 'Rusting of iron is a common example of slow oxidation.',
    exampleSw: 'Kushika kutu kwa chuma ni mfano halisi wa mchakato wa oksidishaji.',
    pronunciation: 'ok-sih-DAY-shuhn',
    subjectTag: 'Chemistry'
  },
  {
    id: 'd11',
    english: 'Quadratic Equation',
    swahili: 'Mlinganyo wa Shahada ya Pili',
    category: 'Mathematics',
    definitionEn: 'An equation where the highest exponent of the variable is two (e.g. ax² + bx + c = 0).',
    definitionSw: 'Mlinganyo wa kihisabati ambapo kipeuo cha juu kabisa cha kigezo ni mbili.',
    exampleEn: 'Quadratic equations can be solved using factoring or the quadratic formula.',
    exampleSw: 'Mlinganyo wa shahada ya pili unaweza kutatuliwa kwa njia ya mambo au kanuni ya jumla.',
    pronunciation: 'kwod-RAT-ik ih-KWAY-zhuhn',
    subjectTag: 'Mathematics'
  },
  {
    id: 'd12',
    english: 'Refinement',
    swahili: 'Uboreshaji / Usafishaji',
    category: 'Languages',
    definitionEn: 'The improvement or clarification of something by making small changes.',
    definitionSw: 'Hatua ya kusafisha, kuboresha au kufanya wazo au insha iwe nadhifu zaidi.',
    exampleEn: 'Essay refinement improves vocabulary and clarity before submission.',
    exampleSw: 'Uboreshaji wa insha huongeza msamiati na uwazi kabla ya kukabidhi kazi.',
    pronunciation: 'rih-FYNE-muhnt',
    subjectTag: 'English'
  }
];

export const Dictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'search' | 'flashcards'>('search');
  const [flashCardIndex, setFlashCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<DictTerm | null>(DICTIONARY_DATA[0]);

  const categories = ['ALL', 'Science', 'Mathematics', 'Social Studies', 'ICT & Tech', 'Languages'];

  const filteredTerms = useMemo(() => {
    return DICTIONARY_DATA.filter((term) => {
      const matchesCategory = selectedCategory === 'ALL' || term.category === selectedCategory;
      const termSearch = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term.english.toLowerCase().includes(termSearch) ||
        term.swahili.toLowerCase().includes(termSearch) ||
        term.subjectTag.toLowerCase().includes(termSearch) ||
        term.definitionEn.toLowerCase().includes(termSearch);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const speakWord = (text: string, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashCardIndex((prev) => (prev + 1) % filteredTerms.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashCardIndex((prev) => (prev - 1 + filteredTerms.length) % filteredTerms.length);
  };

  const currentFlashcard = filteredTerms[flashCardIndex] || DICTIONARY_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase text-indigo-200 border border-white/20">
            <i className="fa-solid fa-book-bookmark text-yellow-400"></i> Kamusi ya Kitanzania & Vocabulary Builder
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            Swahili & English <span className="text-yellow-400">Academic Dictionary</span>
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium">
            Master scientific terminology, mathematical jargon, and NECTA exam terms in both Kiswahili and English with interactive flashcards and audio pronunciations.
          </p>

          {/* Tab Selection */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-yellow-400 text-indigo-950 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="fa-solid fa-magnifying-glass"></i> Dictionary Search
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
                activeTab === 'flashcards'
                  ? 'bg-yellow-400 text-indigo-950 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="fa-solid fa-clone"></i> Vocabulary Flashcards
            </button>
          </div>
        </div>

        <div className="absolute right-4 bottom-0 opacity-15 hidden lg:block text-[180px] pointer-events-none text-white font-serif">
          <i className="fa-solid fa-spell-check"></i>
        </div>
      </div>

      {activeTab === 'search' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Search & Terms List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search in English or Kiswahili..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 text-xs font-bold text-gray-800 outline-none transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count & Term Cards */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block px-1">
                {filteredTerms.length} Terms Available
              </span>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredTerms.map((term) => {
                  const isSelected = selectedTerm?.id === term.id;
                  return (
                    <div
                      key={term.id}
                      onClick={() => setSelectedTerm(term)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                          : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900">{term.english}</span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                            {term.subjectTag}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
                          {term.swahili}
                        </p>
                      </div>
                      <i className={`fa-solid fa-chevron-right text-xs transition ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-gray-300'}`}></i>
                    </div>
                  );
                })}

                {filteredTerms.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-500 text-xs">
                    No terms found for "{searchTerm}". Try another query!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Selected Term Deep View */}
          <div className="lg:col-span-7">
            {selectedTerm ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm space-y-6 sticky top-24">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                        {selectedTerm.subjectTag} • {selectedTerm.category}
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                      {selectedTerm.english}
                      <button
                        onClick={() => speakWord(selectedTerm.english, 'en-US')}
                        className="w-9 h-9 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm transition"
                        title="Listen to English Pronunciation"
                      >
                        <i className="fa-solid fa-volume-high"></i>
                      </button>
                    </h2>
                    {selectedTerm.pronunciation && (
                      <p className="text-xs text-gray-400 font-mono italic mt-0.5">
                        /{selectedTerm.pronunciation}/
                      </p>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-right">
                    <span className="text-[10px] font-black uppercase text-amber-700 block">Kiswahili Equivalent</span>
                    <span className="text-base font-extrabold text-amber-950">{selectedTerm.swahili}</span>
                  </div>
                </div>

                {/* English Definition */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-book text-indigo-600"></i> English Definition
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {selectedTerm.definitionEn}
                  </p>
                </div>

                {/* Swahili Definition */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-language text-emerald-600"></i> Maelezo kwa Kiswahili
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                    {selectedTerm.definitionSw}
                  </p>
                </div>

                {/* Context & Example Usage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-black uppercase text-indigo-600 block">Example (English)</span>
                    <p className="text-xs text-gray-800 font-medium italic">"{selectedTerm.exampleEn}"</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 block">Mfano (Kiswahili)</span>
                    <p className="text-xs text-gray-800 font-medium italic">"{selectedTerm.exampleSw}"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-dashed border-gray-200">
                Select a word from the left list to view detailed definitions and usage examples.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Flashcards Mode */
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between text-xs font-extrabold text-gray-500 px-2">
            <span>Card {flashCardIndex + 1} of {filteredTerms.length}</span>
            <span className="text-indigo-600">{currentFlashcard.subjectTag}</span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 bg-white rounded-3xl border-2 border-indigo-200 shadow-xl cursor-pointer p-8 flex flex-col justify-between items-center transition-all duration-300 hover:border-indigo-400 relative overflow-hidden group"
          >
            <div className="w-full flex justify-between items-center text-xs text-gray-400">
              <span className="font-mono uppercase font-black">{isFlipped ? 'Answer (Kiswahili & Definition)' : 'Term (English)'}</span>
              <span className="text-indigo-500 font-bold group-hover:scale-110 transition">
                <i className="fa-solid fa-rotate mr-1"></i> Tap to flip
              </span>
            </div>

            {!isFlipped ? (
              <div className="my-auto space-y-3">
                <h3 className="text-3xl font-black text-gray-900">{currentFlashcard.english}</h3>
                <span className="inline-block text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {currentFlashcard.category}
                </span>
              </div>
            ) : (
              <div className="my-auto space-y-3 animate-fade-in">
                <h3 className="text-2xl font-black text-emerald-700">{currentFlashcard.swahili}</h3>
                <p className="text-xs text-gray-600 font-medium max-w-md mx-auto line-clamp-3">
                  {currentFlashcard.definitionSw}
                </p>
              </div>
            )}

            <div className="text-[11px] text-gray-400 font-medium">
              {isFlipped ? currentFlashcard.exampleEn : 'Can you translate this term to Kiswahili?'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handlePrevFlashcard}
              className="px-5 py-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-extrabold text-xs transition flex items-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-arrow-left"></i> Previous Card
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-md shadow-indigo-200"
            >
              <i className="fa-solid fa-rotate"></i> {isFlipped ? 'Show Front' : 'Flip Card'}
            </button>
            <button
              onClick={handleNextFlashcard}
              className="px-5 py-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-extrabold text-xs transition flex items-center gap-2 shadow-sm"
            >
              Next Card <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
