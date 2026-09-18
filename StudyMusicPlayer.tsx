import React, { useState, useEffect } from 'react';

export interface StudyTrack {
  id: string; // YouTube Video ID
  title: string;
  artistOrChannel: string;
  category: 'Lofi' | 'Ambient' | 'Classical' | 'Binaural' | 'Swahili Chill' | 'Custom';
  youtubeUrl: string;
  duration?: string;
  thumbnailUrl?: string;
  isCustom?: boolean;
}

const DEFAULT_CURATED_PLAYLIST: StudyTrack[] = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    artistOrChannel: 'Lofi Girl',
    category: 'Lofi',
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    duration: '24/7 Live Stream',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg',
  },
  {
    id: 'DWCJZEZ45Hy',
    title: 'Peaceful Piano & Soft Rain for Deep Focus',
    artistOrChannel: 'Relaxing Vibes',
    category: 'Ambient',
    youtubeUrl: 'https://www.youtube.com/watch?v=DWCJZEZ45Hy',
    duration: '3 Hours',
    thumbnailUrl: 'https://img.youtube.com/vi/DWCJZEZ45Hy/hqdefault.jpg',
  },
  {
    id: 'WPni755-yB8',
    title: 'Mozart Effect - Classical Music for Brain Power & Studying',
    artistOrChannel: 'HalidonMusic',
    category: 'Classical',
    youtubeUrl: 'https://www.youtube.com/watch?v=WPni755-yB8',
    duration: '2 Hours',
    thumbnailUrl: 'https://img.youtube.com/vi/WPni755-yB8/hqdefault.jpg',
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Alpha Waves 432Hz - Deep Concentration Study Music',
    artistOrChannel: 'Good Vibes Binaural',
    category: 'Binaural',
    youtubeUrl: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    duration: '3 Hours',
    thumbnailUrl: 'https://img.youtube.com/vi/4xDzrJKXOOY/hqdefault.jpg',
  },
  {
    id: '5qap5aO4i9A',
    title: 'Acoustic Guitar & African Chill Instrumental',
    artistOrChannel: 'Swahili Lounge Beats',
    category: 'Swahili Chill',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    duration: '1.5 Hours',
    thumbnailUrl: 'https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg',
  },
];

interface StudyMusicPlayerProps {
  onClose?: () => void;
  compactView?: boolean;
}

