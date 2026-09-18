import React, { useState } from 'react';

export interface PracticeTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks: number;
}

export interface PracticeTestItem {
  id: string;
  title: string;
  subject: string;
  level: 'Primary (Std 1-7)' | 'O-Level (Form 1-4)' | 'A-Level (Form 5-6)' | 'College / University';
  durationMinutes: number;
  totalMarks: number;
  questions: PracticeTestQuestion[];
  isAssignment?: boolean;
}

export const SAMPLE_TESTS_BANK: PracticeTestItem[] = [
  // --- O-LEVEL MATHEMATICS TEST ---
  {
    id: 'test-math-form4-1',
    title: 'CSEE Form 4 Mathematics: Quadratic Equations & Trigonometry Speed Test',
    subject: 'Mathematics',
    level: 'O-Level (Form 1-4)',
    durationMinutes: 15,
    totalMarks: 100,
    isAssignment: false,
    questions: [
      {
        id: 'q1',
        question: 'Solve for x: 2x² - 8x + 6 = 0 using factorization or formula.',
        options: ['x = 1 or x = 3', 'x = 2 or x = 4', 'x = -1 or x = -3', 'x = 0 or x = 6'],
        correctIndex: 0,
        explanation: 'Divide by 2: x² - 4x + 3 = 0. Factors are (x - 1)(x - 3) = 0. Therefore x = 1 or x = 3.',
        marks: 25
      },
      {
        id: 'q2',
        question: 'In a right-angled triangle, if opposite = 3 cm and adjacent = 4 cm, what is tan(θ)?',
        options: ['3/4 (0.75)', '4/3 (1.33)', '3/5 (0.60)', '5/4 (1.25)'],
        correctIndex: 0,
        explanation: 'tan(θ) = Opposite / Adjacent = 3 / 4 = 0.75.',
        marks: 25
      },
      {
        id: 'q3',
        question: 'What is the value of the discriminant (Δ = b² - 4ac) for x² + 4x + 4 = 0?',
        options: ['0 (One real repeated root)', '16', '-8', '4'],
        correctIndex: 0,
        explanation: 'a=1, b=4, c=4. Δ = (4)² - 4(1)(4) = 16 - 16 = 0. When Δ = 0, roots are real and equal.',
        marks: 25
      },
      {
        id: 'q4',
        question: 'Calculate the radius of a circle whose area is 154 cm² (Use π = 22/7).',
        options: ['7 cm', '14 cm', '3.5 cm', '21 cm'],
        correctIndex: 0,
        explanation: 'Area = πr² = (22/7)r² = 154. r² = (154 × 7) / 22 = 49. r = √49 = 7 cm.',
        marks: 25
      }
    ]
  },

  // --- O-LEVEL PHYSICS TEST ---
  {
    id: 'test-phys-form2-1',
    title: 'Physics Form 2: Forces, Newton\'s Laws & Simple Machines Mock Paper',
    subject: 'Physics',
    level: 'O-Level (Form 1-4)',
    durationMinutes: 20,
    totalMarks: 100,
    isAssignment: false,
    questions: [
      {
        id: 'qp1',
        question: 'A car of mass 1000 kg accelerates at 3 m/s². What net force is exerted by the engine?',
        options: ['3000 N', '333 N', '300 N', '9000 N'],
        correctIndex: 0,
        explanation: 'Applying Newton\'s 2nd Law: F = m × a = 1000 kg × 3 m/s² = 3000 N.',
        marks: 25
      },
      {
        id: 'qp2',
        question: 'Which simple machine has a mechanical advantage (MA) defined as Load / Effort?',
        options: ['All simple machines (Levers, Pulleys, Inclined Planes)', 'Pulleys only', 'Hydraulic Press only', 'Gears only'],
        correctIndex: 0,
        explanation: 'Mechanical Advantage (MA) is always defined as Load / Effort for all simple machines.',
        marks: 25
      },
      {
        id: 'qp3',
        question: 'An object of mass 5 kg is taken to the Moon where gravity g = 1.6 N/kg. What is its weight on the Moon?',
        options: ['8 N', '50 N', '5 kg', '80 N'],
        correctIndex: 0,
        explanation: 'Weight W = m × g = 5 kg × 1.6 N/kg = 8 N. Mass remains 5 kg.',
        marks: 25
      },
      {
        id: 'qp4',
        question: 'What principle states that total momentum before collision equals total momentum after collision?',
        options: ['Principle of Conservation of Linear Momentum', 'Newton\'s 1st Law', 'Hooke\'s Law', 'Archimedes Principle'],
        correctIndex: 0,
        explanation: 'The Law of Conservation of Linear Momentum governs isolated physical collisions.',
        marks: 25
      }
    ]
  },

  // --- PRIMARY SCIENCE ASSIGNMENT ---
  {
    id: 'hw-primary-sci-1',
    title: 'Primary Standard 7: Human Digestive System & Balanced Diet Assignment',
    subject: 'Science',
    level: 'Primary (Std 1-7)',
    durationMinutes: 10,
    totalMarks: 100,
    isAssignment: true,
    questions: [
      {
        id: 'qps1',
        question: 'Where does the chemical digestion of carbohydrates begin in the human body?',
        options: ['Mouth (by Salivary Amylase)', 'Stomach', 'Small Intestine', 'Liver'],
        correctIndex: 0,
        explanation: 'Saliva contains the enzyme amylase, which breaks down starches into maltose sugars in the mouth.',
        marks: 33
      },
      {
        id: 'qps2',
        question: 'Which food class provides the primary source of energy for daily activities?',
        options: ['Carbohydrates', 'Proteins', 'Vitamins', 'Mineral Salts'],
        correctIndex: 0,
        explanation: 'Carbohydrates (maize, cassava, rice) are the main energy-yielding nutrients.',
        marks: 33
      },
      {
        id: 'qps3',
        question: 'Which deficiency disease is caused by a lack of Vitamin C in the diet?',
        options: ['Scurvy (Bleeding gums)', 'Rickets', 'Kwashiorkor', 'Goitre'],
        correctIndex: 0,
        explanation: 'Vitamin C (oranges, citrus fruits) prevents scurvy and maintains healthy connective tissues.',
        marks: 34
      }
    ]
  },

  // --- A-LEVEL CHEMISTRY MOCK TEST ---
  {
    id: 'test-chem-form6-1',
    title: 'ACSEE Form 6 Chemistry: Chemical Equilibrium & Reaction Kinetics',
    subject: 'Chemistry',
    level: 'A-Level (Form 5-6)',
    durationMinutes: 25,
    totalMarks: 100,
    isAssignment: false,
    questions: [
      {
        id: 'qac1',
        question: 'According to Le Chatelier\'s Principle, what happens to an exothermic reaction at equilibrium if temperature is increased?',
        options: ['Equilibrium shifts to the left (reactants side)', 'Equilibrium shifts to the right (products side)', 'No change', 'Reaction stops completely'],
        correctIndex: 0,
        explanation: 'Increasing temperature favors the endothermic reverse direction, shifting equilibrium to the left.',
        marks: 25
      },
      {
        id: 'qac2',
        question: 'What is the pH of a 0.01 M HCl solution?',
        options: ['pH = 2.0', 'pH = 1.0', 'pH = 7.0', 'pH = 12.0'],
        correctIndex: 0,
        explanation: 'HCl is a strong acid. [H+] = 0.01 M = 10⁻² M. pH = -log10[10⁻²] = 2.0.',
        marks: 25
      },
      {
        id: 'qac3',
        question: 'A catalyst increases the rate of reaction by:',
        options: ['Lowering the activation energy (Ea) path', 'Increasing temperature', 'Increasing reactant concentration', 'Shifting equilibrium position'],
        correctIndex: 0,
        explanation: 'Catalysts provide an alternative reaction pathway with a lower activation energy threshold.',
        marks: 25
      },
      {
        id: 'qac4',
        question: 'Which gas is evolved when sodium hydrogen carbonate reacts with dilute hydrochloric acid?',
        options: ['Carbon Dioxide (CO2)', 'Hydrogen (H2)', 'Oxygen (O2)', 'Chlorine (Cl2)'],
        correctIndex: 0,
        explanation: 'Carbonates react with acids to form salt, water, and carbon dioxide gas.',
        marks: 25
      }
    ]
  },

  // --- UNIVERSITY DEVELOPMENT STUDIES TEST ---
  {
    id: 'test-uni-ds-1',
    title: 'University General Studies: Tanzanian Industrialization & Vision 2025 Assignment',
    subject: 'Development Studies',
    level: 'College / University',
    durationMinutes: 15,
    totalMarks: 100,
    isAssignment: true,
    questions: [
      {
        id: 'qu1',
        question: 'What is the strategic goal of Tanzania National Development Vision 2025?',
        options: ['Transform Tanzania into a middle-income semi-industrialized country', 'Abolish all local taxes', 'Focus exclusively on agriculture', 'Eliminate regional trade agreements'],
        correctIndex: 0,
        explanation: 'Vision 2025 targets a competitive, middle-income economy driven by industrialization, human capital, and infrastructure.',
        marks: 50
      },
      {
        id: 'qu2',
        question: 'Which mega-infrastructure project significantly boosts electricity supply for Tanzanian industries?',
        options: ['Julius Nyerere Hydroelectric Power Project (JNHPP - 2,115 MW)', 'Songas Gas Plant only', 'Kidatu Dam expansion only', 'Mtera Dam'],
        correctIndex: 0,
        explanation: 'JNHPP on the Rufiji River generates over 2,115 MW to power manufacturing and regional power grids.',
        marks: 50
      }
    ]
  }
];

