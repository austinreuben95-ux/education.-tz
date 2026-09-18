import React, { useState } from 'react';
import { AppView } from '../types';

interface HubItem {
  id: string;
  title: string;
  badge?: string;
  badgeColor?: string;
  icon: string;
  iconBg: string;
  description: string;
  actionText: string;
  actionTextColor: string;
  bgClass: string;
  borderClass: string;
  hoverClass: string;
  onClick: () => void;
  extraContent?: React.ReactNode;
}

interface EssentialHubsCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface EssentialHubsProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  setActiveStudyRoomSubject: (subject: string) => void;
  highestActivitySubject: {
    id: string;
    name: string;
    icon?: string;
    count: number;
    likes: number;
    latestTopic?: string;
  };
  setIsRoadmapModalOpen: (open: boolean) => void;
}

export const EssentialHubs: React.FC<EssentialHubsProps> = ({
  currentView,
  setCurrentView,
  setActiveStudyRoomSubject,
  highestActivitySubject,
  setIsRoadmapModalOpen
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'STUDY' | 'EXAMS' | 'GUIDANCE'>('ALL');

  const categories: EssentialHubsCategory[] = [
    { id: 'ALL', name: 'All Hubs', icon: 'fa-grid-2', count: 8 },
    { id: 'STUDY', name: 'Academics & Notes', icon: 'fa-book-open-reader', count: 4 },
    { id: 'EXAMS', name: 'NECTA & Assessment', icon: 'fa-clipboard-check', count: 3 },
    { id: 'GUIDANCE', name: 'Schools & Guidance', icon: 'fa-graduation-cap', count: 3 },
  ];

  // Safe fallback for highestActivitySubject
  const safeHighestSubject = highestActivitySubject || {
    id: 'biology',
    name: 'Biology',
    icon: 'fa-dna',
    count: 2,
    likes: 84,
    latestTopic: 'Genetics & Evolution'
  };

  const hubs: (HubItem & { category: 'STUDY' | 'EXAMS' | 'GUIDANCE' })[] = [
    // 1. Shared Study Room (Realtime)
    {
      id: 'hub-study-room',
      category: 'STUDY',
      title: 'Shared Study Room',
      badge: 'Firebase Realtime Live',
      badgeColor: 'bg-emerald-500 text-slate-950',
      icon: 'fa-chalkboard-user',
      iconBg: 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 shadow-indigo-500/20',
      description: 'Study together in subject rooms! Exchange quick revision tips, formula mnemonics, and chief examiner traps in real-time.',
      actionText: 'Enter Live Subject Rooms',
      actionTextColor: 'text-indigo-300',
      bgClass: 'bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white',
      borderClass: 'border-2 border-indigo-400/50 hover:border-indigo-400',
      hoverClass: 'hover:shadow-2xl hover:scale-[1.02]',
      onClick: () => {
        if (setActiveStudyRoomSubject) setActiveStudyRoomSubject('ALL');
        setCurrentView(AppView.STUDY_ROOM);
      },
      extraContent: (
        <div className="bg-slate-950/85 rounded-2xl p-3 border border-indigo-500/40 backdrop-blur-sm space-y-2 shadow-inner mt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Highest Discussion Activity
            </span>
            <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <i className="fa-solid fa-fire text-amber-400 text-[9px]"></i>
              <span>Trending Now</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/25 border border-indigo-400/40 text-cyan-300 flex items-center justify-center text-base shrink-0">
              <i className={`fa-solid ${safeHighestSubject.icon || 'fa-chalkboard-user'}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h5 className="font-black text-xs text-white truncate">
                  {safeHighestSubject.name || 'Biology'}
                </h5>
                <span className="text-[10px] font-black text-cyan-300 whitespace-nowrap bg-cyan-950/60 px-1.5 py-0.5 rounded-md border border-cyan-500/30">
                  {safeHighestSubject.likes || 0} <i className="fa-solid fa-thumbs-up text-[9px]"></i>
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate mt-0.5">
                {safeHighestSubject.latestTopic ? `Topic: ${safeHighestSubject.latestTopic}` : `${safeHighestSubject.count || 0} active discussion threads`}
              </p>
            </div>
          </div>
        </div>
      )
    },
    // 2. Video Lessons & Tutorials
    {
      id: 'hub-videos',
      category: 'STUDY',
      title: 'Video Lessons & Tutorials',
      badge: 'Swahili & English Videos',
      badgeColor: 'bg-red-600 text-white',
      icon: 'fa-play',
      iconBg: 'bg-red-600 text-white shadow-red-500/30',
      description: 'Search top-rated video walkthroughs by subject or topic (Maths, Physics, Chemistry, Kiswahili) with embedded YouTube player.',
      actionText: 'Watch Video Lessons',
      actionTextColor: 'text-red-700',
      bgClass: 'bg-red-500/10 text-slate-900',
      borderClass: 'border-2 border-red-500/40',
      hoverClass: 'hover:bg-red-500/20 hover:shadow-lg',
      onClick: () => setCurrentView(AppView.VIDEOS)
    },
    // 3. Notes Hub
    {
      id: 'hub-notes',
      category: 'STUDY',
      title: 'Study Notes Hub',
      icon: 'fa-note-sticky',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-200',
      description: 'Create personal subject notebooks, save Yun AI summaries, and export PDFs.',
      actionText: 'Open Notebooks',
      actionTextColor: 'text-indigo-700',
      bgClass: 'bg-indigo-50/80 text-indigo-950',
      borderClass: 'border-2 border-indigo-100',
      hoverClass: 'hover:bg-indigo-100/80 hover:shadow-md',
      onClick: () => setCurrentView(AppView.NOTES)
    },
    // 4. Vocabulary & Dictionary
    {
      id: 'hub-dict',
      category: 'STUDY',
      title: 'Vocabulary & Kamusi',
      icon: 'fa-book-bookmark',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
      description: 'Swahili & English academic term definitions, audio pronunciation, and flashcards.',
      actionText: 'Open Dictionary',
      actionTextColor: 'text-amber-700',
      bgClass: 'bg-amber-50/80 text-amber-950',
      borderClass: 'border-2 border-amber-100',
      hoverClass: 'hover:bg-amber-100/80 hover:shadow-md',
      onClick: () => setCurrentView(AppView.DICTIONARY)
    },
    // 5. NECTA Results & Exam Vault
    {
      id: 'hub-exams',
      category: 'EXAMS',
      title: 'NECTA Results Portal',
      icon: 'fa-square-poll-vertical',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-200',
      description: 'Check index statements, candidate results, and calculate division points.',
      actionText: 'Access Results',
      actionTextColor: 'text-emerald-700',
      bgClass: 'bg-emerald-50/80 text-emerald-950',
      borderClass: 'border-2 border-emerald-100',
      hoverClass: 'hover:bg-emerald-100/80 hover:shadow-md',
      onClick: () => setCurrentView(AppView.EXAMS)
    },
    // 6. Assignments & Tests Bank
    {
      id: 'hub-tests',
      category: 'EXAMS',
      title: 'Assignments & Practice Tests',
      icon: 'fa-list-check',
      iconBg: 'bg-sky-600 text-white shadow-sky-200',
      description: 'Practice weekly homework tasks, timed speed tests, and past papers with model answer keys.',
      actionText: 'Open Test Bank',
      actionTextColor: 'text-sky-700',
      bgClass: 'bg-sky-50/80 text-sky-950',
      borderClass: 'border-2 border-sky-100',
      hoverClass: 'hover:bg-sky-100/80 hover:shadow-md',
      onClick: () => setCurrentView(AppView.ASSIGNMENTS_TESTS)
    },
    // 7. Grade Calculator
    {
      id: 'hub-calc',
      category: 'EXAMS',
      title: 'Grade Calculator',
      icon: 'fa-calculator',
      iconBg: 'bg-purple-600 text-white shadow-purple-200',
      description: 'Calculate subject grade averages, sum scores, and academic percentages.',
      actionText: 'Calculate Grades',
      actionTextColor: 'text-purple-700',
      bgClass: 'bg-purple-50/80 text-purple-950',
      borderClass: 'border-2 border-purple-100',
      hoverClass: 'hover:bg-purple-100/80 hover:shadow-md',
      onClick: () => setCurrentView(AppView.CALCULATOR)
    },
    // 8. Schools & Pass Marks
    {
      id: 'hub-schools',
      category: 'GUIDANCE',
      title: 'Schools & Pass Marks',
      badge: 'NECTA Cut-offs & Codes',
      badgeColor: 'bg-indigo-600 text-white',
      icon: 'fa-school',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-500/30',
      description: 'Search primary & secondary schools in Tanzania by name, NECTA center code, or region with minimum pass marks & grade scales.',
      actionText: 'Explore Schools Directory',
      actionTextColor: 'text-indigo-700',
      bgClass: 'bg-indigo-500/10 text-slate-900',
      borderClass: 'border-2 border-indigo-500/40',
      hoverClass: 'hover:bg-indigo-500/20 hover:shadow-lg',
      onClick: () => setCurrentView(AppView.SCHOOLS)
    },
    // 9. Selection & Scholarships
    {
      id: 'hub-news',
      category: 'GUIDANCE',
      title: 'Selection Alerts & Scholarships',
      badge: 'TAMISEMI & Scholarships',
      badgeColor: 'bg-amber-400 text-slate-950',
      icon: 'fa-bullhorn',
      iconBg: 'bg-amber-400 text-slate-950 shadow-amber-400/30',
      description: 'Form 1 & Form 5 TAMISEMI selection lists, NECTA results, TCU & HESLB loan releases + MasterCard, Chevening & Chinese Scholarships!',
      actionText: 'Open Selection & Scholarships',
      actionTextColor: 'text-slate-900',
      bgClass: 'bg-amber-500/10 text-slate-900',
      borderClass: 'border-2 border-amber-400',
      hoverClass: 'hover:bg-amber-500/20 hover:shadow-lg',
      onClick: () => setCurrentView(AppView.NEWS_SCHOLARSHIPS)
    },
    // 10. School & University Predictor
    {
      id: 'hub-predictor',
      category: 'GUIDANCE',
      title: 'School & University Predictor',
      icon: 'fa-graduation-cap',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-200',
      description: 'Predict exactly which Special National Schools, A-Level Combos, or University programs (UDSM, MUHAS) you qualify for!',
      actionText: 'Predict School Admission',
      actionTextColor: 'text-emerald-700',
      bgClass: 'bg-emerald-50/80 text-emerald-950',
      borderClass: 'border-2 border-emerald-100',
      hoverClass: 'hover:bg-emerald-100/80 hover:shadow-md',
      onClick: () => setCurrentView(AppView.PREDICTOR)
    },
    // 11. 150 Ideas Strategic Blueprint
    {
      id: 'hub-roadmap',
      category: 'GUIDANCE',
      title: '150 Innovation Ideas & Blueprint',
      badge: '150 Strategic Features',
      badgeColor: 'bg-amber-400/30 text-amber-900 border border-amber-400/40',
      icon: 'fa-rocket',
      iconBg: 'bg-amber-500 text-slate-950 shadow-amber-400/30',
      description: 'Explore the complete 150-point master roadmap powering NECTA exam tech, STEM labs, low-bandwidth PWA, AI tools & Swahili localization.',
      actionText: 'Explore 150 Strategy Points',
      actionTextColor: 'text-amber-900',
      bgClass: 'bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-500/15 text-slate-900',
      borderClass: 'border-2 border-amber-300',
      hoverClass: 'hover:from-amber-500/20 hover:to-amber-400/10 hover:shadow-md',
      onClick: () => setIsRoadmapModalOpen(true)
    }
  ];

  const displayedHubs = activeTab === 'ALL'
    ? hubs
    : hubs.filter(hub => hub.category === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-5 mb-12">
      {/* Header with Title and Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-tz-dark flex items-center gap-2">
            <i className="fa-solid fa-grid-2 text-indigo-600"></i> Essential Learning Hubs
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Quick access to interactive study rooms, exam tools, notes, and guidance portals
          </p>
        </div>

        {/* Filter Pills for Grouped Hubs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-[11px]`}></i>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Grouped Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedHubs.map((hub) => (
          <div
            key={hub.id}
            id={`hub-card-${hub.id}`}
            className={`${hub.bgClass} rounded-3xl p-6 flex flex-col justify-between group cursor-pointer transition-all duration-300 ${hub.borderClass} ${hub.hoverClass} shadow-sm relative overflow-hidden`}
            onClick={hub.onClick}
          >
            {hub.badge && (
              <div className={`absolute top-0 right-0 ${hub.badgeColor} text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-xs`}>
                {hub.badge}
              </div>
            )}
            <div>
              <div className={`w-12 h-12 ${hub.iconBg} rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md`}>
                <i className={`fa-solid ${hub.icon}`}></i>
              </div>
              <h4 className="text-lg font-black mb-1 flex items-center gap-2">
                <span>{hub.title}</span>
              </h4>
              <p className="text-xs font-medium leading-relaxed opacity-90">
                {hub.description}
              </p>
              {hub.extraContent}
            </div>

            <div className={`pt-4 mt-4 border-t border-current/10 flex items-center justify-between text-xs font-black ${hub.actionTextColor}`}>
              <span>{hub.actionText}</span>
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssentialHubs;
