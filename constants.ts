import { GradeLevel, GradeSyllabus, EducationLevel } from './types';

export const SYLLABUS_DATA: GradeSyllabus[] = [
  // --- PRIMARY ---
  {
    grade: GradeLevel.Grade1,
    level: EducationLevel.PRIMARY,
    subjects: [
      {
        id: 'math-g1',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm1-1', title: 'Counting 1-100', description: 'Learning numbers.', videoUrl: 'https://www.youtube.com/embed/0TgLtF3PMOc' },
          { id: 'm1-2', title: 'Addition', description: 'Basic adding.', videoUrl: 'https://www.youtube.com/embed/qM7H5j9Y8U0' },
          { id: 'm1-3', title: 'Subtraction', description: 'Basic taking away.' },
          { id: 'm1-4', title: 'Shapes', description: 'Circles, squares, triangles.' },
          { id: 'm1-5', title: 'Measurements', description: 'Length and weight basics.' }
        ]
      },
      {
        id: 'kisw-g1',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k1-1', title: 'Alfabeti', description: 'Kutambua herufi.', videoUrl: 'https://www.youtube.com/embed/5mTo8XyQn2o' },
          { id: 'k1-2', title: 'Kusoma', description: 'Kusoma maneno mafupi.' },
          { id: 'k1-3', title: 'Uandishi', description: 'Kuandika sentensi rahisi.' },
          { id: 'k1-4', title: 'Hadithi', description: 'Kusikiliza na kusimulia hadithi.' }
        ]
      },
      {
        id: 'eng-g1',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e1-1', title: 'Greetings', description: 'How to say hello.', videoUrl: 'https://www.youtube.com/embed/gVIFEVLzP4o' },
          { id: 'e1-2', title: 'My Family', description: 'Naming family members.' },
          { id: 'e1-3', title: 'Colors', description: 'Red, Blue, Green, etc.' },
          { id: 'e1-4', title: 'My School', description: 'Objects found in school.' }
        ]
      },
      {
        id: 'voc-g1',
        name: 'Vocational Skills',
        icon: 'fa-palette',
        topics: [
          { id: 'v1-1', title: 'Singing', description: 'Learning simple school songs.' },
          { id: 'v1-2', title: 'Drawing', description: 'Basic shapes and colors.' },
          { id: 'v1-3', title: 'Traditional Games', description: 'Playing group games.' }
        ]
      },
      {
        id: 'ict-g1',
        name: 'ICT',
        icon: 'fa-computer',
        topics: [
          { id: 'i1-1', title: 'Computer Parts', description: 'Monitor, keyboard, mouse.' },
          { id: 'i1-2', title: 'Using a Mouse', description: 'Clicking and dragging.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade2,
    level: EducationLevel.PRIMARY,
    subjects: [
      {
        id: 'math-g2',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm2-1', title: 'Multiplication', description: 'Repeated addition.' },
          { id: 'm2-2', title: 'Shapes', description: 'Circles, squares, triangles.' },
          { id: 'm2-3', title: 'Numbers to 1000', description: 'Place values.' },
          { id: 'm2-4', title: 'Time', description: 'Reading the clock.' },
          { id: 'm2-5', title: 'Money', description: 'Tanzanian Shillings basics.' }
        ]
      },
      {
        id: 'sci-g2',
        name: 'Science',
        icon: 'fa-leaf',
        topics: [
          { id: 's2-1', title: 'Our Environment', description: 'Plants and animals.' },
          { id: 's2-2', title: 'Hygiene', description: 'Cleaning our bodies.' },
          { id: 's2-3', title: 'Communication', description: 'Traditional methods.' },
          { id: 's2-4', title: 'Water', description: 'Sources and uses.' }
        ]
      },
      {
        id: 'kis-g2',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k2-1', title: 'Kusoma Habari', description: 'Kuelewa hadithi fupi.' },
          { id: 'k2-2', title: 'Imla', description: 'Kuandika maneno kwa usahihi.' }
        ]
      },
      {
        id: 'eng-g2',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e2-1', title: 'Action Verbs', description: 'Run, jump, sit.' },
          { id: 'e2-2', title: 'Opposites', description: 'Big, small, tall, short.' },
          { id: 'e2-3', title: 'In the Classroom', description: 'Naming school items.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade3,
    level: EducationLevel.PRIMARY,
    subjects: [
      {
        id: 'math-g3',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm3-1', title: 'Division', description: 'Sharing equally.' },
          { id: 'm3-2', title: 'Measurements', description: 'Length and Mass.' },
          { id: 'm3-3', title: 'Money Calculations', description: 'Change and balance.' }
        ]
      },
      {
        id: 'sci-g3',
        name: 'Science',
        icon: 'fa-microscope',
        topics: [
          { id: 's3-1', title: 'Living Things', description: 'Characteristics.' },
          { id: 's3-2', title: 'Sources of Energy', description: 'Sun, wood, wind.' },
          { id: 's3-3', title: 'Human Senses', description: 'Sight, sound, touch.' }
        ]
      },
      {
        id: 'kis-g3',
        name: 'Kiswahili',
        icon: 'fa-book',
        topics: [
          { id: 'k3-1', title: 'Nahau', description: 'Misemo rahisi.' },
          { id: 'k3-2', title: 'Mashairi', description: 'Kusoma na kutunga mashairi.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade4,
    level: EducationLevel.PRIMARY,
    subjects: [
      {
        id: 'math-g4',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm4-1', title: 'Fractions', description: 'Parts of a whole.' },
          { id: 'm4-2', title: 'Decimals', description: 'Points and tenths.' },
          { id: 'm4-3', title: 'LCM & GCF', description: 'Common factors and multiples.' }
        ]
      },
      {
        id: 'ss-g4',
        name: 'Social Studies',
        icon: 'fa-globe-africa',
        topics: [
          { id: 'ss4-1', title: 'Map Symbols', description: 'Reading maps.' },
          { id: 'ss4-2', title: 'Our Culture', description: 'Traditions in Tanzania.' },
          { id: 'ss4-3', title: 'Regional History', description: 'Local leaders.' }
        ]
      },
      {
        id: 'st-g4',
        name: 'Science & Technology',
        icon: 'fa-gears',
        topics: [
          { id: 'st4-1', title: 'Properties of Objects', description: 'Solids, liquids, gases.' },
          { id: 'st4-2', title: 'Simple Machines', description: 'The lever.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Form1,
    level: EducationLevel.SECONDARY,
    subjects: [
      {
        id: 'math-f1',
        name: 'Basic Mathematics',
        icon: 'fa-square-root-variable',
        topics: [
          { id: 'mf1-1', title: 'Sets', description: 'Elements and subsets.', videoUrl: 'https://www.youtube.com/embed/gAnXunvD2jE' },
          { id: 'mf1-2', title: 'Numbers', description: 'Integers, Rationals, irrationals.', videoUrl: 'https://www.youtube.com/embed/5W9uJ_L6j08' },
          { id: 'mf1-3', title: 'Algebra', description: 'Simplifying expressions.', videoUrl: 'https://www.youtube.com/embed/QYm6k7P_o8g' },
          { id: 'mf1-4', title: 'Geometrical Constructions', description: 'Using compass and ruler.', videoUrl: 'https://www.youtube.com/embed/S2pEoz9tD6k' },
          { id: 'mf1-5', title: 'Coordinate Geometry', description: 'Points on a plane.', videoUrl: 'https://www.youtube.com/embed/yi0hwumJKnI' }
        ]
      },
      {
        id: 'phy-f1',
        name: 'Physics',
        icon: 'fa-atom',
        topics: [
          { id: 'pf1-1', title: 'Introduction to Physics', description: 'What is physics?', videoUrl: 'https://www.youtube.com/embed/76M6A06k4zE' },
          { id: 'pf1-2', title: 'Measurement', description: 'Length, time, mass.', videoUrl: 'https://www.youtube.com/embed/6u07vX_x_o8' },
          { id: 'pf1-3', title: 'Forces', description: 'Pushing and pulling.', videoUrl: 'https://www.youtube.com/embed/f_Y720_0pCc' },
          { id: 'pf1-4', title: 'Pressure', description: 'Solids, liquids, gases.', videoUrl: 'https://www.youtube.com/embed/0_k0-uY1y0Y' }
        ]
      },
      {
        id: 'chem-f1',
        name: 'Chemistry',
        icon: 'fa-flask',
        topics: [
          { id: 'cf1-1', title: 'Introduction to Chemistry', description: 'Chemistry in life.', videoUrl: 'https://www.youtube.com/embed/S2pEoz9tD6k' },
          { id: 'cf1-2', title: 'Laboratory Safety', description: 'Rules and tools.', videoUrl: 'https://www.youtube.com/embed/MEIXRLcC6RA' },
          { id: 'cf1-3', title: 'Heat Sources', description: 'Bunsen burner.', videoUrl: 'https://www.youtube.com/embed/0_k0-uY1y0Y' },
          { id: 'cf1-4', title: 'Scientific Procedure', description: 'The 6 steps.', videoUrl: 'https://www.youtube.com/embed/yi0hwumJKnI' }
        ]
      },
      {
        id: 'bio-f1',
        name: 'Biology',
        icon: 'fa-dna',
        topics: [
          { id: 'bf1-1', title: 'Living Things', description: 'Classification.' },
          { id: 'bf1-2', title: 'The Cell', description: 'Cell structure.' },
          { id: 'bf1-3', title: 'Health and Immunity', description: 'First aid.' }
        ]
      },
      {
        id: 'hist-f1',
        name: 'History',
        icon: 'fa-scroll',
        topics: [
          { id: 'hf1-1', title: 'Sources of History', description: 'Oral, written, Archaeology.' },
          { id: 'hf1-2', title: 'Evolution of Man', description: 'Stages of development.' }
        ]
      },
      {
        id: 'geo-f1',
        name: 'Geography',
        icon: 'fa-earth-africa',
        topics: [
          { id: 'gf1-1', title: 'The Solar System', description: 'Planets and orbit.' },
          { id: 'gf1-2', title: 'Map Work', description: 'Grid references.' }
        ]
      },
      {
        id: 'comm-f1',
        name: 'Commerce',
        icon: 'fa-shop',
        topics: [
          { id: 'co1-1', title: 'Scope of Commerce', description: 'Introduction to trading.' },
          { id: 'co1-2', title: 'Production', description: 'Types and branches.' }
        ]
      },
      {
        id: 'bk-f1',
        name: 'Book-keeping',
        icon: 'fa-book-journal-whills',
        topics: [
          { id: 'bk1-1', title: 'Introduction to Book-keeping', description: 'The accounting equation.' },
          { id: 'bk1-2', title: 'Books of Original Entry', description: 'The ledger and journals.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Form2,
    level: EducationLevel.SECONDARY,
    subjects: [
      {
        id: 'math-f2',
        name: 'Basic Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'mf2-1', title: 'Exponents', description: 'Laws of indices.' },
          { id: 'mf2-2', title: 'Logarithms', description: 'Base 10 calculations.' },
          { id: 'mf2-3', title: 'Circles', description: 'Theorems and proofs.' }
        ]
      },
      {
        id: 'civ-f2',
        name: 'Civics',
        icon: 'fa-gavel',
        topics: [
          { id: 'cf2-1', title: 'Human Rights', description: 'Types and importance.' },
          { id: 'cf2-2', title: 'The Constitution', description: 'Tanzania laws.' }
        ]
      },
      {
        id: 'geo-f2',
        name: 'Geography',
        icon: 'fa-mountain',
        topics: [
          { id: 'gf2-1', title: 'Human Activities', description: 'Agriculture, mining.' },
          { id: 'gf2-2', title: 'Water Management', description: 'Dams and irrigation.' }
        ]
      },
      {
        id: 'eng-f2',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'ef2-1', title: 'Structure', description: 'Adjectives and adverbs.' },
          { id: 'ef2-2', title: 'Writing', description: 'Friendly letters.' }
        ]
      },
      {
        id: 'kis-f2',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'kf2-1', title: 'Fasihi Simulizi', description: 'Hadithi na vitendawili.' },
          { id: 'kf2-2', title: 'Sarufi', description: 'Aina za maneno.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Form3,
    level: EducationLevel.SECONDARY,
    subjects: [
      {
        id: 'bio-f3',
        name: 'Biology',
        icon: 'fa-leaf',
        topics: [
          { id: 'bf3-1', title: 'Ecology', description: 'Interactions in nature.' },
          { id: 'bf3-2', title: 'Coordination', description: 'Hormones and nerves.' },
          { id: 'bf3-3', title: 'Excretion', description: 'Kidneys and skin.' }
        ]
      },
      {
        id: 'phy-f3',
        name: 'Physics',
        icon: 'fa-lightbulb',
        topics: [
          { id: 'pf3-1', title: 'Current Electricity', description: 'Circuits.' },
          { id: 'pf3-2', title: 'Magnetism', description: 'Magnetic fields.' }
        ]
      },
      {
        id: 'hist-f3',
        name: 'History',
        icon: 'fa-scroll',
        topics: [
          { id: 'hf3-1', title: 'Colonialism', description: 'Establishment of colonial rule.' },
          { id: 'hf3-2', title: 'Colonial Administration', description: 'Direct and indirect rule.' }
        ]
      },
      {
        id: 'geo-f3',
        name: 'Geography',
        icon: 'fa-map-location-dot',
        topics: [
          { id: 'gf3-1', title: 'Map Interpretation', description: 'Contour lines and relief.' },
          { id: 'gf3-2', title: 'Climate', description: 'Regional and world climate.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Form4,
    level: EducationLevel.SECONDARY,
    subjects: [
      {
        id: 'math-f4',
        name: 'Basic Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'mf4-1', title: 'Trigonometry', description: 'Sine, Cosine, Tangent.' },
          { id: 'mf4-2', title: 'Probability', description: 'Chances and events.' },
          { id: 'mf4-3', title: 'Matrices', description: 'Determinants and inverses.' }
        ]
      },
      {
        id: 'phy-f4',
        name: 'Physics',
        icon: 'fa-bolt',
        topics: [
          { id: 'pf4-1', title: 'Electronics', description: 'Logic gates and transistors.' },
          { id: 'pf4-2', title: 'Nuclear Physics', description: 'Radioactivity.' },
          { id: 'pf4-3', title: 'Geophysics', description: 'Internal earth structure.' }
        ]
      },
      {
        id: 'chem-f4',
        name: 'Chemistry',
        icon: 'fa-vial',
        topics: [
          { id: 'cf4-1', title: 'Organic Chemistry', description: 'Alkanes, Alkenes.' },
          { id: 'cf4-2', title: 'Non-Metals', description: 'Nitrogen, Sulphur.' }
        ]
      },
      {
        id: 'hist-f4',
        name: 'History',
        icon: 'fa-landmark-dome',
        topics: [
          { id: 'hf4-1', title: 'Nationalism', description: 'Independence movements in Africa.' },
          { id: 'hf4-2', title: 'Decolonization', description: 'Gaining independence.' }
        ]
      },
      {
        id: 'geo-f4',
        name: 'Geography',
        icon: 'fa-map',
        topics: [
          { id: 'gf4-1', title: 'Agricultural Development', description: 'Small and large scale farming.' },
          { id: 'gf4-2', title: 'Tourism', description: 'Importance and problems.' }
        ]
      },
      {
        id: 'civ-f4',
        name: 'Civics',
        icon: 'fa-gavel',
        topics: [
          { id: 'cf4-1', title: 'International Relations', description: 'Tanzania and the world.' },
          { id: 'cf4-2', title: 'Life Skills', description: 'Problem solving and decision making.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade5,
    level: EducationLevel.PRIMARY,
    subjects: [
      {
        id: 'math-g5',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm5-1', title: 'Ratios', description: 'Comparing quantities.' },
          { id: 'm5-2', title: 'Decimals', description: 'Advanced operations.' },
          { id: 'm5-3', title: 'Geometry', description: 'Angles and lines.' }
        ]
      },
      {
        id: 'civ-g5',
        name: 'Civic & Moral',
        icon: 'fa-landmark',
        topics: [
          { id: 'c5-1', title: 'Citizenship', description: 'Rights and duties.' },
          { id: 'c5-2', title: 'Democracy', description: 'Voting and elections.' },
          { id: 'c5-3', title: 'Human Rights', description: 'Children rights.' }
        ]
      },
      {
        id: 'voc-g5',
        name: 'Vocational Skills',
        icon: 'fa-palette',
        topics: [
          { id: 'v5-1', title: 'Cookery', description: 'Safe food handling.' },
          { id: 'v5-2', title: 'Needlework', description: 'Basic sewing.' }
        ]
      },
      {
        id: 'kis-g5',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k5-1', title: 'Uandishi wa Insha', description: 'Kuandika insha za wasifu.' },
          { id: 'k5-2', title: 'Sarufi', description: 'Ngeli za nomino.' }
        ]
      },
      {
        id: 'eng-g5',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e5-1', title: 'Past Tense', description: 'Regular and irregular verbs.' },
          { id: 'e5-2', title: 'Story Writing', description: 'Creating simple plots.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade6,
    level: EducationLevel.PRIMARY,
    subjects: [
      {
        id: 'math-g6',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm6-1', title: 'Percentages', description: 'Profit and loss.' },
          { id: 'm6-2', title: 'Area & Volume', description: '3D shapes.' },
          { id: 'm6-3', title: 'Integers', description: 'Positive and negative numbers.' }
        ]
      },
      {
        id: 'sci-g6',
        name: 'Science & Tech',
        icon: 'fa-microchip',
        topics: [
          { id: 's6-1', title: 'Simple Machines', description: 'Levers and pulleys.' },
          { id: 's6-2', title: 'Electronics', description: 'Basic circuits.' },
          { id: 's6-3', title: 'Human Digestive System', description: 'Organs and functions.' }
        ]
      },
      {
        id: 'kis-g6',
        name: 'Kiswahili',
        icon: 'fa-book',
        topics: [
          { id: 'k6-1', title: 'Methali', description: 'Busara za kale.' },
          { id: 'k6-2', title: 'Ufahamu', description: 'Kusoma na kuelewa.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade7,
    level: EducationLevel.PRIMARY,
    subjects: [
      {
        id: 'math-g7',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm7-1', title: 'Statistics', description: 'Handling data and probability.' },
          { id: 'm7-2', title: 'Algebra', description: 'Basic equations and functions.' },
          { id: 'm7-3', title: 'Geometry', description: 'Volumes and surface areas.' },
          { id: 'm7-4', title: 'Coordinate Geometry', description: 'Graphs and linear equations.' }
        ]
      },
      {
        id: 'sci-g7',
        name: 'Science',
        icon: 'fa-flask',
        topics: [
          { id: 's7-1', title: 'Electricity', description: 'Circuits and magnets.' },
          { id: 's7-2', title: 'Human Biology', description: 'Reproduction and growth.' },
          { id: 's7-3', title: 'Light', description: 'Reflection and refraction.' },
          { id: 's7-4', title: 'Chemistry Basics', description: 'Acids and bases.' }
        ]
      },
      {
        id: 'ss-g7',
        name: 'Social Studies',
        icon: 'fa-landmark',
        topics: [
          { id: 'ss7-1', title: 'Tanzanian Independence', description: 'History of the nation.' },
          { id: 'ss7-2', title: 'World Geography', description: 'Continents and oceans.' }
        ]
      },
      {
        id: 'kis-g7',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k7-1', title: 'Fasihi ya Kiswahili', description: 'Tungo na hadithi.' },
          { id: 'k7-2', title: 'Barua rasmi', description: 'Uandishi wa barua.' }
        ]
      },
      {
        id: 'eng-g7',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e7-1', title: 'Composition', description: 'Writing coherent essays.' },
          { id: 'e7-2', title: 'Grammar', description: 'Advanced sentence structures.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Form5,
    level: EducationLevel.HIGH_SCHOOL,
    subjects: [
      {
        id: 'adv-math-f5',
        name: 'Advanced Mathematics',
        icon: 'fa-square-root-variable',
        topics: [
          { id: 'amf5-1', title: 'Logic', description: 'Truth tables and arguments.' },
          { id: 'amf5-2', title: 'Calculating Machines', description: 'Scientific calculators.' },
          { id: 'amf5-3', title: 'Trigonometry', description: 'Compound angles.' },
          { id: 'amf5-4', title: 'Differentiation', description: 'Rates of change.' },
          { id: 'amf5-5', title: 'Integration', description: 'Area under curves.' },
          { id: 'amf5-6', title: 'Probability', description: 'Distributions and expectations.' }
        ]
      },
      {
        id: 'gs-f5',
        name: 'General Studies',
        icon: 'fa-earth-africa',
        topics: [
          { id: 'gs5-1', title: 'Philosophy', description: 'Basic concepts.' },
          { id: 'gs5-2', title: 'International Affairs', description: 'Tanzania and the world.' },
          { id: 'gs5-3', title: 'Constitutional Issues', description: 'Legal framework.' },
          { id: 'gs5-4', title: 'Gender and Development', description: 'Equality and equity.' }
        ]
      },
      {
        id: 'phy-f5',
        name: 'Physics',
        icon: 'fa-atom',
        topics: [
          { id: 'apf5-1', title: 'Mechanics', description: 'Projectiles and circular motion.' },
          { id: 'apf5-2', title: 'Heat', description: 'Thermodynamics.' },
          { id: 'apf5-3', title: 'Properties of Matter', description: 'Elasticity and fluid flow.' }
        ]
      },
      {
        id: 'chem-f5',
        name: 'Chemistry',
        icon: 'fa-flask-vial',
        topics: [
          { id: 'acf5-1', title: 'Physical Chemistry', description: 'Energetics and kinetics.' },
          { id: 'acf5-2', title: 'Inorganic Chemistry', description: 'Periodic table trends.' },
          { id: 'acf5-3', title: 'Organic Chemistry', description: 'Basics of bonding.' }
        ]
      },
      {
        id: 'bio-f5',
        name: 'Biology',
        icon: 'fa-dna',
        topics: [
          { id: 'abf5-1', title: 'Cytology', description: 'Cell biology.' },
          { id: 'abf5-2', title: 'Principles of Classification', description: 'Taxonomy.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Form6,
    level: EducationLevel.HIGH_SCHOOL,
    subjects: [
      {
        id: 'phy-f6',
        name: 'Physics',
        icon: 'fa-wave-square',
        topics: [
          { id: 'pf6-1', title: 'Waves', description: 'Mechanical and electromagnetic.' },
          { id: 'pf6-2', title: 'Modern Physics', description: 'Quantum theory.' },
          { id: 'pf6-3', title: 'Electronics', description: 'Digital circuits.' },
          { id: 'pf6-4', title: 'Geophysics', description: 'Earth physics.' }
        ]
      },
      {
        id: 'chem-f6',
        name: 'Chemistry',
        icon: 'fa-vial-circle-check',
        topics: [
          { id: 'cf6-1', title: 'Organic Chemistry II', description: 'Polymerization.' },
          { id: 'cf6-2', title: 'Environmental Chemistry', description: 'Global warming.' },
          { id: 'cf6-3', title: 'Analytic Chemistry', description: 'Titration and qualitative analysis.' }
        ]
      },
      {
        id: 'math-f6',
        name: 'Advanced Mathematics',
        icon: 'fa-infinity',
        topics: [
          { id: 'amf6-1', title: 'Complex Numbers', description: 'Real and imaginary parts.' },
          { id: 'amf6-2', title: 'Differential Equations', description: 'First order equations.' },
          { id: 'amf6-3', title: 'Linear Programming', description: 'Maximizing and minimizing.' }
        ]
      },
      {
        id: 'geo-f6',
        name: 'Geography',
        icon: 'fa-mountain-sun',
        topics: [
          { id: 'agf6-1', title: 'Human Geography', description: 'Population and settlement.' },
          { id: 'agf6-2', title: 'Physical Geography', description: 'Plate tectonics.' }
        ]
      }
    ]
  },
];

export const PAST_EXAMS = [
  { level: 'PSLE', year: '2023', subjects: ['Mathematics', 'Science', 'English', 'Kiswahili', 'Social Studies'] },
  { level: 'PSLE', year: '2022', subjects: ['Mathematics', 'Science', 'English', 'Kiswahili', 'Social Studies'] },
  { level: 'PSLE', year: '2021', subjects: ['Mathematics', 'Science', 'English', 'Kiswahili', 'Social Studies'] },
  { level: 'PSLE', year: '2020', subjects: ['Mathematics', 'Science', 'English', 'Kiswahili', 'Social Studies'] },
  { level: 'PSLE', year: '2019', subjects: ['Mathematics', 'Science', 'English', 'Kiswahili', 'Social Studies'] },
  { level: 'CSEE', year: '2023', subjects: ['Basic Math', 'Physics', 'Chemistry', 'Biology', 'Civics', 'History', 'Geography', 'English', 'Kiswahili'] },
  { level: 'CSEE', year: '2022', subjects: ['Basic Math', 'Physics', 'Chemistry', 'Biology', 'Civics', 'History', 'Geography', 'English', 'Kiswahili'] },
  { level: 'CSEE', year: '2021', subjects: ['Basic Math', 'Physics', 'Chemistry', 'Biology', 'Civics', 'History', 'Geography', 'English', 'Kiswahili'] },
  { level: 'CSEE', year: '2020', subjects: ['Basic Math', 'Physics', 'Chemistry', 'Biology', 'Civics', 'History', 'Geography', 'English', 'Kiswahili'] },
  { level: 'ACSEE', year: '2023', subjects: ['PCM', 'PCB', 'CBG', 'EGM', 'CBA', 'HGL', 'HGK', 'HKL', 'HGE'] },
  { level: 'ACSEE', year: '2022', subjects: ['PCM', 'PCB', 'CBG', 'EGM', 'CBA', 'HGL', 'HGK', 'HKL', 'HGE'] },
  { level: 'ACSEE', year: '2021', subjects: ['PCM', 'PCB', 'CBG', 'EGM', 'CBA', 'HGL', 'HGK', 'HKL', 'HGE'] },
  { level: 'QT', year: '2023', subjects: ['Mathematics', 'English', 'Civics', 'Geography'] },
  { level: 'QT', year: '2022', subjects: ['Mathematics', 'English', 'Civics', 'Geography'] }
];

export const INITIAL_GREETING = "Jambo! I am Yun, your AI study buddy. Choose your level to start learning, or ask me anything!";
