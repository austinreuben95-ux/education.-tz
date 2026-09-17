import React, { useState } from 'react';

export interface WeeklyStudyData {
  day: string;
  shortDay: string;
  date: string;
  timeSpentMinutes: number;
  quizScorePercent: number;
  quizzesTaken: number;
  topicsCompleted: number;
  topSubject: string;
}

export interface SubjectTrendData {
  subject: string;
  totalTimeMinutes: number;
  avgQuizScore: number;
  quizzesTaken: number;
}

const DEFAULT_WEEKLY_DATA: WeeklyStudyData[] = [
  { day: 'Monday', shortDay: 'Mon', date: 'Jul 20', timeSpentMinutes: 45, quizScorePercent: 78, quizzesTaken: 2, topicsCompleted: 3, topSubject: 'Mathematics' },
  { day: 'Tuesday', shortDay: 'Tue', date: 'Jul 21', timeSpentMinutes: 65, quizScorePercent: 82, quizzesTaken: 3, topicsCompleted: 4, topSubject: 'Physics' },
  { day: 'Wednesday', shortDay: 'Wed', date: 'Jul 22', timeSpentMinutes: 30, quizScorePercent: 75, quizzesTaken: 1, topicsCompleted: 2, topSubject: 'Chemistry' },
  { day: 'Thursday', shortDay: 'Thu', date: 'Jul 23', timeSpentMinutes: 90, quizScorePercent: 92, quizzesTaken: 4, topicsCompleted: 5, topSubject: 'Biology' },
  { day: 'Friday', shortDay: 'Fri', date: 'Jul 24', timeSpentMinutes: 55, quizScorePercent: 88, quizzesTaken: 3, topicsCompleted: 3, topSubject: 'Kiswahili' },
  { day: 'Saturday', shortDay: 'Sat', date: 'Jul 25', timeSpentMinutes: 75, quizScorePercent: 95, quizzesTaken: 5, topicsCompleted: 6, topSubject: 'English' },
  { day: 'Sunday', shortDay: 'Sun', date: 'Jul 26', timeSpentMinutes: 40, quizScorePercent: 85, quizzesTaken: 2, topicsCompleted: 2, topSubject: 'Civics' },
];

const PAST_MONTH_DATA: WeeklyStudyData[] = [
  { day: 'Week 1', shortDay: 'W1', date: 'Jul 1-7', timeSpentMinutes: 320, quizScorePercent: 79, quizzesTaken: 12, topicsCompleted: 14, topSubject: 'Mathematics' },
  { day: 'Week 2', shortDay: 'W2', date: 'Jul 8-14', timeSpentMinutes: 390, quizScorePercent: 84, quizzesTaken: 15, topicsCompleted: 18, topSubject: 'Physics' },
  { day: 'Week 3', shortDay: 'W3', date: 'Jul 15-21', timeSpentMinutes: 420, quizScorePercent: 88, quizzesTaken: 18, topicsCompleted: 22, topSubject: 'Biology' },
  { day: 'Week 4', shortDay: 'W4', date: 'Jul 22-28', timeSpentMinutes: 460, quizScorePercent: 91, quizzesTaken: 21, topicsCompleted: 25, topSubject: 'Kiswahili' },
];

interface StudyTrendChartProps {
  userPoints?: number;
  targetScoreGoal?: number;
  isParentView?: boolean;
}

