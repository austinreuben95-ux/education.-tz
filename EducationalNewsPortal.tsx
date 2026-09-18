import React, { useState, useMemo } from 'react';

export interface EducationalAnnouncement {
  id: string;
  title: string;
  category: 'TAMISEMI' | 'NECTA' | 'TCU' | 'HESLB' | 'GENERAL';
  publishDate: string;
  badgeText: string;
  badgeColor: string;
  summary: string;
  fullDetails: string;
  officialUrl: string;
  isUrgent?: boolean;
  targetAudience: string;
  verifiedSource: string;
}

export interface ScholarshipListing {
  id: string;
  title: string;
  provider: string;
  level: 'Undergraduate' | 'Postgraduate (Masters)' | 'PhD' | 'Form 6 Graduates';
  coverage: 'Fully Funded' | 'Partial Scholarship' | 'Tuition Waiver';
  location: string;
  deadline: string;
  deadlineTimestamp: number;
  description: string;
  eligibility: string[];
  requiredDocs: string[];
  combinationSuitability: string[];
  applicationUrl: string;
  icon: string;
  badgeColor: string;
  featured?: boolean;
}

const INITIAL_ANNOUNCEMENTS: EducationalAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'TAMISEMI Form 5 & College Selection List Release',
    category: 'TAMISEMI',
    publishDate: 'August 10, 2026',
    badgeText: 'Form 5 Selection Alert',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    summary: 'Official TAMISEMI announcement for Form 4 graduates joining Form 5 government secondary schools and technical colleges.',
    fullDetails: 'TAMISEMI has officially published the Form 5 and College Selection List. All candidates who sat for the CSEE exams can check their allocated schools, combination streams, and reporting dates. Students wishing to request a school or combination transfer can submit their appeal through the official SELFORM TAMISEMI portal.',
    officialUrl: 'https://www.tamisemi.go.tz',
    isUrgent: true,
    targetAudience: 'Form 4 Graduates & Parents',
    verifiedSource: 'President’s Office - TAMISEMI (Dodoma)'
  },
  {
    id: 'ann-2',
    title: 'HESLB Higher Education Loan Allocation: Batch 1 & 2 Released',
    category: 'HESLB',
    publishDate: 'August 08, 2026',
    badgeText: 'Loans Batch Release',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    summary: 'HESLB issues 1st & 2nd batch loan allocations for eligible first-year undergraduate university students.',
    fullDetails: 'The Higher Education Student Loans Board (HESLB) has released the list of successful applicants for the 2026/2027 academic year. Students can log in to their OLAMS (Online Loan Application and Management System) accounts using their Form 4 index numbers to view allocated amounts for Tuition Fees, Meals & Accommodation (MA), Books & Stationery, and Field Practical Training (FPT). An appeal window will open for 7 days.',
    officialUrl: 'https://olas.heslb.go.tz',
    isUrgent: true,
    targetAudience: 'University Applicants & First Year Students',
    verifiedSource: 'HESLB Official Portal'
  },
  {
    id: 'ann-3',
    title: 'TCU University Admission Window - Round 2 Applications Open',
    category: 'TCU',
    publishDate: 'August 05, 2026',
    badgeText: 'TCU Window 2',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    summary: 'Tanzania Commission for Universities opens Round 2 for undergraduate degree applications for Form 6 and Diploma holders.',
    fullDetails: 'TCU announces the opening of the Second Round of Undergraduate Degree Applications. Applicants who were not selected in Round 1 or missed the first deadline are urged to apply directly to accredited universities. TCU advises students to verify cut-off points in the Undergraduate Admission Guidebook before submitting choice lists.',
    officialUrl: 'https://www.tcu.go.tz',
    isUrgent: false,
    targetAudience: 'Form 6 (ACSEE) & Diploma Graduates',
    verifiedSource: 'Tanzania Commission for Universities'
  },
  {
    id: 'ann-4',
    title: 'NECTA ACSEE Form 6 & CSEE Results Statement Directives',
    category: 'NECTA',
    publishDate: 'July 28, 2026',
    badgeText: 'NECTA Official Notice',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    summary: 'NECTA issues official instructions regarding result slip verification, grade appeals, and center index checks.',
    fullDetails: 'The National Examinations Council of Tanzania (NECTA) reminds candidates and headteachers that official result slips and certificates are dispatched directly to exam centers. Candidates seeking re-marking or correction of personal details must submit formal requests through their respective examination centers within 30 days of result publication.',
    officialUrl: 'https://www.necta.go.tz',
    isUrgent: false,
    targetAudience: 'Candidates, Teachers & School Admins',
    verifiedSource: 'NECTA Headquarters (Kawe, Dar es Salaam)'
  },
  {
    id: 'ann-5',
    title: 'TAMISEMI Primary School Std 1 & Pre-Primary Online Registration Portal',
    category: 'TAMISEMI',
    publishDate: 'July 15, 2026',
    badgeText: 'Std 1 Enrolment',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    summary: 'Parents can now pre-register pupils entering Standard 1 and Nursery schools via the TAMISEMI Pre-primary portal.',
    fullDetails: 'TAMISEMI has digitized the primary school enrolment process across all local government authorities (LGAs). Parents and guardians must submit the child’s birth notification certificate and national ID (NIDA) number of parent/guardian.',
    officialUrl: 'https://www.tamisemi.go.tz',
    isUrgent: false,
    targetAudience: 'Parents & Guardians',
    verifiedSource: 'TAMISEMI Local Government Portal'
  }
];

