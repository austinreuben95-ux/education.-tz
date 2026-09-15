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
  setMobileMenuOpen
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

      {/* MOBILE / TABLET HAMBURGER BUTTON */}
      <div className="lg:hidden flex items-center gap-1">
        <button
          id="mobile-nav-toggle-btn"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-xl transition flex items-center justify-center cursor-pointer border ${
            mobileMenuOpen
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
          }`}
          title="Open Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`}></i>
        </button>
      </div>

      {/* MOBILE FULL-HEIGHT SLIDE-OUT / POP-OVER DRAWER */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl p-4 max-h-[calc(100vh-4rem)] overflow-y-auto z-50 space-y-4"
        >
          {/* Quick status bar */}
          <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-700">
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold flex items-center gap-1.5 ${
                dataSaver ? 'bg-amber-500 text-white border-amber-600' : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <i className="fa-solid fa-bolt"></i>
              <span>{dataSaver ? 'Data Saver: ON' : 'Data Saver: OFF'}</span>
            </button>

            <button
              onClick={onOpenOfflineToast}
              className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold flex items-center gap-1.5 ${
                !isOnline ? 'bg-amber-500 text-white border-amber-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <i className={`fa-solid ${!isOnline ? 'fa-wifi-slash' : 'fa-wifi'}`}></i>
              <span>{!isOnline ? 'Offline Mode' : 'Online'}</span>
            </button>
          </div>

          {/* Grouped Accordions in Mobile Menu */}
          <div className="space-y-3">
            {navGroups.map((group) => {
              const hasActiveItem = isGroupActive(group);
              return (
                <div key={group.id} className="bg-slate-50/80 rounded-2xl p-3 border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                      <i className={`fa-solid ${group.icon} text-indigo-600`}></i> {group.label}
                    </span>
                    {group.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${group.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                        {group.badge}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {group.items.map((item) => {
                      const isItemActive = item.view === currentView;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemClick(item)}
                          className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition border ${
                            isItemActive
                              ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-sm'
                              : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200/70'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                            isItemActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold truncate">{item.label}</span>
                              {item.badge && (
                                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                                  isItemActive ? 'bg-white/30 text-white' : item.badgeColor || 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNavDropdowns;