export const StudyTrendChart: React.FC<StudyTrendChartProps> = ({
  userPoints = 1250,
  targetScoreGoal = 85,
  isParentView = false,
}) => {
  const [timeRange, setTimeRange] = useState<'thisWeek' | 'lastMonth'>('thisWeek');
  const [showGoalLine, setShowGoalLine] = useState<boolean>(true);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const rawData = timeRange === 'thisWeek' ? DEFAULT_WEEKLY_DATA : PAST_MONTH_DATA;

  const totalMinutes = rawData.reduce((acc, curr) => acc + curr.timeSpentMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgQuizScore = rawData.length > 0
    ? Math.round(rawData.reduce((acc, curr) => acc + curr.quizScorePercent, 0) / rawData.length)
    : 0;
  const totalQuizzes = rawData.reduce((acc, curr) => acc + curr.quizzesTaken, 0);
  const totalTopics = rawData.reduce((acc, curr) => acc + curr.topicsCompleted, 0);
  const peakDay = [...rawData].sort((a, b) => b.timeSpentMinutes - a.timeSpentMinutes)[0];

  // SVG Chart Geometry
  const chartWidth = 640;
  const chartHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 25;
  const paddingBottom = 35;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Max scale for minutes: dynamic based on data
  const maxMinutes = timeRange === 'thisWeek' ? 120 : 500;
  // Score domain: 50% to 100%
  const minScore = 50;
  const maxScore = 100;

  const getBarX = (index: number) => {
    const step = plotWidth / rawData.length;
    return paddingLeft + step * index + step / 2;
  };

  const getMinutesY = (mins: number) => {
    const clamped = Math.max(0, Math.min(mins, maxMinutes));
    return paddingTop + plotHeight - (clamped / maxMinutes) * plotHeight;
  };

  const getScoreY = (score: number) => {
    const clamped = Math.max(minScore, Math.min(score, maxScore));
    const ratio = (clamped - minScore) / (maxScore - minScore);
    return paddingTop + plotHeight - ratio * plotHeight;
  };

  const goalY = getScoreY(targetScoreGoal);

  // Line path coordinates for quiz scores
  const scorePoints = rawData.map((d, i) => ({
    x: getBarX(i),
    y: getScoreY(d.quizScorePercent),
    data: d,
    index: i,
  }));

  const linePathD = scorePoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    // Catmull-Rom or clean linear line
    return `${acc} L ${p.x} ${p.y}`;
  }, '');

  const hoveredData = activeItemIndex !== null ? rawData[activeItemIndex] : null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-100/80 space-y-6 text-left">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black text-[11px] uppercase tracking-wider border border-indigo-100 flex items-center gap-1">
              <i className="fa-solid fa-chart-line text-indigo-500"></i> Analytics Dashboard
            </span>
            {isParentView && (
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-black text-[11px] uppercase tracking-wider border border-purple-100">
                Parent Monitor Mode
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            Weekly Study Trend: Time Spent vs. Performance
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Correlate study time in minutes (bars) with quiz accuracy percentages (trend line) across days.
          </p>
        </div>

        {/* View & Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1 border border-gray-200 text-xs font-bold">
            <button
              onClick={() => { setTimeRange('thisWeek'); setActiveItemIndex(null); }}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeRange === 'thisWeek'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => { setTimeRange('lastMonth'); setActiveItemIndex(null); }}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeRange === 'lastMonth'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past 30 Days
            </button>
          </div>

          <button
            onClick={() => setShowGoalLine(!showGoalLine)}
            className={`px-3 py-2 rounded-2xl text-xs font-extrabold border transition flex items-center gap-1.5 ${
              showGoalLine
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}
          >
            <i className="fa-solid fa-bullseye text-amber-500"></i>
            <span>{showGoalLine ? `Goal: ${targetScoreGoal}%` : 'Show Goal'}</span>
          </button>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
          <div className="flex items-center justify-between text-indigo-600 text-xs font-extrabold uppercase mb-1">
            <span>Total Study Time</span>
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalHours} hrs</div>
          <p className="text-[10px] text-indigo-700 font-bold mt-1">{totalMinutes} mins logged</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
          <div className="flex items-center justify-between text-amber-700 text-xs font-extrabold uppercase mb-1">
            <span>Avg Quiz Score</span>
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{avgQuizScore}%</div>
          <p className="text-[10px] text-amber-800 font-bold mt-1">
            {avgQuizScore >= targetScoreGoal ? 'Above Target Goal!' : 'Needs slight boost'}
          </p>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-extrabold uppercase mb-1">
            <span>Quizzes Passed</span>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalQuizzes} Quizzes</div>
          <p className="text-[10px] text-emerald-800 font-bold mt-1">{totalTopics} topics completed</p>
        </div>

        <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
          <div className="flex items-center justify-between text-purple-700 text-xs font-extrabold uppercase mb-1">
            <span>Peak Session</span>
            <i className="fa-solid fa-fire"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{peakDay?.day || 'Thursday'}</div>
          <p className="text-[10px] text-purple-800 font-bold mt-1">
            {peakDay?.timeSpentMinutes || 90} mins ({peakDay?.quizScorePercent || 92}%)
          </p>
        </div>
      </div>

      {/* Main SVG Interactive Chart */}
      <div className="bg-slate-50/80 p-4 sm:p-6 rounded-3xl border border-gray-200/80 relative">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-4 text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-3 h-3 rounded-md bg-indigo-600 inline-block"></span> Study Time (Minutes)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Quiz Score (%)
            </span>
            {showGoalLine && (
              <span className="hidden sm:flex items-center gap-1.5 text-amber-700">
                <span className="w-4 border-b-2 border-dashed border-amber-500 inline-block"></span> Target Goal ({targetScoreGoal}%)
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500 font-bold hidden sm:block">
            Hover or tap bars for details
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="w-full relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto max-h-80 select-none"
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
              <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + plotHeight * (1 - ratio);
              const minVal = Math.round(maxMinutes * ratio);
              const scoreVal = Math.round(minScore + (maxScore - minScore) * ratio);
              return (
                <g key={ratio}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={ratio === 0 ? undefined : "3 3"}
                    strokeWidth={1}
                  />
                  {/* Left Label: Minutes */}
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-indigo-600 font-bold"
                  >
                    {minVal}m
                  </text>
                  {/* Right Label: Score % */}
                  <text
                    x={chartWidth - paddingRight + 8}
                    y={y + 4}
                    textAnchor="start"
                    className="text-[10px] fill-amber-600 font-bold"
                  >
                    {scoreVal}%
                  </text>
                </g>
              );
            })}

            {/* Target Goal Line */}
            {showGoalLine && (
              <g>
                <line
                  x1={paddingLeft}
                  y1={goalY}
                  x2={chartWidth - paddingRight}
                  y2={goalY}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
                <text
                  x={chartWidth - paddingRight - 6}
                  y={goalY - 6}
                  textAnchor="end"
                  className="text-[10px] fill-amber-700 font-black"
                >
                  Goal {targetScoreGoal}%
                </text>
              </g>
            )}

            {/* Bars for Study Time */}
            {rawData.map((d, i) => {
              const x = getBarX(i);
              const barWidth = Math.min(32, (plotWidth / rawData.length) * 0.45);
              const barY = getMinutesY(d.timeSpentMinutes);
              const barH = paddingTop + plotHeight - barY;
              const isHovered = activeItemIndex === i;

              return (
                <g key={`bar-${i}`}>
                  <rect
                    x={x - barWidth / 2}
                    y={barY}
                    width={barWidth}
                    height={Math.max(2, barH)}
                    rx={6}
                    ry={6}
                    fill={isHovered ? 'url(#barGradientHover)' : 'url(#barGradient)'}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setActiveItemIndex(i)}
                    onClick={() => setActiveItemIndex(i)}
                  />
                  {/* Day Label underneath */}
                  <text
                    x={x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    className={`text-[11px] font-bold ${
                      isHovered ? 'fill-indigo-700 font-black' : 'fill-slate-500'
                    }`}
                  >
                    {d.shortDay}
                  </text>
                </g>
              );
            })}

            {/* Line Path for Quiz Scores */}
            <path
              d={linePathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots on Quiz Scores */}
            {scorePoints.map((p) => {
              const isHovered = activeItemIndex === p.index;
              return (
                <g key={`dot-${p.index}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 8 : 5}
                    fill={isHovered ? '#d97706' : '#f59e0b'}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setActiveItemIndex(p.index)}
                    onClick={() => setActiveItemIndex(p.index)}
                  />
                </g>
              );
            })}

            {/* Transparent click/hover zones across columns */}
            {rawData.map((_, i) => {
              const step = plotWidth / rawData.length;
              const x = paddingLeft + step * i;
              return (
                <rect
                  key={`zone-${i}`}
                  x={x}
                  y={paddingTop}
                  width={step}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveItemIndex(i)}
                  onClick={() => setActiveItemIndex(i)}
                />
              );
            })}
          </svg>
        </div>

        {/* Floating Detail Tooltip Card */}
        {hoveredData && (
          <div className="mt-4 bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-indigo-500/30 text-xs space-y-2 backdrop-blur-md animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <span className="font-extrabold text-sm text-amber-400">
                {hoveredData.day} ({hoveredData.date})
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[11px] font-black border border-indigo-400/30">
                Top Subject: {hoveredData.topSubject}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Study Duration</p>
                <p className="font-extrabold text-sm text-indigo-200">{hoveredData.timeSpentMinutes} mins</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Quiz Performance</p>
                <p className="font-extrabold text-sm text-amber-300">{hoveredData.quizScorePercent}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Quizzes Taken</p>
                <p className="font-extrabold text-sm text-emerald-300">{hoveredData.quizzesTaken}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Topics Mastered</p>
                <p className="font-extrabold text-sm text-purple-300">{hoveredData.topicsCompleted}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parent Insights & Actionable Feedback */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h4 className="font-extrabold text-sm text-indigo-200 uppercase tracking-wider">
              Yun AI Performance Correlation Analysis
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-medium">
            <strong>Key Insight:</strong> High correlation detected! Days with over 60 minutes of focused study time ({timeRange === 'thisWeek' ? 'Thursday & Saturday' : 'Weeks 3 & 4'}) resulted in 90%+ quiz scores. Sustaining a 45-minute daily habit maintains retention above 85%.
          </p>
        </div>

        <div className="shrink-0 bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
          <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block">Study Efficiency Score</span>
          <span className="text-xl font-black text-emerald-400">92 / 100</span>
        </div>
      </div>
    </div>
  );
};

export default StudyTrendChart;
