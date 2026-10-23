import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SYLLABUS_DATA } from '../constants';
import { GradeSyllabus, Subject, Topic, EducationLevel } from '../types';

export interface HomeCurriculumSearchBarProps {
  onSelectSubject: (grade: GradeSyllabus, subject: Subject) => void;
  onSelectTopic: (grade: GradeSyllabus, subject: Subject, topic: Topic) => void;
  onOpenFullSearchModal?: () => void;
  className?: string;
}

interface FlattenedCurriculumItem {
  id: string;
  type: 'subject' | 'topic';
  title: string;
  description?: string;
  grade: GradeSyllabus;
  subject: Subject;
  topic?: Topic;
  level: EducationLevel;
  gradeLabel: string;
  subjectName: string;
  icon: string;
  topicCount?: number;
}

const TRENDING_KEYWORDS = [
  { label: 'Biology', icon: 'fa-dna' },
  { label: 'Mathematics', icon: 'fa-calculator' },
  { label: 'Physics', icon: 'fa-atom' },
  { label: 'Chemistry', icon: 'fa-flask' },
  { label: 'Photosynthesis', icon: 'fa-leaf' },
  { label: 'Quadratic Equations', icon: 'fa-square-root-variable' },
  { label: 'Geography', icon: 'fa-earth-africa' },
  { label: 'Kiswahili', icon: 'fa-language' },
  { label: 'Civics', icon: 'fa-landmark' },
  { label: 'Genetics', icon: 'fa-microscope' },
];

