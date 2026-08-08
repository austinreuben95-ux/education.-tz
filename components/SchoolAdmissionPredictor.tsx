import React, { useState, useMemo } from 'react';
import { ShareProgressModal } from './ShareProgressModal';
import { TANZANIAN_SCHOOLS_DATABASE, TanzanianSchool } from '../src/data/tanzanianSchoolsData';

export interface AdmissionSchool {
  id: string;
  name: string;
  category: 'Special National' | 'National Boarding' | 'Top Private' | 'Public University' | 'Private University' | 'Diploma College';
  location: string;
  minRequirement: string;
  schoolAverage: string;
  targetScoreToHit: string;
  matchScore: number; // 0 - 100%
  description: string;
  popularPrograms?: string[];
  badgeColor?: string;
  gender?: string;
}

export const SchoolAdmissionPredictor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MATCH' | 'DIRECTORY'>('MATCH');
  const [activeLevel, setActiveLevel] = useState<'PSLE' | 'CSEE' | 'ACSEE' | 'UNIVERSITY'>('CSEE');

  // Dream / Target School Goal State
  const [targetSchoolId, setTargetSchoolId] = useState<string>('sch-csee-1');

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
  const [acseeSub1, setAcseeSub1] = useState<number>(1); // 1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=F
  const [acseeSub2, setAcseeSub2] = useState<number>(2);
  const [acseeSub3, setAcseeSub3] = useState<number>(2);
  const [selectedCombo, setSelectedCombo] = useState<string>('PCM');

  // University GPA State
  const [gpaValue, setGpaValue] = useState<number>(3.8);

  // Directory Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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

  // Available Target Schools for current active level
  const levelSchoolsList = useMemo(() => {
    return TANZANIAN_SCHOOLS_DATABASE.filter(s => s.level === activeLevel);
  }, [activeLevel]);

  // Selected Target School object
  const currentTargetSchool = useMemo(() => {
    return levelSchoolsList.find(s => s.id === targetSchoolId) || levelSchoolsList[0] || TANZANIAN_SCHOOLS_DATABASE[0];
  }, [levelSchoolsList, targetSchoolId]);

  // Unique regions list for filter
  const regionsList = useMemo(() => {
    const list = new Set<string>();
    TANZANIAN_SCHOOLS_DATABASE.forEach(s => list.add(s.region));
    return Array.from(list).sort();
  }, []);

  // Directory Filtered Schools
  const filteredDirectorySchools = useMemo(() => {
    return TANZANIAN_SCHOOLS_DATABASE.filter(school => {
      const matchesLevel = school.level === activeLevel;
      const matchesRegion = selectedRegion === 'ALL' || school.region.toLowerCase().includes(selectedRegion.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || school.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.popularPrograms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesLevel && matchesRegion && matchesCategory && matchesSearch;
    });
  }, [activeLevel, selectedRegion, selectedCategory, searchQuery]);

  // Build Schools Match List based on selected level & score
  const getPredictedSchools = (): AdmissionSchool[] => {
    return levelSchoolsList.map(sch => {
      let calcMatch = 75;
      if (activeLevel === 'PSLE') {
        if (psleScore >= 88) calcMatch = sch.category === 'Special National' || sch.category === 'Top Private' ? 98 : 90;
        else if (psleScore >= 75) calcMatch = sch.category === 'National Boarding' ? 92 : 80;
        else calcMatch = 70;
      } else if (activeLevel === 'CSEE') {
        if (cseeBest7Sum <= 14) calcMatch = sch.category === 'Special National' ? 98 : 92;
        else if (cseeBest7Sum <= 21) calcMatch = sch.category === 'National Boarding' || sch.category === 'Diploma College' ? 90 : 75;
        else calcMatch = sch.category === 'Diploma College' ? 85 : 60;
      } else if (activeLevel === 'ACSEE') {
        if (acseePoints <= 7) calcMatch = sch.category === 'Public University' ? 98 : 92;
        else if (acseePoints <= 12) calcMatch = sch.category === 'Public University' || sch.category === 'Private University' ? 90 : 75;
        else calcMatch = 70;
      } else if (activeLevel === 'UNIVERSITY') {
        if (gpaValue >= 4.4) calcMatch = 98;
        else if (gpaValue >= 3.5) calcMatch = 92;
        else calcMatch = 82;
      }

      return {
        id: sch.id,
        name: sch.name,
        category: sch.category,
        location: `${sch.region}${sch.district ? ', ' + sch.district : ''}`,
        minRequirement: sch.minRequirement,
        schoolAverage: sch.schoolAverage,
        targetScoreToHit: sch.targetScoreToHit,
        matchScore: calcMatch,
        description: sch.description,
        popularPrograms: sch.popularPrograms,
        badgeColor: sch.badgeColor,
        gender: sch.gender
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const predictedSchools = getPredictedSchools();

  // Compute GAP calculation for selected target school
  const targetGapAnalysis = useMemo(() => {
    if (!currentTargetSchool) return null;

    if (activeLevel === 'PSLE') {
      const targetVal = 88; // Default PSLE benchmark cutoff
      const diff = psleScore - targetVal;
      const isTargetHit = psleScore >= 85;
      return {
        isHit: isTargetHit,
        currentLabel: `${psleScore}% PSLE Score`,
        targetLabel: currentTargetSchool.targetScoreToHit,
        schoolAvg: currentTargetSchool.schoolAverage,
        message: isTargetHit 
          ? `🎉 Excellent! Your PSLE average of ${psleScore}% meets or exceeds the target cutoff for ${currentTargetSchool.name}!` 
          : `⚠️ You are ${Math.abs(diff)}% marks below ${currentTargetSchool.name}'s target score. Aim for Grade A in Mathematics & Science to boost your score!`
      };
    } else if (activeLevel === 'CSEE') {
      const targetPoints = 12; // CSEE Division I cutoff
      const isTargetHit = cseeBest7Sum <= targetPoints;
      return {
        isHit: isTargetHit,
        currentLabel: `${cseeBest7Sum} CSEE Points (${cseeDivision})`,
        targetLabel: currentTargetSchool.targetScoreToHit,
        schoolAvg: currentTargetSchool.schoolAverage,
        message: isTargetHit
          ? `🎉 Great Job! Your CSEE score of ${cseeBest7Sum} points hits the Division I cutoff for ${currentTargetSchool.name}!`
          : `⚠️ Your CSEE score is ${cseeBest7Sum} points. You need ${cseeBest7Sum - targetPoints} fewer points (e.g. upgrade 2 subjects from Grade B to Grade A) to hit ${currentTargetSchool.name}'s target!`
      };
    } else if (activeLevel === 'ACSEE') {
      const targetPts = 8;
      const isTargetHit = acseePoints <= targetPts;
      return {
        isHit: isTargetHit,
        currentLabel: `${acseePoints} ACSEE Points (${acseeDivision})`,
        targetLabel: currentTargetSchool.targetScoreToHit,
        schoolAvg: currentTargetSchool.schoolAverage,
        message: isTargetHit
          ? `🎉 Goal Reached! Your ACSEE combination score (${acseePoints} pts) qualifies for ${currentTargetSchool.name}!`
          : `⚠️ Target cutoff requires high principal passes. Aim for Grade A/B in your top 2 principal subjects!`
      };
    } else {
      const isTargetHit = gpaValue >= 3.8;
      return {
        isHit: isTargetHit,
        currentLabel: `GPA ${gpaValue.toFixed(1)}`,
        targetLabel: currentTargetSchool.targetScoreToHit,
        schoolAvg: currentTargetSchool.schoolAverage,
        message: isTargetHit
          ? `🎉 First Class / Upper Second GPA qualifies for ${currentTargetSchool.name}!`
          : `⚠️ Aim for Upper Second Class (3.5+) or First Class (4.4+) GPA for competitive selection.`
      };
    }
  }, [currentTargetSchool, activeLevel, psleScore, cseeBest7Sum, cseeDivision, acseePoints, acseeDivision, gpaValue]);

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
            <span>Tanzania All Schools & Target Goal Calculator 🇹🇿</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Tanzanian Schools Admission & Target Goal Predictor
          </h1>

          <p className="text-sm sm:text-base text-indigo-200 font-medium leading-relaxed">
            Select your dream target school, view its <strong>National Pass Average</strong> and <strong>Target Cutoff Score</strong>, and see if your current grades hit the target!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <i className="fa-solid fa-share-nodes text-xs"></i>
              <span>Share My School Target Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Toggle: Predictor vs Directory Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('MATCH')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
              activeTab === 'MATCH' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-bullseye"></i>
            <span>Dream School & Target Predictor</span>
          </button>

          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
              activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-building-columns"></i>
            <span>Browse All Tanzania Schools Directory ({TANZANIAN_SCHOOLS_DATABASE.length})</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live NECTA & TCU Cutoffs 2024/2025</span>
        </div>
      </div>

      {/* Level Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => {
            setActiveLevel('PSLE');
            setTargetSchoolId('sch-psle-1');
          }}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'PSLE' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-seedling text-emerald-600"></i>
          <span>Primary (PSLE Std 7)</span>
        </button>

        <button
          onClick={() => {
            setActiveLevel('CSEE');
            setTargetSchoolId('sch-csee-1');
          }}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'CSEE' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-book-bookmark text-indigo-600"></i>
          <span>O-Level (CSEE Form 4)</span>
        </button>

        <button
          onClick={() => {
            setActiveLevel('ACSEE');
            setTargetSchoolId('sch-acsee-1');
          }}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'ACSEE' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-award text-amber-600"></i>
          <span>A-Level (ACSEE Form 6)</span>
        </button>

        <button
          onClick={() => {
            setActiveLevel('UNIVERSITY');
            setTargetSchoolId('sch-univ-1');
          }}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeLevel === 'UNIVERSITY' ? 'bg-white text-indigo-950 shadow-sm border border-gray-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-university text-purple-600"></i>
          <span>University & GPA</span>
        </button>
      </div>

      {activeTab === 'MATCH' ? (
        <>
          {/* DREAM / TARGET SCHOOL SELECTOR & TARGET GAP CALCULATOR PANEL */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-5">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase tracking-wider border border-amber-400/30 inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bullseye"></i>
                  <span>Target School Goal Tracker</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Select the School or College You Want to Go To:
                </h2>
                <p className="text-xs text-indigo-200 font-medium">
                  Compare your current score against your dream institution's average performance and target cutoff score.
                </p>
              </div>

              {/* Target School Dropdown */}
              <div className="w-full sm:w-80 shrink-0">
                <label className="text-[11px] font-black uppercase text-amber-300 block mb-1">
                  Choose Target School / College:
                </label>
                <select
                  value={targetSchoolId}
                  onChange={(e) => setTargetSchoolId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 text-white font-black text-xs border border-indigo-400/50 focus:ring-2 focus:ring-amber-400 outline-none"
                >
                  {levelSchoolsList.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target School Key Metrics & GAP Banner */}
            {currentTargetSchool && targetGapAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric 1: School Average */}
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-indigo-500/20 space-y-2">
                  <div className="flex items-center justify-between text-indigo-300 text-xs font-black">
                    <span>School National Average</span>
                    <i className="fa-solid fa-chart-line text-emerald-400"></i>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-300">
                    {currentTargetSchool.schoolAverage}
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Average passing standard achieved by admitted candidates.
                  </p>
                </div>

                {/* Metric 2: Target Score You Must Hit */}
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-indigo-500/20 space-y-2">
                  <div className="flex items-center justify-between text-amber-300 text-xs font-black">
                    <span>Target Score You Must Hit</span>
                    <i className="fa-solid fa-flag-checkered text-amber-400"></i>
                  </div>
                  <p className="text-base sm:text-lg font-black text-amber-200 leading-snug">
                    {currentTargetSchool.targetScoreToHit}
                  </p>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Minimum requirement to guarantee admission approval.
                  </p>
                </div>

                {/* Metric 3: Your Current Score & GAP Status */}
                <div className={`p-5 rounded-2xl border space-y-2 ${targetGapAnalysis.isHit ? 'bg-emerald-950/60 border-emerald-400/50' : 'bg-amber-950/60 border-amber-400/50'}`}>
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className={targetGapAnalysis.isHit ? 'text-emerald-300' : 'text-amber-300'}>Your Current Score vs Target</span>
                    <i className={`fa-solid ${targetGapAnalysis.isHit ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-amber-400'}`}></i>
                  </div>
                  <p className="text-xl font-black text-white">
                    {targetGapAnalysis.currentLabel}
                  </p>
                  <p className={`text-xs font-bold leading-relaxed ${targetGapAnalysis.isHit ? 'text-emerald-200' : 'text-amber-200'}`}>
                    {targetGapAnalysis.message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Score Calculator Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
            {/* PSLE LEVEL INPUT */}
            {activeLevel === 'PSLE' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Primary Standard 7 Examination Score</h3>
                    <p className="text-xs text-slate-500 font-medium">Adjust your average percentage mark out of 100% to calculate admission match</p>
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
                    <span>85%+ (Special Talent Cutoff)</span>
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
                    <span className="text-[10px] uppercase font-black tracking-wider block text-amber-700">ACSEE Points & Division</span>
                    <span className="text-xl font-black">{acseePoints} Points ({acseeDivision})</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <label className="text-xs font-black text-slate-700 block">Target Combination:</label>
                    <select
                      value={selectedCombo}
                      onChange={(e) => setSelectedCombo(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-black text-xs text-indigo-900"
                    >
                      <option value="PCM">PCM (Physics, Chem, Math)</option>
                      <option value="PCB">PCB (Physics, Chem, Bio)</option>
                      <option value="PGM">PGM (Physics, Geog, Math)</option>
                      <option value="CBG">CBG (Chem, Bio, Geog)</option>
                      <option value="HGL">HGL (Hist, Geog, Lang)</option>
                      <option value="HKL">HKL (Hist, Kisw, Lit)</option>
                      <option value="EGM">EGM (Econ, Geog, Math)</option>
                      <option value="ECA">ECA (Econ, Comm, Account)</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <label className="text-xs font-black text-slate-700 block">Subject 1 Grade:</label>
                    <select
                      value={acseeSub1}
                      onChange={(e) => setAcseeSub1(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-black text-xs text-indigo-900"
                    >
                      <option value={1}>A (1 pt)</option>
                      <option value={2}>B (2 pts)</option>
                      <option value={3}>C (3 pts)</option>
                      <option value={4}>D (4 pts)</option>
                      <option value={5}>E (5 pts)</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <label className="text-xs font-black text-slate-700 block">Subject 2 Grade:</label>
                    <select
                      value={acseeSub2}
                      onChange={(e) => setAcseeSub2(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-black text-xs text-indigo-900"
                    >
                      <option value={1}>A (1 pt)</option>
                      <option value={2}>B (2 pts)</option>
                      <option value={3}>C (3 pts)</option>
                      <option value={4}>D (4 pts)</option>
                      <option value={5}>E (5 pts)</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <label className="text-xs font-black text-slate-700 block">Subject 3 Grade:</label>
                    <select
                      value={acseeSub3}
                      onChange={(e) => setAcseeSub3(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 font-black text-xs text-indigo-900"
                    >
                      <option value={1}>A (1 pt)</option>
                      <option value={2}>B (2 pts)</option>
                      <option value={3}>C (3 pts)</option>
                      <option value={4}>D (4 pts)</option>
                      <option value={5}>E (5 pts)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* UNIVERSITY GPA INPUT */}
            {activeLevel === 'UNIVERSITY' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">University Undergraduate Cumulative GPA</h3>
                    <p className="text-xs text-slate-500 font-medium">Predict Postgraduate Master's Admission & Scholarship Qualification</p>
                  </div>
                  <div className="px-4 py-2 bg-purple-50 text-purple-900 rounded-2xl border border-purple-200 text-center shrink-0">
                    <span className="text-[10px] uppercase font-black tracking-wider block text-purple-700">Degree Classification</span>
                    <span className="text-xl font-black">
                      GPA {gpaValue.toFixed(1)} ({gpaValue >= 4.4 ? 'First Class' : gpaValue >= 3.5 ? 'Upper Second' : gpaValue >= 2.7 ? 'Lower Second' : 'Pass'})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 flex justify-between">
                    <span>Cumulative GPA (Out of 5.0):</span>
                    <span className="text-purple-600">{gpaValue.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="2.0"
                    max="5.0"
                    step="0.1"
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

          {/* Matches Output Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-indigo-600"></i>
                <span>Predicted School & Program Matches</span>
              </h2>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {predictedSchools.length} Matching Institutions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictedSchools.map((sch) => {
                const isSelectedTarget = sch.id === targetSchoolId;

                return (
                  <div
                    key={sch.id}
                    className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border flex flex-col justify-between space-y-4 relative overflow-hidden ${
                      isSelectedTarget ? 'border-2 border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'
                    }`}
                  >
                    {isSelectedTarget && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-2xl flex items-center gap-1">
                        <i className="fa-solid fa-bullseye"></i>
                        <span>Your Selected Target Goal</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 pt-1">
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${sch.badgeColor || 'bg-slate-100 text-slate-800'}`}>
                            {sch.category}
                          </span>
                          <h3 className="text-xl font-black text-slate-900 mt-1">{sch.name}</h3>
                          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <i className="fa-solid fa-location-dot text-indigo-500"></i>
                            <span>{sch.location}</span>
                            {sch.gender && (
                              <>
                                <span>•</span>
                                <span>{sch.gender}</span>
                              </>
                            )}
                          </p>
                        </div>

                        <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-2xl text-center shrink-0">
                          <span className="text-[10px] uppercase font-black tracking-wider block text-emerald-700">Admission Match</span>
                          <span className="text-lg font-black text-emerald-600">{sch.matchScore}%</span>
                        </div>
                      </div>

                      {/* School Average & Target Score Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-bold">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                            <i className="fa-solid fa-chart-line text-emerald-600"></i> School Average
                          </span>
                          <span className="text-slate-900 font-extrabold">{sch.schoolAverage}</span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                            <i className="fa-solid fa-bullseye text-amber-600"></i> Target to Hit
                          </span>
                          <span className="text-indigo-900 font-extrabold">{sch.targetScoreToHit}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {sch.description}
                      </p>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Minimum Requirement / Cutoff</span>
                        <p className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                          <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
                          <span>{sch.minRequirement}</span>
                        </p>
                      </div>

                      {sch.popularPrograms && sch.popularPrograms.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Popular Programs & Combinations</span>
                          <div className="flex flex-wrap gap-1.5">
                            {sch.popularPrograms.map((prog, pIdx) => (
                              <span key={pIdx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 font-extrabold text-[11px] border border-indigo-100">
                                {prog}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black">
                      <button
                        onClick={() => setTargetSchoolId(sch.id)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                          isSelectedTarget
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <i className="fa-solid fa-bullseye text-amber-400"></i>
                        <span>{isSelectedTarget ? 'Current Selected Target' : 'Set as My Target Goal'}</span>
                      </button>

                      <button
                        onClick={() => setIsShareOpen(true)}
                        className="hover:underline flex items-center gap-1 text-slate-700"
                      >
                        <span>Share</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* DIRECTORY SEARCH & BROWSE TAB */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-indigo-600"></i>
              <span>Search All Secondary Schools, Colleges & Universities in Tanzania</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Search by Name or Keywords:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Ilboru, UDSM, Mzumbe, St. Francis, DIT..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Filter by Region:</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="ALL">All Regions in Tanzania ({regionsList.length} Regions)</option>
                  {regionsList.map((reg, idx) => (
                    <option key={idx} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Filter by School Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="ALL">All School Categories</option>
                  <option value="Special National">Special National Talent Schools</option>
                  <option value="National Boarding">National Government Boarding</option>
                  <option value="Top Private">Top Private Boarding Academies</option>
                  <option value="Public University">Public Universities</option>
                  <option value="Private University">Private Universities</option>
                  <option value="Diploma College">Technical & Diploma Colleges</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectorySchools.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-lg transition border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${sch.badgeColor}`}>
                      {sch.category}
                    </span>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                      {sch.level}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 leading-snug">{sch.name}</h4>

                  <p className="text-xs font-extrabold text-indigo-600 flex items-center gap-1">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{sch.region} {sch.district ? `(${sch.district})` : ''}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{sch.gender}</span>
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">School Pass Avg:</span>
                      <span className="font-bold text-emerald-700">{sch.schoolAverage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">Target to Hit:</span>
                      <span className="font-extrabold text-indigo-900">{sch.targetScoreToHit}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl">
                    {sch.description}
                  </p>

                  <div className="pt-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Cutoff Requirement</span>
                    <span className="text-xs font-black text-slate-800">{sch.minRequirement}</span>
                  </div>
                </div>

                {sch.popularPrograms.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {sch.popularPrograms.slice(0, 2).map((p, idx) => (
                      <span key={idx} className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredDirectorySchools.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 max-w-md mx-auto my-8 space-y-3">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900">No schools match your search filter</h3>
              <p className="text-xs text-slate-500">Try changing your region, category filter, or keyword search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('ALL');
                  setSelectedCategory('ALL');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Share Progress Modal */}
      <ShareProgressModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        studentName="Student"
        points={100}
        streak={1}
        completedTopicsCount={5}
        customTitle="School & Target Goal Match Report 🇹🇿"
      />
    </div>
  );
};
