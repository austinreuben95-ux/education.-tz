import { GradeLevel, GradeSyllabus } from './types';

export const SYLLABUS_DATA: GradeSyllabus[] = [
  {
    grade: GradeLevel.Grade1,
    subjects: [
      {
        id: 'math-g1',
        name: 'Mathematics (Hisabati)',
        icon: 'fa-calculator',
        topics: [
          { id: 'm1-1', title: 'Counting Numbers 1-100', description: 'Learning to count objects and numbers.' },
          { id: 'm1-2', title: 'Addition and Subtraction', description: 'Basic adding and taking away of small numbers.' },
          { id: 'm1-3', title: 'Shapes', description: 'Identifying circle, square, triangle, and rectangle.' }
        ]
      },
      {
        id: 'kisw-g1',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k1-1', title: 'Kusoma Herufi', description: 'Kutambua herufi za alfabeti.' },
          { id: 'k1-2', title: 'Kutamka Maneno', description: 'Kusoma maneno mafupi.' },
          { id: 'k1-3', title: 'Uandishi', description: 'Kuandika herufi na maneno rahisi.' }
        ]
      },
      {
        id: 'eng-g1',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e1-1', title: 'Greetings', description: 'Good morning, Good afternoon, etc.' },
          { id: 'e1-2', title: 'My Family', description: 'Father, Mother, Brother, Sister.' },
          { id: 'e1-3', title: 'Parts of the Body', description: 'Head, Shoulders, Knees, and Toes.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade2,
    subjects: [
      {
        id: 'math-g2',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm2-1', title: 'Numbers up to 1000', description: 'Reading and writing larger numbers.' },
          { id: 'm2-2', title: 'Multiplication', description: 'Introduction to repeated addition.' },
          { id: 'm2-3', title: 'Time', description: 'Reading the clock face.' }
        ]
      },
      {
        id: 'kisw-g2',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k2-1', title: 'Hadithi na Mazungumzo', description: 'Kusikiliza na kusimulia hadithi.' },
          { id: 'k2-2', title: 'Ufahamu', description: 'Kusoma na kuelewa habari fupi.' }
        ]
      },
      {
        id: 'eng-g2',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e2-1', title: 'School Objects', description: 'Pen, pencil, ruler, book, etc.' },
          { id: 'e2-2', title: 'Actions', description: 'Jump, run, sit, stand.' }
        ]
      },
      {
        id: 'sci-g2',
        name: 'Health & Environment',
        icon: 'fa-leaf',
        topics: [
          { id: 's2-1', title: 'Personal Hygiene', description: 'Keeping our bodies clean.' },
          { id: 's2-2', title: 'Our Environment', description: 'Plants and animals around us.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade3,
    subjects: [
      {
        id: 'math-g3',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm3-1', title: 'Division', description: 'Sharing items equally.' },
          { id: 'm3-2', title: 'Measurements', description: 'Length, Mass, and Capacity.' }
        ]
      },
      {
        id: 'kisw-g3',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k3-1', title: 'Sarufi', description: 'Ngeli za majina na matumizi ya nyakati.' },
          { id: 'k3-2', title: 'Insha', description: 'Kuandika aya fupi kuhusu mada mbalimbali.' }
        ]
      },
      {
        id: 'eng-g3',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e3-1', title: 'Telling Time', description: 'Asking and saying what time it is.' },
          { id: 'e3-2', title: 'Shopping', description: 'Vocabulary for buying and selling.' }
        ]
      },
      {
        id: 'scit-g3',
        name: 'Science & Tech',
        icon: 'fa-microscope',
        topics: [
          { id: 'st3-1', title: 'Living Things', description: 'Characteristics of living vs non-living things.' },
          { id: 'st3-2', title: 'Communication', description: 'Traditional and modern ways of communication.' }
        ]
      },
      {
        id: 'civ-g3',
        name: 'Civic & Moral',
        icon: 'fa-user-check',
        topics: [
          { id: 'c3-1', title: 'Respect', description: 'Respecting yourself and others.' },
          { id: 'c3-2', title: 'National Identity', description: 'The national flag and anthem.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade4,
    subjects: [
      {
        id: 'math-g4',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm4-1', title: 'Fractions', description: 'Numerator and Denominator operations.' },
          { id: 'm4-2', title: 'Geometry', description: 'Angles and lines.' }
        ]
      },
      {
        id: 'kisw-g4',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k4-1', title: 'Methali na Misemo', description: 'Maana na matumizi ya methali.' },
          { id: 'k4-2', title: 'Ufahamu wa Kusoma', description: 'Kuchambua habari na mashairi.' }
        ]
      },
      {
        id: 'eng-g4',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e4-1', title: 'Comparing Things', description: 'Big, bigger, biggest; small, smaller, smallest.' },
          { id: 'e4-2', title: 'Daily Routines', description: 'Talking about what we do every day.' }
        ]
      },
      {
        id: 'soc-g4',
        name: 'Social Studies',
        icon: 'fa-globe-africa',
        topics: [
          { id: 'ss4-1', title: 'Map Reading', description: 'Understanding cardinal points and symbols.' },
          { id: 'ss4-2', title: 'Tanzanian Culture', description: 'Traditions, foods, and dances.' }
        ]
      },
      {
        id: 'civ-g4',
        name: 'Civics',
        icon: 'fa-scale-balanced',
        topics: [
          { id: 'c4-1', title: 'Our School', description: 'Rights and responsibilities at school.' },
          { id: 'c4-2', title: 'Family', description: 'Roles of family members.' }
        ]
      },
      {
        id: 'voc-g4',
        name: 'Vocational Skills',
        icon: 'fa-palette',
        topics: [
          { id: 'v4-1', title: 'Art and Craft', description: 'Making simple objects with clay and paper.' },
          { id: 'v4-2', title: 'Cookery', description: 'Basic food preparation and safety.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade5,
    subjects: [
      {
        id: 'math-g5',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm5-1', title: 'Decimals', description: 'Operations with decimal numbers.' },
          { id: 'm5-2', title: 'Algebra', description: 'Introduction to simple algebraic expressions.' }
        ]
      },
      {
        id: 'kisw-g5',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k5-1', title: 'Mashairi', description: 'Kutunga na kusoma mashairi ya kimsingi.' },
          { id: 'k5-2', title: 'Barua', description: 'Kuandika barua za kirafiki.' }
        ]
      },
      {
        id: 'eng-g5',
        name: 'English',
        icon: 'fa-font',
        topics: [
          { id: 'e5-1', title: 'Giving Directions', description: 'How to guide someone to a location.' },
          { id: 'e5-2', title: 'Future Plans', description: 'Using "will" and "going to".' }
        ]
      },
      {
        id: 'sci-g5',
        name: 'Science',
        icon: 'fa-flask',
        topics: [
          { id: 's5-1', title: 'Energy', description: 'Forms of energy: Light, Heat, Sound.' },
          { id: 's5-2', title: 'Reproduction in Plants', description: 'Flowers and pollination.' }
        ]
      },
      {
        id: 'soc-g5',
        name: 'Social Studies',
        icon: 'fa-mountain-city',
        topics: [
          { id: 'ss5-1', title: 'Weather and Climate', description: 'Elements of weather and climatic zones.' },
          { id: 'ss5-2', title: 'Our Heroes', description: 'Famous people in Tanzanian history.' }
        ]
      },
      {
        id: 'civ-g5',
        name: 'Civic & Moral',
        icon: 'fa-heart',
        topics: [
          { id: 'c5-1', title: 'Self-Discipline', description: 'Importance of time management.' },
          { id: 'c5-2', title: 'Democracy', description: 'Choosing leaders in the community.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade6,
    subjects: [
      {
        id: 'math-g6',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm6-1', title: 'Percentages', description: 'Calculating profit and loss.' },
          { id: 'm6-2', title: 'Statistics', description: 'Data handling and simple graphs.' }
        ]
      },
      {
        id: 'kisw-g6',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k6-1', title: 'Uandishi wa Insha', description: 'Insha za maelezo na hoja.' },
          { id: 'k6-2', title: 'Fasihi Simulizi', description: 'Hadithi, ngano, na maigizo.' }
        ]
      },
      {
        id: 'eng-g6',
        name: 'English',
        icon: 'fa-book',
        topics: [
          { id: 'e6-1', title: 'Tenses', description: 'Past, Present, and Future tenses.' },
          { id: 'e6-2', title: 'Composition', description: 'Writing formal and informal letters.' }
        ]
      },
      {
        id: 'sci-g6',
        name: 'Science',
        icon: 'fa-dna',
        topics: [
          { id: 's6-1', title: 'The Nervous System', description: 'Brain, spinal cord, and nerves.' },
          { id: 's6-2', title: 'Simple Machines', description: 'Levers, pulleys, and inclined planes.' }
        ]
      },
      {
        id: 'soc-g6',
        name: 'Social Studies',
        icon: 'fa-landmark-dome',
        topics: [
          { id: 'ss6-1', title: 'Pre-Colonial Africa', description: 'Great empires of Africa.' },
          { id: 'ss6-2', title: 'Environmental Conservation', description: 'Protecting water sources and forests.' }
        ]
      },
      {
        id: 'civ-g6',
        name: 'Civic & Moral',
        icon: 'fa-handshake-angle',
        topics: [
          { id: 'c6-1', title: 'Human Rights', description: 'Child rights and protection.' },
          { id: 'c6-2', title: 'Global Cooperation', description: 'How nations work together.' }
        ]
      }
    ]
  },
  {
    grade: GradeLevel.Grade7,
    subjects: [
      {
        id: 'math-g7',
        name: 'Mathematics',
        icon: 'fa-calculator',
        topics: [
          { id: 'm7-1', title: 'Coordinate Geometry', description: 'Plotting points and lines.' },
          { id: 'm7-2', title: 'Area and Volume', description: 'Calculating complex shapes and solids.' }
        ]
      },
      {
        id: 'kisw-g7',
        name: 'Kiswahili',
        icon: 'fa-language',
        topics: [
          { id: 'k7-1', title: 'Uandishi wa Hotuba', description: 'Jinsi ya kuandaa na kutoa hotuba.' },
          { id: 'k7-2', title: 'Mishata na Semi', description: 'Maneno yenye maana zaidi ya moja.' }
        ]
      },
      {
        id: 'eng-g7',
        name: 'English',
        icon: 'fa-graduation-cap',
        topics: [
          { id: 'e7-1', title: 'Passive and Active Voice', description: 'Changing sentence structures.' },
          { id: 'e7-2', title: 'Reading Long Texts', description: 'Analyzing novels and short stories.' }
        ]
      },
      {
        id: 'sci-g7',
        name: 'Science',
        icon: 'fa-atom',
        topics: [
          { id: 's7-1', title: 'Electricity', description: 'Circuits, conductors, and insulators.' },
          { id: 's7-2', title: 'Human Body Systems', description: 'Digestive and Respiratory systems.' }
        ]
      },
      {
        id: 'soc-g7',
        name: 'Social Studies',
        icon: 'fa-landmark',
        topics: [
          { id: 'ss7-1', title: 'Independence of Tanzania', description: 'History of TANU and independence.' },
          { id: 'ss7-2', title: 'Economic Activities', description: 'Agriculture, mining, and tourism.' }
        ]
      },
      {
        id: 'civ-g7',
        name: 'Civic & Moral',
        icon: 'fa-gavel',
        topics: [
          { id: 'c7-1', title: 'Constitution of Tanzania', description: 'Understanding the basic law of the land.' },
          { id: 'c7-2', title: 'The World Economy', description: 'International trade basics.' }
        ]
      },
      {
        id: 'voc-g7',
        name: 'Vocational Skills',
        icon: 'fa-toolbox',
        topics: [
          { id: 'v7-1', title: 'Entrepreneurship', description: 'Planning a simple business.' },
          { id: 'v7-2', title: 'ICT Basics', description: 'Parts of a computer and typing.' }
        ]
      }
    ]
  }
];

export const INITIAL_GREETING = "Jambo! I am Yun, your AI study buddy. Select a grade to explore the syllabus, or ask me anything about your studies!";
