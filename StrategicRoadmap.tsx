import React, { useState, useMemo } from 'react';

export interface RoadmapPoint {
  id: number;
  title: string;
  category: string;
  icon: string;
  status: 'Live & Active' | 'In Development' | 'Planned Roadmap';
  summary: string;
  details: string;
  targetAudience: 'Students' | 'Teachers' | 'Parents' | 'Schools' | 'Developers';
  swahiliTitle?: string;
}

export const ROADMAP_CATEGORIES = [
  { id: 'all', name: 'All 150 Points', icon: 'fa-list-check' },
  { id: 'necta', name: 'I. NECTA & Curriculum (1–15)', icon: 'fa-graduation-cap' },
  { id: 'stem', name: 'II. STEM & Science Labs (16–30)', icon: 'fa-flask' },
  { id: 'teacher', name: 'III. Teacher Tools & Pedagogy (31–45)', icon: 'fa-chalkboard-user' },
  { id: 'offline', name: 'IV. Offline & Low-Bandwidth (46–60)', icon: 'fa-wifi' },
  { id: 'careers', name: 'V. Student Motivation & Careers (61–75)', icon: 'fa-compass' },
  { id: 'monetization', name: 'VI. Monetization & Operations (76–90)', icon: 'fa-wallet' },
  { id: 'admin', name: 'VII. Admin & Quality Audit (91–100)', icon: 'fa-shield-halved' },
  { id: 'examtech', name: 'VIII. Exam & Result Tech (101–110)', icon: 'fa-square-poll-vertical' },
  { id: 'swahili', name: 'IX. Swahili EdTech & Localization (111–120)', icon: 'fa-language' },
  { id: 'hardware', name: 'X. Low-Resource Hardware (121–130)', icon: 'fa-mobile-screen' },
  { id: 'ai', name: 'XI. AI & Personalization (131–140)', icon: 'fa-robot' },
  { id: 'ecosystem', name: 'XII. Ecosystem & Parents (141–150)', icon: 'fa-users' },
];

