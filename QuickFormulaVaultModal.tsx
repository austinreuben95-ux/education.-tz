import React, { useState } from 'react';

export interface QuickFormulaVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskYunFormula?: (formulaName: string, subject: string) => void;
}

interface FormulaItem {
  id: string;
  name: string;
  formula: string;
  variables: string;
  note?: string;
}

interface SubjectFormulas {
  subject: string;
  icon: string;
  badgeColor: string;
  formulas: FormulaItem[];
}

interface RapidFlashcard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  nectaTrap?: string;
}

const FORMULA_DATABASE: SubjectFormulas[] = [
  {
    subject: 'Mathematics',
    icon: 'fa-calculator',
    badgeColor: 'bg-indigo-500',
    formulas: [
      {
        id: 'math-quad',
        name: 'Quadratic Formula',
        formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
        variables: 'a, b, c = coefficients from ax² + bx + c = 0',
        note: 'NECTA Tip: If discriminant b² - 4ac < 0, roots are complex/no real solutions.'
      },
      {
        id: 'math-trig-pyth',
        name: 'Pythagorean Trigonometric Identity',
        formula: 'sin²(θ) + cos²(θ) = 1',
        variables: 'θ = angle in degrees or radians',
        note: 'Derived forms: 1 + tan²(θ) = sec²(θ), 1 + cot²(θ) = csc²(θ).'
      },
      {
        id: 'math-slope',
        name: 'Gradient & Straight Line Equation',
        formula: 'm = (y₂ - y₁) / (x₂ - x₁),  y - y₁ = m(x - x₁)',
        variables: 'm = slope/gradient, (x₁, y₁) = given point',
        note: 'Perpendicular lines have slopes m₁ × m₂ = -1. Parallel lines have m₁ = m₂.'
      },
      {
        id: 'math-arith-seq',
        name: 'Arithmetic Progression (AP)',
        formula: 'Aₙ = a + (n - 1)d,  Sₙ = (n/2)[2a + (n - 1)d]',
        variables: 'a = first term, d = common difference, n = term index',
        note: 'Common difference d = Aₙ - Aₙ₋₁.'
      },
      {
        id: 'math-circle',
        name: 'Circle Area & Circumference',
        formula: 'Area = πr²,  Circumference = 2πr',
        variables: 'r = radius, π ≈ 3.14159 or 22/7',
        note: 'Arc length for angle θ: s = (θ/360) × 2πr.'
      }
    ]
  },
  {
    subject: 'Physics',
    icon: 'fa-atom',
    badgeColor: 'bg-rose-500',
    formulas: [
      {
        id: 'phys-newton2',
        name: "Newton's Second Law of Motion",
        formula: 'F = m × a  or  F = Δp / Δt',
        variables: 'F = Force (N), m = Mass (kg), a = Acceleration (m/s²), p = Momentum',
        note: 'Always verify mass is in kg, not grams, before multiplying.'
      },
      {
        id: 'phys-kinematics',
        name: 'Linear Motion Equations (SUVAT)',
        formula: 'v = u + at,  s = ut + ½at²,  v² = u² + 2as',
        variables: 'u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement',
        note: 'For free fall, a = g ≈ 9.8 m/s² (downward).'
      },
      {
        id: 'phys-ohm',
        name: "Ohm's Law & Electric Power",
        formula: 'V = I × R,  P = V × I = I²R = V² / R',
        variables: 'V = Voltage (V), I = Current (A), R = Resistance (Ω), P = Power (W)',
        note: 'Resistors in Series: R_total = R₁ + R₂. In Parallel: 1/R_total = 1/R₁ + 1/R₂.'
      },
      {
        id: 'phys-snell',
        name: "Snell's Law of Refraction",
        formula: 'n₁ × sin(θ₁) = n₂ × sin(θ₂)',
        variables: 'n = refractive index, θ = angle to normal',
        note: 'Critical angle: sin(θ_c) = n₂ / n₁ when light travels from denser to rarer medium.'
      },
      {
        id: 'phys-pressure',
        name: 'Fluid Pressure & Density',
        formula: 'P = ρ × g × h,  Density ρ = m / V',
        variables: 'P = pressure (Pa), ρ = density (kg/m³), g = 9.8 m/s², h = depth (m)',
        note: 'Atmospheric pressure at sea level ≈ 1.013 × 10⁵ Pa.'
      }
    ]
  },
  {
    subject: 'Chemistry',
    icon: 'fa-flask',
    badgeColor: 'bg-emerald-500',
    formulas: [
      {
        id: 'chem-ideal-gas',
        name: 'Ideal Gas Equation',
        formula: 'P × V = n × R × T',
        variables: 'P = Pressure (atm or Pa), V = Volume (L or m³), n = moles, R = 0.0821 L·atm/(mol·K), T = Kelvin',
        note: 'Always convert temperature Celsius to Kelvin: T(K) = °C + 273.15.'
      },
      {
        id: 'chem-moles',
        name: 'Mole Concept & Molarity',
        formula: 'n = m / M_r,  Molarity (C) = n / V(dm³)',
        variables: 'm = mass (g), M_r = relative molecular mass, V = volume in dm³ (or L)',
        note: '1 dm³ = 1,000 cm³ = 1 Liter.'
      },
      {
        id: 'chem-ph',
        name: 'pH and Hydrogen Ion Concentration',
        formula: 'pH = -log₁₀[H⁺],  pH + pOH = 14',
        variables: '[H⁺] = molar concentration of hydrogen ions',
        note: 'pH < 7 is Acidic, pH = 7 is Neutral, pH > 7 is Basic/Alkaline.'
      },
      {
        id: 'chem-neutralize',
        name: 'Titration Neutralization Law',
        formula: '(M_a × V_a) / n_a = (M_b × V_b) / n_b',
        variables: 'M = molarity, V = volume, n = stoichiometric coefficients from balanced equation',
        note: 'Ensure chemical equation is balanced before writing ratio n_a / n_b.'
      }
    ]
  },
  {
    subject: 'Biology & Civics',
    icon: 'fa-dna',
    badgeColor: 'bg-amber-500',
    formulas: [
      {
        id: 'bio-photo',
        name: 'Photosynthesis Chemical Equation',
        formula: '6CO₂ + 6H₂O  --[Light & Chlorophyll]-->  C₆H₁₂O₆ + 6O₂',
        variables: 'Carbon Dioxide + Water --> Glucose + Oxygen',
        note: 'Occurs in the chloroplasts of plant cells.'
      },
      {
        id: 'bio-resp',
        name: 'Aerobic Cellular Respiration',
        formula: 'C₆H₁₂O₆ + 6O₂  -->  6CO₂ + 6H₂O + 38 ATP Energy',
        variables: 'Glucose + Oxygen --> Carbon Dioxide + Water + ATP',
        note: 'Main site of aerobic respiration: Mitochondria.'
      },
      {
        id: 'civ-gov',
        name: 'Three Pillars of the Tanzanian State',
        formula: '1. Executive (Rais na Baraza) | 2. Legislature (Bunge) | 3. Judiciary (Mahakama)',
        variables: 'Separation of powers and checks and balances according to 1977 Constitution',
        note: 'President is Head of State, Head of Government, and Commander-in-Chief.'
      }
    ]
  }
];

