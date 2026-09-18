import React, { useState } from 'react';

export type NectaGrade = 'A' | 'B+' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SubjectItem {
  id: number;
  name: string;
  grade: NectaGrade;
}

// NECTA CSEE Point System (Fewer points = Better Division)
export const GRADE_POINTS: Record<NectaGrade, number> = {
  'A': 1,
  'B+': 2,
  'B': 3,
  'C': 4,
  'D': 5,
  'E': 6,
  'F': 7,
};

// University/College Equivalent Grade Points (5.0 Scale)
export const GPA_POINTS: Record<NectaGrade, number> = {
  'A': 5.0,
  'B+': 4.0,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'E': 0.5,
  'F': 0.0,
};

// Default 7 compulsory core subjects
const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: 1, name: 'Civics', grade: 'C' },
  { id: 2, name: 'History', grade: 'C' },
  { id: 3, name: 'Geography', grade: 'B' },
  { id: 4, name: 'Kiswahili', grade: 'A' },
  { id: 5, name: 'English Language', grade: 'B+' },
  { id: 6, name: 'Biology', grade: 'C' },
  { id: 7, name: 'Basic Mathematics', grade: 'D' },
];

export interface NectaCalculatorProps {
  goHome?: () => void;
}

export default function NectaCalculator({ goHome }: NectaCalculatorProps) {
  const [subjects, setSubjects] = useState<SubjectItem[]>(DEFAULT_SUBJECTS);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Handle grade change
  const handleGradeChange = (id: number, grade: NectaGrade) => {
    setSubjects(
      subjects.map((sub) => (sub.id === id ? { ...sub, grade } : sub))
    );
  };

  // Add extra optional subject (e.g., Physics, Chemistry, Commerce)
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    setSubjects([
      ...subjects,
      { id: Date.now(), name: newSubjectName.trim(), grade: 'C' },
    ]);
    setNewSubjectName('');
  };

  // Remove optional subject
  const handleRemoveSubject = (id: number) => {
    if (subjects.length <= 7) {
      alert('NECTA calculation requires at least 7 subjects.');
      return;
    }
    setSubjects(subjects.filter((sub) => sub.id !== id));
  };

  // Calculate NECTA Points (Best 7)
  const calculateResults = () => {
    if (subjects.length < 7) {
      return { totalPoints: 0, division: 'N/A', gpa: '0.00', bestSeven: [] as SubjectItem[] };
    }

    // Sort subjects by best performance (lowest point values)
    const sortedSubjects = [...subjects].sort(
      (a, b) => GRADE_POINTS[a.grade] - GRADE_POINTS[b.grade]
    );

    // Take top 7 subjects
    const bestSeven = sortedSubjects.slice(0, 7);
    const totalPoints = bestSeven.reduce(
      (sum, sub) => sum + GRADE_POINTS[sub.grade],
      0
    );

    // Calculate Division based on total points
    let division = 'Division 0';
    if (totalPoints >= 7 && totalPoints <= 17) division = 'Division I';
    else if (totalPoints >= 18 && totalPoints <= 21) division = 'Division II';
    else if (totalPoints >= 22 && totalPoints <= 25) division = 'Division III';
    else if (totalPoints >= 26 && totalPoints <= 33) division = 'Division IV';

    // Calculate GPA across all entered subjects (5.0 scale)
    const totalGpaPoints = subjects.reduce(
      (sum, sub) => sum + GPA_POINTS[sub.grade],
      0
    );
    const gpa = (totalGpaPoints / subjects.length).toFixed(2);

    return { totalPoints, division, gpa, bestSeven };
  };

  const { totalPoints, division, gpa, bestSeven } = calculateResults();

  return (
    <div className="max-w-3xl mx-auto my-6 p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100 font-sans animate-fade-in text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <i className="fa-solid fa-calculator text-indigo-600"></i>
          NECTA Form 4 Division & GPA Calculator
        </h2>
        {goHome && (
          <button
            onClick={goHome}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-arrow-left"></i> Home
          </button>
        )}
      </div>

      {/* Result Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Division</span>
          <span className="text-2xl font-black mt-1" style={{ color: getDivisionColor(division) }}>
            {division}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Best 7 Points</span>
          <span className="text-2xl font-black text-slate-800 mt-1">{totalPoints} Points</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Overall GPA</span>
          <span className="text-2xl font-black text-indigo-600 mt-1">{gpa} / 5.00</span>
        </div>
      </div>

      {/* Subject Input Table */}
      <div className="overflow-x-auto mb-6 rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider">
              <th className="p-3.5">Subject</th>
              <th className="p-3.5">Grade</th>
              <th className="p-3.5">Points</th>
              <th className="p-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map((sub) => {
              const isBestSeven = bestSeven.some((b) => b.id === sub.id);
              return (
                <tr
                  key={sub.id}
                  className={`transition-colors ${
                    isBestSeven ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="p-3.5 text-sm text-slate-900">
                    <span className="font-bold">{sub.name}</span>
                    {isBestSeven && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Best 7
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={sub.grade}
                      onChange={(e) => handleGradeChange(sub.id, e.target.value as NectaGrade)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 font-extrabold text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(Object.keys(GRADE_POINTS) as NectaGrade[]).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3.5 text-sm font-black text-slate-700">{GRADE_POINTS[sub.grade]}</td>
                  <td className="p-3.5 text-center">
                    {subjects.length > 7 && (
                      <button
                        onClick={() => handleRemoveSubject(sub.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm transition flex items-center justify-center mx-auto"
                        title="Remove optional subject"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Subject */}
      <form onSubmit={handleAddSubject} className="flex gap-2.5">
        <input
          type="text"
          placeholder="Add optional subject (e.g. Physics, Chemistry)"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl font-medium text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-md flex items-center gap-1.5"
        >
          + Add Subject
        </button>
      </form>
    </div>
  );
}

// Color coding for Divisions
function getDivisionColor(division: string): string {
  switch (division) {
    case 'Division I':
      return '#16a34a';
    case 'Division II':
      return '#2563eb';
    case 'Division III':
      return '#d97706';
    case 'Division IV':
      return '#dc2626';
    default:
      return '#6b7280';
  }
}