export const HomeCurriculumSearchBar: React.FC<HomeCurriculumSearchBarProps> = ({
  onSelectSubject,
  onSelectTopic,
  onOpenFullSearchModal,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | 'PRIMARY' | 'O_LEVEL' | 'A_LEVEL'>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'TOPIC' | 'SUBJECT'>('ALL');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flatten the curriculum database once for ultra-fast instant searching
  const allCurriculumItems = useMemo(() => {
    const items: FlattenedCurriculumItem[] = [];

    SYLLABUS_DATA.forEach((grade) => {
      grade.subjects.forEach((subject) => {
        // 1. Add Subject entry
        items.push({
          id: `subj-${grade.grade}-${subject.id}`,
          type: 'subject',
          title: subject.name,
          description: `${subject.topics.length} official curriculum topics • ${grade.grade} (${grade.level})`,
          grade,
          subject,
          level: grade.level,
          gradeLabel: grade.grade,
          subjectName: subject.name,
          icon: subject.icon || 'fa-book',
          topicCount: subject.topics.length,
        });

        // 2. Add each Topic entry
        subject.topics.forEach((topic) => {
          items.push({
            id: `topic-${grade.grade}-${subject.id}-${topic.id}`,
            type: 'topic',
            title: topic.title,
            description: topic.description || `NECTA aligned revision topic for ${subject.name}`,
            grade,
            subject,
            topic,
            level: grade.level,
            gradeLabel: grade.grade,
            subjectName: subject.name,
            icon: subject.icon || 'fa-book-open',
          });
        });
      });
    });

    return items;
  }, []);

  // Filtered search results
  const filteredResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return allCurriculumItems.filter((item) => {
      // Level filter
      if (selectedLevelFilter === 'PRIMARY' && item.level !== EducationLevel.PRIMARY) return false;
      if (selectedLevelFilter === 'O_LEVEL' && item.level !== EducationLevel.SECONDARY) return false;
      if (selectedLevelFilter === 'A_LEVEL' && item.level !== EducationLevel.HIGH_SCHOOL) return false;

      // Type filter
      if (selectedTypeFilter === 'SUBJECT' && item.type !== 'subject') return false;
      if (selectedTypeFilter === 'TOPIC' && item.type !== 'topic') return false;

      // Query filter
      if (!query) {
        // When query is empty, show top subjects/topics
        return true;
      }

      const matchTitle = item.title.toLowerCase().includes(query);
      const matchSubject = item.subjectName.toLowerCase().includes(query);
      const matchGrade = item.gradeLabel.toLowerCase().includes(query);
      const matchDesc = item.description?.toLowerCase().includes(query) ?? false;

      return matchTitle || matchSubject || matchGrade || matchDesc;
    });
  }, [allCurriculumItems, searchTerm, selectedLevelFilter, selectedTypeFilter]);

  // Separate subjects and topics for organized display
  const subjectResults = useMemo(
    () => filteredResults.filter((r) => r.type === 'subject').slice(0, 8),
    [filteredResults]
  );

  const topicResults = useMemo(
    () => filteredResults.filter((r) => r.type === 'topic').slice(0, 16),
    [filteredResults]
  );

  const visibleResults = useMemo(
    () => [...subjectResults, ...topicResults],
    [subjectResults, topicResults]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Reset highlighted index when visible results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [visibleResults.length, searchTerm]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && visibleResults.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < visibleResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : visibleResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visibleResults[highlightedIndex]) {
        handleSelectItem(visibleResults[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectItem = (item: FlattenedCurriculumItem) => {
    setIsDropdownOpen(false);
    if (item.type === 'topic' && item.topic) {
      onSelectTopic(item.grade, item.subject, item.topic);
    } else {
      onSelectSubject(item.grade, item.subject);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchTerm(keyword);
    setIsDropdownOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-4xl mx-auto font-sans ${className}`}
      id="home-curriculum-search-container"
    >
      {/* Search Input Bar Card */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-4 sm:p-5 shadow-xl shadow-slate-900/5 dark:shadow-black/40 border-2 border-slate-200/90 dark:border-slate-800 transition-all duration-200 focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-500/10 dark:focus-within:ring-sky-400/20">
        {/* Top Header Row with Title & Quick Counts */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              National Curriculum Search
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              • Primary to Form 6
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-sky-700 dark:text-cyan-300 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
              {allCurriculumItems.length}+ Topics & Subjects
            </span>
            {onOpenFullSearchModal && (
              <button
                type="button"
                onClick={onOpenFullSearchModal}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-cyan-400 transition cursor-pointer"
                title="Open expanded full-screen search (⌘K)"
              >
                <span>Full Search</span>
                <kbd className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
              </button>
            )}
          </div>
        </div>

        {/* Input Box Row */}
        <div className="relative flex items-center gap-3">
          {/* Left Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
            <i className="fa-solid fa-magnifying-glass text-sm sm:text-base"></i>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-0 relative">
            <input
              ref={inputRef}
              id="home-curriculum-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search topics, subjects (e.g. Photosynthesis, Biology, Fractions, Civics)..."
              autoComplete="off"
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-bold text-sm sm:text-base outline-none pr-8 py-1"
              aria-label="Search curriculum topics and subjects"
              aria-expanded={isDropdownOpen}
              aria-controls="home-curriculum-search-results"
            />
          </div>

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs transition cursor-pointer active:scale-90 shrink-0"
              title="Clear search input"
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}

          {/* Action Button: Search / View */}
          <button
            type="button"
            onClick={() => {
              if (visibleResults.length > 0) {
                handleSelectItem(visibleResults[0]);
              } else {
                setIsDropdownOpen(true);
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-extrabold text-xs transition shadow-md shadow-sky-600/30 cursor-pointer shrink-0"
          >
            <span>Search</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>

        {/* Filter Chips Bar (Level & Type Selection) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">
              Level:
            </span>
            {[
              { id: 'ALL', label: 'All Levels' },
              { id: 'O_LEVEL', label: 'Form 1 - 4' },
              { id: 'A_LEVEL', label: 'Form 5 - 6' },
              { id: 'PRIMARY', label: 'Primary (Std 1-7)' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  setSelectedLevelFilter(lvl.id as any);
                  setIsDropdownOpen(true);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedLevelFilter === lvl.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Type Toggle: All / Topics / Subjects */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSelectedTypeFilter('ALL');
                setIsDropdownOpen(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                selectedTypeFilter === 'ALL'
                  ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTypeFilter('TOPIC');
                setIsDropdownOpen(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                selectedTypeFilter === 'TOPIC'
                  ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Topics
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTypeFilter('SUBJECT');
                setIsDropdownOpen(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                selectedTypeFilter === 'SUBJECT'
                  ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Subjects
            </button>
          </div>
        </div>

        {/* Popular / Trending Keyword Quick Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 scrollbar-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 shrink-0 flex items-center gap-1">
            <i className="fa-solid fa-fire text-[9px]"></i> Popular:
          </span>
          {TRENDING_KEYWORDS.map((k) => (
            <button
              key={k.label}
              type="button"
              onClick={() => handleKeywordClick(k.label)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 transition shrink-0 cursor-pointer active:scale-95"
            >
              <i className={`fa-solid ${k.icon} text-[9px] text-slate-400`}></i>
              <span>{k.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING INSTANT SEARCH RESULTS DROPDOWN                                 */}
      {/* ========================================================================= */}
      {isDropdownOpen && (
        <div
          id="home-curriculum-search-results"
          ref={listRef}
          className="absolute left-0 right-0 mt-2 bg-white/98 dark:bg-[#0f172a]/98 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-950/20 dark:shadow-black/80 border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 max-h-[70vh] flex flex-col overflow-hidden"
          role="listbox"
          aria-label="Curriculum Search Results"
        >
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 px-1 text-xs shrink-0">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">
              {searchTerm ? (
                <span>
                  Found <strong className="text-sky-600 dark:text-cyan-400">{filteredResults.length}</strong> result{filteredResults.length !== 1 ? 's' : ''} for "{searchTerm}"
                </span>
              ) : (
                <span>Suggested Subjects & Curriculum Topics</span>
              )}
            </span>

            <button
              type="button"
              onClick={() => setIsDropdownOpen(false)}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <span>Close</span>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Results Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 overscroll-contain">
            {visibleResults.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto text-xl">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">
                  No matching subjects or topics found for "{searchTerm}"
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try searching for another curriculum keyword like "Biology", "Motion", "Fractions", or switch level filter above.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition cursor-pointer"
                  >
                    Clear Filter
                  </button>
                  {onOpenFullSearchModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenFullSearchModal();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition cursor-pointer shadow-xs"
                    >
                      Open Full Platform Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* 1. MATCHING SUBJECTS SECTION (If any) */}
                {subjectResults.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <i className="fa-solid fa-layer-group text-sky-500"></i> Matching Subjects ({subjectResults.length})
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Click to open full subject syllabus</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {subjectResults.map((item, idx) => {
                        const isHighlighted = idx === highlightedIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectItem(item)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`p-3 rounded-2xl text-left transition-all duration-150 flex items-start gap-3 cursor-pointer border group/item ${
                              isHighlighted
                                ? 'bg-sky-50/90 dark:bg-slate-800 border-sky-300 dark:border-slate-600 shadow-xs'
                                : 'bg-slate-50/70 hover:bg-sky-50/50 dark:bg-slate-850/60 dark:hover:bg-slate-800/80 border-slate-150 dark:border-slate-800'
                            }`}
                            role="option"
                            aria-selected={isHighlighted}
                          >
                            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover/item:scale-105 transition-transform text-sm mt-0.5">
                              <i className={`fa-solid ${item.icon}`}></i>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover/item:text-sky-600 dark:group-hover/item:text-cyan-300">
                                  {item.title}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black tracking-wide bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-cyan-300 border border-sky-200 dark:border-sky-800 shrink-0">
                                  {item.gradeLabel}
                                </span>
                              </div>

                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
                                {item.topicCount} syllabus topics • {item.level}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. MATCHING TOPICS SECTION (If any) */}
                {topicResults.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <i className="fa-solid fa-book-open text-emerald-500"></i> Curriculum Topics ({topicResults.length})
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Click to view lesson notes & video tutorials</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {topicResults.map((item, idx) => {
                        const totalIdx = subjectResults.length + idx;
                        const isHighlighted = totalIdx === highlightedIndex;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectItem(item)}
                            onMouseEnter={() => setHighlightedIndex(totalIdx)}
                            className={`p-3 rounded-2xl text-left transition-all duration-150 flex items-start gap-3 cursor-pointer border group/item ${
                              isHighlighted
                                ? 'bg-emerald-50/90 dark:bg-slate-800 border-emerald-300 dark:border-slate-600 shadow-xs'
                                : 'bg-white hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-850/80 border-slate-100 dark:border-slate-800/80'
                            }`}
                            role="option"
                            aria-selected={isHighlighted}
                          >
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 text-xs mt-0.5">
                              <i className="fa-solid fa-book-open"></i>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-300">
                                  {item.title}
                                </h5>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    {item.subjectName}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    {item.gradeLabel}
                                  </span>
                                </div>
                              </div>

                              {item.description && (
                                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium leading-tight">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <div className="hidden sm:flex items-center text-xs text-slate-400 group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 shrink-0 self-center">
                              <i className="fa-solid fa-arrow-right text-[11px] transition-transform group-hover/item:translate-x-1"></i>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Shortcuts Strip */}
          <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-2 shrink-0">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">
                <strong className="text-slate-600 dark:text-slate-400">↑↓</strong> to navigate
              </span>
              <span className="hidden sm:inline">
                <strong className="text-slate-600 dark:text-slate-400">Enter</strong> to open
              </span>
              <span>
                <strong className="text-slate-600 dark:text-slate-400">ESC</strong> to close
              </span>
            </div>

            <span className="text-sky-600 dark:text-cyan-400 font-bold">
              Instant Curriculum Lookup
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeCurriculumSearchBar;
