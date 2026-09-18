import React, { useState } from 'react';

export interface SubjectProficiency {
  subject: string;
  score: number; // 0 to 100
  classAverage?: number; // 0 to 100
  icon: string;
  color: string;
}

interface RadarChartProps {
  data: SubjectProficiency[];
  size?: number;
  showComparison?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 320, showComparison = true }) => {
  const [hoveredSubject, setHoveredSubject] = useState<SubjectProficiency | null>(null);

  if (!data || data.length === 0) return null;

  const center = size / 2;
  const radius = center - 50; // Leave margin for labels
  const totalAxes = data.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Generate radar polygon coordinates for a given value key
  const getCoordinates = (valueKey: 'score' | 'classAverage') => {
    return data.map((d, i) => {
      const val = Math.min(100, Math.max(0, d[valueKey] ?? 0));
      const r = (val / 100) * radius;
      const angle = angleSlice * i - Math.PI / 2; // Start from top (-90 deg)
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, val, subject: d.subject };
    });
  };

  const studentPoints = getCoordinates('score');
  const studentPolygonStr = studentPoints.map(p => `${p.x},${p.y}`).join(' ');

  const classPoints = showComparison ? getCoordinates('classAverage') : [];
  const classPolygonStr = classPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Grid circles/polygons (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getGridPolygon = (level: number) => {
    return data.map((_, i) => {
      const r = radius * level;
      const angle = angleSlice * i - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Get label position slightly past full radius
  const getLabelPos = (i: number) => {
    const r = radius + 28;
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getGradeBadge = (score: number) => {
    if (score >= 80) return { label: 'A (Mastery)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 65) return { label: 'B (Proficient)', color: 'bg-sky-100 text-sky-800 border-sky-300' };
    if (score >= 50) return { label: 'C (Satisfactory)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (score >= 40) return { label: 'D (Developing)', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    return { label: 'F (Needs Focus)', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs uppercase tracking-wider mb-1 border border-indigo-100">
            <i className="fa-solid fa-chart-radar"></i> Academic Radar
          </div>
          <h3 className="text-xl font-black text-gray-900">Subject Proficiency Chart</h3>
          <p className="text-xs text-gray-500">Visual strength & weakness analysis based on quiz and exam performance</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 inline-block shadow-sm"></span>
            <span className="text-gray-700">Student Performance</span>
          </div>
          {showComparison && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/60 inline-block border border-emerald-500"></span>
              <span className="text-gray-500">Tanzania Benchmark</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* SVG Radar Chart */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="overflow-visible select-none drop-shadow-sm">
            {/* Grid Web Background */}
            {gridLevels.map((lvl, idx) => (
              <polygon
                key={idx}
                points={getGridPolygon(lvl)}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={idx === gridLevels.length - 1 ? 1.5 : 1}
                strokeDasharray={idx < gridLevels.length - 1 ? "3 3" : "none"}
              />
            ))}

            {/* Axis Lines */}
            {data.map((_, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              );
            })}

            {/* Class Benchmark Polygon */}
            {showComparison && classPoints.length > 0 && (
              <polygon
                points={classPolygonStr}
                fill="rgba(16, 185, 129, 0.12)"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )}

            {/* Student Polygon */}
            <polygon
              points={studentPolygonStr}
              fill="rgba(99, 102, 241, 0.25)"
              stroke="#6366f1"
              strokeWidth="3"
              className="transition-all duration-500 ease-out"
            />

            {/* Student Data Dots */}
            {studentPoints.map((pt, i) => {
              const isHovered = hoveredSubject?.subject === pt.subject;
              return (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredSubject(data[i])} onMouseLeave={() => setHoveredSubject(null)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "7" : "5"}
                    fill="#4f46e5"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}
                </g>
              );
            })}

            {/* Axis Subject Labels */}
            {data.map((d, i) => {
              const pos = getLabelPos(i);
              const isHovered = hoveredSubject?.subject === d.subject;
              return (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="11"
                  fontWeight={isHovered ? "800" : "700"}
                  fill={isHovered ? "#4f46e5" : "#334155"}
                  className="transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredSubject(d)}
                  onMouseLeave={() => setHoveredSubject(null)}
                >
                  {d.subject} ({d.score}%)
                </text>
              );
            })}
          </svg>
        </div>

        {/* Interactive Subject Score List */}
        <div className="w-full lg:flex-1 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
            Subject Breakdown & Mastery Status
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {data.map((item, idx) => {
              const badge = getGradeBadge(item.score);
              const isHovered = hoveredSubject?.subject === item.subject;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredSubject(item)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isHovered
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-sm scale-[1.01]'
                      : 'bg-gray-50 border-gray-100 hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm ${item.color}`}>
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-800">{item.subject}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <span>Score: <strong className="text-gray-900">{item.score}%</strong></span>
                        {item.classAverage && (
                          <span>| Avg: <strong className="text-gray-600">{item.classAverage}%</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Target Recommendations */}
      <div className="mt-6 pt-4 border-t border-gray-100 bg-indigo-50/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          <div>
            <h5 className="font-bold text-sm text-indigo-950">AI Diagnostic Insight</h5>
            <p className="text-xs text-indigo-800">
              Your strongest subject is <strong className="text-indigo-900">{data.reduce((max, curr) => curr.score > max.score ? curr : max, data[0])?.subject}</strong>. 
              Spend extra practice time on <strong className="text-indigo-900">{data.reduce((min, curr) => curr.score < min.score ? curr : min, data[0])?.subject}</strong> to raise your overall NECTA division grade!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
