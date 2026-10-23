export interface ScholarAvatar {
  id: string;
  name: string;
  englishTitle: string;
  category: 'STEM' | 'Nature & Heritage' | 'Humanities' | 'Leadership';
  emoji: string;
  badge: string;
  gradient: string;
  glowColor: string;
  ringColor: string;
  textColor: string;
  bgSoft: string;
  description: string;
  motto: string;
}

export const SCHOLAR_AVATARS: ScholarAvatar[] = [
  {
    id: 'scholar-stem',
    name: 'Mwanasayansi Hodari',
    englishTitle: 'STEM Prodigy & Physicist',
    category: 'STEM',
    emoji: '🔬',
    badge: 'Sayansi & Uvumbuzi',
    gradient: 'from-cyan-500 via-sky-600 to-blue-700',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    ringColor: 'ring-cyan-400',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    bgSoft: 'bg-cyan-50 dark:bg-cyan-950/40',
    description: 'Mchunguzi wa fomula za NECTA Fizikia na Kemia anayelenga uvumbuzi wa kiteknolojia.',
    motto: 'Ujuzi ni Nguvu ya Maendeleo'
  },
  {
    id: 'scholar-math',
    name: 'Mtaalamu wa Hesabu',
    englishTitle: 'Pure Math & Calculus Master',
    category: 'STEM',
    emoji: '📐',
    badge: 'NECTA Pure Math',
    gradient: 'from-blue-600 via-indigo-600 to-violet-700',
    glowColor: 'rgba(79, 70, 229, 0.4)',
    ringColor: 'ring-indigo-400',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgSoft: 'bg-indigo-50 dark:bg-indigo-950/40',
    description: 'Hupenda jiometria, aljebra na kanuni tata za integration kwa ufaulu wa Daraja la Kwanza.',
    motto: 'Kila Tatizo Lina Jibu Sahihi'
  },
  {
    id: 'scholar-medic',
    name: 'Daktari Mtarajiwa',
    englishTitle: 'Future Medical Surgeon',
    category: 'STEM',
    emoji: '🩺',
    badge: 'Afya & Biolojia',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    ringColor: 'ring-emerald-400',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgSoft: 'bg-emerald-50 dark:bg-emerald-950/40',
    description: 'Mwanafunzi anayejitolea kuelewa anatomia, seli na mikakati ya kutibu jamii za Kitanzania.',
    motto: 'Kujitolea Kuokoa Maisha'
  },
  {
    id: 'scholar-coder',
    name: 'Fundi wa Teknolojia',
    englishTitle: 'Silicon Dar Software Engineer',
    category: 'STEM',
    emoji: '💻',
    badge: 'AI & Programu',
    gradient: 'from-violet-600 via-purple-600 to-pink-600',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    ringColor: 'ring-purple-400',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgSoft: 'bg-purple-50 dark:bg-purple-950/40',
    description: 'Mbunifu wa mifumo ya kidijitali, programu za simu na zana za AI zinazoleta mageuzi Afrika.',
    motto: 'Msimbo Unaobadili Ulimwengu'
  },
  {
    id: 'scholar-safari',
    name: 'Mwongoza Serengeti',
    englishTitle: 'Serengeti Ecology & Wildlife Ranger',
    category: 'Nature & Heritage',
    emoji: '🦁',
    badge: 'Hifadhi & Ikolojia',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    ringColor: 'ring-amber-400',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgSoft: 'bg-amber-50 dark:bg-amber-950/40',
    description: 'Mtafiti wa wanyamapori, mifumo ya ekolojia na urithi asilia wa Tanzania na Bonde la Ngorongoro.',
    motto: 'Urithi Wetu, Fahari Yetu'
  },
  {
    id: 'scholar-kili',
    name: 'Mshindi wa Kili',
    englishTitle: 'Kilimanjaro Summit Achiever',
    category: 'Nature & Heritage',
    emoji: '🏔️',
    badge: 'Kilele cha Uhuru',
    gradient: 'from-sky-500 via-teal-600 to-indigo-700',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    ringColor: 'ring-sky-400',
    textColor: 'text-sky-600 dark:text-sky-400',
    bgSoft: 'bg-sky-50 dark:bg-sky-950/40',
    description: 'Mvumilivu asiyekata tamaa, akipanda viwango vya elimu hadi kufikia kilele cha ufaulu wa kitaifa.',
    motto: 'Kileleni Hakuna Njia Fupi'
  },
  {
    id: 'scholar-agri',
    name: 'Mtafiti wa Kilimo Bora',
    englishTitle: 'Agronomy & Food Security Innovator',
    category: 'Nature & Heritage',
    emoji: '🌾',
    badge: 'Uzalishaji & Mazingira',
    gradient: 'from-lime-500 via-green-600 to-emerald-700',
    glowColor: 'rgba(132, 204, 22, 0.4)',
    ringColor: 'ring-lime-400',
    textColor: 'text-lime-600 dark:text-lime-400',
    bgSoft: 'bg-lime-50 dark:bg-lime-950/40',
    description: 'Anaunganisha sayansi ya kisasa ya udongo na mbegu ili kuboresha kilimo cha Tanzania.',
    motto: 'Ardhi Yenye Rutuba, Taifa Lenye Afya'
  },
  {
    id: 'scholar-space',
    name: 'Mchunguzi wa Anga',
    englishTitle: 'Aerospace & Satellite Pioneer',
    category: 'Nature & Heritage',
    emoji: '🚀',
    badge: 'Unajimu & Anga',
    gradient: 'from-indigo-600 via-purple-700 to-pink-700',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    ringColor: 'ring-indigo-400',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgSoft: 'bg-indigo-50 dark:bg-indigo-950/40',
    description: 'Anaangazia anga za mbali, setilaiti za utafiti na mustakabali wa teknolojia ya angani.',
    motto: 'Kufikia Zaidi ya Mawingu'
  },
  {
    id: 'scholar-poet',
    name: 'Bingwa wa Kiswahili',
    englishTitle: 'Swahili Laureate & Literature Poet',
    category: 'Humanities',
    emoji: '📜',
    badge: 'Lugha & Fasihi',
    gradient: 'from-rose-500 via-pink-600 to-red-700',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    ringColor: 'ring-rose-400',
    textColor: 'text-rose-600 dark:text-rose-400',
    bgSoft: 'bg-rose-50 dark:bg-rose-950/40',
    description: 'Msanii wa mashairi, sarufi fasaha na fasihi simulizi anayetukuza lugha adhimu ya Kiswahili.',
    motto: 'Kiswahili ni Utambulisho Wetu'
  },
  {
    id: 'scholar-law',
    name: 'Mwanasheria Hodari',
    englishTitle: 'Constitutional Law & Justice Scholar',
    category: 'Humanities',
    emoji: '⚖️',
    badge: 'Haki & Sheria',
    gradient: 'from-amber-600 via-amber-700 to-yellow-800',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    ringColor: 'ring-amber-500',
    textColor: 'text-amber-700 dark:text-amber-400',
    bgSoft: 'bg-amber-50 dark:bg-amber-950/40',
    description: 'Mtetezi wa haki za kijamii, utawala wa sheria na kusaidia walio duni kwa hekima na ushahidi.',
    motto: 'Haki Inatetea Wote'
  },
  {
    id: 'scholar-art',
    name: 'Msanii Mbunifu',
    englishTitle: 'Creative Designer & Visual Artist',
    category: 'Humanities',
    emoji: '🎨',
    badge: 'Ubunifu & Sanaa',
    gradient: 'from-fuchsia-500 via-pink-600 to-amber-500',
    glowColor: 'rgba(217, 70, 239, 0.4)',
    ringColor: 'ring-fuchsia-400',
    textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgSoft: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    description: 'Huleta maisha kwenye michoro ya Tingatinga, usanifu majengo na sanaa za kisasa za kidijitali.',
    motto: 'Ubunifu Hujenga Taswira ya Kesho'
  },
  {
    id: 'scholar-leader',
    name: 'Kiongozi wa Kesho',
    englishTitle: 'Visionary National Statesperson',
    category: 'Leadership',
    emoji: '👑',
    badge: 'Uongozi & Maono',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    ringColor: 'ring-yellow-400',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgSoft: 'bg-amber-50 dark:bg-amber-950/40',
    description: 'Kiongozi mwenye hekima, maadili ya Mwalimu Nyerere, na shauku ya kuunganisha watu kwa maendeleo.',
    motto: 'Uongozi ni Utumishi kwa Jamii'
  },
  {
    id: 'scholar-necta-topper',
    name: 'Mshindi wa Daraja la I',
    englishTitle: 'NECTA National Distinction Star',
    category: 'Leadership',
    emoji: '⚡',
    badge: 'Division One (Points 7)',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    ringColor: 'ring-amber-300',
    textColor: 'text-amber-600 dark:text-amber-300',
    bgSoft: 'bg-amber-50 dark:bg-amber-950/40',
    description: 'Mwanafunzi anayeweka nidhamu ya hali ya juu kwenye maandalizi ya mitihani ya CSEE na ACSEE.',
    motto: 'Ufaulu Bora Hutokana na Maandalizi Madhubuti'
  },
  {
    id: 'scholar-yun-ai',
    name: 'Mwanafunzi wa Yun AI',
    englishTitle: 'AI-Enhanced Global Scholar',
    category: 'Leadership',
    emoji: '🤖',
    badge: 'Mshirika wa Yun AI',
    gradient: 'from-sky-400 via-indigo-500 to-purple-600',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    ringColor: 'ring-sky-400',
    textColor: 'text-sky-600 dark:text-cyan-400',
    bgSoft: 'bg-sky-50 dark:bg-sky-950/40',
    description: 'Hutumia msaidizi wa Yun AI kujibu maswali tata, kufanya marudio ya papo kwa papo na kukuza uelewa.',
    motto: 'Kujifunza Hakuna Mipaka'
  }
];

export const DEFAULT_SCHOLAR_AVATAR = SCHOLAR_AVATARS[0];

export function getScholarAvatar(avatarId?: string): ScholarAvatar {
  if (!avatarId) return DEFAULT_SCHOLAR_AVATAR;
  const found = SCHOLAR_AVATARS.find(a => a.id === avatarId);
  return found || DEFAULT_SCHOLAR_AVATAR;
}