const RAPID_FLASHCARDS: RapidFlashcard[] = [
  {
    id: 'fc-1',
    subject: 'Physics',
    question: "What is the difference between Vector and Scalar quantities?",
    answer: "Scalar has magnitude only (e.g., Speed, Mass, Distance, Time). Vector has BOTH magnitude and specific direction (e.g., Velocity, Acceleration, Force, Momentum).",
    nectaTrap: "Common NECTA Trap: Confusing Speed (scalar) with Velocity (vector)."
  },
  {
    id: 'fc-2',
    subject: 'Chemistry',
    question: "State the law of Conservation of Mass during chemical reactions.",
    answer: "Matter can neither be created nor destroyed in a chemical reaction. Total mass of reactants equals total mass of products.",
    nectaTrap: "NECTA Tip: Must balance all atoms on left and right side of chemical equation."
  },
  {
    id: 'fc-3',
    subject: 'Mathematics',
    question: "What condition makes two lines perpendicular in coordinate geometry?",
    answer: "The product of their gradients must equal -1: (m₁ × m₂ = -1), which means m₂ = -1 / m₁.",
    nectaTrap: "Be careful with negative signs when inverting fractions."
  },
  {
    id: 'fc-4',
    subject: 'Biology',
    question: "What are the key differences between Plant Cells and Animal Cells?",
    answer: "Plant cells have: 1) Rigid cellulose Cell Wall, 2) Chloroplasts for photosynthesis, 3) Large central vacuole. Animal cells lack cell walls and chloroplasts.",
    nectaTrap: "Remember both cell types have cell membranes and mitochondria."
  },
  {
    id: 'fc-5',
    subject: 'Civics',
    question: "What is the supreme law of the United Republic of Tanzania?",
    answer: "The Constitution of the United Republic of Tanzania of 1977 (as amended). Any law conflicting with it is null and void to the extent of the inconsistency.",
    nectaTrap: "NECTA exams love asking about human rights in Chapter 1 Part III."
  }
];

export const QuickFormulaVaultModal: React.FC<QuickFormulaVaultModalProps> = ({
  isOpen,
  onClose,
  onAskYunFormula
}) => {
  const [activeTab, setActiveTab] = useState<'FORMULAS' | 'FLASHCARDS'>('FORMULAS');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleCopy = (formula: string, id: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentSubjectData = FORMULA_DATABASE.find(s => s.subject === selectedSubject) || FORMULA_DATABASE[0];
  const activeCard = RAPID_FLASHCARDS[currentCardIndex];
  const isCurrentCardMastered = masteredIds.includes(activeCard.id);

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      id="quick-formula-vault-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150 font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Quick Formulas & Flashcards Vault"
    >
      <div
        id="quick-formula-vault-container"
        className="w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 ring-1 ring-black/10"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-tz-orange text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
              <i className="fa-solid fa-bolt text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Quick Formula & Flashcard Vault
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-black uppercase">
                  NECTA Quick Revision
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                High-yield formulas, laws & interactive active-recall flashcards
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Close formula vault"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0f172a] gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('FORMULAS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'FORMULAS'
                  ? 'bg-white dark:bg-slate-700 text-tz-blue dark:text-cyan-300 shadow-2xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-square-root-variable text-xs"></i>
              <span>Formula Cheat Sheets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('FLASHCARDS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'FLASHCARDS'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-2xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-layer-group text-xs"></i>
              <span>Rapid Flashcards ({masteredIds.length}/{RAPID_FLASHCARDS.length})</span>
            </button>
          </div>

          {activeTab === 'FORMULAS' && (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
              {FORMULA_DATABASE.map(subj => (
                <button
                  key={subj.subject}
                  type="button"
                  onClick={() => setSelectedSubject(subj.subject)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedSubject === subj.subject
                      ? 'bg-tz-blue text-white shadow-xs shadow-sky-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  <i className={`fa-solid ${subj.icon} text-[10px]`}></i>
                  <span>{subj.subject}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {activeTab === 'FORMULAS' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {currentSubjectData.formulas.length} Essential {currentSubjectData.subject} Formulas
                </span>
                <span className="text-xs text-slate-400 font-medium">Click copy icon to save formula</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentSubjectData.formulas.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/70 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-tz-blue"></span>
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.formula, item.id)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-tz-blue dark:hover:text-cyan-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Copy formula text"
                        >
                          <i className={`fa-solid ${copiedId === item.id ? 'fa-check text-emerald-500' : 'fa-copy'}`}></i>
                          <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        {onAskYunFormula && (
                          <button
                            type="button"
                            onClick={() => {
                              onAskYunFormula(item.name, currentSubjectData.subject);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            title="Ask Yun AI for derivation & practice questions"
                          >
                            <i className="fa-solid fa-wand-magic-sparkles text-amber-500 text-[10px]"></i>
                            <span>Ask Yun</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Formula Display Box */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm sm:text-base font-extrabold text-tz-blue dark:text-cyan-300 tracking-wide text-center select-all overflow-x-auto">
                      {item.formula}
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      <strong className="text-slate-700 dark:text-slate-200">Where:</strong> {item.variables}
                    </div>

                    {item.note && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2">
                        <i className="fa-solid fa-lightbulb text-amber-500 mt-0.5 shrink-0"></i>
                        <span>{item.note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* FLASHCARDS INTERACTIVE MODE */
            <div className="max-w-xl mx-auto space-y-4 py-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>CARD {currentCardIndex + 1} OF {RAPID_FLASHCARDS.length}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-black">
                  {activeCard.subject}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                  style={{ width: `${((currentCardIndex + 1) / RAPID_FLASHCARDS.length) * 100}%` }}
                ></div>
              </div>

              {/* Interactive Flashcard Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[260px] p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between items-center text-center shadow-lg relative overflow-hidden select-none ${
                  isFlipped
                    ? 'border-indigo-400 bg-gradient-to-b from-indigo-50/70 via-white to-sky-50/70 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 dark:border-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-tz-blue dark:hover:border-cyan-400'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <i className="fa-solid fa-arrows-rotate text-[9px]"></i>
                  <span>{isFlipped ? 'Answer & Explanation' : 'Click to Reveal Answer'}</span>
                </div>

                <div className="my-auto py-4">
                  {!isFlipped ? (
                    <div className="space-y-3">
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                        {activeCard.question}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        Try to recall the definition or rule in your own words
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                        {activeCard.answer}
                      </p>
                      {activeCard.nectaTrap && (
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-medium">
                          {activeCard.nectaTrap}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(activeCard.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isCurrentCardMastered
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <i className={`fa-solid ${isCurrentCardMastered ? 'fa-check' : 'fa-circle-check'}`}></i>
                    <span>{isCurrentCardMastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
                  </button>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : RAPID_FLASHCARDS.length - 1));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-2 rounded-xl bg-tz-blue hover:bg-sky-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  <i className="fa-solid fa-arrows-rotate mr-1.5"></i>
                  <span>Flip Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentCardIndex(prev => (prev < RAPID_FLASHCARDS.length - 1 ? prev + 1 : 0));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Next</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between px-6 font-medium">
          <span>Tanzania National Secondary Curriculum Revision Kit</span>
          <button
            type="button"
            onClick={onClose}
            className="text-tz-blue dark:text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
