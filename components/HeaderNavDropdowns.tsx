import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AppView } from '../types';

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
  spotlight?: {
    title: string;
    description: string;
    ctaText?: string;
    ctaAction?: () => void;
    icon: string;
    gradient: string;
  };
  items: NavItem[];
}

export interface HeaderNavDropdownsProps {
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
  onOpenSearch?: () => void;
  onOpenFormulaVault?: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
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
  onOpenSearch,
  onOpenFormulaVault,
  isZenMode = false,
  onToggleZenMode,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerDropdownRef = useRef<HTMLDivElement>(null);

  // --- Pomodoro Study Focus Timer State & Audio ---
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState<'25' | '5' | '50'>('25');
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [timerAudioEnabled, setTimerAudioEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Play Web Audio Chime on Session Complete
  const playTimerAlert = () => {
    if (!timerAudioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // AudioContext may be restricted before user interaction
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setFocusSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playTimerAlert();
            setCompletedSessions((c) => c + 1);
            return timerPreset === '5' ? 25 * 60 : 5 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerPreset, timerAudioEnabled]);

  const handleSelectPreset = (preset: '25' | '5' | '50') => {
    setTimerPreset(preset);
    setIsTimerRunning(false);
    if (preset === '25') setFocusSeconds(25 * 60);
    else if (preset === '5') setFocusSeconds(5 * 60);
    else if (preset === '50') setFocusSeconds(50 * 60);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    if (timerPreset === '25') setFocusSeconds(25 * 60);
    else if (presetMatch(timerPreset, '5')) setFocusSeconds(5 * 60);
    else if (presetMatch(timerPreset, '50')) setFocusSeconds(50 * 60);
  };

  const presetMatch = (preset: string, val: string) => preset === val;

  const formatTimerDisplay = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Track expanded accordion dropdowns in mobile menu - expanded by default so all list items are immediately visible
  const [expandedMobileGroups, setExpandedMobileGroups] = useState<Record<string, boolean>>({
    students: true,
    academic: true,
    necta: true,
    schools: true,
    reports: true,
    more: true,
  });

  const toggleAllMobileGroups = (expand: boolean) => {
    setExpandedMobileGroups({
      students: expand,
      academic: expand,
      necta: expand,
      schools: expand,
      reports: expand,
      more: expand,
    });
  };

  // Prevent background body scroll and handle Escape key when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen && typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  // Close desktop dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
      if (timerDropdownRef.current && !timerDropdownRef.current.contains(event.target as Node)) {
        setShowTimerMenu(false);
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
        setShowTimerMenu(false);
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

  // --- SaaS-Style Information Architecture Navigation Groups ---
  const navGroups: NavGroup[] = [
    {
      id: 'students',
      label: 'Students',
      icon: 'fa-user-graduate',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      activeBg: 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25',
      activeSoftBg: 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 dark:bg-slate-800 dark:text-indigo-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-indigo-300 dark:hover:bg-slate-800/80',
      spotlight: {
        title: 'Yun AI Study Assistant',
        description: 'Ask questions in Swahili or English, get step-by-step problem breakdowns, and test your knowledge.',
        ctaText: 'Chat with Yun AI',
        ctaAction: onStartChat,
        icon: 'fa-wand-magic-sparkles',
        gradient: 'from-indigo-600 to-tz-blue',
      },
      items: [
        {
          id: 'nav-notes',
          label: 'Study Notes & Notebooks',
          sublabel: 'Personal summaries, revision notes & PDF downloads',
          icon: 'fa-note-sticky',
          iconBg: 'bg-amber-500 text-white',
          view: AppView.NOTES,
        },
        {
          id: 'nav-planner',
          label: 'Weekly Planner & Focus Audio',
          sublabel: 'Study timetable, schedule tracker & ambient audio',
          icon: 'fa-calendar-week',
          iconBg: 'bg-purple-500 text-white',
          view: AppView.PLANNER,
        },
        {
          id: 'nav-study-room',
          label: 'Shared Study Room',
          sublabel: 'Live discussions, NECTA traps & formulas',
          icon: 'fa-chalkboard-user',
          iconBg: 'bg-emerald-500 text-white',
          badge: 'Live',
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          view: AppView.STUDY_ROOM,
        },
        {
          id: 'nav-dictionary',
          label: 'Vocabulary & Kamusi',
          sublabel: 'Bilingual Swahili-English dictionary & flashcards',
          icon: 'fa-book-bookmark',
          iconBg: 'bg-pink-500 text-white',
          view: AppView.DICTIONARY,
        },
        {
          id: 'nav-badges',
          label: 'Scholar Badges & Streaks',
          sublabel: 'Track milestones, daily study streaks & earn trophies',
          icon: 'fa-trophy',
          iconBg: 'bg-amber-500 text-white',
          badge: 'XP',
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200',
          view: AppView.BADGES,
        },
        {
          id: 'nav-wallet',
          label: 'Study Wallet & Credits',
          sublabel: 'Educational points, balances & rewards swap',
          icon: 'fa-wallet',
          iconBg: 'bg-sky-500 text-white',
          view: AppView.WALLET,
        },
        {
          id: 'nav-profile',
          label: 'Student Profile & Mastery',
          sublabel: 'View learner progress, achievements & share card',
          icon: 'fa-id-badge',
          iconBg: 'bg-indigo-500 text-white',
          isCustomAction: true,
          action: onOpenProfile,
        },
      ],
    },
    {
      id: 'academic',
      label: 'Academic',
      icon: 'fa-book-open-reader',
      iconColor: 'text-sky-600 dark:text-sky-400',
      activeBg: 'bg-sky-600 text-white shadow-sm shadow-sky-500/25',
      activeSoftBg: 'bg-sky-50 text-sky-700 font-bold border border-sky-200 dark:bg-slate-800 dark:text-sky-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-sky-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-sky-300 dark:hover:bg-slate-800/80',
      badge: 'Std 1 - Form 6',
      badgeColor: 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
      spotlight: {
        title: '450+ Syllabus Topics',
        description: 'Comprehensive curriculum mapped from Primary Standard 1 up to Advanced Level Form 6 with video tutorials.',
        ctaText: 'Browse All Subjects',
        ctaAction: onSelectAllSubjects,
        icon: 'fa-layer-group',
        gradient: 'from-sky-600 to-indigo-600',
      },
      items: [
        {
          id: 'nav-syllabus',
          label: 'All Subjects Syllabus',
          sublabel: 'Std 1 to Form 6 full curricula with topics & objectives',
          icon: 'fa-layer-group',
          iconBg: 'bg-sky-500 text-white',
          isCustomAction: true,
          action: onSelectAllSubjects,
          view: AppView.SYLLABUS,
        },
        {
          id: 'nav-videos',
          label: 'Video Classes & Tutorials',
          sublabel: 'Curated Swahili & English lessons by top teachers',
          icon: 'fa-circle-play',
          iconBg: 'bg-rose-500 text-white',
          badge: 'Videos',
          badgeColor: 'bg-rose-100 text-rose-700 border border-rose-200',
          view: AppView.VIDEOS,
        },
        {
          id: 'nav-teachers',
          label: 'Teachers & Tutors Hub',
          sublabel: 'Connect with verified Tanzanian subject mentors',
          icon: 'fa-person-chalkboard',
          iconBg: 'bg-teal-500 text-white',
          view: AppView.TEACHERS,
        },
        {
          id: 'nav-alevel-guide',
          label: 'A-Level Combinations Guide',
          sublabel: 'PCM, PCB, EGM, HGL combinations & career paths',
          icon: 'fa-diagram-project',
          iconBg: 'bg-indigo-500 text-white',
          badge: 'Combinations',
          badgeColor: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
          view: AppView.ALEVEL_GUIDE,
        },
        {
          id: 'nav-formula-vault',
          label: 'Formula & Flashcard Vault',
          sublabel: 'Physics, Chem, Math formulas & memory flashcards',
          icon: 'fa-atom',
          iconBg: 'bg-violet-500 text-white',
          isCustomAction: true,
          action: onOpenFormulaVault,
        },
        {
          id: 'nav-curriculum-search',
          label: 'Curriculum Search (Ctrl+K)',
          sublabel: 'Quick keyword search across all subjects & topics',
          icon: 'fa-magnifying-glass',
          iconBg: 'bg-blue-500 text-white',
          isCustomAction: true,
          action: onOpenSearch,
        },
      ],
    },
    {
      id: 'necta',
      label: 'NECTA',
      icon: 'fa-award',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      activeBg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25',
      activeSoftBg: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 dark:bg-slate-800 dark:text-emerald-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-emerald-300 dark:hover:bg-slate-800/80',
      badge: 'Exams',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold',
      spotlight: {
        title: 'National Examinations Engine',
        description: 'Access past papers, verify division points, and compute subject averages with the 50/100 scales.',
        ctaText: 'Open Past Papers',
        ctaAction: () => setCurrentView(AppView.EXAMS),
        icon: 'fa-square-poll-vertical',
        gradient: 'from-emerald-600 to-teal-700',
      },
      items: [
        {
          id: 'nav-exams',
          label: 'Past Papers & Results Portal',
          sublabel: 'PSLE, CSEE & ACSEE past papers & marking schemes',
          icon: 'fa-square-poll-vertical',
          iconBg: 'bg-emerald-500 text-white',
          badge: 'NECTA',
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-black',
          view: AppView.EXAMS,
        },
        {
          id: 'nav-assignments',
          label: 'Assignments & Practice Tests',
          sublabel: 'Homework tasks, speed mock tests & model answers',
          icon: 'fa-list-check',
          iconBg: 'bg-blue-500 text-white',
          view: AppView.ASSIGNMENTS_TESTS,
        },
        {
          id: 'nav-grade-checker',
          label: 'NECTA Grade Checker & AVE',
          sublabel: '25, 50 & 100-mark scales, divisions & averages',
          icon: 'fa-check-double',
          iconBg: 'bg-cyan-500 text-white',
          badge: '50/100 Scale',
          badgeColor: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
          view: AppView.GRADE_CHECKER,
        },
        {
          id: 'nav-calculator',
          label: 'Quick Grade Calculator',
          sublabel: 'Instant subject totals, percentages & division estimator',
          icon: 'fa-calculator',
          iconBg: 'bg-violet-500 text-white',
          view: AppView.CALCULATOR,
        },
      ],
    },
    {
      id: 'schools',
      label: 'School Management',
      icon: 'fa-school',
      iconColor: 'text-amber-600 dark:text-amber-400',
      activeBg: 'bg-amber-600 text-white shadow-sm shadow-amber-500/25',
      activeSoftBg: 'bg-amber-50 text-amber-800 font-bold border border-amber-200 dark:bg-slate-800 dark:text-amber-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-amber-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-amber-300 dark:hover:bg-slate-800/80',
      badge: 'Admissions',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200 font-bold',
      spotlight: {
        title: 'Tanzania School Directory',
        description: 'Explore over 5,000 schools across all regions, compare pass rates, and verify admission cut-offs.',
        ctaText: 'Search Directory',
        ctaAction: () => setCurrentView(AppView.SCHOOLS),
        icon: 'fa-school',
        gradient: 'from-amber-600 to-orange-600',
      },
      items: [
        {
          id: 'nav-schools-directory',
          label: 'Schools Directory & Pass Marks',
          sublabel: 'NECTA center codes, regions & minimum cut-offs',
          icon: 'fa-school',
          iconBg: 'bg-blue-500 text-white',
          badge: 'Directory',
          badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200',
          view: AppView.SCHOOLS,
        },
        {
          id: 'nav-predictor',
          label: 'School & University Predictor',
          sublabel: 'Predict cut-offs for Special Schools, Combos & UDSM',
          icon: 'fa-compass-drafting',
          iconBg: 'bg-fuchsia-500 text-white',
          badge: 'AI Predictor',
          badgeColor: 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200',
          view: AppView.PREDICTOR,
        },
        {
          id: 'nav-scholarships',
          label: 'Selection & Scholarships',
          sublabel: 'TAMISEMI Form 1/5 lists, TCU, HESLB loans & grants',
          icon: 'fa-bullhorn',
          iconBg: 'bg-amber-500 text-white',
          badge: 'TAMISEMI',
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200 font-bold',
          view: AppView.NEWS_SCHOLARSHIPS,
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'fa-chart-pie',
      iconColor: 'text-purple-600 dark:text-purple-400',
      activeBg: 'bg-purple-600 text-white shadow-sm shadow-purple-500/25',
      activeSoftBg: 'bg-purple-50 text-purple-700 font-bold border border-purple-200 dark:bg-slate-800 dark:text-purple-300 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-purple-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-purple-300 dark:hover:bg-slate-800/80',
      spotlight: {
        title: 'Guardian & Parent Dashboard',
        description: 'Supervise weekly study trends, topic completion rates, and manage academic report cards.',
        ctaText: 'Open Parent Dashboard',
        ctaAction: onOpenParents || (() => setCurrentView(AppView.PARENTS)),
        icon: 'fa-people-roof',
        gradient: 'from-purple-600 to-indigo-700',
      },
      items: [
        {
          id: 'nav-parents',
          label: 'Parent & Guardian Dashboard',
          sublabel: 'Weekly study trends, attendance & report cards',
          icon: 'fa-people-roof',
          iconBg: 'bg-purple-500 text-white',
          badge: 'Parent',
          badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200 font-bold',
          isCustomAction: true,
          action: onOpenParents || (() => setCurrentView(AppView.PARENTS)),
          view: AppView.PARENTS,
        },
        {
          id: 'nav-progress-analytics',
          label: 'Study Progress & Milestones',
          sublabel: 'Topic mastery analytics, quiz scores & achievements',
          icon: 'fa-chart-line',
          iconBg: 'bg-emerald-500 text-white',
          view: AppView.BADGES,
        },
        {
          id: 'nav-admin',
          label: 'Collaborators & Admin Console',
          sublabel: 'Role-based platform management & verification queues',
          icon: 'fa-lock',
          iconBg: 'bg-slate-700 text-white',
          badge: 'Admin',
          badgeColor: 'bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200',
          isCustomAction: true,
          action: onOpenAdmin || (() => setCurrentView(AppView.ADMIN)),
          view: AppView.ADMIN,
        },
      ],
    },
    {
      id: 'more',
      label: 'More',
      icon: 'fa-ellipsis',
      iconColor: 'text-slate-600 dark:text-slate-400',
      activeBg: 'bg-slate-800 text-white shadow-sm',
      activeSoftBg: 'bg-slate-100 text-slate-800 font-bold border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
      hoverSoft: 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-800/80',
      items: [
        {
          id: 'nav-roadmap',
          label: '150 Innovation Blueprint',
          sublabel: 'Platform strategic roadmap & upcoming feature releases',
          icon: 'fa-rocket',
          iconBg: 'bg-purple-500 text-white',
          badge: '150 Ideas',
          badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200 font-bold',
          isCustomAction: true,
          action: onOpenRoadmap,
          view: AppView.ROADMAP,
        },
        {
          id: 'nav-pomodoro-timer',
          label: 'Focus Pomodoro Timer',
          sublabel: 'Toggle 25/50-min study intervals with audio chime',
          icon: 'fa-stopwatch',
          iconBg: 'bg-rose-500 text-white',
          isCustomAction: true,
          action: () => setShowTimerMenu((prev) => !prev),
        },
        {
          id: 'nav-data-saver',
          label: 'Data Saver Mode',
          sublabel: dataSaver ? 'Enabled (Low 3G bandwidth mode)' : 'Standard high-res media mode',
          icon: 'fa-bolt',
          iconBg: 'bg-amber-500 text-white',
          badge: dataSaver ? 'Active' : 'Off',
          badgeColor: dataSaver ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-100 text-slate-600',
          isCustomAction: true,
          action: () => setDataSaver(!dataSaver),
        },
        {
          id: 'nav-offline-status',
          label: 'Offline Mode & Cache',
          sublabel: isOnline ? 'Connected to online servers' : 'Offline Mode (Local Cached Storage)',
          icon: 'fa-wifi',
          iconBg: isOnline ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white',
          badge: isOnline ? 'Online' : 'Offline',
          badgeColor: isOnline ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-400 text-slate-950 font-black',
          isCustomAction: true,
          action: onOpenOfflineToast,
        },
      ],
    },
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
    return group.items.some((item) => item.view === currentView);
  };

  const toggleMobileGroup = (groupId: string) => {
    setExpandedMobileGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Automatically expand active view group when mobile drawer opens
  useEffect(() => {
    if (mobileMenuOpen) {
      const activeGroup = navGroups.find((g) => isGroupActive(g));
      if (activeGroup) {
        setExpandedMobileGroups((prev) => ({ ...prev, [activeGroup.id]: true }));
      }
    }
  }, [mobileMenuOpen, currentView]);

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-2">
      {/* ========================================================================= */}
      {/* DESKTOP SAAS NAVIGATION BAR (Hidden on Mobile/Tablet < lg)                 */}
      {/* ========================================================================= */}
      <nav className="hidden lg:flex items-center gap-1 font-sans" aria-label="Main Navigation">
        {/* 1. DIRECT "HOME" LINK */}
        <button
          id="nav-home-btn"
          type="button"
          onClick={() => {
            setOpenDropdown(null);
            if (onGoHome) onGoHome();
            else setCurrentView(AppView.HOME);
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            currentView === AppView.HOME || currentView === AppView.LEVEL_SELECT
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/25'
              : 'text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <i className="fa-solid fa-house text-xs"></i>
          <span>Home</span>
        </button>

        {/* 2. GROUPED DROPDOWN / MEGA-MENUS (Students, Academic, NECTA, Schools, Reports, More) */}
        {navGroups.map((group) => {
          const isOpen = openDropdown === group.id;
          const hasActiveItem = isGroupActive(group);
          const isMegaMenu = group.id === 'students' || group.id === 'academic' || group.id === 'necta' || group.id === 'schools';

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
                <span>{group.label}</span>
                {group.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wide ${
                      isOpen
                        ? 'bg-white/20 text-white'
                        : group.badgeColor || 'bg-amber-400 text-slate-950 font-black'
                    }`}
                  >
                    {group.badge}
                  </span>
                )}
                <i
                  className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                ></i>
              </button>

              {/* FLOATING DROPDOWN / MEGA-MENU PANEL */}
              {isOpen && (
                <div
                  id={`nav-dropdown-menu-${group.id}`}
                  className={`absolute left-0 mt-2 bg-white/98 dark:bg-[#0f172a]/98 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-950/15 dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 ${
                    isMegaMenu ? 'w-[580px] xl:w-[640px]' : 'w-72 sm:w-80'
                  }`}
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* Mega-menu layout with items on left and spotlight card on right */}
                  {isMegaMenu && group.spotlight ? (
                    <div className="grid grid-cols-12 gap-3">
                      {/* Left: 2-Column List of Items */}
                      <div className="col-span-8 space-y-1">
                        <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {group.label} Navigation
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                            {group.items.length} options
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                          {group.items.map((item) => {
                            const isItemActive = item.view === currentView;
                            return (
                              <button
                                key={item.id}
                                id={item.id}
                                type="button"
                                onClick={() => handleItemClick(item)}
                                className={`w-full text-left p-2 rounded-xl transition-all duration-150 flex items-start gap-2.5 cursor-pointer group/item ${
                                  isItemActive
                                    ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 font-bold border border-sky-200 dark:border-slate-700'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                                }`}
                                role="menuitem"
                              >
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs transition-all shadow-2xs mt-0.5 ${
                                    isItemActive
                                      ? item.iconBg || 'bg-sky-500 text-white'
                                      : `${item.iconBg || 'bg-sky-500 text-white'} group-hover/item:scale-105`
                                  }`}
                                >
                                  <i className={`fa-solid ${item.icon}`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover/item:text-sky-600 dark:group-hover/item:text-cyan-300 truncate">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wide shrink-0 ${
                                          item.badgeColor || 'bg-sky-100 text-sky-800 border border-sky-200'
                                        }`}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  {item.sublabel && (
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium leading-tight">
                                      {item.sublabel}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Spotlight Card */}
                      <div className="col-span-4 flex flex-col justify-between p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border border-slate-800 relative overflow-hidden">
                        <div className="relative z-10 space-y-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${group.spotlight.gradient} flex items-center justify-center text-white text-sm shadow-md`}>
                            <i className={`fa-solid ${group.spotlight.icon}`}></i>
                          </div>
                          <h4 className="font-black text-xs text-white leading-snug">
                            {group.spotlight.title}
                          </h4>
                          <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                            {group.spotlight.description}
                          </p>
                        </div>

                        {group.spotlight.ctaText && group.spotlight.ctaAction && (
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdown(null);
                              group.spotlight?.ctaAction?.();
                            }}
                            className="mt-3 relative z-10 w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white font-extrabold text-[11px] border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{group.spotlight.ctaText}</span>
                            <i className="fa-solid fa-arrow-right text-[10px]"></i>
                          </button>
                        )}

                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none"></div>
                      </div>
                    </div>
                  ) : (
                    /* Standard 1-Column Dropdown (Reports, More) */
                    <div>
                      <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {group.label}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                          {group.items.length} items
                        </span>
                      </div>

                      <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
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
                                  ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 font-bold border border-sky-200 dark:border-slate-700'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                              }`}
                              role="menuitem"
                            >
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs transition-all shadow-2xs mt-0.5 ${
                                  isItemActive
                                    ? item.iconBg || 'bg-sky-500 text-white'
                                    : `${item.iconBg || 'bg-sky-500 text-white'} group-hover/item:scale-105`
                                }`}
                              >
                                <i className={`fa-solid ${item.icon}`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover/item:text-sky-600 dark:group-hover/item:text-cyan-300 truncate">
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wide shrink-0 ${
                                        item.badgeColor || 'bg-sky-100 text-sky-800 border border-sky-200'
                                      }`}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.sublabel && (
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium leading-tight">
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
              )}
            </div>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* DESKTOP RIGHT UTILITY SECTION (Search, Timer, Stats, Dark Mode, Profile)   */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 font-sans">
        {/* 1. Quick Curriculum Search Shortcut (Ctrl+K) */}
        {onOpenSearch && (
          <button
            id="nav-search-btn"
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
            title="Search subjects, topics & formulas (Ctrl+K)"
          >
            <i className="fa-solid fa-magnifying-glass text-[11px] text-slate-400"></i>
            <span className="hidden xl:inline text-[11px]">Search</span>
            <kbd className="text-[9px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-600 dark:text-slate-400">
              ⌘K
            </kbd>
          </button>
        )}

        {/* 2. Interactive Pomodoro Study Timer Mini Pill */}
        <div ref={timerDropdownRef} className="relative">
          <div className="flex items-center rounded-full bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setIsTimerRunning((r) => !r)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer ${
                isTimerRunning
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200'
              }`}
              title={isTimerRunning ? 'Pause Focus Timer' : 'Start Focus Timer'}
            >
              <i className={`fa-solid ${isTimerRunning ? 'fa-pause' : 'fa-play'} text-[9px]`}></i>
            </button>
            <button
              type="button"
              onClick={() => setShowTimerMenu((prev) => !prev)}
              className="px-2 font-mono font-bold text-rose-800 dark:text-rose-300 text-[11px] hover:underline cursor-pointer"
              title="Click to adjust focus intervals"
            >
              {formatTimerDisplay(focusSeconds)}
            </button>
          </div>

          {/* Pomodoro Timer Popover Menu */}
          {showTimerMenu && (
            <div className="absolute right-0 mt-2 w-56 p-3 rounded-2xl bg-white dark:bg-[#0f172a] shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Focus Timer
                </span>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  {completedSessions} sessions done
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                {(['25', '5', '50'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                      timerPreset === p
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50'
                    }`}
                  >
                    {p}m {p === '5' ? 'Break' : 'Focus'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold transition"
                >
                  <i className="fa-solid fa-rotate-left mr-1"></i> Reset
                </button>
                <button
                  type="button"
                  onClick={() => setTimerAudioEnabled(!timerAudioEnabled)}
                  className={`font-bold transition ${
                    timerAudioEnabled ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                  title="Toggle chime alert"
                >
                  <i className={`fa-solid ${timerAudioEnabled ? 'fa-bell' : 'fa-bell-slash'} mr-1`}></i>
                  {timerAudioEnabled ? 'Chime On' : 'Muted'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Global Study Streak & EP Wallet Pill */}
        <div className="flex items-center gap-1.5">
          <div
            onClick={() => setCurrentView(AppView.BADGES)}
            className="cursor-pointer flex items-center gap-1 text-amber-800 dark:text-amber-300 font-bold text-xs bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 transition shadow-2xs"
            title="Study Streak - Click to view Badges"
          >
            <i className="fa-solid fa-fire text-amber-500 text-xs"></i>
            <span>{streak}d</span>
          </div>

          <div
            onClick={() => setCurrentView(AppView.WALLET)}
            className="cursor-pointer flex items-center gap-1 text-sky-800 dark:text-sky-300 font-bold text-xs bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800/60 transition shadow-2xs"
            title="Educational Points - Click to view Wallet"
          >
            <i className="fa-solid fa-coins text-sky-500 text-xs"></i>
            <span>{points} EP</span>
          </div>
        </div>

        {/* 4. Night Study (Dark Mode) Toggle */}
        {onToggleDarkMode && (
          <button
            id="nav-night-study-toggle-btn"
            type="button"
            onClick={onToggleDarkMode}
            className={`w-8 h-8 rounded-full border transition-all duration-150 flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-indigo-600 border-slate-200'
            }`}
            title={isDarkMode ? 'Switch to Day Mode' : 'Switch to High-Contrast Night Study Mode'}
            aria-label="Toggle Night Study Mode"
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'} text-xs`}></i>
          </button>
        )}

        {/* 5. Student Profile Button */}
        {onOpenProfile && (
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-xs transition active:scale-95 cursor-pointer shadow-2xs"
            title="Student Profile & Progress"
          >
            <i className="fa-solid fa-user text-[11px] text-slate-600 dark:text-slate-300"></i>
          </button>
        )}

        {/* 6. Ask Yun AI Tutor Button */}
        {onStartChat && (
          <button
            type="button"
            onClick={onStartChat}
            className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white px-3.5 py-1.5 rounded-full font-bold text-xs shadow-sm shadow-sky-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            title="Ask Yun AI Tutor"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-amber-300 text-xs animate-pulse"></i>
            <span>Yun AI</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET HAMBURGER BUTTON (< lg)                                   */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex items-center gap-1.5">
        {/* Search quick button for mobile */}
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95"
            title="Search Curriculum"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-xs"></i>
          </button>
        )}

        {/* Mobile Hamburger Trigger */}
        <button
          id="mobile-nav-toggle-btn"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center cursor-pointer border active:scale-95 ${
            mobileMenuOpen
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 shadow-2xs'
          }`}
          title={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-sm`}></i>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FULL-SCREEN SLIDE-OVER DRAWER (SaaS Responsive Menu via Portal)    */}
      {/* ========================================================================= */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div
          id="mobile-nav-portal-root"
          className="lg:hidden fixed inset-0 z-[99999] flex justify-end font-sans"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Semi-Transparent Backdrop */}
          <div
            id="mobile-nav-backdrop"
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div
            id="mobile-nav-drawer"
            className="relative z-10 w-full max-w-sm sm:max-w-md h-[100dvh] max-h-[100dvh] bg-slate-50 dark:bg-[#0b0f19] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
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
                <div className="w-9 h-9 bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-sky-500/25">
                  E
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    Education<span className="text-sky-600 font-black">TZ</span>
                  </div>
                  <div className="text-[10px] text-sky-600 dark:text-cyan-400 font-bold">
                    🇹🇿 Tanzanian Education Portal
                  </div>
                </div>
              </div>

              {/* Close Button with High-Contrast Touch Target */}
              <button
                id="mobile-drawer-close-btn"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[36px] min-h-[36px] w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center transition cursor-pointer active:scale-95"
                aria-label="Close navigation menu"
                title="Close navigation menu"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            {/* Quick Metrics & User Strip */}
            <div className="p-3 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0 font-sans">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView(AppView.BADGES);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold text-xs cursor-pointer border border-amber-200 dark:border-amber-800/60 active:scale-95"
                  title="Daily Streak - View Scholar Badges"
                  aria-label={`${streak} days streak. View Badges.`}
                >
                  <i className="fa-solid fa-fire text-amber-500" aria-hidden="true"></i>
                  <span>{streak}d Streak</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView(AppView.WALLET);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-extrabold text-xs cursor-pointer border border-sky-200 dark:border-sky-800/60 active:scale-95"
                  title="Education Points - View Study Wallet"
                  aria-label={`${points} Education Points. View Wallet.`}
                >
                  <i className="fa-solid fa-coins text-sky-500" aria-hidden="true"></i>
                  <span>{points} EP</span>
                </button>
              </div>

              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="px-3 py-1 rounded-full bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  aria-label="Open student profile"
                >
                  <i className="fa-solid fa-user text-[10px]" aria-hidden="true"></i>
                  <span>Profile</span>
                </button>
              )}
            </div>

