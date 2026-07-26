import React, { useState } from 'react';
import { ShareProgressModal } from './ShareProgressModal';

export interface AdmissionSchool {
  name: string;
  category: 'Special National' | 'National Boarding' | 'Top Private' | 'Public University' | 'Private University' | 'Diploma College';
  location: string;
  minRequirement: string;
  matchScore: number; // 0 - 100%
  description: string;
  popularPrograms?: string[];
  badgeColor?: string;
}

export const SchoolAdmissionPredictor: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<'PSLE' | 'CSEE' | 'ACSEE' | 'UNIVERSITY'>('CSEE');

  // PSLE State (Primary)
  const [psleScore, setPsleScore] = useState<number>(88); // Average % out of 100

  // CSEE State (O-Level Form 4)
  const [cseeMath, setCseeMath] = useState<number>(1); // 1=A, 2=B, 3=C, 4=D, 5=F
  const [cseePhysics, setCseePhysics] = useState<number>(1);
  const [cseeChemistry, setCseeChemistry] = useState<number>(2);
  const [cseeBiology, setCseeBiology] = useState<number>(2);
  const [cseeEnglish, setCseeEnglish] = useState<number>(2);
  const [cseeKiswahili, setCseeKiswahili] = useState<number>(1);
  const [cseeCivics, setCseeCivics] = useState<number>(2);

  // ACSEE State (A-Level Form 6)
  const [acseeSub1, setAcseeSub1] = useState<number>(1); // 1=A(1 pt), 2=B(2 pt), 3=C(3 pt), 4=D(4 pt), 5=E(5 pt), 6=S(6 pt), 7=F(7 pt)
  const [acseeSub2, setAcseeSub2] = useState<number>(2);
  const [acseeSub3, setAcseeSub3] = useState<number>(2);
  const [selectedCombo, setSelectedCombo] = useState<string>('PCM');

  // University GPA State
  const [gpaValue, setGpaValue] = useState<number>(3.8);

  // Share Modal State
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Calculate CSEE Points & Division
  const cseeGrades = [cseeMath, cseePhysics, cseeChemistry, cseeBiology, cseeEnglish, cseeKiswahili, cseeCivics];
  const sortedCsee = [...cseeGrades].sort((a, b) => a - b);
  const cseeBest7Sum = sortedCsee.slice(0, 7).reduce((acc, curr) => acc + curr, 0);

  let cseeDivision = 'Division I';
  if (cseeBest7Sum <= 17) cseeDivision = 'Division I';
  else if (cseeBest7Sum <= 21) cseeDivision = 'Division II';
  else if (cseeBest7Sum <= 25) cseeDivision = 'Division III';
  else if (cseeBest7Sum <= 32) cseeDivision = 'Division IV';
  else cseeDivision = 'Division0 (Fail)';

  // Calculate ACSEE Points & Division
  const acseePoints = acseeSub1 + acseeSub2 + acseeSub3;
  let acseeDivision = 'Division I';
  if (acseePoints <= 9) acseeDivision = 'Division I';
  else if (acseePoints <= 12) acseeDivision = 'Division II';
  else if (acseePoints <= 15) acseeDivision = 'Division III';
  else if (acseePoints <= 17) acseeDivision = 'Division IV';
  else acseeDivision = 'Division0';

  // Grade helpers
  const getGradeLetter = (val: number) => {
    switch (val) {
      case 1: return 'A';
      case 2: return 'B';
      case 3: return 'C';
      case 4: return 'D';
      case 5: return 'E';
      case 6: return 'S';
      case 7: return 'F';
      default: return 'C';
    }
  };

  // Build Schools List based on selected level & score
  const getPredictedSchools = (): AdmissionSchool[] => {
    if (activeLevel === 'PSLE') {
      if (psleScore >= 88) {
        return [
          {
            name: 'Ilboru Secondary School',
            category: 'Special National',
            location: 'Arusha',
            minRequirement: 'PSLE 88%+ (Grade A in Math & Science)',
            matchScore: 98,
            description: 'Tanzania Premier Boys Special National School renowned for producing top scientists and engineers.',
            badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          },
          {
            name: 'Tabora Boys & Tabora Girls Secondary',
            category: 'Special National',
            location: 'Tabora',
            minRequirement: 'PSLE 85%+',
            matchScore: 96,
            description: 'Historic Special National Schools with outstanding academic track records in national exams.',
            badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          },
          {
            name: 'St. Francis Girls Secondary',
            category: 'Top Private',
            location: 'Mbeya',
            minRequirement: 'PSLE 90%+ & Entrance Interview',
            matchScore: 95,
            description: '#1 Consistently Ranked Secondary School in Tanzania CSEE National Examinations.',
            badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
          },
          {
            name: 'Kilakala & Msalato Secondary Schools',
            category: 'Special National',
            location: 'Morogoro / Dodoma',
            minRequirement: 'PSLE 84%+',
            matchScore: 92,
            description: 'Premier Government Girls Special Talent Schools with dedicated science laboratories and dormitories.',
            badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
          },
          {
            name: 'Marian Boys & Marian Girls High School',
            category: 'Top Private',
            location: 'Bagamoyo, Pwani',
            minRequirement: 'PSLE 82%+',
            matchScore: 90,
            description: 'Top-tier private academy with state-of-the-art STEM facilities and holistic discipline.',
            badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
          }
        ];
      } else if (psleScore >= 70) {
        return [
          {
            name: 'Azania & Jangwani Secondary Schools',
            category: 'National Boarding',
            location: 'Dar es Salaam',
            minRequirement: 'PSLE 70% - 84%',
            matchScore: 92,
            description: 'Prestigious city center secondary schools with strong academic traditions.',
            badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
          },
          {
            name: 'Dodoma & Weruweru Secondary Schools',
            category: 'National Boarding',
            location: 'Dodoma / Kilimanjaro',
            minRequirement: 'PSLE 68% - 82%',
            matchScore: 89,
            description: 'Established government national boarding secondary schools.',
            badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
          },
          {
            name: 'Minaki & Pugu Secondary Schools',
            category: 'National Boarding',
            location: 'Pwani / Dar es Salaam',
            minRequirement: 'PSLE 65% - 78%',
            matchScore: 85,
            description: 'Renowned secondary schools with vibrant sports and science clubs.',
            badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
          }
        ];
      } else {
        return [
          {
            name: 'Regional Ward Secondary Schools (Shule za Kata)',
            category: 'National Boarding',
            location: 'All Districts in Tanzania',
            minRequirement: 'PSLE 50%+',
            matchScore: 88,
            description: 'Community public secondary schools offering standard NECTA Form 1 - 4 curriculum.',
            badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
          },
          {
            name: 'VETA Vocational Technical Training Centers',
            category: 'Diploma College',
            location: 'All Regions',
            minRequirement: 'PSLE Completion',
            matchScore: 95,
            description: 'Hands-on practical skills in mechanics, electrical installation, ICT, and tailoring.',
            badgeColor: 'bg-slate-100 text-slate-900 border-slate-300'
          }
        ];
      }
    }

    if (activeLevel === 'CSEE') {
      if (cseeBest7Sum <= 14) {
        return [
          {
            name: 'Ilboru, Mzumbe & Kibaha High Schools',
            category: 'Special National',
            location: 'Arusha / Morogoro / Pwani',
            minRequirement: 'Division I (Points 7 - 12) + A/B in Math & Physics',
            matchScore: 99,
            description: 'Qualify for top STEM High School Combinations: PCM, PCB, PGM, CBG.',
            popularPrograms: ['PCM (Physics, Chem, Math)', 'PCB (Physics, Chem, Bio)', 'PGM (Physics, Geog, Math)'],
            badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          },
          {
            name: 'Kilakala, Tabora Girls & St. Francis A-Level',
            category: 'Special National',
            location: 'Morogoro / Tabora / Mbeya',
            minRequirement: 'Division I (Points 7 - 13)',
            matchScore: 97,
            description: 'Top-tier A-Level girls high schools for Medicine and Engineering preparation.',
            popularPrograms: ['PCB', 'PCM', 'CBG', 'EGM'],
            badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          },
          {
            name: 'Dar es Salaam Institute of Technology (DIT)',
            category: 'Diploma College',
            location: 'Dar es Salaam',
            minRequirement: 'Division I/II with Credit C in Math & Physics',
            matchScore: 95,
            description: 'Ordinary Diploma in Computer Engineering, Civil Engineering, or Telecommunications.',
            popularPrograms: ['Diploma in Computer Engineering', 'Diploma in Electronics & Telecom'],
            badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
          }
        ];
      } else if (cseeBest7Sum <= 21) {
        return [
          {
            name: 'Azania, Pugu, Minaki & Moshi Technical High Schools',
            category: 'National Boarding',
            location: 'Dar es Salaam / Kilimanjaro',
            minRequirement: 'Division I/II (Points 14 - 21)',
            matchScore: 90,
            description: 'Qualify for High School Arts & Commercial Combos: EGM, HGL, HKL, HGE, ECA.',
            popularPrograms: ['EGM (Econ, Geog, Math)', 'HGL (Hist, Geog, Lang)', 'HKL (Hist, Kisw, Lit)'],
            badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
          },
          {
            name: 'Mbeya University of Science & Technology (MUST)',
            category: 'Public University',
            location: 'Mbeya',
            minRequirement: 'Division II / III with passes in Science',
            matchScore: 88,
            description: 'Diploma in Architecture, Information Technology, or Highway Engineering.',
            popularPrograms: ['Diploma in Architecture', 'Diploma in IT'],
            badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
          }
        ];
      } else {
        return [
          {
            name: 'Institute of Finance Management (IFM) & TIA',
            category: 'Diploma College',
            location: 'Dar es Salaam / Mwanza / Dodoma',
            minRequirement: 'Division III / IV with passes in English & Commerce',
            matchScore: 86,
            description: 'Diploma in Banking, Accountancy, Procurement & IT.',
            popularPrograms: ['Diploma in Accountancy', 'Diploma in Business Administration'],
            badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
          },
          {
            name: 'Health & Medical Diploma Colleges (Ministry of Health)',
            category: 'Diploma College',
            location: 'National Health Training Colleges',
            minRequirement: 'Passes in Biology & Chemistry',
            matchScore: 84,
            description: 'Diploma in Clinical Medicine, Nursing, Midwifery & Pharmacy.',
            popularPrograms: ['Diploma in Nursing', 'Diploma in Clinical Medicine'],
            badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }
        ];
      }
    }

    if (activeLevel === 'ACSEE') {
      if (acseePoints <= 7) { // 3 - 7 points (AAA to BBC)
        return [
          {
            name: 'University of Dar es Salaam (UDSM)',
            category: 'Public University',
            location: 'Dar es Salaam (Mlimani Campus)',
            minRequirement: 'ACSEE Points 3 - 6 (AAA - AAB)',
            matchScore: 99,
            description: 'Qualify for top flagship programs: Doctor of Medicine (MD), Bachelor of Laws (LLB), BSc Civil/Electrical Engineering, Computer Science.',
            popularPrograms: ['Doctor of Medicine (MD)', 'Bachelor of Laws (LLB)', 'BSc Computer Science', 'BSc Civil Engineering'],
            badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          },
          {
            name: 'Muhimbili University of Health & Allied Sciences (MUHAS)',
            category: 'Public University',
            location: 'Dar es Salaam',
            minRequirement: 'ACSEE Points 3 - 6 in PCB (Physics, Chem, Bio)',
            matchScore: 98,
            description: 'Tanzania premier medical university for Doctors, Pharmacists, and Dental Surgeons.',
            popularPrograms: ['Doctor of Medicine (MD)', 'Bachelor of Pharmacy (BPharm)', 'Bachelor of Dental Surgery (BDS)'],
            badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
          },
          {
            name: 'Sokoine University of Agriculture (SUA)',
            category: 'Public University',
            location: 'Morogoro',
            minRequirement: 'ACSEE Points 4 - 8 in PCB / CBG',
            matchScore: 96,
            description: 'Top East African university for Veterinary Medicine, Biotechnology, and Agricultural Engineering.',
            popularPrograms: ['Bachelor of Veterinary Medicine', 'BSc Biotechnology', 'BSc Environmental Sciences'],
            badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
          },
          {
            name: 'Ardhi University (ARU)',
            category: 'Public University',
            location: 'Dar es Salaam',
            minRequirement: 'ACSEE Points 4 - 8 in PCM / PGM',
            matchScore: 95,
            description: 'Specialized university for Architecture, Urban Planning, and Geomatics Engineering.',
            popularPrograms: ['Bachelor of Architecture', 'BSc Geomatics', 'BSc Real Estate Finance'],
            badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
          }
        ];
      } else if (acseePoints <= 12) {
        return [
          {
            name: 'University of Dodoma (UDOM)',
            category: 'Public University',
            location: 'Dodoma',
            minRequirement: 'ACSEE Points 7 - 12 (Division I / II)',
            matchScore: 92,
            description: 'Largest campus in East Africa offering Computer Science, Mining Engineering, Business, and Education degrees.',
            popularPrograms: ['BSc Cyber Security', 'BSc Mining Engineering', 'Bachelor of Commerce'],
            badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
          },
          {
            name: 'Mzumbe University',
            category: 'Public University',
            location: 'Morogoro',
            minRequirement: 'ACSEE Points 7 - 11 in EGM / HGE / ECA',
            matchScore: 90,
            description: 'Renowned center of excellence in Economics, Public Administration, and Accountancy.',
            popularPrograms: ['BSc Economics', 'Bachelor of Public Administration', 'BSc Accounting & Finance'],
            badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
          },
          {
            name: 'KCMC & Bugando University Colleges',
            category: 'Private University',
            location: 'Moshi / Mwanza',
            minRequirement: 'ACSEE Points 6 - 10 in PCB',
            matchScore: 88,
            description: 'Leading medical teaching centers for Doctor of Medicine and Medical Laboratory Sciences.',
            popularPrograms: ['Doctor of Medicine', 'BSc Nursing'],
            badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
          }
        ];
      } else {
        return [
          {
            name: 'St. Augustine University of Tanzania (SAUT) & RuCU',
            category: 'Private University',
            location: 'Mwanza / Iringa',
            minRequirement: 'ACSEE Points 11 - 15 (2 Principal Passes)',
            matchScore: 86,
            description: 'Degrees in Mass Communication, Law, Education, and Business Administration.',
            popularPrograms: ['BA Mass Communication', 'Bachelor of Education'],
            badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
          },
          {
            name: 'Open University of Tanzania (OUT)',
            category: 'Public University',
            location: 'All Regional Centers',
            minRequirement: '2 Principal Passes or Foundation Diploma',
            matchScore: 95,
            description: 'Flexible distance learning degree programs tailored for working adults and self-paced students.',
            popularPrograms: ['Bachelor of Arts in General Studies', 'Bachelor of Business Administration'],
            badgeColor: 'bg-slate-100 text-slate-900 border-slate-300'
          }
        ];
      }
    }

    // UNIVERSITY GPA LEVEL
    if (gpaValue >= 4.4) {
      return [
        {
          name: 'Global Master\'s Scholarships (Commonwealth & Chevening)',
          category: 'Public University',
          location: 'UK, Germany, USA, Japan',
          minRequirement: 'First Class Honours (GPA 4.4 - 5.0)',
          matchScore: 99,
          description: 'Fully funded Master\'s & PhD scholarships at Oxford, Cambridge, Harvard, and DAAD Germany.',
          popularPrograms: ['MSc Data Science', 'Master of Public Health', 'MSc Renewable Energy'],
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        },
        {
          name: 'University Tutorial Assistantship (TA Position)',
          category: 'Public University',
          location: 'UDSM, MUHAS, SUA, UDOM',
          minRequirement: 'First Class Honours + Department Recommendation',
          matchScore: 96,
          description: 'Direct employment as Assistant Lecturer with full University scholarship sponsorship for Master\'s & PhD.',
          badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
        }
      ];
    } else if (gpaValue >= 3.5) {
      return [
        {
          name: 'Direct Master\'s Admission (UDSM, MUHAS, SUA)',
          category: 'Public University',
          location: 'Dar es Salaam / Morogoro',
          minRequirement: 'Upper Second Class (GPA 3.5 - 4.3)',
          matchScore: 94,
          description: 'Direct admission into Master of Science, MBA, LLM, or MSc Engineering degree programs.',
          popularPrograms: ['Master of Business Administration (MBA)', 'MSc Engineering', 'LLM Corporate Law'],
          badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
        },
        {
          name: 'Professional Registration Boards (ERB, CPA NBAA, PSPTB)',
          category: 'Public University',
          location: 'National Professional Bodies',
          minRequirement: 'Degree Completion with GPA ≥ 3.0',
          matchScore: 95,
          description: 'Eligible for Graduate Engineer Registration (ERB), CPA Professional Exams (NBAA), or Medical Board Internship.',
          badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
        }
      ];
    } else {
      return [
        {
          name: 'Postgraduate Diploma & Executive Certificates',
          category: 'Public University',
          location: 'UDSM, Mzumbe, IFM',
          minRequirement: 'Lower Second Class (GPA 2.7 - 3.4)',
          matchScore: 90,
          description: 'Postgraduate Diploma in Education, Financial Management, or Project Planning.',
          popularPrograms: ['Postgraduate Diploma in Education (PGDE)', 'Postgraduate Diploma in Finance'],
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
        }
      ];
    }
  };

  const predictedSchools = getPredictedSchools();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <i className="fa-solid fa-graduation-cap text-9xl"></i>
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>EducationTZ Score Predictor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            School & College Admission Match Predictor 🇹🇿
          </h1>

          <p className="text-sm sm:text-base text-indigo-200 font-medium leading-relaxed">
            Predict exactly which Secondary Schools, Special National High Schools, Diploma Colleges, or Universities (UDSM, MUHAS, SUA, DIT) you qualify for based on your examination score across all levels of Tanzanian education!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <i className="fa-solid fa-share-nodes text-xs"></i>
              <span>Share My Match Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Level Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveLevel('PSLE')}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'PSLE' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-seedling text-emerald-600"></i>
          <span>Primary (PSLE Std 7)</span>
        </button>

        <button
          onClick={() => setActiveLevel('CSEE')}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'CSEE' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-book-bookmark text-indigo-600"></i>
          <span>O-Level (CSEE Form 4)</span>
        </button>

        <button
          onClick={() => setActiveLevel('ACSEE')}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'ACSEE' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-award text-amber-600"></i>
          <span>A-Level (ACSEE Form 6)</span>
        </button>

        <button
          onClick={() => setActiveLevel('UNIVERSITY')}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'UNIVERSITY' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-university text-purple-600"></i>
          <span>University & GPA</span>
        </button>
      </div>

      {/* Input Score Calculator Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
        {/* PSLE LEVEL INPUT */}
        {activeLevel === 'PSLE' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Primary Standard 7 Examination Score</h3>
                <p className="text-xs text-slate-500 font-medium">Adjust your average percentage mark out of 100%</p>
              </div>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-center shrink-0">
                <span className="text-[10px] uppercase font-black tracking-wider block text-emerald-700">Calculated Grade</span>
                <span className="text-xl font-black">{psleScore}% ({psleScore >= 80 ? 'Grade A' : psleScore >= 65 ? 'Grade B' : psleScore >= 50 ? 'Grade C' : 'Grade D'})</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex justify-between">
                <span>Overall PSLE Average Score:</span>
                <span className="text-emerald-600">{psleScore}%</span>
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={psleScore}
                onChange={(e) => setPsleScore(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>40% (Pass)</span>
                <span>70% (Grade B)</span>
                <span>85%+ (Special Talent School Cutoff)</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* CSEE FORM 4 INPUT */}
        {activeLevel === 'CSEE' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Form 4 CSEE NECTA Grades Builder</h3>
                <p className="text-xs text-slate-500 font-medium">Select your grades in key subjects to calculate Points & Division</p>
              </div>
              <div className="px-4 py-2 bg-indigo-50 text-indigo-900 rounded-2xl border border-indigo-200 text-center shrink-0">
                <span className="text-[10px] uppercase font-black tracking-wider block text-indigo-700">Best 7 Points & Division</span>
                <span className="text-xl font-black">{cseeBest7Sum} Points ({cseeDivision})</span>
              </div>
            </div>

            {/* Subject Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { name: 'Mathematics', val: cseeMath, set: setCseeMath },
                { name: 'Physics', val: cseePhysics, set: setCseePhysics },
                { name: 'Chemistry', val: cseeChemistry, set: setCseeChemistry },
                { name: 'Biology', val: cseeBiology, set: setCseeBiology },
                { name: 'English', val: cseeEnglish, set: setCseeEnglish },
                { name: 'Kiswahili', val: cseeKiswahili, set: setCseeKiswahili },
                { name: 'Civics', val: cseeCivics, set: setCseeCivics },
              ].map((sub, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-800 truncate block">{sub.name}</span>
                  <select
                    value={sub.val}
                    onChange={(e) => sub.set(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white border border-slate-300 font-black text-xs text-indigo-900 text-center focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>Grade A (1 pt)</option>
                    <option value={2}>Grade B (2 pts)</option>
                    <option value={3}>Grade C (3 pts)</option>
                    <option value={4}>Grade D (4 pts)</option>
                    <option value={5}>Grade F (5 pts)</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACSEE FORM 6 INPUT */}
        {activeLevel === 'ACSEE' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Form 6 ACSEE Combination & Points Builder</h3>
                <p className="text-xs text-slate-500 font-medium">Select your combination and subject grades</p>
              </div>
              <div className="px-4 py-2 bg-amber-50 text-amber-950 rounded-2xl border border-amber-200 text-center shrink-0">
                <span className="text-[10px] uppercase font-black tracking-wider block text-amber-800">Total Points & Division</span>
                <span className="text-xl font-black">{acseePoints} Points ({acseeDivision})</span>
              </div>
            </div>

            {/* Combination Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-700">Combination:</span>
              {['PCM', 'PCB', 'CBG', 'PGM', 'EGM', 'HGL', 'HKL', 'HGE'].map((combo) => (
                <button
                  key={combo}
                  onClick={() => setSelectedCombo(combo)}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs border transition ${
                    selectedCombo === combo
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {combo}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: `${selectedCombo[0]} Grade`, val: acseeSub1, set: setAcseeSub1 },
                { label: `${selectedCombo[1]} Grade`, val: acseeSub2, set: setAcseeSub2 },
                { label: `${selectedCombo[2]} Grade`, val: acseeSub3, set: setAcseeSub3 },
              ].map((sub, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <label className="text-xs font-bold text-slate-800">{sub.label}</label>
                  <select
                    value={sub.val}
                    onChange={(e) => sub.set(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-black text-xs text-slate-900"
                  >
                    <option value={1}>A (1 point)</option>
                    <option value={2}>B (2 points)</option>
                    <option value={3}>C (3 points)</option>
                    <option value={4}>D (4 points)</option>
                    <option value={5}>E (5 points)</option>
                    <option value={6}>S (Subsidiary - 6 pts)</option>
                    <option value={7}>F (Fail - 7 pts)</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UNIVERSITY GPA INPUT */}
        {activeLevel === 'UNIVERSITY' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">University Cumulative GPA (5.0 Scale)</h3>
                <p className="text-xs text-slate-500 font-medium">Predict Postgraduate Scholarships & Career Placement</p>
              </div>
              <div className="px-4 py-2 bg-purple-50 text-purple-900 rounded-2xl border border-purple-200 text-center shrink-0">
                <span className="text-[10px] uppercase font-black tracking-wider block text-purple-700">Classification</span>
                <span className="text-xl font-black">
                  GPA {gpaValue.toFixed(2)} ({gpaValue >= 4.4 ? 'First Class' : gpaValue >= 3.5 ? 'Upper 2nd Class' : 'Lower 2nd Class'})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex justify-between">
                <span>Cumulative GPA Value:</span>
                <span className="text-purple-600 font-extrabold">{gpaValue.toFixed(2)} / 5.0</span>
              </label>
              <input
                type="range"
                min="2.0"
                max="5.0"
                step="0.05"
                value={gpaValue}
                onChange={(e) => setGpaValue(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>2.0 (Pass)</span>
                <span>2.7 (Lower 2nd)</span>
                <span>3.5 (Upper 2nd)</span>
                <span>4.4 (First Class)</span>
                <span>5.0</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Matched Schools & Universities Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg">
              <i className="fa-solid fa-square-check"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Your Matched Schools & Programs</h2>
              <p className="text-xs text-slate-500 font-medium">Based on NECTA & TCU Official Admission Guidelines</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full border border-indigo-200">
            {predictedSchools.length} Matches Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictedSchools.map((sch, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200/80 hover:shadow-xl transition flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase border ${sch.badgeColor || 'bg-indigo-100 text-indigo-900 border-indigo-300'}`}>
                    {sch.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-black text-[11px] border border-emerald-200 flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-emerald-600"></i> {sch.matchScore}% Match
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition">
                    {sch.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-location-dot text-rose-500"></i> {sch.location}
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {sch.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">Cut-Off Requirement</span>
                  <p className="text-xs font-bold text-slate-800">{sch.minRequirement}</p>
                </div>

                {sch.popularPrograms && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 block">Eligible Programs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sch.popularPrograms.map((prg, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-950 font-bold text-[10px] border border-indigo-100">
                          {prg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">EducationTZ NECTA Predictor</span>
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-share-nodes"></i>
                  <span>Share Result</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ShareProgressModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        studentName="EducationTZ Scholar"
        points={activeLevel === 'CSEE' ? cseeBest7Sum : activeLevel === 'ACSEE' ? acseePoints : Math.round(psleScore)}
        streak={7}
        completedTopicsCount={12}
        recentAchievement={`Admission Match Prediction (${activeLevel}): Qualified for ${predictedSchools[0]?.name || 'National Schools'}`}
        customTitle="Share School Admission Predictor Report"
      />
    </div>
  );
};
