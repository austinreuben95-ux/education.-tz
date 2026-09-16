import React, { useState, useRef, useEffect } from 'react';
import { AppView, EducationLevel } from '../types';

export interface NavItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
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

  // Defined grouped navigation menus
  const navGroups: NavGroup[] = [
    {
      id: 'academics',
      label: 'Academics & Study',
      icon: 'fa-book-open-reader',
      items: [
        {
          id: 'nav-syllabus',
          label: 'All Subjects Syllabus',
          sublabel: 'Std 1 to Form 6 full curricula',
          icon: 'fa-layer-group',
          isCustomAction: true,
          action: onSelectAllSubjects,
          view: AppView.SYLLABUS
        },
        {
          id: 'nav-notes',
          label: 'Study Notes & Notebooks',
          sublabel: 'Personal notes, summaries & PDF exports',
          icon: 'fa-note-sticky',
          view: AppView.NOTES
        },
        {
          id: 'nav-videos',
          label: 'Video Classes & Tutorials',
          sublabel: 'Swahili & English YouTube curated lessons',
          icon: 'fa-play',
          badge: 'Videos',
          badgeColor: 'bg-red-100 text-red-700',
          view: AppView.VIDEOS
        },
        {
          id: 'nav-study-room',
          label: 'Shared Study Room',
          sublabel: 'Live discussions, NECTA traps & formulas',
          icon: 'fa-chalkboard-user',
          badge: 'Live',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          view: AppView.STUDY_ROOM
        },
        {
          id: 'nav-planner',
          label: 'Weekly Planner & Music',
          sublabel: 'Study timetable & focus audio tracks',
          icon: 'fa-music',
          view: AppView.PLANNER
        },
        {
          id: 'nav-teachers',
          label: 'Teachers & Tutors Hub',
          sublabel: 'Connect with verified Tanzanian subject teachers',
          icon: 'fa-person-chalkboard',
          view: AppView.TEACHERS
        }
      ]
    },
    {
      id: 'exams',
      label: 'Exams & Assessment',
      icon: 'fa-clipboard-check',
      items: [
        {
          id: 'nav-exams-vault',
          label: 'NECTA Past Papers & Results',
          sublabel: 'National exams, marking schemes & results portal',
          icon: 'fa-square-poll-vertical',
          badge: 'NECTA',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          view: AppView.EXAMS
        },
        {
          id: 'nav-assignments',
          label: 'Assignments & Practice Tests',
          sublabel: 'Homework tasks, speed tests & model answers',
          icon: 'fa-list-check',
          view: AppView.ASSIGNMENTS_TESTS
        },
        {
          id: 'nav-grade-check',
          label: 'NECTA Grade Checker & AVE',
          sublabel: '25, 50 & 100-mark scales, divisions & averages',
          icon: 'fa-check-double',
          badge: '50/100',
          badgeColor: 'bg-blue-100 text-blue-800',
          view: AppView.GRADE_CHECKER
        },
        {
          id: 'nav-calculator',
          label: 'Quick Grade Calculator',
          sublabel: 'Input subject scores for instant totals & averages',
          icon: 'fa-calculator',
          view: AppView.CALCULATOR
        }
      ]
    },
    {
      id: 'guidance',
      label: 'Guidance & Admissions',
      icon: 'fa-graduation-cap',
      badge: 'Hot',
      badgeColor: 'bg-amber-400 text-slate-950',
      items: [
        {
          id: 'nav-news-scholarships',
          label: 'Selection & Scholarships',
          sublabel: 'TAMISEMI Form 1/5 lists, TCU, HESLB & grants',
          icon: 'fa-bullhorn',
          badge: 'TAMISEMI',
          badgeColor: 'bg-amber-100 text-amber-900',
          view: AppView.NEWS_SCHOLARSHIPS
        },
        {
          id: 'nav-predictor',
          label: 'School & University Predictor',
          sublabel: 'Predict cut-offs for Special Schools, Combos & UDSM',
          icon: 'fa-compass-drafting',
          view: AppView.PREDICTOR
        },
        {
          id: 'nav-schools-directory',
          label: 'Schools Directory & Pass Marks',
          sublabel: 'NECTA center codes, regions & minimum cut-offs',
          icon: 'fa-school',
          view: AppView.SCHOOLS
        },
        {
          id: 'nav-alevel-guide',
          label: 'A-Level Combinations Guide',
          sublabel: 'PCM, PCB, EGM, HGL combinations & career paths',
          icon: 'fa-diagram-project',
          view: AppView.ALEVEL_GUIDE
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools & Badges',
      icon: 'fa-toolbox',
      items: [
        {
          id: 'nav-dictionary',
          label: 'Vocabulary & Kamusi',
          sublabel: 'Bilingual Swahili-English dictionary & flashcards',
          icon: 'fa-book-bookmark',
          view: AppView.DICTIONARY
        },
        {
          id: 'nav-badges',
          label: 'Scholar Badges & Streaks',
          sublabel: 'Track milestones, study streaks & earn trophies',
          icon: 'fa-trophy',
          badge: 'Awards',
          badgeColor: 'bg-amber-100 text-amber-800',
          view: AppView.BADGES
        },
        {
          id: 'nav-roadmap',
          label: '150 Innovation Blueprint',
          sublabel: 'Platform strategic roadmap & upcoming features',
          icon: 'fa-rocket',
          badge: '150 Ideas',
          badgeColor: 'bg-purple-100 text-purple-800',
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
      {/* DESKTOP DROPDOWN NAVIGATION BAR */}
      <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
        {navGroups.map((group) => {
          const isOpen = openDropdown === group.id;
          const hasActiveItem = isGroupActive(group);

          return (
            <div key={group.id} className="relative">
              <button
                id={`nav-group-btn-${group.id}`}
                type="button"
                onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isOpen
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500/30'
                    : hasActiveItem
                    ? 'bg-indigo-50 text-indigo-700 font-black border border-indigo-200 hover:bg-indigo-100'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <i className={`fa-solid ${group.icon} text-xs ${isOpen ? 'text-white' : hasActiveItem ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                <span>{group.label}</span>
                {group.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${group.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                    {group.badge}
                  </span>
                )}
                <i className={`fa-solid fa-chevron-down text-[9px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isOpen ? 'text-white' : 'text-gray-400'}`}></i>
              </button>

              {/* DROPDOWN MENU PANEL */}
              {isOpen && (
                <div
                  id={`nav-dropdown-menu-${group.id}`}
                  className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="px-3 py-2 border-b border-gray-100 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <i className={`fa-solid ${group.icon} text-indigo-500`}></i> {group.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{group.items.length} items</span>
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
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition flex items-start gap-3 cursor-pointer group/item ${
                            isItemActive
                              ? 'bg-indigo-50/90 text-indigo-900 font-black border border-indigo-100'
                              : 'hover:bg-slate-50 text-gray-700'
                          }`}
                          role="menuitem"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm transition-all duration-200 ${
                            isItemActive
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 group-hover/item:bg-indigo-100 group-hover/item:text-indigo-600'
                          }`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-extrabold text-xs text-gray-900 group-hover/item:text-indigo-600 transition-colors truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase shrink-0 ${item.badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.sublabel && (
                              <p className="text-[10px] text-gray-400 truncate mt-0.5 font-medium">
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

        {/* UTILITY QUICK TOGGLES IN HEADER */}
        <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-gray-200">
          {/* Low-MB Data Saver Toggle */}
          <button
            id="nav-data-saver-toggle-btn"
            type="button"
            onClick={() => setDataSaver(!dataSaver)}
            className={`px-2.5 py-1.5 rounded-xl font-extrabold text-[11px] border transition flex items-center gap-1.5 cursor-pointer ${
              dataSaver
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse-glow'
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
            title="Low-Bandwidth Mode for 3G & Limited Data"
          >
            <i className="fa-solid fa-bolt text-xs"></i>
            <span className="hidden xl:inline">{dataSaver ? 'Low MB (ON)' : 'Data Saver'}</span>
          </button>

          {/* Network Status Indicator */}
          <button
            id="nav-network-status-btn"
            type="button"
            onClick={onOpenOfflineToast}
            className={`px-2.5 py-1.5 rounded-xl font-extrabold text-[11px] border transition flex items-center gap-1.5 cursor-pointer ${
              !isOnline
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={!isOnline ? "Offline Mode Active - Saved Notes & Core Syllabus Available" : "Online & Connected"}
          >
            <i className={`fa-solid ${!isOnline ? 'fa-wifi-slash' : 'fa-wifi'} text-xs`}></i>
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
          className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border active:scale-95 ${
            mobileMenuOpen
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-600/30'
              : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200 shadow-2xs'
          }`}
          title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-base`}></i>
        </button>
      </div>

      {/* MOBILE FULL-SCREEN SLIDE-OVER DRAWER (Responsive Modal Overlay) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-portal-root"
          className="lg:hidden fixed inset-0 z-[100] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Semi-Transparent Dark Backdrop */}
          <div
            id="mobile-nav-backdrop"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div
            id="mobile-nav-drawer"
            className="relative z-10 w-full max-w-sm sm:max-w-md h-full bg-white flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200 border-l border-gray-100"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 bg-slate-50/90 flex items-center justify-between shrink-0">
              <div 
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoHome) onGoHome();
                  else setCurrentView(AppView.HOME);
                }}
              >
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/30">
                  E
                </div>
                <div>
                  <div className="font-black text-base text-gray-900 leading-tight">
                    Education<span className="text-indigo-600">TZ</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Mobile Navigation
                  </div>
                </div>
              </div>

              {/* Close Button with WCAG Touch Target */}
              <button
                id="mobile-drawer-close-btn"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition active:scale-90 cursor-pointer shadow-2xs"
                aria-label="Close menu"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Quick Student Metrics Strip */}
            <div className="p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-b border-indigo-100/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView(AppView.BADGES);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100/80 text-orange-700 font-black text-xs cursor-pointer border border-orange-200"
                >
                  <i className="fa-solid fa-fire text-orange-500"></i>
                  <span>{streak} Day Streak</span>
                </div>

                <div 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView(AppView.WALLET);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-100/80 text-indigo-700 font-black text-xs cursor-pointer border border-indigo-200"
                >
                  <i className="fa-solid fa-coins text-indigo-500"></i>
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
                  className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white text-indigo-700 font-extrabold text-xs border border-indigo-200 shadow-2xs hover:bg-indigo-50 flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <i className="fa-solid fa-id-card"></i>
                  <span>Profile</span>
                </button>
              )}
            </div>

            {/* Quick Destination Shortcut Pills */}
            <div className="p-3 bg-white border-b border-gray-100 grid grid-cols-3 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoHome) onGoHome();
                  else setCurrentView(AppView.HOME);
                }}
                className={`min-h-[44px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  currentView === AppView.HOME
                    ? 'bg-indigo-600 text-white border-indigo-700 font-black shadow-sm'
                    : 'bg-gray-50 hover:bg-indigo-50 text-gray-700 border-gray-200'
                }`}
              >
                <i className="fa-solid fa-house text-xs"></i>
                <span className="text-[11px] font-extrabold">Home</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSelectAllSubjects();
                }}
                className={`min-h-[44px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  currentView === AppView.SYLLABUS
                    ? 'bg-indigo-600 text-white border-indigo-700 font-black shadow-sm'
                    : 'bg-gray-50 hover:bg-indigo-50 text-gray-700 border-gray-200'
                }`}
              >
                <i className="fa-solid fa-book-open text-xs"></i>
                <span className="text-[11px] font-extrabold">Syllabus</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onStartChat) onStartChat();
                  else setCurrentView(AppView.CHAT);
                }}
                className={`min-h-[44px] p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                  currentView === AppView.CHAT
                    ? 'bg-indigo-600 text-white border-indigo-700 font-black shadow-sm'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}
              >
                <i className="fa-solid fa-wand-magic-sparkles text-xs text-indigo-600"></i>
                <span className="text-[11px] font-black">Ask Yun</span>
              </button>
            </div>

            {/* Scrollable Drawer Body with Grouped Dropdown Menus */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-1">
                Curriculum & Features Directory
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
                        ? 'border-indigo-200 bg-slate-50/50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Collapsible Dropdown Header Toggle */}
                    <button
                      id={`mobile-group-toggle-${group.id}`}
                      type="button"
                      onClick={() => toggleMobileGroup(group.id)}
                      className="w-full min-h-[48px] p-3 flex items-center justify-between transition cursor-pointer text-left focus:outline-none"
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-group-content-${group.id}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-colors ${
                          isExpanded 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : hasActiveItem
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <i className={`fa-solid ${group.icon}`}></i>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-black text-xs truncate ${
                              hasActiveItem ? 'text-indigo-700' : 'text-gray-900'
                            }`}>
                              {group.label}
                            </span>
                            {group.badge && (
                              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase shrink-0 ${group.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                                {group.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {group.items.length} sections
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {hasActiveItem && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Active selection inside"></span>
                        )}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                          isExpanded ? 'bg-indigo-100 text-indigo-700 rotate-180' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <i className="fa-solid fa-chevron-down text-xs"></i>
                        </div>
                      </div>
                    </button>

                    {/* Group Items Dropdown Panel */}
                    {isExpanded && (
                      <div
                        id={`mobile-group-content-${group.id}`}
                        className="px-2.5 pb-3 pt-1 space-y-1.5 border-t border-indigo-100/60 animate-in fade-in slide-in-from-top-1 duration-150"
                      >
                        {group.items.map((item) => {
                          const isItemActive = item.view === currentView;
                          return (
                            <button
                              key={item.id}
                              id={`mobile-${item.id}`}
                              type="button"
                              onClick={() => handleItemClick(item)}
                              className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-start gap-3 transition border cursor-pointer active:scale-[0.99] ${
                                isItemActive
                                  ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-md shadow-indigo-600/20'
                                  : 'bg-white hover:bg-indigo-50/80 text-gray-800 border-gray-100 hover:border-indigo-100'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm mt-0.5 ${
                                isItemActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                              }`}>
                                <i className={`fa-solid ${item.icon}`}></i>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-xs font-black truncate ${
                                    isItemActive ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 ${
                                      isItemActive ? 'bg-white/30 text-white' : item.badgeColor || 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.sublabel && (
                                  <p className={`text-[10px] truncate mt-0.5 ${
                                    isItemActive ? 'text-indigo-100 font-medium' : 'text-gray-500'
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
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMobileGroup('community')}
                  className="w-full min-h-[48px] p-3 flex items-center justify-between transition cursor-pointer text-left"
                  aria-expanded={!!expandedMobileGroups['community']}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm shrink-0">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <div>
                      <span className="font-black text-xs text-gray-900">Portals & Community</span>
                      <p className="text-[10px] text-gray-400 font-semibold">Parents, Admin & Rewards</p>
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                    expandedMobileGroups['community'] ? 'bg-purple-100 text-purple-700 rotate-180' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </button>

                {expandedMobileGroups['community'] && (
                  <div className="px-2.5 pb-3 pt-1 space-y-1.5 border-t border-purple-100/60 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* Parents Portal */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenParents) onOpenParents();
                        else setCurrentView(AppView.PARENTS);
                      }}
                      className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-start gap-3 transition border cursor-pointer ${
                        currentView === AppView.PARENTS
                          ? 'bg-purple-700 text-white border-purple-800 font-bold'
                          : 'bg-purple-50/50 hover:bg-purple-100/60 text-gray-800 border-purple-100'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-200/80 text-purple-800 flex items-center justify-center text-sm mt-0.5 shrink-0">
                        <i className="fa-solid fa-user-shield"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-black block">Parent Dashboard</span>
                        <p className="text-[10px] text-purple-900/70 truncate">Student report cards & progress tracking</p>
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
                        className="w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-start gap-3 transition border bg-indigo-50/50 hover:bg-indigo-100/60 text-gray-800 border-indigo-100 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-200/80 text-indigo-800 flex items-center justify-center text-sm mt-0.5 shrink-0">
                          <i className="fa-solid fa-id-card"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-black block">Student Profile & Share</span>
                          <p className="text-[10px] text-indigo-900/70 truncate">Custom certificate, level badges & stats</p>
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
                        className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-start gap-3 transition border cursor-pointer ${
                          currentView === AppView.ADMIN
                            ? 'bg-red-600 text-white border-red-700 font-bold'
                            : 'bg-red-50/50 hover:bg-red-100/60 text-gray-800 border-red-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-200/80 text-red-800 flex items-center justify-center text-sm mt-0.5 shrink-0">
                          <i className="fa-solid fa-lock"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-black block text-red-700">Administrator Console</span>
                          <p className="text-[10px] text-red-600/80 truncate">Manage collaborators & questions</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Drawer Footer with Offline & Data Saver Toggles */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/95 flex items-center justify-between gap-2 shrink-0">
              <button
                id="mobile-drawer-data-saver-btn"
                type="button"
                onClick={() => setDataSaver(!dataSaver)}
                className={`min-h-[44px] flex-1 py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                  dataSaver
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
                title="Low-Bandwidth Mode for 3G & Limited Data"
              >
                <i className="fa-solid fa-bolt text-xs"></i>
                <span>{dataSaver ? 'Data Saver: ON' : 'Data Saver'}</span>
              </button>

              <button
                id="mobile-drawer-network-btn"
                type="button"
                onClick={() => {
                  onOpenOfflineToast();
                }}
                className={`min-h-[44px] flex-1 py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                  !isOnline
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
                title={!isOnline ? "Offline Mode Active" : "Online"}
              >
                <i className={`fa-solid ${!isOnline ? 'fa-wifi-slash' : 'fa-wifi'} text-xs`}></i>
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
