import React, { useState, useEffect } from 'react';

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  level: string;
  content: string;
  keyPoints: string[];
  updatedAt: string;
  isCustom?: boolean;
}

const PREBUILT_STUDY_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'NECTA Form 4 Mathematics: Quadratic Equations & Formula',
    subject: 'Mathematics',
    level: 'Secondary (O-Level)',
    updatedAt: '2026-07-20',
    content: `
# Quadratic Equations Overview
A quadratic equation is a second-order polynomial equation in a single variable x: ax² + bx + c = 0, where a ≠ 0.

## Methods of Solving Quadratic Equations:
1. **Factoring Method**: Express ax² + bx + c as (px + q)(rx + s) = 0.
2. **Completing the Square**: Rearrange to (x + d)² = e.
3. **Quadratic Formula**:
   x = (-b ± √(b² - 4ac)) / (2a)

## Discriminant (Δ = b² - 4ac):
- If Δ > 0: Two real and distinct roots.
- If Δ = 0: One repeated real root.
- If Δ < 0: No real roots (complex roots).

## Common NECTA Exam Question Types:
- Finding roots of quadratic graphs.
- Word problems involving areas, speeds, and projectile motion.
    `,
    keyPoints: [
      'Standard Form: ax² + bx + c = 0',
      'Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
      'Discriminant Δ = b² - 4ac determines nature of roots',
      'Factoring works best when roots are integers'
    ]
  },
  {
    id: 'note-2',
    title: 'Biology Form 2: Cell Structure & Function Cheat Sheet',
    subject: 'Biology',
    level: 'Secondary (O-Level)',
    updatedAt: '2026-07-18',
    content: `
# Cell Structure Summary
Cells are the basic structural and functional units of all living organisms.

## Key Organelles & Functions:
- **Nucleus**: Contains genetic material (DNA), controls cell activities.
- **Mitochondria**: Site of aerobic respiration, produces ATP energy.
- **Ribosomes**: Site of protein synthesis.
- **Cell Membrane**: Semi-permeable layer controlling entry/exit of substances.
- **Chloroplasts** (Plant Cells Only): Contains chlorophyll for photosynthesis.
- **Cell Wall** (Plant & Fungal Cells): Made of cellulose, provides structural rigidity.

## Plant vs Animal Cells Comparison:
- Plant cells have chloroplasts, large central vacuole, and rigid cell wall.
- Animal cells lack cell walls and chloroplasts, have small temporary vacuoles.
    `,
    keyPoints: [
      'Nucleus = Control Center of Cell',
      'Mitochondria = Powerhouse (respiration)',
      'Chloroplasts = Site of Photosynthesis (Plant cells only)',
      'Cell Membrane = Semi-permeable boundary'
    ]
  },
  {
    id: 'note-3',
    title: 'Civics Form 3: Governance & Democracy in Tanzania',
    subject: 'Civics',
    level: 'Secondary (O-Level)',
    updatedAt: '2026-07-15',
    content: `
# Governance & Democracy Notes

## Pillars of Democratic Governance:
1. **Rule of Law**: All citizens and leaders are equal before the law.
2. **Separation of Powers**:
   - **Executive**: Enforces laws (President, Cabinet, Civil Service).
   - **Legislature**: Makes laws (National Assembly / Bunge).
   - **Judiciary**: Interprets laws (High Court, Court of Appeal).
3. **Human Rights**: Protection of basic freedoms (speech, assembly, education).
4. **Free & Fair Elections**: Held every 5 years under the National Electoral Commission.

## Responsibilities of a Tanzanian Citizen:
- Paying taxes promptly.
- Participating in community development work (Ujamaa / Kazi na Utu).
- Protecting public infrastructure and environment.
- Voting in general elections.
    `,
    keyPoints: [
      'Three Branches: Executive, Legislature, Judiciary',
      'Rule of Law guarantees equality before law',
      'General Elections held every 5 years',
      'Active citizenship involves civic participation and tax payment'
    ]
  },
  {
    id: 'note-4',
    title: 'Physics Form 1: Newton\'s Laws of Motion & Momentum',
    subject: 'Physics',
    level: 'Secondary (O-Level)',
    updatedAt: '2026-07-10',
    content: `
# Newton's Three Laws of Motion

## 1. First Law (Law of Inertia)
An object remains at rest or continues to move at constant velocity unless acted upon by a net external force.

## 2. Second Law (F = ma)
The rate of change of momentum is directly proportional to the applied force and takes place in the direction of force.
Formula: **F = m × a** (Force = mass × acceleration)

## 3. Third Law (Action & Reaction)
For every action, there is an equal and opposite reaction.

## Momentum (p):
- **p = m × v** (Unit: kg·m/s)
- Principle of Conservation of Momentum: Total momentum before collision equals total momentum after collision in an isolated system.
    `,
    keyPoints: [
      '1st Law: Inertia (resistance to change in motion)',
      '2nd Law: F = ma',
      '3rd Law: Action = -Reaction',
      'Momentum p = m × v'
    ]
  },
  {
    id: 'note-5',
    title: 'Kiswahili Form 4: Sarufi na Matumizi ya Lugha',
    subject: 'Kiswahili',
    level: 'Secondary (O-Level)',
    updatedAt: '2026-07-05',
    content: `
# Muhtasari wa Sarufi ya Kiswahili

## Ngeli za Nomino:
- **A-WA**: Nomino za viumbe hai (Mtu/Watu, Mnyama/Wanyama).
- **KI-VI**: Nomino za vitu na zana (Kiti/Viti, Kitabu/Vitabu).
- **U-I**: Nomino za miti na mimea (Mti/Miti, Mfuko/Mifuko).
- **LI-YA**: Nomino za ukubwa na majina fulani (Tunda/Matunda, Jicho/Macho).
- **I-ZI**: Nomino zisizobadilika umbo (Nyumba/Nyumba, Sahani/Sahani).

## Aina za Maneno:
1. **Nomino (N)**: Majina ya watu, mahali, vitu au dhana.
2. **Kitenzi (T)**: Neno linaloeleza kitendo (Kula, Kusoma, Kukimbia).
3. **Kivumishi (V)**: Neno linaloeleza sifa au idadi ya nomino.
4. **Kielezi (E)**: Neno linaloeleza namna kitendo kilivyofanyika.
    `,
    keyPoints: [
      'Ngeli kuu: A-WA, KI-VI, U-I, LI-YA, I-ZI',
      'Nomino (N) = Majina',
      'Kitenzi (T) = Vitendo',
      'Kivumishi (V) = Sifa za nomino'
    ]
  },
  {
    id: 'note-6',
    title: 'Primary Standard 7: Science - Water Cycle & Purification',
    subject: 'Science',
    level: 'Primary School',
    updatedAt: '2026-07-01',
    content: `
# Primary Science: The Water Cycle & Water Safety

## Stages of Water Cycle:
1. **Evaporation**: Sun heats water in lakes/oceans turning it into vapor.
2. **Transpiration**: Water loss from plant leaves into the atmosphere.
3. **Condensation**: Water vapor cools and turns into clouds.
4. **Precipitation**: Rain, snow, or hail falls back to Earth.

## Methods of Water Purification:
- **Boiling**: Kills pathogens and bacteria (Boil for at least 10 minutes).
- **Filtration**: Removes suspended physical particles using sand/charcoal filters.
- **Chlorination**: Chemical disinfection using waterguard tablets.
    `,
    keyPoints: [
      '4 Main Stages: Evaporation, Transpiration, Condensation, Precipitation',
      'Boiling is the simplest way to kill bacteria',
      'Filtration removes dirt particles',
      'Clean water prevents cholera and typhoid'
    ]
  }
];