            {/* Search Input Bar in Drawer */}
            {onOpenSearch && (
              <div className="p-3 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-magnifying-glass text-xs text-slate-400"></i>
                    <span>Search subjects, topics, formulas...</span>
                  </div>
                  <kbd className="text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                    ⌘K
                  </kbd>
                </button>
              </div>
            )}

            {/* Quick Top Destination Shortcut Pills */}
            <nav aria-label="Quick Destinations" className="p-3 bg-white dark:bg-[#0f172a] border-b border-slate-200/80 dark:border-slate-800 shrink-0 font-sans">
              <ul className="grid grid-cols-4 gap-1.5 list-none m-0 p-0" role="list">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onGoHome) onGoHome();
                      else setCurrentView(AppView.HOME);
                    }}
                    className={`w-full min-h-[38px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition cursor-pointer font-bold text-[11px] ${
                      currentView === AppView.HOME || currentView === AppView.LEVEL_SELECT
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    <i className="fa-solid fa-house text-xs" aria-hidden="true"></i>
                    <span>Home</span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSelectAllSubjects();
                    }}
                    className={`w-full min-h-[38px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition cursor-pointer font-bold text-[11px] ${
                      currentView === AppView.SYLLABUS
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    <i className="fa-solid fa-book-open text-xs" aria-hidden="true"></i>
                    <span>Syllabus</span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentView(AppView.EXAMS);
                    }}
                    className={`w-full min-h-[38px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition cursor-pointer font-bold text-[11px] ${
                      currentView === AppView.EXAMS
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    <i className="fa-solid fa-file-lines text-xs" aria-hidden="true"></i>
                    <span>Past Papers</span>
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onStartChat) onStartChat();
                      else setCurrentView(AppView.CHAT);
                    }}
                    className={`w-full min-h-[38px] px-2 py-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition cursor-pointer font-extrabold text-[11px] ${
                      currentView === AppView.CHAT
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-sm shadow-sky-500/25'
                    }`}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles text-xs text-amber-300 animate-pulse" aria-hidden="true"></i>
                    <span>Yun AI</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Scrollable Accordion Navigation Body with all List Items */}
            <nav aria-label="Mobile Navigation Modules" className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar font-sans overscroll-contain">
              {/* Category Header with Toggle All button */}
              <div className="flex items-center justify-between px-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500" id="mobile-nav-categories-heading">
                  Platform Menu ({navGroups.reduce((acc, g) => acc + g.items.length, 0)} Items)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAllMobileGroups(true)}
                    className="text-[10px] font-bold text-sky-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    aria-label="Expand all navigation categories"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
                  <button
                    type="button"
                    onClick={() => toggleAllMobileGroups(false)}
                    className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                    aria-label="Collapse all navigation categories"
                  >
                    Collapse
                  </button>
                </div>
              </div>

              {/* Top-Level Navigation Groups List */}
              <ul className="space-y-3 list-none m-0 p-0" role="list" aria-labelledby="mobile-nav-categories-heading">
                {navGroups.map((group) => {
                  const isExpanded = !!expandedMobileGroups[group.id];
                  const hasActiveItem = isGroupActive(group);
                  const panelId = `mobile-group-panel-${group.id}`;
                  const buttonId = `mobile-group-toggle-${group.id}`;

                  return (
                    <li
                      key={group.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? 'border-sky-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]'
                      }`}
                    >
                      {/* Collapsible Accordion Header */}
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => toggleMobileGroup(group.id)}
                        className="w-full min-h-[46px] p-3 flex items-center justify-between transition cursor-pointer text-left focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-850"
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 transition-colors shadow-2xs ${
                              isExpanded
                                ? group.activeBg
                                : hasActiveItem
                                ? group.activeSoftBg
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                            aria-hidden="true"
                          >
                            <i className={`fa-solid ${group.icon}`}></i>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`font-bold text-xs truncate ${
                                  hasActiveItem
                                    ? 'text-sky-600 dark:text-cyan-300'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {group.label}
                              </span>
                              {group.badge && (
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wide ${
                                    group.badgeColor || 'bg-amber-400 text-slate-950 font-black'
                                  }`}
                                >
                                  {group.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              {group.items.length} options available
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {hasActiveItem && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active item inside" aria-label="Contains active page"></span>
                          )}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                              isExpanded
                                ? 'bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-cyan-400 rotate-180'
                                : 'bg-transparent text-slate-400'
                            }`}
                            aria-hidden="true"
                          >
                            <i className="fa-solid fa-chevron-down text-[10px]"></i>
                          </div>
                        </div>
                      </button>

                      {/* Accordion Items List - Fully visible when expanded and semantic <ul> <li> */}
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        aria-hidden={!isExpanded}
                        className={isExpanded ? 'block' : 'hidden'}
                      >
                        {isExpanded && (
                          <ul
                            className="px-2.5 pb-3 pt-1 space-y-1.5 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150 list-none m-0"
                            role="list"
                            aria-label={`${group.label} submenu`}
                          >
                            {group.items.map((item) => {
                              const isItemActive = item.view === currentView;
                              return (
                                <li key={item.id}>
                                  <button
                                    id={`mobile-${item.id}`}
                                    type="button"
                                    onClick={() => handleItemClick(item)}
                                    aria-current={isItemActive ? 'page' : undefined}
                                    className={`w-full min-h-[44px] p-2.5 rounded-xl text-left flex items-start gap-2.5 transition border cursor-pointer active:scale-[0.99] ${
                                      isItemActive
                                        ? `${group.activeBg} font-bold shadow-xs border-transparent`
                                        : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800'
                                    }`}
                                  >
                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs ${
                                        isItemActive
                                          ? 'bg-white/20 text-white'
                                          : item.iconBg || 'bg-sky-500 text-white'
                                      }`}
                                      aria-hidden="true"
                                    >
                                      <i className={`fa-solid ${item.icon}`}></i>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-1">
                                        <span
                                          className={`text-xs font-bold truncate ${
                                            isItemActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                                          }`}
                                        >
                                          {item.label}
                                        </span>
                                        {item.badge && (
                                          <span
                                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                                              isItemActive
                                                ? 'bg-white/20 text-white'
                                                : item.badgeColor || 'bg-sky-100 text-sky-800 border border-sky-200'
                                            }`}
                                          >
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                      {item.sublabel && (
                                        <p
                                          className={`text-[10px] truncate mt-0.5 ${
                                            isItemActive ? 'text-white/80 font-medium' : 'text-slate-500 dark:text-slate-400'
                                          }`}
                                        >
                                          {item.sublabel}
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Sticky Drawer Footer with Utilities (Night Study, Data Saver, Offline Status) */}
            <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] space-y-2 shrink-0 font-sans">
              <div className="flex items-center gap-2">
                {onToggleDarkMode && (
                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className={`min-h-[38px] flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                      isDarkMode
                        ? 'bg-slate-800 text-amber-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'} text-xs`}></i>
                    <span>{isDarkMode ? 'Day Mode' : 'Night Mode'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDataSaver(!dataSaver)}
                  className={`min-h-[38px] flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                    dataSaver
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-bolt text-[10px]"></i>
                  <span>{dataSaver ? 'Low MB (ON)' : 'Data Saver'}</span>
                </button>
              </div>

              {/* Offline & Server Connection Status */}
              <button
                type="button"
                onClick={onOpenOfflineToast}
                className="w-full py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
              >
                <span className={`w-2 h-2 rounded-full ${!isOnline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {!isOnline ? 'Offline Mode Active • Cached Lessons Available' : 'Connected to NECTA & EducationTZ Cloud'}
                </span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default HeaderNavDropdowns;