export const ALL_150_ROADMAP_POINTS: RoadmapPoint[] = [
  // SECTION I: NECTA & CURRICULUM (1-15)
  {
    id: 1,
    title: 'Interactive NECTA Division & Points Calculator',
    swahiliTitle: 'Kikokotoo cha Division na Pointi za NECTA',
    category: 'necta',
    icon: 'fa-calculator',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Calculates CSEE (Form 4) and ACSEE (Form 6) Division (Div I, II, III, IV, Zero) with GPA point breakdown.',
    details: 'Supports both O-Level (best 7 subjects) and A-Level (best 3 principal subjects) according to official NECTA grading rules.'
  },
  {
    id: 2,
    title: 'TCU & NACTVET Admission Eligibility Checker',
    swahiliTitle: 'Kihakiki cha Sifa za Udadisi TCU & NACTVET',
    category: 'necta',
    icon: 'fa-university',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Matches ACSEE grades against university cut-offs (UDSM, MUHAS, SUA, Dodoma).',
    details: 'Filters degree and diploma programs based on minimum principal points, mandatory pass subjects, and TCU entry criteria.'
  },
  {
    id: 3,
    title: 'Form 5 Combination Recommender',
    swahiliTitle: 'Mpendekeza Mchepuo wa Kidato cha Tano',
    category: 'necta',
    icon: 'fa-sitemap',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Quiz-based algorithm recommending PCB, PCM, EGM, CBG, HGL, HKL combinations.',
    details: 'Analyses Form 4 CSEE grades alongside career interests to suggest optimal A-Level streams and future degree paths.'
  },
  {
    id: 4,
    title: 'NECTA Examiner Mistake Reports (CIRA Breakdown)',
    swahiliTitle: 'Uchambuzi wa Makosa ya Mitihani CIRA',
    category: 'necta',
    icon: 'fa-file-signature',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Summaries of official Candidate Items Response Analysis highlighting frequent exam pitfalls.',
    details: 'Translates official NECTA CIRA examiner notes into actionable tips showing why students lose marks.'
  },
  {
    id: 5,
    title: 'Marking Scheme Decoders',
    swahiliTitle: 'Uchambuzi wa Mpango wa Kutunuku Alama',
    category: 'necta',
    icon: 'fa-check-double',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Detailed annotations on past papers demonstrating point distribution (Formula, Substitution, Units).',
    details: 'Breakdown of marking rubrics for Mathematics, Physics, Chemistry, and Biology NECTA past papers.'
  },
  {
    id: 6,
    title: '2023 Competency-Based Curriculum Transition Guides',
    swahiliTitle: 'Miongozo ya Mabadiliko ya Msumeno TIE 2023',
    category: 'necta',
    icon: 'fa-book-open',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Resources explaining new TIE syllabus frameworks, vocational pathways, and practical skill tracks.',
    details: 'Guides educators through academic vs. vocational tracks introduced in the revised Tanzania Institute of Education framework.'
  },
  {
    id: 7,
    title: 'Primary School (PSLE) Kiswahili-to-English Bridge',
    swahiliTitle: 'Daraja la Kiingereza Kutoka Shule ya Msingi',
    category: 'necta',
    icon: 'fa-arrow-right-arrow-left',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Transition modules preparing Standard 7 leavers for English-medium instruction in Form 1.',
    details: 'Bilingual vocabulary and grammar drills easing the transition from Kiswahili primary education to English secondary learning.'
  },
  {
    id: 8,
    title: 'Form 2 National Assessment (FTNA) Survival Kit',
    swahiliTitle: 'Kiti cha Kujiandaa na Mtihani wa Kidato cha Pili',
    category: 'necta',
    icon: 'fa-shield-heart',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Targeted diagnostic tests and review notes for mandatory Form 2 screening exams.',
    details: 'Includes sample papers, timer quizzes, and weakness-focused remediation for FTNA subjects.'
  },
  {
    id: 9,
    title: 'Form 4 English Literature Book Analysis Hub',
    swahiliTitle: 'Uchambuzi wa Vitabu vya Fasihi ya Kiingereza Form 4',
    category: 'necta',
    icon: 'fa-book-bookmark',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Deep dives into mandated setbooks (plays, novels, poetry) with character charts and essay guides.',
    details: 'Covers prescribed literature like The Lion and the Jewel, Unanswered Cries, Passed Like a Shadow, and Poetry sets.'
  },
  {
    id: 10,
    title: 'A-Level Practical Paper Alternatives (3A vs 3B Guides)',
    swahiliTitle: 'Mwongozo wa Mitihani ya Vitendo A-Level (3A na 3B)',
    category: 'necta',
    icon: 'fa-vials',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Comparative preparation guides for actual practicals vs. alternative-to-practical papers.',
    details: 'Provides advance instructions, titration techniques, circuit setups, and graph drawing guidelines for Physics, Chemistry, and Biology.'
  },
  {
    id: 11,
    title: 'Civics & General Studies (GS) Essay Bank',
    swahiliTitle: 'Benki ya Insha za Civics na General Studies',
    category: 'necta',
    icon: 'fa-pen-nib',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Repository of top-scoring essays covering Tanzanian Constitution, EAC affairs, and global issues.',
    details: 'Model answers with clear introductions, body paragraphs, and conclusions aligned with NECTA essay marking rubrics.'
  },
  {
    id: 12,
    title: 'Bilingual Subject Glossary',
    swahiliTitle: 'Kamusi ya Istilahi za Masomo na Kiingereza/Kiswahili',
    category: 'necta',
    icon: 'fa-spell-check',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Side-by-side English and Kiswahili terminology definitions with audio audio playback.',
    details: 'Searchable database covering core scientific, mathematical, and economic terms with audio phonetic pronunciations.'
  },
  {
    id: 13,
    title: 'Local Geography Case Studies',
    swahiliTitle: 'Mifano ya Jiografia ya Tanzania (Kahama, Dodoma, Northern Circuit)',
    category: 'necta',
    icon: 'fa-map-location-dot',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Real-world case studies focusing on Tanzanian mining, tourism, agriculture, and climate.',
    details: 'Features detailed analysis of Kahama gold fields, Dodoma soil conservation, Kilombero sugar production, and Northern Circuit tourism.'
  },
  {
    id: 14,
    title: 'NECTA Command Word Dictionary',
    swahiliTitle: 'Kamusi ya Maneno ya Maagizo ya Mitihani NECTA',
    category: 'necta',
    icon: 'fa-terminal',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Clear breakdown of expectations for terms like Define, Explain, Differentiate, Account for.',
    details: 'Helps students avoid structural mistakes by explaining exact response lengths and formats required by examiners.'
  },
  {
    id: 15,
    title: 'National Exam Countdown Timers',
    swahiliTitle: 'Wakati Unaobaki Kuelekea Mitihani ya Kitaifa',
    category: 'necta',
    icon: 'fa-stopwatch',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Subject-specific visual clocks indicating exact time remaining until NECTA exam dates.',
    details: 'Countdown widget with customizable study goal prompts and daily revision schedule reminders.'
  },

  // SECTION II: STEM & SCIENCE LABS (16-30)
  {
    id: 16,
    title: 'Virtual Science Lab Apparatus Manual',
    swahiliTitle: 'Mwongozo wa Vifaa vya Maabara ya Sayansi',
    category: 'stem',
    icon: 'fa-flask-vial',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Interactive labeled diagrams and safety rules for burettes, pipettes, and microscopes.',
    details: 'Teaches students lab equipment names, proper meniscus readings, and safety procedures before physical lab sessions.'
  },
  {
    id: 17,
    title: 'Step-by-Step Chemical Equation Balancer',
    swahiliTitle: 'Kikokotoo cha Kusawazisha Milinganyo ya Kemia',
    category: 'stem',
    icon: 'fa-atom',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Input unbalanced chemical equations to generate step-by-step balanced outputs.',
    details: 'Shows stoichiometry balancing steps, oxidation states, and reaction classification (synthesis, decomposition, redox).'
  },
  {
    id: 18,
    title: 'Physics Formula Bank & Derivation Tree',
    swahiliTitle: 'Benki ya Mfumo ya Fizikia na Mti wa Derivation',
    category: 'stem',
    icon: 'fa-square-root-variable',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Categorized reference list for O-Level and A-Level physics formulas with SI unit keys.',
    details: 'Step-by-step mathematical derivations for equations of motion, electrical circuits, thermodynamics, and electromagnetism.'
  },
  {
    id: 19,
    title: 'Biology Specimen Identification Library',
    swahiliTitle: 'Maktaba ya Vielelezo vya Biolojia kwa Vitendo',
    category: 'stem',
    icon: 'fa-microscope',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'High-resolution photo galleries and key identification characteristics tested in NECTA practicals.',
    details: 'Covers plant tissues, animal specimens, cell division stages, and ecological adaptation features with diagnostic keys.'
  },
  {
    id: 20,
    title: 'Qualitative Analysis Flowcharts',
    swahiliTitle: 'Michoro ya Mtiririko ya Uchambuzi wa Kemia',
    category: 'stem',
    icon: 'fa-diagram-project',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Interactive decision trees guiding Chemistry students through cation and anion identification tests.',
    details: 'Reagent color change guides for testing copper, iron, zinc, carbonates, nitrates, and sulphates in practical exams.'
  },
  {
    id: 21,
    title: '3D Interactive Anatomical Models',
    swahiliTitle: 'Mifano ya 3D ya Kiini na Viungo vya Mwili',
    category: 'stem',
    icon: 'fa-cube',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Rotatable visual models of human heart, nephron, plant vascular systems, and cell structures.',
    details: 'Web-based lightweight 3D canvas rendering biological systems with clickable part descriptions.'
  },
  {
    id: 22,
    title: 'Mathematics Step-by-Step Solvers',
    swahiliTitle: 'Msuluhishi wa Hesabu wa Hatua kwa Hatua',
    category: 'stem',
    icon: 'fa-calculator',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Embedded solvers for quadratic equations, matrices, vectors, and linear programming.',
    details: 'Generates working steps matching NECTA format, including graph plotting parameters and matrix determinants.'
  },
  {
    id: 23,
    title: 'Low-Cost Home Science Experiment Guides',
    swahiliTitle: 'Jaribio la Sayansi Nyumbani kwa Vifaa vya Kawaida',
    category: 'stem',
    icon: 'fa-house-laptop',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Instructions for conducting safe science experiments using simple household materials.',
    details: 'Enables students in schools without physical labs to perform pH testing, indicator extraction, and simple pendulum physics at home.'
  },
  {
    id: 24,
    title: 'Periodic Table with Local Applications',
    swahiliTitle: 'Jedwali la Elementi Lenye Matumizi ya Tanzania',
    category: 'stem',
    icon: 'fa-border-all',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Interactive periodic table highlighting Tanzanian mineral applications (Gold, Tanzanite, Gas).',
    details: 'Detailed element cards showing atomic numbers, electron configuration, and industrial extraction in Tanzania.'
  },
  {
    id: 25,
    title: 'Physics Circuit Builder',
    swahiliTitle: 'Mjenzi wa Saketi za Umeme wa Fizikia',
    category: 'stem',
    icon: 'fa-bolt',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Lightweight canvas for constructing series/parallel circuits and measuring voltage & current.',
    details: 'Simulates Ohm law, Kirchhoff laws, resistors in series/parallel, and internal resistance of cells.'
  },
  {
    id: 26,
    title: 'Geographical Mapwork & Photo Interpretation Exercises',
    swahiliTitle: 'Mazoezi ya Ramani na Picha za Jiografia',
    category: 'stem',
    icon: 'fa-map',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Interactive topographical maps with tools for calculating grid references, contours, and bearings.',
    details: 'Practice suite for calculating gradient, drawing cross-sections, and identifying settlement patterns on topographical sheets.'
  },
  {
    id: 27,
    title: 'A-Level Organic Chemistry Reaction Schemes',
    swahiliTitle: 'Ramani za Mchango wa Kemia ya Kikaboni A-Level',
    category: 'stem',
    icon: 'fa-dna',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Visual reaction pathways for alcohols, aldehydes, ketones, carboxylic acids, and polymers.',
    details: 'Interactive synthesis charts detailing reaction conditions, catalysts, mechanisms, and functional group tests.'
  },
  {
    id: 28,
    title: 'Agricultural Science Field Practicals',
    swahiliTitle: 'Mazoezi ya Shambani ya Elimu ya Kilimo',
    category: 'stem',
    icon: 'fa-seedling',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Illustrated guides on crop rotation, soil sampling, livestock care, and farm machinery.',
    details: 'Aligned with TIE vocational agriculture syllabi, covering soil fertility management and pest control.'
  },
  {
    id: 29,
    title: 'Coding & Computer Studies Sandbox',
    swahiliTitle: 'Uwanja wa Kujifunza Programu za Kompyuta',
    category: 'stem',
    icon: 'fa-code',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Web-based code execution environment for Secondary Computer Studies (HTML, CSS, Python).',
    details: 'In-browser IDE with instant preview for basic programming algorithms and web design exercises.'
  },
  {
    id: 30,
    title: 'Science Misconception Busters',
    swahiliTitle: 'Kurekebisha Elewa Isiyo Sahihi ya Sayansi',
    category: 'stem',
    icon: 'fa-lightbulb',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Targeted articles addressing common scientific misunderstandings (Mass vs Weight, Respiration vs Breathing).',
    details: 'Clarifies tricky concepts frequently confused by students during national examination questions.'
  },

  // SECTION III: TEACHER TOOLS & PEDAGOGY (31-45)
  {
    id: 31,
    title: 'Automated Scheme of Work Generator',
    swahiliTitle: 'Kizalishi cha Azimio la Kazi cha Mwalimu',
    category: 'teacher',
    icon: 'fa-sliders',
    status: 'Live & Active',
    targetAudience: 'Teachers',
    summary: 'Generates TIE-compliant Schemes of Work customized by subject, grade level, and term duration.',
    details: 'Includes competence statements, main topic divisions, sub-topics, teaching activities, and assessment strategies.'
  },
  {
    id: 32,
    title: 'Lesson Plan Template Engine',
    swahiliTitle: 'Injini ya Mipango ya Masomo (Lesson Plans)',
    category: 'teacher',
    icon: 'fa-clipboard-list',
    status: 'Live & Active',
    targetAudience: 'Teachers',
    summary: 'Standardized digital templates following competency-based teaching layout, exportable to Word/PDF.',
    details: 'Includes stages for introduction, main body activities, reflection, teaching aids list, and evaluation.'
  },
  {
    id: 33,
    title: 'Printable Test & Quiz Builder',
    swahiliTitle: 'Mjenzi wa Mitihani na Mazoezi ya Kuchapa',
    category: 'teacher',
    icon: 'fa-print',
    status: 'Live & Active',
    targetAudience: 'Teachers',
    summary: 'Select topics and difficulty levels to generate custom class tests with matching marking keys.',
    details: 'Allows teachers to format printable exam papers with customizable headers and instructions.'
  },
  {
    id: 34,
    title: 'Subject Logbook Digital Trackers',
    swahiliTitle: 'Kitabu cha Kidijitali cha Kumbukumbu za Somo',
    category: 'teacher',
    icon: 'fa-book-journal-whills',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Downloadable digital logs for tracking syllabus coverage across terms and academic years.',
    details: 'Monitors completed topics vs. planned schedule with progress percentage indicators.'
  },
  {
    id: 35,
    title: 'Teaching Aids & Low-Cost Materials Guide',
    swahiliTitle: 'Mwongozo wa Zana za Fundishia kwa Gharama Nafuu',
    category: 'teacher',
    icon: 'fa-scissors',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Tutorials for creating effective classroom teaching aids using local recycled materials.',
    details: 'Step-by-step guides for making plastic bottle volumetric models, cardboard protractors, and local plant dyes.'
  },
  {
    id: 36,
    title: 'Continuous Assessment Tracker (CA)',
    swahiliTitle: 'Kifuatiliaji cha Tathmini Endelevu (CA)',
    category: 'teacher',
    icon: 'fa-table-cells',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Organizes and computes school-based internal continuous assessment records.',
    details: 'Calculates student assignment averages, monthly test scores, and term terminal marks according to school grading policies.'
  },
  {
    id: 37,
    title: 'Pedagogical Strategy Hub',
    swahiliTitle: 'Kituo cha Mbinu Bora za Ufundishaji',
    category: 'teacher',
    icon: 'fa-graduation-cap',
    status: 'Live & Active',
    targetAudience: 'Teachers',
    summary: 'Articles on classroom management, active learning methods, and supporting struggling students.',
    details: 'Focuses on large-class management techniques, peer group learning, and formative assessment methods.'
  },
  {
    id: 38,
    title: 'Classroom Exercise Banks',
    swahiliTitle: 'Benki ya Mazoezi ya Darasani',
    category: 'teacher',
    icon: 'fa-folder-open',
    status: 'Live & Active',
    targetAudience: 'Teachers',
    summary: 'Thousands of end-of-topic review questions categorized by difficulty for homework assignments.',
    details: 'Includes direct conceptual questions, analytical problem-solving prompts, and past paper adaptations.'
  },
  {
    id: 39,
    title: 'Teacher Exchange Forum',
    swahiliTitle: 'Jukwaa la Kubadilishana Mawazo Miongoni mwa Walimu',
    category: 'teacher',
    icon: 'fa-comments',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Professional discussion space for sharing lesson plans, regional mock papers, and teaching insights.',
    details: 'Moderated forum categorized by subject departments (Sciences, Languages, Humanities, Commercial).'
  },
  {
    id: 40,
    title: 'TIE Textbook Mapping Indexes',
    swahiliTitle: 'Fahirisi ya Vitabu vya TIE na Mitihani ya NECTA',
    category: 'teacher',
    icon: 'fa-list-ol',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Cross-references past paper questions with exact page numbers in official TIE student textbooks.',
    details: 'Helps teachers direct students to relevant textbook chapters when reviewing past exam questions.'
  },
  {
    id: 41,
    title: 'Special Needs Education (SNE) Resources',
    swahiliTitle: 'Rasilimali za Elimu Maalumu (SNE)',
    category: 'teacher',
    icon: 'fa-wheelchair',
    status: 'Planned Roadmap',
    targetAudience: 'Teachers',
    summary: 'Teaching strategies and accessible formats for educators supporting visually or hearing-impaired pupils.',
    details: 'Includes high-contrast visual guides, screen-reader optimization, and simplified sign language terminology references.'
  },
  {
    id: 42,
    title: 'Parent-Teacher Meeting Presentation Slides',
    swahiliTitle: 'Onyesho la Walimu na Wazazi (PTA Slides)',
    category: 'teacher',
    icon: 'fa-file-powerpoint',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Ready-made slide decks helping teachers communicate student progress and NECTA preparation strategies.',
    details: 'Downloadable PowerPoint/PDF presentations for academic master briefings and orientation days.'
  },
  {
    id: 43,
    title: 'Teacher Professional Development Micro-Courses',
    swahiliTitle: 'Kozi Fupi za Maendeleo ya Kitaaluma ya Walimu',
    category: 'teacher',
    icon: 'fa-certificate',
    status: 'Planned Roadmap',
    targetAudience: 'Teachers',
    summary: 'Short digital micro-courses covering ICT integration, modern assessment, and leadership.',
    details: 'Self-paced modules with completion badges covering digital literacy and competency-based pedagogy.'
  },
  {
    id: 44,
    title: 'School Club Management Kits',
    swahiliTitle: 'Kiti cha Kusimamia Klabu za Shule (Malihai, STEM, Debate)',
    category: 'teacher',
    icon: 'fa-people-group',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Resource guides for managing extracurricular Malihai (Conservation), STEM, and Debate clubs.',
    details: 'Includes activity schedules, competition guidelines, project ideas, and club constitution templates.'
  },
  {
    id: 45,
    title: 'Head of Department (HOD) Administration Portal',
    swahiliTitle: 'Tovuti ya Utawala ya Wakuu wa Idara (HOD)',
    category: 'teacher',
    icon: 'fa-briefcase',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Downloadable templates for departmental meetings, internal moderation, and subject performance analysis.',
    details: 'Features subject grade distribution charts, moderation forms, and syllabus tracking logs.'
  },

  // SECTION IV: OFFLINE & LOW-BANDWIDTH (46-60)
  {
    id: 46,
    title: 'Progressive Web App (PWA) Offline Engine',
    swahiliTitle: 'Injini ya PWA Inayofanya Kazi Bila Mtandao',
    category: 'offline',
    icon: 'fa-download',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Full PWA support allowing students to save notes, formulas, and past papers without internet.',
    details: 'Uses service workers and local browser storage to cache notes, formulas, and interactive calculators.'
  },
  {
    id: 47,
    title: 'Compressed Single-Page PDF Downloads',
    swahiliTitle: 'Pakua Nukuu za PDF Zenye Ukubwa Mdogo wa Bando',
    category: 'offline',
    icon: 'fa-file-pdf',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Optimized, ultra-small footprint PDF downloads consuming minimal cellular data.',
    details: 'Generates vector-based PDF study summaries requiring under 200 KB per topic.'
  },
  {
    id: 48,
    title: 'Text-Only / Low-Data Mode Switch',
    swahiliTitle: 'Kitufe cha Njia ya Bando Kidogo (Low-Data Mode)',
    category: 'offline',
    icon: 'fa-gauge-simple-high',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Site-wide toggle hiding heavy images and animations to save cellular bundle data.',
    details: 'Reduces page payload by over 80% on 2G/3G networks while preserving full text notes and equations.'
  },
  {
    id: 49,
    title: 'USSD & SMS Query Integration',
    swahiliTitle: 'Uhoji wa Matokeo na Vidokezo kwa Njia ya USSD/SMS',
    category: 'offline',
    icon: 'fa-mobile-retro',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Allows basic feature-phone users to request exam tips or formulas via USSD/SMS shortcodes.',
    details: 'Provides offline access for students in remote areas without smartphone internet connectivity.'
  },
  {
    id: 50,
    title: 'WhatsApp Automated Study Bot',
    swahiliTitle: 'Boti ya Kujifunzia Kwenye WhatsApp',
    category: 'offline',
    icon: 'fa-brands fa-whatsapp',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'WhatsApp bot delivering daily practice questions, formula recaps, and downloadable notes.',
    details: 'Interactive automated messaging service delivering daily micro-quiz prompts directly to messaging apps.'
  },
  {
    id: 51,
    title: 'Telegram Resource Vault',
    swahiliTitle: 'Hifadhi ya Rasilimali Kwenye Telegram',
    category: 'offline',
    icon: 'fa-paper-plane',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Linked channel storing structured folders of past papers, audio lectures, and PDF collections.',
    details: 'Organized file library allowing students to search and download NECTA revision archives.'
  },
  {
    id: 52,
    title: 'Local Content Delivery Network (CDN) Edge Caching',
    swahiliTitle: 'Kasi ya Kujaza Kurasa kwa CDN za Afrika',
    category: 'offline',
    icon: 'fa-server',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Infrastructure serving assets from African edge data centers to maximize load speeds in Tanzania.',
    details: 'Ensures sub-second response times across Dar es Salaam, Dodoma, Arusha, and Mwanza regions.'
  },
  {
    id: 53,
    title: 'Audio-Only Mode for Video Lessons',
    swahiliTitle: 'Sikiliza Sauti Pekee ya Masomo ya Video',
    category: 'offline',
    icon: 'fa-headphones',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Stream or download ultra-compressed audio tracks of video lessons to save 90% data.',
    details: 'Allows students with limited internet bundles to listen to complete topic lectures.'
  },
  {
    id: 54,
    title: 'Print-Friendly CSS Styling',
    swahiliTitle: 'Muundo Rafiki wa Kuchapa (Print-Friendly CSS)',
    category: 'offline',
    icon: 'fa-print',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Strips dark backgrounds and navbars when printing notes to minimize printer ink consumption.',
    details: 'Clean, high-contrast monochrome print layout optimized for physical paper study.'
  },
  {
    id: 55,
    title: 'Dark Mode / Battery Saver Toggle',
    swahiliTitle: 'Njia ya Gizani Kuokoa Betri ya Simu',
    category: 'offline',
    icon: 'fa-moon',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'High-contrast dark theme designed to reduce eye strain and save battery during power outages.',
    details: 'Pitched-black OLED dark mode lowering power draw during load shedding.'
  },
  {
    id: 56,
    title: 'SD Card / Flash Drive Offline Bundles',
    swahiliTitle: 'Kifurushi cha Shule za Vijijini kwenye SD Card/Flash Drive',
    category: 'offline',
    icon: 'fa-hard-drive',
    status: 'In Development',
    targetAudience: 'Schools',
    summary: 'Pre-packaged ZIP archives of entire subject modules for distribution to rural offline schools.',
    details: 'Enables rural school computer labs without internet to load the entire syllabus library.'
  },
  {
    id: 57,
    title: 'Data-Usage Transparency Counters',
    swahiliTitle: 'Kipimo cha Bando Inayotumika (Data Counter)',
    category: 'offline',
    icon: 'fa-chart-pie',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Widget indicating estimated data cost (in KB/MB) before initiating a download or stream.',
    details: 'Gives students clear visibility over data bundle consumption before clicking resources.'
  },
  {
    id: 58,
    title: 'Cross-Device Account Synchronization',
    swahiliTitle: 'Kusikilizia Maendeleo Kwenye Simu Tofauti',
    category: 'offline',
    icon: 'fa-rotate',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Cloud sync saving bookmarks, quiz progress, and notes across shared family or café phones.',
    details: 'Firebase backed sync ensuring student history is restored regardless of device used.'
  },
  {
    id: 59,
    title: 'Modular Content Loading',
    swahiliTitle: 'Upakiaji wa Taratibu wa Maudhui (Lazy Loading)',
    category: 'offline',
    icon: 'fa-spinner',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Lazy-loading architecture serving text first, followed by essential diagrams.',
    details: 'Keeps initial page load under two seconds even on weak mobile connections.'
  },
  {
    id: 60,
    title: 'Browser Micro-Caching Strategy',
    swahiliTitle: 'Mbinu ya Hifadhi ya Muda kwenye Kivinjari',
    category: 'offline',
    icon: 'fa-database',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Advanced caching rules storing site structure in browser, requesting network data only for updates.',
    details: 'Minimizes HTTP requests and speeds up repeat navigation.'
  },

  // SECTION V: MOTIVATION & CAREERS (61-75)
  {
    id: 61,
    title: 'Gamified Daily Study Streaks',
    swahiliTitle: 'Kifuatiliaji cha Siku za Masomo (Streak Tracker)',
    category: 'careers',
    icon: 'fa-fire',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Streak tracker rewarding students with visual badges and level unlocks for daily learning.',
    details: 'Tracks consecutive days studied, awarding bonus Experience Points (EP) and achievement badges.'
  },
  {
    id: 62,
    title: 'Peer-to-Peer Study Group Matching',
    swahiliTitle: 'Kutafuta Makundi ya Masomo na Wanafunzi Wenzako',
    category: 'careers',
    icon: 'fa-user-group',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Connects students studying same subjects or preparing for national exams across regions.',
    details: 'Helps Form 4 and Form 6 candidates organize revision groups based on target combinations.'
  },
  {
    id: 63,
    title: 'National Leaderboards for Practice Quizzes',
    swahiliTitle: 'Msimamo wa Kitaifa wa Matokeo ya Mazoezi',
    category: 'careers',
    icon: 'fa-trophy',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Weekly competitions ranking high scorers on topic-specific quizzes across O-Level and A-Level.',
    details: 'Displays top students nationwide with opt-in privacy controls and regional badges.'
  },
  {
    id: 64,
    title: 'Ask a Scholar Q&A Moderated Board',
    swahiliTitle: 'Ubao wa Uliza Mtaalamu wa Masomo',
    category: 'careers',
    icon: 'fa-circle-question',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Community board where students post homework questions and receive verified answers from top peers/teachers.',
    details: 'Moderated Q&A feed with solution voting and subject tag filtering.'
  },
  {
    id: 65,
    title: 'Tanzanian Career Directory',
    swahiliTitle: 'Mwongozo wa Taaluma za Tanzania',
    category: 'careers',
    icon: 'fa-user-tie',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Profiles of local careers (Mining Engineer, Agronomist, Medical Officer) with required subject combos.',
    details: 'Details prerequisite secondary subjects, required university entry points, and local job market outlooks.'
  },
  {
    id: 66,
    title: 'HESLB Higher Education Student Loans Guide',
    swahiliTitle: 'Mwongozo wa Mikopo ya Elimu ya Juu HESLB',
    category: 'careers',
    icon: 'fa-building-columns',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Step-by-step guides helping Form 6 leavers understand HESLB loan application criteria and priority courses.',
    details: 'Explains cluster priority scoring, required attachments, OLAMS portal submission, and appeal procedures.'
  },
  {
    id: 67,
    title: 'Vocational & VETA Career Pathways',
    swahiliTitle: 'Njia za Mafunzo ya Ufundi Stadi VETA',
    category: 'careers',
    icon: 'fa-wrench',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Highlighting technical and vocational training routes offered through VETA.',
    details: 'Guide to trade certificates, mechanics, electrical installation, carpentry, and hospitality careers.'
  },
  {
    id: 68,
    title: 'Scholarship Opportunities Hub',
    swahiliTitle: 'Kituo cha Fursa za Ufadhili wa Masomo (Scholarships)',
    category: 'careers',
    icon: 'fa-award',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Curated, updated list of local, regional, and international undergraduate scholarships.',
    details: 'Covers MoEST scholarships, Mastercard Foundation, Commonwealth, and corporate sponsorship opportunities.'
  },
  {
    id: 69,
    title: 'Study Skills & Time Management Articles',
    swahiliTitle: 'Makala za Mbinu za Kujisomea na Ratiba',
    category: 'careers',
    icon: 'fa-clock',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Practical advice on overcoming exam anxiety, building revision timetables, and active recall.',
    details: 'Teaches Pomodoro technique, spaced repetition, Feynman technique, and stress mitigation.'
  },
  {
    id: 70,
    title: 'Top Student Spotlight Interviews',
    swahiliTitle: 'Mahojiano na Wanafunzi Bora wa Kitaifa NECTA',
    category: 'careers',
    icon: 'fa-star',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Inspirational Q&As with former top-performing NECTA students sharing revision habits.',
    details: 'Features study routines and exam hall strategies from top Form 4 and Form 6 national rankers.'
  },
  {
    id: 71,
    title: 'Student Mental Health & Wellbeing Guides',
    swahiliTitle: 'Mwongozo wa Afya ya Akili na Ustawi wa Mwanafunzi',
    category: 'careers',
    icon: 'fa-heart-pulse',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Articles discussing stress management, adequate sleep, and dealing with academic pressure.',
    details: 'Provides practical tips on balancing intense exam preparation with rest and mental wellness.'
  },
  {
    id: 72,
    title: 'Virtual Science & Innovation Fair',
    swahiliTitle: 'Monyesho wa Dijitali wa Uvumbuzi wa Sayansi',
    category: 'careers',
    icon: 'fa-lightbulb',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Platform where creative students showcase innovative science projects or local inventions.',
    details: 'Digital showcase for student inventions, coding projects, and environmental solutions.'
  },
  {
    id: 73,
    title: 'Debate & Public Speaking Hub',
    swahiliTitle: 'Kituo cha Mdahalo na Ufasaha wa Kuongea',
    category: 'careers',
    icon: 'fa-comments-dollar',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Topic ideas, argument outlines, and rules of order for inter-school debate competitions.',
    details: 'Aligned with Civics and General Studies syllabi, offering debate motions and speech techniques.'
  },
  {
    id: 74,
    title: 'Entrepreneurship & Financial Literacy for Youth',
    swahiliTitle: 'Elimu ya Ujasiriamali na Usimamizi wa Fedha',
    category: 'careers',
    icon: 'fa-coins',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Modules covering basic budgeting, mobile money savings, and micro-business skills post-school.',
    details: 'Practical guidance on financial planning, M-Pesa savings, and starting small ventures.'
  },
  {
    id: 75,
    title: 'Alumni Mentorship Network',
    swahiliTitle: 'Mtandao wa Miongozo Kutoka kwa Alumni',
    category: 'careers',
    icon: 'fa-hands-holding-child',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Connects university scholars with secondary students for academic guidance and transition advice.',
    details: 'Structured mentorship pairing university students with high school candidates.'
  },

  // SECTION VI: MONETIZATION & OPERATIONS (76-90)
  {
    id: 76,
    title: 'Mobile Money Micro-Transactions (M-Pesa, Tigo Pesa, Airtel)',
    swahiliTitle: 'Malipo ya Malipo Madogo ya Lipa kwa Simu (M-Pesa)',
    category: 'monetization',
    icon: 'fa-mobile-screen-button',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Seamless local mobile payment integration allowing small micro-subscriptions for premium content.',
    details: 'Supports daily, weekly, or monthly subscription passes via M-Pesa, Tigo Pesa, and Airtel Money.'
  },
  {
    id: 77,
    title: 'Freemium Content Strategy',
    swahiliTitle: 'Mkakati wa Maudhui ya Bure na ya Kulipia',
    category: 'monetization',
    icon: 'fa-unlock-keyhole',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Core notes and syllabus guides remain 100% free while charging small fees for video walk-throughs.',
    details: 'Ensures fundamental study notes stay accessible to all while offering optional advanced study tools.'
  },
  {
    id: 78,
    title: 'School-Wide Institutional Subscriptions',
    swahiliTitle: 'Usajili wa Taasisi kwa Shule Nzima (B2B Packages)',
    category: 'monetization',
    icon: 'fa-school-flag',
    status: 'In Development',
    targetAudience: 'Schools',
    summary: 'B2B packages allowing secondary schools to purchase site-wide access for all students at discounted rates.',
    details: 'Includes admin management dashboards, class progress reports, and batch student onboarding.'
  },
  {
    id: 79,
    title: 'Sponsorship & Corporate Social Responsibility (CSR)',
    swahiliTitle: 'Ufadhili wa Kampuni na CSR kwa Shule za Vijijini',
    category: 'monetization',
    icon: 'fa-handshake',
    status: 'In Development',
    targetAudience: 'Schools',
    summary: 'Partnerships with telecom operators and banks to sponsor free platform access for rural schools.',
    details: 'Enables corporate sponsors to fund digital education access for underserved communities.'
  },
  {
    id: 80,
    title: 'Targeted Educational Book Ad Space',
    swahiliTitle: 'Nafasi za Tangazo la Vitabu na Vifaa vya Shule',
    category: 'monetization',
    icon: 'fa-rectangle-ad',
    status: 'In Development',
    targetAudience: 'Developers',
    summary: 'Non-intrusive banner space for local educational publishers, stationery brands, and uniform suppliers.',
    details: 'Contextual advertising relevant to Tanzanian student and parent academic needs.'
  },
  {
    id: 81,
    title: 'Physical Study Kit Deliveries',
    swahiliTitle: 'Uwasilishaji wa Vitabu vya Mazoezi na Zana za Sayansi',
    category: 'monetization',
    icon: 'fa-box-open',
    status: 'Planned Roadmap',
    targetAudience: 'Parents',
    summary: 'E-commerce extension selling printed revision booklets and science kits delivered locally.',
    details: 'Delivers physical past paper bundles and home experiment kits via local courier networks.'
  },
  {
    id: 82,
    title: 'Private Tutoring Marketplace',
    swahiliTitle: 'Soko la Walimu Binfasi wa Nyumbani na Mtandaoni',
    category: 'monetization',
    icon: 'fa-chalkboard-user',
    status: 'Planned Roadmap',
    targetAudience: 'Parents',
    summary: 'Vetted platform connecting parents with qualified tutors for online or in-person private lessons.',
    details: 'Features teacher background checks, parent rating reviews, and secure booking management.'
  },
  {
    id: 83,
    title: 'Sponsored Quiz Competitions',
    swahiliTitle: 'Mashindano ya Mazoezi Yaliyofadhiliwa na Tuzo',
    category: 'monetization',
    icon: 'fa-gift',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Educational competitions hosted in partnership with corporate sponsors offering laptops and fee support.',
    details: 'National quiz leagues awarding academic prizes and school fee sponsorships to top students.'
  },
  {
    id: 84,
    title: 'Affiliate Links for Recommended Textbooks',
    swahiliTitle: 'Viungo vya Ununuzi wa Vitabu Rasmi vya TIE',
    category: 'monetization',
    icon: 'fa-cart-shopping',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Strategic links providing direct access to purchase official TIE-approved textbooks.',
    details: 'Directs students to authorized bookshops for physical TIE syllabus textbooks.'
  },
  {
    id: 85,
    title: 'Custom School Mock Exam Hosting',
    swahiliTitle: 'Uwezeshaji wa Mitihani ya Mock kwa Mtandao wa Shule',
    category: 'monetization',
    icon: 'fa-laptop-code',
    status: 'Planned Roadmap',
    targetAudience: 'Schools',
    summary: 'White-label service allowing school districts to host and grade digital mock exams.',
    details: 'Infrastructure for district or zonal school boards to run secure online practice trials.'
  },
  {
    id: 86,
    title: 'Parental SMS Progress Alerts',
    swahiliTitle: 'Arafu za SMS za Kila Wiki kwa Wazazi',
    category: 'monetization',
    icon: 'fa-comment-sms',
    status: 'Live & Active',
    targetAudience: 'Parents',
    summary: 'Optional subscription sending parents weekly updates on quiz scores and study consistency.',
    details: 'Automated SMS summaries keeping parents informed on student streak and performance.'
  },
  {
    id: 87,
    title: 'Data Insights & Analytics Reports',
    swahiliTitle: 'Ripoti za Takwimu za Kujifunza kwa Tafiti',
    category: 'monetization',
    icon: 'fa-chart-column',
    status: 'Planned Roadmap',
    targetAudience: 'Developers',
    summary: 'Anonymized learning analytics reports sold to researchers and NGOs to identify learning gaps.',
    details: 'Aggregated analytics revealing regional subject difficulties and curriculum bottleneck topics.'
  },
  {
    id: 88,
    title: 'Crowdfunded Content Sponsorship',
    swahiliTitle: 'Ufadhili wa Wananchi wa Maudhui ya Shule za Vijijini',
    category: 'monetization',
    icon: 'fa-hand-holding-heart',
    status: 'Planned Roadmap',
    targetAudience: 'Parents',
    summary: 'Allows well-wishers and diaspora members to fund digitization of materials for specific rural schools.',
    details: 'Direct community crowdfunding for digitizing study content for needy secondary schools.'
  },
  {
    id: 89,
    title: 'EdTech API Licensing',
    swahiliTitle: 'Utoaji wa Leseni ya API ya Zana za Elimu',
    category: 'monetization',
    icon: 'fa-key',
    status: 'Planned Roadmap',
    targetAudience: 'Developers',
    summary: 'Licensing custom interactive tools (Division Calculators, NECTA databases) to news and education portals.',
    details: 'API endpoints providing NECTA grading logic and syllabus data to third-party platforms.'
  },
  {
    id: 90,
    title: 'In-App Digital Marketplace for Teachers',
    swahiliTitle: 'Soko la Dijitali la Walimu Kuuza Nukuu Zao',
    category: 'monetization',
    icon: 'fa-store',
    status: 'Planned Roadmap',
    targetAudience: 'Teachers',
    summary: 'Peer-to-peer store where top teachers sell revision guides, worksheets, or custom test banks.',
    details: 'Empowers Tanzanian educators to monetize specialized study notes and exam preparation packs.'
  },

  // SECTION VII: ADMIN & QUALITY CONTROL (91-100)
  {
    id: 91,
    title: 'TIE Syllabus Compliance Audit Engine',
    swahiliTitle: 'Injini ya Uhakiki wa Ulinganifu wa Msumeno wa TIE',
    category: 'admin',
    icon: 'fa-clipboard-check',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Internal review process ensuring every note and question links to specific TIE syllabus codes.',
    details: 'Maps lesson notes and test items directly to TIE learning objectives and competence statements.'
  },
  {
    id: 92,
    title: 'Error-Reporting Feedback Loop',
    swahiliTitle: 'Kitufe cha Kuripoti Makosa Kwenye Kurasa',
    category: 'admin',
    icon: 'fa-flag',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Simple "Report an Error" flag on every page allowing rapid correction of typos or broken links.',
    details: 'Enables users to notify editorial admins of any content inaccuracies or diagram errors.'
  },
  {
    id: 93,
    title: 'Real-Time Search Analytics Monitoring',
    swahiliTitle: 'Ufuatiliaji wa Utafutaji wa Masomo kwa Wakati Huo',
    category: 'admin',
    icon: 'fa-magnifying-glass-chart',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Dashboard tracking keywords and past papers students search for, revealing high-demand gaps.',
    details: 'Identifies trending study topics ahead of national exam periods.'
  },
  {
    id: 94,
    title: 'Content Freshness Timestamp System',
    swahiliTitle: 'Alama ya Tarehe ya Mapitio ya Maudhui',
    category: 'admin',
    icon: 'fa-calendar-check',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Clear indicators on study material showing exact date last reviewed against curriculum standards.',
    details: 'Guarantees students are studying notes aligned with current NECTA syllabus guidelines.'
  },
  {
    id: 95,
    title: 'User Role Management System',
    swahiliTitle: 'Mfumo wa Usimamizi wa Aina za Watumiaji',
    category: 'admin',
    icon: 'fa-users-gear',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Distinct portals customized for Student, Teacher, Parent, and Admin roles.',
    details: 'Tailors dashboard layouts, permissions, and tools according to authenticated user persona.'
  },
  {
    id: 96,
    title: 'Copyright & IP Enforcement Framework',
    swahiliTitle: 'Mfumo wa Ulinzi wa Haki Miliki (Copyright)',
    category: 'admin',
    icon: 'fa-shield',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Strict policies and automated filters ensuring uploaded resources adhere to copyright laws.',
    details: 'Protects proprietary educational content and ensures open-source licensing compliance.'
  },
  {
    id: 97,
    title: 'Automated Broken Link Checker',
    swahiliTitle: 'Kikagua cha Kiotomatiki cha Viungo Vilivyovunjika',
    category: 'admin',
    icon: 'fa-link-slash',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Background system monitoring external PDF links and media files to ensure zero dead links.',
    details: 'Scans platform endpoints continuously to prevent broken file downloads.'
  },
  {
    id: 98,
    title: 'A/B Testing Infrastructure',
    swahiliTitle: 'Mfumo wa Majaribio ya A/B ya Muundo wa Masomo',
    category: 'admin',
    icon: 'fa-vial-circle-check',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Framework testing different lesson formats (bulleted vs. tables vs. audio) for higher pass rates.',
    details: 'Measures student quiz completion rates across different visual layouts.'
  },
  {
    id: 99,
    title: 'Accessibility Standard Implementation (WCAG)',
    swahiliTitle: 'Uzingatiaji wa Viwango vya Upatikanaji (WCAG)',
    category: 'admin',
    icon: 'fa-universal-access',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Compliance with web accessibility standards ensuring screen-reader compatibility and high contrast.',
    details: 'Passes WCAG AA color contrast guidelines and aria-label accessibility checks.'
  },
  {
    id: 100,
    title: 'Comprehensive Disaster Recovery & Backup Plan',
    swahiliTitle: 'Mpango Kabambe wa Hifadhi Mbadala (Backups)',
    category: 'admin',
    icon: 'fa-server',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Automated daily off-site backups of user accounts, database entries, and PDF archives.',
    details: 'Firestore automated backups preventing data loss during system failures.'
  },

  // SECTION VIII: TANZANIA EXAM & RESULT TECH (101-110)
  {
    id: 101,
    title: 'SMS & USSD NECTA Results Notification Gateway',
    swahiliTitle: 'Njia ya Taarifa za Matokeo ya NECTA kwa SMS/USSD',
    category: 'examtech',
    icon: 'fa-envelope-open-text',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Register index numbers to receive instant SMS alerts the second NECTA results publish.',
    details: 'Automated gateway delivering PSLE, FTNA, CSEE, and ACSEE candidate scores instantly via SMS.'
  },
  {
    id: 102,
    title: 'Historical School Performance Benchmarking Tool',
    swahiliTitle: 'Kifaa cha Kulinganisha Ufaulu wa Shule kwa Miaka 10',
    category: 'examtech',
    icon: 'fa-chart-line',
    status: 'Live & Active',
    targetAudience: 'Parents',
    summary: 'Interactive dashboard showing 10-year NECTA performance trends filtered by region or public/private.',
    details: 'Displays Division distributions, GPA trends, and national rankings for secondary schools in Tanzania.'
  },
  {
    id: 103,
    title: 'Private Candidate (QT / Qualifying Test) Resource Pack',
    swahiliTitle: 'Kifurushi cha Mtihani wa Mchujo (QT - Qualifying Test)',
    category: 'examtech',
    icon: 'fa-user-pen',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Dedicated section for adult learners preparing for Qualifying Test (QT) to sit for CSEE.',
    details: 'Tailored study materials covering QT syllabus requirements for non-formal private candidates.'
  },
  {
    id: 104,
    title: 'PReM & PReMS Registration Guidance Portal',
    swahiliTitle: 'Mwongozo wa Mfumo wa Usajili wa Wanafunzi PReM/PReMS',
    category: 'examtech',
    icon: 'fa-id-card',
    status: 'Live & Active',
    targetAudience: 'Teachers',
    summary: 'Step-by-step helpdesk explaining student registration in government PReM/PReMS systems.',
    details: 'Helps school headmasters and academic masters resolve candidate registration issues.'
  },
  {
    id: 105,
    title: 'National Exam Appeals & Remarks Advice Guide',
    swahiliTitle: 'Mwongozo wa Rufaa na Kurudia Sahihisho NECTA',
    category: 'examtech',
    icon: 'fa-gavel',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Official information and templates on requesting NECTA answer script re-checks or remarking.',
    details: 'Outlines timelines, fees, and procedures for submitting official NECTA result appeals.'
  },
  {
    id: 106,
    title: 'Zanzibar Examinations Council (ZEC) Dedicated Module',
    swahiliTitle: 'Kipengele Maalumu cha Mitihani ya Baraza la Zanzibar (ZEC)',
    category: 'examtech',
    icon: 'fa-umbrella-beach',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Special resources tailored to students in Zanzibar sitting for ZEC-administered exams.',
    details: 'Covers primary and lower-secondary exam papers administered specifically by ZEC Zanzibar.'
  },
  {
    id: 107,
    title: 'Resit Candidate Subject Strategy',
    swahiliTitle: 'Mbinu ya Kurudia Somo (Resit Candidates)',
    category: 'examtech',
    icon: 'fa-arrow-rotate-right',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Custom study pathways for candidates retaking specific CSEE subjects to raise grades.',
    details: 'Focuses on high-yield topic mastery to boost grades for diploma or certificate admission requirements.'
  },
  {
    id: 108,
    title: 'NECTA Index Number Analyzer',
    swahiliTitle: 'Mchanganuzi wa Namba ya Mtihani ya NECTA',
    category: 'examtech',
    icon: 'fa-barcode',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Tool breaking down center codes, candidate numbers, and registration types.',
    details: 'Decodes S-series (school), P-series (private), and center region locations from NECTA index formats.'
  },
  {
    id: 109,
    title: 'Regional Mock Exam Archives (Tamisemi & Zone Mocks)',
    swahiliTitle: 'Hifadhi ya Mitihani ya Mock ya Kanda (TAMISEMI & Zones)',
    category: 'examtech',
    icon: 'fa-folder-tree',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Curated repository sorting mock exams by zones (Lake Zone, Northern Zone, Southern Highlands).',
    details: 'Regional mock papers famous for predicting national NECTA question patterns.'
  },
  {
    id: 110,
    title: 'Examiner Script Handwriting & Formatting Tips',
    swahiliTitle: 'Vidokezo vya Uandishi na Mpangilio wa Majibu ya Mitihani',
    category: 'examtech',
    icon: 'fa-signature',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Advice detailing how candidates should structure answer sheets and format section dividers.',
    details: 'Helps students format answer booklets clearly to avoid losing marks during manual NECTA marking.'
  },

  // SECTION IX: SWAHILI & LOCALIZATION (111-120)
  {
    id: 111,
    title: 'Kiswahili Sanifu Grammar & Literature Engine',
    swahiliTitle: 'Injini ya Sarufi na Fasihi ya Kiswahili Sanifu',
    category: 'swahili',
    icon: 'fa-pen-fancy',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Specialized tools dissecting Fasihi ya Kiswahili with analysis of setbooks (Takadini, Lina Boffin).',
    details: 'Character charts, poetic devices (Ushairi), themes, and essay guidelines for NECTA Kiswahili exams.'
  },
  {
    id: 112,
    title: 'Text-to-Speech Swahili Voice Reader',
    swahiliTitle: 'Kusoma Nukuu kwa Sauti ya Kiswahili (Text-to-Speech)',
    category: 'swahili',
    icon: 'fa-volume-high',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Web-based audio synthesizer reading out notes in natural Kiswahili accents.',
    details: 'Supports visually impaired or auditory learners by synthesizing spoken Kiswahili study notes.'
  },
  {
    id: 113,
    title: 'Swahili Scientific Terminology Translator',
    swahiliTitle: 'Mtafsiri wa Istilahi za Sayansi kwa Kiswahili',
    category: 'swahili',
    icon: 'fa-language',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Translates complex scientific words into standard TIE-approved Kiswahili (Photosynthesis -> Mwelisho Mwangaza).',
    details: 'Instant lookup for official Kiswahili scientific terms used in TIE curriculum books.'
  },
  {
    id: 114,
    title: 'Bilingual Flashcard Deck Builder',
    swahiliTitle: 'Mjenzi wa Kadi za Flashcards za Lugha Mbili',
    category: 'swahili',
    icon: 'fa-clone',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Digital flashcards flipping between English concepts and Kiswahili explanations.',
    details: 'Interactive study cards for rapid revision across sciences, humanities, and languages.'
  },
  {
    id: 115,
    title: 'Local Dialect vs. Kiswahili Sanifu Clarifiers',
    swahiliTitle: 'Ufafanuzi wa Kiswahili Sanifu kwa Wanafunzi wa Vijijini',
    category: 'swahili',
    icon: 'fa-comments',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Language guides helping primary pupils transition smoothly to standard Kiswahili Sanifu.',
    details: 'Clarifies grammatical nuances and regional dialect variations for classroom proficiency.'
  },
  {
    id: 116,
    title: 'Voice-Recorded Swahili Micro-Lessons',
    swahiliTitle: 'Masomo Fupi ya Sauti ya Kiswahili (WhatsApp Audio)',
    category: 'swahili',
    icon: 'fa-file-audio',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: '60-second audio files explaining single concepts in Swahili, optimized for WhatsApp sharing.',
    details: 'Micro-lectures ideal for quick listening on low-data cellular connections.'
  },
  {
    id: 117,
    title: 'Swahili Literature Essay Model Bank',
    swahiliTitle: 'Benki ya Insha za Mfano za Fasihi ya Kiswahili',
    category: 'swahili',
    icon: 'fa-book-open-reader',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Model essays written in eloquent Kiswahili Sanifu demonstrating top-scoring structures.',
    details: 'Sample answers for Form 3–6 Kiswahili literature essay prompts.'
  },
  {
    id: 118,
    title: 'Swahili Tech Dictionary',
    swahiliTitle: 'Kamusi ya Teknolojia na Kompyuta kwa Kiswahili',
    category: 'swahili',
    icon: 'fa-laptop-file',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Online glossary translating modern computer, internet, and AI vocabulary into Swahili.',
    details: 'Terminologies for Computer Studies students covering hardware, software, and networking.'
  },
  {
    id: 119,
    title: 'Audiobook Player for Prescribed Literature',
    swahiliTitle: 'Kicheza Sauti cha Vitabu vya Riwaya na Tamthilia',
    category: 'swahili',
    icon: 'fa-circle-play',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Audio recordings of Tanzanian plays and novels, enabling students to listen on commutes.',
    details: 'Audiobook narration for prescribed literature setbooks.'
  },
  {
    id: 120,
    title: 'Swahili Grammar Auto-Checker for Essays',
    swahiliTitle: 'Kikagua cha Kiotomatiki cha Sarufi ya Kiswahili',
    category: 'swahili',
    icon: 'fa-spell-check',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Web tool highlighting common grammatical errors in written Kiswahili compositions.',
    details: 'Automated syntax feedback pointing out common Swahili grammar slips.'
  },

  // SECTION X: HARDWARE COMPATIBILITY (121-130)
  {
    id: 121,
    title: 'KaiOS App Store Version',
    swahiliTitle: 'Toleo la Simu za KaiOS (Smart Feature Phones)',
    category: 'hardware',
    icon: 'fa-mobile-retro',
    status: 'Planned Roadmap',
    targetAudience: 'Students',
    summary: 'Engineered to run natively on low-cost smart feature phones popular in rural areas.',
    details: 'Optimized KaiOS web app layout for button-navigation smartphones.'
  },
  {
    id: 122,
    title: 'Zero-Rating Partnership Infrastructure',
    swahiliTitle: 'Mfumo wa Matumizi Bila Bando (Zero-Rated Data)',
    category: 'hardware',
    icon: 'fa-tower-cell',
    status: 'In Development',
    targetAudience: 'Developers',
    summary: 'Architecture built to integrate with telecoms (Vodacom, Tigo, Airtel) for zero-rated access.',
    details: 'Preconfigured header routing for carrier zero-rating sponsorship programs.'
  },
  {
    id: 123,
    title: 'Compressed SVG Diagram Library',
    swahiliTitle: 'Maktaba ya Michoro ya SVG Isiyotumia Bando Kubwa',
    category: 'hardware',
    icon: 'fa-bezier-curve',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Vector diagrams used instead of heavy PNGs, loading instantly on 2G and scaling crisp.',
    details: 'Ultra-lightweight vector schematics for science diagrams and math graphs.'
  },
  {
    id: 124,
    title: 'Bluetooth & Wi-Fi Direct Local File Transfer Hub',
    swahiliTitle: 'Kutuma Nukuu kwa Bluetooth/Wi-Fi Bila Mtandao',
    category: 'hardware',
    icon: 'fa-share-nodes',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Allows students in the same classroom to share downloaded PDF notes phone-to-phone.',
    details: 'Peer-to-peer file sharing without consuming cellular network data.'
  },
  {
    id: 125,
    title: 'Battery-Saving OLED Black Mode',
    swahiliTitle: 'Muundo wa Gizani Kabisa Kuokoa Umeme wa Simu',
    category: 'hardware',
    icon: 'fa-battery-full',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Pitch-black display mode maximizing battery life on budget smartphones during power cuts.',
    details: 'True OLED #000000 background canvas reducing display power consumption.'
  },
  {
    id: 126,
    title: 'Web Push Notifications for Offline Users',
    swahiliTitle: 'Arafa za Papo kwa Papo Unapounganisha Mtandao',
    category: 'hardware',
    icon: 'fa-bell',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Notifications queued to pop up when user briefly reconnects to a network.',
    details: 'Alerts students to newly released mock papers or NECTA exam dates.'
  },
  {
    id: 127,
    title: 'RAM-Light PWA Optimization',
    swahiliTitle: 'Upangaji Mwepesi kwa Simu Zenye RAM Ndogo (1GB)',
    category: 'hardware',
    icon: 'fa-microchip',
    status: 'Live & Active',
    targetAudience: 'Developers',
    summary: 'Code stripped of heavy frameworks running smoothly on devices with 1 GB or less RAM.',
    details: 'Low memory footprint ensuring smooth performance on entry-level Android devices.'
  },
  {
    id: 128,
    title: 'Printable Summary Worksheets (One-Page Cheat Sheets)',
    swahiliTitle: 'Nukuu za Ukurasa Mmoja wa Kujikumbusha (Cheat Sheets)',
    category: 'hardware',
    icon: 'fa-file-lines',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Concise single-page topic summaries designed to be printed cheaply at cyber cafés.',
    details: 'High-density one-page topic recap sheets for fast paper printing.'
  },
  {
    id: 129,
    title: 'Low-Resolution Video Stream Selector',
    swahiliTitle: 'Chaguo la Video za Ubora wa Chini (140p/240p)',
    category: 'hardware',
    icon: 'fa-sliders',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Video player options allowing 140p or 240p resolutions for ultra-low data consumption.',
    details: 'Minimizes streaming bandwidth requirements for video lecture playback.'
  },
  {
    id: 130,
    title: 'Text-Only Email Study Digests',
    swahiliTitle: 'Jarida la Masomo la Barua Pepe za Maandishi Pekee',
    category: 'hardware',
    icon: 'fa-envelope',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Subscription service emailing full-text lessons directly to students inboxes.',
    details: 'Delivers complete study recaps directly via email readable on low-data clients.'
  },

  // SECTION XI: AI & PERSONALIZATION (131-140)
  {
    id: 131,
    title: 'TIE-Trained AI Revision Assistant (Yun AI)',
    swahiliTitle: 'Msaidizi wa AI Yun Aliyefundishwa Vitabu vya TIE',
    category: 'ai',
    icon: 'fa-robot',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Customized AI chat widget trained strictly on TIE textbooks and NECTA guidelines.',
    details: 'Generates syllabus-compliant answers without hallucinating out-of-scope material.'
  },
  {
    id: 132,
    title: 'AI Homework Photo Solver & Explainer',
    swahiliTitle: 'Mtatuzi wa Picha za Kazi za Nyumbani kwa AI',
    category: 'ai',
    icon: 'fa-camera-retro',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Snap a photo of a math problem or science diagram to receive a step-by-step breakdown.',
    details: 'Gemini multimodal analysis breaking down handwritten physics or math problems.'
  },
  {
    id: 133,
    title: 'Adaptive Diagnostic Testing',
    swahiliTitle: 'Majaribio ya Kijanja Yanayobadilika kulingana na Ufaulu',
    category: 'ai',
    icon: 'fa-brain-circuit',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Quiz system that gets harder or easier based on answers to pinpoint knowledge gaps.',
    details: 'Dynamically adapts question difficulty to measure student mastery level accurately.'
  },
  {
    id: 134,
    title: 'Personalized Study Planner AI',
    swahiliTitle: 'Mpanga Ratiba wa Kujisomea wa AI',
    category: 'ai',
    icon: 'fa-calendar-days',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Calculates days left until NECTA exams and builds customized daily study timetables.',
    details: 'Auto-allocates study hours based on student weak subjects and exam countdowns.'
  },
  {
    id: 135,
    title: 'Automated Essay Scorer & Feedback Engine',
    swahiliTitle: 'Kisahihisha Insha cha Kiotomatiki na Miongozo',
    category: 'ai',
    icon: 'fa-file-pen',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Paste practice General Studies or English essays to receive automated grading feedback.',
    details: 'Evaluates essay thesis strength, paragraph structure, grammar, and NECTA alignment.'
  },
  {
    id: 136,
    title: 'AI Voice-Based Oral Language Practice',
    swahiliTitle: 'Mazoezi ya Kuongea Lugha kwa Sauti ya AI',
    category: 'ai',
    icon: 'fa-microphone-lines',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Interactive tool helping students practice spoken English, French, Arabic, or Chinese.',
    details: 'Voice conversation practice for language oral exams with phonetic feedback.'
  },
  {
    id: 137,
    title: 'Smart Flashcard Spaced Repetition System (SRS)',
    swahiliTitle: 'Mfumo wa Kadi za Kujikumbusha kwa Muda Maalumu',
    category: 'ai',
    icon: 'fa-layer-group',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Algorithm resurfacing hard concepts right before a student is about to forget them.',
    details: 'Anki-style spaced repetition schedule boosting long-term memory retention.'
  },
  {
    id: 138,
    title: 'AI Summary Generator for Long Setbooks',
    swahiliTitle: 'Muhtasari wa Vitabu Refu vya Riwaya kwa AI',
    category: 'ai',
    icon: 'fa-wand-magic-sparkles',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Generates chapter summaries, character maps, and quote lists for prescribed literature.',
    details: 'Instant chapter breakdowns and thematic analysis for secondary literature novels.'
  },
  {
    id: 139,
    title: 'Plagiarism & AI Checker for Teachers',
    swahiliTitle: 'Kikagua Kopi na Usahihi wa Kazi kwa Walimu',
    category: 'ai',
    icon: 'fa-shield-cat',
    status: 'In Development',
    targetAudience: 'Teachers',
    summary: 'Enables teachers to verify whether student homework was copied or generated by AI.',
    details: 'Administrative verification tool ensuring student originality in homework essays.'
  },
  {
    id: 140,
    title: 'AI Graphic Converter for Visual Learners',
    swahiliTitle: 'Kubadili Maandishi Kuwa Michoro ya Mtiririko',
    category: 'ai',
    icon: 'fa-diagram-successor',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Transforms long text paragraphs into structured flowcharts, tables, or mind maps automatically.',
    details: 'Converts complex text notes into visual study diagrams for faster comprehension.'
  },

  // SECTION XII: ECOSYSTEM & PARENTS (141-150)
  {
    id: 141,
    title: 'Parental SMS/WhatsApp Weekly Digest',
    swahiliTitle: 'Ripoti ya Kila Wiki ya Wazazi kwa SMS na WhatsApp',
    category: 'ecosystem',
    icon: 'fa-paper-plane',
    status: 'Live & Active',
    targetAudience: 'Parents',
    summary: 'Automatic updates sent to parents showing child quiz completion rates and attendance.',
    details: 'Weekly digest summarizing EP earned, practice test scores, and subjects studied.'
  },
  {
    id: 142,
    title: 'Inter-School Academic Tournaments',
    swahiliTitle: 'Mashindano ya Masomo Baina ya Shule Mbalimbali',
    category: 'ecosystem',
    icon: 'fa-trophy',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Monthly online quiz leagues where secondary schools compete for regional rankings.',
    details: 'Inter-school leaderboard tournaments fostering healthy academic rivalry across regions.'
  },
  {
    id: 143,
    title: 'Teacher Content Marketplace',
    swahiliTitle: 'Soko la Walimu Kushirikishana na Kuuza Zana za Masomo',
    category: 'ecosystem',
    icon: 'fa-store',
    status: 'Planned Roadmap',
    targetAudience: 'Teachers',
    summary: 'Peer-to-peer portal where experienced Tanzanian teachers share or sell revision slides.',
    details: 'Platform for top educators to share lesson plans and mock test banks.'
  },
  {
    id: 144,
    title: 'School Alumni Sponsorship Portal',
    swahiliTitle: 'Portal ya Wanafunzi wa Zamani (Alumni) Kufadhili Shule',
    category: 'ecosystem',
    icon: 'fa-hand-holding-dollar',
    status: 'Planned Roadmap',
    targetAudience: 'Parents',
    summary: 'System where university scholars or alumni buy digital study passes for former schools.',
    details: 'Enables alumni networks to sponsor platform subscriptions for their alma mater.'
  },
  {
    id: 145,
    title: 'Headmaster / Academic Master Analytics Dashboard',
    swahiliTitle: 'Ubao wa Takwimu wa Mkuu wa Shule na Mwalimu Mkuu wa Taaluma',
    category: 'ecosystem',
    icon: 'fa-chart-line',
    status: 'In Development',
    targetAudience: 'Schools',
    summary: 'Institutional dashboard giving school leadership visibility into class performance.',
    details: 'Monitors class-wide quiz averages, syllabus coverage metrics, and student activity logs.'
  },
  {
    id: 146,
    title: 'Student Mental Health & Exam Stress Hotline Links',
    swahiliTitle: 'Mawasiliano ya Msaada wa Afya ya Akili na Msongo wa Mawazo',
    category: 'ecosystem',
    icon: 'fa-phone-volume',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Directory providing contact numbers for youth counselors during high-stress exam seasons.',
    details: 'Direct links to certified local youth support helplines during national exams.'
  },
  {
    id: 147,
    title: 'Local NGO & CSR Impact Metrics Portal',
    swahiliTitle: 'Takwimu za Ufaulu na Athari kwa Mashirika Yasiyo ya Kiserekali',
    category: 'ecosystem',
    icon: 'fa-building-ngo',
    status: 'Planned Roadmap',
    targetAudience: 'Developers',
    summary: 'Portal showcasing engagement data to educational NGOs to prove social impact.',
    details: 'Provides impact metrics on rural student reach and learning outcomes for NGO donors.'
  },
  {
    id: 148,
    title: 'Student-Led Study Vlog & Podcast Showcase',
    swahiliTitle: 'Onyesho la Video na Podcast za Kujisomea za Wanafunzi',
    category: 'ecosystem',
    icon: 'fa-podcast',
    status: 'In Development',
    targetAudience: 'Students',
    summary: 'Top-performing students submit short video tips or audio notes to inspire peers.',
    details: 'Community showcase of peer study tips and effective revision routines.'
  },
  {
    id: 149,
    title: 'National Educational News Feed',
    swahiliTitle: 'Habari za Elimu ya Tanzania (MoEST, NECTA, TCU)',
    category: 'ecosystem',
    icon: 'fa-newspaper',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Aggregated news section covering Ministry of Education announcements, exam dates, and placement updates.',
    details: 'Timely updates on MoEST policy changes, NECTA release schedules, and university admission guidelines.'
  },
  {
    id: 150,
    title: 'Digital Graduation & Skill Certificates',
    swahiliTitle: 'Vyeti vya Dijitali vya Umahiri wa Masomo na Ujuzi',
    category: 'ecosystem',
    icon: 'fa-certificate',
    status: 'Live & Active',
    targetAudience: 'Students',
    summary: 'Verifiable digital certificates issued upon completing online modules (Computer Basics, Financial Literacy).',
    details: 'Shareable digital credentials for social media, resume profiles, or university applications.'
  }
];