export const NotesHub: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<StudyNote>(PREBUILT_STUDY_NOTES[0]);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'custom'>('syllabus');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');

  // Custom User Notes State
  const [customNotes, setCustomNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('elimu_user_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newContent, setNewContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    localStorage.setItem('elimu_user_notes', JSON.stringify(customNotes));
  }, [customNotes]);

  const handleSaveCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNote: StudyNote = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      level: 'Personal Scratchpad',
      content: newContent,
      keyPoints: newContent.split('\n').filter(line => line.trim().startsWith('-')).map(l => l.replace('-', '').trim()).slice(0, 4),
      updatedAt: new Date().toISOString().split('T')[0],
      isCustom: true
    };

    setCustomNotes([newNote, ...customNotes]);
    setSelectedNote(newNote);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const handleDeleteCustomNote = (id: string) => {
    const updated = customNotes.filter(n => n.id !== id);
    setCustomNotes(updated);
    if (selectedNote.id === id) {
      setSelectedNote(updated[0] || PREBUILT_STUDY_NOTES[0]);
    }
  };

  const downloadNoteAsTxt = (note: StudyNote) => {
    const element = document.createElement("a");
    const file = new Blob([`${note.title}\nSubject: ${note.subject}\nDate: ${note.updatedAt}\n\n${note.content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const currentNotesList = activeTab === 'syllabus' ? PREBUILT_STUDY_NOTES : customNotes;

  const filteredNotes = currentNotesList.filter((note) => {
    const matchesSubject = selectedSubjectFilter === 'ALL' || note.subject === selectedSubjectFilter;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const subjectsList = ['ALL', 'Mathematics', 'Biology', 'Civics', 'Physics', 'Kiswahili', 'Science'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase text-emerald-200 border border-white/20">
            <i className="fa-solid fa-note-sticky text-yellow-400"></i> Syllabus Notes & Personal Study Vault
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            Comprehensive <span className="text-yellow-400">Study Notes</span> Hub
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Access hundreds of TIE syllabus notes, key formulas, NECTA revision summaries, and create your own offline-ready personal study notes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => { setActiveTab('syllabus'); setIsCreating(false); }}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
                activeTab === 'syllabus'
                  ? 'bg-yellow-400 text-emerald-950 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="fa-solid fa-book-open"></i> TIE Syllabus Pre-built Notes
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
                activeTab === 'custom'
                  ? 'bg-yellow-400 text-emerald-950 shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="fa-solid fa-pen-to-square"></i> My Personal Scratchpad ({customNotes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Notes Navigator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-2 border-gray-100 shadow-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search notes by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-500 text-xs font-bold text-gray-800 outline-none transition"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-1.5">
              {subjectsList.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubjectFilter(sub)}
                  className={`px-3 py-1 rounded-xl font-extrabold text-[11px] transition ${
                    selectedSubjectFilter === sub
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {activeTab === 'custom' && (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Create New Study Note
              </button>
            )}
          </div>

          {/* List of Notes */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id && !isCreating;
              return (
                <div
                  key={note.id}
                  onClick={() => { setSelectedNote(note); setIsCreating(false); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                      : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        {note.subject}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{note.updatedAt}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-900 line-clamp-1">{note.title}</h4>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2">{note.content.replace(/#|\*/g, '')}</p>
                  </div>

                  {note.isCustom && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCustomNote(note.id); }}
                      className="text-gray-300 hover:text-red-500 p-1 transition"
                      title="Delete Note"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  )}
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-500 text-xs">
                {activeTab === 'custom' ? 'No personal notes created yet. Click "Create New Study Note" above!' : 'No syllabus notes match your filter.'}
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7">
          {isCreating ? (
            /* Note Creation Form */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <i className="fa-solid fa-pen-clip text-emerald-600"></i> New Personal Study Note
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveCustomNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Note Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Form 4 Chemistry Periodic Table Summary"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 text-xs font-bold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 text-xs font-bold text-gray-800 outline-none bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Civics">Civics</option>
                    <option value="Geography">Geography</option>
                    <option value="History">History</option>
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Note Content & Formulas</label>
                  <textarea
                    rows={12}
                    placeholder="Write your study summary, definitions, or equations here..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-emerald-500 text-xs font-mono text-gray-800 outline-none leading-relaxed"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition"
                >
                  Save Note to Vault
                </button>
              </form>
            </div>
          ) : selectedNote ? (
            /* Note Viewer */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm space-y-6 sticky top-24">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {selectedNote.subject} • {selectedNote.level}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{selectedNote.title}</h2>
                  <span className="text-xs text-gray-400 font-medium mt-1 block">
                    Updated on {selectedNote.updatedAt}
                  </span>
                </div>

                <button
                  onClick={() => downloadNoteAsTxt(selectedNote)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition flex items-center gap-2"
                  title="Download Note File for Offline Study"
                >
                  <i className="fa-solid fa-download"></i> Download Note (.txt)
                </button>
              </div>

              {/* Key Quick Takeaway Bullets */}
              {selectedNote.keyPoints && selectedNote.keyPoints.length > 0 && (
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-lightbulb text-amber-600"></i> Key NECTA Revision Points
                  </span>
                  <ul className="list-disc pl-5 text-xs text-amber-950 font-medium space-y-1">
                    {selectedNote.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatted Content */}
              <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 text-gray-800 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap font-sans">
                {selectedNote.content}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotesHub;
