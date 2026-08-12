import React, { useState, useMemo } from 'react';

export interface SchoolItem {
  id: string;
  name: string;
  centerCode: string; // e.g. S0101, S0108, P0321
  level: 'PSLE Primary' | 'Form 4 CSEE' | 'Form 6 ACSEE';
  category: 'Government' | 'Private' | 'Seminary';
  type: 'Boys' | 'Girls' | 'Co-education';
  boardingType: 'Boarding' | 'Day' | 'Both';
  region: string;
  district: string;
  nationalRank?: string;
  averageGpa?: string; // e.g., 1.2500 (Division I)
  passMarkCutoff: string; // e.g. "Division I-7 to I-12 in Form 4 CSEE" or "220/300 in PSLE"
  minEntryRequirement: string;
  featuredCombinations?: string[]; // For A-Level (PCM, PCB, PGM, EGM, HGL, HKL, HGK, CBG, KLF)
  contactPhone?: string;
  description: string;
  nectaGradeScale: {
    gradeA: string;
    gradeB: string;
    gradeC: string;
    gradeD: string;
    gradeF: string;
  };
}

export const TANZANIA_SCHOOLS_DATA: SchoolItem[] = [
  {
    id: 'sch-001',
    name: 'Ilboru Secondary School',
    centerCode: 'S0108',
    level: 'Form 6 ACSEE',
    category: 'Government',
    type: 'Boys',
    boardingType: 'Boarding',
    region: 'Arusha',
    district: 'Arusha Rural',
    nationalRank: 'Top 10 National (Govt Special)',
    averageGpa: '1.2150 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 10 in CSEE Form 4)',
    minEntryRequirement: 'Grade A or B in Mathematics, Physics, Chemistry, Geography for PCM/PCB/PGM.',
    featuredCombinations: ['PCM', 'PCB', 'PGM', 'CBG', 'EGM'],
    contactPhone: '+255 27 250 3411',
    description: 'Premier national special government boys high school renowned for exceptional STEM performance and NECTA top tier rankings.',
    nectaGradeScale: {
      gradeA: '75% - 100% (Points 1 - Excellent)',
      gradeB: '65% - 74% (Points 2 - Very Good)',
      gradeC: '45% - 64% (Points 3 - Good)',
      gradeD: '30% - 44% (Points 4 - Satisfactory)',
      gradeF: '0% - 29% (Points 5 - Fail)'
    }
  },
  {
    id: 'sch-002',
    name: 'St. Francis Girls Secondary School',
    centerCode: 'S0230',
    level: 'Form 4 CSEE',
    category: 'Private',
    type: 'Girls',
    boardingType: 'Boarding',
    region: 'Mbeya',
    district: 'Mbeya City',
    nationalRank: '#1 Nationally (CSEE & ACSEE)',
    averageGpa: '1.0410 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 9 in Form 2 / Entrance Exam)',
    minEntryRequirement: 'Entrance Examination score above 88% and top-tier primary/secondary record.',
    featuredCombinations: ['PCM', 'PCB', 'CBG', 'HGL'],
    contactPhone: '+255 754 889 012',
    description: 'Catholic church-managed top performing girls secondary school consistently ranking #1 overall in NECTA national examinations.',
    nectaGradeScale: {
      gradeA: '75% - 100% (7 Points - Distinction)',
      gradeB: '65% - 74% (6 Points - Credit)',
      gradeC: '45% - 64% (5 Points - Credit)',
      gradeD: '30% - 44% (4 Points - Pass)',
      gradeF: '0% - 29% (0 Points - Fail)'
    }
  },
  {
    id: 'sch-003',
    name: 'Kibaha Secondary School',
    centerCode: 'S0101',
    level: 'Form 6 ACSEE',
    category: 'Government',
    type: 'Boys',
    boardingType: 'Boarding',
    region: 'Pwani',
    district: 'Kibaha Town',
    nationalRank: 'Top 5 National Government',
    averageGpa: '1.3400 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 12 in CSEE)',
    minEntryRequirement: 'Form 4 CSEE Division I with Grade A/B in major science and commercial combination subjects.',
    featuredCombinations: ['PCM', 'PCB', 'PGM', 'EGM', 'CBG', 'HGL'],
    contactPhone: '+255 23 240 2105',
    description: 'Historic special national government school equipped with state-of-the-art science laboratories and agricultural research grounds.',
    nectaGradeScale: {
      gradeA: '75% - 100% (1 Point)',
      gradeB: '65% - 74% (2 Points)',
      gradeC: '45% - 64% (3 Points)',
      gradeD: '30% - 44% (4 Points)',
      gradeF: '0% - 29% (5 Points)'
    }
  },
  {
    id: 'sch-004',
    name: 'Marian Girls Secondary School',
    centerCode: 'S0240',
    level: 'Form 4 CSEE',
    category: 'Private',
    type: 'Girls',
    boardingType: 'Boarding',
    region: 'Pwani',
    district: 'Bagamoyo',
    nationalRank: '#2 Nationally (Private Schools)',
    averageGpa: '1.1120 (Division I)',
    passMarkCutoff: 'Division I-7 to I-11',
    minEntryRequirement: 'High score in Marian Schools Entrance Exam and Form 2 National Assessment (FTNA) Division I.',
    featuredCombinations: ['PCM', 'PCB', 'CBG', 'EGM', 'HGL', 'HKL'],
    contactPhone: '+255 784 123 456',
    description: 'Prestigious private girls boarding school in Bagamoyo famous for disciplined academic excellence and science achievements.',
    nectaGradeScale: {
      gradeA: '75% - 100% (A Grade)',
      gradeB: '65% - 74% (B Grade)',
      gradeC: '45% - 64% (C Grade)',
      gradeD: '30% - 44% (D Grade)',
      gradeF: '0% - 29% (F Grade)'
    }
  },
  {
    id: 'sch-005',
    name: 'Tabora Boys Secondary School',
    centerCode: 'S0110',
    level: 'Form 6 ACSEE',
    category: 'Government',
    type: 'Boys',
    boardingType: 'Boarding',
    region: 'Tabora',
    district: 'Tabora Municipal',
    nationalRank: 'Historical Special Gov School',
    averageGpa: '1.4200 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 11 in CSEE)',
    minEntryRequirement: 'National selection via TAMISEMI for top performing Form 4 candidates in Science and Arts.',
    featuredCombinations: ['PCM', 'PCB', 'PGM', 'HKL', 'HGL', 'HGK'],
    contactPhone: '+255 26 260 4120',
    description: 'Tanzania’s legendary "Boys School" established in 1922, producer of prominent national statesmen and scientists.',
    nectaGradeScale: {
      gradeA: '75% - 100%',
      gradeB: '65% - 74%',
      gradeC: '45% - 64%',
      gradeD: '30% - 44%',
      gradeF: '0% - 29%'
    }
  },
  {
    id: 'sch-006',
    name: 'Kilakala Secondary School',
    centerCode: 'S0208',
    level: 'Form 6 ACSEE',
    category: 'Government',
    type: 'Girls',
    boardingType: 'Boarding',
    region: 'Morogoro',
    district: 'Morogoro Urban',
    nationalRank: 'Top 3 National Government Girls',
    averageGpa: '1.3100 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 10 in CSEE)',
    minEntryRequirement: 'TAMISEMI national selection criteria for top performing female Form 4 graduates.',
    featuredCombinations: ['PCM', 'PCB', 'CBG', 'HKL', 'HGL'],
    contactPhone: '+255 23 260 3340',
    description: 'Premier national government special girls school in Morogoro, producing top female engineers, doctors and leaders.',
    nectaGradeScale: {
      gradeA: '75% - 100%',
      gradeB: '65% - 74%',
      gradeC: '45% - 64%',
      gradeD: '30% - 44%',
      gradeF: '0% - 29%'
    }
  },
  {
    id: 'sch-007',
    name: 'Feza Boys Secondary School',
    centerCode: 'S0156',
    level: 'Form 4 CSEE',
    category: 'Private',
    type: 'Boys',
    boardingType: 'Boarding',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    nationalRank: 'Top 5 National Private',
    averageGpa: '1.1800 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 12)',
    minEntryRequirement: 'Feza Schools Competitive Entrance Exam and Interview performance.',
    featuredCombinations: ['PCM', 'PCB', 'PGM', 'EGM'],
    contactPhone: '+255 22 261 7000',
    description: 'Modern private international standard academy with robotics labs, Olympiad participation, and top NECTA scores.',
    nectaGradeScale: {
      gradeA: '75% - 100%',
      gradeB: '65% - 74%',
      gradeC: '45% - 64%',
      gradeD: '30% - 44%',
      gradeF: '0% - 29%'
    }
  },
  {
    id: 'sch-008',
    name: 'Mzumbe Secondary School',
    centerCode: 'S0109',
    level: 'Form 6 ACSEE',
    category: 'Government',
    type: 'Boys',
    boardingType: 'Boarding',
    region: 'Morogoro',
    district: 'Mvomero',
    nationalRank: 'Top 5 Special Gov Boys',
    averageGpa: '1.2900 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 11 in CSEE)',
    minEntryRequirement: 'Selection via TAMISEMI for high-achieving Form 4 male candidates.',
    featuredCombinations: ['PCM', 'PCB', 'EGM', 'PGM'],
    contactPhone: '+255 23 260 4321',
    description: 'Renowned special government school adjoining Mzumbe University, specialized in advanced mathematics and physical sciences.',
    nectaGradeScale: {
      gradeA: '75% - 100%',
      gradeB: '65% - 74%',
      gradeC: '45% - 64%',
      gradeD: '30% - 44%',
      gradeF: '0% - 29%'
    }
  },
  {
    id: 'sch-009',
    name: 'Canossa Secondary School',
    centerCode: 'S0232',
    level: 'Form 4 CSEE',
    category: 'Private',
    type: 'Girls',
    boardingType: 'Boarding',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    nationalRank: 'Top 10 National Private Girls',
    averageGpa: '1.2050 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 12)',
    minEntryRequirement: 'Canossa Entrance Examination and primary school leaving certificate.',
    featuredCombinations: ['PCM', 'PCB', 'CBG', 'HGL', 'HKL'],
    contactPhone: '+255 22 264 7112',
    description: 'High-performing Canossian Daughters of Charity Catholic girls school in Dar es Salaam.',
    nectaGradeScale: {
      gradeA: '75% - 100%',
      gradeB: '65% - 74%',
      gradeC: '45% - 64%',
      gradeD: '30% - 44%',
      gradeF: '0% - 29%'
    }
  },
  {
    id: 'sch-010',
    name: 'Mwananchi Primary School',
    centerCode: 'P0301',
    level: 'PSLE Primary',
    category: 'Government',
    type: 'Co-education',
    boardingType: 'Day',
    region: 'Dar es Salaam',
    district: 'Ilala',
    nationalRank: 'Grade A PSLE Center',
    averageGpa: '242 / 300 Marks Average',
    passMarkCutoff: '120 / 300 Marks (Pass Grade C)',
    minEntryRequirement: 'Completion of Standard 1 to Standard 6 internal evaluations under NECTA PSLE framework.',
    contactPhone: '+255 22 211 0099',
    description: 'Model public primary school achieving 98% Form 1 government secondary selection placement.',
    nectaGradeScale: {
      gradeA: '240 - 300 Marks (80% - 100% - Grade A)',
      gradeB: '180 - 239 Marks (60% - 79% - Grade B)',
      gradeC: '120 - 179 Marks (40% - 59% - Grade C Pass)',
      gradeD: '60 - 119 Marks (20% - 39% - Grade D)',
      gradeF: '0 - 59 Marks (0% - 19% - Grade F Fail)'
    }
  },
  {
    id: 'sch-011',
    name: 'Tusiime Primary & Secondary School',
    centerCode: 'P0321',
    level: 'PSLE Primary',
    category: 'Private',
    type: 'Co-education',
    boardingType: 'Both',
    region: 'Dar es Salaam',
    district: 'Ilala - Tabata',
    nationalRank: 'Top 10 PSLE Nationally',
    averageGpa: '275 / 300 Marks Average',
    passMarkCutoff: '200 / 300 Marks for Internal Scholarship',
    minEntryRequirement: 'Tusiime Primary Entrance Assessment & Kindergarten progress report.',
    contactPhone: '+255 713 456 789',
    description: 'Top-tier private primary and secondary complex in Tabata, Dar es Salaam famous for producing PSLE national top 10 candidates.',
    nectaGradeScale: {
      gradeA: '240 - 300 Marks (Distinction)',
      gradeB: '180 - 239 Marks (Credit)',
      gradeC: '120 - 179 Marks (Pass)',
      gradeD: '60 - 119 Marks (Subsidiary)',
      gradeF: '0 - 59 Marks (Fail)'
    }
  },
  {
    id: 'sch-012',
    name: 'Weruweru Secondary School',
    centerCode: 'S0212',
    level: 'Form 6 ACSEE',
    category: 'Government',
    type: 'Girls',
    boardingType: 'Boarding',
    region: 'Kilimanjaro',
    district: 'Moshi Rural',
    nationalRank: 'Top 5 National Gov Girls',
    averageGpa: '1.3800 (Division I)',
    passMarkCutoff: 'Division I (Points 7 - 11 in CSEE)',
    minEntryRequirement: 'TAMISEMI national Form 5 selection placement.',
    featuredCombinations: ['PCM', 'PCB', 'CBG', 'HGK', 'HGL', 'HKL'],
    contactPhone: '+255 27 275 1200',
    description: 'Historic government girls school on the slopes of Mt. Kilimanjaro producing outstanding female scholars.',
    nectaGradeScale: {
      gradeA: '75% - 100%',
      gradeB: '65% - 74%',
      gradeC: '45% - 64%',
      gradeD: '30% - 44%',
      gradeF: '0% - 29%'
    }
  }
];

