import React, { useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import StudyMusicPlayer from './StudyMusicPlayer';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface StudyTask {
  id: string;
  day: DayOfWeek;
  time: string; // HH:MM 24hr format e.g. "16:30"
  subject: string;
  topicTitle: string;
  durationMinutes: number;
  priority: 'High' | 'Medium' | 'Low';
  notes?: string;
  completed: boolean;
  completedAt?: string;
  reminderEnabled: boolean;
}

const DAYS_LIST: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SUBJECT_OPTIONS = [
  { name: 'Mathematics', icon: 'fa-calculator', color: 'bg-indigo-600', textColor: 'text-indigo-600', bgLight: 'bg-indigo-50' },
  { name: 'Physics', icon: 'fa-atom', color: 'bg-cyan-600', textColor: 'text-cyan-600', bgLight: 'bg-cyan-50' },
  { name: 'Chemistry', icon: 'fa-vial', color: 'bg-emerald-600', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50' },
  { name: 'Biology', icon: 'fa-dna', color: 'bg-teal-600', textColor: 'text-teal-600', bgLight: 'bg-teal-50' },
  { name: 'Kiswahili', icon: 'fa-book-open', color: 'bg-amber-600', textColor: 'text-amber-600', bgLight: 'bg-amber-50' },
  { name: 'English Language', icon: 'fa-language', color: 'bg-blue-600', textColor: 'text-blue-600', bgLight: 'bg-blue-50' },
  { name: 'Geography', icon: 'fa-earth-africa', color: 'bg-green-600', textColor: 'text-green-600', bgLight: 'bg-green-50' },
  { name: 'History', icon: 'fa-monument', color: 'bg-yellow-700', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
  { name: 'Civics', icon: 'fa-scale-balanced', color: 'bg-purple-600', textColor: 'text-purple-600', bgLight: 'bg-purple-50' },
  { name: 'Commerce & Accounts', icon: 'fa-chart-line', color: 'bg-slate-700', textColor: 'text-slate-700', bgLight: 'bg-slate-100' },
  { name: 'Information & Computer Tech', icon: 'fa-laptop-code', color: 'bg-rose-600', textColor: 'text-rose-600', bgLight: 'bg-rose-50' },
];

const SAMPLE_PRESET_TIMETABLE: Omit<StudyTask, 'id' | 'completed' | 'completedAt'>[] = [
  { day: 'Monday', time: '16:00', subject: 'Mathematics', topicTitle: 'Algebra & Quadratic Equations', durationMinutes: 45, priority: 'High', reminderEnabled: true, notes: 'Solve 10 past paper questions from NECTA CSEE 2022' },
  { day: 'Monday', time: '17:30', subject: 'Biology', topicTitle: 'Cell Structure & Mitosis', durationMinutes: 30, priority: 'Medium', reminderEnabled: true, notes: 'Draw and label plant cell diagrams' },
  { day: 'Tuesday', time: '16:00', subject: 'Physics', topicTitle: "Newton's Laws & Force Calculations", durationMinutes: 60, priority: 'High', reminderEnabled: true, notes: 'Memorize F = ma derivations' },
  { day: 'Tuesday', time: '17:45', subject: 'Kiswahili', topicTitle: 'Ushairi na Fani ya Fasihi', durationMinutes: 30, priority: 'Medium', reminderEnabled: false, notes: 'Changanua shairi la NECTA' },
  { day: 'Wednesday', time: '16:00', subject: 'Chemistry', topicTitle: 'Periodic Table & Chemical Bonding', durationMinutes: 45, priority: 'High', reminderEnabled: true, notes: 'Focus on ionic vs covalent bonds' },
  { day: 'Wednesday', time: '17:15', subject: 'English Language', topicTitle: 'Essay Writing & Letter Formats', durationMinutes: 40, priority: 'Medium', reminderEnabled: true, notes: 'Practice formal complaint letter structure' },
  { day: 'Thursday', time: '16:00', subject: 'Geography', topicTitle: 'Map Reading & Grid References', durationMinutes: 50, priority: 'High', reminderEnabled: true, notes: 'Calculate map gradient and scale' },
  { day: 'Thursday', time: '17:30', subject: 'Civics', topicTitle: 'Tanzania Constitution & Human Rights', durationMinutes: 30, priority: 'Low', reminderEnabled: false, notes: 'Review 1977 Constitution amendments' },
  { day: 'Friday', time: '16:00', subject: 'History', topicTitle: 'Scramble for & Partition of Africa', durationMinutes: 45, priority: 'Medium', reminderEnabled: true, notes: 'Summarize Berlin Conference causes & effects' },
  { day: 'Friday', time: '17:15', subject: 'Mathematics', topicTitle: 'Trigonometry & Bearing Calculations', durationMinutes: 45, priority: 'High', reminderEnabled: true, notes: 'Sine and Cosine rule practice' },
  { day: 'Saturday', time: '09:00', subject: 'Physics', topicTitle: 'Light Reflection & Lenses Practical', durationMinutes: 60, priority: 'High', reminderEnabled: true, notes: 'Focal length calculations' },
  { day: 'Saturday', time: '10:30', subject: 'Biology', topicTitle: 'Genetics & Punnett Square Problems', durationMinutes: 45, priority: 'High', reminderEnabled: true, notes: 'Monohybrid cross examples' },
  { day: 'Sunday', time: '10:00', subject: 'Chemistry', topicTitle: 'Molar Mass & Titration Calculations', durationMinutes: 60, priority: 'High', reminderEnabled: true, notes: 'Review titration calculation steps' },
  { day: 'Sunday', time: '15:00', subject: 'Commerce & Accounts', topicTitle: 'Trial Balance & Financial Statements', durationMinutes: 45, priority: 'Medium', reminderEnabled: false, notes: 'Balance sheet reconciliation' }
];

export const StudyPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('elimu_study_planner_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SAMPLE_PRESET_TIMETABLE.map((t, idx) => ({ ...t, id: `preset-${idx}-${Date.now()}`, completed: false }));
  });

  const [selectedDayFilter, setSelectedDayFilter] = useState<DayOfWeek | 'ALL'>('ALL');
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Modal State for Adding / Editing Task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  // Form State
  const [formDay, setFormDay] = useState<DayOfWeek>('Monday');
  const [formTime, setFormTime] = useState('16:00');
  const [formSubject, setFormSubject] = useState('Mathematics');
  const [formTopicTitle, setFormTopicTitle] = useState('');
  const [formDuration, setFormDuration] = useState(45);
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [formNotes, setFormNotes] = useState('');
  const [formReminder, setFormReminder] = useState(true);

  // Focus Timer Widget State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerTaskTitle, setTimerTaskTitle] = useState<string | null>(null);

  // YouTube Music Area Toggle State
  const [showMusicPlayer, setShowMusicPlayer] = useState<boolean>(true);

  // Web Audio Synth for Reminder Chimes
  const playChime = (type: 'reminder' | 'success') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error(e);
    }
  };

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('elimu_study_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Check Notification API support
  useEffect(() => {
    if ('Notification' in window) {
      setIsNotificationSupported(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request Push Notification Permission
  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser window.');
      return;
    }
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      playChime('reminder');
      new Notification('ElimuTanzania Study Planner Alerts Enabled! 📚', {
        body: 'You will receive reminders when your scheduled study sessions arrive.',
        icon: '/favicon.ico'
      });
      setActiveAlert('Push notifications enabled successfully! 🔔');
      setTimeout(() => setActiveAlert(null), 4000);
    } else if (perm === 'denied') {
      alert('Notification permissions were blocked. Please enable them in browser settings if you wish to receive study reminders.');
    }
  };

  // Automated Reminder Interval Checker
  useEffect(() => {
    const checkScheduleReminders = () => {
      const now = new Date();
      const currentDayIndex = now.getDay(); // 0 is Sunday, 1 is Monday...
      const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = dayNames[currentDayIndex];

      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      // Find uncompleted tasks matching today's time with reminder enabled
      const matched = tasks.find(
        t => t.day === todayName && t.time === currentTimeStr && t.reminderEnabled && !t.completed
      );

      if (matched) {
        playChime('reminder');
        const alertMsg = `⏰ IT'S TIME TO STUDY: ${matched.subject} - ${matched.topicTitle} (${matched.durationMinutes} mins)`;
        setActiveAlert(alertMsg);

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Study Reminder: ${matched.subject}`, {
            body: `Topic: ${matched.topicTitle} (${matched.durationMinutes} minutes)`,
            icon: '/favicon.ico'
          });
        }
      }
    };

    const interval = setInterval(checkScheduleReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks]);

  // Focus Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playChime('success');
      setActiveAlert(`🎉 Great job! You finished your study timer session: ${timerTaskTitle || 'Study Session'}`);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerSeconds, timerTaskTitle]);

  const formatTimerTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startFocusTimerForTask = (task: StudyTask) => {
    setTimerTaskTitle(`${task.subject}: ${task.topicTitle}`);
    setTimerSeconds(task.durationMinutes * 60);
    setIsTimerRunning(true);
    playChime('reminder');
  };

  // Toggle Task Completion
  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        if (nextCompleted) {
          playChime('success');
        }
        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return task;
    }));
  };

  // Delete Task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Open Modal for Create or Edit
  const handleOpenAddModal = (day?: DayOfWeek) => {
    setEditingTaskId(null);
    setFormDay(day || 'Monday');
    setFormTime('16:00');
    setFormSubject('Mathematics');
    setFormTopicTitle('');
    setFormDuration(45);
    setFormPriority('High');
    setFormNotes('');
    setFormReminder(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: StudyTask) => {
    setEditingTaskId(task.id);
    setFormDay(task.day);
    setFormTime(task.time);
    setFormSubject(task.subject);
    setFormTopicTitle(task.topicTitle);
    setFormDuration(task.durationMinutes);
    setFormPriority(task.priority);
    setFormNotes(task.notes || '');
    setFormReminder(task.reminderEnabled);
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopicTitle.trim()) {
      alert('Please enter a topic title for your study task.');
      return;
    }

    if (editingTaskId) {
      setTasks(prev => prev.map(t => t.id === editingTaskId ? {
        ...t,
        day: formDay,
        time: formTime,
        subject: formSubject,
        topicTitle: formTopicTitle.trim(),
        durationMinutes: formDuration,
        priority: formPriority,
        notes: formNotes.trim(),
        reminderEnabled: formReminder
      } : t));
    } else {
      const newTask: StudyTask = {
        id: `task-${Date.now()}`,
        day: formDay,
        time: formTime,
        subject: formSubject,
        topicTitle: formTopicTitle.trim(),
        durationMinutes: formDuration,
        priority: formPriority,
        notes: formNotes.trim(),
        completed: false,
        reminderEnabled: formReminder
      };
      setTasks(prev => [...prev, newTask]);
    }

    setIsModalOpen(false);
  };

  // Reset to NECTA Preset Timetable
  const handleResetToPreset = () => {
    if (confirm('Replace current planner tasks with the recommended NECTA Weekly Exam Preparation Timetable?')) {
      const fresh = SAMPLE_PRESET_TIMETABLE.map((t, idx) => ({ ...t, id: `preset-${idx}-${Date.now()}`, completed: false }));
      setTasks(fresh);
      setActiveAlert('Loaded standard NECTA 7-Day Study Timetable! 📚');
      setTimeout(() => setActiveAlert(null), 3000);
    }
  };

  // Clear All Tasks
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all tasks from your study planner?')) {
      setTasks([]);
    }
  };

  // PDF Export
  const downloadPlannerPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 12;

      // Header Banner
      doc.setFillColor(30, 27, 75); // Slate 900
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setFillColor(250, 204, 21); // Amber 400
      doc.rect(0, 28, pageWidth, 2, 'F');

      doc.setTextColor(250, 204, 21);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('ElimuTanzania • Weekly Study Planner & Exam Schedule', margin, 10);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('NECTA & TIE Official Student Study Timetable', margin, 20);

      let currentY = 36;

      DAYS_LIST.forEach(dayName => {
        const dayTasks = tasks.filter(t => t.day === dayName);

        doc.setFillColor(241, 245, 249);
        doc.rect(margin, currentY, pageWidth - (margin * 2), 7, 'F');

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(`${dayName.toUpperCase()} (${dayTasks.length} Scheduled Sessions)`, margin + 3, currentY + 5);

        currentY += 10;

        if (dayTasks.length === 0) {
          doc.setTextColor(148, 163, 184);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.text('No study sessions scheduled.', margin + 5, currentY);
          currentY += 6;
        } else {
          dayTasks.forEach(task => {
            if (currentY > 270) {
              doc.addPage();
              currentY = 20;
            }

            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.text(`[${task.time}] ${task.subject}: ${task.topicTitle}`, margin + 5, currentY);

            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.text(`Duration: ${task.durationMinutes}m | Priority: ${task.priority} | Status: ${task.completed ? 'COMPLETED' : 'PENDING'}`, margin + 5, currentY + 4);

            currentY += 9;
          });
        }

        currentY += 3;
      });

      doc.save('ElimuTZ_Weekly_Study_Planner.pdf');
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Print layout instead.');
    }
  };

  // Stats
  const totalScheduled = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = totalScheduled > 0 ? Math.round((completedCount / totalScheduled) * 100) : 0;
  const earnedXp = completedCount * 20;

  // Filtered Tasks
  const displayedTasks = useMemo(() => {
    if (selectedDayFilter === 'ALL') return tasks;
    return tasks.filter(t => t.day === selectedDayFilter);
  }, [tasks, selectedDayFilter]);

  // Today's Tasks
  const todayDayName = useMemo(() => {
    const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[new Date().getDay()];
  }, []);

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.day === todayDayName);
  }, [tasks, todayDayName]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Alert Banner */}
      {activeAlert && (
        <div className="bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg border border-amber-500 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bell text-lg"></i>
            <span>{activeAlert}</span>
          </div>
          <button onClick={() => setActiveAlert(null)} className="text-slate-950 hover:opacity-75">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider">
              <i className="fa-solid fa-calendar-check text-amber-400"></i> NECTA Weekly Timetable & Task Automation
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Interactive Study Planner & Reminder Engine
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Schedule your weekly TIE syllabus subjects, set automated push notifications, and lock in study habits to maximize your NECTA exam scores.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2 active:scale-95"
            >
              <i className="fa-solid fa-plus"></i> Add Study Task
            </button>

            <button
              onClick={handleResetToPreset}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition border border-white/20 flex items-center gap-1.5"
              title="Auto-fill recommended 7-day NECTA exam timetable"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-amber-300"></i> Auto-Generate Schedule
            </button>

            <button
              onClick={() => setShowMusicPlayer(!showMusicPlayer)}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition border flex items-center gap-1.5 shadow-md ${
                showMusicPlayer
                  ? 'bg-red-500/20 text-red-300 border-red-400/50 hover:bg-red-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Toggle YouTube Music & Study Songs Engine"
            >
              <i className="fa-brands fa-youtube text-red-500 text-sm"></i>
              <span>{showMusicPlayer ? 'Music Hub Active 🎵' : 'YouTube Music Area'}</span>
            </button>

            <button
              onClick={downloadPlannerPdf}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <i className="fa-solid fa-file-pdf"></i> Download PDF
            </button>
          </div>
        </div>

        {/* Stats & Progress Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-gray-400 block uppercase">Weekly Goal</span>
            <span className="text-xl sm:text-2xl font-black text-white">{completedCount} / {totalScheduled} Tasks</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-gray-400 block uppercase">Completion Rate</span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{completionPercentage}%</span>
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden hidden sm:block">
                <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-gray-400 block uppercase">XP Earned</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">+{earnedXp} XP</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs font-bold text-gray-400 block uppercase">Automated Push Alerts</span>
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-black uppercase ${notificationPermission === 'granted' ? 'text-emerald-400' : 'text-amber-300'}`}>
                {notificationPermission === 'granted' ? 'Active 🔔' : 'Not Enabled'}
              </span>
              {notificationPermission !== 'granted' && (
                <button
                  onClick={handleRequestNotification}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] hover:bg-amber-300 transition"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus & Quick Pomodoro Study Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-black text-[10px] uppercase">
                {todayDayName}'s Focus
              </span>
              <h3 className="text-xl font-black text-gray-900 mt-1">Today's Scheduled Study Tasks</h3>
            </div>
            <span className="text-xs font-extrabold text-gray-400">{todayTasks.length} Tasks Scheduled Today</span>
          </div>

          {todayTasks.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 text-xs font-medium space-y-2">
              <p>No study tasks scheduled for today ({todayDayName}).</p>
              <button
                onClick={() => handleOpenAddModal(todayDayName)}
                className="text-indigo-600 font-bold hover:underline"
              >
                + Schedule a task for today
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todayTasks.map(task => {
                const subjInfo = SUBJECT_OPTIONS.find(s => s.name === task.subject) || SUBJECT_OPTIONS[0];
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      task.completed
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-xl ${subjInfo.color} text-white flex items-center justify-center text-xs shadow-sm`}>
                          <i className={`fa-solid ${subjInfo.icon}`}></i>
                        </span>
                        <div>
                          <span className="text-[11px] font-black text-gray-900 block">{task.subject}</span>
                          <span className="text-[10px] font-bold text-indigo-600">⏰ {task.time} ({task.durationMinutes}m)</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition ${
                          task.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-gray-300 hover:border-emerald-500 text-transparent'
                        }`}
                        title="Mark Complete"
                      >
                        <i className="fa-solid fa-check text-xs"></i>
                      </button>
                    </div>

                    <div>
                      <h4 className={`font-black text-xs ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.topicTitle}
                      </h4>
                      {task.notes && <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{task.notes}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {task.priority} Priority
                      </span>

                      <button
                        onClick={() => startFocusTimerForTask(task)}
                        className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <i className="fa-solid fa-stopwatch"></i> Start 25m Timer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Built-in Focus Study Timer Widget */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase border border-amber-400/30">
              <i className="fa-solid fa-hourglass-half"></i> Pomodoro Focus Engine
            </span>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(25 * 60);
              }}
              className="text-gray-400 hover:text-white text-xs font-bold"
            >
              Reset Timer
            </button>
          </div>

          <div className="text-center space-y-2 py-2">
            <div className="text-5xl font-black tracking-tight text-amber-300 font-mono">
              {formatTimerTime(timerSeconds)}
            </div>
            <p className="text-xs font-bold text-gray-400 truncate max-w-xs mx-auto">
              {timerTaskTitle || 'Select a topic to focus study'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (!isTimerRunning) playChime('reminder');
                setIsTimerRunning(!isTimerRunning);
              }}
              className={`py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
                isTimerRunning
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              <i className={`fa-solid ${isTimerRunning ? 'fa-pause' : 'fa-play'}`}></i>
              {isTimerRunning ? 'Pause Session' : 'Start Focus'}
            </button>

            <button
              onClick={() => {
                setTimerSeconds(15 * 60);
                setIsTimerRunning(false);
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-black text-xs transition border border-slate-700"
            >
              15m Break
            </button>
          </div>
        </div>
      </div>

      {/* YOUTUBE STUDY MUSIC HUB AREA */}
      {showMusicPlayer && (
        <StudyMusicPlayer onClose={() => setShowMusicPlayer(false)} />
      )}

      {/* Main Weekly Schedule Board */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm space-y-6">
        {/* Day Selector Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedDayFilter('ALL')}
              className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                selectedDayFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Full 7-Day View ({tasks.length})
            </button>

            {DAYS_LIST.map(day => {
              const dayCount = tasks.filter(t => t.day === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDayFilter(day)}
                  className={`px-3 py-2 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                    selectedDayFilter === day
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{day.slice(0, 3)}</span>
                  {dayCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedDayFilter === day ? 'bg-indigo-800 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {dayCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 font-extrabold hover:text-red-700 transition"
            >
              <i className="fa-solid fa-trash-can mr-1"></i> Clear All
            </button>
          </div>
        </div>

        {/* Task Cards Display */}
        {displayedTasks.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 space-y-3 max-w-md mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto">
              <i className="fa-solid fa-calendar-plus"></i>
            </div>
            <h4 className="text-base font-black text-gray-900">No Tasks Scheduled for {selectedDayFilter}</h4>
            <p className="text-xs text-gray-500">Plan ahead by adding your key subject topics to study on this day.</p>
            <button
              onClick={() => handleOpenAddModal(selectedDayFilter === 'ALL' ? 'Monday' : selectedDayFilter)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md hover:bg-indigo-700 transition inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add New Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTasks.map(task => {
              const subjInfo = SUBJECT_OPTIONS.find(s => s.name === task.subject) || SUBJECT_OPTIONS[0];
              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl p-5 border-2 transition-all space-y-3 flex flex-col justify-between hover:shadow-lg ${
                    task.completed
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-gray-100 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-10 h-10 rounded-2xl ${subjInfo.color} text-white flex items-center justify-center text-sm shadow-sm`}>
                        <i className={`fa-solid ${subjInfo.icon}`}></i>
                      </span>
                      <div>
                        <span className="text-xs font-black text-gray-900 block">{task.subject}</span>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-extrabold">
                          <span className="text-indigo-600"><i className="fa-solid fa-calendar mr-1"></i>{task.day}</span>
                          <span>•</span>
                          <span><i className="fa-solid fa-clock mr-1"></i>{task.time} ({task.durationMinutes}m)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition shrink-0 ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-gray-300 hover:border-emerald-500 text-transparent'
                      }`}
                      title="Toggle Complete"
                    >
                      <i className="fa-solid fa-check text-xs"></i>
                    </button>
                  </div>

                  <div>
                    <h4 className={`font-black text-sm leading-snug ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.topicTitle}
                    </h4>
                    {task.notes && (
                      <p className="text-xs text-gray-600 font-medium mt-1 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        {task.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' :
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {task.priority} Priority
                      </span>

                      {task.reminderEnabled && (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <i className="fa-solid fa-bell text-[9px] mr-1"></i> Alert On
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition text-xs"
                        title="Edit Task"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition text-xs"
                        title="Delete Task"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-gray-900">
                {editingTaskId ? 'Edit Scheduled Study Task' : 'Schedule New Study Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Day of Week</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-indigo-600"
                  >
                    {DAYS_LIST.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Study Start Time</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">Subject</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-indigo-600"
                >
                  {SUBJECT_OPTIONS.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">Topic / Study Objective</label>
                <input
                  type="text"
                  placeholder="e.g. Quadratic Equations & NECTA Past Questions"
                  value={formTopicTitle}
                  onChange={(e) => setFormTopicTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Target Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-indigo-600"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                    <option value={120}>2 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-indigo-600"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">Study Notes / Goal Instructions (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Review pages 45-52 in TIE textbook, solve 5 practice problems"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-bell text-indigo-600 text-sm"></i>
                  <div>
                    <span className="text-xs font-black text-gray-900 block">Automated Push Alert</span>
                    <span className="text-[10px] text-gray-500 font-medium">Send notification chime when study time arrives</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formReminder}
                  onChange={(e) => setFormReminder(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition"
                >
                  {editingTaskId ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
