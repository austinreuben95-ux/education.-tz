import React, { useState, useEffect } from 'react';
import { TANZANIAN_SCHOOLS_DATABASE, TanzanianSchool } from '../src/data/tanzanianSchoolsData';
import { searchUserByEmail, updateUserCredits } from '../services/firebaseService';
import { UserProgress } from '../types';

export interface Collaborator {
  id: string;
  email: string;
  role: 'Co-Admin' | 'Curriculum Manager' | 'School & Exam Specialist' | 'Content Editor' | 'AI AskYun Engineer';
  dateAdded: string;
  assignedNote?: string;
  aiStudioUrl: string;
  status: 'Active' | 'Pending Acceptance' | 'Revoked';
  invitedBy?: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'COLLABORATORS' | 'SCHOOLS' | 'STUDENTS' | 'SYLLABUS'>('COLLABORATORS');

  // --- COLLABORATOR STATE ---
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const saved = localStorage.getItem('tz_app_collaborators');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'collab-1',
        email: 'austinreuben95@gmail.com',
        role: 'Co-Admin',
        dateAdded: new Date().toLocaleDateString(),
        assignedNote: 'Primary System Administrator with full Google AI Studio build access',
        aiStudioUrl: 'https://ai.studio/build',
        status: 'Active',
        invitedBy: 'System Owner'
      }
    ];
  });

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Collaborator['role']>('Co-Admin');
  const [inviteNote, setInviteNote] = useState('');
  const [recentlyInvited, setRecentlyInvited] = useState<Collaborator | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [emailPreviewModal, setEmailPreviewModal] = useState<Collaborator | null>(null);
  const [collabSearchQuery, setCollabSearchQuery] = useState('');
  const [collabStatusFilter, setCollabStatusFilter] = useState('ALL');

  useEffect(() => {
    localStorage.setItem('tz_app_collaborators', JSON.stringify(collaborators));
  }, [collaborators]);

  const handleGrantControl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newCollab: Collaborator = {
      id: `collab-${Date.now()}`,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
      dateAdded: new Date().toLocaleDateString(),
      assignedNote: inviteNote.trim() || 'Granted access to add and edit website features via Google AI Studio',
      aiStudioUrl: 'https://ai.studio/build',
      status: 'Pending Acceptance',
      invitedBy: 'austinreuben95@gmail.com'
    };

    setCollaborators(prev => [newCollab, ...prev]);
    setRecentlyInvited(newCollab);
    setInviteEmail('');
    setInviteNote('');
  };

  const removeCollaborator = (id: string) => {
    if (window.confirm('Are you sure you want to revoke Google AI Studio access for this collaborator?')) {
      setCollaborators(prev => prev.filter(c => c.id !== id));
      if (recentlyInvited?.id === id) setRecentlyInvited(null);
    }
  };

  const toggleCollaboratorStatus = (id: string) => {
    setCollaborators(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus: Collaborator['status'] = c.status === 'Active' ? 'Pending Acceptance' : 'Active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const getInviteEmailSubject = (collab: Collaborator) => {
    return `Invitation: Co-Manage EducationTZ Content & Features on Google AI Studio`;
  };

  const getInviteEmailBody = (collab: Collaborator) => {
    return `Hello,\n\nYou have been invited by the EducationTZ System Administrator as a ${collab.role} to manage curriculum content, school cutoffs, and AI tools for Education TZ!\n\n--------------------------------------------------\n👉 GOOGLE AI STUDIO BUILD LINK:\n${collab.aiStudioUrl}\n--------------------------------------------------\n\nYour Assigned Role: ${collab.role}\nAssigned Notes / Instructions:\n"${collab.assignedNote || 'You can add or update school cutoffs, study notes, quizzes, and NECTA past papers directly by typing natural language prompts!'}"\n\nHow to Get Started:\n1. Open the Google AI Studio link above.\n2. Sign in with your Google account (${collab.email}).\n3. Type natural language requests to edit content (e.g., "Add 2025 Form 4 Physics past paper solutions" or "Update UDSM admission cutoff scores").\n\nThank you for helping empower students across Tanzania!\n\nBest regards,\nEducationTZ Administration`;
  };

  const handleSendEmailDirect = (collab: Collaborator) => {
    const subject = encodeURIComponent(getInviteEmailSubject(collab));
    const body = encodeURIComponent(getInviteEmailBody(collab));
    window.location.href = `mailto:${collab.email}?subject=${subject}&body=${body}`;
  };

  const handleSendWhatsAppDirect = (collab: Collaborator) => {
    const text = encodeURIComponent(`🇹🇿 *EducationTZ Google AI Studio Invitation*\n\nHello! You have been granted *${collab.role}* access to co-manage EducationTZ.\n\n👉 *Open Google AI Studio*: ${collab.aiStudioUrl}\n\n*Assigned Task/Note*: ${collab.assignedNote || 'Type prompts in Google AI Studio to update study notes, exam cutoffs, and quizzes!'}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const copyInviteText = (collab: Collaborator) => {
    const message = getInviteEmailBody(collab);
    navigator.clipboard.writeText(message);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  // Filtered Collaborators List
  const filteredCollaborators = collaborators.filter(collab => {
    const matchesFilter = collabStatusFilter === 'ALL' || collab.status === collabStatusFilter;
    const matchesSearch = collab.email.toLowerCase().includes(collabSearchQuery.toLowerCase()) ||
      collab.role.toLowerCase().includes(collabSearchQuery.toLowerCase()) ||
      (collab.assignedNote && collab.assignedNote.toLowerCase().includes(collabSearchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // --- SCHOOLS DB MANAGER STATE ---
  const [schoolsList, setSchoolsList] = useState<TanzanianSchool[]>(() => {
    const saved = localStorage.getItem('tz_custom_schools_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return TANZANIAN_SCHOOLS_DATABASE;
  });

  useEffect(() => {
    localStorage.setItem('tz_custom_schools_db', JSON.stringify(schoolsList));
  }, [schoolsList]);

  const [newSchName, setNewSchName] = useState('');
  const [newSchCategory, setNewSchCategory] = useState<TanzanianSchool['category']>('Special National');
  const [newSchLevel, setNewSchLevel] = useState<TanzanianSchool['level']>('CSEE');
  const [newSchRegion, setNewSchRegion] = useState('Dar es Salaam');
  const [newSchMinReq, setNewSchMinReq] = useState('');
  const [newSchAvg, setNewSchAvg] = useState('');
  const [newSchTarget, setNewSchTarget] = useState('');
  const [newSchDesc, setNewSchDesc] = useState('');
  const [newSchPrograms, setNewSchPrograms] = useState('');
  const [newSchGender, setNewSchGender] = useState<'Boys' | 'Girls' | 'Co-education'>('Co-education');
  const [schoolAddedMessage, setSchoolAddedMessage] = useState('');

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchName.trim()) return;

    const newSchool: TanzanianSchool = {
      id: `custom-sch-${Date.now()}`,
      name: newSchName.trim(),
      category: newSchCategory,
      level: newSchLevel,
      region: newSchRegion.trim(),
      minRequirement: newSchMinReq.trim() || 'NECTA Standard Cutoff',
      cutoffScoreOrPoints: 'Standard',
      schoolAverage: newSchAvg.trim() || '85.0% National Pass Avg',
      targetScoreToHit: newSchTarget.trim() || newSchMinReq.trim() || 'NECTA Grade A/B Target',
      description: newSchDesc.trim() || 'Custom added Tanzanian educational institution.',
      popularPrograms: newSchPrograms ? newSchPrograms.split(',').map(p => p.trim()) : ['General Curriculum'],
      gender: newSchGender,
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    };

    setSchoolsList(prev => [newSchool, ...prev]);
    setSchoolAddedMessage(`Successfully added "${newSchName}" to the Admission Predictor database!`);
    setNewSchName('');
    setNewSchMinReq('');
    setNewSchAvg('');
    setNewSchTarget('');
    setNewSchDesc('');
    setNewSchPrograms('');
    setTimeout(() => setSchoolAddedMessage(''), 4000);
  };

  const removeSchool = (id: string) => {
    setSchoolsList(prev => prev.filter(s => s.id !== id));
  };

  // --- STUDENT SEARCH & CREDITS STATE ---
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserProgress | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentMsg, setStudentMsg] = useState('');
  const [newCredits, setNewCredits] = useState(0);
  const [newPoints, setNewPoints] = useState(0);

  const handleStudentSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoading(true);
    setStudentMsg('');
    try {
      const u = await searchUserByEmail(searchEmail);
      if (u) {
        setFoundUser(u);
        setNewCredits(u.credits || 0);
        setNewPoints(u.points || 0);
      } else {
        setFoundUser(null);
        setStudentMsg('Student account not found in database.');
      }
    } catch (err) {
      setStudentMsg('Error searching student account.');
    }
    setStudentLoading(false);
  };

  const handleUpdateStudent = async () => {
    if (!foundUser || !foundUser.userId) return;
    setStudentLoading(true);
    try {
      await updateUserCredits(foundUser.userId, newCredits, newPoints);
      setStudentMsg('Student credits & XP updated successfully!');
      setFoundUser(prev => prev ? { ...prev, credits: newCredits, points: newPoints } : null);
    } catch (err) {
      setStudentMsg('Error updating student.');
    }
    setStudentLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 animate-fade-in text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              title="Back to App"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-extrabold text-xs uppercase tracking-wider border border-red-500/30 flex items-center gap-1.5">
              <i className="fa-solid fa-user-shield"></i> System Admin Hub
            </span>
          </div>

          <h1 className="text-3xl font-black text-white">EducationTZ Master Admin Panel</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Grant collaborators build control via Google AI Studio, manage Tanzanian schools database, and edit curriculum content.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 text-xs font-bold space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-black">Logged-In Administrator</span>
              <p className="text-emerald-400 font-mono text-sm">austinreuben95@gmail.com</p>
            </div>
            <a
              href="https://ai.studio/build/a47ff0c8-cddc-4160-bae0-aabfc86f0464"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-amber-900"></i>
              <span>Launch AI Studio Project Space</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
          <p className="text-slate-300 text-[11px]"><i className="fa-solid fa-check-double text-emerald-400 mr-1"></i> Full Access Privileges • Applet ID: <code className="text-amber-300 font-mono">a47ff0c8</code></p>
        </div>
      </div>

      {/* Direct Google AI Studio Quick Access Card for Admin */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase border border-amber-400/30">
            <i className="fa-solid fa-key"></i>
            <span>Authenticated Admin AI Studio Project Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Direct Access to EducationTZ Google AI Studio Project Space
          </h2>
          <p className="text-xs text-indigo-200 font-medium leading-relaxed">
            As an authenticated administrator, you have direct access to your dedicated Google AI Studio workspace for live prompt-driven content updates, database schema changes, and feature enhancements.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-emerald-300">
            <span className="text-slate-400 font-sans font-bold">Project Workspace URL:</span>
            <code className="bg-slate-950 px-2.5 py-1 rounded-lg border border-indigo-500/30 text-amber-300 select-all">https://ai.studio/build/a47ff0c8-cddc-4160-bae0-aabfc86f0464</code>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
          <a
            href="https://ai.studio/build/a47ff0c8-cddc-4160-bae0-aabfc86f0464"
            target="_blank"
            rel="noreferrer"
            className="w-full px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
            <span>Open My AI Studio Project Space</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText('https://ai.studio/build/a47ff0c8-cddc-4160-bae0-aabfc86f0464');
              alert('Copied your direct Google AI Studio project space URL to clipboard!');
            }}
            className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-copy text-amber-400"></i>
            <span>Copy Direct AI Studio Link</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('COLLABORATORS')}
          className={`px-4 py-3 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeTab === 'COLLABORATORS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-user-plus text-amber-300"></i>
          <span>Give Someone Control (Google AI Studio)</span>
        </button>

        <button
          onClick={() => setActiveTab('SCHOOLS')}
          className={`px-4 py-3 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeTab === 'SCHOOLS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-school"></i>
          <span>Tanzanian Schools Manager ({schoolsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('STUDENTS')}
          className={`px-4 py-3 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeTab === 'STUDENTS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-users-gear"></i>
          <span>Student Accounts & Points</span>
        </button>

        <button
          onClick={() => setActiveTab('SYLLABUS')}
          className={`px-4 py-3 rounded-xl font-black text-xs transition flex items-center gap-2 ${
            activeTab === 'SYLLABUS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <i className="fa-solid fa-book-open"></i>
          <span>Curriculum & Notes Editor</span>
        </button>
      </div>

      {/* TAB 1: GRANT CONTROL & GOOGLE AI STUDIO COLLABORATION */}
      {activeTab === 'COLLABORATORS' && (
        <div className="space-y-8">
          {/* Form: Invite New Collaborator via Email */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] uppercase border border-amber-300 inline-block">
                Team Collaboration & AI Build Control
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Invite Users via Email to Co-Manage EducationTZ on Google AI Studio
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Send an email invitation to teachers, curriculum specialists, or co-admins. Invited users will be granted direct access to manage content, edit school cutoffs, and prompt new features inside <strong>Google AI Studio</strong>!
              </p>
            </div>

            <form onSubmit={handleGrantControl} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 block">
                    User Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. teacher@school.ac.tz or colleague@gmail.com"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <i className="fa-solid fa-envelope absolute left-3 top-3.5 text-slate-400 text-xs"></i>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Must be a valid Google email account</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 block">
                    Assigned Management Role:
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Collaborator['role'])}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Co-Admin">Co-Admin (Full Features & Build Access)</option>
                    <option value="Curriculum Manager">Curriculum Manager (Syllabus, Notes & Past Papers)</option>
                    <option value="School & Exam Specialist">School Cutoffs & Admission Specialist</option>
                    <option value="Content Editor">Content Editor (Swahili Dictionary & Quizzes)</option>
                    <option value="AI AskYun Engineer">AI AskYun Prompt & Tutor Engineer</option>
                  </select>
                  <p className="text-[10px] text-indigo-600 font-bold">Defines primary focus area in AI Studio</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 block">
                    Assigned Note / Task Instructions:
                  </label>
                  <input
                    type="text"
                    value={inviteNote}
                    onChange={(e) => setInviteNote(e.target.value)}
                    placeholder="e.g. Please update 2025 Form 4 Physics NECTA past papers"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Will be included in invitation email</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <i className="fa-solid fa-paper-plane text-amber-300"></i>
                  <span>Grant AI Studio Access & Create Invitation</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                  <span>Direct Google AI Studio Link: <code className="text-indigo-600 font-mono">https://ai.studio/build</code></span>
                </div>
              </div>
            </form>

            {/* Recently Invited Banner & Direct Email Dispatch */}
            {recentlyInvited && (
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 rounded-2xl border-2 border-emerald-400/80 space-y-4 animate-fade-in shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-lg font-black text-white">
                        Invitation Created for {recentlyInvited.email}!
                      </h4>
                      <p className="text-xs text-emerald-300 font-bold">
                        Assigned Role: <span className="underline">{recentlyInvited.role}</span> • Status: <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] border border-amber-400/30">Pending Acceptance</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={recentlyInvited.aiStudioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Open Google AI Studio</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  </a>
                </div>

                <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-500/30 font-mono text-xs text-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Google AI Studio Target URL:</span>
                    <span className="text-[10px] text-emerald-400 font-mono">ai.studio/build</span>
                  </div>
                  <p className="text-white font-mono break-all font-bold text-xs">
                    {recentlyInvited.aiStudioUrl}
                  </p>
                </div>

                {/* Dispatch Options Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleSendEmailDirect(recentlyInvited)}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-envelope"></i>
                    <span>Send Email Invitation Now (Mailto)</span>
                  </button>

                  <button
                    onClick={() => handleSendWhatsAppDirect(recentlyInvited)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-2"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                    <span>Share Invitation on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setEmailPreviewModal(recentlyInvited)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-black text-xs rounded-xl shadow transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-eye"></i>
                    <span>Preview Email Template</span>
                  </button>

                  <button
                    onClick={() => copyInviteText(recentlyInvited)}
                    className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-black text-xs rounded-xl shadow transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-copy text-indigo-600"></i>
                    <span>{copySuccess ? 'Copied Invitation Text!' : 'Copy Text to Clipboard'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Collaborators Roster Table */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-users text-indigo-600"></i>
                  <span>Collaborators Roster & AI Studio Access List</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Manage team members and their Google AI Studio build access</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                  {collaborators.length} Total Invited
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              <div className="relative">
                <input
                  type="text"
                  value={collabSearchQuery}
                  onChange={(e) => setCollabSearchQuery(e.target.value)}
                  placeholder="Search collaborator by email or role..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-600 shrink-0">Filter Status:</span>
                <select
                  value={collabStatusFilter}
                  onChange={(e) => setCollabStatusFilter(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black"
                >
                  <option value="ALL">All Statuses ({collaborators.length})</option>
                  <option value="Active">Active Co-Admins</option>
                  <option value="Pending Acceptance">Pending Acceptance</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-wider">
                    <th className="p-3">Collaborator Email</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Google AI Studio Access</th>
                    <th className="p-3">Date Added</th>
                    <th className="p-3">Task / Note</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCollaborators.map((collab) => (
                    <tr key={collab.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-user-circle text-slate-400 text-base"></i>
                          <div>
                            <span className="block font-black text-slate-900">{collab.email}</span>
                            {collab.invitedBy && (
                              <span className="text-[10px] text-slate-400 font-normal">Invited by: {collab.invitedBy}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 font-black text-[10px] border border-indigo-100 block w-max">
                          {collab.role}
                        </span>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => toggleCollaboratorStatus(collab.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border transition cursor-pointer ${
                            collab.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle status"
                        >
                          {collab.status}
                        </button>
                      </td>

                      <td className="p-3">
                        <a
                          href={collab.aiStudioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 font-black hover:underline inline-flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
                        >
                          <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
                          <span>Google AI Studio</span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                        </a>
                      </td>

                      <td className="p-3 text-slate-500 font-mono text-[11px]">{collab.dateAdded}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{collab.assignedNote || 'Full Access'}</td>

                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleSendEmailDirect(collab)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-[11px]"
                          title="Send Email Invitation"
                        >
                          <i className="fa-solid fa-envelope mr-1"></i> Email
                        </button>

                        <button
                          onClick={() => setEmailPreviewModal(collab)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px]"
                          title="Preview Email Text"
                        >
                          Preview
                        </button>

                        {collab.email !== 'austinreuben95@gmail.com' && (
                          <button
                            onClick={() => removeCollaborator(collab.id)}
                            className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[11px]"
                            title="Revoke collaborator access"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCollaborators.length === 0 && (
                <div className="text-center py-8 text-slate-400 font-bold text-xs space-y-1">
                  <i className="fa-solid fa-user-slash text-2xl block text-slate-300"></i>
                  <span>No collaborators found matching your search.</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Studio Prompting Guide Card for Invited Users */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-800 shadow-xl">
            <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb"></i>
              <span>How Invited Users Manage Content in Google AI Studio</span>
            </h3>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              When an invited user opens their Google AI Studio link (<code>https://ai.studio/build</code>), they land directly in the live build environment. They can edit content by simply typing natural language instructions into the prompt box:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">1. Updating Tanzanian Schools Cutoffs:</span>
                <p className="text-slate-300 font-mono text-[11px]">"Add Azania, Weruweru and Mzumbe 2025 Form 5 cutoffs to the Admission Predictor tool"</p>
              </div>

              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">2. Adding Notes & NECTA Past Papers:</span>
                <p className="text-slate-300 font-mono text-[11px]">"Add 15 new Form 4 Physics NECTA past paper questions with step-by-step solutions"</p>
              </div>

              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">3. Swahili Translations & Quizzes:</span>
                <p className="text-slate-300 font-mono text-[11px]">"Add Swahili translations and audio phonetic guides for Form 2 Chemistry terms"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {emailPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Email Invitation Preview</h3>
                  <p className="text-xs text-slate-500 font-medium">To: {emailPreviewModal.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEmailPreviewModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-black"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 font-sans text-xs text-slate-800">
              <div className="border-b border-slate-200 pb-2 space-y-1">
                <p className="font-bold text-slate-500">Subject: <span className="text-slate-900">{getInviteEmailSubject(emailPreviewModal)}</span></p>
                <p className="font-bold text-slate-500">Recipient: <span className="text-indigo-600">{emailPreviewModal.email}</span></p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-slate-900">
                {getInviteEmailBody(emailPreviewModal)}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => copyInviteText(emailPreviewModal)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs rounded-xl transition flex items-center gap-2"
              >
                <i className="fa-solid fa-copy"></i>
                <span>Copy Message</span>
              </button>

              <button
                onClick={() => {
                  handleSendEmailDirect(emailPreviewModal);
                  setEmailPreviewModal(null);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                <i className="fa-solid fa-paper-plane"></i>
                <span>Send Mail Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TANZANIAN SCHOOLS DATABASE MANAGER */}
      {activeTab === 'SCHOOLS' && (
        <div className="space-y-8">
          {/* Add New Tanzanian School Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-900">Add New Tanzanian School / College</h2>
              <p className="text-xs text-slate-500 font-medium">
                Instantly publish new secondary schools, high schools, diploma colleges, or university cutoffs to the Admission Predictor database.
              </p>
            </div>

            {schoolAddedMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-black text-xs text-center">
                {schoolAddedMessage}
              </div>
            )}

            <form onSubmit={handleAddSchool} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">School / Institution Name:</label>
                  <input
                    type="text"
                    required
                    value={newSchName}
                    onChange={(e) => setNewSchName(e.target.value)}
                    placeholder="e.g. Canossa High School or UDSM Campus"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Category:</label>
                  <select
                    value={newSchCategory}
                    onChange={(e) => setNewSchCategory(e.target.value as TanzanianSchool['category'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="Special National">Special National Talent School</option>
                    <option value="National Boarding">National Boarding School</option>
                    <option value="Top Private">Top Private Boarding School</option>
                    <option value="Public University">Public University</option>
                    <option value="Private University">Private University</option>
                    <option value="Diploma College">Technical & Diploma College</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Education Level:</label>
                  <select
                    value={newSchLevel}
                    onChange={(e) => setNewSchLevel(e.target.value as TanzanianSchool['level'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="PSLE">PSLE (Primary Std 7)</option>
                    <option value="CSEE">CSEE (O-Level Form 4)</option>
                    <option value="ACSEE">ACSEE (A-Level Form 6)</option>
                    <option value="UNIVERSITY">University / Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Region / Location:</label>
                  <input
                    type="text"
                    required
                    value={newSchRegion}
                    onChange={(e) => setNewSchRegion(e.target.value)}
                    placeholder="e.g. Arusha, Dar es Salaam, Mbeya, Mwanza..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Gender Admission:</label>
                  <select
                    value={newSchGender}
                    onChange={(e) => setNewSchGender(e.target.value as 'Boys' | 'Girls' | 'Co-education')}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="Co-education">Co-education</option>
                    <option value="Boys">Boys Only</option>
                    <option value="Girls">Girls Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Minimum Requirement / Cutoff:</label>
                  <input
                    type="text"
                    required
                    value={newSchMinReq}
                    onChange={(e) => setNewSchMinReq(e.target.value)}
                    placeholder="e.g. PSLE 88%+ or Division I Points 7-12"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={newSchDesc}
                  onChange={(e) => setNewSchDesc(e.target.value)}
                  placeholder="Academic track record, science labs, dormitories, and national rank details..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Popular Programs / Combinations (Comma Separated):</label>
                <input
                  type="text"
                  value={newSchPrograms}
                  onChange={(e) => setNewSchPrograms(e.target.value)}
                  placeholder="PCM, PCB, Doctor of Medicine, Diploma in Computer Engineering"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition"
              >
                + Publish School to Live Predictor Database
              </button>
            </form>
          </div>

          {/* List of Schools in Database */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Live Tanzanian Schools Database ({schoolsList.length} Institutions)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {schoolsList.map((sch) => (
                <div key={sch.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-900 text-sm">{sch.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-900">{sch.level}</span>
                    </div>
                    <p className="text-slate-500 font-bold mt-0.5">{sch.region} • {sch.category} • {sch.gender}</p>
                    <p className="text-slate-700 font-extrabold mt-1">Cutoff: {sch.minRequirement}</p>
                  </div>
                  <button
                    onClick={() => removeSchool(sch.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove School"
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT USER ACCOUNTS & POINTS */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-black text-slate-900">Student Account & Points Manager</h2>
            <p className="text-xs text-slate-500 font-medium">
              Search registered student accounts by email to manage EP points, AI credits, and progress milestones.
            </p>
          </div>

          <form onSubmit={handleStudentSearch} className="flex gap-2">
            <input
              type="email"
              required
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="student@example.com"
              className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
            />
            <button
              type="submit"
              disabled={studentLoading}
              className="px-6 py-3 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 transition"
            >
              {studentLoading ? 'Searching...' : 'Search Account'}
            </button>
          </form>

          {studentMsg && (
            <div className={`p-4 rounded-xl text-center font-bold text-xs ${studentMsg.includes('Error') || studentMsg.includes('not found') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-800'}`}>
              {studentMsg}
            </div>
          )}

          {foundUser && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-black text-slate-900 text-sm">Student Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                <div>
                  <span className="text-slate-400 block text-[10px]">Student UID:</span>
                  <span className="font-mono text-slate-800">{foundUser.userId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Email:</span>
                  <span className="text-slate-800">{searchEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Completed Topics:</span>
                  <span className="text-emerald-600">{foundUser.completedTopics.length} Topics</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Set AI AskYun Credits:</label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Set Total EP Points:</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateStudent}
                disabled={studentLoading}
                className="px-6 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 transition"
              >
                Save Student Changes
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SYLLABUS & CURRICULUM EDITOR */}
      {activeTab === 'SYLLABUS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-black text-slate-900">Curriculum & Notes Content Editor</h2>
            <p className="text-xs text-slate-500 font-medium">
              View current NECTA syllabus topics and notes structure. To modify topics, quizzes, or past papers directly, use <strong>Google AI Studio</strong>!
            </p>
          </div>

          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-950 space-y-3">
            <h3 className="font-black text-sm flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-600"></i>
              <span>AI Studio Direct Curriculum Synchronization</span>
            </h3>
            <p className="text-xs font-medium leading-relaxed">
              You or any invited collaborator can add new topics, update lesson notes, or import NECTA past papers in seconds by prompting Google AI Studio.
            </p>
            <button
              onClick={() => setActiveTab('COLLABORATORS')}
              className="px-4 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow transition"
            >
              Go to Collaborators Tab to Invite AI Studio Editors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