const INITIAL_SCHOLARSHIPS: ScholarshipListing[] = [
  {
    id: 'sch-1',
    title: 'MasterCard Foundation Scholars Program',
    provider: 'MasterCard Foundation',
    level: 'Undergraduate',
    coverage: 'Fully Funded',
    location: 'Makerere, UCT, KNUST & Global Partner Universities',
    deadline: 'September 30, 2026',
    deadlineTimestamp: Date.now() + 86400000 * 48,
    description: 'A transformative, fully-funded scholarship program designed for academically talented young Africans facing socio-economic barriers. Covers tuition, accommodation, books, stipend, flight tickets, and leadership development.',
    eligibility: [
      'Tanzanian citizen aged 28 or under at time of application',
      'Strong academic performance in NECTA CSEE (Form 4) & ACSEE (Form 6)',
      'Demonstrated leadership potential and commitment to community impact',
      'Demonstrated financial need or socio-economic disadvantage'
    ],
    requiredDocs: [
      'NECTA Form 4 (CSEE) & Form 6 (ACSEE) Result Slips / Certificates',
      'National ID / Birth Certificate',
      'Two Letters of Recommendation (Headteacher & Ward Executive)',
      'Personal Motivation Statement / Essay on Community Leadership'
    ],
    combinationSuitability: ['PCM', 'PCB', 'CBG', 'EGM', 'HGL', 'HKL', 'ECA', 'HGK'],
    applicationUrl: 'https://mastercardfdn.org/all/scholars/',
    icon: 'fa-graduation-cap',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    featured: true
  },
  {
    id: 'sch-2',
    title: 'Chevening UK Government Scholarships for Tanzanians',
    provider: 'UK Foreign, Commonwealth & Development Office (FCDO)',
    level: 'Postgraduate (Masters)',
    coverage: 'Fully Funded',
    location: 'United Kingdom (Any UK University)',
    deadline: 'November 05, 2026',
    deadlineTimestamp: Date.now() + 86400000 * 85,
    description: 'Chevening offers fully funded 1-year Master’s degrees at any UK university for outstanding Tanzanian professionals and scholars with leadership potential.',
    eligibility: [
      'Tanzanian citizen returning to Tanzania for a minimum of 2 years after scholarship',
      'Undergraduate degree equivalent to an upper second-class 2:1 honors',
      'Minimum of two years (2,800 hours) work experience (including internships/volunteering)',
      'Apply to 3 eligible UK university courses'
    ],
    requiredDocs: [
      'Bachelor’s Degree Transcript & Certificate',
      'Two Professional / Academic References',
      'Valid International Passport',
      'Four Chevening Leadership & Networking Essays'
    ],
    combinationSuitability: ['All Science & Arts Degree Graduates'],
    applicationUrl: 'https://www.chevening.org/scholarship/tanzania/',
    icon: 'fa-crown',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    featured: true
  },
  {
    id: 'sch-3',
    title: 'Chinese Government Scholarship (CSC) - MOEVT Bilateral Scheme',
    provider: 'China Scholarship Council & Ministry of Education Tanzania (MOEVT)',
    level: 'Undergraduate',
    coverage: 'Fully Funded',
    location: 'Top Chinese Universities (Beijing, Shanghai, Wuhan, Tsinghua)',
    deadline: 'January 20, 2027',
    deadlineTimestamp: Date.now() + 86400000 * 160,
    description: 'Full scholarship covering tuition, free university dormitory accommodation, comprehensive medical insurance, and monthly living allowance (CNY 2,500/month for Bachelors).',
    eligibility: [
      'Tanzanian citizen under 25 years old for Bachelor’s degree',
      'Excellent performance in Form 6 ACSEE (Div 1 or Div 2 strongly preferred)',
      'Pass Physical Foreigner Examination health clearance',
      'Nominated through the Ministry of Education Science and Technology (MOEVT) Dar es Salaam/Dodoma'
    ],
    requiredDocs: [
      'MOEVT Official Application Form',
      'Notarized Form 4 & Form 6 NECTA Certificates',
      'Foreigner Physical Examination Form (Hospital stamped)',
      'Certificate of No Criminal Record (Police Clearance)'
    ],
    combinationSuitability: ['PCM', 'PCB', 'CBG', 'EGM', 'PGM'],
    applicationUrl: 'http://www.campuschina.org',
    icon: 'fa-landmark-flag',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    featured: true
  },
  {
    id: 'sch-4',
    title: 'Tanzania Presidential Special Science Merit Grant (HESLB / MOEVT)',
    provider: 'Government of United Republic of Tanzania',
    level: 'Form 6 Graduates',
    coverage: 'Fully Funded',
    location: 'Tanzanian Universities (UDSM, MUST, SUA, UDOM, DIT)',
    deadline: 'October 15, 2026',
    deadlineTimestamp: Date.now() + 86400000 * 64,
    description: 'Special merit funding scheme for top-performing Form 6 science candidates (PCM, PCB, PGM, CBG) with Division 1 who pursue STEM, Medical, and Engineering fields.',
    eligibility: [
      'Must have Division I in ACSEE Form 6 in Science combination',
      'Admitted to a priority STEM degree (Engineering, Medicine, Computer Science, Biotechnology)',
      'Tanzanian citizen with valid NIDA'
    ],
    requiredDocs: [
      'ACSEE Form 6 NECTA Result Slip',
      'TCU University Admission Confirmation Letter',
      'NIDA Identification Number'
    ],
    combinationSuitability: ['PCM', 'PCB', 'CBG', 'PGM'],
    applicationUrl: 'https://www.moe.go.tz',
    icon: 'fa-award',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    id: 'sch-5',
    title: 'DAAD Scholarships for Development-Related Postgraduate Courses',
    provider: 'DAAD German Academic Exchange Service',
    level: 'Postgraduate (Masters)',
    coverage: 'Fully Funded',
    location: 'Germany & Selected Sub-Saharan African Universities',
    deadline: 'December 10, 2026',
    deadlineTimestamp: Date.now() + 86400000 * 120,
    description: 'Funding for Tanzanian professionals working in public sector or development to complete Master’s or PhD programs with monthly stipend (€934/month), travel allowance, and health insurance.',
    eligibility: [
      'Bachelor’s degree completed within last 6 years',
      'At least 2 years of proven professional experience',
      'Field of study aligned with Sustainable Development Goals (SDGs)'
    ],
    requiredDocs: [
      'DAAD Application Form',
      'Curriculum Vitae (Europass format)',
      'Motivation Letter signed & dated',
      'Academic Transcripts and Certificates'
    ],
    combinationSuitability: ['Environmental Science', 'Engineering', 'Agriculture', 'Public Health'],
    applicationUrl: 'https://www.daad.de/en/',
    icon: 'fa-earth-africa',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    id: 'sch-6',
    title: 'Türkiye Burslari Scholarships for Undergraduate & Graduate',
    provider: 'Government of Türkiye',
    level: 'Undergraduate',
    coverage: 'Fully Funded',
    location: 'Top Universities across Turkey (Istanbul, Ankara, Izmir)',
    deadline: 'February 20, 2027',
    deadlineTimestamp: Date.now() + 86400000 * 190,
    description: 'Includes university placement, full tuition fees, 1-year Turkish language course, accommodation in student dormitories, round-trip flight ticket, and monthly stipend.',
    eligibility: [
      'Under 21 years old for undergraduate programs',
      'Minimum academic criteria: 70% for undergraduate, 90% for Health Sciences (Medicine, Dentistry, Pharmacy)'
    ],
    requiredDocs: [
      'Valid National Passport or ID',
      'NECTA Form 4 & Form 6 Certificates',
      'Recent Passport Photograph'
    ],
    combinationSuitability: ['PCM', 'PCB', 'CBG', 'EGM', 'HGL', 'HKL', 'HGK'],
    applicationUrl: 'https://tbbs.turkiyeburslari.gov.tr',
    icon: 'fa-plane-departure',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  }
];

