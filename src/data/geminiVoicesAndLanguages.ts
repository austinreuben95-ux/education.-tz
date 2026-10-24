export interface GeminiVoice {
  id: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  name: string;
  displayName: string;
  persona: string;
  genderTone: string;
  description: string;
  samplePhrase: string;
  icon: string;
  gradient: string;
  badge: string;
}

export interface SupportedLanguage {
  code: 'sw' | 'en' | 'fr' | 'ar' | 'zh' | 'de' | 'es';
  bcp47: string;
  name: string;
  localName: string;
  flag: string;
  sampleGreeting: string;
  promptSuggestions: string[];
  systemPromptDirective: string;
}

export const GEMINI_PREBUILT_VOICES: GeminiVoice[] = [
  {
    id: 'Kore',
    name: 'Kore',
    displayName: 'Gemini Kore (Signature)',
    persona: 'The signature Gemini neural voice. Natural, soothing, articulate, and crystal clear.',
    genderTone: 'Warm & Natural',
    description: 'Perfect for patient study sessions, conceptual breakdowns, and daily learning.',
    samplePhrase: 'Jambo! I am Gemini, your study companion for the Tanzanian curriculum.',
    icon: 'fa-solid fa-sparkles',
    gradient: 'from-blue-500 via-indigo-500 to-cyan-400',
    badge: 'Signature Default'
  },
  {
    id: 'Puck',
    name: 'Puck',
    displayName: 'Gemini Puck (Energetic)',
    persona: 'Vibrant, upbeat, and highly engaging, like an encouraging peer study partner.',
    genderTone: 'Youthful & Dynamic',
    description: 'Brings high energy to study sessions, perfect for quiz prep and quick motivation.',
    samplePhrase: "Hey there! Ready to master today's NECTA exam questions? Let's dive in!",
    icon: 'fa-solid fa-bolt',
    gradient: 'from-amber-500 via-orange-500 to-yellow-400',
    badge: 'High Energy'
  },
  {
    id: 'Charon',
    name: 'Charon',
    displayName: 'Gemini Charon (Academic)',
    persona: 'Calm, authoritative, and deep, like a senior university lecturer or NECTA examiner.',
    genderTone: 'Deep & Authoritative',
    description: 'Ideal for detailed scientific proofs, historical analysis, and exam strategy.',
    samplePhrase: 'Greetings. Let us examine the step-by-step principles of this academic topic.',
    icon: 'fa-solid fa-graduation-cap',
    gradient: 'from-slate-700 via-indigo-900 to-blue-900',
    badge: 'Examiner Tone'
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    displayName: 'Gemini Fenrir (Focused)',
    persona: 'Crisp, direct, and structured with sharp precision for math and formula steps.',
    genderTone: 'Crisp & Confident',
    description: 'Concise and methodical, great for solving math, chemistry, and physics problems.',
    samplePhrase: 'Understood. Here is the direct, step-by-step calculation to solve this problem.',
    icon: 'fa-solid fa-bullseye',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    badge: 'Precision STEM'
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    displayName: 'Gemini Zephyr (Gentle)',
    persona: 'Gentle, soft-spoken, and infinitely patient, designed to reduce exam anxiety.',
    genderTone: 'Gentle & Patient',
    description: 'Warm and reassuring, wonderful for younger learners and difficult topics.',
    samplePhrase: 'Take your time. We will walk through this topic gently, step by step together.',
    icon: 'fa-solid fa-feather',
    gradient: 'from-purple-500 via-pink-500 to-rose-400',
    badge: 'Patient Companion'
  }
];

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'sw',
    bcp47: 'sw-TZ',
    name: 'Kiswahili',
    localName: 'Kiswahili Sanifu (Tanzania)',
    flag: '🇹🇿',
    sampleGreeting: 'Habari! Mimi ni Gemini. Una swali gani la somo lolote leo?',
    promptSuggestions: [
      'Nieleze kanuni ya Archimedes katika Physics kwa Kiswahili na mifano halisi',
      'Fafanua muundo wa atomi na elektroniki katika Chemistry Form 2',
      'Nipe mbinu za kupata Division One kwenye mtihani wa NECTA Form 4',
      'Eleza sifa na tofauti za Fasihi Simulizi na Fasihi Andishi'
    ],
    systemPromptDirective: 'Wasiliana kwa Kiswahili fasaha, sanifu, na chenye heshima cha Tanzania (kulingana na miongozo ya BAKITA na mtaala wa NECTA). Eleza dhana zote za kimasomo kwa lugha nyepesi na mifano halisi ya Tanzania.'
  },
  {
    code: 'en',
    bcp47: 'en-US',
    name: 'English',
    localName: 'Academic English',
    flag: '🇬🇧',
    sampleGreeting: "Hello! I'm Gemini. What concept or past paper problem would you like to master today?",
    promptSuggestions: [
      "Explain Newton's Laws of Motion with real-world Tanzanian examples",
      'Solve this quadratic equation step-by-step: 2x² + 5x - 3 = 0',
      'What are the key differences between Mitosis and Meiosis?',
      'Give me the top examiner tips for NECTA Biology Paper 1'
    ],
    systemPromptDirective: 'Communicate in clear, academic English suitable for secondary school and higher education. Provide step-by-step explanations, highlighting key definitions and formulas, with helpful Swahili cross-references where appropriate.'
  },
  {
    code: 'fr',
    bcp47: 'fr-FR',
    name: 'Français',
    localName: 'Français (Kifaransa)',
    flag: '🇫🇷',
    sampleGreeting: "Bonjour ! Je suis Gemini, votre tuteur de français. Que souhaitez-vous étudier aujourd'hui ?",
    promptSuggestions: [
      'Expliquez la conjugaison du passé composé avec des exemples clairs',
      'Quels sont les verbes les plus courants en français pour le niveau Form 3 ?',
      'Aidez-moi à rédiger une petite composition sur ma famille en français',
      'Comment utiliser les pronoms COD et COI en français ?'
    ],
    systemPromptDirective: 'Communicate in clear French (Français), catering to Tanzanian secondary school students learning French. Provide vocabulary translations in Kiswahili/English and explain grammar rules step-by-step.'
  },
  {
    code: 'ar',
    bcp47: 'ar-SA',
    name: 'العربية',
    localName: 'العربية (Kiarabu)',
    flag: '🇸🇦',
    sampleGreeting: 'مرحباً بك! أنا جيميني (Gemini)، رفيقك الدراسي للغة العربية والمناهج التعليمية. كيف أساعدك اليوم؟',
    promptSuggestions: [
      'اشرح لي قواعد الفعل الماضي والمضارع والأمر مع الأمثلة',
      'ما هي حروف الجر في اللغة العربية واستخداماتها؟',
      'ساعدني في إعراب هذه الجملة: كتب الطالبُ الدرسَ',
      'علمني محادثة يومية بسيطة باللغة العربية مع الترجمة'
    ],
    systemPromptDirective: 'Communicate in Modern Standard Arabic (العربية الفصحى), catering to Tanzanian students studying Arabic language and literature. Include Tashkeel (vowel marks) where helpful, and supply Swahili/English translations.'
  },
  {
    code: 'zh',
    bcp47: 'zh-CN',
    name: '中文',
    localName: '中文 (Kichina - Mandarin)',
    flag: '🇨🇳',
    sampleGreeting: '你好！我是 Gemini，你的中文学习助手。今天想学什么汉字或语法？',
    promptSuggestions: [
      '教我十个中学生日常最常用的中文句子和拼音 (Pinyin)',
      '请解释中文中的四个声调 (Four Tones) 并举例',
      '帮我练习如何用中文介绍自己 (Self-introduction)',
      '汉字的基本笔画有哪些？请给出示例'
    ],
    systemPromptDirective: 'Communicate in simplified Chinese (Mandarin), always providing Pinyin and English/Kiswahili translations to assist Tanzanian secondary students studying Chinese.'
  },
  {
    code: 'de',
    bcp47: 'de-DE',
    name: 'Deutsch',
    localName: 'Deutsch (Kijerumani)',
    flag: '🇩🇪',
    sampleGreeting: 'Guten Tag! Ich bin Gemini, dein Lernbegleiter für Deutsch. Was möchtest du heute üben?',
    promptSuggestions: [
      'Erkläre mir die vier Fälle im Deutschen (Nominativ, Akkusativ, Dativ, Genitiv)',
      'Wie bildet man das Perfekt im Deutschen?',
      'Hilf mir bei einem kurzen Dialog zum Thema Einkaufen',
      'Was sind die wichtigsten trennbaren Verben im Deutschen?'
    ],
    systemPromptDirective: 'Communicate in German (Deutsch), assisting Tanzanian students studying German as a foreign language subject. Provide vocabulary glossaries and grammar tips in English/Kiswahili.'
  },
  {
    code: 'es',
    bcp47: 'es-ES',
    name: 'Español',
    localName: 'Español (Kihispania)',
    flag: '🇪🇸',
    sampleGreeting: '¡Hola! Soy Gemini, tu compañero de estudio. ¿Qué te gustaría aprender o practicar hoy?',
    promptSuggestions: [
      'Explícame la diferencia entre los verbos ser y estar en español',
      '¿Cuáles son las conjugaciones básicas del presente de indicativo?',
      'Ayúdame a redactar una presentación personal en español',
      'Dame una lista de vocabulario académico básico en español'
    ],
    systemPromptDirective: 'Communicate in Spanish (Español), supporting students learning Spanish with clear explanations, grammar rules, and English/Kiswahili translations.'
  }
];

export const DEFAULT_GEMINI_VOICE = 'Kore';
export const DEFAULT_APP_LANGUAGE = 'sw';
