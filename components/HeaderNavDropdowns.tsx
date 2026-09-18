import React, { useState, useRef, useEffect } from 'react';
import { AppView, EducationLevel } from '../types';

export interface NavItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  iconBg?: string;
  badge?: string;
  badgeColor?: string;
  view?: AppView;
  isCustomAction?: boolean;
  action?: () => void;
  isExternal?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  activeBg: string;
  activeSoftBg: string;
  hoverSoft: string;
  badge?: string;
  badgeColor?: string;
  items: NavItem[];
}

interface HeaderNavDropdownsProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onSelectAllSubjects: () => void;
  onOpenRoadmap: () => void;
  dataSaver: boolean;
  setDataSaver: (val: boolean) => void;
  isOnline: boolean;
  onOpenOfflineToast: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenProfile?: () => void;
  streak?: number;
  points?: number;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onOpenParents?: () => void;
  onStartChat?: () => void;
  onGoHome?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  // Optional search / shortcuts
  onOpenSearch?: () => void;
}

export const HeaderNavDropdowns: React.FC<HeaderNavDropdownsProps> = ({
  currentView,
  setCurrentView,
  onSelectAllSubjects,
  onOpenRoadmap,
  dataSaver,
  setDataSaver,
  isOnline,
  onOpenOfflineToast,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenProfile,
  streak = 0,
  points = 0,
  isAdmin = false,
  onOpenAdmin,
  onOpenParents,
  onStartChat,
  onGoHome,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track expanded accordion dropdowns in mobile menu
  const [expandedMobileGroups, setExpandedMobileGroups] = useState<Record<string, boolean>>({
    academics: true, // open first by default
  });

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileMenuOpen]);

  // Defined grouped navigation menus with vibrant color palettes
  const navGroups: NavGroup[] = [
    {
      id: 'academics',
      label: 'Academics & Study',
      icon: 'fa-book-open-reader',
      iconColor: 'text-tz-blue dark:text-cyan-400',
      activeBg: 'bg-sky-600 text-white shadow-md shadow-sky-500/25',
      activeSoftBg: 'bg-sky-50 text-sky-700 font-bold border border-sky-200 dark:bg-slate-800 dark:text-cyan-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-200 dark:hover:text-cyan-300 dark:hover:bg-slate-800/80',
      items: [
        {
          id: 'nav-syllabus',
          label: 'All Subjects Syllabus',
          sublabel: 'Std 1 to Form 6 full curricula',
          icon: 'fa-layer-group',
          iconBg: 'bg-sky-500 text-white',
          isCustomAction: true,
          action: onSelectAllSubjects,
          view: AppView.SYLLABUS
        },
        {
          id: 'nav-notes',
          label: 'Study Notes & Notebooks',
          sublabel: 'Personal notes, summaries & PDF exports',
          icon: 'fa-note-sticky',
          iconBg: 'bg-amber-500 text-white',
          view: AppView.NOTES
        },
        {
          id: 'nav-videos',
          label: 'Video Classes & Tutorials',
          sublabel: 'Swahili & English YouTube curated lessons',
          icon: 'fa-play',
          iconBg: 'bg-rose-500 text-white',
          badge: 'Videos',
          badgeColor: 'bg-rose-100 text-rose-700 border border-rose-200',
          view: AppView.VIDEOS
        },
        {
          id: 'nav-study-room',
          label: 'Shared Study Room',
          sublabel: 'Live discussions, NECTA traps & formulas',
          icon: 'fa-chalkboard-user',
          iconBg: 'bg-emerald-500 text-white',
          badge: 'Live',
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          view: AppView.STUDY_ROOM
        },
        {
          id: 'nav-planner',
          label: 'Weekly Planner & Music',
          sublabel: 'Study timetable & focus audio tracks',
          icon: 'fa-music',
          iconBg: 'bg-purple-500 text-white',
          view: AppView.PLANNER
        },
        {
          id: 'nav-teachers',
          label: 'Teachers & Tutors Hub',
          sublabel: 'Connect with verified Tanzanian subject teachers',
          icon: 'fa-person-chalkboard',
          iconBg: 'bg-teal-500 text-white',
          view: AppView.TEACHERS
        }
      ]
    },
    {
      id: 'exams',
      label: 'Exams & Assessment',
      icon: 'fa-clipboard-check',
      iconColor: 'text-tz-green dark:text-emerald-400',
      activeBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25',
      activeSoftBg: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 dark:bg-slate-800 dark:text-emerald-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-200 dark:hover:text-emerald-300 dark:hover:bg-slate-800/80',
      items: [
        {
          id: 'nav-exams-vault',
          label: 'NECTA Past Papers & Results',
          sublabel: 'National exams, marking schemes & results portal',
          icon: 'fa-square-poll-vertical',
          iconBg: 'bg-emerald-500 text-white',
          badge: 'NECTA',
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-black',
          view: AppView.EXAMS
        },
        {
          id: 'nav-assignments',
          label: 'Assignments & Practice Tests',
          sublabel: 'Homework tasks, speed tests & model answers',
          icon: 'fa-list-check',
          iconBg: 'bg-blue-500 text-white',
          view: AppView.ASSIGNMENTS_TESTS
        },
        {
          id: 'nav-grade-check',
          label: 'NECTA Grade Checker & AVE',
          sublabel: '25, 50 & 100-mark scales, divisions & averages',
          icon: 'fa-check-double',
          iconBg: 'bg-cyan-500 text-white',
          badge: '50/100',
          badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200',
          view: AppView.GRADE_CHECKER
        },
        {
          id: 'nav-calculator',
          label: 'Quick Grade Calculator',
          sublabel: 'Input subject scores for instant totals & averages',
          icon: 'fa-calculator',
          iconBg: 'bg-violet-500 text-white',
          view: AppView.CALCULATOR
        }
      ]
    },
    {
      id: 'guidance',
      label: 'Guidance & Admissions',
      icon: 'fa-graduation-cap',
      iconColor: 'text-tz-yellow dark:text-amber-400',
      activeBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/25',
      activeSoftBg: 'bg-amber-50 text-amber-800 font-bold border border-amber-200 dark:bg-slate-800 dark:text-amber-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-200 dark:hover:text-amber-300 dark:hover:bg-slate-800/80',
      badge: 'Hot',
      badgeColor: 'bg-amber-400 text-slate-950 font-black',
      items: [
        {
          id: 'nav-news-scholarships',
          label: 'Selection & Scholarships',
          sublabel: 'TAMISEMI Form 1/5 lists, TCU, HESLB & grants',
          icon: 'fa-bullhorn',
          iconBg: 'bg-amber-500 text-white',
          badge: 'TAMISEMI',
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200 font-bold',
          view: AppView.NEWS_SCHOLARSHIPS
        },
        {
          id: 'nav-predictor',
          label: 'School & University Predictor',
          sublabel: 'Predict cut-offs for Special Schools, Combos & UDSM',
          icon: 'fa-compass-drafting',
          iconBg: 'bg-fuchsia-500 text-white',
          view: AppView.PREDICTOR
        },
        {
          id: 'nav-schools-directory',
          label: 'Schools Directory & Pass Marks',
          sublabel: 'NECTA center codes, regions & minimum cut-offs',
          icon: 'fa-school',
          iconBg: 'bg-blue-500 text-white',
          view: AppView.SCHOOLS
        },
        {
          id: 'nav-alevel-guide',
          label: 'A-Level Combinations Guide',
          sublabel: 'PCM, PCB, EGM, HGL combinations & career paths',
          icon: 'fa-diagram-project',
          iconBg: 'bg-indigo-500 text-white',
          view: AppView.ALEVEL_GUIDE
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools & Badges',
      icon: 'fa-toolbox',
      iconColor: 'text-tz-purple dark:text-purple-400',
      activeBg: 'bg-purple-600 text-white shadow-md shadow-purple-500/25',
      activeSoftBg: 'bg-purple-50 text-purple-700 font-bold border border-purple-200 dark:bg-slate-800 dark:text-purple-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-200 dark:hover:text-purple-300 dark:hover:bg-slate-800/80',
      items: [
        {
          id: 'nav-dictionary',
          label: 'Vocabulary & Kamusi',
          sublabel: 'Bilingual Swahili-English dictionary & flashcards',
          icon: 'fa-book-bookmark',
          iconBg: 'bg-pink-500 text-white',
          view: AppView.DICTIONARY
        },
        {
          id: 'nav-badges',
          label: 'Scholar Badges & Streaks',
          sublabel: 'Track milestones, study streaks & earn trophies',
          icon: 'fa-trophy',
          iconBg: 'bg-amber-500 text-white',
          badge: 'Awards',
          badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200 font-bold',
          view: AppView.BADGES
        },
        {
          id: 'nav-roadmap',
          label: '150 Innovation Blueprint',
          sublabel: 'Platform strategic roadmap & upcoming features',
          icon: 'fa-rocket',
          iconBg: 'bg-purple-500 text-white',
          badge: '150 Ideas',
          badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200 font-bold',
          isCustomAction: true,
          action: onOpenRoadmap,
          view: AppView.ROADMAP
        }
      ]
    }
  ];

  const handleItemClick = (item: NavItem) => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (item.isCustomAction && item.action) {
      item.action();
    } else if (item.view) {
      setCurrentView(item.view);
    }
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => item.view === currentView);
  };

  // Toggle accordion group in mobile menu
  const toggleMobileGroup = (groupId: string) => {
    setExpandedMobileGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Automatically ensure the active view's group is open when drawer opens
  useEffect(() => {
    if (mobileMenuOpen) {
      const activeGroup = navGroups.find(g => isGroupActive(g));
      if (activeGroup) {
        setExpandedMobileGroups(prev => ({ ...prev, [activeGroup.id]: true }));
      }
    }
  }, [mobileMenuOpen, currentView]);

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      {/* DESKTOP DROPDOWN NAVIGATION BAR - Normal, Clean & High-Contrast */}
      <nav className="hidden lg:flex items-center gap-1 font-sans" aria-label="Main Navigation">
        {navGroups.map((group) => {
          const isOpen = openDropdown === group.id;
          const hasActiveItem = isGroupActive(group);

          return (
            <div key={group.id} className="relative">
              <button
                id={`nav-group-btn-${group.id}`}
                type="button"
                onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isOpen
                    ? group.activeBg
                    : hasActiveItem
                    ? group.activeSoftBg
                    : group.hoverSoft
                }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <i className={`fa-solid ${group.icon} text-xs ${isOpen ? 'text-white' : group.iconColor}`}></i>
                <span>{group.label}</span>
                {group.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wide ${
                    isOpen 
                      ? 'bg-white/20 text-white'
                      : group.badgeColor || 'bg-amber-400 text-slate-950 font-black'
                  }`}>
                    {group.badge}
                  </span>
                )}
                <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-150 ${isOpen ? 'rotate-180 text-white' : 'text-slate-400'}`}></i>
              </button>

              {/* DROPDOWN MENU PANEL - Clean Floating Card */}
              {isOpen && (
                <div
                  id={`nav-dropdown-menu-${group.id}`}
                  className="absolute left-0 mt-2 w-72 sm:w-80 bg-white/98 dark:bg-[#0f172a] backdrop-blur-md rounded-2xl shadow-xl shadow-sky-950/10 dark:shadow-2xl dark:shadow-black/80 border border-slate-200/90 dark:border-slate-700/90 p-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ring-1 ring-black/5"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {group.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{group.items.length} sections</span>
                  </div>

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isItemActive = item.view === currentView;
                      return (
                        <button
                          key={item.id}
                          id={item.id}
                          type="button"
                          onClick={() => handleItemClick(item)}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-150 flex items-start gap-2.5 cursor-pointer group/item ${
                            isItemActive
                              ? 'bg-sky-50 dark:bg-slate-800 text-tz-blue dark:text-cyan-300 font-bold border border-sky-200 dark:border-slate-700 shadow-2xs'
                              : 'hover:bg-sky-50/70 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                          }`}
                          role="menuitem"
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs transition-all shadow-2xs ${
                            isItemActive
                              ? item.iconBg || 'bg-sky-500 text-white'
                              : `${item.iconBg || 'bg-sky-500 text-white'} group-hover/item:scale-105`
                          }`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover/item:text-tz-blue dark:group-hover/item:text-cyan-300 truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wide ${
                                  item.badgeColor || 'bg-sky-100 text-sky-800 border border-sky-200'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.sublabel && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                                {item.sublabel}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* UTILITY QUICK TOGGLES IN HEADER - Clean & High Contrast */}
        <div className="flex items-center gap-1.5 ml-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
          {/* Global Late-Night Study Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              id="nav-night-study-toggle-btn"
              type="button"
              onClick={onToggleDarkMode}
              className={`px-3 py-1.5 rounded-full font-bold text-xs border transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-slate-700'
                  : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-tz-blue border-slate-200'
              }`}
              title={isDarkMode ? "Switch to Day Study Mode" : "Switch to Late-Night High-Contrast Study Mode"}
              aria-label="Toggle Night Study Mode"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'} text-xs`}></i>
              <span className="hidden xl:inline">{isDarkMode ? 'Day Mode' : 'Night Study'}</span>
            </button>
          )}

          {/* Low-MB Data Saver Toggle */}
          <button
            id="nav-data-saver-toggle-btn"
            type="button"
            onClick={() => setDataSaver(!dataSaver)}
            className={`px-3 py-1.5 rounded-full font-bold text-xs border transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
              dataSaver
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 shadow-sm shadow-amber-500/25'
                : 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-amber-200 dark:bg-slate-800 dark:text-amber-300 dark:border-slate-700'
            }`}
            title="Low-Bandwidth Mode for 3G & Limited Data"
          >
            <i className="fa-solid fa-bolt text-xs text-amber-500"></i>
            <span className="hidden xl:inline">{dataSaver ? 'Low MB (ON)' : 'Data Saver'}</span>
          </button>

          {/* Network Status Indicator */}
          <button
            id="nav-network-status-btn"
            type="button"
            onClick={onOpenOfflineToast}
            className={`px-3 py-1.5 rounded-full font-bold text-xs border transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
              !isOnline
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/25'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-slate-800 dark:text-emerald-300 dark:border-slate-700 font-bold'
            }`}
            title={!isOnline ? "Offline Mode Active - Saved Notes Available" : "Online & Connected"}
          >
            <span className={`w-2 h-2 rounded-full ${!isOnline ? 'bg-white animate-pulse' : 'bg-emerald-500 shadow-xs shadow-emerald-500/60'}`}></span>
            <span className="hidden xl:inline">{!isOnline ? 'Offline' : 'Online'}</span>
          </button>
        </div>
      </nav>

      {/* MOBILE / TABLET HAMBURGER BUTTON IN HEADER */}
      <div className="lg:hidden flex items-center gap-1">
        <button
          id="mobile-nav-toggle-btn"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center cursor-pointer border active:scale-95 ${
            mobileMenuOpen
              ? 'bg-gradient-to-r from-tz-blue to-indigo-600 text-white border-tz-blue shadow-sm shadow-sky-500/25'
              : 'bg-white hover:bg-sky-50 text-tz-blue border-sky-200 dark:bg-slate-800 dark:text-cyan-400 dark:border-slate-700 shadow-2xs'
          }`}
          title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-sm`}></i>
        </button>
      </div>

      {/* MOBILE FULL-SCREEN SLIDE-OVER DRAWER - Clean, Normal & High-Contrast */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-portal-root"
          className="lg:hidden fixed inset-0 z-[100] flex justify-end font-sans"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Semi-Transparent Backdrop */}
          <div
            id="mobile-nav-backdrop"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div
            id="mobile-nav-drawer"
            className="relative z-10 w-full max-w-sm sm:max-w-md h-full bg-slate-50 dark:bg-[#0b0f19] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between shrink-0">
              <div 
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoHome) onGoHome();
                  else setCurrentView(AppView.HOME);
                }}
              >
                <div className="w-9 h-9 bg-gradient-to-tr from-tz-blue via-tz-purple to-tz-yellow rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-sky-500/25">
                  E
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    Education<span className="gradient-text font-black">TZ</span>
                  </div>
                  <div className="text-[10px] text-tz-blue dark:text-cyan-400 font-bold">
                    🇹🇿 Curriculum & Exam Portal
                  </div>
                </div>
              </div>

              {/* Close Button with WCAG Touch Target */}
              <button
                id="mobile-drawer-close-btn"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Quick Night Study Switch inside Drawer */}
            {onToggleDarkMode && (
              <div className="p-3 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
                <button
                  id="mobile-drawer-night-study-btn"
                  type="button"
                  onClick={onToggleDarkMode}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-xs font-bold ${
                    isDarkMode
                      ? 'bg-slate-800 text-amber-300 border-slate-700'
                      : 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'} text-sm`}></i>
                    <span>{isDarkMode ? 'Night Study Mode (Active)' : 'Night Study Mode (Off)'}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold bg-white/70 dark:bg-slate-950/70 border border-indigo-200 dark:border-slate-700">
                    {isDarkMode ? 'High Contrast' : 'Switch'}
                  </span>
                </button>
              </div>
            )}

            {/* Quick Student Metrics Strip */}
            <div className="p-3 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView(AppView.BADGES);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold text-xs cursor-pointer border border-amber-200 dark:border-amber-800/60"
                >
                  <i className="fa-solid fa-fire text-amber-500"></i>
                  <span>{streak}d Streak</span>
                </div>

                <div 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView(AppView.WALLET);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-extrabold text-xs cursor-pointer border border-sky-200 dark:border-sky-800/60"
                >
                  <i className="fa-solid fa-coins text-sky-500"></i>
                  <span>{points} EP</span>
                </div>
              </div>

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="px-3 py-1 rounded-full bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-user text-[10px]"></i>
                  <span>Profile</span>
                </button>
              )}
            </div>

            {/* Quick Destination Shortcut Pills */}
            <div className="p-3 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-2 shrink-0 font-sans">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoHome) onGoHome();
                  else setCurrentView(AppView.HOME);
                }}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer font-bold text-xs ${
                  currentView === AppView.HOME
                    ? 'bg-tz-blue text-white border-tz-blue shadow-sm shadow-sky-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-sky-50'
                }`}
              >
                <i className="fa-solid fa-house text-xs"></i>
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSelectAllSubjects();
                }}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer font-bold text-xs ${
                  currentView === AppView.SYLLABUS
                    ? 'bg-tz-green text-white border-tz-green shadow-sm shadow-emerald-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                }`}
              >
                <i className="fa-solid fa-book-open text-xs"></i>
                <span>Syllabus</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onStartChat) onStartChat();
                  else setCurrentView(AppView.CHAT);
                }}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer font-extrabold text-xs ${
                  currentView === AppView.CHAT
                    ? 'bg-tz-purple text-white border-tz-purple shadow-sm'
                    : 'bg-gradient-to-r from-tz-blue via-indigo-600 to-tz-purple text-white border-transparent shadow-sm shadow-sky-500/25'
                }`}
              >
                <i className="fa-solid fa-wand-magic-sparkles text-xs text-tz-yellow animate-pulse"></i>
                <span>Yun AI</span>
              </button>
            </div>

            {/* Scrollable Drawer Body with Grouped Dropdown Menus */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar font-sans">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                Curriculum & Features
              </div>

              {/* GROUPED ACCORDION DROPDOWN MENUS */}
              {navGroups.map((group) => {
                const isExpanded = !!expandedMobileGroups[group.id];
                const hasActiveItem = isGroupActive(group);

                return (
                  <div 
                    key={group.id} 
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-sky-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]'
                    }`}
                  >
                    {/* Collapsible Dropdown Header Toggle */}
                    <button
                      id={`mobile-group-toggle-${group.id}`}
                      type="button"
                      onClick={() => toggleMobileGroup(group.id)}
                      className="w-full min-h-[46px] p-3 flex items-center justify-between transition cursor-pointer text-left focus:outline-none"
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-group-content-${group.id}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 transition-colors shadow-2xs ${
                          isExpanded 
                            ? group.activeBg 
                            : hasActiveItem
                            ? group.activeSoftBg
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          <i className={`fa-solid ${group.icon}`}></i>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-bold text-xs truncate ${
                              hasActiveItem ? 'text-tz-blue dark:text-cyan-300' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {group.label}
                            </span>
                            {group.badge && (
                              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wide ${group.badgeColor || 'bg-amber-400 text-slate-950 font-black'}`}>
                                {group.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {group.items.length} sections
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {hasActiveItem && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active selection inside"></span>
                        )}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                          isExpanded ? 'bg-sky-50 dark:bg-slate-800 text-tz-blue dark:text-cyan-400 rotate-180' : 'bg-transparent text-slate-400'
                        }`}>
                          <i className="fa-solid fa-chevron-down text-[10px]"></i>
                        </div>
                      </div>
                    </button>

                    {/* Group Items Dropdown Panel */}
                    {isExpanded && (
                      <div
                        id={`mobile-group-content-${group.id}`}
                        className="px-2.5 pb-3 pt-1 space-y-1.5 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150"
                      >
                        {group.items.map((item) => {
                          const isItemActive = item.view === currentView;
                          return (
                            <button
                              key={item.id}
                              id={`mobile-${item.id}`}
                              type="button"
                              onClick={() => handleItemClick(item)}
                              className={`w-full min-h-[42px] p-2.5 rounded-xl text-left flex items-start gap-2.5 transition border cursor-pointer active:scale-[0.99] ${
                                isItemActive
                                  ? `${group.activeBg} font-bold shadow-xs border-transparent`
                                  : 'bg-white dark:bg-slate-850 hover:bg-sky-50/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs ${
                                isItemActive 
                                  ? 'bg-white/20 text-white' 
                                  : item.iconBg || 'bg-sky-500 text-white'
                              }`}>
                                <i className={`fa-solid ${item.icon}`}></i>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-xs font-bold truncate ${
                                    isItemActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                                  }`}>
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                                      isItemActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-sky-100 text-sky-800 border border-sky-200'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.sublabel && (
                                  <p className={`text-[10px] truncate mt-0.5 ${
                                    isItemActive ? 'text-white/80 font-medium' : 'text-slate-500 dark:text-slate-400'
                                  }`}>
                                    {item.sublabel}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ADDITIONAL COMMUNITY & PORTALS GROUP */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMobileGroup('community')}
                  className="w-full min-h-[46px] p-3 flex items-center justify-between transition cursor-pointer text-left"
                  aria-expanded={!!expandedMobileGroups['community']}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs shrink-0">
                      <i className="fa-solid fa-user-shield"></i>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">Portals & Roles</span>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Parents, Student Profile & Admin</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                    expandedMobileGroups['community'] ? 'rotate-180 text-purple-600 dark:text-purple-300' : 'text-slate-400'
                  }`}>
                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                  </div>
                </button>

                {expandedMobileGroups['community'] && (
                  <div className="px-2.5 pb-3 pt-1 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                    {/* Parents Portal */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenParents) onOpenParents();
                        else setCurrentView(AppView.PARENTS);
                      }}
                      className={`w-full min-h-[42px] p-2.5 rounded-xl text-left flex items-start gap-2.5 transition border cursor-pointer ${
                        currentView === AppView.PARENTS
                          ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-850 hover:bg-purple-50/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs mt-0.5 shrink-0">
                        <i className="fa-solid fa-people-roof"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold block">Parent Dashboard</span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Weekly reports & study supervision</p>
                      </div>
                    </button>

                    {/* Student Profile */}
                    {onOpenProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full min-h-[42px] p-2.5 rounded-xl text-left flex items-start gap-2.5 transition border bg-white dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800 cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 flex items-center justify-center text-xs mt-0.5 shrink-0">
                          <i className="fa-solid fa-id-card"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold block">Student Profile & Share</span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Badges, level certificates & stats</p>
                        </div>
                      </button>
                    )}

                    {/* Admin Portal if Admin */}
                    {isAdmin && onOpenAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className={`w-full min-h-[42px] p-2.5 rounded-xl text-left flex items-start gap-2.5 transition border cursor-pointer ${
                          currentView === AppView.ADMIN
                            ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs mt-0.5 shrink-0">
                          <i className="fa-solid fa-lock"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Admin Console</span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">Manage questions & review queues</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Drawer Footer with Offline & Data Saver Toggles */}
            <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between gap-2 shrink-0 font-sans">
              <button
                id="mobile-drawer-data-saver-btn"
                type="button"
                onClick={() => setDataSaver(!dataSaver)}
                className={`min-h-[40px] flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  dataSaver
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
                title="Low-Bandwidth Mode for 3G & Limited Data"
              >
                <i className="fa-solid fa-bolt text-[10px]"></i>
                <span>{dataSaver ? 'Low MB (ON)' : 'Data Saver'}</span>
              </button>

              <button
                id="mobile-drawer-network-btn"
                type="button"
                onClick={() => {
                  onOpenOfflineToast();
                }}
                className={`min-h-[40px] flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  !isOnline
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
                title={!isOnline ? "Offline Mode Active" : "Online"}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${!isOnline ? 'bg-white animate-pulse' : 'bg-emerald-500'}`}></span>
                <span>{!isOnline ? 'Offline' : 'Online'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNavDropdowns;
