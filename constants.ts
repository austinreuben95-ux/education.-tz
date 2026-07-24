import { GradeLevel, GradeSyllabus, EducationLevel } from './types';
import { enhanceSyllabusWithTopics } from './src/data/curriculumEnhancer';

const BASE_SYLLABUS_DATA: GradeSyllabus[] = [
  // --- PRIMARY LEVEL (GRADES 1 - 7) ---
  {
    grade: GradeLevel.Grade1,
    level: EducationLevel.PRIMARY,
    subjects: [
      { id: 'math-g1', name: 'Mathematics (Hesabu)', icon: 'fa-calculator', topics: [{ id: 'm1-1', title: 'Counting 1-100', description: 'Learning numbers.' }, { id: 'm1-2', title: 'Addition', description: 'Basic adding.' }, { id: 'm1-3', title: 'Subtraction', description: 'Basic taking away.' }] },
      { id: 'kisw-g1', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'k1-1', title: 'Alfabeti', description: 'Kutambua herufi.' }, { id: 'k1-2', title: 'Kusoma', description: 'Kusoma maneno mafupi.' }] },
      { id: 'eng-g1', name: 'English Language', icon: 'fa-font', topics: [{ id: 'e1-1', title: 'Greetings', description: 'How to say hello.' }, { id: 'e1-2', title: 'My Family', description: 'Naming family members.' }] },
      { id: 'sci-g1', name: 'Science & Technology (Sayansi)', icon: 'fa-flask', topics: [{ id: 's1-1', title: 'Living Things', description: 'Plants and animals.' }] },
      { id: 'ss-g1', name: 'Social Studies (Maarifa ya Jamii)', icon: 'fa-earth-africa', topics: [{ id: 'ss1-1', title: 'Our Home & School', description: 'Understanding environment.' }] },
      { id: 'civ-g1', name: 'Civic & Moral Education (Uraia)', icon: 'fa-landmark', topics: [{ id: 'c1-1', title: 'Good Manners', description: 'Respect and obedience.' }] },
      { id: 'voc-g1', name: 'Vocational Skills (Stadi za Kazi)', icon: 'fa-palette', topics: [{ id: 'v1-1', title: 'Drawing & Songs', description: 'Creative expressions.' }] },
      { id: 'ict-g1', name: 'ICT & Computer Basics', icon: 'fa-computer', topics: [{ id: 'i1-1', title: 'Computer Parts', description: 'Monitor, keyboard, mouse.' }] },
      { id: 'pe-g1', name: 'Physical Education & Sports', icon: 'fa-dumbbell', topics: [{ id: 'pe1-1', title: 'Body Movements', description: 'Running and jumping.' }] },
      { id: 'art-g1', name: 'Art, Craft & Music', icon: 'fa-paint-brush', topics: [{ id: 'a1-1', title: 'Coloring Shapes', description: 'Basic colors.' }] }
    ]
  },
  {
    grade: GradeLevel.Grade2,
    level: EducationLevel.PRIMARY,
    subjects: [
      { id: 'math-g2', name: 'Mathematics (Hesabu)', icon: 'fa-calculator', topics: [{ id: 'm2-1', title: 'Multiplication', description: 'Repeated addition.' }, { id: 'm2-2', title: 'Money & Shillings', description: 'Currency basics.' }] },
      { id: 'kisw-g2', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'k2-1', title: 'Kusoma na Imla', description: 'Kuandika maneno mafupi.' }] },
      { id: 'eng-g2', name: 'English Language', icon: 'fa-font', topics: [{ id: 'e2-1', title: 'Action Verbs', description: 'Run, jump, sit.' }] },
      { id: 'sci-g2', name: 'Science & Technology', icon: 'fa-leaf', topics: [{ id: 's2-1', title: 'Hygiene & Health', description: 'Body cleanliness.' }] },
      { id: 'ss-g2', name: 'Social Studies', icon: 'fa-earth-africa', topics: [{ id: 'ss2-1', title: 'Community Leaders', description: 'Local leaders.' }] },
      { id: 'civ-g2', name: 'Civic & Moral Education', icon: 'fa-landmark', topics: [{ id: 'c2-1', title: 'National Symbols', description: 'Flag and anthem.' }] },
      { id: 'voc-g2', name: 'Vocational Skills', icon: 'fa-palette', topics: [{ id: 'v2-1', title: 'Simple Crafts', description: 'Clay molding.' }] },
      { id: 'ict-g2', name: 'ICT & Digital Skills', icon: 'fa-computer', topics: [{ id: 'i2-1', title: 'Using a Mouse', description: 'Clicking and dragging.' }] },
      { id: 'pe-g2', name: 'Physical Education & Games', icon: 'fa-dumbbell', topics: [{ id: 'pe2-1', title: 'Ball Games', description: 'Passing and catching.' }] },
      { id: 'agr-g2', name: 'Agriculture & Nature', icon: 'fa-seedling', topics: [{ id: 'ag2-1', title: 'Garden Plants', description: 'Flowers and crops.' }] }
    ]
  },
  {
    grade: GradeLevel.Grade3,
    level: EducationLevel.PRIMARY,
    subjects: [
      { id: 'math-g3', name: 'Mathematics', icon: 'fa-calculator', topics: [{ id: 'm3-1', title: 'Division & Sharing', description: 'Equal groups.' }] },
      { id: 'kisw-g3', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'k3-1', title: 'Nahau na Misemo', description: 'Misemo ya Kiswahili.' }] },
      { id: 'eng-g3', name: 'English Language', icon: 'fa-font', topics: [{ id: 'e3-1', title: 'Opposites & Adjectives', description: 'Describing words.' }] },
      { id: 'sci-g3', name: 'Science & Technology', icon: 'fa-microscope', topics: [{ id: 's3-1', title: 'Human Senses', description: 'Sight, sound, smell.' }] },
      { id: 'ss-g3', name: 'Social Studies', icon: 'fa-earth-africa', topics: [{ id: 'ss3-1', title: 'Map Directions', description: 'North, South, East, West.' }] },
      { id: 'civ-g3', name: 'Civic & Moral Education', icon: 'fa-landmark', topics: [{ id: 'c3-1', title: 'School Rules', description: 'Responsibility.' }] },
      { id: 'voc-g3', name: 'Vocational Skills', icon: 'fa-palette', topics: [{ id: 'v3-1', title: 'Home Hygiene', description: 'Cleaning home.' }] },
      { id: 'ict-g3', name: 'ICT & Computers', icon: 'fa-computer', topics: [{ id: 'i3-1', title: 'Typing Basics', description: 'Using keyboard.' }] },
      { id: 'pe-g3', name: 'Physical Education', icon: 'fa-dumbbell', topics: [{ id: 'pe3-1', title: 'Athletics Basics', description: 'Sprinting.' }] },
      { id: 'art-g3', name: 'Performing Arts & Music', icon: 'fa-music', topics: [{ id: 'art3-1', title: 'Traditional Songs', description: 'Cultural songs.' }] }
    ]
  },
  {
    grade: GradeLevel.Grade4,
    level: EducationLevel.PRIMARY,
    subjects: [
      { id: 'math-g4', name: 'Mathematics', icon: 'fa-calculator', topics: [{ id: 'm4-1', title: 'Fractions & Decimals', description: 'Equal parts.' }] },
      { id: 'kisw-g4', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'k4-1', title: 'Insha na Hadithi', description: 'Uandishi wa insha.' }] },
      { id: 'eng-g4', name: 'English Language', icon: 'fa-font', topics: [{ id: 'e4-1', title: 'Tenses & Grammar', description: 'Past and present.' }] },
      { id: 'sci-g4', name: 'Science & Technology', icon: 'fa-flask', topics: [{ id: 's4-1', title: 'States of Matter', description: 'Solid, liquid, gas.' }] },
      { id: 'ss-g4', name: 'Social Studies', icon: 'fa-earth-africa', topics: [{ id: 'ss4-1', title: 'Tanzania Culture', description: 'Traditions.' }] },
      { id: 'civ-g4', name: 'Civic & Moral Education', icon: 'fa-landmark', topics: [{ id: 'c4-1', title: 'Human Rights', description: 'Children rights.' }] },
      { id: 'voc-g4', name: 'Vocational Skills', icon: 'fa-palette', topics: [{ id: 'v4-1', title: 'Cookery Basics', description: 'Food preparation.' }] },
      { id: 'ict-g4', name: 'ICT & Digital Literacy', icon: 'fa-computer', topics: [{ id: 'i4-1', title: 'Paint & Drawing Apps', description: 'Digital art.' }] },
      { id: 'pe-g4', name: 'Physical Education', icon: 'fa-dumbbell', topics: [{ id: 'pe4-1', title: 'Gymnastics Basics', description: 'Balance.' }] },
      { id: 'fre-g4', name: 'French (Basic Kifaransa)', icon: 'fa-comments', topics: [{ id: 'f4-1', title: 'Salutations', description: 'French greetings.' }] }
    ]
  },
  {
    grade: GradeLevel.Grade5,
    level: EducationLevel.PRIMARY,
    subjects: [
      { id: 'math-g5', name: 'Mathematics', icon: 'fa-calculator', topics: [{ id: 'm5-1', title: 'Ratios & Percentages', description: 'Comparing quantities.' }] },
      { id: 'kisw-g5', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'k5-1', title: 'Ngeli za Nomino', description: 'Aina za ngeli.' }] },
      { id: 'eng-g5', name: 'English Language', icon: 'fa-font', topics: [{ id: 'e5-1', title: 'Composition Writing', description: 'Writing essays.' }] },
      { id: 'sci-g5', name: 'Science & Technology', icon: 'fa-microscope', topics: [{ id: 's5-1', title: 'Simple Machines', description: 'Levers and pulleys.' }] },
      { id: 'ss-g5', name: 'Social Studies', icon: 'fa-earth-africa', topics: [{ id: 'ss5-1', title: 'Climate & Weather', description: 'Rainfall and temperature.' }] },
      { id: 'civ-g5', name: 'Civic & Moral Education', icon: 'fa-landmark', topics: [{ id: 'c5-1', title: 'Democracy & Voting', description: 'Elections.' }] },
      { id: 'voc-g5', name: 'Vocational Skills', icon: 'fa-palette', topics: [{ id: 'v5-1', title: 'Needlework & Sewing', description: 'Basic stitches.' }] },
      { id: 'ict-g5', name: 'ICT & Word Processing', icon: 'fa-computer', topics: [{ id: 'i5-1', title: 'Document Editing', description: 'Typing paragraphs.' }] },
      { id: 'pe-g5', name: 'Physical Education', icon: 'fa-dumbbell', topics: [{ id: 'pe5-1', title: 'Team Sports', description: 'Football and netball.' }] },
      { id: 'nut-g5', name: 'Nutrition & Home Management', icon: 'fa-utensils', topics: [{ id: 'n5-1', title: 'Balanced Diet', description: 'Nutrients.' }] }
    ]
  },
  {
    grade: GradeLevel.Grade6,
    level: EducationLevel.PRIMARY,
    subjects: [
      { id: 'math-g6', name: 'Mathematics', icon: 'fa-calculator', topics: [{ id: 'm6-1', title: 'Area & Volume', description: '3D shapes.' }] },
      { id: 'kisw-g6', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'k6-1', title: 'Methali na Nahau', description: 'Busara za kale.' }] },
      { id: 'eng-g6', name: 'English Language', icon: 'fa-font', topics: [{ id: 'e6-1', title: 'Letter Writing', description: 'Formal and informal.' }] },
      { id: 'sci-g6', name: 'Science & Technology', icon: 'fa-microchip', topics: [{ id: 's6-1', title: 'Human Digestive System', description: 'Digestive organs.' }] },
      { id: 'ss-g6', name: 'Social Studies', icon: 'fa-earth-africa', topics: [{ id: 'ss6-1', title: 'East Africa History', description: 'Early trade.' }] },
      { id: 'civ-g6', name: 'Civic & Moral Education', icon: 'fa-landmark', topics: [{ id: 'c6-1', title: 'Rule of Law', description: 'Constitution.' }] },
      { id: 'voc-g6', name: 'Vocational Skills', icon: 'fa-palette', topics: [{ id: 'v6-1', title: 'Woodwork & Crafts', description: 'Carving basics.' }] },
      { id: 'ict-g6', name: 'ICT & Internet Basics', icon: 'fa-computer', topics: [{ id: 'i6-1', title: 'Web Browsing', description: 'Searching online.' }] },
      { id: 'pe-g6', name: 'Physical Education', icon: 'fa-dumbbell', topics: [{ id: 'pe6-1', title: 'Volleyball & Basketball', description: 'Court rules.' }] },
      { id: 'agr-g6', name: 'Agriculture & Livestock', icon: 'fa-seedling', topics: [{ id: 'ag6-1', title: 'Poultry Farming', description: 'Rearing chickens.' }] }
    ]
  },
  {
    grade: GradeLevel.Grade7,
    level: EducationLevel.PRIMARY,
    subjects: [
      { id: 'math-g7', name: 'Mathematics (PSLE)', icon: 'fa-calculator', topics: [{ id: 'm7-1', title: 'Algebra & Equations', description: 'Solving for x.' }] },
      { id: 'kisw-g7', name: 'Kiswahili (PSLE)', icon: 'fa-language', topics: [{ id: 'k7-1', title: 'Fasihi na Barua', description: 'Uandishi rasmi.' }] },
      { id: 'eng-g7', name: 'English Language (PSLE)', icon: 'fa-font', topics: [{ id: 'e7-1', title: 'Comprehension & Grammar', description: 'Passage analysis.' }] },
      { id: 'sci-g7', name: 'Science & Technology (PSLE)', icon: 'fa-flask', topics: [{ id: 's7-1', title: 'Electricity & Circuits', description: 'Voltage and current.' }] },
      { id: 'ss-g7', name: 'Social Studies (PSLE)', icon: 'fa-earth-africa', topics: [{ id: 'ss7-1', title: 'Tanzanian Independence', description: 'National history.' }] },
      { id: 'civ-g7', name: 'Civic & Moral Education', icon: 'fa-landmark', topics: [{ id: 'c7-1', title: 'Global Citizenship', description: 'International relations.' }] },
      { id: 'voc-g7', name: 'Vocational Skills', icon: 'fa-palette', topics: [{ id: 'v7-1', title: 'Business Skills', description: 'Entrepreneurship.' }] },
      { id: 'ict-g7', name: 'ICT & Cyber Safety', icon: 'fa-computer', topics: [{ id: 'i7-1', title: 'Online Safety', description: 'Passwords and privacy.' }] },
      { id: 'pe-g7', name: 'Physical Education', icon: 'fa-dumbbell', topics: [{ id: 'pe7-1', title: 'Sportsmanship', description: 'Tournament rules.' }] },
      { id: 'fre-g7', name: 'French (Kifaransa)', icon: 'fa-comments', topics: [{ id: 'f7-1', title: 'French Dialogue', description: 'Conversations.' }] }
    ]
  },

  // --- O-LEVEL SECONDARY (FORMS 1 - 4) ---
  {
    grade: GradeLevel.Form1,
    level: EducationLevel.SECONDARY,
    subjects: [
      { id: 'math-f1', name: 'Basic Mathematics', icon: 'fa-square-root-variable', topics: [{ id: 'mf1-1', title: 'Sets & Numbers', description: 'Venn diagrams and real numbers.' }] },
      { id: 'phy-f1', name: 'Physics', icon: 'fa-atom', topics: [{ id: 'pf1-1', title: 'Measurements & Forces', description: 'Length, mass, time, friction.' }] },
      { id: 'chem-f1', name: 'Chemistry', icon: 'fa-flask', topics: [{ id: 'cf1-1', title: 'Laboratory Safety & Matter', description: 'Apparatus and states of matter.' }] },
      { id: 'bio-f1', name: 'Biology', icon: 'fa-dna', topics: [{ id: 'bf1-1', title: 'Classification & Cells', description: 'Living organisms and cell structures.' }] },
      { id: 'geo-f1', name: 'Geography', icon: 'fa-earth-africa', topics: [{ id: 'gf1-1', title: 'Solar System & Map Work', description: 'Planets, orbits and map symbols.' }] },
      { id: 'hist-f1', name: 'History', icon: 'fa-scroll', topics: [{ id: 'hf1-1', title: 'Sources of History & Evolution', description: 'Archaeology and human development.' }] },
      { id: 'civ-f1', name: 'Civics', icon: 'fa-gavel', topics: [{ id: 'cf1-1', title: 'Our Nation & Citizenship', description: 'National symbols and duties.' }] },
      { id: 'kis-f1', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'kf1-1', title: 'Aina za Maneno na Sarufi', description: 'Nomino, vitenzi na ngeli.' }] },
      { id: 'eng-f1', name: 'English Language', icon: 'fa-font', topics: [{ id: 'ef1-1', title: 'Grammar & Listening Skills', description: 'Parts of speech and pronunciation.' }] },
      { id: 'comm-f1', name: 'Commerce', icon: 'fa-shop', topics: [{ id: 'co1-1', title: 'Scope of Commerce & Production', description: 'Trade and business aids.' }] },
      { id: 'bk-f1', name: 'Book-keeping', icon: 'fa-book-journal-whills', topics: [{ id: 'bk1-1', title: 'Accounting Equation & Ledgers', description: 'Double entry basics.' }] },
      { id: 'lit-f1', name: 'Literature in English', icon: 'fa-book-open-reader', topics: [{ id: 'lf1-1', title: 'Introduction to Literature', description: 'Oral literature and drama.' }] },
      { id: 'ics-f1', name: 'Information & Computer Studies', icon: 'fa-computer', topics: [{ id: 'ics1-1', title: 'Computer Hardware & Software', description: 'CPU, RAM and OS.' }] },
      { id: 'addmath-f1', name: 'Additional Mathematics', icon: 'fa-calculator', topics: [{ id: 'amf1-1', title: 'Advanced Sets & Algebra', description: 'Polynomials.' }] },
      { id: 'fre-f1', name: 'French (Kifaransa)', icon: 'fa-comments', topics: [{ id: 'ff1-1', title: 'Salutations et Grammaire', description: 'French basics.' }] },
      { id: 'ara-f1', name: 'Arabic (Kiarabu)', icon: 'fa-kaaba', topics: [{ id: 'af1-1', title: 'Huruf Al-Hijaiyyah', description: 'Arabic letters.' }] },
      { id: 'chi-f1', name: 'Mandarin Chinese (Kichina)', icon: 'fa-torii-gate', topics: [{ id: 'zhf1-1', title: 'Pinyin & Four Tones', description: 'Mandarin pronunciation.' }] },
      { id: 'nut-f1', name: 'Food & Human Nutrition', icon: 'fa-utensils', topics: [{ id: 'nf1-1', title: 'Nutrients & Digestion', description: 'Dietary requirements.' }] },
      { id: 'agri-f1', name: 'Agricultural Science', icon: 'fa-seedling', topics: [{ id: 'agf1-1', title: 'Introduction to Agriculture', description: 'Soil and farming.' }] },
      { id: 'bk-know-f1', name: 'Bible Knowledge', icon: 'fa-cross', topics: [{ id: 'bkf1-1', title: 'Creation & Exodus', description: 'Old Testament.' }] },
      { id: 'isl-know-f1', name: 'Islamic Knowledge', icon: 'fa-moon', topics: [{ id: 'ikf1-1', title: 'Tawheed & Pillars of Islam', description: 'Islamic studies.' }] },
      { id: 'art-f1', name: 'Fine Art & Design', icon: 'fa-paint-brush', topics: [{ id: 'artf1-1', title: 'Drawing & Shading', description: 'Artistic techniques.' }] }
    ]
  },
  {
    grade: GradeLevel.Form2,
    level: EducationLevel.SECONDARY,
    subjects: [
      { id: 'math-f2', name: 'Basic Mathematics', icon: 'fa-square-root-variable', topics: [{ id: 'mf2-1', title: 'Exponents & Logarithms', description: 'Indices and base 10.' }] },
      { id: 'phy-f2', name: 'Physics', icon: 'fa-atom', topics: [{ id: 'pf2-1', title: 'Pressure & Heat', description: 'Thermal expansion.' }] },
      { id: 'chem-f2', name: 'Chemistry', icon: 'fa-flask', topics: [{ id: 'cf2-1', title: 'Atomic Structure & Bonding', description: 'Periodic table.' }] },
      { id: 'bio-f2', name: 'Biology', icon: 'fa-dna', topics: [{ id: 'bf2-1', title: 'Nutrition & Respiration', description: 'Photosynthesis and gas exchange.' }] },
      { id: 'geo-f2', name: 'Geography', icon: 'fa-mountain', topics: [{ id: 'gf2-1', title: 'Human Activities & Agriculture', description: 'Farming and mining.' }] },
      { id: 'hist-f2', name: 'History', icon: 'fa-scroll', topics: [{ id: 'hf2-1', title: 'Pre-Colonial Trade & Slave Trade', description: 'Caravan trade.' }] },
      { id: 'civ-f2', name: 'Civics', icon: 'fa-gavel', topics: [{ id: 'cf2-1', title: 'Human Rights & Constitution', description: 'Law and democracy.' }] },
      { id: 'kis-f2', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'kf2-1', title: 'Fasihi Simulizi na Insha', description: 'Ngano na vitendawili.' }] },
      { id: 'eng-f2', name: 'English Language', icon: 'fa-font', topics: [{ id: 'ef2-1', title: 'Adjectives, Adverbs & Letters', description: 'Writing skills.' }] },
      { id: 'comm-f2', name: 'Commerce', icon: 'fa-shop', topics: [{ id: 'co2-1', title: 'Wholesale & Retail Trade', description: 'Distribution channels.' }] },
      { id: 'bk-f2', name: 'Book-keeping', icon: 'fa-book-journal-whills', topics: [{ id: 'bk2-1', title: 'Journals & Trial Balance', description: 'Books of original entry.' }] },
      { id: 'lit-f2', name: 'Literature in English', icon: 'fa-book-open-reader', topics: [{ id: 'lf2-1', title: 'Short Stories & Novels', description: 'Plot and character.' }] },
      { id: 'ics-f2', name: 'Information & Computer Studies', icon: 'fa-computer', topics: [{ id: 'ics2-1', title: 'Spreadsheets & Word Processing', description: 'MS Excel & Word.' }] },
      { id: 'addmath-f2', name: 'Additional Mathematics', icon: 'fa-calculator', topics: [{ id: 'amf2-1', title: 'Quadratic Equations & Functions', description: 'Algebraic graphs.' }] },
      { id: 'fre-f2', name: 'French (Kifaransa)', icon: 'fa-comments', topics: [{ id: 'ff2-1', title: 'La Conjugaison au Présent', description: 'Verbs in French.' }] },
      { id: 'ara-f2', name: 'Arabic (Kiarabu)', icon: 'fa-kaaba', topics: [{ id: 'af2-1', title: 'Al-Qawaid Al-Assasiyyah', description: 'Arabic grammar.' }] },
      { id: 'chi-f2', name: 'Mandarin Chinese', icon: 'fa-torii-gate', topics: [{ id: 'zhf2-1', title: 'Daily Conversation', description: 'Greetings & shopping.' }] },
      { id: 'nut-f2', name: 'Food & Human Nutrition', icon: 'fa-utensils', topics: [{ id: 'nf2-1', title: 'Meal Planning & Cooking', description: 'Food hygiene.' }] },
      { id: 'agri-f2', name: 'Agricultural Science', icon: 'fa-seedling', topics: [{ id: 'agf2-1', title: 'Crop Husbandry & Fertilizers', description: 'Planting techniques.' }] },
      { id: 'bk-know-f2', name: 'Bible Knowledge', icon: 'fa-cross', topics: [{ id: 'bkf2-1', title: 'Prophets & Kingdom of Israel', description: 'Biblical history.' }] },
      { id: 'isl-know-f2', name: 'Islamic Knowledge', icon: 'fa-moon', topics: [{ id: 'ikf2-1', title: 'Fiqh & Fardh Acts', description: 'Islamic laws.' }] },
      { id: 'art-f2', name: 'Performing Arts & Music', icon: 'fa-music', topics: [{ id: 'artf2-1', title: 'Music Theory & Instruments', description: 'Rhythm and pitch.' }] }
    ]
  },
  {
    grade: GradeLevel.Form3,
    level: EducationLevel.SECONDARY,
    subjects: [
      { id: 'math-f3', name: 'Basic Mathematics', icon: 'fa-square-root-variable', topics: [{ id: 'mf3-1', title: 'Relations, Functions & Statistics', description: 'Graphs and data.' }] },
      { id: 'phy-f3', name: 'Physics', icon: 'fa-bolt', topics: [{ id: 'pf3-1', title: 'Electricity & Magnetism', description: 'Circuits and induction.' }] },
      { id: 'chem-f3', name: 'Chemistry', icon: 'fa-vial', topics: [{ id: 'cf3-1', title: 'Mole Concept & Electrolysis', description: 'Stoichiometry.' }] },
      { id: 'bio-f3', name: 'Biology', icon: 'fa-leaf', topics: [{ id: 'bf3-1', title: 'Transport, Excretion & Coordination', description: 'Kidneys and nerves.' }] },
      { id: 'geo-f3', name: 'Geography', icon: 'fa-map-location-dot', topics: [{ id: 'gf3-1', title: 'Map Interpretation & Climate', description: 'Contours and biomes.' }] },
      { id: 'hist-f3', name: 'History', icon: 'fa-landmark-dome', topics: [{ id: 'hf3-1', title: 'Colonialism in Africa', description: 'Scramble for Africa.' }] },
      { id: 'civ-f3', name: 'Civics', icon: 'fa-gavel', topics: [{ id: 'cf3-1', title: 'Economic & Social Development', description: 'Poverty eradication.' }] },
      { id: 'kis-f3', name: 'Kiswahili', icon: 'fa-language', topics: [{ id: 'kf3-1', title: 'Fasihi Andishi na Isimujamii', description: 'Uchambuzi wa riwaya.' }] },
      { id: 'eng-f3', name: 'English Language', icon: 'fa-font', topics: [{ id: 'ef3-1', title: 'Active & Passive Voice, Memos', description: 'Formal correspondence.' }] },
      { id: 'comm-f3', name: 'Commerce', icon: 'fa-shop', topics: [{ id: 'co3-1', title: 'Banking, Insurance & Warehousing', description: 'Financial services.' }] },
      { id: 'bk-f3', name: 'Book-keeping', icon: 'fa-book-journal-whills', topics: [{ id: 'bk3-1', title: 'Financial Statements & Depreciation', description: 'Balance sheet.' }] },
      { id: 'lit-f3', name: 'Literature in English', icon: 'fa-book-open-reader', topics: [{ id: 'lf3-1', title: 'African Plays & Novels', description: 'Themes and conflict.' }] },
      { id: 'ics-f3', name: 'Information & Computer Studies', icon: 'fa-computer', topics: [{ id: 'ics3-1', title: 'Database Management (DBMS)', description: 'MS Access & SQL.' }] },
      { id: 'addmath-f3', name: 'Additional Mathematics', icon: 'fa-calculator', topics: [{ id: 'amf3-1', title: 'Trigonometry & Calculus Intro', description: 'Derivatives.' }] },
      { id: 'fre-f3', name: 'French (Kifaransa)', icon: 'fa-comments', topics: [{ id: 'ff3-1', title: 'Le Passé Composé et Imparfait', description: 'Past tenses.' }] },
      { id: 'ara-f3', name: 'Arabic (Kiarabu)', icon: 'fa-kaaba', topics: [{ id: 'af3-1', title: 'Al-Af\'al Al-Thulathiyyah', description: 'Verb roots.' }] },
      { id: 'chi-f3', name: 'Mandarin Chinese', icon: 'fa-torii-gate', topics: [{ id: 'zhf3-1', title: 'Food, Dining & Shopping', description: 'Conversational drills.' }] },
      { id: 'nut-f3', name: 'Food & Human Nutrition', icon: 'fa-utensils', topics: [{ id: 'nf3-1', title: 'Food Preservation & Processing', description: 'Safety methods.' }] },
      { id: 'agri-f3', name: 'Agricultural Science', icon: 'fa-seedling', topics: [{ id: 'agf3-1', title: 'Livestock Husbandry & Diseases', description: 'Animal health.' }] },
      { id: 'bk-know-f3', name: 'Bible Knowledge', icon: 'fa-cross', topics: [{ id: 'bkf3-1', title: 'Gospel of Luke & Miracles', description: 'New Testament.' }] },
      { id: 'isl-know-f3', name: 'Islamic Knowledge', icon: 'fa-moon', topics: [{ id: 'ikf3-1', title: 'Seerah of Prophet Muhammad (PBUH)', description: 'Islamic history.' }] },
      { id: 'art-f3', name: 'Technical Drawing & Fine Art', icon: 'fa-compass-drafting', topics: [{ id: 'artf3-1', title: 'Geometric Projection', description: 'Drafting principles.' }] }
    ]
  },
  {
    grade: GradeLevel.Form4,
    level: EducationLevel.SECONDARY,
    subjects: [
      { id: 'math-f4', name: 'Basic Mathematics (CSEE)', icon: 'fa-calculator', topics: [{ id: 'mf4-1', title: 'Trigonometry & Matrices', description: 'Determinants and vectors.' }] },
      { id: 'phy-f4', name: 'Physics (CSEE)', icon: 'fa-atom', topics: [{ id: 'pf4-1', title: 'Electronics & Nuclear Physics', description: 'Diodes and radioactivity.' }] },
      { id: 'chem-f4', name: 'Chemistry (CSEE)', icon: 'fa-vial', topics: [{ id: 'cf4-1', title: 'Organic Chemistry & Metals', description: 'Alkanes and blast furnace.' }] },
      { id: 'bio-f4', name: 'Biology (CSEE)', icon: 'fa-dna', topics: [{ id: 'bf4-1', title: 'Genetics, Evolution & Ecology', description: 'Inheritance and DNA.' }] },
      { id: 'geo-f4', name: 'Geography (CSEE)', icon: 'fa-map', topics: [{ id: 'gf4-1', title: 'Agriculture & Tourism', description: 'Economic geography.' }] },
      { id: 'hist-f4', name: 'History (CSEE)', icon: 'fa-scroll', topics: [{ id: 'hf4-1', title: 'Nationalism & Decolonization', description: 'Independence movements.' }] },
      { id: 'civ-f4', name: 'Civics (CSEE)', icon: 'fa-gavel', topics: [{ id: 'cf4-1', title: 'International Relations', description: 'Tanzania in EAC and UN.' }] },
      { id: 'kis-f4', name: 'Kiswahili (CSEE)', icon: 'fa-language', topics: [{ id: 'kf4-1', title: 'Uhakiki wa Vitabu teule vya NECTA', description: 'Uchambuzi wa kina.' }] },
      { id: 'eng-f4', name: 'English Language (CSEE)', icon: 'fa-font', topics: [{ id: 'ef4-1', title: 'Speech Writing & Advanced Essay', description: 'Public speaking.' }] },
      { id: 'comm-f4', name: 'Commerce (CSEE)', icon: 'fa-shop', topics: [{ id: 'co4-1', title: 'International Trade & Stock Market', description: 'Import/export and DSE.' }] },
      { id: 'bk-f4', name: 'Book-keeping (CSEE)', icon: 'fa-book-journal-whills', topics: [{ id: 'bk4-1', title: 'Partnerships & Company Accounts', description: 'Share capital.' }] },
      { id: 'lit-f4', name: 'Literature in English (CSEE)', icon: 'fa-book-open-reader', topics: [{ id: 'lf4-1', title: 'Poetry Analysis & Criticism', description: 'Literary style.' }] },
      { id: 'ics-f4', name: 'Information & Computer Studies', icon: 'fa-computer', topics: [{ id: 'ics4-1', title: 'Networks, Internet & Cybersecurity', description: 'IP, routers, firewalls.' }] },
      { id: 'addmath-f4', name: 'Additional Mathematics (CSEE)', icon: 'fa-calculator', topics: [{ id: 'amf4-1', title: 'Coordinate Geometry & Calculus', description: 'Integration.' }] },
      { id: 'fre-f4', name: 'French (Kifaransa CSEE)', icon: 'fa-comments', topics: [{ id: 'ff4-1', title: 'Le Futur Simple et Subjonctif', description: 'Advanced French.' }] },
      { id: 'ara-f4', name: 'Arabic (Kiarabu CSEE)', icon: 'fa-kaaba', topics: [{ id: 'af4-1', title: 'Al-Insha wal-Khitab', description: 'Arabic composition.' }] },
      { id: 'chi-f4', name: 'Mandarin Chinese (CSEE)', icon: 'fa-torii-gate', topics: [{ id: 'zhf4-1', title: 'HSK Exam Preparation', description: 'Mandarin mastery.' }] },
      { id: 'nut-f4', name: 'Food & Human Nutrition (CSEE)', icon: 'fa-utensils', topics: [{ id: 'nf4-1', title: 'Dietary Diseases & Meal Services', description: 'Nutrition care.' }] },
      { id: 'agri-f4', name: 'Agricultural Science (CSEE)', icon: 'fa-seedling', topics: [{ id: 'agf4-1', title: 'Agribusiness & Farm Management', description: 'Farm budgeting.' }] },
      { id: 'bk-know-f4', name: 'Bible Knowledge (CSEE)', icon: 'fa-cross', topics: [{ id: 'bkf4-1', title: 'Acts of the Apostles', description: 'Early church.' }] },
      { id: 'isl-know-f4', name: 'Islamic Knowledge (CSEE)', icon: 'fa-moon', topics: [{ id: 'ikf4-1', title: 'Quranic Exegesis (Tafseer)', description: 'Surah analysis.' }] },
      { id: 'art-f4', name: 'Fine Art & Crafts (CSEE)', icon: 'fa-palette', topics: [{ id: 'artf4-1', title: 'Exhibition & Art History', description: 'African art.' }] }
    ]
  },

  // --- HIGH SCHOOL A-LEVEL (FORMS 5 - 6) ---
  {
    grade: GradeLevel.Form5,
    level: EducationLevel.HIGH_SCHOOL,
    subjects: [
      { id: 'adv-math-f5', name: 'Advanced Mathematics', icon: 'fa-square-root-variable', topics: [{ id: 'amf5-1', title: 'Logic, Calculus & Trigonometry', description: 'Limits, derivatives and integrals.' }] },
      { id: 'gs-f5', name: 'General Studies (GS)', icon: 'fa-earth-africa', topics: [{ id: 'gs5-1', title: 'Philosophy, Gender & Constitution', description: 'Legal and international issues.' }] },
      { id: 'bam-f5', name: 'Basic Applied Mathematics (BAM)', icon: 'fa-calculator', topics: [{ id: 'bam5-1', title: 'Functions, Matrices & Probability', description: 'Applied math for arts/science.' }] },
      { id: 'phy-f5', name: 'Physics (Advanced)', icon: 'fa-atom', topics: [{ id: 'apf5-1', title: 'Mechanics, Heat & Waves', description: 'Projectiles, thermodynamics.' }] },
      { id: 'chem-f5', name: 'Chemistry (Advanced)', icon: 'fa-flask-vial', topics: [{ id: 'acf5-1', title: 'Physical & Organic Chemistry', description: 'Reaction kinetics and bonding.' }] },
      { id: 'bio-f5', name: 'Biology (Advanced)', icon: 'fa-dna', topics: [{ id: 'abf5-1', title: 'Cytology, Taxonomy & Genetics', description: 'Cell biology and DNA.' }] },
      { id: 'geo-f5', name: 'Geography (Advanced)', icon: 'fa-mountain-sun', topics: [{ id: 'agf5-1', title: 'Physical Geography & Geomorphology', description: 'Plate tectonics.' }] },
      { id: 'hist-f5', name: 'History (Advanced)', icon: 'fa-landmark-dome', topics: [{ id: 'ahf5-1', title: 'African & World History', description: 'Industrial revolution and colonialism.' }] },
      { id: 'civ-f5', name: 'Development Studies / Civics', icon: 'fa-gavel', topics: [{ id: 'ac5-1', title: 'Development Theories', description: 'Socio-economic growth.' }] },
      { id: 'kis-f5', name: 'Kiswahili (Lugha na Fasihi)', icon: 'fa-language', topics: [{ id: 'kf5-1', title: 'Isimujamii na Sarufi ya Kina', description: 'Uchanganuzi wa lugha.' }] },
      { id: 'eng-f5', name: 'English Language & Linguistics', icon: 'fa-font', topics: [{ id: 'ef5-1', title: 'Phonetics, Phonology & Syntax', description: 'Linguistic trees.' }] },
      { id: 'lit-f5', name: 'Literature in English (Advanced)', icon: 'fa-book-open-reader', topics: [{ id: 'lf5-1', title: 'Literary Theories & Criticism', description: 'Marxism, Feminism.' }] },
      { id: 'comm-f5', name: 'Commerce (Advanced)', icon: 'fa-shop', topics: [{ id: 'acomm5-1', title: 'Business Management & Finance', description: 'Corporate finance.' }] },
      { id: 'acc-f5', name: 'Accountancy & Bookkeeping', icon: 'fa-book-journal-whills', topics: [{ id: 'acc5-1', title: 'Financial Accounting Standards', description: 'IAS & IFRS.' }] },
      { id: 'econ-f5', name: 'Economics (Advanced)', icon: 'fa-chart-line', topics: [{ id: 'aecon5-1', title: 'Microeconomics & Elasticity', description: 'Consumer theory.' }] },
      { id: 'cs-f5', name: 'Computer Science (Advanced)', icon: 'fa-code', topics: [{ id: 'acs5-1', title: 'Programming & Data Structures', description: 'Algorithms and logic.' }] },
      { id: 'fre-f5', name: 'French (Advanced Kifaransa)', icon: 'fa-comments', topics: [{ id: 'aff5-1', title: 'Littérature Francophone', description: 'African French prose.' }] },
      { id: 'ara-f5', name: 'Arabic (Advanced Kiarabu)', icon: 'fa-kaaba', topics: [{ id: 'aaf5-1', title: 'Classical Arabic Literature', description: 'Poetry and prose.' }] },
      { id: 'chi-f5', name: 'Mandarin Chinese (Advanced)', icon: 'fa-torii-gate', topics: [{ id: 'azhf5-1', title: 'Advanced Hanzi & Translation', description: 'HSK 3-4 prep.' }] },
      { id: 'agri-f5', name: 'Agricultural Science (Advanced)', icon: 'fa-seedling', topics: [{ id: 'aag5-1', title: 'Soil Physics & Crop Agronomy', description: 'Advanced agronomy.' }] },
      { id: 'nut-f5', name: 'Food & Nutrition (Advanced)', icon: 'fa-utensils', topics: [{ id: 'anf5-1', title: 'Biochemistry of Nutrition', description: 'Metabolism.' }] },
      { id: 'div-f5', name: 'Divinity & Bible Knowledge', icon: 'fa-cross', topics: [{ id: 'adiv5-1', title: 'Old & New Testament Theology', description: 'Theological essays.' }] }
    ]
  },
  {
    grade: GradeLevel.Form6,
    level: EducationLevel.HIGH_SCHOOL,
    subjects: [
      { id: 'adv-math-f6', name: 'Advanced Mathematics (ACSEE)', icon: 'fa-infinity', topics: [{ id: 'amf6-1', title: 'Complex Numbers & Differential Equations', description: 'Imaginary parts and linear programming.' }] },
      { id: 'gs-f6', name: 'General Studies (ACSEE)', icon: 'fa-earth-africa', topics: [{ id: 'gs6-1', title: 'International Relations & Science Ethics', description: 'Global diplomacy.' }] },
      { id: 'bam-f6', name: 'Basic Applied Mathematics (ACSEE)', icon: 'fa-calculator', topics: [{ id: 'bam6-1', title: 'Linear Programming & Calculus', description: 'Optimization.' }] },
      { id: 'phy-f6', name: 'Physics (ACSEE)', icon: 'fa-wave-square', topics: [{ id: 'pf6-1', title: 'Waves, Quantum & Geophysics', description: 'Modern physics.' }] },
      { id: 'chem-f6', name: 'Chemistry (ACSEE)', icon: 'fa-vial-circle-check', topics: [{ id: 'cf6-1', title: 'Polymers, Environmental & Analytics', description: 'Titration and qualitative analysis.' }] },
      { id: 'bio-f6', name: 'Biology (ACSEE)', icon: 'fa-dna', topics: [{ id: 'bf6-1', title: 'Biotechnology & Plant Physiology', description: 'Genetic engineering.' }] },
      { id: 'geo-f6', name: 'Geography (ACSEE)', icon: 'fa-mountain-sun', topics: [{ id: 'gf6-1', title: 'Population, Settlement & Climatology', description: 'Human geography.' }] },
      { id: 'hist-f6', name: 'History (ACSEE)', icon: 'fa-landmark-dome', topics: [{ id: 'hf6-1', title: 'Pan-Africanism & Cold War History', description: 'Decolonization.' }] },
      { id: 'kis-f6', name: 'Kiswahili (Fasihi & Uhakiki ACSEE)', icon: 'fa-language', topics: [{ id: 'kf6-1', title: 'Uhakiki wa Vitabu na Ushairi', description: 'Uchambuzi wa riwaya.' }] },
      { id: 'eng-f6', name: 'English Language & Stylistics', icon: 'fa-font', topics: [{ id: 'ef6-1', title: 'Semantics, Pragmatics & Stylistics', description: 'Text analysis.' }] },
      { id: 'lit-f6', name: 'World Literature in English', icon: 'fa-book-open-reader', topics: [{ id: 'lf6-1', title: 'Comparative World Prose & Epic Poetry', description: 'Global literature.' }] },
      { id: 'comm-f6', name: 'Commerce (ACSEE)', icon: 'fa-shop', topics: [{ id: 'acomm6-1', title: 'International Business & Capital Markets', description: 'Global trade.' }] },
      { id: 'acc-f6', name: 'Accountancy & Auditing', icon: 'fa-book-journal-whills', topics: [{ id: 'acc6-1', title: 'Auditing & Management Accounting', description: 'Cost accounting.' }] },
      { id: 'econ-f6', name: 'Economics (ACSEE)', icon: 'fa-chart-line', topics: [{ id: 'aecon6-1', title: 'Macroeconomics, Inflation & Fiscal Policy', description: 'National income.' }] },
      { id: 'cs-f6', name: 'Computer Science (ACSEE)', icon: 'fa-code', topics: [{ id: 'acs6-1', title: 'Networking, Databases & Web Dev', description: 'System engineering.' }] },
      { id: 'fre-f6', name: 'French (ACSEE)', icon: 'fa-comments', topics: [{ id: 'aff6-1', title: 'Expression Orale et Essais', description: 'Oral and written mastery.' }] },
      { id: 'ara-f6', name: 'Arabic (ACSEE)', icon: 'fa-kaaba', topics: [{ id: 'aaf6-1', title: 'Balaagah & Rhetoric', description: 'Arabic literature.' }] },
      { id: 'chi-f6', name: 'Mandarin Chinese (ACSEE)', icon: 'fa-torii-gate', topics: [{ id: 'azhf6-1', title: 'HSK 4 Level Proficiency', description: 'Fluency exam prep.' }] },
      { id: 'agri-f6', name: 'Agricultural Science (ACSEE)', icon: 'fa-seedling', topics: [{ id: 'aag6-1', title: 'Agricultural Policy & Food Systems', description: 'Macro-agribusiness.' }] },
      { id: 'nut-f6', name: 'Food & Nutrition (ACSEE)', icon: 'fa-utensils', topics: [{ id: 'anf6-1', title: 'Dietetics & Community Nutrition', description: 'Clinical nutrition.' }] },
      { id: 'div-f6', name: 'Divinity & Bible Knowledge', icon: 'fa-cross', topics: [{ id: 'adiv6-1', title: 'Epistles & Christian Ethics', description: 'New Testament theology.' }] }
    ]
  }
];

export const SYLLABUS_DATA = enhanceSyllabusWithTopics(BASE_SYLLABUS_DATA);

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