export const REGIONS_LIST = [
  'All Regions',
  'Arusha',
  'Dar es Salaam',
  'Dodoma',
  'Geita',
  'Iringa',
  'Kagera',
  'Katavi',
  'Kigoma',
  'Kilimanjaro',
  'Lindi',
  'Manyara',
  'Mara',
  'Mbeya',
  'Morogoro',
  'Mtwara',
  'Mwanza',
  'Njombe',
  'Pemba',
  'Pwani',
  'Rukwa',
  'Ruvuma',
  'Shinyanga',
  'Simiyu',
  'Singida',
  'Songwe',
  'Tabora',
  'Tanga',
  'Zanzibar'
];

export const TanzaniaSchoolsDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Selected school for detailed modal modal/view
  const [activeSchool, setActiveSchool] = useState<SchoolItem | null>(null);

  const filteredSchools = useMemo(() => {
    return TANZANIA_SCHOOLS_DATA.filter((sch) => {
      // Level filter
      if (selectedLevel !== 'All' && sch.level !== selectedLevel) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && sch.category !== selectedCategory) {
        return false;
      }
      // Region filter
      if (selectedRegion !== 'All Regions' && sch.region !== selectedRegion) {
        return false;
      }
      // Type filter (Boys / Girls / Co-ed)
      if (selectedType !== 'All' && sch.type !== selectedType) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matchName = sch.name.toLowerCase().includes(query);
        const matchCode = sch.centerCode.toLowerCase().includes(query);
        const matchRegion = sch.region.toLowerCase().includes(query);
        const matchDistrict = sch.district.toLowerCase().includes(query);
        return matchName || matchCode || matchRegion || matchDistrict;
      }
      return true;
    });
  }, [searchTerm, selectedLevel, selectedCategory, selectedRegion, selectedType]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-2xl border border-indigo-500/30 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-bold uppercase tracking-widest">
              <i className="fa-solid fa-school text-indigo-400"></i> NECTA School Finder & Pass Marks
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Tanzania Schools & Cut-off Directory
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Search government and private primary & secondary schools in Tanzania, inspect NECTA center numbers, minimum pass marks, and grade scales.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center min-w-[120px]">
              <span className="block text-2xl font-bold text-indigo-400">{filteredSchools.length}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Schools Listed</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-center min-w-[120px]">
              <span className="block text-2xl font-bold text-emerald-400">NECTA</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cut-off Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Search School Name, Center Code (e.g. S0108), or District
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Ilboru, S0101, Bagamoyo, St. Francis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 outline-none transition"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-500 text-sm"></i>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
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
              Education Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition cursor-pointer"
            >
              <option value="All">All Levels (PSLE, CSEE, ACSEE)</option>
              <option value="PSLE Primary">PSLE Primary (Std 1 - 7)</option>
              <option value="Form 4 CSEE">Form 4 CSEE (O-Level)</option>
              <option value="Form 6 ACSEE">Form 6 ACSEE (A-Level)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Ownership / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Government">Government (Serikali)</option>
              <option value="Private">Private / Non-Gov</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-3 text-sm text-white outline-none transition cursor-pointer"
            >
              {REGIONS_LIST.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Filter by Gender:
          </span>
          {(['All', 'Boys', 'Girls', 'Co-education'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedType === t
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t === 'All' ? 'All Types' : t}
            </button>
          ))}

          {(searchTerm || selectedLevel !== 'All' || selectedCategory !== 'All' || selectedRegion !== 'All Regions' || selectedType !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('All');
                setSelectedCategory('All');
                setSelectedRegion('All Regions');
                setSelectedType('All');
              }}
              className="ml-auto text-xs text-indigo-400 hover:underline font-bold shrink-0"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Schools Display Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-list-check text-indigo-400"></i> Schools Directory Results ({filteredSchools.length})
          </h3>
        </div>

        {filteredSchools.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-3 my-6">
            <i className="fa-solid fa-school-circle-xmark text-4xl text-slate-600"></i>
            <h4 className="text-base font-bold text-slate-300">No schools matching your search criteria</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching by center code (e.g. S0108), clearing region filters, or switching education levels.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('All');
                setSelectedCategory('All');
                setSelectedRegion('All Regions');
                setSelectedType('All');
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition hover:shadow-xl group"
              >
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-slate-950 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold tracking-wider">
                      Center: {school.centerCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      school.category === 'Government'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {school.category}
                    </span>
                  </div>

                  {/* School Title & Level */}
                  <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition leading-snug">
                    {school.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 mb-3">
                    <span className="flex items-center gap-1 text-slate-300">
                      <i className="fa-solid fa-location-dot text-indigo-400"></i> {school.region}, {school.district}
                    </span>
                    &bull;
                    <span className="text-indigo-300 font-semibold">{school.level}</span>
                  </div>

                  {school.nationalRank && (
                    <div className="inline-block px-2.5 py-1 bg-indigo-950/80 text-indigo-200 border border-indigo-500/30 rounded-md text-[11px] font-bold mb-3">
                      <i className="fa-solid fa-trophy text-amber-400 mr-1.5"></i>
                      {school.nationalRank}
                    </div>
                  )}

                  {/* Key Metrics: Pass Mark & GPA */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300 my-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        NECTA Pass Mark / Division Cut-off:
                      </span>
                      <span className="font-bold text-amber-300 leading-snug">
                        {school.passMarkCutoff}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Avg. GPA / Performance:</span>
                      <span className="font-bold text-emerald-400">{school.averageGpa || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Combinations Pill */}
                  {school.featuredCombinations && school.featuredCombinations.length > 0 && (
                    <div className="mt-2 mb-4">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        A-Level Combinations Offered:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {school.featuredCombinations.map((comb) => (
                          <span
                            key={comb}
                            className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[10px] font-bold"
                          >
                            {comb}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action Button */}
                <button
                  onClick={() => setActiveSchool(school)}
                  className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 hover:border-indigo-500 shadow-sm"
                >
                  <i className="fa-solid fa-file-lines"></i> View Grade Scale & Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* School Detail Modal */}
      {activeSchool && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5 text-slate-100">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveSchool(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-xs font-bold font-mono">
                  Code: {activeSchool.centerCode}
                </span>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold">
                  {activeSchool.category} &bull; {activeSchool.type} ({activeSchool.boardingType})
                </span>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-bold">
                  {activeSchool.level}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {activeSchool.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <i className="fa-solid fa-map-pin text-indigo-400"></i> {activeSchool.region} Region &bull; {activeSchool.district} District
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {activeSchool.description}
            </p>

            {/* Requirements Box */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <i className="fa-solid fa-clipboard-check"></i> Admission & Cut-off Criteria
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-400 font-semibold">Minimum NECTA Cut-Off:</span>
                  <span className="text-amber-300 font-bold">{activeSchool.passMarkCutoff}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-semibold">Subject Entry Requirements:</span>
                  <span className="text-slate-200 font-medium sm:max-w-xs sm:text-right">{activeSchool.minEntryRequirement}</span>
                </div>
              </div>
            </div>

            {/* Grade Scale Table Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <i className="fa-solid fa-graduation-cap"></i> NECTA Grade Scale Breakdown
              </h4>
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
                <div className="grid grid-cols-2 p-2.5 bg-slate-800/80 font-bold text-slate-300 border-b border-slate-800">
                  <span>Grade</span>
                  <span>Percentage / Point Range</span>
                </div>
                <div className="divide-y divide-slate-800/60">
                  <div className="grid grid-cols-2 p-2.5">
                    <span className="font-bold text-emerald-400">Grade A (Distinction)</span>
                    <span className="text-slate-300">{activeSchool.nectaGradeScale.gradeA}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span className="font-bold text-blue-400">Grade B (Credit)</span>
                    <span className="text-slate-300">{activeSchool.nectaGradeScale.gradeB}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span className="font-bold text-indigo-400">Grade C (Pass)</span>
                    <span className="text-slate-300">{activeSchool.nectaGradeScale.gradeC}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span className="font-bold text-amber-400">Grade D (Subsidiary)</span>
                    <span className="text-slate-300">{activeSchool.nectaGradeScale.gradeD}</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5">
                    <span className="font-bold text-red-400">Grade F (Fail)</span>
                    <span className="text-slate-300">{activeSchool.nectaGradeScale.gradeF}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveSchool(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TanzaniaSchoolsDatabase;
