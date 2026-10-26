import { StudyBuddy } from '../types';

export const SEED_STUDY_BUDDIES: StudyBuddy[] = [
  {
    id: 'buddy_baraka_ilboru',
    userId: 'seed_baraka',
    displayName: 'Baraka M. (Ilboru Special)',
    avatarId: 'scholar-physics',
    schoolName: 'Ilboru Special School, Arusha',
    region: 'Arusha',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'physics',
    subjectName: 'Physics',
    topicId: 'phy_newtons_laws',
    topicTitle: "Newton's Laws of Motion & Momentum",
    studyGoal: 'Working on NECTA 2022 Section B numerical problems on conservation of momentum.',
    isOnline: true,
    status: 'seeking_help',
    lastActive: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    matchScore: 98
  },
  {
    id: 'buddy_subira_marian',
    userId: 'seed_subira',
    displayName: 'Subira J. (Marian Girls)',
    avatarId: 'scholar-chem',
    schoolName: 'Marian Girls High School, Bagamoyo',
    region: 'Pwani',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'chemistry',
    subjectName: 'Chemistry',
    topicId: 'chem_mole_concept',
    topicTitle: 'The Mole Concept & Gas Volumes',
    studyGoal: 'Mastering stoichiometric calculations and molarity for NECTA Paper 2.',
    isOnline: true,
    status: 'ready_to_tutor',
    lastActive: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    matchScore: 95
  },
  {
    id: 'buddy_erasto_mzumbe',
    userId: 'seed_erasto',
    displayName: 'Erasto K. (Mzumbe Secondary)',
    avatarId: 'scholar-math',
    schoolName: 'Mzumbe Secondary School, Morogoro',
    region: 'Morogoro',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'mathematics',
    subjectName: 'Basic Mathematics',
    topicId: 'math_quadratic_eq',
    topicTitle: 'Quadratic Equations & Completing The Square',
    studyGoal: 'Deriving quadratic formula and solving tricky word problems from 2020 NECTA.',
    isOnline: true,
    status: 'available',
    lastActive: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    matchScore: 92
  },
  {
    id: 'buddy_neema_feza',
    userId: 'seed_neema',
    displayName: 'Neema S. (Feza Girls)',
    avatarId: 'scholar-bio',
    schoolName: 'Feza Girls Secondary, Dar es Salaam',
    region: 'Dar es Salaam',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'biology',
    subjectName: 'Biology',
    topicId: 'bio_genetics_mendel',
    topicTitle: 'Genetics & Monohybrid Inheritance',
    studyGoal: 'Constructing Punnett squares and solving sex-linked inheritance cases.',
    isOnline: true,
    status: 'seeking_help',
    lastActive: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    matchScore: 90
  },
  {
    id: 'buddy_kelvin_tabora',
    userId: 'seed_kelvin',
    displayName: 'Kelvin P. (Tabora Boys)',
    avatarId: 'scholar-tanzania',
    schoolName: 'Tabora Boys High School, Tabora',
    region: 'Tabora',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'geography',
    subjectName: 'Geography',
    topicId: 'geo_topographical_maps',
    topicTitle: 'Topographical Map Interpretation & Cross-Sections',
    studyGoal: 'Practicing vertical exaggeration calculations and gradient analysis.',
    isOnline: true,
    status: 'ready_to_tutor',
    lastActive: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    matchScore: 88
  },
  {
    id: 'buddy_anuary_kibaha',
    userId: 'seed_anuary',
    displayName: 'Anuary M. (Kibaha Secondary)',
    avatarId: 'scholar-literature',
    schoolName: 'Kibaha Secondary School, Pwani',
    region: 'Pwani',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'kiswahili',
    subjectName: 'Kiswahili',
    topicId: 'kisw_ushairi',
    topicTitle: 'Uchambuzi wa Ushairi na Bahari Zake',
    studyGoal: 'Kutambua vina, mizani, kituo cha ubeti, na maudhui ya kimaendeleo katika mashairi.',
    isOnline: true,
    status: 'available',
    lastActive: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    matchScore: 94
  },
  {
    id: 'buddy_faraja_stfrancis',
    userId: 'seed_faraja',
    displayName: 'Faraja L. (St. Francis Girls)',
    avatarId: 'scholar-math',
    schoolName: 'St. Francis Girls Secondary, Mbeya',
    region: 'Mbeya',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'mathematics',
    subjectName: 'Basic Mathematics',
    topicId: 'math_probability',
    topicTitle: 'Probability & Mutually Exclusive Events',
    studyGoal: 'Solving tree diagrams and conditional probability NECTA past exam challenges.',
    isOnline: true,
    status: 'seeking_help',
    lastActive: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
    matchScore: 96
  },
  {
    id: 'buddy_tumaini_jangwani',
    userId: 'seed_tumaini',
    displayName: 'Tumaini E. (Jangwani Girls)',
    avatarId: 'scholar-stem',
    schoolName: 'Jangwani Secondary School, Dar es Salaam',
    region: 'Dar es Salaam',
    gradeLevel: 'Form 4 (CSEE)',
    subjectId: 'english',
    subjectName: 'English Language',
    topicId: 'eng_report_writing',
    topicTitle: 'Formal Report Writing & Letter of Application',
    studyGoal: 'Perfecting passive voice, executive summaries, and formal register for Section C.',
    isOnline: true,
    status: 'available',
    lastActive: new Date(Date.now() - 21 * 60 * 1000).toISOString(),
    matchScore: 86
  }
];