export const StudyMusicPlayer: React.FC<StudyMusicPlayerProps> = ({
  onClose,
  compactView = false,
}) => {
  // Search & Link Input State
  const [searchQuery, setSearchQuery] = useState('');
  const [youtubeLinkInput, setYoutubeLinkInput] = useState('');
  const [customTrackTitle, setCustomTrackTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Custom Tracks Saved in LocalStorage
  const [customTracks, setCustomTracks] = useState<StudyTrack[]>(() => {
    const saved = localStorage.getItem('elimu_custom_study_tracks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Currently Playing Track
  const [activeTrack, setActiveTrack] = useState<StudyTrack>(DEFAULT_CURATED_PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Status Notice Toast
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Save Custom Tracks to LocalStorage
  useEffect(() => {
    localStorage.setItem('elimu_custom_study_tracks', JSON.stringify(customTracks));
  }, [customTracks]);

  // Extract YouTube Video ID from Link or Raw ID
  const extractYouTubeId = (input: string): string | null => {
    if (!input) return null;
    const trimmed = input.trim();
    // Regular expression for extracting 11-char YouTube ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
      return trimmed;
    }
    return null;
  };

  // Play YouTube Song from Link Input
  const handlePlayFromLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeLinkInput.trim()) return;

    const videoId = extractYouTubeId(youtubeLinkInput);
    if (!videoId) {
      alert('Invalid YouTube Link or ID. Please paste a valid YouTube URL (e.g. https://www.youtube.com/watch?v=jfKfPfyJRdk)');
      return;
    }

    const title = customTrackTitle.trim() || `YouTube Track (${videoId})`;
    const newTrack: StudyTrack = {
      id: videoId,
      title: title,
      artistOrChannel: 'Custom YouTube Link',
      category: 'Custom',
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      duration: 'User Link',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isCustom: true,
    };

    setActiveTrack(newTrack);
    setIsPlaying(true);
    setStatusNotice(`Playing: ${title} 🎵`);
    setTimeout(() => setStatusNotice(null), 3500);

    // Save to custom library if not already added
    if (!customTracks.some(t => t.id === videoId)) {
      setCustomTracks(prev => [newTrack, ...prev]);
    }

    setYoutubeLinkInput('');
    setCustomTrackTitle('');
  };

  // Perform Youtube Search Launch
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // If search query looks like a link, play directly
    const possibleId = extractYouTubeId(searchQuery);
    if (possibleId) {
      const newTrack: StudyTrack = {
        id: possibleId,
        title: `YouTube Song (${possibleId})`,
        artistOrChannel: 'YouTube Search Result',
        category: 'Custom',
        youtubeUrl: `https://www.youtube.com/watch?v=${possibleId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${possibleId}/hqdefault.jpg`,
        isCustom: true,
      };
      setActiveTrack(newTrack);
      setIsPlaying(true);
      setStatusNotice(`Playing track ID: ${possibleId} 🎵`);
      setTimeout(() => setStatusNotice(null), 3500);
      setSearchQuery('');
      return;
    }

    // Otherwise, generate a YouTube search embed or launch external search helper
    const searchVideoId = 'jfKfPfyJRdk'; // Fallback or search preset
    setStatusNotice(`Searching YouTube for "${searchQuery}". Opening YouTube study player...`);
    setTimeout(() => setStatusNotice(null), 4000);
    
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' study music')}`, '_blank');
  };

  // Delete custom track
  const handleDeleteCustomTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomTracks(prev => prev.filter(t => t.id !== trackId));
  };

  // Combine Curated & Custom Tracks
  const allTracks = [...customTracks, ...DEFAULT_CURATED_PLAYLIST];

  // Filter Tracks
  const filteredTracks = allTracks.filter(track => {
    const matchesCategory = selectedCategory === 'ALL' || track.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      track.artistOrChannel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-extrabold text-[11px] uppercase tracking-wider border border-red-500/30 flex items-center gap-1.5">
              <i className="fa-brands fa-youtube text-red-500 text-sm"></i> YouTube Study Music Hub
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[11px] border border-amber-400/30">
              {customTracks.length} Saved Songs
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Focus & Background Music Engine
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Search any YouTube song, paste a YouTube video link, or select curated Lofi & Binaural study tracks.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-start md:self-center w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition flex items-center justify-center border border-slate-700"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        )}
      </div>

      {/* Status Notice Toast */}
      {statusNotice && (
        <div className="bg-indigo-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg border border-indigo-400 flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-compact-disc animate-spin text-amber-300 text-sm"></i>
            {statusNotice}
          </span>
          <button onClick={() => setStatusNotice(null)} className="text-indigo-200 hover:text-white">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Embedded YouTube Audio/Video Player Stage */}
      <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-4 shadow-inner">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Responsive YouTube iFrame Embed */}
          <div className="w-full lg:w-3/5 aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-slate-800 shrink-0">
            {activeTrack?.id ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeTrack.id}?autoplay=${isPlaying ? 1 : 0}&loop=${isLooping ? 1 : 0}&playlist=${activeTrack.id}&enablejsapi=1`}
                title={activeTrack.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                <i className="fa-solid fa-music text-4xl text-slate-700"></i>
                <p>No track loaded. Search or paste a YouTube link below.</p>
              </div>
            )}
          </div>

          {/* Player Metadata & Controls */}
          <div className="w-full lg:w-2/5 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  NOW PLAYING
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <i className="fa-solid fa-signal text-[10px]"></i> Live Audio
                </span>
              </div>

              <h3 className="text-lg font-black text-white leading-snug line-clamp-2">
                {activeTrack.title}
              </h3>
              <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                <i className="fa-brands fa-youtube text-red-500"></i> {activeTrack.artistOrChannel}
              </p>
            </div>

            {/* Quick Playback Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 py-3 rounded-2xl font-black text-xs transition shadow-lg flex items-center justify-center gap-2 ${
                    isPlaying
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                  }`}
                >
                  <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
                </button>

                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    isLooping
                      ? 'bg-indigo-600/40 text-indigo-200 border-indigo-400/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Toggle Repeat / Loop Track"
                >
                  <i className="fa-solid fa-arrows-rotate"></i>
                  <span className="hidden sm:inline">Loop</span>
                </button>

                <a
                  href={activeTrack.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  title="Open on YouTube"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>

              {/* Study Tip Notice */}
              <p className="text-[11px] text-slate-400 font-medium leading-normal bg-slate-900 p-3 rounded-xl border border-slate-800">
                <i className="fa-solid fa-brain text-amber-400 mr-1.5"></i>
                <strong>Study Tip:</strong> Ambient 60 BPM music or 432Hz binaural beats enhance memory retention and focus during NECTA preparation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* YOUTUBE LINK PASTE FORM & DIRECT SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Paste YouTube Link Section */}
        <form onSubmit={handlePlayFromLink} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-link text-amber-400"></i> Paste YouTube Song Link
            </label>
            <span className="text-[10px] text-slate-400 font-bold">Paste URL or Video ID</span>
          </div>

          <input
            type="text"
            placeholder="e.g. https://www.youtube.com/watch?v=jfKfPfyJRdk"
            value={youtubeLinkInput}
            onChange={(e) => setYoutubeLinkInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition"
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Song Name / Optional Title"
              value={customTrackTitle}
              onChange={(e) => setCustomTrackTitle(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <i className="fa-solid fa-play text-xs"></i> Play Link
            </button>
          </div>
        </form>

        {/* Search Song Section */}
        <form onSubmit={handleSearchSubmit} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <i className="fa-solid fa-magnifying-glass text-cyan-400"></i> Search YouTube Song
            </label>
            <span className="text-[10px] text-slate-400 font-bold">Search Any Song / Artist</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search e.g. Lofi beats, Swahili acoustic, Piano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-medium focus:outline-none focus:border-cyan-400 transition"
            />

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <i className="fa-solid fa-magnifying-glass text-xs"></i> Search
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            Type keyword or artist to search tracks directly or launch YouTube search results.
          </p>
        </form>
      </div>

      {/* MUSIC LIBRARY & CATEGORY FILTERS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <i className="fa-solid fa-list-ul text-amber-400"></i> Curated Study Playlist & Saved Songs
          </h3>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {['ALL', 'Lofi', 'Ambient', 'Classical', 'Binaural', 'Swahili Chill', 'Custom'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        {filteredTracks.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
            No tracks found matching "{searchQuery}" in category {selectedCategory}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTracks.map((track, idx) => {
              const isSelected = activeTrack.id === track.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => {
                    setActiveTrack(track);
                    setIsPlaying(true);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative group ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-900/90 to-slate-900 border-indigo-400 shadow-lg'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-xl bg-slate-950 overflow-hidden relative shrink-0 border border-slate-700">
                    <img
                      src={track.thumbnailUrl || `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && isPlaying && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <i className="fa-solid fa-volume-high text-amber-300 text-xs animate-bounce"></i>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded bg-slate-700 text-amber-300 truncate">
                        {track.category}
                      </span>
                      {track.duration && (
                        <span className="text-[10px] font-bold text-slate-400">{track.duration}</span>
                      )}
                    </div>

                    <h4 className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {track.artistOrChannel}
                    </p>
                  </div>

                  {/* Actions */}
                  {track.isCustom && (
                    <button
                      onClick={(e) => handleDeleteCustomTrack(track.id, e)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition opacity-0 group-hover:opacity-100"
                      title="Remove from saved playlist"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMusicPlayer;
