import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

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
  },
  {
    id: 'note-7',
    title: 'Chemistry Form 3: Periodic Table & Chemical Bonding NECTA Notes',
    subject: 'Chemistry',
    level: 'Secondary (O-Level)',
    updatedAt: '2026-07-22',
    content: `
# Periodic Table & Chemical Bonding

## 1. Periodic Trends across Periods and Groups:
- **Atomic Radius**: Decreases across a period (left to right due to increased nuclear charge pulling electrons closer); Increases down a group (due to additional electron shells).
- **Electronegativity**: Tendency of an atom to attract shared electrons in a bond. Increases across a period, decreases down a group.
- **Ionization Energy**: Energy required to remove the outermost electron from a gaseous atom.

## 2. Types of Chemical Bonds:
- **Ionic (Electrovalent) Bond**: Formed by the complete TRANSFER of valence electrons from a metal (electropositive) to a non-metal (electronegative). Example: NaCl, MgO. High melting points and soluble in water.
- **Covalent Bond**: Formed by the SHARING of electron pairs between non-metal atoms. Example: H₂O, CO₂, CH₄.
- **Metallic Bond**: Attraction between positive metal ions and a sea of delocalized free valence electrons. Conducts electricity in solid state.

## 3. NECTA Exam Traps:
- Always draw dot-and-cross diagrams showing outermost shell electrons only!
- Note why ionic compounds conduct electricity in molten or aqueous state, but NOT in solid state (ions are fixed in rigid lattice).
    `,
    keyPoints: [
      'Ionic Bond = Electron Transfer (Metals + Non-Metals)',
      'Covalent Bond = Electron Sharing (Non-Metals)',
      'Electronegativity increases left-to-right across periods',
      'Ionic compounds conduct electricity when molten or dissolved in water'
    ]
  },
  {
    id: 'note-8',
    title: 'Geography Form 4: Map Reading, Grid References & Bearing Calculations',
    subject: 'Geography',
    level: 'Secondary (O-Level)',
    updatedAt: '2026-07-21',
    content: `
# Topographical Map Reading & Analysis

## 1. Grid References (Eastings & Northings):
- **Eastings**: Vertical grid lines numbered from West to East (read FIRST).
- **Northings**: Horizontal grid lines numbered from South to North (read SECOND).
- **Rule**: "Along the corridor, then up the stairs" (Eastings before Northings).
- **6-Digit Grid Reference**: Divide grid square into 10 equal imaginary subdivisions.

## 2. Calculating True Bearing & Back Bearing:
- **True Bearing**: Angle measured clockwise from True North (0° to 360°).
- **Back Bearing Formula**:
  - If Forward Bearing < 180°: Back Bearing = Forward Bearing + 180°.
  - If Forward Bearing ≥ 180°: Back Bearing = Forward Bearing - 180°.

## 3. Gradient Calculation:
- **Gradient = Vertical Interval (VI) / Horizontal Distance (HD)**.
- Ensure both VI and HD are converted into the SAME unit (Meters) before dividing!
    `,
    keyPoints: [
      'Eastings FIRST, Northings SECOND',
      'Back Bearing = Forward Bearing ± 180°',
      'Gradient = Vertical Interval / Horizontal Distance',
      'Contours close together = Steep Slope; Far apart = Gentle Slope'
    ]
  },
  {
    id: 'note-9',
    title: 'A-Level Pure Mathematics: Differential Calculus & Optimization',
    subject: 'Mathematics',
    level: 'High School (A-Level)',
    updatedAt: '2026-07-20',
    content: `
# Advanced Differential Calculus & Curve Sketching

## 1. Core Differentiation Rules:
- **Power Rule**: d/dx [xⁿ] = n·xⁿ⁻¹
- **Product Rule**: d/dx [u·v] = u·(dv/dx) + v·(du/dx)
- **Quotient Rule**: d/dx [u / v] = [v·(du/dx) - u·(dv/dx)] / v²
- **Chain Rule**: dy/dx = (dy/du) × (du/dx)

## 2. Stationary Points & Curve Turning:
- Set dy/dx = 0 to find stationary x-coordinates.
- Evaluate second derivative d²y/dx²:
  - If d²y/dx² > 0: Minimum Vertex
  - If d²y/dx² < 0: Maximum Vertex
  - If d²y/dx² = 0: Point of Inflexion

## 3. Real-World Optimization Applications:
- Maximizing volume of storage containers or minimizing structural material surface area in engineering.
    `,
    keyPoints: [
      'Stationary points occur when first derivative dy/dx = 0',
      'd²y/dx² > 0 indicates a Minimum point; < 0 indicates a Maximum point',
      'Quotient Rule requires subtraction in numerator: (v u\' - u v\') / v²',
      'Chain Rule is used for composite function differentiation'
    ]
  },
  {
    id: 'note-10',
    title: 'University Studies: Development Studies & Tanzania Vision 2025',
    subject: 'Development Studies',
    level: 'Higher Education',
    updatedAt: '2026-07-19',
    content: `
# Development Studies & Economic Transformation in Tanzania

## 1. Tanzania Development Vision 2025 Core Pillars:
- **High Quality Livelihood**: Eradication of poverty, access to clean water, quality education, and healthcare for all citizens.
- **Good Governance & Rule of Law**: Corruption-free administration, transparent public finance, and strong institutional frameworks.
- **Strong & Competitive Economy**: Diversification from subsistence agriculture to semi-industrialized economy with value-addition manufacturing.

## 2. Key National Infrastructure Projects:
- **Julius Nyerere Hydroelectric Power Project (JNHPP)**: 2,115 MW electricity capacity supporting manufacturing and power export across East Africa.
- **Standard Gauge Railway (SGR)**: Electric railway line connecting Dar es Salaam port to Dodoma, Mwanza, Kigoma, and landlocked neighboring nations (Rwanda, Burundi, DRC).
    `,
    keyPoints: [
      'Vision 2025 aims for a middle-income semi-industrialized country',
      '3 Main Pillars: High Quality Livelihood, Good Governance, Strong Economy',
      'JNHPP generates 2,115 MW power for industrial transformation',
      'SGR enhances East African trade corridors'
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
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isSpeakingNote, setIsSpeakingNote] = useState(false);
  const [isNotePaused, setIsNotePaused] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedNote]);

  const handleToggleNoteSpeech = (note: StudyNote) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    const synth = window.speechSynthesis;

    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsNotePaused(false);
        setIsSpeakingNote(true);
        return;
      } else {
        synth.pause();
        setIsNotePaused(true);
        return;
      }
    }

    synth.cancel();

    const cleanContent = `${note.title}. Subject: ${note.subject}. ${note.content}`.replace(/[#*`_~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanContent);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = note.subject.toLowerCase().includes('swahili') ? 'sw-TZ' : 'en-US';

    utterance.onstart = () => {
      setIsSpeakingNote(true);
      setIsNotePaused(false);
    };

    utterance.onend = () => {
      setIsSpeakingNote(false);
      setIsNotePaused(false);
    };

    utterance.onerror = () => {
      setIsSpeakingNote(false);
      setIsNotePaused(false);
    };

    synth.speak(utterance);
  };

  const handleStopNoteSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingNote(false);
    setIsNotePaused(false);
  };

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

  const downloadNoteAsPdf = (note: StudyNote) => {
    try {
      setIsPdfGenerating(true);
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);

      // --- Header Banner ---
      doc.setFillColor(6, 78, 59); // Emerald 900
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Accent Gold Stripe
      doc.setFillColor(250, 204, 21); // Amber 400
      doc.rect(0, 28, pageWidth, 2, 'F');

      // Brand
      doc.setTextColor(250, 204, 21);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('ElimuTanzania • TIE Syllabus Offline Study Note', margin, 9);

      // Metadata
      doc.setTextColor(209, 250, 229);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`${note.subject.toUpperCase()} | ${note.level} | Updated: ${note.updatedAt}`, margin, 15);

      // Note Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const titleLines = doc.splitTextToSize(note.title, contentWidth);
      doc.text(titleLines[0] || note.title, margin, 22);

      let currentY = 36;

      // --- Key Takeaways Box ---
      if (note.keyPoints && note.keyPoints.length > 0) {
        doc.setFillColor(254, 243, 199);
        doc.setDrawColor(251, 191, 36);
        doc.setLineWidth(0.3);

        let boxHeight = 11;
        note.keyPoints.forEach(pt => {
          const ptLines = doc.splitTextToSize(`• ${pt}`, contentWidth - 8);
          boxHeight += ptLines.length * 4.5;
        });

        doc.roundedRect(margin, currentY, contentWidth, boxHeight, 2, 2, 'FD');

        doc.setTextColor(146, 64, 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text('KEY REVISION TAKEAWAYS & FORMULAS:', margin + 4, currentY + 6);

        let ptY = currentY + 11;
        doc.setTextColor(69, 26, 3);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        note.keyPoints.forEach(pt => {
          const ptLines = doc.splitTextToSize(`• ${pt}`, contentWidth - 8);
          ptLines.forEach((line: string) => {
            doc.text(line, margin + 4, ptY);
            ptY += 4.5;
          });
        });

        currentY += boxHeight + 8;
      }

      // --- Main Note Content ---
      doc.setTextColor(15, 23, 42);
      const contentLines = note.content.split('\n');

      for (let i = 0; i < contentLines.length; i++) {
        const rawLine = contentLines[i].trim();
        if (!rawLine) {
          currentY += 3;
          continue;
        }

        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;

          // Header on Page 2+
          doc.setFillColor(241, 245, 249);
          doc.rect(0, 0, pageWidth, 12, 'F');
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text(`ElimuTanzania Study Vault: ${note.title.slice(0, 50)}...`, margin, 8);
          doc.setDrawColor(226, 232, 240);
          doc.line(0, 12, pageWidth, 12);
          currentY = 18;
        }

        if (rawLine.startsWith('# ')) {
          currentY += 2;
          doc.setTextColor(6, 78, 59);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11.5);
          const text = rawLine.replace('# ', '').trim();
          const splitHeader = doc.splitTextToSize(text, contentWidth);
          splitHeader.forEach((hLine: string) => {
            doc.text(hLine, margin, currentY);
            currentY += 5.5;
          });
          doc.setDrawColor(16, 185, 129);
          doc.setLineWidth(0.3);
          doc.line(margin, currentY - 1.5, margin + 35, currentY - 1.5);
          currentY += 2;
        } else if (rawLine.startsWith('## ')) {
          currentY += 2;
          doc.setTextColor(30, 41, 59);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          const text = rawLine.replace('## ', '').trim();
          const splitSub = doc.splitTextToSize(text, contentWidth);
          splitSub.forEach((sLine: string) => {
            doc.text(sLine, margin, currentY);
            currentY += 5;
          });
        } else if (rawLine.startsWith('### ') || rawLine.startsWith('- ')) {
          doc.setTextColor(30, 41, 59);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          const text = rawLine.replace(/^###\s*|^-\s*/, '• ').trim();
          const splitBullet = doc.splitTextToSize(text, contentWidth - 4);
          splitBullet.forEach((bLine: string) => {
            doc.text(bLine, margin + 3, currentY);
            currentY += 4.5;
          });
        } else {
          doc.setTextColor(51, 65, 85);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          const cleanText = rawLine.replace(/\*\*/g, '');
          const wrapped = doc.splitTextToSize(cleanText, contentWidth);
          wrapped.forEach((wLine: string) => {
            doc.text(wLine, margin, currentY);
            currentY += 4.5;
          });
        }
      }

      // --- Footer with Page Numbers ---
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        doc.text('Official Offline Study Note • ElimuTanzania (EducationTZ)', margin, pageHeight - 7);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 7);
      }

      const safeFilename = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`${safeFilename}_formatted_note.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Falling back to plain text download.');
      downloadNoteAsTxt(note);
    } finally {
      setIsPdfGenerating(false);
    }
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

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadNoteAsPdf(note); }}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Download as PDF"
                    >
                      <i className="fa-solid fa-file-pdf text-sm"></i>
                    </button>
                    {note.isCustom && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCustomNote(note.id); }}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Note"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    )}
                  </div>
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

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleToggleNoteSpeech(selectedNote)}
                    className={`px-4 py-2.5 rounded-xl text-white font-black text-xs transition flex items-center gap-2 shadow-md cursor-pointer ${
                      isSpeakingNote && !isNotePaused
                        ? 'bg-amber-500 hover:bg-amber-600 animate-pulse ring-2 ring-amber-300'
                        : isNotePaused
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                    title="Listen to this note read aloud using Speech Synthesis"
                  >
                    <i className={`fa-solid ${
                      isSpeakingNote && !isNotePaused
                        ? 'fa-circle-pause text-white'
                        : isNotePaused
                        ? 'fa-circle-play text-emerald-300'
                        : 'fa-volume-high text-amber-300'
                    }`}></i>
                    <span>
                      {isSpeakingNote && !isNotePaused
                        ? 'Pause Audio'
                        : isNotePaused
                        ? 'Resume Audio'
                        : 'Listen to Note'}
                    </span>
                  </button>

                  {(isSpeakingNote || isNotePaused) && (
                    <button
                      onClick={handleStopNoteSpeech}
                      className="px-3 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                      title="Stop Speech Playback"
                    >
                      <i className="fa-solid fa-square text-red-500 text-xs"></i>
                      <span>Stop</span>
                    </button>
                  )}

                  <button
                    onClick={() => downloadNoteAsPdf(selectedNote)}
                    disabled={isPdfGenerating}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-200 transition flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                    title="Download Formatted Compressed PDF for Offline Study"
                  >
                    {isPdfGenerating ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-file-pdf text-amber-300 text-sm"></i>
                        <span>Download as PDF</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadNoteAsTxt(selectedNote)}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition flex items-center gap-1.5"
                    title="Download Plain Text Note (.txt)"
                  >
                    <i className="fa-solid fa-file-lines text-gray-500"></i>
                    <span>.TXT</span>
                  </button>
                </div>
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
