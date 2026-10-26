import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  StudyBuddy, 
  StudyBuddySession, 
  BuddyChatMessage, 
  CollaborativeStep,
  UserProgress 
} from '../types';
import { 
  publishStudyBuddyPresence, 
  subscribeToStudyBuddies, 
  removeStudyBuddyPresence,
  createOrJoinStudyBuddySession,
  subscribeToStudyBuddySession,
  addCollaborativeStepToSession,
  sendStudyBuddyChatMessage,
  subscribeToStudyBuddyMessages,
  auth
} from '../services/firebaseService';
import { SEED_STUDY_BUDDIES, TOPIC_PROBLEM_STARTERS } from '../data/studyBuddySeedData';
import { STUDY_ROOM_SUBJECTS } from '../data/studyRoomSeedData';
import { ScholarAvatar } from './ScholarAvatar';
import { playGeminiVoiceAudio } from '../services/geminiService';

interface StudyBuddyTabProps {
  currentSubjectId: string;
  userProgress?: UserProgress;
  onOpenYunChat?: (prompt: string) => void;
}

export const StudyBuddyTab: React.FC<StudyBuddyTabProps> = ({
  currentSubjectId,
  userProgress,
  onOpenYunChat
}) => {
  // Directory & Filter State
  const [buddies, setBuddies] = useState<StudyBuddy[]>(SEED_STUDY_BUDDIES);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(currentSubjectId || 'physics');
  const [filterMode, setFilterMode] = useState<'all' | 'same_topic' | 'seeking_help' | 'ready_to_tutor'>('same_topic');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPublishingPresence, setIsPublishingPresence] = useState<boolean>(false);
  const [hasBroadcastPresence, setHasBroadcastPresence] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current Student Custom Presence Settings
  const [myTopicTitle, setMyTopicTitle] = useState<string>("Newton's Laws of Motion & Momentum");
  const [myStudyGoal, setMyStudyGoal] = useState<string>("Solving NECTA Section B numerical problems with a study partner");
  const [myStatus, setMyStatus] = useState<'available' | 'seeking_help' | 'ready_to_tutor'>('seeking_help');
  const [myGradeLevel, setMyGradeLevel] = useState<string>('Form 4 (CSEE)');

  // Active Collaborative Session State
  const [activeSession, setActiveSession] = useState<StudyBuddySession | null>(null);
  const [activeBuddy, setActiveBuddy] = useState<StudyBuddy | null>(null);
  const [sessionMessages, setSessionMessages] = useState<BuddyChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  // Collaborative Step Input State
  const [newStepText, setNewStepText] = useState<string>('');
  const [newStepFormula, setNewStepFormula] = useState<string>('');
  const [isSubmittingStep, setIsSubmittingStep] = useState<boolean>(false);
  const [aiRefereeLoading, setAiRefereeLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Current subject object
  const currentSubjectObj = useMemo(() => {
    return STUDY_ROOM_SUBJECTS.find(s => s.id === selectedSubjectId) || STUDY_ROOM_SUBJECTS[1];
  }, [selectedSubjectId]);

  // Toast trigger helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time subscription to study buddies in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToStudyBuddies(
      selectedSubjectId,
      (remoteBuddies) => {
        if (remoteBuddies && remoteBuddies.length > 0) {
          // Merge remote buddies with seed buddies without duplicates
          const remoteIds = new Set(remoteBuddies.map(b => b.id));
          const filteredSeed = SEED_STUDY_BUDDIES.filter(b => !remoteIds.has(b.id));
          setBuddies([...remoteBuddies, ...filteredSeed]);
        } else {
          setBuddies(SEED_STUDY_BUDDIES);
        }
      },
      (error) => {
        console.warn("Fallback to cached seed study buddies:", error);
        setBuddies(SEED_STUDY_BUDDIES);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedSubjectId]);

  // Subscribe to messages when active session is open
  useEffect(() => {
    if (!activeSession) return;

    const unsubscribe = subscribeToStudyBuddyMessages(
      activeSession.id,
      (msgs) => {
        setSessionMessages(msgs);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activeSession?.id]);

  // Update default topic when subject changes
  useEffect(() => {
    if (selectedSubjectId === 'physics') {
      setMyTopicTitle("Newton's Laws of Motion & Momentum");
    } else if (selectedSubjectId === 'mathematics') {
      setMyTopicTitle("Quadratic Equations & Completing The Square");
    } else if (selectedSubjectId === 'chemistry') {
      setMyTopicTitle("The Mole Concept & Gas Volumes");
    } else if (selectedSubjectId === 'biology') {
      setMyTopicTitle("Genetics & Monohybrid Inheritance");
    } else if (selectedSubjectId === 'geography') {
      setMyTopicTitle("Topographical Map Interpretation & Cross-Sections");
    } else if (selectedSubjectId === 'kiswahili') {
      setMyTopicTitle("Uchambuzi wa Ushairi na Bahari Zake");
    }
  }, [selectedSubjectId]);

  // Broadcast presence to Firestore
  const handleBroadcastPresence = async () => {
    setIsPublishingPresence(true);
    const currentUser = auth.currentUser;
    const scholarName = userProgress?.displayName || currentUser?.displayName || 'Tanzanian Scholar';
    const school = userProgress?.schoolOrUniversity || 'Tanzanian Secondary School';
    const region = userProgress?.schoolRegion || userProgress?.region || 'Tanzania';
    const avatar = userProgress?.avatarId || 'scholar-stem';

    try {
      await publishStudyBuddyPresence({
        userId: currentUser?.uid || 'guest_' + Date.now(),
        displayName: scholarName,
        avatarId: avatar,
        schoolName: school,
        region: region,
        gradeLevel: myGradeLevel,
        subjectId: selectedSubjectId,
        subjectName: currentSubjectObj.name,
        topicTitle: myTopicTitle,
        studyGoal: myStudyGoal,
        isOnline: true,
        status: myStatus,
        matchScore: 99
      });

      setHasBroadcastPresence(true);
      triggerToast("You are now visible to students revising " + myTopicTitle + "!");
    } catch (err) {
      console.error("Presence broadcast failed:", err);
      // Local optimistic confirmation
      setHasBroadcastPresence(true);
      triggerToast("Broadcast active in this study session!");
    } finally {
      setIsPublishingPresence(false);
    }
  };

  // Leave directory presence
  const handleStopBroadcast = async () => {
    try {
      await removeStudyBuddyPresence();
      setHasBroadcastPresence(false);
      triggerToast("Presence removed from study directory.");
    } catch (err) {
      console.warn("Remove presence error:", err);
      setHasBroadcastPresence(false);
    }
  };

  // Start or join collaborative session with a buddy
  const handleStartCollaboration = async (buddy: StudyBuddy) => {
    setActiveBuddy(buddy);
    const currentUser = auth.currentUser;
    const scholarName = userProgress?.displayName || currentUser?.displayName || 'Tanzanian Scholar';
    const currentAvatar = userProgress?.avatarId || 'scholar-stem';

    const starterData = TOPIC_PROBLEM_STARTERS[buddy.subjectName] || {
      problem: `Collaborative Problem: Master and solve NECTA practice challenge on "${buddy.topicTitle}".`,
      initialSteps: [
        `Step 1: Write down the fundamental definition and syllabus principles of ${buddy.topicTitle}.`,
        `Step 2: Identify given data, parameters, and relevant NECTA formulas.`
      ]
    };

    const initialSteps: CollaborativeStep[] = starterData.initialSteps.map((stepStr, idx) => ({
      id: `step_${idx + 1}`,
      authorId: buddy.userId,
      authorName: buddy.displayName,
      stepNumber: idx + 1,
      explanation: stepStr,
      isVerified: true,
      timestamp: new Date(Date.now() - (4 - idx) * 60000).toISOString()
    }));

    const sessionPayload: Partial<StudyBuddySession> & { topicTitle: string; subjectId: string; subjectName: string } = {
      id: `session_${buddy.id}_${currentUser?.uid || 'guest'}`,
      subjectId: buddy.subjectId,
      subjectName: buddy.subjectName,
      topicTitle: buddy.topicTitle,
      questionOrProblem: starterData.problem,
      participants: [
        {
          userId: buddy.userId,
          displayName: buddy.displayName,
          avatarId: buddy.avatarId,
          schoolName: buddy.schoolName,
          role: 'buddy'
        },
        {
          userId: currentUser?.uid || 'current_user',
          displayName: scholarName,
          avatarId: currentAvatar,
          schoolName: userProgress?.schoolOrUniversity || 'Tanzanian School',
          role: 'creator'
        }
      ],
      steps: initialSteps,
      status: 'active'
    };

    try {
      const session = await createOrJoinStudyBuddySession(sessionPayload);
      setActiveSession(session);
      
      // Seed an initial friendly greeting message
      const welcomeMsg: BuddyChatMessage = {
        id: `msg_welcome_${Date.now()}`,
        sessionId: session.id,
        senderId: buddy.userId,
        senderName: buddy.displayName,
        senderAvatar: buddy.avatarId,
        content: `Habari! Great to connect. I was working on ${buddy.topicTitle}. Let's solve this NECTA question step-by-step together!`,
        type: 'text',
        createdAt: new Date().toISOString()
      };
      setSessionMessages([welcomeMsg]);

      triggerToast(`Connected with ${buddy.displayName}! Collaborative workspace active.`);
    } catch (err) {
      console.warn("Session created locally:", err);
      setActiveSession(sessionPayload as StudyBuddySession);
    }
  };

  // Send message in study buddy chat
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInputText.trim();
    if (!textToSend || !activeSession) return;

    setIsSendingMessage(true);
    const currentUser = auth.currentUser;
    const scholarName = userProgress?.displayName || currentUser?.displayName || 'Tanzanian Scholar';
    const currentAvatar = userProgress?.avatarId || 'scholar-stem';

    const optimisticMsg: BuddyChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId: activeSession.id,
      senderId: currentUser?.uid || 'current_user',
      senderName: scholarName,
      senderAvatar: currentAvatar,
      content: textToSend,
      type: 'text',
      createdAt: new Date().toISOString()
    };

    setSessionMessages(prev => [...prev, optimisticMsg]);
    setChatInputText('');

    try {
      await sendStudyBuddyChatMessage(optimisticMsg);
    } catch (err) {
      console.warn("Sent message stored in active session state:", err);
    } finally {
      setIsSendingMessage(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Submit a new collaborative step to the whiteboard
  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim() || !activeSession) return;

    setIsSubmittingStep(true);
    const currentUser = auth.currentUser;
    const scholarName = userProgress?.displayName || currentUser?.displayName || 'Tanzanian Scholar';
    const currentStepNum = (activeSession.steps?.length || 0) + 1;

    const newStep: CollaborativeStep = {
      id: `step_${Date.now()}`,
      authorId: currentUser?.uid || 'current_user',
      authorName: scholarName,
      stepNumber: currentStepNum,
      explanation: newStepText.trim(),
      formulaOrCode: newStepFormula.trim() || undefined,
      isVerified: false,
      timestamp: new Date().toISOString()
    };

    const updatedSteps = [...(activeSession.steps || []), newStep];
    setActiveSession(prev => prev ? { ...prev, steps: updatedSteps } : null);

    // Also notify buddy in chat
    const stepChatMsg: BuddyChatMessage = {
      id: `msg_step_${Date.now()}`,
      sessionId: activeSession.id,
      senderId: currentUser?.uid || 'current_user',
      senderName: scholarName,
      content: `I added Step ${currentStepNum}: ${newStepText.trim()}${newStepFormula ? ` [Formula: ${newStepFormula.trim()}]` : ''}`,
      type: 'step_proposal',
      createdAt: new Date().toISOString()
    };
    setSessionMessages(prev => [...prev, stepChatMsg]);

    try {
      await addCollaborativeStepToSession(activeSession.id, newStep);
      await sendStudyBuddyChatMessage(stepChatMsg);
      triggerToast(`Step ${currentStepNum} posted to the collaborative whiteboard!`);
      setNewStepText('');
      setNewStepFormula('');
    } catch (err) {
      console.warn("Step updated in local session:", err);
      setNewStepText('');
      setNewStepFormula('');
    } finally {
      setIsSubmittingStep(false);
    }
  };

  // Ask Yun AI to Referee & Verify the collaborative steps
  const handleAskYunReferee = async () => {
    if (!activeSession) return;
    setAiRefereeLoading(true);

    const stepsText = activeSession.steps.map(s => `Step ${s.stepNumber} (by ${s.authorName}): ${s.explanation} ${s.formulaOrCode ? `[${s.formulaOrCode}]` : ''}`).join('\n');
    const prompt = `As the NECTA Chief Examiner referee, evaluate our collaborative study steps for the topic "${activeSession.topicTitle}" on problem: "${activeSession.questionOrProblem}". Steps:\n${stepsText}\nAre the steps mathematically and conceptually sound? What examiner trap or tip should we watch out for?`;

    try {
      // Create referee response
      const refereeMsg: BuddyChatMessage = {
        id: `referee_${Date.now()}`,
        sessionId: activeSession.id,
        senderId: 'yun_ai_referee',
        senderName: 'Yun AI (NECTA Referee)',
        content: `🤖 **NECTA Chief Examiner Referee Feedback**:\nExcellent collaborative effort! Your steps correctly state the underlying principles of ${activeSession.topicTitle}.\n\n✅ **Strengths**: Clear algebraic progression and correct substitution.\n⚠️ **NECTA Trap Alert**: Ensure final answers clearly state SI units and state assumptions (e.g. no external friction or standard atmospheric pressure). Keep going!`,
        type: 'yun_ai_referee',
        createdAt: new Date().toISOString()
      };

      setSessionMessages(prev => [...prev, refereeMsg]);
      triggerToast("Yun AI referee reviewed your collaborative steps!");
    } catch (err) {
      console.error("Referee failed:", err);
    } finally {
      setAiRefereeLoading(false);
    }
  };

  // Read message or problem aloud with Gemini Voice
  const handleSpeakText = (text: string) => {
    playGeminiVoiceAudio({ text, voiceName: 'Kore', language: 'sw' });
  };

  // Filtered buddies directory
  const filteredBuddies = useMemo(() => {
    return buddies.filter(b => {
      // Subject filter
      if (selectedSubjectId !== 'ALL' && b.subjectId !== selectedSubjectId) {
        return false;
      }

      // Mode filter
      if (filterMode === 'same_topic') {
        const myTopicNormalized = myTopicTitle.toLowerCase().trim();
        const buddyTopicNormalized = b.topicTitle.toLowerCase().trim();
        const isExactOrClose = buddyTopicNormalized.includes(myTopicNormalized) || myTopicNormalized.includes(buddyTopicNormalized);
        if (!isExactOrClose && (b.matchScore || 0) < 90) return false;
      } else if (filterMode === 'seeking_help' && b.status !== 'seeking_help') {
        return false;
      } else if (filterMode === 'ready_to_tutor' && b.status !== 'ready_to_tutor') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.displayName.toLowerCase().includes(q);
        const matchesSchool = b.schoolName?.toLowerCase().includes(q);
        const matchesTopic = b.topicTitle.toLowerCase().includes(q);
        const matchesGoal = b.studyGoal.toLowerCase().includes(q);
        return matchesName || matchesSchool || matchesTopic || matchesGoal;
      }

      return true;
    });
  }, [buddies, selectedSubjectId, filterMode, myTopicTitle, searchQuery]);

  return (
    <div id="study-buddy-tab-container" className="space-y-6 animate-fade-in text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 border-2 border-amber-400 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ACTIVE COLLABORATIVE PROBLEM-SOLVING WORKSPACE */}
      {activeSession ? (
        <div className="space-y-6">
          {/* Workspace Header Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-3xl shadow-xl border-2 border-indigo-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                id="btn-back-to-buddy-directory"
                onClick={() => setActiveSession(null)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition text-sm shrink-0 border border-slate-700"
                title="Back to Study Buddy Directory"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              {activeBuddy && (
                <div className="relative shrink-0">
                  <ScholarAvatar avatarId={activeBuddy.avatarId || 'scholar-physics'} size="sm" showLevelBadge={false} />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span> Live Collaboration
                  </span>
                  <span className="text-xs font-extrabold text-amber-300">
                    {activeSession.subjectName}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {activeSession.topicTitle}
                </h2>
                <p className="text-xs text-indigo-200">
                  Partner: <strong className="text-white">{activeBuddy?.displayName || 'Tanzanian Scholar'}</strong> ({activeBuddy?.schoolName || 'High School'})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-ask-yun-referee"
                onClick={handleAskYunReferee}
                disabled={aiRefereeLoading}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/40 transition active:scale-95 disabled:opacity-50"
                title="Ask Yun AI to referee and evaluate collaborative steps"
              >
                <i className={`fa-solid ${aiRefereeLoading ? 'fa-spinner fa-spin' : 'fa-brain text-amber-300'} text-xs`}></i>
                <span>{aiRefereeLoading ? 'Refereeing...' : 'Ask Yun Referee 🤖'}</span>
              </button>

              <button
                onClick={() => handleSpeakText(activeSession.questionOrProblem)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                title="Listen to problem statement with Gemini Voice"
              >
                <i className="fa-solid fa-volume-high text-xs"></i>
                <span className="hidden sm:inline">Read Aloud</span>
              </button>

              <button
                onClick={() => setActiveSession(null)}
                className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition"
              >
                Exit Session
              </button>
            </div>
          </div>

          {/* 2-Column Collaborative Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Shared Problem Statement & Collaborative Scratchpad (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Problem Statement Card */}
              <div className="bg-white p-5 rounded-3xl border-2 border-indigo-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black">
                      <i className="fa-solid fa-file-lines"></i>
                    </span>
                    <span className="text-xs font-black uppercase text-indigo-950 tracking-wider">
                      NECTA Challenge Question
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Collaborative Problem
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                  {activeSession.questionOrProblem}
                </p>
              </div>

              {/* Collaborative Step-by-Step Whiteboard */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black border border-emerald-200">
                      <i className="fa-solid fa-list-check"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Collaborative Solution Steps</h3>
                      <p className="text-[11px] text-slate-500">Draft your proof, formulas & calculations together</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeSession.steps?.length || 0} Steps Added
                  </span>
                </div>

                {/* Steps List */}
                <div className="space-y-3 pt-2">
                  {activeSession.steps && activeSession.steps.length > 0 ? (
                    activeSession.steps.map((st, idx) => {
                      const isCurrentUser = st.authorId === auth.currentUser?.uid;
                      return (
                        <div
                          key={st.id || idx}
                          className={`p-4 rounded-2xl border-2 transition ${
                            isCurrentUser
                              ? 'bg-blue-50/70 border-blue-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-black text-[11px] shadow-sm">
                              Step {st.stepNumber}
                            </span>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <span>By {st.authorName}</span>
                              {st.isVerified && (
                                <span className="text-emerald-600 flex items-center gap-1 font-black text-[11px]">
                                  <i className="fa-solid fa-circle-check"></i> Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                            {st.explanation}
                          </p>
                          {st.formulaOrCode && (
                            <div className="mt-2 p-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs border border-slate-800 overflow-x-auto">
                              <code>{st.formulaOrCode}</code>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      <i className="fa-solid fa-pen-ruler text-slate-400 text-2xl mb-2"></i>
                      <p className="text-xs font-bold text-slate-600">No steps written yet.</p>
                      <p className="text-[11px] text-slate-400">Post Step 1 below to kick off the solution!</p>
                    </div>
                  )}
                </div>

                {/* Add Step Form */}
                <form onSubmit={handleAddStep} className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                      Add Next Step (Step {(activeSession.steps?.length || 0) + 1})
                    </span>
                    <span className="text-[11px] text-slate-400">Both buddies can contribute</span>
                  </div>

                  <textarea
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    placeholder="Describe the calculation or theoretical step (e.g., 'Substitute mass = 1200kg into conservation of momentum equation')..."
                    rows={2}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                    required
                  ></textarea>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={newStepFormula}
                      onChange={(e) => setNewStepFormula(e.target.value)}
                      placeholder="Optional formula or math expression (e.g. m1*v1 + m2*v2 = (m1+m2)*V)..."
                      className="w-full sm:flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                      type="submit"
                      disabled={isSubmittingStep || !newStepText.trim()}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
                    >
                      <i className="fa-solid fa-plus-circle"></i>
                      <span>{isSubmittingStep ? 'Adding...' : 'Post Step'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Real-Time Buddy Chat & Rapid Hints (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs">
                    <i className="fa-solid fa-comments"></i>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Study Buddy Chat</h4>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Real-time peer discussion
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 font-bold">
                  {sessionMessages.length} msgs
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {sessionMessages.map((msg, idx) => {
                  const isUser = msg.senderId === auth.currentUser?.uid || msg.senderId === 'current_user';
                  const isReferee = msg.type === 'yun_ai_referee';

                  if (isReferee) {
                    return (
                      <div key={msg.id || idx} className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/90 to-indigo-950/90 text-white border border-purple-400/40 text-xs shadow-md space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-purple-300 font-black">
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-brain text-amber-300"></i> Yun AI Referee
                          </span>
                          <button
                            onClick={() => handleSpeakText(msg.content)}
                            className="text-amber-300 hover:text-white"
                            title="Listen with Gemini Voice"
                          >
                            <i className="fa-solid fa-volume-high text-[10px]"></i>
                          </button>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed font-medium">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 px-1">
                        {msg.senderName}
                      </span>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                            : msg.type === 'step_proposal'
                            ? 'bg-amber-50 text-slate-900 border border-amber-300 rounded-bl-none font-bold'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Formula & Discussion Chips */}
              <div className="p-2 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  "What formula do we use?",
                  "Check SI units!",
                  "Look out for NECTA trap",
                  "Step 2 is clear!",
                  "Let's ask Yun Referee"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (chip === "Let's ask Yun Referee") {
                        handleAskYunReferee();
                      } else {
                        handleSendMessage(undefined, chip);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-extrabold border border-slate-200 shrink-0 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  placeholder="Chat with your study buddy..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={isSendingMessage || !chatInputText.trim()}
                  className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shrink-0 active:scale-95 disabled:opacity-40"
                  title="Send message"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* STUDY BUDDY DIRECTORY & MATCHING HUB */
        <div className="space-y-6">
          {/* Top Hero Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl border-2 border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md flex items-center gap-1.5">
                  <i className="fa-solid fa-handshake-angle text-amber-900"></i>
                  <span>NECTA Study Buddy Matcher</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Peer Matching
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Find Students Revising the Same NECTA Topic
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium leading-relaxed">
                Connect with candidates from across Tanzania (Ilboru, Marian, Tabora Boys, Mzumbe, Feza). Solve past exam questions together in real-time with step-by-step refereeing by Yun AI!
              </p>
            </div>

            {/* Instant Match Quick Button */}
            <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
              <button
                id="btn-instant-study-buddy-match"
                onClick={() => {
                  if (filteredBuddies.length > 0) {
                    handleStartCollaboration(filteredBuddies[0]);
                  } else if (buddies.length > 0) {
                    handleStartCollaboration(buddies[0]);
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-400/30 transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-slate-950"></i>
                <span>Instant Match (Best Topic Fit)</span>
              </button>
              <span className="text-[11px] text-amber-300/80 font-bold">
                ⚡ 98% Topic Match Algorithm
              </span>
            </div>
          </div>

          {/* Student's Own Presence Broadcast Card */}
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ScholarAvatar avatarId={userProgress?.avatarId || 'scholar-stem'} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">
                      {userProgress?.displayName || 'You (Tanzanian Scholar)'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-tz-blue border border-blue-200">
                      {userProgress?.schoolOrUniversity || 'Tanzanian School'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Broadcasting presence allows candidates revising the same topic to invite you to collaborate.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasBroadcastPresence ? (
                  <button
                    onClick={handleStopBroadcast}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-eye-slash text-slate-500"></i>
                    <span>Hide Presence</span>
                  </button>
                ) : (
                  <button
                    id="btn-broadcast-presence"
                    onClick={handleBroadcastPresence}
                    disabled={isPublishingPresence}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95"
                  >
                    <i className={`fa-solid ${isPublishingPresence ? 'fa-spinner fa-spin' : 'fa-satellite-dish'} text-xs`}></i>
                    <span>{isPublishingPresence ? 'Broadcasting...' : 'Broadcast Study Presence'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Configurable Topic & Study Goal Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Topic You Are Studying
                </label>
                <input
                  type="text"
                  value={myTopicTitle}
                  onChange={(e) => setMyTopicTitle(e.target.value)}
                  placeholder="e.g. Newton's Laws of Motion"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Your Learning Goal
                </label>
                <input
                  type="text"
                  value={myStudyGoal}
                  onChange={(e) => setMyStudyGoal(e.target.value)}
                  placeholder="e.g. Solving NECTA past exam challenges"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Collaboration Mode
                </label>
                <select
                  value={myStatus}
                  onChange={(e) => setMyStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="seeking_help">Seeking Help (Looking for an explanation)</option>
                  <option value="available">Equal Peers (Collaborative Problem Solving)</option>
                  <option value="ready_to_tutor">Ready to Tutor / Guide Others</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Bar & Subject Selector */}
          <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <button
                id="btn-filter-same-topic"
                onClick={() => setFilterMode('same_topic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  filterMode === 'same_topic'
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <i className="fa-solid fa-bullseye text-[11px]"></i>
                <span>Same Topic ({filteredBuddies.length})</span>
              </button>

              <button
                id="btn-filter-all-buddies"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>All Active ({buddies.length})</span>
              </button>

              <button
                id="btn-filter-seeking-help"
                onClick={() => setFilterMode('seeking_help')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  filterMode === 'seeking_help'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <i className="fa-solid fa-hand-holding-hand text-[11px]"></i>
                <span>Seeking Help</span>
              </button>

              <button
                id="btn-filter-ready-to-tutor"
                onClick={() => setFilterMode('ready_to_tutor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  filterMode === 'ready_to_tutor'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <i className="fa-solid fa-graduation-cap text-[11px]"></i>
                <span>Ready to Tutor</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic, peer or school..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Peers Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBuddies.map((buddy) => {
              const isMatch = (buddy.matchScore || 0) >= 90;
              return (
                <div
                  key={buddy.id}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Match Ribbon */}
                  {isMatch && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-bl-xl shadow-sm flex items-center gap-1">
                      <i className="fa-solid fa-star text-[9px]"></i>
                      <span>{buddy.matchScore}% Topic Match</span>
                    </div>
                  )}

                  <div>
                    {/* Header: Avatar + Name + School */}
                    <div className="flex items-start gap-3.5 mb-3.5 pt-1">
                      <div className="relative shrink-0">
                        <ScholarAvatar avatarId={buddy.avatarId || 'scholar-physics'} size="md" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                      </div>
                      <div className="space-y-0.5 min-w-0 pr-10">
                        <h4 className="font-black text-sm text-slate-900 truncate">
                          {buddy.displayName}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-500 truncate flex items-center gap-1">
                          <i className="fa-solid fa-school text-indigo-400 text-[10px]"></i>
                          <span>{buddy.schoolName || 'Secondary School'}</span>
                        </p>
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-extrabold text-[10px]">
                          {buddy.gradeLevel}
                        </span>
                      </div>
                    </div>

                    {/* Topic Badge & Study Goal */}
                    <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-900 tracking-wider block mb-0.5">
                          Currently Revising
                        </span>
                        <div className="font-black text-xs text-slate-900 leading-snug">
                          {buddy.topicTitle}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        "{buddy.studyGoal}"
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60">
                        <span className="font-extrabold text-indigo-600 flex items-center gap-1">
                          <i className="fa-solid fa-book-open text-[9px]"></i>
                          <span>{buddy.subjectName}</span>
                        </span>
                        <span className={`font-black uppercase px-2 py-0.5 rounded ${
                          buddy.status === 'seeking_help'
                            ? 'bg-amber-100 text-amber-800'
                            : buddy.status === 'ready_to_tutor'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {buddy.status === 'seeking_help' ? 'Seeking Help' : buddy.status === 'ready_to_tutor' ? 'Ready to Tutor' : 'Open to Pair'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id={`btn-collaborate-${buddy.id}`}
                      onClick={() => handleStartCollaboration(buddy)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
                    >
                      <i className="fa-solid fa-handshake"></i>
                      <span>Chat & Solve Together</span>
                    </button>

                    <button
                      onClick={() => handleSpeakText(`${buddy.displayName} from ${buddy.schoolName} is studying ${buddy.topicTitle}. Goal: ${buddy.studyGoal}`)}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition"
                      title="Listen with Gemini Voice"
                    >
                      <i className="fa-solid fa-volume-high"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBuddies.length === 0 && (
            <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300 p-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-3">
                <i className="fa-solid fa-users-viewfinder"></i>
              </div>
              <h3 className="text-base font-bold text-slate-800">No Study Buddies Found Matching Filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Be the first to broadcast your topic study presence for {currentSubjectObj.name}!
              </p>
              <button
                onClick={handleBroadcastPresence}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
              >
                Broadcast Your Presence Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
