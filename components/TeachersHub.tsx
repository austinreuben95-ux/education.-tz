import React, { useState } from 'react';

export interface ResourceItem {
  id: string;
  title: string;
  type: 'Scheme of Work' | 'Lesson Plan' | 'TIE Syllabus' | 'Teaching Aid';
  level: 'Primary' | 'Secondary O-Level' | 'High School A-Level';
  grade: string;
  subject: string;
  fileFormat: 'PDF' | 'DOCX';
  downloads: number;
  description: string;
}

const TEACHER_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Azimio la Kazi: Hisabati Darasa la 7 (2023 TIE Curriculum)',
    type: 'Scheme of Work',
    level: 'Primary',
    grade: 'Standard 7',
    subject: 'Mathematics',
    fileFormat: 'DOCX',
    downloads: 1420,
    description: 'Fully editable scheme of work for Standard 7 Mathematics aligning with the 2023 Tanzania Institute of Education syllabus.'
  },
  {
    id: 'res-2',
    title: 'Lesson Plan Template: Basic Physics Form 4 - Electromagnetism',
    type: 'Lesson Plan',
    level: 'Secondary O-Level',
    grade: 'Form 4',
    subject: 'Physics',
    fileFormat: 'PDF',
    downloads: 980,
    description: '40-minute step-by-step lesson plan with teacher activity, student tasks, and assessment questions.'
  },
  {
    id: 'res-3',
    title: 'TIE Official Curriculum Syllabus: Vocational & Technical Streams (2023)',
    type: 'TIE Syllabus',
    level: 'Secondary O-Level',
    grade: 'Form 1 - 4',
    subject: 'Vocational Studies',
    fileFormat: 'PDF',
    downloads: 2310,
    description: 'Official Ministry syllabus detailing new vocational streams including Agriculture, ICT, Tailoring, and Building Construction.'
  },
  {
    id: 'res-4',
    title: 'Visual Teaching Aid: Human Digestive System Diagram (Kiswahili & English)',
    type: 'Teaching Aid',
    level: 'Primary',
    grade: 'Standard 5-7',
    subject: 'Science',
    fileFormat: 'PDF',
    downloads: 1850,
    description: 'High-resolution printable classroom visual poster with bilingual labels for biology lessons.'
  },
  {
    id: 'res-5',
    title: 'Azimio la Kazi: Kiswahili Form 2 (Mhula wa 1 na 2)',
    type: 'Scheme of Work',
    level: 'Secondary O-Level',
    grade: 'Form 2',
    subject: 'Kiswahili',
    fileFormat: 'DOCX',
    downloads: 1120,
    description: 'Scheme of work for Form 2 Kiswahili covering Sarufi, Fasihi, and Ufahamu.'
  }
];

const TeachersHub: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [downloadedMap, setDownloadedMap] = useState<Record<string, boolean>>({});

  const filteredResources = TEACHER_RESOURCES.filter((res) => {
    if (selectedType !== 'ALL' && res.type !== selectedType) return false;
    if (selectedLevel !== 'ALL' && res.level !== selectedLevel) return false;
    return true;
  });

  const handleDownload = (id: string, title: string) => {
    setDownloadedMap(prev => ({ ...prev, [id]: true }));
    // Simulate download
    const element = document.createElement("a");
    const file = new Blob([`Resource Document: ${title}\nCategory: Tanzanian Teacher's Hub\nDownloaded via EducationTZ`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Banner */}
      <div className="bg-emerald-gradient text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 font-extrabold text-xs uppercase tracking-wider border border-white/20">
            <i className="fa-solid fa-chalkboard-user"></i> Tanzanian Educators Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Teacher's Resource Hub (Mipango & Maazimio)
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Download verified Schemes of Work (Azimio la Kazi), Lesson Plans (Mipango ya Somo), official TIE 2023 syllabi, and visual teaching aids for your classroom.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Scheme of Work', 'Lesson Plan', 'TIE Syllabus', 'Teaching Aid'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                selectedType === t
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'ALL' ? 'All Types' : t}
            </button>
          ))}
        </div>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 bg-gray-50 focus:bg-white outline-none"
        >
          <option value="ALL">All Levels</option>
          <option value="Primary">Primary School</option>
          <option value="Secondary O-Level">Secondary O-Level</option>
          <option value="High School A-Level">High School A-Level</option>
        </select>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-emerald-300 transition shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-100">
                  {res.type}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {res.fileFormat} • {res.downloads} downloads
                </span>
              </div>

              <h3 className="text-lg font-black text-gray-900 leading-snug">{res.title}</h3>
              <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">{res.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
                {res.grade} ({res.subject})
              </span>

              <button
                onClick={() => handleDownload(res.id, res.title)}
                className={`px-4 py-2 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                  downloadedMap[res.id]
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200'
                }`}
              >
                {downloadedMap[res.id] ? (
                  <>
                    <i className="fa-solid fa-circle-check"></i> Downloaded
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-download"></i> Download Free
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersHub;