export const AssignmentsAndTestsBank: React.FC<{ onScoreCompleted?: (xp: number) => void }> = ({ onScoreCompleted }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeTest, setActiveTest] = useState<PracticeTestItem | null>(null);

  // Active Test Engine State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);

  const filteredTests = SAMPLE_TESTS_BANK.filter(test => {
    const levelMatch = selectedLevel === 'ALL' || test.level.startsWith(selectedLevel);
    const subjectMatch = selectedSubject === 'ALL' || test.subject.toLowerCase() === selectedSubject.toLowerCase();
    return levelMatch && subjectMatch;
  });

  const handleStartTest = (test: PracticeTestItem) => {
    setActiveTest(test);
    setUserAnswers({});
    setIsSubmitted(false);
    setScorePercentage(0);
  };

  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    let earnedMarks = 0;

    activeTest.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        earnedMarks += q.marks;
      }
    });

    const percent = Math.round((earnedMarks / activeTest.totalMarks) * 100);
    setScorePercentage(percent);
    setIsSubmitted(true);

    if (onScoreCompleted) {
      onScoreCompleted(earnedMarks > 0 ? earnedMarks : 20);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <i className="fa-solid fa-list-check"></i>
            <span>EducationTZ Examination Bank</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Assignments & Practice Test Center 🇹🇿
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
            Practice NECTA style weekly assignments, timed past paper tests, and mock exams across Primary, O-Level, A-Level, and University courses with step-by-step marking schemes!
          </p>
        </div>
      </div>

      {!activeTest ? (
        /* MAIN LIST & FILTER VIEW */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-black text-slate-700">Filter Level:</span>
              {['ALL', 'Primary', 'O-Level', 'A-Level', 'College'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition ${
                    selectedLevel === lvl ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-black text-slate-700">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 w-full md:w-48"
              >
                <option value="ALL">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Science">Science</option>
                <option value="Development Studies">Development Studies</option>
              </select>
            </div>
          </div>

          {/* Test Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200/80 hover:shadow-xl transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      test.isAssignment ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {test.isAssignment ? 'Assignment' : 'Timed Test'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      <i className="fa-solid fa-clock mr-1 text-slate-400"></i> {test.durationMinutes} mins
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs font-extrabold text-indigo-600 mt-1">
                      {test.subject} • {test.level}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Questions</span>
                      <span className="font-black text-slate-900">{test.questions.length} Items</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Total Marks</span>
                      <span className="font-black text-slate-900">{test.totalMarks} EP Marks</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <i className="fa-solid fa-play text-xs"></i>
                  <span>{test.isAssignment ? 'Start Assignment' : 'Take Practice Test'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ACTIVE TEST ENGINE VIEW */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <button
                onClick={() => setActiveTest(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Test Bank
              </button>
              <h2 className="text-xl font-black text-slate-900">{activeTest.title}</h2>
              <p className="text-xs text-indigo-600 font-bold">{activeTest.subject} • {activeTest.level}</p>
            </div>

            {isSubmitted && (
              <div className="px-4 py-2 bg-emerald-100 text-emerald-950 rounded-2xl border border-emerald-300 text-center">
                <span className="text-[10px] uppercase font-black tracking-wider block text-emerald-800">Final Score</span>
                <span className="text-2xl font-black">{scorePercentage}%</span>
              </div>
            )}
          </div>

          {/* Questions Container */}
          <div className="space-y-6">
            {activeTest.questions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-3 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      <span className="text-emerald-600 font-black mr-1">Q{idx + 1}.</span> {q.question}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-black text-[10px] shrink-0">
                      {q.marks} Marks
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100';
                      if (selectedOpt === oIdx) {
                        btnClass = 'bg-indigo-600 border-indigo-700 text-white font-black';
                      }

                      if (isSubmitted) {
                        if (oIdx === q.correctIndex) {
                          btnClass = 'bg-emerald-600 border-emerald-700 text-white font-black';
                        } else if (selectedOpt === oIdx) {
                          btnClass = 'bg-rose-600 border-rose-700 text-white font-black';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => handleOptionSelect(q.id, oIdx)}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2.5 ${btnClass}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-black shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Model Answer Explanation if Submitted */}
                  {isSubmitted && (
                    <div className={`p-3 rounded-xl text-xs space-y-1 font-medium ${
                      isCorrect ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-50 text-rose-950 border border-rose-200'
                    }`}>
                      <div className="flex items-center gap-1.5 font-black uppercase text-[10px]">
                        <i className={`fa-solid ${isCorrect ? 'fa-circle-check text-emerald-600' : 'fa-triangle-exclamation text-rose-600'}`}></i>
                        <span>{isCorrect ? 'Correct Answer!' : 'Model Solution Explanation'}</span>
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit / Finish Bar */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setActiveTest(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition"
            >
              Close Test
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitTest}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-200 transition active:scale-95"
              >
                Submit & Auto-Grade Answers
              </button>
            ) : (
              <button
                onClick={() => {
                  setUserAnswers({});
                  setIsSubmitted(false);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition"
              >
                Retake Test
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
