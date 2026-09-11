export interface ExamItem {
  id: string;
  title: string;
  level: 'PSLE' | 'FTNA' | 'CSEE' | 'ACSEE';
  levelFull: string;
  subject: string;
  year: string;
  examType: 'National NECTA' | 'Regional Mock' | 'Terminal Exam';
  questionCount: number;
  durationMinutes: number;
  code?: string;
  pdfQuestionsUrl?: string;
  pdfMarkingSchemeUrl?: string;
  examinerReport: {
    summary: string;
    commonPitfalls: string[];
    examinerAdvice: string;
  };
  sampleQuestions: {
    qNum: number;
    question: string;
    options?: string[];
    answerKey: string;
    markingNotes: string;
  }[];
}

export const ALL_NECTA_PAST_PAPERS: ExamItem[] = [
  // ==========================================
  // 1. PSLE (STANDARD 7 - PRIMARY LEAVING EXAM)
  // ==========================================
  {
    id: 'psle-math-2023',
    title: 'PSLE Hisabati (Mathematics) 2023',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'Mathematics',
    year: '2023',
    code: '04',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Kiwango cha ufaulu kilikuwa 74.2%. Watahiniwa wengi walipoteza alama kwenye maswali ya sehemu na asilimia.',
      commonPitfalls: [
        'Kutobadili sehemu mseto kuwa sehemu za kawaida kabla ya kuzidisha au kugawanya.',
        'Kutoelewa tofauti ya eneo la mduara (A = πr²) na mzingo wa mduara (C = 2πr).',
        'Kukosea katika maswali ya kubadili vizio vya metriki (km kwenda m, na gramu kwenda kg).'
      ],
      examinerAdvice: 'Wanafunzi wasome swali kwa makini, waweke vielelezo sahihi na kukagua majibu yao kabla ya kukabidhi karatasi.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Tafuta eneo la mstatili wenye urefu wa sm 12 na upana wa sm 8.',
        options: ['sm² 96', 'sm 40', 'sm² 48', 'sm² 20'],
        answerKey: 'sm² 96',
        markingNotes: 'Eneo = Urefu × Upana = 12 × 8 = sm² 96. Alama kamili kwa fomula na jibu sahihi na kizio.'
      },
      {
        qNum: 2,
        question: 'Rahisisha: 3/4 + 2/5 = ?',
        options: ['23/20 (1 3/20)', '5/9', '6/20', '1 1/5'],
        answerKey: '23/20 (1 3/20)',
        markingNotes: 'Kipata Kigawe Kidogo Zaidi (K.K.K) cha 4 na 5 ni 20. (15 + 8)/20 = 23/20 = 1 3/20.'
      },
      {
        qNum: 3,
        question: 'Iwapo 25% ya wanafunzi 60 wa darasa la saba ni wasichana, kuna wavulana wangapi darasani?',
        options: ['45 wavulana', '15 wavulana', '30 wavulana', '40 wavulana'],
        answerKey: '45 wavulana',
        markingNotes: 'Asilimia ya wavulana = 100% - 25% = 75%. Idadi = 0.75 × 60 = 45 wavulana.'
      }
    ]
  },
  {
    id: 'psle-math-2022',
    title: 'PSLE Hisabati (Mathematics) 2022',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'Mathematics',
    year: '2022',
    code: '04',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Ufaulu mzuri kwenye hesabu za kujumlisha na kutoa namba kamili. Changamoto ilionekana kwenye maswali ya uwiano na viwango vya riba sahili.',
      commonPitfalls: [
        'Kusahau kuweka muda katika miaka wakati wa kutumia fomula ya riba sahili (I = PRT/100).',
        'Kukosea katika kugawa rasilimali kulingana na uwiano uliotolewa.'
      ],
      examinerAdvice: 'Kufanya mazoezi ya kutosha juu ya matumizi ya uwiano na faida/hasara katika maisha ya kila siku.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Tafuta K.K.K cha namba 12, 18 na 24.',
        options: ['72', '36', '144', '6'],
        answerKey: '72',
        markingNotes: 'K.K.K = 2³ × 3² = 8 × 9 = 72. Alama kamili kwa njia na jibu.'
      },
      {
        qNum: 2,
        question: 'Tafuta mzingo wa bustani yenye umbo la duara yenye kipenyo cha mita 14 (Tumia π = 22/7).',
        options: ['44 m', '154 m²', '88 m', '22 m'],
        answerKey: '44 m',
        markingNotes: 'Mzingo = πd = (22/7) × 14 = 44 mita.'
      }
    ]
  },
  {
    id: 'psle-sci-2023',
    title: 'PSLE Sayansi na Teknolojia 2023',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'Biology / Sayansi',
    year: '2023',
    code: '05',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Wanafunzi walionyesha uelewa mpana wa mzunguko wa damu na vyanzo vya nishati. Hata hivyo, maswali kuhusu kinga ya mwili na magonjwa ya kuambukiza yalikuwa na udhaifu.',
      commonPitfalls: [
        'Kutofautisha vimelea vya malaria (Plasmodium) na mdudu anayeeneza (Mbu jike wa Anopheles).',
        'Kuchanganya seli hai nyeupe za damu na chembe sahani (platelets).'
      ],
      examinerAdvice: 'Walimu wazingatie vitendo na vielelezo vya wazi kuhusu mifumo ya mwili wa binadamu na mimea.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Ni sehemu gani ya jani la mmea ambapo usanisinuru (photosynthesis) hufanyika zaidi?',
        options: ['Kloroplasti (Chloroplasts)', 'Mizizi', 'Shina', 'Gome la nje'],
        answerKey: 'Kloroplasti (Chloroplasts)',
        markingNotes: 'Kloroplasti zina klorofili inayovuta mwanga wa jua kwa ajili ya kutengeneza chakula.'
      },
      {
        qNum: 2,
        question: 'Kazi kuu ya chembechembe nyeupe za damu (white blood cells) mwilini ni nini?',
        options: ['Kupambana na viini vya magonjwa', 'Kusafirisha oksijeni', 'Kugandisha damu', 'Kuyeyusha chakula'],
        answerKey: 'Kupambana na viini vya magonjwa',
        markingNotes: 'Seli nyeupe ni jeshi la ulinzi wa mwili dhidi ya vimelea.'
      }
    ]
  },
  {
    id: 'psle-kisw-2023',
    title: 'PSLE Kiswahili 2023',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'Kiswahili',
    year: '2023',
    code: '01',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Ufaulu wa jumla ulikuwa mzuri sana kwenye sehemu ya Ufahamu na Methali. Changamoto ilijitokeza kwenye sarufi ya ngeli za nomino na vitenzi vya kurejelea.',
      commonPitfalls: [
        'Kushindwa kuainisha ngeli ya maneno kama "Ukuta" (U-ZI) au "Mti" (U-I).',
        'Kutumia vibaya viambishi ngeli katika sentensi changamano.'
      ],
      examinerAdvice: 'Kusoma mara kwa mara kazi za fasihi simulizi na kufanya mazoezi ya kuainisha ngeli za Kiswahili Sanifu.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Tegua kitendawili: "Nyumba yangu haina mlango lakini ina madirisha mengi."',
        options: ['Chujio / Tundu la chandarua', 'Yai', 'Kaburi', 'Kalamu'],
        answerKey: 'Chujio / Tundu la chandarua',
        markingNotes: 'Teguzi sahihi ya kitendawili hiki ni chujio au tundu la chandarua.'
      },
      {
        qNum: 2,
        question: 'Kamilisha methali: "Mvumilivu hula ______."',
        options: ['Mbivu', 'Mbichi', 'Tamu', 'Nzuri'],
        answerKey: 'Mbivu',
        markingNotes: 'Mvumilivu hula mbivu inahimiza subira na uvumilivu kazini.'
      }
    ]
  },
  {
    id: 'psle-eng-2023',
    title: 'PSLE English Language 2023',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'English Language',
    year: '2023',
    code: '02',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Performance was commendable in basic vocabulary and sentence completion. Tenses (Past Perfect Continuous) and irregular plural nouns showed notable errors.',
      commonPitfalls: [
        'Writing "childs" or "sheeps" instead of irregular forms "children" and "sheep".',
        'Confusing subject-verb agreement when using "neither... nor" and "either... or".'
      ],
      examinerAdvice: 'Encourage daily English speaking, reading storybooks, and memorizing irregular verb and noun patterns.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Choose the correct preposition: Juma is very good ______ playing football.',
        options: ['at', 'in', 'on', 'with'],
        answerKey: 'at',
        markingNotes: 'The adjective "good" is followed by the preposition "at" when referring to ability or skill.'
      },
      {
        qNum: 2,
        question: 'What is the plural form of the word "Tooth"?',
        options: ['Teeth', 'Tooths', 'Teethes', 'Toothies'],
        answerKey: 'Teeth',
        markingNotes: 'Irregular vowel change plural: tooth -> teeth.'
      }
    ]
  },
  {
    id: 'psle-soc-2023',
    title: 'PSLE Maarifa ya Jamii (Social Studies) 2023',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'Geography',
    year: '2023',
    code: '03',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Ufaulu wa juu katika sehemu ya jiografia ya Tanzania na maeneo ya kihistoria. Changamoto ilionekana katika maswali ya ramani (scale calculation) na mabadiliko ya tabianchi.',
      commonPitfalls: [
        'Kushindwa kubadili kipimio cha mstari kuwa kipimio cha uwiano (Representative Fraction).',
        'Kukosea mwaka wa Muungano wa Tanganyika na Zanzibar (26 Aprili 1964).'
      ],
      examinerAdvice: 'Wanafunzi wajifunze kusoma ramani kwa vitendo na kuelewa misingi ya historia ya ukombozi wa taifa letu.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Muungano wa Tanganyika na Zanzibar ulifanyika tarehe na mwaka gani?',
        options: ['26 Aprili 1964', '9 Desemba 1961', '12 Januari 1964', '14 Oktoba 1999'],
        answerKey: '26 Aprili 1964',
        markingNotes: 'Tarehe 26 Aprili 1964 ndio siku rasmi ya Muungano wa Tanganyika na Zanzibar chini ya Mwl. Nyerere na Abeid Karume.'
      },
      {
        qNum: 2,
        question: 'Mlima mrefu zaidi barani Afrika unaopatikana nchini Tanzania unaitwa nini?',
        options: ['Mlima Kilimanjaro', 'Mlima Meru', 'Mlima Rungwe', 'Mlima Kenya'],
        answerKey: 'Mlima Kilimanjaro',
        markingNotes: 'Mlima Kilimanjaro una urefu wa mita 5,895 juu ya usawa wa bahari.'
      }
    ]
  },
  {
    id: 'psle-civ-2023',
    title: 'PSLE Uraia na Maadili (Civic & Moral Education) 2023',
    level: 'PSLE',
    levelFull: 'Standard 7 Primary School Leaving Examination',
    subject: 'Civics / Uraia',
    year: '2023',
    code: '06',
    examType: 'National NECTA',
    questionCount: 45,
    durationMinutes: 120,
    examinerReport: {
      summary: 'Watahiniwa wengi walifanya vizuri katika maswali ya haki za mtoto na uzalendo. Udhaifu ulionekana katika nguzo kuu tatu za serikali na majukumu ya Bunge.',
      commonPitfalls: [
        'Kutofautisha mihimili mitatu ya dola: Serikali Kuu, Bunge, na Mahakama.',
        'Kushindwa kufafanua wajibu wa raia kinyume na haki za raia.'
      ],
      examinerAdvice: 'Kuhimiza klabu za uraia shuleni ili kukuza maadili mema na uelewa wa Katiba ya Jamhuri ya Muungano wa Tanzania.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Ni chombo gani chenye mamlaka ya kutunga sheria katika Jamhuri ya Muungano wa Tanzania?',
        options: ['Bunge la Jamhuri ya Muungano', 'Mahakama Kuu', 'Baraza la Mawaziri', 'Jeshi la Polisi'],
        answerKey: 'Bunge la Jamhuri ya Muungano',
        markingNotes: 'Bunge lina jukumu la kikatiba la kutunga sheria na kuisimamia Serikali.'
      },
      {
        qNum: 2,
        question: 'Alama ipi ya Taifa inayowakilisha mamlaka, heshima na uwepo wa Jamhuri ya Muungano wa Tanzania kimataifa?',
        options: ['Ngao ya Taifa na Bendera ya Taifa', 'Picha ya Rais pekee', 'Mwenge wa Uhuru pekee', 'Maliasili'],
        answerKey: 'Ngao ya Taifa na Bendera ya Taifa',
        markingNotes: 'Ngao ya Taifa na Bendera ya Taifa ndizo alama rasmi za utaifa wetu.'
      }
    ]
  },

  // ==========================================
  // 2. FTNA (FORM 2 - NATIONAL ASSESSMENT)
  // ==========================================
  {
    id: 'ftna-math-2023',
    title: 'FTNA Basic Mathematics 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'Mathematics',
    year: '2023',
    code: '041',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Pass rate was 71.5%. Candidates showed solid grasp of sets, numbers, and basic algebra, but had difficulties in coordinate geometry and Pythagoras theorem applications.',
      commonPitfalls: [
        'Finding gradient of a line: reversing Δy/Δx into Δx/Δy.',
        'Improper expansion of binomial expressions like (x - 3)² leading to x² - 9 instead of x² - 6x + 9.',
        'Omitting proper signs when transposing terms across linear equations.'
      ],
      examinerAdvice: 'Practice step-by-step algebraic expansion and sketch cartesian axes clearly with labeled intercepts.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Find the equation of the line passing through points A(2, 3) and B(4, 7).',
        options: ['y = 2x - 1', 'y = 2x + 1', 'y = x + 3', 'y = 3x - 1'],
        answerKey: 'y = 2x - 1',
        markingNotes: 'Gradient m = (7-3)/(4-2) = 4/2 = 2. Using y - y1 = m(x - x1) => y - 3 = 2(x - 2) => y = 2x - 1.'
      },
      {
        qNum: 2,
        question: 'If Set A = {1, 2, 3, 4, 5} and Set B = {3, 4, 5, 6, 7}, find the intersection n(A ∩ B).',
        options: ['3', '{3, 4, 5}', '5', '7'],
        answerKey: '3',
        markingNotes: 'A ∩ B = {3, 4, 5}, thus the number of elements n(A ∩ B) = 3.'
      }
    ]
  },
  {
    id: 'ftna-sci-2023',
    title: 'FTNA Basic Science 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'Physics',
    year: '2023',
    code: '031',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Strong performance across kinematics and density problems. Rural candidates lost marks in electric circuit diagrams and Archimedes principle definitions.',
      commonPitfalls: [
        'Confusing mass and weight units (kilograms vs Newtons).',
        'Drawing circuit meters in reverse: connecting voltmeter in series instead of parallel.',
        'Omitting the buoyancy statement: "upthrust equals weight of fluid displaced".'
      ],
      examinerAdvice: 'Emphasize SI units strictly and practice drawing clean laboratory apparatus schematics.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'A solid metal block has a mass of 400 grams and a volume of 50 cm³. Calculate its density.',
        options: ['8 g/cm³', '0.125 g/cm³', '20 g/cm³', '800 g/cm³'],
        answerKey: '8 g/cm³',
        markingNotes: 'Density = Mass / Volume = 400 g / 50 cm³ = 8 g/cm³. 1 mark for formula, 1 for arithmetic, 1 for unit.'
      },
      {
        qNum: 2,
        question: 'State Archimedes Principle.',
        options: [
          'When a body is totally or partially immersed in a fluid, it experiences an upthrust equal to the weight of fluid displaced.',
          'Pressure applied to an enclosed liquid is transmitted equally in all directions.',
          'For every action there is an equal and opposite reaction.',
          'Mass cannot be created or destroyed in a closed system.'
        ],
        answerKey: 'When a body is totally or partially immersed in a fluid, it experiences an upthrust equal to the weight of fluid displaced.',
        markingNotes: 'Award 2 marks for complete verbatim principle including upthrust and weight of fluid displaced.'
      }
    ]
  },
  {
    id: 'ftna-bio-2023',
    title: 'FTNA Biology 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'Biology / Sayansi',
    year: '2023',
    code: '033',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Candidates performed well on cell biology and nutrition. Errors were concentrated in binomial nomenclature rules and microscope magnification calculations.',
      commonPitfalls: [
        'Failing to underline Latin binomial names (Genus capitalized, species lowercase) when handwritten.',
        'Calculating total magnification: adding eyepiece and objective lens instead of multiplying them.'
      ],
      examinerAdvice: 'Always underline scientific names in handwriting and practice labeling biological structures with straight guidelines without arrows.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'If a light microscope has a ×10 eyepiece lens and a ×40 objective lens, what is the total magnification?',
        options: ['×400', '×50', '×4', '×30'],
        answerKey: '×400',
        markingNotes: 'Total magnification = Eyepiece magnification × Objective magnification = 10 × 40 = ×400.'
      },
      {
        qNum: 2,
        question: 'Which enzyme in human saliva begins the digestion of starch into maltose?',
        options: ['Salivary Amylase (Ptyalin)', 'Pepsin', 'Lipase', 'Trypsin'],
        answerKey: 'Salivary Amylase (Ptyalin)',
        markingNotes: 'Amylase breaks down cooked starch into maltose in the buccal cavity.'
      }
    ]
  },
  {
    id: 'ftna-chem-2023',
    title: 'FTNA Chemistry 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'Chemistry',
    year: '2023',
    code: '032',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Candidates demonstrated clear understanding of safety symbols and laboratory apparatus. Writing chemical formulas using valency swapping was the chief source of lost marks.',
      commonPitfalls: [
        'Writing formulas with charges left on top instead of subscript neutral compounds (e.g. Ca²⁺Cl⁻ instead of CaCl₂).',
        'Confusing physical changes (reversible, no new substance) with chemical changes (irreversible, new substance formed).'
      ],
      examinerAdvice: 'Master the valency table of common radicals (SO₄²⁻, NO₃⁻, OH⁻, CO₃²⁻) and practice balancing simple word equations.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'What is the correct chemical formula for Aluminum Oxide (Al valency = 3, O valency = 2)?',
        options: ['Al₂O₃', 'Al₃O₂', 'AlO', 'Al₂O'],
        answerKey: 'Al₂O₃',
        markingNotes: 'Criss-cross valency method: Al (3) and O (2) gives Al₂O₃.'
      },
      {
        qNum: 2,
        question: 'Which of the following processes represents a chemical change?',
        options: ['Rusting of iron in moist air', 'Melting of ice into water', 'Dissolving sugar in tea', 'Sublimation of iodine crystals'],
        answerKey: 'Rusting of iron in moist air',
        markingNotes: 'Rusting forms a brand-new substance (hydrated iron(III) oxide) and is irreversible.'
      }
    ]
  },
  {
    id: 'ftna-geo-2023',
    title: 'FTNA Geography 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'Geography',
    year: '2023',
    code: '013',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Solar system, rotation and revolution of the earth were well mastered. Errors were rampant in map reading scale calculations and contour interpretation.',
      commonPitfalls: [
        'Confusing rotation (causes day and night, 24 hours) with revolution (causes seasons, 365.25 days).',
        'Failing to convert map distance in centimeters to actual ground distance in kilometers.'
      ],
      examinerAdvice: 'Use three-dimensional models of earth globes and practice drawing contour hills, ridges, and valleys.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'On a topographic map of scale 1:50,000, what is the actual ground distance represented by a 6 cm straight line?',
        options: ['3 kilometers', '300 meters', '30 kilometers', '0.3 kilometers'],
        answerKey: '3 kilometers',
        markingNotes: '1 cm represents 50,000 cm = 500 m = 0.5 km. Therefore 6 cm = 6 × 0.5 = 3 km.'
      },
      {
        qNum: 2,
        question: 'What celestial event occurs when the Moon passes directly between the Earth and the Sun, casting a shadow on Earth?',
        options: ['Solar Eclipse (Kupatwa kwa Jua)', 'Lunar Eclipse (Kupatwa kwa Mwezi)', 'Equinox', 'Solstice'],
        answerKey: 'Solar Eclipse (Kupatwa kwa Jua)',
        markingNotes: 'Solar eclipse occurs when the Moon blocks the light of the Sun.'
      }
    ]
  },
  {
    id: 'ftna-hist-2023',
    title: 'FTNA History 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'History',
    year: '2023',
    code: '012',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Solid performance in human evolution stages (Australopithecus to Homo Sapiens). Weakness noted in the development of social and political systems in pre-colonial Tanzania.',
      commonPitfalls: [
        'Confusing discovery of Olduvai Gorge hominid fossils by Dr. Louis and Mary Leakey in 1959.',
        'Muddling clan organization (lineage-based) with age-set systems (like the Maasai warrior Moran system).'
      ],
      examinerAdvice: 'Create chronological timelines for the Stone Ages and pre-colonial East African centralized kingdoms.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'At which famous Tanzanian archaeological site was the skull of Zinjanthropus (Australopithecus boisei) discovered in 1959?',
        options: ['Olduvai Gorge (Ngorongoro)', 'Isimila Stone Age Site', 'Engaruka Ruins', 'Kilwa Kisiwani'],
        answerKey: 'Olduvai Gorge (Ngorongoro)',
        markingNotes: 'Discovered by Dr. Mary Leakey at Olduvai Gorge in northern Tanzania.'
      },
      {
        qNum: 2,
        question: 'What was the primary motive behind the expansion of the Ngoni migration into East Africa during the 19th century?',
        options: ['Mfecane wars and search for fertile land/cattle', 'Trade in cloves with Arabs', 'Spread of Christianity', 'Search for ivory along the coast'],
        answerKey: 'Mfecane wars and search for fertile land/cattle',
        markingNotes: 'The rise of Shaka Zulu in South Africa triggered the Mfecane upheaval pushing the Ngoni northwards.'
      }
    ]
  },
  {
    id: 'ftna-civ-2023',
    title: 'FTNA Civics 2023',
    level: 'FTNA',
    levelFull: 'Form 2 National Assessment',
    subject: 'Civics / Uraia',
    year: '2023',
    code: '011',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 150,
    examinerReport: {
      summary: 'Candidates articulated life skills and human rights principles well. Lost marks on local government authorities (LGA) composition and municipal councils.',
      commonPitfalls: [
        'Confusing duties of the Ward Executive Officer (WEO) with the Ward Councilor (Diwani).',
        'Misinterpreting categories of human rights: civil/political vs social/economic.'
      ],
      examinerAdvice: 'Study the administrative structure of districts, wards, and villages in Tanzania.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Who is the political representative of a Ward elected by citizens during civic elections in Tanzania?',
        options: ['Ward Councilor (Diwani)', 'Ward Executive Officer (WEO)', 'District Commissioner (DC)', 'Member of Parliament (MP)'],
        answerKey: 'Ward Councilor (Diwani)',
        markingNotes: 'The Councilor (Diwani) is the elected political representative of a ward in local government.'
      },
      {
        qNum: 2,
        question: 'Which category of human rights guarantees the right to life, freedom of speech, and protection against torture?',
        options: ['Civil and Political Rights', 'Economic and Cultural Rights', 'Environmental Rights', 'Commercial Rights'],
        answerKey: 'Civil and Political Rights',
        markingNotes: 'Civil and political rights are first-generation rights protecting individual liberties.'
      }
    ]
  },

  // ==========================================
  // 3. CSEE (FORM 4 - O-LEVEL NATIONAL EXAM)
  // ==========================================
  {
    id: 'csee-math-2023',
    title: 'CSEE Mathematics 2023 Paper 1',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Mathematics',
    year: '2023',
    code: '041',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Overall candidate performance was satisfactory, with 68.4% passing. However, many lost marks in Quadratic Equations and Trigonometric ratios.',
      commonPitfalls: [
        'Failing to simplify radical expressions before substituting values.',
        'Misinterpreting word problems involving simultaneous linear equations.',
        'Ignoring negative square roots in quadratic formula steps.'
      ],
      examinerAdvice: 'Candidates must show all clear working steps. Marks are awarded for method even if final arithmetic contains minor errors.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Solve for x: 2x² - 5x + 2 = 0 using the quadratic formula.',
        options: ['x = 2 or x = 0.5', 'x = -2 or x = -0.5', 'x = 3 or x = 1', 'x = 5 or x = 2'],
        answerKey: 'x = 2 or x = 0.5',
        markingNotes: 'Award 1 mark for correct formula setup, 1 mark for discriminant evaluation (b²-4ac = 9), 1 mark for correct roots.'
      },
      {
        qNum: 2,
        question: 'A ladder 5m long rests against a vertical wall. If the foot of the ladder is 3m from the base, find the height reached.',
        options: ['4 meters', '3.5 meters', '2.5 meters', '4.5 meters'],
        answerKey: '4 meters',
        markingNotes: 'Use Pythagoras theorem: h = √(5² - 3²) = √16 = 4m. Award full marks for labeled diagram and working.'
      },
      {
        qNum: 3,
        question: 'Find the probability of rolling an odd number or a prime number on a single standard 6-sided die.',
        options: ['2/3 (4/6)', '1/2 (3/6)', '5/6', '1/3'],
        answerKey: '2/3 (4/6)',
        markingNotes: 'Odd = {1, 3, 5}, Prime = {2, 3, 5}. Union = {1, 2, 3, 5} => 4 favorable outcomes out of 6 => 4/6 = 2/3.'
      }
    ]
  },
  {
    id: 'csee-math-2022',
    title: 'CSEE Mathematics 2022 Paper 1',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Mathematics',
    year: '2022',
    code: '041',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Candidates scored highly on statistics (mean, median) and matrices, but dropped marks on linear programming inequalities and coordinate geometry tangents.',
      commonPitfalls: [
        'Shading the wrong side of inequalities on graph sheets (unwanted region vs wanted region convention).',
        'Failing to find determinant before computing 2×2 matrix inverse.'
      ],
      examinerAdvice: 'Always state whether you are shading the feasible region or the unwanted region when graphing inequalities.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Calculate the determinant of matrix A = [[3, 2], [1, 4]].',
        options: ['10', '14', '12', '8'],
        answerKey: '10',
        markingNotes: 'det(A) = (3 × 4) - (2 × 1) = 12 - 2 = 10.'
      },
      {
        qNum: 2,
        question: 'Find the sum of the first 10 terms of an arithmetic progression whose first term a = 3 and common difference d = 4.',
        options: ['210', '190', '240', '180'],
        answerKey: '210',
        markingNotes: 'Sn = (n/2)[2a + (n-1)d] = (10/2)[2(3) + 9(4)] = 5[6 + 36] = 5 × 42 = 210.'
      }
    ]
  },
  {
    id: 'csee-phy-2023',
    title: 'CSEE Physics 1 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Physics',
    year: '2023',
    code: '031',
    examType: 'National NECTA',
    questionCount: 11,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Candidates performed strongly in Mechanics but struggled in Current Electricity circuits and Electromagnetic induction calculations.',
      commonPitfalls: [
        'Forgetting SI unit labels in final numerical responses (e.g., writing 20 instead of 20 Amperes or 20 A).',
        'Incorrect parallel resistor combination formula setup (1/Rt = 1/R1 + 1/R2).',
        'Confusing Snell Law angle of incidence with angle to the mirror surface.'
      ],
      examinerAdvice: 'Always state the physics principle or formula first before plugging in numerical values with proper SI units.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Calculate the total resistance when two 6Ω resistors are connected in parallel.',
        options: ['3 Ω', '12 Ω', '6 Ω', '1.5 Ω'],
        answerKey: '3 Ω',
        markingNotes: '1/Rt = 1/6 + 1/6 = 2/6 = 1/3 => Rt = 3 Ω. Penalty of 0.5 marks for omitting the Ohm symbol.'
      },
      {
        qNum: 2,
        question: 'A transformer has 500 turns in the primary coil and 100 turns in the secondary coil. If the primary voltage is 240V, find the secondary output voltage.',
        options: ['48 V', '1200 V', '24 V', '480 V'],
        answerKey: '48 V',
        markingNotes: 'Vs/Vp = Ns/Np => Vs/240 = 100/500 = 1/5 => Vs = 240/5 = 48 Volts.'
      }
    ]
  },
  {
    id: 'csee-chem-2023',
    title: 'CSEE Chemistry 1 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Chemistry',
    year: '2023',
    code: '032',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Pass rate was 65.8%. Stoichiometry mole calculations and electrolysis half-equations caused major mark deductions.',
      commonPitfalls: [
        'Forgetting state symbols (s, l, g, aq) in chemical equations.',
        'Incorrect molar gas volume at standard temperature and pressure (STP = 22.4 dm³/mol).'
      ],
      examinerAdvice: 'Include state symbols in all balanced chemical equations and practice cathode/anode electron transfer reactions.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Calculate the number of moles in 88 grams of carbon dioxide gas (CO₂). (Relative atomic masses: C = 12, O = 16).',
        options: ['2.0 moles', '4.0 moles', '0.5 moles', '1.5 moles'],
        answerKey: '2.0 moles',
        markingNotes: 'Molar mass of CO₂ = 12 + (16 × 2) = 44 g/mol. Moles = Mass / Molar mass = 88 / 44 = 2.0 moles.'
      },
      {
        qNum: 2,
        question: 'During electrolysis of dilute sulfuric acid, what gas is discharged at the cathode?',
        options: ['Hydrogen gas (H₂)', 'Oxygen gas (O₂)', 'Sulfur dioxide (SO₂)', 'Chlorine gas (Cl₂)'],
        answerKey: 'Hydrogen gas (H₂)',
        markingNotes: 'Hydrogen ions H⁺ are discharged at cathode: 2H⁺ + 2e⁻ -> H₂(g).'
      }
    ]
  },
  {
    id: 'csee-bio-2023',
    title: 'CSEE Biology 1 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Biology / Sayansi',
    year: '2023',
    code: '033',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Genetics, monohybrid crosses, and kidney nephron diagrams were well represented, but homeostasis negative feedback was poorly explained.',
      commonPitfalls: [
        'Writing phenotypic ratios without attaching the descriptive trait names (e.g. writing 3:1 instead of 3 Tall : 1 Dwarf).',
        'Confusing hormone insulin (lowers blood glucose) with glucagon (raises blood glucose).'
      ],
      examinerAdvice: 'Clearly distinguish genotype from phenotype and draw Punnett squares with labeled parental gametes.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'In pea plants, tall (T) is dominant over dwarf (t). What is the expected phenotypic ratio of offspring from a heterozygous cross (Tt × Tt)?',
        options: ['3 Tall : 1 Dwarf', '1 Tall : 1 Dwarf', 'All Tall', '2 Tall : 2 Dwarf'],
        answerKey: '3 Tall : 1 Dwarf',
        markingNotes: 'Gametes: T, t from both parents. Offspring genotypes: 1 TT, 2 Tt, 1 tt => 3 Tall, 1 Dwarf.'
      },
      {
        qNum: 2,
        question: 'Which hormone is secreted by the islets of Langerhans in the pancreas to decrease elevated blood sugar levels?',
        options: ['Insulin', 'Glucagon', 'Adrenaline', 'Thyroxine'],
        answerKey: 'Insulin',
        markingNotes: 'Insulin converts excess blood glucose into glycogen stored in liver and muscle cells.'
      }
    ]
  },
  {
    id: 'csee-geo-2023',
    title: 'CSEE Geography 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Geography',
    year: '2023',
    code: '013',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Strong performance on physical geography and weather instruments. Mark losses centered on photogrammetry (vertical aerial photos) and statistical cartograms.',
      commonPitfalls: [
        'Confusing forward bearings with back bearings (must add or subtract 180°).',
        'Failing to specify units in vertical exaggeration (VE = Vertical Scale / Horizontal Scale).'
      ],
      examinerAdvice: 'Carry geometric mathematical sets to the examination room and measure map distances with straight-edged paper strips.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'If the forward bearing of point B from point A is 065°, what is the back bearing of point A from point B?',
        options: ['245°', '115°', '335°', '155°'],
        answerKey: '245°',
        markingNotes: 'Since forward bearing < 180°, Back Bearing = Forward Bearing + 180° = 65° + 180° = 245°.'
      },
      {
        qNum: 2,
        question: 'What type of cloud is fluffy, cotton-wool like, with a flat base, associated with fair weather conditions?',
        options: ['Cumulus', 'Cirrus', 'Stratus', 'Cumulonimbus'],
        answerKey: 'Cumulus',
        markingNotes: 'Cumulus clouds are heaped, cotton-wool clouds signifying fine weather.'
      }
    ]
  },
  {
    id: 'csee-hist-2023',
    title: 'CSEE History 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'History',
    year: '2023',
    code: '012',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Candidates wrote articulate essays on the Maji Maji war and the scramble for Africa. However, post-independence economic policies (Arusha Declaration 1967) suffered factual mix-ups.',
      commonPitfalls: [
        'Treating the Berlin Conference (1884-1885) as the start of colonization rather than partition guidelines.',
        'Writing one-sided narrative essays without historical analytical arguments.'
      ],
      examinerAdvice: 'Structure history essays with an introduction defining terms, 5 well-explained body paragraphs with Tanzanian case studies, and a reasoned conclusion.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Which prominent spiritual leader inspired the 1905–1907 Maji Maji uprising against German colonial rule in southern Tanganyika?',
        options: ['Kinjikitile Ngwale', 'Chief Mkwawa', 'Abushiri ibn Salim', 'Bwana Heri'],
        answerKey: 'Kinjikitile Ngwale',
        markingNotes: 'Kinjikitile administered sacred water (maji) from the Rufiji river at Ngarambe as divine protection.'
      },
      {
        qNum: 2,
        question: 'What was the historic blueprint for socialism and self-reliance (Ujamaa na Kujitegemea) announced by Mwalimu Julius K. Nyerere in February 1967?',
        options: ['The Arusha Declaration (Azimio la Arusha)', 'The Zanzibar Treaty', 'The Tabora Agreement', 'The Dar es Salaam Accord'],
        answerKey: 'The Arusha Declaration (Azimio la Arusha)',
        markingNotes: 'Adopted in 1967 to steer Tanzania toward African socialism, equality, and public ownership of the major means of production.'
      }
    ]
  },
  {
    id: 'csee-eng-2023',
    title: 'CSEE English Language 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'English Language',
    year: '2023',
    code: '022',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Essay writing mechanics and comprehension were satisfactory. Literary analysis (analyzing poems and plays like "The Lion and the Jewel" or "Passed Like a Shadow") showed weak quotation support.',
      commonPitfalls: [
        'Retelling the story plot rather than analyzing character development, themes, and stylistic devices.',
        'Spelling and punctuation errors in formal letter and CV writing formats.'
      ],
      examinerAdvice: 'Always link literary themes to contemporary Tanzanian societal issues (e.g. corruption, gender equality, HIV/AIDS).'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Convert into reported speech: Juma said, "I am studying for my NECTA examination today."',
        options: [
          'Juma said that he was studying for his NECTA examination that day.',
          'Juma said that I am studying for my NECTA examination today.',
          'Juma said that he is studying for his examination that day.',
          'Juma told that he had studied for his NECTA examination.'
        ],
        answerKey: 'Juma said that he was studying for his NECTA examination that day.',
        markingNotes: 'Present continuous "am studying" becomes past continuous "was studying", pronoun "I" becomes "he", and "today" shifts to "that day".'
      },
      {
        qNum: 2,
        question: 'Identify the poetic device used in the line: "The wind whispered softly through the lonely trees."',
        options: ['Personification', 'Simile', 'Metaphor', 'Hyperbole'],
        answerKey: 'Personification',
        markingNotes: 'Giving human qualities (whispering) to non-human elements (the wind).'
      }
    ]
  },
  {
    id: 'csee-kisw-2023',
    title: 'CSEE Kiswahili 2023 Karatasi ya 1',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Kiswahili',
    year: '2023',
    code: '021',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Ufaulu mzuri kwenye Fasihi ya Kiswahili na Insha za hotuba. Udhaifu ulionekana kwenye kutoa mifano sahihi ya miundo ya sentensi changamano na tungo virai.',
      commonPitfalls: [
        'Kukanganya kirai nomino (KN) na kirai kitenzi (KT) katika mchoro wa matawi wa sentensi.',
        'Kushindwa kufafanua ujumbe na falsafa ya mwandishi katika tamthiliya na riwaya teule.'
      ],
      examinerAdvice: 'Watahiniwa wajizoeze kuchora vielelezo matawi vya sentensi na kutoa dondoo sahihi kutoka vitabu teule vya NECTA.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Bainisha aina ya kiima katika sentensi ifuatayo: "Kusoma kwa bidii kumenisaidia kufaulu."',
        options: ['Kiima kitenzi jina (Nomino kitenzi-jina)', 'Kiima nomino ya pekee', 'Kiima kiwakilishi', 'Kiima kishazi tegemezi'],
        answerKey: 'Kiima kitenzi jina (Nomino kitenzi-jina)',
        markingNotes: '"Kusoma" ni nomino kitenzi jina (U-ngeli ya KU) inayotenda kazi kama kiima cha sentensi.'
      },
      {
        qNum: 2,
        question: 'Ni fani gani ya kifasihi inayotumia wanyama kama wahusika wakuu wanaowakilisha tabia za binadamu?',
        options: ['Ngano za wanyama (Fable / Hekaya)', 'Tarihi', 'Visasili', 'Mighani'],
        answerKey: 'Ngano za wanyama (Fable / Hekaya)',
        markingNotes: 'Hekaya/ngano za wanyama hutumia tabia za wanyama (kama sungura na fisi) kufundisha maadili kwa jamii.'
      }
    ]
  },
  {
    id: 'csee-civ-2023',
    title: 'CSEE Civics 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Civics / Uraia',
    year: '2023',
    code: '011',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Road safety, citizenship, and gender empowerment were well tackled. Weak answers appeared on the difference between the 1977 Union Constitution and the Bill of Rights 1984.',
      commonPitfalls: [
        'Failing to cite specific constitutional amendments that incorporated human rights into Tanzania\'s Constitution in 1984.',
        'Generic essay paragraphs lacking concrete government institutions (e.g. PCCB/TAKUKURU, CHRAGG).'
      ],
      examinerAdvice: 'Reference statutory bodies by their legal acronyms and mandate in all public administration essays.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Which independent statutory organ in Tanzania is legally tasked with preventing and combating corruption and bribery?',
        options: ['PCCB / TAKUKURU', 'CHRAGG', 'NEC / Tume ya Uchaguzi', 'TRA'],
        answerKey: 'PCCB / TAKUKURU',
        markingNotes: 'Prevention and Combating of Corruption Bureau (TAKUKURU) established under the Prevention and Combating of Corruption Act.'
      },
      {
        qNum: 2,
        question: 'What is the constitutional age requirement for a Tanzanian citizen to vote in General Elections?',
        options: ['18 years and above', '21 years and above', '16 years and above', '25 years and above'],
        answerKey: '18 years and above',
        markingNotes: 'Article 5(1) of the Constitution of the United Republic of Tanzania sets voting age at 18 years.'
      }
    ]
  },
  {
    id: 'csee-comm-2023',
    title: 'CSEE Commerce 2023',
    level: 'CSEE',
    levelFull: 'Form 4 Certificate of Secondary Education',
    subject: 'Economics / Commerce',
    year: '2023',
    code: '061',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Sound knowledge of retail and wholesale functions. Calculations of trade discounts, cash discounts, and turnover speed were the main error areas.',
      commonPitfalls: [
        'Applying cash discount before deducting trade discount from gross catalogue price.',
        'Confusing insurance principle of indemnity (cannot profit from a loss) with subrogation.'
      ],
      examinerAdvice: 'Always calculate Trade Discount first on gross invoice value, then compute Cash Discount on the net prompt payment balance.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'A trader buys goods listed at TZS 100,000 with a 20% trade discount and 5% cash discount for payment within 10 days. If paid on day 5, what is the amount paid?',
        options: ['TZS 76,000', 'TZS 75,000', 'TZS 80,000', 'TZS 74,000'],
        answerKey: 'TZS 76,000',
        markingNotes: 'After trade discount (20%): 100,000 - 20,000 = TZS 80,000. Cash discount (5% of 80,000) = TZS 4,000. Final amount paid = 80,000 - 4,000 = TZS 76,000.'
      },
      {
        qNum: 2,
        question: 'Which fundamental insurance principle states that the insured should be restored to the exact financial position they occupied immediately prior to the loss, without making a profit?',
        options: ['Principle of Indemnity', 'Insurable Interest', 'Utmost Good Faith (Uberrimae Fidei)', 'Proximate Cause'],
        answerKey: 'Principle of Indemnity',
        markingNotes: 'Indemnity ensures compensation only covers actual financial loss.'
      }
    ]
  },

  // ==========================================
  // 4. ACSEE (FORM 6 - ADVANCED LEVEL EXAM)
  // ==========================================
  {
    id: 'acsee-advmath-2023',
    title: 'ACSEE Advanced Mathematics 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Mathematics',
    year: '2023',
    code: '142',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Candidates excelled in linear algebra, complex numbers, and polynomials. Marked struggle appeared in differential equations and integration by parts substitution.',
      commonPitfalls: [
        'Forgetting the arbitrary constant (+ C) in indefinite integrals.',
        'Errors applying de Moivre theorem to fractional complex exponents.',
        'Incorrect sign in integration by parts formula: ∫u dv = uv - ∫v du.'
      ],
      examinerAdvice: 'State integration bounds clearly, simplify algebraic intermediate steps, and verify differential solutions by differentiation.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Evaluate the definite integral: ∫ from 0 to 2 of (3x² + 2x) dx.',
        options: ['12', '10', '14', '8'],
        answerKey: '12',
        markingNotes: '∫(3x² + 2x)dx = [x³ + x²] from 0 to 2 = (2³ + 2²) - (0) = 8 + 4 = 12.'
      },
      {
        qNum: 2,
        question: 'Express the complex number z = 1 + i√3 in polar modulus-argument form r(cosθ + i sinθ).',
        options: ['2(cos(π/3) + i sin(π/3))', '2(cos(π/6) + i sin(π/6))', '4(cos(π/3) + i sin(π/3))', '√2(cos(π/4) + i sin(π/4))'],
        answerKey: '2(cos(π/3) + i sin(π/3))',
        markingNotes: 'Modulus r = √(1² + (√3)²) = √(1 + 3) = 2. Argument θ = tan⁻¹(√3/1) = 60° = π/3 rad.'
      }
    ]
  },
  {
    id: 'acsee-bam-2023',
    title: 'ACSEE Basic Applied Mathematics (BAM) 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'General Studies & BAM',
    year: '2023',
    code: '141',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Passing rate reached 78.1%. Strong answers on matrices and normal distribution probability, but candidates struggled with continuous random variable variance integrals.',
      commonPitfalls: [
        'Integrating probability density function without enforcing total area equals 1.',
        'Confusing binomial distribution mean (μ = np) with Poisson mean.'
      ],
      examinerAdvice: 'Memorize statistical distribution properties and write step-by-step calculus working.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Find the derivative dy/dx of y = e^(3x) + ln(x).',
        options: ['3e^(3x) + 1/x', 'e^(3x) + 1/x', '3e^(3x) + x', 'e^(3x) + ln(x)'],
        answerKey: '3e^(3x) + 1/x',
        markingNotes: 'd/dx[e^(3x)] = 3e^(3x), d/dx[ln(x)] = 1/x. Sum gives 3e^(3x) + 1/x.'
      },
      {
        qNum: 2,
        question: 'In a binomial experiment with n = 20 trials and probability of success p = 0.4, find the expected value (mean).',
        options: ['8.0', '12.0', '4.8', '5.0'],
        answerKey: '8.0',
        markingNotes: 'Mean E(X) = n × p = 20 × 0.4 = 8.0.'
      }
    ]
  },
  {
    id: 'acsee-gs-2023',
    title: 'ACSEE General Studies (GS) 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'General Studies & BAM',
    year: '2023',
    code: '111',
    examType: 'National NECTA',
    questionCount: 7,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Candidates wrote mature essays on regional economic integration (EAC, SADC) and science/technology in socio-economic transformation. Philosophy and epistemology sections were weak.',
      commonPitfalls: [
        'Providing colloquial opinions without anchoring them in recognized political, social, or philosophical theories.',
        'Neglecting the 1999 Tanzania Development Vision 2025 pillars.'
      ],
      examinerAdvice: 'Ground GS arguments in national policy frameworks, continental treaties (AfCFTA), and global sustainable development goals (SDGs).'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'What is the primary overarching objective of the African Continental Free Trade Area (AfCFTA)?',
        options: [
          'Create a single continental market for goods and services with free movement of business persons and investments',
          'Establish a single military defense command across Africa',
          'Adopt a single uniform African continental currency immediately',
          'Abolish all national boundary checkpoints permanently'
        ],
        answerKey: 'Create a single continental market for goods and services with free movement of business persons and investments',
        markingNotes: 'AfCFTA aims to accelerate intra-African trade and boost Africa\'s trading position in the global market.'
      },
      {
        qNum: 2,
        question: 'Which branch of philosophy is primarily concerned with the nature, origin, and limits of human knowledge?',
        options: ['Epistemology', 'Metaphysics', 'Ethics', 'Aesthetics'],
        answerKey: 'Epistemology',
        markingNotes: 'Epistemology investigates what distinguishes justified belief from opinion.'
      }
    ]
  },
  {
    id: 'acsee-phy-2023',
    title: 'ACSEE Physics Paper 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Physics',
    year: '2023',
    code: '131',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Solid mastery shown in projectile motion and simple harmonic motion. Mark penalties occurred in rotational dynamics (moment of inertia) and magnetic flux linkage derivations.',
      commonPitfalls: [
        'Using degrees instead of radians when calculating rotational kinetic energy (1/2 I ω²).',
        'Confusing root mean square voltage (Vrms) with peak voltage (Vo = Vrms × √2).'
      ],
      examinerAdvice: 'Always derive formulas from first principles when requested and verify dimensional homogeneity.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'A projectile is launched from ground level at 50 m/s at an angle of 30° to the horizontal. Calculate its maximum vertical height. (Take g = 10 m/s²).',
        options: ['31.25 meters', '62.5 meters', '25.0 meters', '125.0 meters'],
        answerKey: '31.25 meters',
        markingNotes: 'Uy = 50 sin(30°) = 25 m/s. Hmax = Uy² / (2g) = 25² / (2 × 10) = 625 / 20 = 31.25 m.'
      },
      {
        qNum: 2,
        question: 'What is the root mean square (rms) value of an AC mains voltage whose peak amplitude is 340 Volts?',
        options: ['240.4 Volts', '170.0 Volts', '480.8 Volts', '220.0 Volts'],
        answerKey: '240.4 Volts',
        markingNotes: 'Vrms = Vo / √2 = 340 / 1.4142 ≈ 240.4 Volts.'
      }
    ]
  },
  {
    id: 'acsee-chem-2023',
    title: 'ACSEE Chemistry Paper 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Chemistry',
    year: '2023',
    code: '132',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'High performance in Physical Chemistry, moderate in Organic mechanisms (electrophilic additions).',
      commonPitfalls: [
        'Omitting curved arrows indicating electron pair movement in organic reaction mechanisms.',
        'Incorrect unit conversions in gas constant R calculations (J mol⁻¹ K⁻¹ vs L atm mol⁻¹ K⁻¹).'
      ],
      examinerAdvice: 'Re-read thermodynamic state definitions and ensure unit consistency in all physical equations.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'State Le Chatelier Principle regarding chemical equilibrium in dynamic systems.',
        options: [
          'If a system at equilibrium is disturbed, the equilibrium shifts to counteract the disturbance.',
          'Energy cannot be created or destroyed in chemical reactions.',
          'The rate of reaction is directly proportional to reactant concentration.',
          'Gases at the same temperature have identical kinetic energies.'
        ],
        answerKey: 'If a system at equilibrium is disturbed, the equilibrium shifts to counteract the disturbance.',
        markingNotes: 'Exact state definition awarded 2 marks.'
      },
      {
        qNum: 2,
        question: 'Calculate the pH of a 0.01 M hydrochloric acid (HCl) solution, assuming complete dissociation.',
        options: ['2.0', '1.0', '3.0', '0.01'],
        answerKey: '2.0',
        markingNotes: '[H⁺] = 0.01 = 10⁻² M. pH = -log₁₀[H⁺] = -log₁₀(10⁻²) = 2.0.'
      }
    ]
  },
  {
    id: 'acsee-bio-2023',
    title: 'ACSEE Biology Paper 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Biology / Sayansi',
    year: '2023',
    code: '133',
    examType: 'National NECTA',
    questionCount: 10,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Cytology and molecular genetics (DNA replication, transcription) were well understood. Ecological sampling techniques and nervous transmission action potentials lost marks.',
      commonPitfalls: [
        'Confusing the role of voltage-gated Na⁺ channels (depolarization) with K⁺ channels (repolarization).',
        'Failing to describe the sliding filament theory actin-myosin cross-bridge cycle step-by-step.'
      ],
      examinerAdvice: 'Practice drawing labeled action potential membrane graphs with millivolt values (-70mV resting, +40mV peak).'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'During protein synthesis, which process transcribes genetic code from DNA into messenger RNA (mRNA) inside the cell nucleus?',
        options: ['Transcription', 'Translation', 'Translocation', 'Replication'],
        answerKey: 'Transcription',
        markingNotes: 'Transcription is RNA synthesis guided by RNA polymerase using a DNA template strand.'
      },
      {
        qNum: 2,
        question: 'What triggers depolarization of a neuronal membrane during the transmission of a nerve impulse?',
        options: [
          'Rapid influx of Sodium ions (Na⁺) into the axon through voltage-gated channels',
          'Efflux of Potassium ions (K⁺) out of the axon',
          'Closing of all ion gates simultaneously',
          'Movement of Chloride ions (Cl⁻) into the synaptic cleft'
        ],
        answerKey: 'Rapid influx of Sodium ions (Na⁺) into the axon through voltage-gated channels',
        markingNotes: 'Opening of voltage-gated Na⁺ channels allows Na⁺ to rush in, shifting membrane potential from -70 mV to +40 mV.'
      }
    ]
  },
  {
    id: 'acsee-geo-2023',
    title: 'ACSEE Geography Paper 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Geography',
    year: '2023',
    code: '113',
    examType: 'National NECTA',
    questionCount: 8,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Solid analytical skills on plate tectonics and geomorphology. Mark deductions occurred in soil profile horizons and statistical hypothesis testing (Chi-Square).',
      commonPitfalls: [
        'Confusing constructive plate boundaries (mid-ocean ridges) with destructive boundaries (subduction trenches).',
        'Failing to state null hypothesis (Ho) and degrees of freedom in statistical calculations.'
      ],
      examinerAdvice: 'Always draw neat cross-sectional diagrams of geological faulting, folding, and coastal landforms.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'What landform is created when an oceanic plate collides with and subducts beneath a continental plate?',
        options: ['Deep Ocean Trench and Volcanic Mountain Arc', 'Mid-Ocean Ridge', 'Rift Valley only', 'Horst Block only'],
        answerKey: 'Deep Ocean Trench and Volcanic Mountain Arc',
        markingNotes: 'Subduction forces denser oceanic lithosphere down, forming deep trenches and magma arcs.'
      },
      {
        qNum: 2,
        question: 'Which soil horizon contains the highest accumulation of decomposed organic humus and biological activity?',
        options: ['A Horizon (Topsoil)', 'B Horizon (Subsoil)', 'C Horizon (Weathered parent rock)', 'R Horizon (Bedrock)'],
        answerKey: 'A Horizon (Topsoil)',
        markingNotes: 'The A-horizon is rich in decomposed humus and essential plant nutrients.'
      }
    ]
  },
  {
    id: 'acsee-hist-2023',
    title: 'ACSEE History Paper 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'History',
    year: '2023',
    code: '112',
    examType: 'National NECTA',
    questionCount: 8,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Candidates demonstrated impressive historical synthesis of neo-colonialism and IMF/World Bank structural adjustment programmes. Weakness appeared in evaluating nationalist armed struggle strategies in Southern Africa.',
      commonPitfalls: [
        'Treating FRELIMO, MPLA, and ZANU-PF struggles without comparative tactical analysis.',
        'Writing essays without clear historiographical perspectives (Marxist vs Nationalist schools).'
      ],
      examinerAdvice: 'Cite recognized African historians (Walter Rodney, Bethwell Ogot, Ali Mazrui) to reinforce advanced arguments.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Which groundbreaking historical work authored by Walter Rodney in 1972 critically examined European exploitation of African economies?',
        options: [
          'How Europe Underdeveloped Africa',
          'The Wretched of the Earth',
          'Class Struggles in Africa',
          'Decolonizing the Mind'
        ],
        answerKey: 'How Europe Underdeveloped Africa',
        markingNotes: 'Rodney\'s masterpiece analyzed how imperialist capitalist exploitation extracted wealth, causing systemic underdevelopment.'
      },
      {
        qNum: 2,
        question: 'Why did Tanzania play a pivotal role as the headquarters of the OAU Liberation Committee?',
        options: [
          'Mwalimu Nyerere provided military training bases, diplomatic passports, and logistics for liberation movements',
          'Tanzania possessed the largest military arsenal in Africa',
          'Tanzania was mandated by the United Nations Trusteeship Council',
          'Tanzania had direct borders with South Africa'
        ],
        answerKey: 'Mwalimu Nyerere provided military training bases, diplomatic passports, and logistics for liberation movements',
        markingNotes: 'Tanzania hosted FRELIMO, ANC, PAC, SWAPO, and ZANU camps at Kongwa, Morogoro, and Bagamoyo.'
      }
    ]
  },
  {
    id: 'acsee-econ-2023',
    title: 'ACSEE Economics Paper 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Economics / Commerce',
    year: '2023',
    code: '151',
    examType: 'National NECTA',
    questionCount: 8,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Strong grasp of macroeconomic indicators, GDP calculations, and inflation types. Lost marks on indifference curves, consumer equilibrium tangency, and elasticity equations.',
      commonPitfalls: [
        'Omitting the negative sign or failing to state absolute value in price elasticity of demand (PED).',
        'Confusing cost-push inflation with demand-pull inflation diagrams.'
      ],
      examinerAdvice: 'Draw fully labeled economic diagrams with price on Y-axis and quantity on X-axis, showing clear shift arrows.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'When the price of a good rises by 10% and the quantity demanded falls by 20%, what is the price elasticity of demand (PED)?',
        options: ['-2.0 (Elastic demand)', '-0.5 (Inelastic demand)', '-1.0 (Unitary)', '-0.2'],
        answerKey: '-2.0 (Elastic demand)',
        markingNotes: 'PED = (% Change in Qty Demanded) / (% Change in Price) = -20% / +10% = -2.0. Since |PED| > 1, demand is elastic.'
      },
      {
        qNum: 2,
        question: 'What occurs when the Central Bank (Bank of Tanzania) increases the statutory minimum reserve ratio for commercial banks?',
        options: [
          'Commercial banks\' lending capacity decreases, contracting the money supply and curbing inflation',
          'Interest rates fall, increasing commercial borrowing',
          'The national debt is cancelled immediately',
          'Commercial banks print additional currency notes'
        ],
        answerKey: 'Commercial banks\' lending capacity decreases, contracting the money supply and curbing inflation',
        markingNotes: 'Higher reserve requirements tie up bank liquidity, reducing credit creation.'
      }
    ]
  },
  {
    id: 'acsee-kisw-2023',
    title: 'ACSEE Kiswahili Karatasi ya 1 2023',
    level: 'ACSEE',
    levelFull: 'Form 6 Advanced Certificate of Secondary Education',
    subject: 'Kiswahili',
    year: '2023',
    code: '121',
    examType: 'National NECTA',
    questionCount: 8,
    durationMinutes: 180,
    examinerReport: {
      summary: 'Watahiniwa walionyesha umahiri katika historia na usanifishaji wa Kiswahili (Kamati ya Lugha ya Afrika Mashariki 1930). Changamoto ilikuwa kwenye uchanganuzi wa kifonolojia na mofofonolojia.',
      commonPitfalls: [
        'Kukosea kutofautisha alofoni za fonimu moja na fonimu huru.',
        'Kushindwa kufafanua mchakato wa uundaji wa maneno (unyambuaji vs uambishaji).'
      ],
      examinerAdvice: 'Kufanya mazoezi ya kuainisha ala za sauti, vigezo vya uainishaji konsonanti na vokali, na nadharia za asili ya Kiswahili.'
    },
    sampleQuestions: [
      {
        qNum: 1,
        question: 'Lafudhi (lahaja) gani ya Kiswahili iliyochaguliwa na Kamati ya Lugha ya Afrika Mashariki mwaka 1930 kuwa msingi wa Kiswahili Sanifu?',
        options: ['Kiunguja (lahaja ya Mjini Zanzibar)', 'Kimvita (Mombasa)', 'Kiamu (Lamu)', 'Kipemba'],
        answerKey: 'Kiunguja (lahaja ya Mjini Zanzibar)',
        markingNotes: 'Kiunguja kilichaguliwa kwa sababu kilitumika sana kibiashara na serikalini kote Afrika Mashariki.'
      },
      {
        qNum: 2,
        question: 'Ni nini maana ya fonimu katika isimu ya lugha?',
        options: [
          'Kitengo kidogo kabisa cha sauti katika lugha chenye uwezo wa kubadili maana ya neno',
          'Neno lenye maana kamili katika sentensi',
          'Kikundi cha maneno kisicho na kitenzi kikuu',
          'Muundo wa sarufi unaotawala mpangilio wa sentensi'
        ],
        answerKey: 'Kitengo kidogo kabisa cha sauti katika lugha chenye uwezo wa kubadili maana ya neno',
        markingNotes: 'Fonimu ni sauti ya kifonolojia inayotofautisha maana (k.m. /p/ na /b/ katika "pata" na "bata").'
      }
    ]
  }
];
