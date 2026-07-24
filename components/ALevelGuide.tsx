import React, { useState } from 'react';

interface GradeInput {
  math: string;
  physics: string;
  chemistry: string;
  biology: string;
  geography: string;
  history: string;
  english: string;
  kiswahili: string;
  civics: string;
}

interface CombinationResult {
  code: string;
  name: string;
  stream: 'Science' | 'Arts & Languages' | 'Commercial & Social';
  subjects: string[];
  isEligible: boolean;
  requiredCriteria: string;
  careerPaths: string[];
  universities: string[];
}

const ALevelGuide: React.FC = () => {
  const [grades, setGrades] = useState<GradeInput>({
    math: 'C',
    physics: 'B',
    chemistry: 'B',
    biology: 'B',
    geography: 'C',
    history: 'C',
    english: 'C',
    kiswahili: 'B',
    civics: 'C'
  });

  const [careerGoal, setCareerGoal] = useState<string>('Medicine');

  const handleGradeChange = (subject: keyof GradeInput, val: string) => {
    setGrades(prev => ({ ...prev, [subject]: val }));
  };

  // Convert letter grade to numerical weight (A=5, B=4, C=3, D=2, F=0)
  const getWeight = (g: string) => {
    switch (g.toUpperCase()) {
      case 'A': return 5;
      case 'B': return 4;
      case 'C': return 3;
      case 'D': return 2;
      default: return 0;
    }
  };

  const isPass = (g: string) => getWeight(g) >= 3; // C or better

  // Combinations Evaluator
  const evaluateCombinations = (): CombinationResult[] => {
    const pPhy = isPass(grades.physics);
    const pChem = isPass(grades.chemistry);
    const pBio = isPass(grades.biology);
    const pMath = isPass(grades.math);
    const pGeo = isPass(grades.geography);
    const pHist = isPass(grades.history);
    const pEng = isPass(grades.english);
    const pKisw = isPass(grades.kiswahili);

    return [
      {
        code: 'PCB',
        name: 'Physics, Chemistry, Biology',
        stream: 'Science',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        isEligible: pPhy && pChem && pBio,
        requiredCriteria: 'At least C in Physics, Chemistry, and Biology',
        careerPaths: ['Doctor of Medicine (MD)', 'Pharmacy', 'Nursing', 'Biomedical Science', 'Veterinary Medicine'],
        universities: ['MUHAS (Dsm)', 'KCMUCo (Moshi)', 'CUHAS (Mwanza)', 'UDOM (Dodoma)', 'SUA (Morogoro)']
      },
      {
        code: 'PCM',
        name: 'Physics, Chemistry, Mathematics',
        stream: 'Science',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        isEligible: pPhy && pChem && pMath,
        requiredCriteria: 'At least C in Physics, Chemistry, and Mathematics',
        careerPaths: ['Civil/Electrical/Mechanical Engineering', 'Architecture', 'Computer Science', 'Aeronautical Science'],
        universities: ['MUST (Mbeya)', 'UDSM (Dsm)', 'DIT (Dsm)', 'ATC (Arusha)']
      },
      {
        code: 'CBG',
        name: 'Chemistry, Biology, Geography',
        stream: 'Science',
        subjects: ['Chemistry', 'Biology', 'Geography'],
        isEligible: pChem && pBio && pGeo,
        requiredCriteria: 'At least C in Chemistry, Biology, and Geography',
        careerPaths: ['Environmental Science', 'Agribusiness', 'Forestry', 'Wildlife Conservation', 'Nutrition'],
        universities: ['SUA (Morogoro)', 'UDSM (Dsm)', 'UDOM (Dodoma)']
      },
      {
        code: 'HGL',
        name: 'History, Geography, Language (English)',
        stream: 'Arts & Languages',
        subjects: ['History', 'Geography', 'English'],
        isEligible: pHist && pGeo && pEng,
        requiredCriteria: 'At least C in History, Geography, and English',
        careerPaths: ['Law (LL.B)', 'International Relations', 'Journalism & Mass Comm', 'Tourism Management', 'Diplomacy'],
        universities: ['UDSM (Dsm)', 'Mzumbe (Morogoro)', 'Tumaini (Iringa)', 'St. Augustine (Mwanza)']
      },
      {
        code: 'HKL',
        name: 'History, Kiswahili, Language (English)',
        stream: 'Arts & Languages',
        subjects: ['History', 'Kiswahili', 'English'],
        isEligible: pHist && pKisw && pEng,
        requiredCriteria: 'At least C in History, Kiswahili, and English',
        careerPaths: ['Secondary Education Teacher', 'Linguistics', 'Kiswahili Literature', 'Public Administration', 'Publishing'],
        universities: ['UDSM (Dsm)', 'DUCE (Dsm)', 'MUCE (Iringa)', 'UDOM (Dodoma)']
      },
      {
        code: 'EGM',
        name: 'Economics, Geography, Mathematics',
        stream: 'Commercial & Social',
        subjects: ['Economics', 'Geography', 'Mathematics'],
        isEligible: pGeo && pMath,
        requiredCriteria: 'At least C in Geography and Basic Mathematics',
        careerPaths: ['Economics', 'Actuarial Science', 'Statistics', 'Banking & Finance', 'Urban Planning'],
        universities: ['UDSM (Dsm)', 'IFM (Dsm)', 'Mzumbe (Morogoro)', 'CBE (Dsm)']
      },
      {
        code: 'ECA',
        name: 'Economics, Commerce, Accountancy',
        stream: 'Commercial & Social',
        subjects: ['Economics', 'Commerce', 'Accountancy'],
        isEligible: pMath,
        requiredCriteria: 'At least C in Basic Mathematics and Commerce/Civics',
        careerPaths: ['Bachelor of Accounting (B.Acc)', 'Finance & Banking', 'Auditing', 'Business Administration'],
        universities: ['IFM (Dsm)', 'CBE (Dsm)', 'TIA (Dsm)', 'Mzumbe (Morogoro)']
      }
    ];
  };

  const combResults = evaluateCombinations();
  const eligibleCombs = combResults.filter(c => c.isEligible);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Banner */}
      <div className="bg-sunset-gradient text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 font-extrabold text-xs uppercase tracking-wider border border-white/20">
            <i className="fa-solid fa-compass-drafting"></i> Form 4 Career & Combination Advisor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            A-Level Combination Guide & Career Planner
          </h1>
          <p className="text-pink-100 text-sm sm:text-base leading-relaxed">
            Enter your CSEE Form 4 exam grades below to see which high school combinations (PCB, PCM, HGL, CBG, EGM, etc.) you qualify for and explore university degree options in Tanzania.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Grade Input Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-black text-gray-900 text-lg">Input Your CSEE Grades</h3>
              <p className="text-xs text-gray-500">Select predicted or actual Form 4 grades</p>
            </div>
            <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
              Form 4 Leaver
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-bold">
            {[
              { id: 'math', label: 'Basic Mathematics' },
              { id: 'physics', label: 'Physics' },
              { id: 'chemistry', label: 'Chemistry' },
              { id: 'biology', label: 'Biology' },
              { id: 'geography', label: 'Geography' },
              { id: 'history', label: 'History' },
              { id: 'english', label: 'English Language' },
              { id: 'kiswahili', label: 'Kiswahili' }
            ].map((s) => (
              <div key={s.id} className="space-y-1">
                <label className="text-gray-700 font-bold block">{s.label}</label>
                <select
                  value={grades[s.id as keyof GradeInput]}
                  onChange={(e) => handleGradeChange(s.id as keyof GradeInput, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 font-black text-gray-800 focus:bg-white focus:border-purple-500 outline-none"
                >
                  <option value="A">Grade A (Division 1)</option>
                  <option value="B">Grade B (Very Good)</option>
                  <option value="C">Grade C (Credit Pass)</option>
                  <option value="D">Grade D (Pass)</option>
                  <option value="F">Grade F (Fail)</option>
                </select>
              </div>
            ))}
          </div>

          {/* Goal Selector */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <label className="text-xs font-extrabold text-gray-800 block">Target Career Path / Dream Goal:</label>
            <select
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-purple-50/50 font-extrabold text-xs text-purple-900 focus:bg-white outline-none"
            >
              <option value="Medicine">Doctor of Medicine / Healthcare</option>
              <option value="Engineering">Engineering / Technology</option>
              <option value="Law">Law & Diplomacy</option>
              <option value="Business">Finance, Banking & Accounting</option>
              <option value="Agriculture">Agribusiness & Environment</option>
              <option value="Education">Teaching & Education Specialist</option>
            </select>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-indigo-950 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Analysis Summary</div>
              <h3 className="text-2xl font-black mt-0.5">
                Qualified for <span className="text-amber-300">{eligibleCombs.length}</span> A-Level Combinations
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 font-black text-xl">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
          </div>

          {/* Combinations List */}
          <div className="space-y-4">
            {combResults.map((comb) => (
              <div
                key={comb.code}
                className={`p-6 rounded-3xl border-2 transition-all ${
                  comb.isEligible
                    ? 'bg-white border-purple-200 shadow-md hover:shadow-xl'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3.5 py-1.5 rounded-2xl font-black text-sm text-white ${comb.isEligible ? 'bg-purple-600 shadow-md shadow-purple-200' : 'bg-gray-400'}`}>
                      {comb.code}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-base text-gray-900">{comb.name}</h4>
                      <span className="text-xs font-bold text-gray-500">{comb.stream} Stream</span>
                    </div>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    comb.isEligible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {comb.isEligible ? 'Eligible' : 'Prerequisites Not Met'}
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-medium mb-3">
                  <strong>Requirements:</strong> {comb.requiredCriteria}
                </p>

                {comb.isEligible && (
                  <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                    <div>
                      <strong className="text-purple-900">Career Opportunities:</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {comb.careerPaths.map((cp, idx) => (
                          <span key={idx} className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg font-bold border border-purple-100">
                            {cp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 text-gray-500 font-medium">
                      <strong>Target Universities in Tanzania:</strong> {comb.universities.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ALevelGuide;
