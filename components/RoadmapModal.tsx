import React, { useState, useMemo } from 'react';
import { ALL_150_ROADMAP_POINTS, ROADMAP_CATEGORIES, RoadmapPoint } from './StrategicRoadmap';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('roadmap_favorites');
      return saved ? JSON.parse(saved) : [1, 2, 16, 46, 101, 111, 121, 131, 141];
    } catch {
      return [1, 2, 16, 46, 101, 111, 121, 131, 141];
    }
  });
  const [activeItem, setActiveItem] = useState<RoadmapPoint | null>(null);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('roadmap_favorites', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const filteredPoints = useMemo(() => {
    return ALL_150_ROADMAP_POINTS.filter((point) => {
      // Category Filter
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(point.id)) return false;
      } else if (selectedCategory !== 'all' && point.category !== selectedCategory) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && point.status !== statusFilter) {
        return false;
      }

      // Audience Filter
      if (audienceFilter !== 'all' && point.targetAudience !== audienceFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = point.id.toString() === q || `#${point.id}` === q;
        const matchesTitle = point.title.toLowerCase().includes(q);
        const matchesSwahili = point.swahiliTitle ? point.swahiliTitle.toLowerCase().includes(q) : false;
        const matchesSummary = point.summary.toLowerCase().includes(q);
        const matchesDetails = point.details.toLowerCase().includes(q);
        return matchesId || matchesTitle || matchesSwahili || matchesSummary || matchesDetails;
      }

      return true;
    });
  }, [selectedCategory, statusFilter, audienceFilter, searchQuery, favorites]);

  const downloadRoadmapReport = () => {
    const listToExport = filteredPoints.length > 0 ? filteredPoints : ALL_150_ROADMAP_POINTS;
    const items = listToExport
      .map(
        (p) =>
          `[#${p.id}] ${p.title}
Swahili: ${p.swahiliTitle || 'N/A'}
Status: ${p.status} | Audience: ${p.targetAudience}
Summary: ${p.summary}
Details: ${p.details}
--------------------------------------------------`
      )
      .join('\n\n');

    const content = `=======================================================
TANZANIA EDUCATIONAL PLATFORM - 150 STRATEGIC IDEAS BLUEPRINT
=======================================================
Generated: ${new Date().toLocaleString()}
Total Items In Report: ${listToExport.length} / 150

${items}

=======================================================
Elimu Bora kwa Wote - Tanzania Educational Tech Roadmap
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tanzania_EdTech_150_Ideas_Blueprint.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-700/80 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-400/20 shrink-0">
                <i className="fa-solid fa-rocket"></i>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    150 Educational Innovation Roadmap
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/30">
                    150 Wazo za Elimu TZ
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  150 localized, forward-looking features across NECTA exam tech, STEM labs, low-resource hardware, AI & Swahili localization.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0 border border-slate-700"
              title="Close Roadmap Modal"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Search & Quick Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all 150 ideas by topic, number (#101), keyword or Swahili title..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={downloadRoadmapReport}
                className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-amber-400/20"
                title="Download full roadmap as text report"
              >
                <i className="fa-solid fa-file-arrow-down"></i>
                <span className="hidden sm:inline">Export Blueprint (.txt)</span>
                <span className="sm:hidden">Export</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('favorites');
                }}
                className={`px-3 py-2.5 rounded-xl border font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  selectedCategory === 'favorites'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <i className="fa-solid fa-heart text-red-400 text-xs"></i>
                <span>Saved ({favorites.length})</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {ROADMAP_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer text-[11px] shrink-0 border ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <i className={`fa-solid ${cat.icon} text-[10px]`}></i>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Status & Audience Secondary Filters */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-1 text-[11px]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <i className="fa-solid fa-filter text-[10px] text-amber-400"></i> Status:
              </span>
              {['all', 'Live & Active', 'In Development', 'Planned Roadmap'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-0.5 rounded-lg font-extrabold transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Statuses' : st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-bold">Audience:</span>
              {['all', 'Students', 'Teachers', 'Parents', 'Schools', 'Developers'].map((aud) => (
                <button
                  key={aud}
                  onClick={() => setAudienceFilter(aud)}
                  className={`px-2.5 py-0.5 rounded-lg font-extrabold transition cursor-pointer ${
                    audienceFilter === aud
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {aud === 'all' ? 'All Roles' : aud}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>
              Showing <strong className="text-amber-400 font-black">{filteredPoints.length}</strong> of 150 strategy features
            </span>
            {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all' || audienceFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setStatusFilter('all');
                  setAudienceFilter('all');
                }}
                className="text-amber-400 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-rotate-left text-[10px]"></i> Clear Filters
              </button>
            )}
          </div>

          {filteredPoints.length === 0 ? (
            <div className="bg-slate-950/60 rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center text-2xl mx-auto">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <h3 className="text-base font-black text-white">No strategy points match your query</h3>
              <p className="text-xs text-slate-400">
                Try searching for another keyword like "NECTA", "Swahili", "SMS", "AI", or "101".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setStatusFilter('all');
                  setAudienceFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPoints.map((point) => {
                const isFav = favorites.includes(point.id);
                let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                if (point.status === 'In Development') {
                  statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                } else if (point.status === 'Planned Roadmap') {
                  statusBadge = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
                }

                return (
                  <div
                    key={point.id}
                    className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-amber-400/60 transition flex flex-col justify-between group relative"
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                            #{point.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${statusBadge}`}>
                            {point.status}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleFavorite(point.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                            isFav ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-500 hover:text-red-400'
                          }`}
                          title={isFav ? 'Remove from saved' : 'Save feature'}
                        >
                          <i className="fa-solid fa-heart text-xs"></i>
                        </button>
                      </div>

                      {/* Titles */}
                      <div>
                        <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {point.title}
                        </h4>
                        {point.swahiliTitle && (
                          <p className="text-[11px] font-bold text-amber-400/90 mt-1 flex items-center gap-1.5">
                            <i className="fa-solid fa-language text-[10px]"></i>
                            <span>{point.swahiliTitle}</span>
                          </p>
                        )}
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-3">
                        {point.summary}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                        <i className="fa-solid fa-user text-[9px] mr-1 text-slate-400"></i>
                        {point.targetAudience}
                      </span>

                      <button
                        onClick={() => setActiveItem(point)}
                        className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <i className="fa-solid fa-chevron-right text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Elimu Bora kwa Wote • 150 Ideas Tanzanian Education Engine</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold cursor-pointer transition border border-slate-700"
          >
            Close Roadmap
          </button>
        </div>

        {/* Item Detail View Inside Modal */}
        {activeItem && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>

              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-md">
                  #{activeItem.id}
                </span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeItem.status}
                  </span>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">Target: {activeItem.targetAudience}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white leading-tight">{activeItem.title}</h3>
                {activeItem.swahiliTitle && (
                  <p className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <i className="fa-solid fa-language"></i> {activeItem.swahiliTitle}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Strategic Summary</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{activeItem.summary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-layer-group"></i> Implementation Scope & Technical Details
                </h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                  {activeItem.details}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleFavorite(activeItem.id)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    favorites.includes(activeItem.id)
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <i className="fa-solid fa-heart"></i>
                  <span>{favorites.includes(activeItem.id) ? 'Saved to Favorites' : 'Save to Favorites'}</span>
                </button>

                <button
                  onClick={() => setActiveItem(null)}
                  className="py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs cursor-pointer shadow-md shadow-amber-400/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapModal;