export const EducationalNewsPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ANNOUNCEMENTS' | 'SCHOLARSHIPS' | 'ELIGIBILITY_CHECKER'>('ANNOUNCEMENTS');
  
  // Announcements filter
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [newsSearch, setNewsSearch] = useState<string>('');
  const [savedAlertIds, setSavedAlertIds] = useState<string[]>([]);
  const [selectedAnnouncementModal, setSelectedAnnouncementModal] = useState<EducationalAnnouncement | null>(null);

  // Scholarships filter
  const [scholarshipSearch, setScholarshipSearch] = useState<string>('');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState<string>('ALL');
  const [selectedCombination, setSelectedCombination] = useState<string>('ALL');
  const [selectedScholarshipModal, setSelectedScholarshipModal] = useState<ScholarshipListing | null>(null);

  // Eligibility Matcher state
  const [userCombo, setUserCombo] = useState<string>('PCM');
  const [userLevel, setUserLevel] = useState<string>('Undergraduate');
  const [userDiv, setUserDiv] = useState<string>('Division I');

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    return INITIAL_ANNOUNCEMENTS.filter(ann => {
      const matchesCategory = selectedCategory === 'ALL' || ann.category === selectedCategory;
      const matchesSearch = 
        ann.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
        ann.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
        ann.targetAudience.toLowerCase().includes(newsSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, newsSearch]);

  // Filtered Scholarships
  const filteredScholarships = useMemo(() => {
    return INITIAL_SCHOLARSHIPS.filter(sch => {
      const matchesLevel = selectedDegreeLevel === 'ALL' || sch.level === selectedDegreeLevel;
      const matchesCombo = selectedCombination === 'ALL' || sch.combinationSuitability.includes('All Science & Arts Degree Graduates') || sch.combinationSuitability.includes(selectedCombination);
      const matchesSearch = 
        sch.title.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
        sch.provider.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
        sch.location.toLowerCase().includes(scholarshipSearch.toLowerCase());
      return matchesLevel && matchesCombo && matchesSearch;
    });
  }, [selectedDegreeLevel, selectedCombination, scholarshipSearch]);

  // Eligibility Match List
  const matchedScholarships = useMemo(() => {
    return INITIAL_SCHOLARSHIPS.filter(sch => {
      const matchCombo = sch.combinationSuitability.includes('All Science & Arts Degree Graduates') || sch.combinationSuitability.includes(userCombo);
      const matchLevel = sch.level === userLevel || (userLevel === 'Undergraduate' && sch.level === 'Form 6 Graduates');
      return matchCombo && matchLevel;
    });
  }, [userCombo, userLevel]);

  const toggleBookmarkAlert = (id: string) => {
    setSavedAlertIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* HERO BANNER SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 border-2 border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              <i className="fa-solid fa-bullhorn text-amber-400 animate-bounce-short"></i>
              <span>Official Tanzanian Education Feed</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Updates, Selection Alerts & <span className="text-amber-400">Scholarship Portal</span> 🇹🇿
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Real-time official announcements from <strong>TAMISEMI, NECTA, TCU, and HESLB</strong> alongside fully-funded local and international scholarships for Tanzanian students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-3 shrink-0">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/30 text-center w-full sm:w-auto">
              <span className="text-2xl font-black text-amber-400 block">{INITIAL_ANNOUNCEMENTS.length}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Alerts</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/30 text-center w-full sm:w-auto">
              <span className="text-2xl font-black text-emerald-400 block">{INITIAL_SCHOLARSHIPS.length}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scholarships Open</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'ANNOUNCEMENTS'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 border-2 border-amber-300'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <i className="fa-solid fa-newspaper text-sm"></i>
            <span>Official Selection & News Feed</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40 text-current font-bold">
              {INITIAL_ANNOUNCEMENTS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('SCHOLARSHIPS')}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'SCHOLARSHIPS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 border-2 border-emerald-300'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <i className="fa-solid fa-graduation-cap text-sm"></i>
            <span>Scholarship Guidance Portal</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40 text-current font-bold">
              {INITIAL_SCHOLARSHIPS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ELIGIBILITY_CHECKER')}
            className={`px-5 py-3 rounded-2xl font-black text-xs transition flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'ELIGIBILITY_CHECKER'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-2 border-indigo-300'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            <i className="fa-solid fa-sliders text-sm"></i>
            <span>Scholarship Matcher & Eligibility</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ANNOUNCEMENTS & SELECTION NEWS FEED */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  placeholder="Search TAMISEMI selection, NECTA results, HESLB loan batches, TCU dates..."
                  className="w-full bg-gray-50 text-gray-900 text-xs font-bold pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider shrink-0">
                  Authority:
                </span>
                {['ALL', 'TAMISEMI', 'NECTA', 'TCU', 'HESLB'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl font-black text-xs transition shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Announcements Feed Grid */}
          {filteredAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map((item) => {
                const isBookmarked = savedAlertIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-indigo-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-5 group relative overflow-hidden"
                  >
                    {item.isUrgent && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Urgent Alert
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-3 py-1 rounded-xl font-black text-[10px] uppercase border ${item.badgeColor}`}>
                          {item.badgeText}
                        </span>

                        <button
                          onClick={() => toggleBookmarkAlert(item.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isBookmarked ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 hover:text-amber-500'
                          }`}
                          title="Bookmark Alert"
                        >
                          <i className={`fa-${isBookmarked ? 'solid' : 'regular'} fa-bookmark text-xs`}></i>
                        </button>
                      </div>

                      <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>

                      <div className="pt-2 border-t border-gray-100 space-y-1 text-[11px] font-bold text-gray-500">
                        <div className="flex items-center gap-1.5 text-indigo-600">
                          <i className="fa-solid fa-building-columns text-[10px]"></i>
                          <span>{item.verifiedSource}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400 font-medium">
                          <span>Target: {item.targetAudience}</span>
                          <span>{item.publishDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedAnnouncementModal(item)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <i className="fa-solid fa-circle-info"></i> Full Bulletin
                      </button>

                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer"
                        title="Open Official Portal"
                      >
                        <span>Portal</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mx-auto">
                <i className="fa-solid fa-newspaper"></i>
              </div>
              <h4 className="font-black text-slate-900 text-base">No Announcements Found</h4>
              <p className="text-xs text-gray-500">Try clearing your search query or selecting another authority filter.</p>
              <button
                onClick={() => { setSelectedCategory('ALL'); setNewsSearch(''); }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: SCHOLARSHIP GUIDANCE PORTAL */}
      {activeTab === 'SCHOLARSHIPS' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filters Bar */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={scholarshipSearch}
                  onChange={(e) => setScholarshipSearch(e.target.value)}
                  placeholder="Search MasterCard Foundation, Chevening UK, Chinese Govt, Turkish Burslari..."
                  className="w-full bg-gray-50 text-gray-900 text-xs font-bold pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Degree:</span>
                  <select
                    value={selectedDegreeLevel}
                    onChange={(e) => setSelectedDegreeLevel(e.target.value)}
                    className="bg-gray-50 text-gray-900 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="ALL">All Degree Levels</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate (Masters)">Masters Degree</option>
                    <option value="Form 6 Graduates">Form 6 Merit Grants</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Combination:</span>
                  <select
                    value={selectedCombination}
                    onChange={(e) => setSelectedCombination(e.target.value)}
                    className="bg-gray-50 text-gray-900 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="ALL">All Combinations</option>
                    <option value="PCM">PCM</option>
                    <option value="PCB">PCB</option>
                    <option value="CBG">CBG</option>
                    <option value="EGM">EGM</option>
                    <option value="HGL">HGL</option>
                    <option value="HKL">HKL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Scholarships List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScholarships.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 relative group"
              >
                {sch.featured && (
                  <span className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-xs">
                    ★ Top Recommendation
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-300 flex items-center justify-center text-xl shrink-0 shadow-md group-hover:scale-105 transition">
                      <i className={`fa-solid ${sch.icon}`}></i>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase border ${sch.badgeColor}`}>
                          {sch.coverage}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {sch.level}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-900 text-lg leading-snug group-hover:text-emerald-600 transition">
                        {sch.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-bold">{sch.provider}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {sch.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <span className="text-[10px] uppercase font-black text-gray-400 block mb-0.5">Location</span>
                      <span className="text-xs font-bold text-gray-800 line-clamp-1">{sch.location}</span>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                      <span className="text-[10px] uppercase font-black text-amber-800 block mb-0.5">Deadline</span>
                      <span className="text-xs font-black text-amber-900">{sch.deadline}</span>
                    </div>
                  </div>

                  {/* Combination tags */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                      Suitable Combinations & Fields:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sch.combinationSuitability.map((cb, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[10px] border border-indigo-100">
                          {cb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedScholarshipModal(sch)}
                    className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-list-check text-amber-300"></i>
                    <span>Requirements & Application Guide</span>
                  </button>

                  <a
                    href={sch.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-200"
                  >
                    <span>Apply Now</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: ELIGIBILITY CHECKER & MATCHING CALCULATOR */}
      {activeTab === 'ELIGIBILITY_CHECKER' && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-black text-[10px] uppercase border border-indigo-200">
                Custom Matching Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Scholarship & Opportunity Matcher
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Select your Form 6 combination and academic level to find exact funding schemes you qualify for.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-gray-200">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase">Combination / Field:</label>
                <select
                  value={userCombo}
                  onChange={(e) => setUserCombo(e.target.value)}
                  className="w-full bg-white text-slate-900 font-bold text-xs p-3 rounded-xl border border-gray-300 focus:border-indigo-600 outline-none"
                >
                  <option value="PCM">PCM (Physics, Chem, Math)</option>
                  <option value="PCB">PCB (Physics, Chem, Bio)</option>
                  <option value="CBG">CBG (Chem, Bio, Geography)</option>
                  <option value="EGM">EGM (Econ, Geog, Math)</option>
                  <option value="HGL">HGL (History, Geog, Language)</option>
                  <option value="HKL">HKL (History, Kiswahili, Lit)</option>
                  <option value="ECA">ECA (Econ, Commerce, Accountancy)</option>
                  <option value="HGK">HGK (History, Geog, Kiswahili)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase">Academic Target:</label>
                <select
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value)}
                  className="w-full bg-white text-slate-900 font-bold text-xs p-3 rounded-xl border border-gray-300 focus:border-indigo-600 outline-none"
                >
                  <option value="Undergraduate">Undergraduate Degree</option>
                  <option value="Postgraduate (Masters)">Master's Degree</option>
                  <option value="Form 6 Graduates">Form 6 Merit Grant</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase">NECTA Grade Tier:</label>
                <select
                  value={userDiv}
                  onChange={(e) => setUserDiv(e.target.value)}
                  className="w-full bg-white text-slate-900 font-bold text-xs p-3 rounded-xl border border-gray-300 focus:border-indigo-600 outline-none"
                >
                  <option value="Division I">Division I (Top Merit)</option>
                  <option value="Division II">Division II</option>
                  <option value="Division III">Division III</option>
                </select>
              </div>
            </div>

            {/* Match Results */}
            <div className="space-y-4 pt-2">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>Found {matchedScholarships.length} Matching Funding Opportunities</span>
              </h4>

              <div className="space-y-4">
                {matchedScholarships.map((mSch) => (
                  <div key={mSch.id} className="p-5 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[9px] uppercase">
                          {mSch.coverage}
                        </span>
                        <span className="text-xs font-bold text-emerald-800">{mSch.provider}</span>
                      </div>
                      <h5 className="font-black text-slate-900 text-base">{mSch.title}</h5>
                      <p className="text-xs text-gray-600">{mSch.location} • Deadline: {mSch.deadline}</p>
                    </div>

                    <a
                      href={mSch.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Apply Now</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT FULL MODAL */}
      {selectedAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase border ${selectedAnnouncementModal.badgeColor}`}>
                  {selectedAnnouncementModal.badgeText}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-snug">{selectedAnnouncementModal.title}</h3>
                <p className="text-xs text-indigo-600 font-bold">{selectedAnnouncementModal.verifiedSource}</p>
              </div>

              <button
                onClick={() => setSelectedAnnouncementModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition shrink-0"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <p className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-slate-900 font-semibold">
                {selectedAnnouncementModal.summary}
              </p>

              <div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-2">Official Directives & Details:</h4>
                <p className="text-gray-600">{selectedAnnouncementModal.fullDetails}</p>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] uppercase font-black text-gray-400 block">Target Audience</span>
                  <span className="font-bold text-slate-800">{selectedAnnouncementModal.targetAudience}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] uppercase font-black text-gray-400 block">Publication Date</span>
                  <span className="font-bold text-slate-800">{selectedAnnouncementModal.publishDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAnnouncementModal(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 font-extrabold text-xs transition"
              >
                Close Bulletin
              </button>
              <a
                href={selectedAnnouncementModal.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-2"
              >
                <span>Launch Official Portal</span>
                <i className="fa-solid fa-external-link"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SCHOLARSHIP REQUIREMENT MODAL */}
      {selectedScholarshipModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase border ${selectedScholarshipModal.badgeColor}`}>
                  {selectedScholarshipModal.coverage}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-snug">{selectedScholarshipModal.title}</h3>
                <p className="text-xs text-emerald-700 font-extrabold">{selectedScholarshipModal.provider}</p>
              </div>

              <button
                onClick={() => setSelectedScholarshipModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition shrink-0"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-slate-700">
              <div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider mb-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-user-check text-emerald-600"></i> Eligibility Criteria:
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {selectedScholarshipModal.eligibility.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2 font-medium">
                      <i className="fa-solid fa-check text-emerald-600 mt-1 text-xs"></i>
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider mb-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-file-shield text-indigo-600"></i> Required Documents Checklist:
                </h4>
                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2">
                  {selectedScholarshipModal.requiredDocs.map((docItem, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-extrabold text-slate-800 text-xs">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                        {idx + 1}
                      </div>
                      <span>{docItem}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedScholarshipModal(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 font-extrabold text-xs transition"
              >
                Close Guide
              </button>
              <a
                href={selectedScholarshipModal.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md shadow-emerald-200"
              >
                <span>Proceed to Application Portal</span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalNewsPortal;