export const TOPIC_PROBLEM_STARTERS: Record<string, { problem: string; initialSteps: string[] }> = {
  'Physics': {
    problem: "A 1200 kg car travelling at 20 m/s collides with a stationary 800 kg truck and both move together. Calculate their common final velocity and kinetic energy lost in the collision (NECTA Section B).",
    initialSteps: [
      "Step 1: State the Law of Conservation of Linear Momentum: Total momentum before collision = Total momentum after collision: m1*u1 + m2*u2 = (m1 + m2)*v.",
      "Step 2: Identify given variables: m1 = 1200 kg, u1 = 20 m/s, m2 = 800 kg, u2 = 0 m/s.",
      "Step 3: Substitute into momentum formula: (1200 * 20) + (800 * 0) = (1200 + 800) * v  ==>  24000 = 2000 * v.",
      "Step 4: Solve for common velocity v: v = 24000 / 2000 = 12 m/s."
    ]
  },
  'Basic Mathematics': {
    problem: "Solve by completing the square method: 2x² - 8x + 6 = 0, and verify the roots using the quadratic formula (NECTA Paper 1 Question 6).",
    initialSteps: [
      "Step 1: Divide the entire equation by the coefficient of x² (which is 2): x² - 4x + 3 = 0.",
      "Step 2: Move the constant term to the right side: x² - 4x = -3.",
      "Step 3: Take half of the coefficient of x, square it, and add to both sides: Half of -4 is -2, (-2)² = 4. Equation becomes: x² - 4x + 4 = -3 + 4.",
      "Step 4: Write left side as a perfect square: (x - 2)² = 1."
    ]
  },
  'Chemistry': {
    problem: "Calculate the volume of carbon dioxide gas at STP produced when 25 grams of pure calcium carbonate (CaCO₃) reacts completely with excess dilute hydrochloric acid (Ca=40, C=12, O=16, Molar gas vol at STP = 22.4 dm³).",
    initialSteps: [
      "Step 1: Write the balanced chemical reaction equation: CaCO₃(s) + 2HCl(aq) -> CaCl₂(aq) + H₂O(l) + CO₂(g).",
      "Step 2: Calculate molar mass of CaCO₃: 40 + 12 + (3 * 16) = 100 g/mol.",
      "Step 3: Calculate number of moles of CaCO₃: moles = mass / molar mass = 25 g / 100 g/mol = 0.25 moles.",
      "Step 4: Use mole ratio from balanced equation: 1 mole CaCO₃ produces 1 mole CO₂. Therefore, moles of CO₂ = 0.25 moles."
    ]
  },
  'Biology': {
    problem: "A man with normal blood clotting marries a woman who is a carrier for haemophilia (an X-linked recessive condition). Using genetic diagrams, determine the phenotypic ratio of their offspring and the probability of their sons being haemophiliac.",
    initialSteps: [
      "Step 1: Define gene alleles: Let Xᴴ = normal blood clotting allele, Xʰ = haemophilia allele, Y = male chromosome without allele.",
      "Step 2: Determine parent genotypes: Father (normal male) = XᴴY; Mother (carrier female) = XᴴXʰ.",
      "Step 3: Perform genetic cross gametes: Father produces Xᴴ and Y; Mother produces Xᴴ and Xʰ.",
      "Step 4: Offspring genotypes: XᴴXᴴ (normal female 25%), XᴴXʰ (carrier female 25%), XᴴY (normal male 25%), XʰY (haemophiliac male 25%)."
    ]
  }
};
