import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SYLLABUS_DATA } from '../constants';
import { GradeSyllabus, Subject, Topic, AppView } from '../types';

export interface CurriculumSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (grade: GradeSyllabus, subject: Subject, topic: Topic) => void;
  onNavigateView: (view: AppView) => void;
}

interface SearchResultItem {
  id: string;
  type: 'topic' | 'subject' | 'tool' | 'exam';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: string;
  iconBg: string;
  action: () => void;
}

export const CurriculumSearchModal: React.FC<CurriculumSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  onNavigateView,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TOPICS' | 'SUBJECTS' | 'EXAMS' | 'TOOLS'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Index syllabus items for fast instant lookup
  const searchIndex = useMemo(() => {
    const items: SearchResultItem[] = [];

    // Core Platform Tools & Hubs
    const tools: Array<{ title: string; subtitle: string; icon: string; iconBg: string; view: AppView; badge: string }> = [
      { title: 'NECTA Past Papers Vault', subtitle: 'National CSEE, ACSEE, PSLE, FTNA exams & answers', icon: 'fa-square-poll-vertical', iconBg: 'bg-emerald-500', view: AppView.EXAMS, badge: 'Exams' },
      { title: 'NECTA Grade Checker & Divisions', subtitle: '25, 50, 100 mark bands, GPA & division calculation', icon: 'fa-check-double', iconBg: 'bg-cyan-500', view: AppView.GRADE_CHECKER, badge: 'Grades' },
      { title: 'Quick Grade Average Calculator', subtitle: 'Compute subject averages and cumulative scores', icon: 'fa-calculator', iconBg: 'bg-indigo-500', view: AppView.CALCULATOR, badge: 'Tool' },
      { title: 'A-Level Combinations Guide', subtitle: 'PCM, PCB, EGM, HGL, CBG combinations & university courses', icon: 'fa-diagram-project', iconBg: 'bg-purple-500', view: AppView.ALEVEL_GUIDE, badge: 'Guidance' },
      { title: 'TAMISEMI & TCU Selection Portal', subtitle: 'Form 1 & 5 joining instructions, cut-offs & HESLB loans', icon: 'fa-bullhorn', iconBg: 'bg-amber-500', view: AppView.NEWS_SCHOLARSHIPS, badge: 'Admissions' },
      { title: 'School Admission & Cut-off Predictor', subtitle: 'Predict eligibility for special schools and universities', icon: 'fa-compass-drafting', iconBg: 'bg-fuchsia-500', view: AppView.PREDICTOR, badge: 'AI Predictor' },
      { title: 'Bilingual Kamusi & Vocabulary Flashcards', subtitle: 'Swahili-English science and arts terms translator', icon: 'fa-book-bookmark', iconBg: 'bg-pink-500', view: AppView.DICTIONARY, badge: 'Language' },
      { title: 'Study Notes Hub & PDF Generator', subtitle: 'Official curriculum notes, summaries & offline sheets', icon: 'fa-note-sticky', iconBg: 'bg-amber-500', view: AppView.NOTES, badge: 'Notes' },
      { title: 'Video Class Tutorials Library', subtitle: 'Curated YouTube video explanations in Swahili and English', icon: 'fa-play', iconBg: 'bg-rose-500', view: AppView.VIDEOS, badge: 'Videos' },
      { title: 'Tanzanian Schools & Centers Directory', subtitle: 'Inspect NECTA center codes, regional schools & pass records', icon: 'fa-school', iconBg: 'bg-blue-500', view: AppView.SCHOOLS, badge: 'Schools' },
      { title: 'Shared Study Room & NECTA Traps', subtitle: 'Peer discussions, exam tricks, formulas & doubts', icon: 'fa-chalkboard-user', iconBg: 'bg-emerald-500', view: AppView.STUDY_ROOM, badge: 'Community' },
      { title: 'Study Timetable & Planner', subtitle: 'Manage weekly study routine, tasks & focus tracks', icon: 'fa-calendar-days', iconBg: 'bg-violet-500', view: AppView.PLANNER, badge: 'Planner' },
      { title: 'Tanzanian Teachers & Tutors Network', subtitle: 'Connect with verified subject experts across Tanzania', icon: 'fa-person-chalkboard', iconBg: 'bg-teal-500', view: AppView.TEACHERS, badge: 'Teachers' }
    ];

    tools.forEach(tool => {
      items.push({
        id: `tool-${tool.view}`,
        type: tool.badge === 'Exams' ? 'exam' : 'tool',
        title: tool.title,
        subtitle: tool.subtitle,
        badge: tool.badge,
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
        icon: tool.icon,
        iconBg: tool.iconBg,
        action: () => {
          onNavigateView(tool.view);
          onClose();
        }
      });
    });

    // Subjects and Topics from SYLLABUS_DATA
    SYLLABUS_DATA.forEach(grade => {
      grade.subjects.forEach(subject => {
        // Add Subject
        items.push({
          id: `subj-${grade.grade}-${subject.id}`,
          type: 'subject',
          title: `${subject.name} (${grade.grade})`,
          subtitle: `${subject.topics.length} curriculum topics • ${grade.level}`,
          badge: grade.grade,
          badgeColor: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-cyan-300 dark:border-sky-800',
          icon: subject.icon || 'fa-book',
          iconBg: 'bg-sky-500',
          action: () => {
            if (subject.topics.length > 0) {
              onSelectTopic(grade, subject, subject.topics[0]);
            }
            onClose();
          }
        });

        // Add Topics
        subject.topics.forEach(topic => {
          items.push({
            id: `topic-${grade.grade}-${subject.id}-${topic.id}`,
            type: 'topic',
            title: topic.title,
            subtitle: `${subject.name} • ${grade.grade} • ${topic.description || 'Full NECTA topic breakdown'}`,
            badge: subject.name.split(' ')[0],
            badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
            icon: 'fa-book-open',
            iconBg: 'bg-emerald-500',
            action: () => {
              onSelectTopic(grade, subject, topic);
              onClose();
            }
          });
        });
      });
    });

    return items;
  }, [onNavigateView, onSelectTopic, onClose]);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = searchIndex;

    if (activeFilter === 'TOPICS') filtered = filtered.filter(i => i.type === 'topic');
    if (activeFilter === 'SUBJECTS') filtered = filtered.filter(i => i.type === 'subject');
    if (activeFilter === 'EXAMS') filtered = filtered.filter(i => i.type === 'exam' || i.title.toLowerCase().includes('exam') || i.subtitle.toLowerCase().includes('necta'));
    if (activeFilter === 'TOOLS') filtered = filtered.filter(i => i.type === 'tool');

    if (!q) {
      // Default top suggestions
      return filtered.slice(0, 15);
    }

    return filtered.filter(item => {
      return item.title.toLowerCase().includes(q) ||
             item.subtitle.toLowerCase().includes(q) ||
             item.badge.toLowerCase().includes(q);
    }).slice(0, 25);
  }, [query, activeFilter, searchIndex]);

  // Reset selected index on results update
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation for results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="curriculum-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 sm:pt-20 overflow-y-auto animate-in fade-in duration-150 font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Curriculum & Topic Search"
    >
      <div
        id="curriculum-search-modal-container"
        className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 ring-1 ring-black/10"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-tz-blue via-indigo-600 to-tz-purple text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/25">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </div>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              id="curriculum-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search topics, Form 1-6 subjects, NECTA past papers, formulas..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold text-sm sm:text-base outline-none pr-8"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-circle-xmark text-sm"></i>
              </button>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span>ESC</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs font-bold bg-white dark:bg-[#0f172a]">
          {[
            { id: 'ALL', label: 'All Results', icon: 'fa-asterisk' },
            { id: 'TOPICS', label: 'Curriculum Topics', icon: 'fa-book-open' },
            { id: 'SUBJECTS', label: 'Subjects', icon: 'fa-layer-group' },
            { id: 'EXAMS', label: 'NECTA & Exams', icon: 'fa-clipboard-check' },
            { id: 'TOOLS', label: 'Study Tools', icon: 'fa-toolbox' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === f.id
                  ? 'bg-tz-blue text-white shadow-sm shadow-sky-500/25'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
              }`}
            >
              <i className={`fa-solid ${f.icon} text-[10px]`}></i>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar min-h-[260px] max-h-[460px]">
          {results.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto text-xl">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <p className="font-extrabold text-slate-700 dark:text-slate-200 text-sm">No curriculum matches found for "{query}"</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                Try searching for specific subjects (e.g. Mathematics, Biology, Chemistry), Form levels, or tools like "Grade Checker".
              </p>
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-center gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850/60 border border-transparent'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs ${item.iconBg || 'bg-sky-500'} shadow-2xs group-hover:scale-105 transition-transform`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-tz-blue dark:group-hover:text-cyan-300">
                        {item.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide shrink-0 border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                  <i className={`fa-solid fa-arrow-turn-down-left text-xs transition ${isSelected ? 'text-tz-blue dark:text-cyan-400 translate-x-0' : 'text-slate-300 dark:text-slate-600 -translate-x-1 opacity-0 group-hover:opacity-100'}`}></i>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-5 font-medium">
          <div className="flex items-center gap-3">
            <span><strong className="text-slate-700 dark:text-slate-300">↑↓</strong> to navigate</span>
            <span><strong className="text-slate-700 dark:text-slate-300">↵</strong> to select</span>
            <span><strong className="text-slate-700 dark:text-slate-300">ESC</strong> to close</span>
          </div>
          <span className="text-tz-blue dark:text-cyan-400 font-bold hidden sm:inline">EducationTZ Fast Search</span>
        </div>
      </div>
    </div>
  );
};
