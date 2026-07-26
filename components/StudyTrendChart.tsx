import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

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

const SUBJECT_BREAKDOWN_DATA: SubjectTrendData[] = [
  { subject: 'Mathematics', totalTimeMinutes: 110, avgQuizScore: 88, quizzesTaken: 6 },
  { subject: 'Physics', totalTimeMinutes: 85, avgQuizScore: 82, quizzesTaken: 4 },
  { subject: 'Chemistry', totalTimeMinutes: 60, avgQuizScore: 79, quizzesTaken: 3 },
  { subject: 'Biology', totalTimeMinutes: 95, avgQuizScore: 94, quizzesTaken: 5 },
  { subject: 'Kiswahili', totalTimeMinutes: 50, avgQuizScore: 90, quizzesTaken: 2 },
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
  const [timeRange, setTimeRange] = useState<'thisWeek' | 'lastMonth' | 'bySubject'>('thisWeek');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [showGoalLine, setShowGoalLine] = useState<boolean>(true);
  const [weeklyData, setWeeklyData] = useState<WeeklyStudyData[]>(DEFAULT_WEEKLY_DATA);

  // Quick stats calculations
  const filteredData = weeklyData.filter(d => 
    selectedSubjectFilter === 'ALL' || d.topSubject === selectedSubjectFilter
  );

  const totalMinutes = filteredData.reduce((acc, curr) => acc + curr.timeSpentMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgQuizScore = filteredData.length > 0
    ? Math.round(filteredData.reduce((acc, curr) => acc + curr.quizScorePercent, 0) / filteredData.length)
    : 0;
  const totalQuizzes = filteredData.reduce((acc, curr) => acc + curr.quizzesTaken, 0);
  const totalTopics = filteredData.reduce((acc, curr) => acc + curr.topicsCompleted, 0);

  const peakDay = [...filteredData].sort((a, b) => b.timeSpentMinutes - a.timeSpentMinutes)[0];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: WeeklyStudyData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-indigo-500/30 text-xs space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <span className="font-extrabold text-sm text-amber-400">{data.day} ({data.date})</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-black border border-indigo-400/30">
              {data.topSubject}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Study Time</p>
                <p className="font-extrabold text-sm text-indigo-200">{data.timeSpentMinutes} mins</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-black">Quiz Performance</p>
                <p className="font-extrabold text-sm text-amber-300">{data.quizScorePercent}%</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300 font-medium">
            <span>Quizzes: <strong>{data.quizzesTaken}</strong></span>
            <span>Topics Completed: <strong>{data.topicsCompleted}</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

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
              onClick={() => setTimeRange('thisWeek')}
              className={`px-3 py-1.5 rounded-xl transition ${
                timeRange === 'thisWeek'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('lastMonth')}
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
          <p className="text-[10px] text-indigo-700 font-bold mt-1">{totalMinutes} mins logged this week</p>
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
          <p className="text-[10px] text-emerald-800 font-bold mt-1">{totalTopics} syllabus topics covered</p>
        </div>

        <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
          <div className="flex items-center justify-between text-purple-700 text-xs font-extrabold uppercase mb-1">
            <span>Peak Day</span>
            <i className="fa-solid fa-fire"></i>
          </div>
          <div className="text-2xl font-black text-gray-900">{peakDay?.day || 'Thursday'}</div>
          <p className="text-[10px] text-purple-800 font-bold mt-1">{peakDay?.timeSpentMinutes || 90} mins ({peakDay?.quizScorePercent || 92}%)</p>
        </div>
      </div>

      {/* Main Recharts Graphic Container */}
      <div className="bg-slate-50/80 p-4 sm:p-6 rounded-3xl border border-gray-200/80">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-4 text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-3 h-3 rounded-md bg-indigo-600 inline-block"></span> Study Time (Minutes)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Quiz Score (%)
            </span>
          </div>

          <div className="text-xs text-gray-500 font-bold hidden sm:block">
            Hover or tap chart points for breakdown
          </div>
        </div>

        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={timeRange === 'thisWeek' ? filteredData : DEFAULT_WEEKLY_DATA}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              
              <XAxis 
                dataKey="shortDay" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
              />

              {/* Left Y-Axis: Minutes */}
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#4f46e5"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#4f46e5', fontSize: 11, fontWeight: 700 }}
                unit="m"
                domain={[0, 120]}
              />

              {/* Right Y-Axis: Score Percent */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#d97706"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#d97706', fontSize: 11, fontWeight: 700 }}
                unit="%"
                domain={[50, 100]}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend 
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }}
              />

              {/* Goal Reference Line */}
              {showGoalLine && (
                <ReferenceLine
                  yAxisId="right"
                  y={targetScoreGoal}
                  label={{ value: `Goal (${targetScoreGoal}%)`, fill: '#b45309', fontSize: 10, fontWeight: 'bold', position: 'insideTopRight' }}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              )}

              {/* Bar: Study Time */}
              <Bar
                yAxisId="left"
                dataKey="timeSpentMinutes"
                name="Study Time (Mins)"
                fill="#4f46e5"
                radius={[8, 8, 0, 0]}
                barSize={28}
              />

              {/* Line: Quiz Performance */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quizScorePercent"
                name="Quiz Performance (%)"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8, fill: '#d97706' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
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
            <strong>Key Insight:</strong> High correlation detected! Days with over 60 minutes of focused study time (Thursday & Saturday) resulted in 90%+ quiz scores. Sustaining a 45-minute daily habit maintains retention above 85%.
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
