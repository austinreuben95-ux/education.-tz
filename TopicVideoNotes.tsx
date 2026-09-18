import React, { useState } from 'react';

export interface VideoItem {
  title: string;
  youtubeId: string;
  language: 'Swahili' | 'English' | string;
  description?: string;
  duration?: string;
  contentType?: string;
}

export interface TopicVideoNotesProps {
  subject: string;
  topicName: string;
  videos: VideoItem[];
  notes?: string;
  keyConcepts?: string[];
  subTopics?: string[];
  onBack?: () => void;
}

export const TopicVideoNotes: React.FC<TopicVideoNotesProps> = ({
  subject,
  topicName,
  videos = [],
  notes,
  keyConcepts = [],
  subTopics = [],
  onBack,
}) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'concepts'>('video');

  const currentVideo = videos[selectedVideoIndex] || videos[0];

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden my-6">
      {/* Header Bar */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {onBack && (
              <button
                onClick={onBack}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-left"></i> Back
              </button>
            )}
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              {subject}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <i className="fa-solid fa-film text-indigo-400"></i> {videos.length} Video Tutorial{videos.length !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {topicName}
          </h1>
        </div>

        {/* Completion & Action Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              isCompleted
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <i className={`fa-solid ${isCompleted ? 'fa-circle-check text-emerald-400' : 'fa-circle'}`}></i>
            {isCompleted ? 'Topic Completed' : 'Mark as Completed'}
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Section: Embedded Video Player */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Navigation Tabs for Mobile / Content Modes */}
          <div className="flex border-b border-slate-800 gap-4 text-sm font-semibold mb-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`pb-2.5 transition flex items-center gap-2 border-b-2 ${
                activeTab === 'video'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-play-circle"></i> Video Lesson
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2.5 transition flex items-center gap-2 border-b-2 ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-book-open"></i> Topic Notes
            </button>
            {keyConcepts.length > 0 && (
              <button
                onClick={() => setActiveTab('concepts')}
                className={`pb-2.5 transition flex items-center gap-2 border-b-2 ${
                  activeTab === 'concepts'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="fa-solid fa-lightbulb"></i> Key Concepts ({keyConcepts.length})
              </button>
            )}
          </div>

          {activeTab === 'video' && (
            <div className="flex flex-col gap-4">
              {currentVideo ? (
                <>
                  {/* YouTube iFrame Player */}
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-slate-800">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0&autoplay=0`}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Active Video Info Header */}
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                          currentVideo.language.toLowerCase() === 'swahili'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          <i className="fa-solid fa-language mr-1"></i>
                          {currentVideo.language}
                        </span>
                        {currentVideo.contentType && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded text-[11px] font-medium">
                            {currentVideo.contentType}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-100">
                        {currentVideo.title}
                      </h3>
                      {currentVideo.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {currentVideo.description}
                        </p>
                      )}
                    </div>

                    <a
                      href={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start sm:self-center px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                    >
                      <i className="fa-brands fa-youtube text-red-500"></i> Open in YouTube
                    </a>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-slate-800/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <i className="fa-solid fa-video-slash text-4xl mb-3 text-slate-600"></i>
                  <p className="font-semibold text-sm">No video tutorial linked to this topic yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Check back soon for NECTA revision walkthroughs!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <h3 className="text-md font-bold text-slate-200 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-indigo-400"></i> Syllabus Notes & Summaries
              </h3>
              {notes ? (
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-3">
                  {notes}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Comprehensive topic notes and NECTA syllabus summaries are available for {topicName}. Use the key concepts tab or watch the linked video walkthrough for step-by-step guidance.
                </p>
              )}
            </div>
          )}

          {activeTab === 'concepts' && keyConcepts.length > 0 && (
            <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-800">
              <h3 className="text-md font-bold text-slate-200 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-amber-400"></i> Essential Learning Outcomes
              </h3>
              <ul className="space-y-2.5">
                {keyConcepts.map((concept, index) => (
                  <li key={index} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sidebar: Video Playlist & Subtopics */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Video Selector / Playlist */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <i className="fa-solid fa-list-ul text-indigo-400"></i> Available Videos ({videos.length})
              </h4>
              <span className="text-[11px] text-slate-400">
                Language Toggle
              </span>
            </div>

            {videos.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2">No alternate languages available.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                {videos.map((vid, idx) => {
                  const isActive = idx === selectedVideoIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVideoIndex(idx);
                        setActiveTab('video');
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition flex items-start gap-3 ${
                        isActive
                          ? 'bg-indigo-950/80 border-indigo-500/60 text-white shadow-md'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isActive ? (
                          <i className="fa-solid fa-play text-xs"></i>
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            vid.language.toLowerCase() === 'swahili'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {vid.language}
                          </span>
                          {vid.duration && (
                            <span className="text-[10px] text-slate-400">
                              <i className="fa-regular fa-clock mr-1"></i>{vid.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold line-clamp-2 leading-snug">
                          {vid.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subtopics Checklist */}
          {subTopics.length > 0 && (
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                <i className="fa-solid fa-sitemap text-emerald-400"></i> Topic Units & Subtopics
              </h4>
              <ul className="space-y-2">
                {subTopics.map((sub, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-2 p-2 bg-slate-900/40 rounded border border-slate-800/80">
                    <i className="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicVideoNotes;