export const StrategicRoadmap: React.FC<{
  onBackHome?: () => void;
  onLaunchFeature?: (point: RoadmapPoint) => void;
}> = ({ onBackHome, onLaunchFeature }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('tz_roadmap_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeItemModal, setActiveItemModal] = useState<RoadmapPoint | null>(null);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('tz_roadmap_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const filteredPoints = useMemo(() => {
    return ALL_150_ROADMAP_POINTS.filter(pt => {
      const matchesCategory = selectedCategory === 'all' || pt.category === selectedCategory;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'live' && pt.status === 'Live & Active') ||
        (statusFilter === 'dev' && pt.status === 'In Development') ||
        (statusFilter === 'planned' && pt.status === 'Planned Roadmap') ||
        (statusFilter === 'fav' && favorites.includes(pt.id));

      const queryLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !queryLower ||
        pt.id.toString().includes(queryLower) ||
        pt.title.toLowerCase().includes(queryLower) ||
        (pt.swahiliTitle && pt.swahiliTitle.toLowerCase().includes(queryLower)) ||
        pt.summary.toLowerCase().includes(queryLower) ||
        pt.details.toLowerCase().includes(queryLower);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [selectedCategory, statusFilter, searchQuery, favorites]);

  const liveCount = ALL_150_ROADMAP_POINTS.filter(p => p.status === 'Live & Active').length;
  const devCount = ALL_150_ROADMAP_POINTS.filter(p => p.status === 'In Development').length;
  const plannedCount = ALL_150_ROADMAP_POINTS.filter(p => p.status === 'Planned Roadmap').length;

  const downloadFullRoadmapTxt = () => {
    const textLines = [
      '=========================================================================',
      'TANZANIA EDUCATIONAL PLATFORM - 150 STRATEGIC ROADMAP & INNOVATION POINTS',
      '=========================================================================\n',
      `Total Strategy Points: 150`,
      `Live & Active Features: ${liveCount}`,
      `In Development: ${devCount}`,
      `Planned Roadmap: ${plannedCount}`,
      `Generated On: ${new Date().toLocaleString()}\n`,
      '-------------------------------------------------------------------------',
      'COMPLETE 150 POINTS LIST:',
      '-------------------------------------------------------------------------\n'
    ];

    ALL_150_ROADMAP_POINTS.forEach(pt => {
      textLines.push(
        `#${pt.id}. ${pt.title.toUpperCase()} [${pt.status}]`,
        `   Kiswahili: ${pt.swahiliTitle || 'N/A'}`,
        `   Target: ${pt.targetAudience} | Category: ${pt.category.toUpperCase()}`,
        `   Summary: ${pt.summary}`,
        `   Details: ${pt.details}\n`
      );
    });

    textLines.push(
      '=========================================================================',
      'Tanzania Educational Platform - Elimu Bora kwa Wote',
      '========================================================================='
    );

    const blob = new Blob([textLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tanzania_EdTech_150_Strategic_Roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in text-left">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-indigo-500/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {onBackHome && (
              <button
                onClick={onBackHome}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-white transition bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 mb-2 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Home
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
              <i className="fa-solid fa-rocket"></i> Master Strategic Blueprint
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              150 Strategic Roadmap & Innovation Points
            </h1>
            <p className="text-sm text-indigo-200 font-medium leading-relaxed">
              Comprehensive 150-point master roadmap powering Tanzania's digital educational revolution — covering NECTA exam tools, STEM labs, teacher utilities, low-data offline technology, Swahili localization, AI personalization, and parental dashboards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={downloadFullRoadmapTxt}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-file-arrow-down text-sm"></i>
              <span>Download 150 Points (.txt)</span>
            </button>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xl font-black text-emerald-400">{liveCount}</div>
                <div className="text-[9px] font-extrabold uppercase text-slate-300">Live & Active</div>
              </div>
              <div>
                <div className="text-xl font-black text-amber-300">{devCount}</div>
                <div className="text-[9px] font-extrabold uppercase text-slate-300">In Dev</div>
              </div>
              <div>
                <div className="text-xl font-black text-cyan-300">{plannedCount}</div>
                <div className="text-[9px] font-extrabold uppercase text-slate-300">Planned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 150 points (e.g., 'Division', 'Laboratories', 'Kiswahili', 'HESLB', 'WhatsApp')..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-gray-200 focus:border-tz-blue focus:bg-white text-xs sm:text-sm font-semibold text-slate-900 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'live'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live ({liveCount})
            </button>
            <button
              onClick={() => setStatusFilter('dev')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'dev'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              In Dev ({devCount})
            </button>
            <button
              onClick={() => setStatusFilter('planned')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'planned'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Planned ({plannedCount})
            </button>
            <button
              onClick={() => setStatusFilter('fav')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'fav'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <i className="fa-solid fa-heart text-xs"></i>
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-gray-100">
          {ROADMAP_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-tz-blue text-white shadow-md shadow-blue-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
        <span>
          Showing <strong className="text-slate-900 font-extrabold">{filteredPoints.length}</strong> of 150 points
        </span>
        {searchQuery && (
          <span className="text-tz-blue">
            Filter: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Grid of 150 Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPoints.map((point) => {
          const isFav = favorites.includes(point.id);
          let statusBadgeClass = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
          if (point.status === 'In Development') {
            statusBadgeClass = 'bg-amber-500/10 text-amber-800 border-amber-500/30';
          } else if (point.status === 'Planned Roadmap') {
            statusBadgeClass = 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30';
          }

          return (
            <div
              key={point.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-tz-blue shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                {/* Card Header Tag Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                      #{point.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBadgeClass}`}>
                      {point.status === 'Live & Active' && <i className="fa-solid fa-circle-check mr-1 text-emerald-600"></i>}
                      {point.status === 'In Development' && <i className="fa-solid fa-clock mr-1 text-amber-600"></i>}
                      {point.status === 'Planned Roadmap' && <i className="fa-solid fa-compass mr-1 text-indigo-600"></i>}
                      {point.status}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavorite(point.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isFav ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'
                    }`}
                    title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <i className={`fa-solid fa-heart text-xs ${isFav ? 'scale-110' : ''}`}></i>
                  </button>
                </div>

                {/* Title & Swahili Title */}
                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-tz-blue transition-colors leading-snug">
                    {point.title}
                  </h3>
                  {point.swahiliTitle && (
                    <p className="text-xs font-bold text-amber-700 mt-1 flex items-center gap-1.5">
                      <i className="fa-solid fa-language text-[11px]"></i>
                      <span>{point.swahiliTitle}</span>
                    </p>
                  )}
                </div>

                {/* Summary */}
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {point.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[10px] flex items-center gap-1 shrink-0">
                  <i className="fa-solid fa-user text-[9px] text-gray-400"></i> {point.targetAudience}
                </span>

                <div className="flex items-center gap-2">
                  {onLaunchFeature && (
                    <button
                      onClick={() => onLaunchFeature(point)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1 transition cursor-pointer shadow-sm"
                      title="Launch this feature inside the website"
                    >
                      <i className="fa-solid fa-bolt text-[10px]"></i>
                      <span>Launch Tool</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveItemModal(point)}
                    className="text-xs font-black text-tz-blue hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPoints.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 className="text-lg font-black text-slate-900">No strategy points matched</h3>
          <p className="text-xs text-gray-500 font-medium">Try clearing your search query or changing category filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-tz-blue text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Point Detail Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-400 font-black text-base flex items-center justify-center shrink-0">
                #{activeItemModal.id}
              </span>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                  {activeItemModal.status}
                </span>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">Target: {activeItemModal.targetAudience}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 leading-tight">{activeItemModal.title}</h2>
              {activeItemModal.swahiliTitle && (
                <p className="text-xs font-black text-amber-700 flex items-center gap-1.5">
                  <i className="fa-solid fa-language"></i> {activeItemModal.swahiliTitle}
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-1">
              <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider">Strategic Overview</h4>
              <p className="text-xs text-indigo-900 font-medium leading-relaxed">{activeItemModal.summary}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-layer-group text-tz-blue"></i> Implementation Scope & Technical Details
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                {activeItemModal.details}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => {
                  toggleFavorite(activeItemModal.id);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  favorites.includes(activeItemModal.id)
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <i className="fa-solid fa-heart"></i>
                <span>{favorites.includes(activeItemModal.id) ? 'Saved' : 'Save'}</span>
              </button>

              {onLaunchFeature && (
                <button
                  onClick={() => {
                    const itemToLaunch = activeItemModal;
                    setActiveItemModal(null);
                    onLaunchFeature(itemToLaunch);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-amber-400/20 flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-bolt"></i>
                  <span>Launch Feature in App</span>
                </button>
              )}

              <button
                onClick={() => setActiveItemModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategicRoadmap;
