import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { GradeLevel, AppView, GradeSyllabus, Subject, Topic, UserProgress, QuizQuestion, EducationLevel, QuickStudySession } from './types';
import { SYLLABUS_DATA } from './constants';
import ChatInterface from './components/ChatInterface';
import RadarChart, { SubjectProficiency } from './components/RadarChart';
import { StudyTrendChart } from './components/StudyTrendChart';
import ExamVault from './components/ExamVault';
import TeachersHub from './components/TeachersHub';
import ALevelGuide from './components/ALevelGuide';
import Dictionary from './components/Dictionary';
import NotesHub from './components/NotesHub';
import StudyPlanner from './components/StudyPlanner';
import { SchoolAdmissionPredictor } from './components/SchoolAdmissionPredictor';
import { AdminPanel } from './components/AdminPanel';
import { AssignmentsAndTestsBank } from './components/AssignmentsAndTestsBank';
import { NectaCountdownTimer } from './components/NectaCountdownTimer';
import { Badges } from './components/Badges';
import { GradeChecker } from './components/GradeChecker';
import StrategicRoadmap from './components/StrategicRoadmap';
import { RoadmapModal } from './components/RoadmapModal';
import { getDeepLessonNote } from './src/data/deepTopicNotes';
import { getHomeworkForTopic } from './src/data/curriculumEnhancer';
import { 
  getTopicDifficulty, 
  DifficultyBadge, 
  TopicCompletedBadge,
  getSubjectDifficulty,
  getSubjectCategory,
  SubjectDifficultyBadge,
  SubjectDifficulty
} from './src/data/difficultyHelpers';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ShareProgressModal } from './components/ShareProgressModal';
import { YunAvatar3D } from './components/YunAvatar3D';
import { generateQuizQuestion } from './services/geminiService';
import { 
  auth, 
  loginWithGoogle,
  getUserProgress, 
  saveUserProgress,
  checkIsAdmin,
  updateUserCredits,
  searchUserByEmail,
  getAllUsers
} from './services/firebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Vocabulary Generator for Language Subjects & General Topics ---
const getTopicVocabulary = (subjectName: string, topicTitle: string) => {
  const subLower = subjectName.toLowerCase();
  
  if (subLower.includes('french') || subLower.includes('kifaransa')) {
    return [
      { term: 'Bonjour', translation: 'Habari / Good Morning', phonetic: '[boh-zhoor]' },
      { term: 'Merci beaucoup', translation: 'Asante sana / Thank you very much', phonetic: '[mahr-see boh-koo]' },
      { term: 'S\'il vous plaît', translation: 'Tafadhali / Please', phonetic: '[seel voo pleh]' },
      { term: 'Au revoir', translation: 'Kwaheri / Goodbye', phonetic: '[oh ruh-vwahr]' },
      { term: 'Comment allez-vous?', translation: 'Habari gani? / How are you?', phonetic: '[koh-mah tah-lay voo]' },
      { term: 'Je m\'appelle...', translation: 'Jina langu ni... / My name is...', phonetic: '[zhuh mah-pell]' }
    ];
  } else if (subLower.includes('arabic') || subLower.includes('kiarabu')) {
    return [
      { term: 'مرحباً (Marhaban)', translation: 'Habari / Hello', phonetic: '[Mar-ha-ban]' },
      { term: 'شكراً (Shukran)', translation: 'Asante / Thank you', phonetic: '[Shuk-ran]' },
      { term: 'من فضلك (Min fadlik)', translation: 'Tafadhali / Please', phonetic: '[Min fad-lik]' },
      { term: 'مع السلامة (Ma\'a as-salamah)', translation: 'Kwaheri / Goodbye', phonetic: '[Ma-a as-sa-la-mah]' },
      { term: 'كيف حالك؟ (Kayfa haluk?)', translation: 'Habari gani? / How are you?', phonetic: '[Kay-fa ha-luk]' },
      { term: 'اسمى... (Ismee...)', translation: 'Jina langu ni... / My name is...', phonetic: '[Is-mee]' }
    ];
  } else if (subLower.includes('chinese') || subLower.includes('kichina')) {
    return [
      { term: '你好 (Nǐ hǎo)', translation: 'Habari / Hello', phonetic: '[Nee how]' },
      { term: '谢谢 (Xièxie)', translation: 'Asante / Thank you', phonetic: '[Shyeh-shyeh]' },
      { term: '再见 (Zàijiàn)', translation: 'Kwaheri / Goodbye', phonetic: '[Dzaye-jyen]' },
      { term: '请 (Qǐng)', translation: 'Tafadhali / Please', phonetic: '[Cheeng]' },
      { term: '对不起 (Duìbuqǐ)', translation: 'Samahani / Sorry', phonetic: '[Dway-boo-chee]' },
      { term: '没关系 (Méi guānxi)', translation: 'Bila shaka / No problem', phonetic: '[May gwan-shee]' }
    ];
  } else if (subLower.includes('kiswahili')) {
    return [
      { term: 'Jambo', translation: 'Hello / Greetings', phonetic: '[Jah-mboh]' },
      { term: 'Asante sana', translation: 'Thank you very much', phonetic: '[Ah-sahn-teh sah-nah]' },
      { term: 'Fasihi', translation: 'Literature / Artistic works', phonetic: '[Fah-see-hee]' },
      { term: 'Sarufi', translation: 'Grammar & Syntax', phonetic: '[Sah-roo-fee]' },
      { term: 'Ufahamu', translation: 'Comprehension & Reading', phonetic: '[Oo-fah-ha-moo]' },
      { term: 'Insha', translation: 'Essay / Composition', phonetic: '[Een-shah]' }
    ];
  } else {
    return [
      { term: 'Comprehension', translation: 'Ufahamu (Kuelewa maandishi)', phonetic: '[kom-pri-hen-shuhn]' },
      { term: 'Vocabulary', translation: 'Msamiati (Maneno mapya)', phonetic: '[voh-kab-yuh-ler-ee]' },
      { term: 'Syntax', translation: 'Muundo wa Sentensi', phonetic: '[sin-taks]' },
      { term: 'Punctuation', translation: 'Alama za Uandishi', phonetic: '[pungk-choo-ey-shuhn]' },
      { term: 'Grammar', translation: 'Sarufi ya Lugha', phonetic: '[gram-er]' },
      { term: 'Pronunciation', translation: 'Katamka / Matamshi', phonetic: '[pruh-nuhn-see-ey-shuhn]' }
    ];
  }
};

const speakWord = (text: string, langHint: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const subLower = langHint.toLowerCase();
    if (subLower.includes('french') || subLower.includes('kifaransa')) utterance.lang = 'fr-FR';
    else if (subLower.includes('arabic') || subLower.includes('kiarabu')) utterance.lang = 'ar-SA';
    else if (subLower.includes('chinese') || subLower.includes('kichina')) utterance.lang = 'zh-CN';
    else if (subLower.includes('kiswahili')) utterance.lang = 'sw-TZ';
    else utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
};

// --- Sub-Components (Memoized for high rendering efficiency) ---

const SubjectIcon = React.memo(({ icon }: { icon: string }) => (
  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-tz-blue text-xl mb-3 group-hover:bg-tz-blue group-hover:text-white transition-colors duration-300 border-2 border-gray-100">
    <i className={`fa-solid ${icon}`}></i>
  </div>
));

const ProgressBar = React.memo(({ progress, color = "bg-tz-green" }: { progress: number, color?: string }) => (
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
  </div>
));

const LeaderboardRow = React.memo(({ rank, name, points, isUser }: { rank: number, name: string, points: number, isUser?: boolean }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl mb-2 ${isUser ? 'bg-blue-50 border-2 border-tz-blue' : 'bg-white border border-gray-100'}`}>
    <div className="flex items-center gap-4">
      <span className={`font-bold w-6 text-center ${rank <= 3 ? 'text-tz-yellow text-xl' : 'text-gray-500'}`}>
        {rank === 1 ? <i className="fa-solid fa-crown"></i> : rank}
      </span>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isUser ? 'bg-tz-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
          {name.charAt(0).toUpperCase()}
        </div>
        <span className={`font-medium ${isUser ? 'text-tz-blue font-bold' : 'text-gray-700'}`}>{name}</span>
      </div>
    </div>
    <span className="font-bold text-gray-600">{points} XP</span>
  </div>
));

// --- Components ---

interface CalculatorProps {
  goHome: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ goHome }) => {
  const [inputs, setInputs] = useState<string[]>(['']);
  const [total, setTotal] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(null);

  const calculate = () => {
    const numbers = inputs.map(id => parseFloat(id)).filter(n => !isNaN(n));
    if (numbers.length === 0) {
      setTotal(null);
      setAverage(null);
      return;
    }
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / numbers.length;
    setTotal(sum);
    setAverage(avg);
  };

  useEffect(() => {
    calculate();
  }, [inputs]);

  const handleInput = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const addField = () => setInputs([...inputs, '']);
  const removeField = (index: number) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const clear = () => {
    setInputs(['']);
    setTotal(null);
    setAverage(null);
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in py-12 px-4">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
         <div className="w-20 h-20 bg-tz-blue rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-6">
            <i className="fa-solid fa-calculator"></i>
         </div>
         <h1 className="text-3xl font-extrabold text-tz-dark text-center mb-2">Grade Calculator</h1>
         <p className="text-gray-500 text-center mb-8">Enter your marks below to calculate your average and sum.</p>

         <div className="space-y-3 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {inputs.map((val, idx) => (
              <div key={idx} className="flex gap-2">
                 <input 
                    type="number"
                    value={val}
                    onChange={(e) => handleInput(idx, e.target.value)}
                    placeholder={`Score ${idx + 1}`}
                    className="flex-grow bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-tz-blue outline-none transition font-bold"
                 />
                 <button 
                  id={`remove-field-${idx}`}
                  onClick={() => removeField(idx)}
                  className="w-12 h-12 flex items-center justify-center text-red-400 hover:text-red-500 transition"
                 >
                   <i className="fa-solid fa-circle-minus text-xl"></i>
                 </button>
              </div>
            ))}
         </div>

         <div className="flex gap-4 mb-8">
            <button 
              id="add-subject-btn"
              onClick={addField}
              className="flex-grow bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
               <i className="fa-solid fa-plus"></i> Add Subject
            </button>
            <button 
              id="calculate-ave-btn"
              onClick={calculate}
              className="flex-grow bg-tz-blue text-white py-3 rounded-2xl font-bold shadow-lg shadow-tz-blue/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
               <i className="fa-solid fa-calculator"></i> Calculate AVE
            </button>
         </div>

         {(total !== null || average !== null) && (
            <div className="bg-tz-dark text-white rounded-3xl p-8 mb-8 animate-scale-up">
               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Total Sum</div>
                     <div className="text-4xl font-black text-tz-yellow">{total?.toFixed(1)}</div>
                  </div>
                  <div>
                     <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Average</div>
                     <div className="text-4xl font-black text-tz-blue">{average?.toFixed(1)}</div>
                  </div>
               </div>
               <button onClick={clear} className="mt-6 text-gray-400 text-sm font-bold hover:text-white transition">Clear all</button>
            </div>
         )}

         <button onClick={goHome} className="w-full text-gray-400 font-bold hover:text-tz-blue transition text-center">Back to home</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeSyllabus | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [yunContext, setYunContext] = useState<string>('');
  const [bilingualLang, setBilingualLang] = useState<'EN' | 'SW'>('EN');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Login Error:", error);
      setLoginError(error.message || "Failed to login. Please try again.");
    }
  };

  // User State 
  const [user, setUser] = useState<UserProgress>({
    points: 0,
    credits: 0,
    streak: 0,
    completedTopics: [],
    level: 1
  });

  // Track if user data is initialized
  const [isInitialized, setIsInitialized] = useState(false);
  const [isQuickStudyClicked, setIsQuickStudyClicked] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [celebratoryQuickStudyToast, setCelebratoryQuickStudyToast] = useState<string | null>(null);

  const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `edu_tz_quick_sessions_${year}-${month}-${day}`;
  };

  const [todayQuickSessionsCount, setTodayQuickSessionsCount] = useState<number>(() => {
    try {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const day = String(new Date().getDate()).padStart(2, '0');
      const todayKey = `edu_tz_quick_sessions_${year}-${month}-${day}`;
      const saved = localStorage.getItem(todayKey);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Helper function that resets the #start-quick-study-session-btn completion badge at midnight local time
  const checkAndResetDailyQuickSessions = useCallback(() => {
    try {
      const todayKey = getLocalDateKey();
      const lastCheckedKey = localStorage.getItem('edu_tz_quick_sessions_last_date');
      
      if (lastCheckedKey !== todayKey) {
        // Midnight local time shift detected or new day initial load
        localStorage.setItem('edu_tz_quick_sessions_last_date', todayKey);
        const savedToday = localStorage.getItem(todayKey);
        const count = savedToday ? parseInt(savedToday, 10) || 0 : 0;
        setTodayQuickSessionsCount(count);
      }
    } catch (e) {
      console.error('Error resetting daily quick sessions badge:', e);
    }
  }, []);

  // Timer effect checking every 30 seconds for local midnight transition
  useEffect(() => {
    checkAndResetDailyQuickSessions();
    const interval = setInterval(() => {
      checkAndResetDailyQuickSessions();
    }, 30000);
    return () => clearInterval(interval);
  }, [checkAndResetDailyQuickSessions]);

  // Sync with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      try {
        setCurrentUser(firebaseUser);
        
        if (firebaseUser) {
          // Check Admin
          const adminStatus = await checkIsAdmin(firebaseUser.uid);
          setIsAdmin(adminStatus);
  
          // Load progress from Firestore
          const progress = await getUserProgress(firebaseUser.uid);
          if (progress) {
            const updatedProgress = { ...progress, email: firebaseUser.email || undefined };
            if (firebaseUser.email === 'austinreuben95@gmail.com') {
              updatedProgress.credits = 999999;
            }
            setUser(updatedProgress);
          } else {
            // Initialize default progress for new user
            const initialProgress: UserProgress = {
              points: 100,
              credits: firebaseUser.email === 'austinreuben95@gmail.com' ? 999999 : 0,
              streak: 1,
              completedTopics: [],
              level: 1,
              email: firebaseUser.email || undefined
            };
            setUser(initialProgress);
            await saveUserProgress(firebaseUser.uid, initialProgress);
          }
          setIsInitialized(true);
        } else {
          setIsAdmin(false);
          setIsInitialized(false);
          setUser({
            points: 0,
            credits: 0,
            streak: 0,
            completedTopics: [],
            level: 1
          });
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setAuthLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<UserProgress[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLeaderboardLoading(true);
      try {
        const users = await getAllUsers();
        // Sort by points descending
        const sorted = [...users].sort((a, b) => b.points - a.points).slice(0, 5);
        setLeaderboard(sorted);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
      setLeaderboardLoading(false);
    };

    if (currentUser) {
      fetchLeaderboard();
    }
  }, [currentUser, user.points]); // Refresh when user points change or login

  // Save progress when user state changes (if logged in)
  useEffect(() => {
    if (currentUser && isInitialized) {
      saveUserProgress(currentUser.uid, user);
    }
  }, [user, currentUser, isInitialized]);


  // Quiz State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [selectedQuizOptionIndex, setSelectedQuizOptionIndex] = useState<number | null>(null);

  // 150 Strategic Ideas Feature Launch Router
  const handleLaunchRoadmapFeature = (point: { id: number; title: string; category: string; summary: string }) => {
    setIsRoadmapModalOpen(false);

    const titleLower = point.title.toLowerCase();
    const catLower = point.category.toLowerCase();

    // Map feature directly to live platform tools & views
    if (point.id === 1 || titleLower.includes('calculator') || titleLower.includes('division') || titleLower.includes('points')) {
      setCurrentView(AppView.GRADE_CHECKER);
    } else if (point.id === 2 || point.id === 3 || catLower === 'careers' || titleLower.includes('tcu') || titleLower.includes('combination')) {
      setCurrentView(AppView.ALEVEL_GUIDE);
    } else if (point.id === 5 || catLower === 'examtech' || titleLower.includes('exam') || titleLower.includes('past paper')) {
      setCurrentView(AppView.EXAMS);
    } else if (point.id === 111 || catLower === 'swahili' || titleLower.includes('dictionary') || titleLower.includes('kiswahili')) {
      setCurrentView(AppView.DICTIONARY);
    } else if (point.id === 61 || titleLower.includes('planner') || titleLower.includes('schedule') || titleLower.includes('timetable')) {
      setCurrentView(AppView.PLANNER);
    } else if (catLower === 'stem' || titleLower.includes('formula') || titleLower.includes('science') || titleLower.includes('lab')) {
      setCurrentView(AppView.NOTES);
    } else if (catLower === 'teacher' || titleLower.includes('lesson plan')) {
      setCurrentView(AppView.TEACHERS);
    } else if (catLower === 'admin' || titleLower.includes('audit')) {
      setCurrentView(AppView.ADMIN);
    } else if (catLower === 'ecosystem' || point.id === 141 || titleLower.includes('parent')) {
      setCurrentView(AppView.PARENTS);
    } else if (titleLower.includes('badge') || titleLower.includes('trophy') || titleLower.includes('streak')) {
      setCurrentView(AppView.BADGES);
    } else if (point.id === 46 || catLower === 'offline' || titleLower.includes('low-bandwidth') || titleLower.includes('offline')) {
      setDataSaver(true);
      setShowOfflineToast(true);
      setOfflineToastDismissed(false);
    } else if (point.id === 131 || catLower === 'ai' || titleLower.includes('ai') || titleLower.includes('yun')) {
      setYunContext(`[150 Ideas #${point.id} - ${point.title}]: ${point.summary}. How can I use this to excel in my NECTA studies?`);
      setCurrentView(AppView.CHAT);
    } else {
      // General launch: Launch Yun AI Tutor pre-configured with this exact 150-Idea context!
      setYunContext(`[Strategic Idea #${point.id} - ${point.title}]: ${point.summary}. Please guide me on using this learning tool.`);
      setCurrentView(AppView.CHAT);
    }
  };

  // Content Tab State
  const [activeTab, setActiveTab] = useState<'notes' | 'video' | 'homework' | 'exams' | 'language'>('notes');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Flashcard Interactive State for Language Tab
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [flashcardViewMode, setFlashcardViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [masteredTerms, setMasteredTerms] = useState<string[]>([]);

  // Network & Offline Toast State
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showOfflineToast, setShowOfflineToast] = useState<boolean>(false);
  const [offlineToastDismissed, setOfflineToastDismissed] = useState<boolean>(false);

  // Target Score Tracker State (Subject Name -> Target Score percentage)
  const [targetScores, setTargetScores] = useState<Record<string, number>>({
    'Mathematics': 85,
    'Physics': 90,
    'Chemistry': 85,
    'Biology': 88,
    'Science': 85,
    'Kiswahili': 90,
    'English': 80,
    'Civics': 85,
    'Geography': 85,
    'History': 85
  });

  // Homework State (Topic ID -> Homework Submission Data)
  const [completedHomework, setCompletedHomework] = useState<Record<string, { score: number; submittedAt: string; answers: Record<string, any> }>>({});
  const [hwFilterMode, setHwFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  // Share Progress & Profile Modals State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isParentShareModalOpen, setIsParentShareModalOpen] = useState(false);
  const [quizShareData, setQuizShareData] = useState<{ topicTitle: string; score: number } | null>(null);
  const [isQuizShareModalOpen, setIsQuizShareModalOpen] = useState(false);

  // Recent Quick Study Sessions (max 5 items stored locally)
  const [recentQuickSessions, setRecentQuickSessions] = useState<QuickStudySession[]>(() => {
    try {
      const saved = localStorage.getItem('tz_recent_quick_study_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [recentSessionsSort, setRecentSessionsSort] = useState<'newest' | 'shortest' | 'difficulty'>('newest');

  // Check if a quick study session's topic is marked completed
  const isSessionTopicCompleted = useCallback((session: QuickStudySession) => {
    if (!user || !user.completedTopics) return false;
    if (session.topicId && user.completedTopics.includes(session.topicId)) {
      return true;
    }
    const g = SYLLABUS_DATA.find(item => item.grade.toLowerCase() === session.gradeName.toLowerCase() || item.grade.toLowerCase().includes(session.gradeName.toLowerCase()));
    if (!g) return false;
    const s = g.subjects.find(sub => sub.name.toLowerCase() === session.subjectName.toLowerCase());
    if (!s) return false;
    const t = s.topics.find(top => top.title.toLowerCase() === session.topicTitle.toLowerCase());
    if (!t) return false;
    return user.completedTopics.includes(t.id);
  }, [user]);

  // Determine the most recent session by timestamp
  const mostRecentSession = useMemo(() => {
    if (recentQuickSessions.length === 0) return null;
    return [...recentQuickSessions].sort((a, b) => b.timestamp - a.timestamp)[0];
  }, [recentQuickSessions]);

  // Check if the most recent session is unfinished
  const isMostRecentSessionUnfinished = useMemo(() => {
    if (!mostRecentSession) return false;
    return !isSessionTopicCompleted(mostRecentSession);
  }, [mostRecentSession, isSessionTopicCompleted]);

  const sortedRecentSessions = useMemo(() => {
    const list = [...recentQuickSessions];
    if (recentSessionsSort === 'shortest') {
      const getShortestTimeValue = (s: QuickStudySession) => {
        const te = s.timeEstimate || '15-25m';
        const match = te.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 15;
      };
      return list.sort((a, b) => getShortestTimeValue(a) - getShortestTimeValue(b));
    }
    if (recentSessionsSort === 'difficulty') {
      const getDifficultyRank = (s: QuickStudySession) => {
        const d = (s.difficulty || '').toLowerCase();
        if (d.includes('easy')) return 1;
        if (d.includes('amateur') || d.includes('moderate')) return 2;
        if (d.includes('hard')) return 3;
        if (d.includes('extreme')) return 4;
        return 2;
      };
      return list.sort((a, b) => getDifficultyRank(a) - getDifficultyRank(b));
    }
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [recentQuickSessions, recentSessionsSort]);

  const downloadTopicNotePdf = (subjectName: string, topicTitle: string, deepNote: any) => {
    try {
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

      // Header Banner
      doc.setFillColor(6, 78, 59);
      doc.rect(0, 0, pageWidth, 28, 'F');
      doc.setFillColor(250, 204, 21);
      doc.rect(0, 28, pageWidth, 2, 'F');

      doc.setTextColor(250, 204, 21);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('ElimuTanzania • NECTA Curriculum Lesson Summary', margin, 9);

      doc.setTextColor(209, 250, 229);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`${subjectName.toUpperCase()} | ${selectedGrade?.grade || 'Secondary'} | Date: ${new Date().toLocaleDateString()}`, margin, 15);

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const titleLines = doc.splitTextToSize(topicTitle, contentWidth);
      doc.text(titleLines[0] || topicTitle, margin, 22);

      let currentY = 36;

      // Curiosity Hook Box
      if (deepNote.curiosityHook) {
        doc.setFillColor(254, 243, 199);
        doc.setDrawColor(251, 191, 36);
        doc.setLineWidth(0.3);

        const hookLines = doc.splitTextToSize(`Did You Know? ${deepNote.curiosityHook}`, contentWidth - 8);
        const hookHeight = hookLines.length * 4.5 + 6;

        doc.roundedRect(margin, currentY, contentWidth, hookHeight, 2, 2, 'FD');
        doc.setTextColor(146, 64, 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);

        let hY = currentY + 5;
        hookLines.forEach((line: string) => {
          doc.text(line, margin + 4, hY);
          hY += 4.5;
        });

        currentY += hookHeight + 6;
      }

      // Deep Overview
      if (deepNote.deepOverview) {
        doc.setTextColor(6, 78, 59);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Deep Concept Breakdown:', margin, currentY);
        currentY += 5;

        doc.setTextColor(51, 65, 85);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        const overviewWrapped = doc.splitTextToSize(deepNote.deepOverview, contentWidth);
        overviewWrapped.forEach((line: string) => {
          if (currentY > pageHeight - 15) {
            doc.addPage();
            currentY = 18;
          }
          doc.text(line, margin, currentY);
          currentY += 4.5;
        });
        currentY += 4;
      }

      // NECTA Tips
      if (deepNote.nectaExamTips && deepNote.nectaExamTips.length > 0) {
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 18;
        }
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text('NECTA Exam Secrets & Traps:', margin, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);

        deepNote.nectaExamTips.forEach((tip: string) => {
          const tipWrapped = doc.splitTextToSize(`• ${tip}`, contentWidth - 4);
          tipWrapped.forEach((tLine: string) => {
            if (currentY > pageHeight - 15) {
              doc.addPage();
              currentY = 18;
            }
            doc.text(tLine, margin + 2, currentY);
            currentY += 4.5;
          });
        });
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Official NECTA Curriculum Study Summary • ElimuTanzania', margin, pageHeight - 7);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 7);
      }

      const safeFilename = `${subjectName}_${topicTitle}`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`${safeFilename}_study_summary.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Error generating PDF.');
    }
  };

  // Speech Synthesis for Lesson Notes
  const [isSpeakingLesson, setIsSpeakingLesson] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedTopic, selectedSubject, activeTab, currentView, bilingualLang]);

  const handleToggleLessonSpeech = (deepNote: any) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    const synth = window.speechSynthesis;

    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsSpeechPaused(false);
        setIsSpeakingLesson(true);
        return;
      } else {
        synth.pause();
        setIsSpeechPaused(true);
        return;
      }
    }

    synth.cancel();

    const titleStr = bilingualLang === 'SW' ? (deepNote.swahiliTitle || selectedTopic?.title) : selectedTopic?.title;
    const hookStr = bilingualLang === 'SW' ? deepNote.swahiliCuriosityHook : deepNote.curiosityHook;
    const overviewStr = bilingualLang === 'SW' ? (deepNote.kiswahiliOverview || deepNote.deepOverview) : deepNote.deepOverview;
    const tipsStr = bilingualLang === 'SW' ? (deepNote.swahiliNectaTips || deepNote.nectaExamTips) : deepNote.nectaExamTips;

    let textToRead = `${titleStr || 'Lesson Notes'}. `;
    if (hookStr) {
      textToRead += `${bilingualLang === 'SW' ? 'Je wajua?' : 'Did you know?'} ${hookStr}. `;
    }
    if (overviewStr) {
      textToRead += `${bilingualLang === 'SW' ? 'Maelezo ya kina:' : 'Deep concept breakdown:'} ${overviewStr}. `;
    }
    if (tipsStr && tipsStr.length > 0) {
      textToRead += `${bilingualLang === 'SW' ? 'Mbinu za Mtihani wa NECTA:' : 'NECTA Exam Secrets:'} ${tipsStr.join('. ')}.`;
    }

    const cleanText = textToRead.replace(/[#*`_~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const langCode = bilingualLang === 'SW' ? 'sw-TZ' : 'en-US';
    utterance.lang = langCode;

    const voices = synth.getVoices();
    const desiredPrefix = bilingualLang === 'SW' ? 'sw' : 'en';
    const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(desiredPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeakingLesson(true);
      setIsSpeechPaused(false);
    };

    utterance.onend = () => {
      setIsSpeakingLesson(false);
      setIsSpeechPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeakingLesson(false);
      setIsSpeechPaused(false);
    };

    synth.speak(utterance);
  };

  const handleStopLessonSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingLesson(false);
    setIsSpeechPaused(false);
  };

  const downloadRecentSessionsLog = () => {
    if (recentQuickSessions.length === 0) return;

    const sessionItems = [...recentQuickSessions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map((s, idx) => {
        const dateStr = new Date(s.timestamp).toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
        const completed = isSessionTopicCompleted(s) ? '[COMPLETED ✓]' : '[IN PROGRESS ⚡]';
        const difficulty = s.difficulty || 'Moderate 🟡';
        const estTime = s.timeEstimate || '15-25 min';
        return `${idx + 1}. ${s.gradeName} - ${s.subjectName}: "${s.topicTitle}"
   • Status: ${completed}
   • Level & Est. Time: ${difficulty} | ${estTime}
   • Session Date: ${dateStr}`;
      })
      .join('\n\n');

    const content = `=======================================================
TANZANIA NATIONAL SYLLABUS - REVISION SESSION LOG
=======================================================
Generated On: ${new Date().toLocaleString()}
Total Recorded Sessions: ${recentQuickSessions.length}

-------------------------------------------------------
LAST 5 REVISION TOPICS SUMMARY:
-------------------------------------------------------

${sessionItems}

-------------------------------------------------------
OFFLINE STUDY GUIDANCE & RECOMMENDATIONS:
- Review key definitions and NECTA exam command words for these topics.
- Attempt 2-3 past paper questions for each subject listed above.
- Test active recall without looking at reference notes.
=======================================================
Tanzania Educational Platform - Elimu Bora kwa Wote
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Syllabus_Study_Log_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Network Event Listeners Hook
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(true);
      setOfflineToastDismissed(false);
      setTimeout(() => setShowOfflineToast(false), 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      setOfflineToastDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Parents State
  const [parentPin, setParentPin] = useState('');
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);

  // Data Saver State
  const [dataSaver, setDataSaver] = useState(false);

  // Subject Filter States (Difficulty & Type)
  const [subjectDifficultyFilter, setSubjectDifficultyFilter] = useState<'ALL' | 'EASY' | 'HARD' | 'EXTREME'>('ALL');
  const [subjectTypeFilter, setSubjectTypeFilter] = useState<'ALL' | 'EXAM' | 'VIDEO' | 'NEW' | 'STEM' | 'ARTS'>('ALL');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  // Student Proficiency Radar Data
  const studentProficiencyData: SubjectProficiency[] = useMemo(() => [
    { subject: 'Mathematics', score: 82, classAverage: 65, icon: 'fa-calculator', color: 'bg-indigo-600' },
    { subject: 'Science', score: 88, classAverage: 70, icon: 'fa-flask', color: 'bg-emerald-600' },
    { subject: 'Kiswahili', score: 92, classAverage: 78, icon: 'fa-book-bookmark', color: 'bg-amber-600' },
    { subject: 'English', score: 75, classAverage: 68, icon: 'fa-language', color: 'bg-sky-600' },
    { subject: 'Social Studies', score: 70, classAverage: 62, icon: 'fa-earth-africa', color: 'bg-purple-600' },
    { subject: 'Physics/Tech', score: 85, classAverage: 60, icon: 'fa-atom', color: 'bg-rose-600' },
  ], []);

  // --- Actions ---

  const handleLevelSelect = (level: EducationLevel) => {
    setSelectedLevel(level);
    setCurrentView(AppView.SYLLABUS);
  };

  const handleGradeSelect = (grade: GradeSyllabus) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setCurrentView(AppView.SYLLABUS);
  };

  const swapXpForCredits = async () => {
    if (user.points < 500) return;
    const newPoints = user.points - 500;
    const newCredits = user.credits + 10;
    
    setUser(prev => ({ 
      ...prev, 
      points: newPoints, 
      credits: newCredits 
    }));
    
    if (currentUser) {
       await updateUserCredits(currentUser.uid, newCredits, newPoints);
    }
  };

  const getTopicTimeEstimate = (topic?: Topic | null, difficulty?: string, gradeName?: string) => {
    const diff = (topic?.difficulty || difficulty || '').toLowerCase();
    const g = (gradeName || selectedGrade?.grade || '').toLowerCase();

    if (diff === 'extreme' || g.includes('form 5') || g.includes('form 6')) {
      return { time: '~35-50 mins', level: 'Advanced A-Level', badge: 'Extreme 🔴', shortTime: '35-50 min' };
    }
    if (diff === 'hard' || g.includes('form 3') || g.includes('form 4')) {
      return { time: '~25-35 mins', level: 'NECTA O-Level', badge: 'Hard 🟠', shortTime: '25-35 min' };
    }
    if (diff === 'easy' || g.includes('standard') || g.includes('primary')) {
      return { time: '~10-15 mins', level: 'Primary Rapid', badge: 'Easy 🟢', shortTime: '10-15 min' };
    }
    return { time: '~15-25 mins', level: 'Secondary Standard', badge: 'Moderate 🟡', shortTime: '15-25 min' };
  };

  const recordQuickStudySession = (gradeName: string, subjectName: string, topicTitle: string, topic?: Topic | null) => {
    const est = getTopicTimeEstimate(topic, topic?.difficulty, gradeName);
    const newSession: QuickStudySession = {
      id: `${gradeName}-${subjectName}-${topicTitle}-${Date.now()}`,
      topicId: topic?.id,
      gradeName,
      subjectName,
      topicTitle,
      timestamp: Date.now(),
      difficulty: topic?.difficulty || est.badge,
      timeEstimate: est.shortTime
    };

    setRecentQuickSessions(prev => {
      const filtered = prev.filter(
        s => !(s.gradeName === gradeName && s.subjectName === subjectName && s.topicTitle === topicTitle)
      );
      const updated = [newSession, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('tz_recent_quick_study_sessions', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleQuickStudySession = () => {
    // Haptic feedback for mobile devices (crisp double tap vibration pattern)
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
        navigator.vibrate([25, 40, 25]);
      }
    } catch {
      // Ignore vibration errors if unsupported or restricted by permissions
    }

    // Check if daily goal of 5 sessions is reached for the first time
    const isGoalReachedFirstTime = todayQuickSessionsCount === 4;

    // Show celebratory toast notification when starting the first session of the new day or reaching goal
    if (todayQuickSessionsCount === 0) {
      setCelebratoryQuickStudyToast("🎉 First Quick Study Session of the day! Fantastic start to keeping your study momentum strong today! 🌟");
      setTimeout(() => {
        setCelebratoryQuickStudyToast(null);
      }, 5500);
    } else if (isGoalReachedFirstTime) {
      setCelebratoryQuickStudyToast("🏆 DAILY MASTERY ACHIEVED! 5/5 Quick Study Sessions Completed Today! You've unlocked Daily Mastery! 🌟⚡");
      setTimeout(() => {
        setCelebratoryQuickStudyToast(null);
      }, 7000);
    }

    // Trigger visual click feedback state
    setIsQuickStudyClicked(true);
    setTimeout(() => setIsQuickStudyClicked(false), 700);

    // Track sessions completed today
    setTodayQuickSessionsCount(prev => {
      const next = prev + 1;
      try {
        const todayKey = getLocalDateKey();
        localStorage.setItem(todayKey, next.toString());
        localStorage.setItem('edu_tz_quick_sessions_last_date', todayKey);
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    // Confetti shower animation
    if (isGoalReachedFirstTime) {
      // Trigger an intensive, long-lasting 'mastery' confetti shower animation
      try {
        const duration = 4.0 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 35, spread: 360, ticks: 120, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        // Big initial burst with festive mastery colors
        confetti({
          particleCount: 180,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6', '#fbbf24', '#a855f7'],
          scalar: 1.3
        });

        // Continuous stream of side confetti cannons for 4 seconds
        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = Math.floor(60 * (timeLeft / duration));

          // Left stream
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.05, 0.3), y: Math.random() - 0.2 },
            colors: ['#f59e0b', '#fbbf24', '#10b981', '#a855f7', '#ec4899']
          });
          // Right stream
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.95), y: Math.random() - 0.2 },
            colors: ['#3b82f6', '#a855f7', '#f59e0b', '#10b981', '#ec4899']
          });
        }, 180);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Standard confetti explosion effect
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }

    let targetGrade = selectedGrade;
    if (!targetGrade) {
      const form4 = SYLLABUS_DATA.find(g => g.grade.toLowerCase().includes('form 4'));
      targetGrade = form4 || SYLLABUS_DATA[Math.floor(Math.random() * SYLLABUS_DATA.length)];
    }

    if (!targetGrade || !targetGrade.subjects || targetGrade.subjects.length === 0) return;

    const randomSubject = targetGrade.subjects[Math.floor(Math.random() * targetGrade.subjects.length)];
    if (!randomSubject || !randomSubject.topics || randomSubject.topics.length === 0) return;

    const randomTopic = randomSubject.topics[Math.floor(Math.random() * randomSubject.topics.length)];

    // Record this session in local state & storage with topic metadata
    recordQuickStudySession(targetGrade.grade, randomSubject.name, randomTopic.title, randomTopic);

    setSelectedGrade(targetGrade);
    setSelectedSubject(randomSubject);
    setSelectedTopic(randomTopic);
    setActiveVideoIndex(0);
    setActiveTab('notes');
    setYunContext(`Quick Study Session on ${randomTopic.title} in ${randomSubject.name} (${targetGrade.grade})`);
    setCurrentView(AppView.TOPIC_CONTENT);
  };

  const resumeQuickStudySession = (session: QuickStudySession) => {
    const targetGrade = SYLLABUS_DATA.find(g => g.grade.toLowerCase() === session.gradeName.toLowerCase()) || 
                        SYLLABUS_DATA.find(g => g.grade.toLowerCase().includes(session.gradeName.toLowerCase()));
    if (!targetGrade) return;

    const targetSubject = targetGrade.subjects.find(s => s.name.toLowerCase() === session.subjectName.toLowerCase());
    if (!targetSubject) return;

    const targetTopic = targetSubject.topics.find(t => t.title.toLowerCase() === session.topicTitle.toLowerCase());
    if (!targetTopic) return;

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }

    recordQuickStudySession(targetGrade.grade, targetSubject.name, targetTopic.title, targetTopic);

    setSelectedGrade(targetGrade);
    setSelectedSubject(targetSubject);
    setSelectedTopic(targetTopic);
    setActiveVideoIndex(0);
    setActiveTab('notes');
    setYunContext(`Resuming Quick Study Session on ${targetTopic.title} in ${targetSubject.name} (${targetGrade.grade})`);
    setCurrentView(AppView.TOPIC_CONTENT);
  };

  const enterTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setActiveVideoIndex(0);
    setYunContext(`Topic: ${topic.title}. ${topic.description}`);
    setCurrentView(AppView.TOPIC_CONTENT);
  };

  const startPracticeQuiz = async () => {
    if (!selectedGrade || !selectedSubject || !selectedTopic) return;
    
    setIsQuizModalOpen(true);
    setQuizLoading(true);
    setQuizResult('none');
    setSelectedQuizOptionIndex(null);
    
    const q = await generateQuizQuestion(selectedGrade.grade, selectedSubject.name, selectedTopic.title);
    setCurrentQuiz(q);
    setQuizLoading(false);
  };

  const handleQuizAnswer = (index: number) => {
    if (!currentQuiz || !selectedTopic) return;
    setSelectedQuizOptionIndex(index);
    
    if (index === currentQuiz.correctIndex) {
      setQuizResult('correct');
      // Award Points & Mark Complete
      setUser(prev => ({ 
        ...prev, 
        points: prev.points + 50,
        completedTopics: prev.completedTopics.includes(selectedTopic.id) 
          ? prev.completedTopics 
          : [...prev.completedTopics, selectedTopic.id]
      }));
      
      // Close after delay
      setTimeout(() => {
        setIsQuizModalOpen(false);
      }, 2500);
    } else {
      setQuizResult('incorrect');
    }
  };

  const startChat = () => {
    setYunContext(''); 
    setCurrentView(AppView.CHAT);
  };

  const goHome = () => {
    setCurrentView(AppView.HOME);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
  };

  // --- Memoized Search, Filters & Stats ---
  const totalTopicsCount = useMemo(() => {
    return SYLLABUS_DATA.reduce((acc, grade) => {
      return acc + grade.subjects.reduce((sAcc, sub) => sAcc + sub.topics.length, 0);
    }, 0);
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!selectedGrade) return [];
    if (!searchQuery.trim()) return selectedGrade.subjects;
    const q = searchQuery.toLowerCase();
    return selectedGrade.subjects.filter(s => s.name.toLowerCase().includes(q));
  }, [selectedGrade, searchQuery]);

  const displayedSubjects = useMemo(() => {
    return filteredSubjects.filter(s => {
      // 1. Difficulty filter check
      const diff = getSubjectDifficulty(s);
      if (subjectDifficultyFilter === 'EASY' && diff !== 'easy') return false;
      if (subjectDifficultyFilter === 'HARD' && diff !== 'hard') return false;
      if (subjectDifficultyFilter === 'EXTREME' && diff !== 'extreme') return false;

      // 2. Type filter check
      if (subjectTypeFilter === 'EXAM' && !s.isExamFocused) return false;
      if (subjectTypeFilter === 'VIDEO' && !s.hasVideo) return false;
      if (subjectTypeFilter === 'NEW' && !s.isNewSyllabus) return false;
      if (subjectTypeFilter === 'STEM' && getSubjectCategory(s) !== 'stem') return false;
      if (subjectTypeFilter === 'ARTS' && getSubjectCategory(s) !== 'arts') return false;

      return true;
    });
  }, [filteredSubjects, subjectDifficultyFilter, subjectTypeFilter]);

  const filteredTopics = useMemo(() => {
    if (!selectedSubject) return [];
    if (!searchQuery.trim()) return selectedSubject.topics;
    const q = searchQuery.toLowerCase();
    return selectedSubject.topics.filter(t => 
      t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [selectedSubject, searchQuery]);

  // --- Render Sections ---

  const renderHeader = () => {
    if (isZenMode) {
      return (
        <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-purple-500/30 text-white py-3 px-4 sm:px-8 flex items-center justify-between shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
            <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-base shadow-md shadow-purple-500/30">
              🧘
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm sm:text-base tracking-wide text-purple-100 flex items-center gap-2">
                Education<span className="text-amber-400">TZ</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 text-[10px] uppercase font-black border border-purple-400/30">Zen Focus</span>
              </span>
              <span className="text-[10px] text-purple-300 font-medium hidden sm:inline-block">Distraction-free environment • Pure study mode</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="exit-zen-mode-btn-header"
              onClick={() => setIsZenMode(false)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-900/40 cursor-pointer"
              title="Exit Zen Focus Mode"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
              <span>Exit Zen Mode</span>
            </button>
          </div>
        </header>
      );
    }

    return (
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goHome}>
          <div className="w-11 h-11 bg-vibrant-gradient rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            E
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl leading-none text-tz-dark tracking-tight">Education<span className="gradient-text">TZ</span></span>
            <span className="text-[10px] text-indigo-600 font-extrabold tracking-widest uppercase flex items-center gap-1">
              <i className="fa-solid fa-sparkles text-[8px]"></i> {totalTopicsCount}+ Topics & Videos
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentView(AppView.EXAMS)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.EXAMS ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="NECTA Results Statement & Past Papers"
            >
              <i className="fa-solid fa-square-poll-vertical text-emerald-500"></i> NECTA Results & Exams
            </button>
            <button 
              onClick={() => {
                setSelectedLevel(EducationLevel.SECONDARY);
                setSelectedGrade(null);
                setSelectedSubject(null);
                setCurrentView(AppView.SYLLABUS);
              }}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.SYLLABUS ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Browse All Subjects (Std 1 - Form 6)"
            >
              <i className="fa-solid fa-layer-group text-indigo-500"></i> All Subjects
            </button>
            <button 
              onClick={() => setCurrentView(AppView.PLANNER)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.PLANNER ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Weekly Study Planner, YouTube Music Hub & Automated Reminders"
            >
              <i className="fa-solid fa-music text-red-500"></i> Planner & Music 🎵
            </button>
            <button 
              onClick={() => setCurrentView(AppView.NOTES)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.NOTES ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Study Notes & Notebooks"
            >
              <i className="fa-solid fa-note-sticky text-emerald-600"></i> Notes
            </button>
            <button 
              onClick={() => setCurrentView(AppView.DICTIONARY)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.DICTIONARY ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Bilingual Dictionary & Vocabulary Builder"
            >
              <i className="fa-solid fa-book-bookmark text-amber-500"></i> Vocabulary & Dictionary
            </button>
            <button 
              onClick={() => setCurrentView(AppView.TEACHERS)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.TEACHERS ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <i className="fa-solid fa-chalkboard-user"></i> Teachers
            </button>
            <button 
              onClick={() => setCurrentView(AppView.PREDICTOR)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.PREDICTOR ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Predict School & University Admission Cutoffs"
            >
              <i className="fa-solid fa-graduation-cap text-emerald-600"></i> Admission Predictor 🇹🇿
            </button>
            <button 
              onClick={() => setCurrentView(AppView.ASSIGNMENTS_TESTS)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.ASSIGNMENTS_TESTS ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Assignments, Speed Tests & NECTA Exam Papers"
            >
              <i className="fa-solid fa-list-check text-indigo-500"></i> Assignments & Tests 📝
            </button>
            <button 
              onClick={() => setCurrentView(AppView.BADGES)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.BADGES ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="Scholar Badges, Streaks & Subject Mastery Trophies"
            >
              <i className="fa-solid fa-trophy text-amber-500"></i> Badges 🏆
            </button>
            <button 
              onClick={() => setCurrentView(AppView.GRADE_CHECKER)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.GRADE_CHECKER ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
              title="NECTA Grade Check (50-Mark & 100-Mark Scales: 41-50 A, 31-40 B, 21-30 C, 11-20 D, 0-10 F)"
            >
              <i className="fa-solid fa-check-double text-emerald-500"></i> Grade Check 📊
            </button>
            <button 
              onClick={() => setCurrentView(AppView.ALEVEL_GUIDE)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.ALEVEL_GUIDE ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <i className="fa-solid fa-compass-drafting"></i> A-Level
            </button>
            <button 
              onClick={() => setCurrentView(AppView.CALCULATOR)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 ${currentView === AppView.CALCULATOR ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <i className="fa-solid fa-calculator"></i> Calc
            </button>
            <button 
              onClick={() => setIsRoadmapModalOpen(true)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30 hover:bg-amber-300 border border-amber-300 cursor-pointer`}
              title="150 Strategic Ideas & Master Platform Roadmap"
            >
              <i className="fa-solid fa-rocket text-amber-900"></i> 150 Ideas 🚀
            </button>

            {/* Low-MB Data Saver Toggle */}
            <button
              onClick={() => setDataSaver(!dataSaver)}
              className={`ml-1 px-3 py-1.5 rounded-full font-extrabold text-[11px] border transition flex items-center gap-1.5 ${
                dataSaver 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse-glow'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
              title="Low-Bandwidth Mode for 3G & Limited Data"
            >
              <i className="fa-solid fa-bolt"></i> {dataSaver ? 'Low MB (ON)' : 'Data Saver'}
            </button>

            {/* Network Status Indicator */}
            <button
              onClick={() => {
                setShowOfflineToast(true);
                setOfflineToastDismissed(false);
              }}
              className={`px-3 py-1.5 rounded-full font-extrabold text-[11px] border transition flex items-center gap-1.5 ${
                !isOnline
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
              title={!isOnline ? "Offline Mode Active - Saved Notes & Core Syllabus Available" : "Online & Connected"}
            >
              <i className={`fa-solid ${!isOnline ? 'fa-wifi-slash' : 'fa-wifi'}`}></i>
              <span>{!isOnline ? 'Offline Mode' : 'Online'}</span>
            </button>
          </div>

          {/* Stats & Profile Button */}
          <div className="hidden md:flex items-center gap-2">
            <div 
              onClick={() => setCurrentView(AppView.BADGES)}
              className="cursor-pointer flex items-center gap-2 text-orange-500 font-bold bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full border border-orange-100 transition"
              title="Study Streak - View Streak Badges"
            >
               {user.streak} <i className="fa-solid fa-fire"></i>
            </div>
            <div 
              onClick={() => setCurrentView(AppView.WALLET)}
              className="cursor-pointer flex items-center gap-2 text-tz-blue font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition"
              title="Study Wallet"
            >
              {user.points} EP
            </div>
            <button 
              onClick={() => setCurrentView(AppView.BADGES)}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-full font-extrabold text-xs transition active:scale-95 shadow-2xs cursor-pointer"
              title="Scholar Badges & Awards"
            >
              <i className="fa-solid fa-award text-amber-600"></i>
              <span className="hidden sm:inline">Badges</span>
            </button>

            {/* Student Profile & Share Progress Button */}
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full font-extrabold text-xs transition active:scale-95 shadow-2xs"
              title="Student Profile & Share Progress"
            >
              <i className="fa-solid fa-id-card text-indigo-600"></i>
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>

          <button 
            onClick={() => setCurrentView(AppView.PARENTS)}
            className="text-gray-500 hover:text-purple-700 transition p-2 rounded-lg hover:bg-purple-50 flex items-center gap-1 font-bold text-xs"
            title="Parent Dashboard"
          >
            <i className="fa-solid fa-user-shield text-lg text-purple-600"></i>
            <span className="hidden xl:inline">Parents</span>
          </button>

          {isAdmin && (
            <button 
              onClick={() => setCurrentView(AppView.ADMIN)}
              className="text-red-500 hover:text-red-600 transition flex items-center gap-1 font-bold text-xs"
              title="Admin Panel"
            >
              <i className="fa-solid fa-lock text-sm"></i>
              <span className="hidden lg:inline">ADMIN</span>
            </button>
          )}

          <button 
            onClick={startChat}
            className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 rounded-xl font-black shadow-[0_4px_0_rgb(30,27,75)] hover:translate-y-[2px] transition-all flex items-center gap-2.5 border border-cyan-400/50"
          >
            <YunAvatar3D size="sm" />
            <span className="hidden sm:inline text-xs uppercase tracking-wider text-cyan-300">Ask Yun</span>
          </button>
        </div>
      </div>
    </header>
    );
  };

  const renderTopicContent = () => {
    if (!selectedTopic || !selectedSubject) return null;

    const isCompleted = user.completedTopics.includes(selectedTopic.id);

    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
           <button onClick={() => setCurrentView(AppView.SYLLABUS)} className="hover:text-tz-blue underline">Syllabus</button>
           <i className="fa-solid fa-chevron-right text-xs"></i>
           <span>{selectedSubject.name}</span>
           <i className="fa-solid fa-chevron-right text-xs"></i>
           <span className="font-bold text-tz-dark">{selectedTopic.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header Card */}
            <div className="bg-tz-blue rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
               <div className="relative z-10">
                 <h1 className="text-3xl font-extrabold mb-2">{selectedTopic.title}</h1>
                 <p className="text-blue-100 text-lg">{selectedTopic.description}</p>
                 <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm"><i className="fa-solid fa-clock mr-1"></i> 20 mins</span>
                    <DifficultyBadge difficulty={getTopicDifficulty(selectedTopic)} />
                    <TopicCompletedBadge isCompleted={isCompleted} />
                 </div>
               </div>
               <i className={`fa-solid ${selectedSubject.icon} absolute -right-6 -bottom-6 text-9xl text-white/10 rotate-12`}></i>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'notes', label: 'Lesson Notes', icon: 'fa-book-open' },
                { id: 'video', label: 'Video Class', icon: 'fa-play-circle' },
                { id: 'homework', label: 'Homework & Target', icon: 'fa-list-check' },
                { id: 'language', label: 'Language', icon: 'fa-language' },
                { id: 'exams', label: 'Practice Quiz', icon: 'fa-pen-to-square' }
              ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                    ? 'bg-tz-dark text-white shadow-lg' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                  }`}
                 >
                   <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                 </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 min-h-[400px] shadow-sm">
              {activeTab === 'notes' && (() => {
                const deepNote = getDeepLessonNote(selectedSubject.name, selectedTopic.title, selectedGrade?.grade);
                return (
                  <div className="space-y-6 not-prose">
                    {/* Bilingual Language Switcher */}
                    <div className="flex items-center justify-between p-4 bg-indigo-50/80 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-language text-indigo-600 text-lg"></i>
                        <div>
                          <span className="font-extrabold text-xs text-indigo-950 uppercase tracking-wider block">Bilingual Language Bridge</span>
                          <span className="text-[11px] text-indigo-800 font-medium">Switch between English & Kiswahili explanations</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Listen to Lesson (SpeechSynthesis) */}
                        <button
                          onClick={() => handleToggleLessonSpeech(deepNote)}
                          className={`px-3.5 py-1.5 rounded-xl text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                            isSpeakingLesson && !isSpeechPaused
                              ? 'bg-amber-500 hover:bg-amber-600 animate-pulse ring-2 ring-amber-300'
                              : isSpeechPaused
                              ? 'bg-indigo-600 hover:bg-indigo-700'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                          title="Listen to this lesson read aloud in preferred language"
                        >
                          <i className={`fa-solid ${
                            isSpeakingLesson && !isSpeechPaused
                              ? 'fa-circle-pause text-white text-sm'
                              : isSpeechPaused
                              ? 'fa-circle-play text-emerald-300 text-sm'
                              : 'fa-volume-high text-amber-300 text-sm'
                          }`}></i>
                          <span>
                            {isSpeakingLesson && !isSpeechPaused
                              ? 'Pause Audio'
                              : isSpeechPaused
                              ? 'Resume Audio'
                              : (bilingualLang === 'SW' ? 'Sikiliza Somo' : 'Listen to Lesson')}
                          </span>
                        </button>

                        {(isSpeakingLesson || isSpeechPaused) && (
                          <button
                            onClick={handleStopLessonSpeech}
                            className="px-2.5 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Stop Speech Playback"
                          >
                            <i className="fa-solid fa-square text-red-500 text-xs"></i>
                            <span>Stop</span>
                          </button>
                        )}

                        <button
                          onClick={() => downloadTopicNotePdf(selectedSubject.name, selectedTopic.title, deepNote)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                          title="Download Formatted Study Summary as PDF for Offline Viewing"
                        >
                          <i className="fa-solid fa-file-pdf text-amber-300"></i>
                          <span>Download as PDF</span>
                        </button>

                        <div className="flex items-center bg-white p-1 rounded-xl border border-indigo-200">
                          <button
                            onClick={() => setBilingualLang('EN')}
                            className={`px-3 py-1 rounded-lg font-extrabold text-xs transition ${bilingualLang === 'EN' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                          >
                            English
                          </button>
                          <button
                            onClick={() => setBilingualLang('SW')}
                            className={`px-3 py-1 rounded-lg font-extrabold text-xs transition ${bilingualLang === 'SW' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                          >
                            Kiswahili
                          </button>
                        </div>
                      </div>
                    </div>

                    {bilingualLang === 'EN' ? (
                      <div className="space-y-6">
                        {/* 🌟 Curiosity Spark / Did You Know? Hook */}
                        <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 p-5 rounded-2xl border-2 border-amber-300/60 shadow-sm relative overflow-hidden">
                          <div className="flex items-start gap-3">
                            <span className="p-2 bg-amber-400 text-slate-950 rounded-xl text-lg font-black shrink-0">
                              <i className="fa-solid fa-lightbulb"></i>
                            </span>
                            <div>
                              <h4 className="font-black text-amber-950 text-sm uppercase tracking-wider">Curiosity Spark: Did You Know?</h4>
                              <p className="text-sm font-bold text-amber-900 mt-1 leading-relaxed">
                                {deepNote.curiosityHook}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 🧠 Deep Concept Breakdown */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                          <h3 className="text-xl font-black text-tz-blue flex items-center gap-2">
                            <i className="fa-solid fa-brain text-indigo-600"></i> Deep Concept Breakdown
                          </h3>
                          <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                            {deepNote.deepOverview}
                          </p>
                        </div>

                        {/* 📐 Core Principles & Laws */}
                        <div className="space-y-3">
                          <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                            <i className="fa-solid fa-layer-group text-cyan-600"></i> Fundamental Principles & Rules
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {deepNote.corePrinciples.map((p, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-tz-blue transition">
                                <h5 className="font-extrabold text-sm text-tz-blue">{p.title}</h5>
                                <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">{p.detail}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 🇹🇿 Tanzania Connection */}
                        <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-2">
                          <h4 className="font-black text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                            <i className="fa-solid fa-earth-africa text-emerald-600"></i> Real-World Tanzania Connection
                          </h4>
                          <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                            {deepNote.realWorldTanzaniaConnection}
                          </p>
                        </div>

                        {/* 📐 Worked Step-by-Step Examples */}
                        {deepNote.workedExamples.length > 0 && (
                          <div className="bg-indigo-950 text-white p-6 rounded-2xl space-y-3 shadow-md">
                            <h4 className="font-black text-sm uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                              <i className="fa-solid fa-calculator"></i> Step-by-Step Worked Example
                            </h4>
                            {deepNote.workedExamples.map((ex, i) => (
                              <div key={i} className="space-y-2 border-t border-indigo-800/80 pt-3">
                                <p className="text-xs font-bold text-indigo-200">Problem: {ex.problem}</p>
                                <pre className="bg-slate-900/90 p-3 rounded-xl text-xs font-mono text-cyan-200 whitespace-pre-wrap leading-relaxed">
                                  {ex.solution}
                                </pre>
                                <span className="inline-block text-[11px] font-extrabold text-yellow-300 bg-yellow-400/10 px-2.5 py-1 rounded-md border border-yellow-400/20">
                                  💡 Takeaway: {ex.keyTakeaway}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 💡 Probing Curiosity Questions */}
                        <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200 space-y-2">
                          <h4 className="font-black text-xs uppercase tracking-wider text-purple-900 flex items-center gap-2">
                            <i className="fa-solid fa-circle-question text-purple-600"></i> Probing Curiosity Questions (Deep Inquiry)
                          </h4>
                          <ul className="list-disc pl-5 text-xs sm:text-sm text-purple-950 space-y-1.5 font-medium">
                            {deepNote.probingQuestions.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>

                        {/* 📝 NECTA Exam Pro-Tips */}
                        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 space-y-2">
                          <h4 className="font-black text-xs uppercase tracking-wider text-blue-900 flex items-center gap-2">
                            <i className="fa-solid fa-graduation-cap text-blue-600"></i> NECTA Exam Secrets & Common Traps
                          </h4>
                          <ul className="list-disc pl-5 text-xs text-blue-950 space-y-1 font-medium">
                            {deepNote.nectaExamTips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-emerald-50/90 p-6 rounded-2xl border border-emerald-200 space-y-4">
                          <h3 className="text-xl font-black text-emerald-900">{deepNote.bilingualSwahiliNote.heading}</h3>
                          <p className="text-emerald-950 text-sm leading-relaxed font-medium">
                            {deepNote.bilingualSwahiliNote.overview}
                          </p>
                          <div className="pt-3 border-t border-emerald-200 space-y-2">
                            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-800">Mambo Makuu ya Kukumbuka:</h4>
                            <ul className="list-disc pl-5 text-xs text-emerald-950 space-y-1.5 font-medium">
                              {deepNote.bilingualSwahiliNote.keyPoints.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Yun Callout Banner */}
                    <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-500/30 text-white flex items-center justify-between gap-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <YunAvatar3D size="md" state="idle" />
                        <div>
                          <h4 className="font-black text-sm text-cyan-300">Have a deep question about {selectedTopic.title}?</h4>
                          <p className="text-xs text-slate-300 mt-0.5">Ask Yun AI for a step-by-step breakdown or real-world experiment!</p>
                        </div>
                      </div>
                      <button
                        onClick={startChat}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition shrink-0"
                      >
                        Ask Yun
                      </button>
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'video' && (() => {
                const videoList = (selectedTopic.videos && selectedTopic.videos.length > 0)
                  ? selectedTopic.videos
                  : [{ id: 'default-v1', title: `Lesson: ${selectedTopic.title}`, url: selectedTopic.videoUrl || 'https://www.youtube.com/embed/0TgLtF3PMOc', duration: '12:00', channel: 'Education TZ', badge: 'Main Lesson' }];

                const currentVideo = videoList[activeVideoIndex] || videoList[0];

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/80 p-4 sm:p-5 rounded-2xl border border-red-200">
                      <div>
                        <span className="text-[11px] font-black uppercase text-red-700 tracking-wider flex items-center gap-1.5">
                          <i className="fa-solid fa-circle-play text-red-600"></i> Video Class Library ({videoList.length} Lessons Available)
                        </span>
                        <h3 className="text-lg font-black text-gray-900 mt-0.5">{currentVideo.title}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs shadow-sm self-start sm:self-center shrink-0">
                        {currentVideo.badge || 'Featured Video'}
                      </span>
                    </div>

                    {/* Main Video Player */}
                    <div className="w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 relative group">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={currentVideo.url}
                        title={currentVideo.title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                      ></iframe>
                    </div>

                    {/* Active Video Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-base">{currentVideo.title}</h4>
                        <p className="text-xs text-gray-500 font-bold mt-1 flex items-center gap-3">
                          <span><i className="fa-solid fa-tv text-indigo-500 mr-1"></i> {currentVideo.channel || 'Education TZ'}</span>
                          <span><i className="fa-solid fa-clock text-amber-500 mr-1"></i> {currentVideo.duration || '15 mins'}</span>
                        </p>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start sm:self-center">
                        <i className="fa-solid fa-circle-check text-emerald-600 mr-1"></i> Syllabus Aligned
                      </span>
                    </div>

                    {/* Video Lessons Playlist Grid */}
                    <div className="pt-2 space-y-3">
                      <h4 className="font-black text-xs uppercase tracking-wider text-gray-700 flex items-center gap-2">
                        <i className="fa-solid fa-list-ul text-red-600"></i> Switch Lesson ({videoList.length} Video Classes for {selectedTopic.title})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {videoList.map((vid, idx) => {
                          const isActive = activeVideoIndex === idx;
                          return (
                            <button
                              key={vid.id || idx}
                              onClick={() => setActiveVideoIndex(idx)}
                              className={`p-4 rounded-2xl border-2 text-left transition flex items-start justify-between gap-3 ${
                                isActive
                                  ? 'border-red-600 bg-red-50/60 shadow-md ring-2 ring-red-500/20'
                                  : 'border-gray-100 hover:border-red-300 bg-white hover:bg-red-50/20'
                              }`}
                            >
                              <div className="space-y-1.5 flex-grow">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                                    isActive
                                      ? 'bg-red-600 text-white border-red-700'
                                      : 'bg-gray-100 text-gray-700 border-gray-200'
                                  }`}>
                                    {vid.badge || `Lesson ${idx + 1}`}
                                  </span>
                                  {vid.duration && (
                                    <span className="text-[10px] font-bold text-gray-500">
                                      <i className="fa-regular fa-clock text-[9px] mr-1"></i>{vid.duration}
                                    </span>
                                  )}
                                </div>
                                <h5 className={`text-xs font-black line-clamp-2 leading-snug ${isActive ? 'text-red-950' : 'text-gray-800'}`}>
                                  {vid.title}
                                </h5>
                                <p className="text-[10px] text-gray-500 font-bold">{vid.channel}</p>
                              </div>

                              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs transition ${
                                isActive
                                  ? 'bg-red-600 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-600'
                              }`}>
                                <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'homework' && (() => {
                const subjectTopics = selectedSubject.topics || [];
                const allCount = subjectTopics.length;
                const completedCount = subjectTopics.filter(t => !!completedHomework[t.id]?.submittedAt).length;
                const pendingCount = allCount - completedCount;

                const filteredTopics = subjectTopics.filter(t => {
                  const isSubmitted = !!completedHomework[t.id]?.submittedAt;
                  if (hwFilterMode === 'pending') return !isSubmitted;
                  if (hwFilterMode === 'completed') return isSubmitted;
                  return true;
                });

                const homeworkItems = (selectedTopic.homework && selectedTopic.homework.length > 0)
                  ? selectedTopic.homework
                  : getHomeworkForTopic(selectedSubject.name, selectedTopic.title, selectedTopic.id, selectedSubject.id);

                const currentHw = homeworkItems[0];
                const topicTargetScore = targetScores[selectedSubject.name] || selectedTopic.targetScore || 85;
                const isHwSubmitted = completedHomework[selectedTopic.id]?.submittedAt;

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Header Bar with Filter Toggle Controls */}
                    <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-500/30 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                              <i className="fa-solid fa-bullseye"></i> Target Score: {topicTargetScore}%
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 font-bold text-xs border border-emerald-400/30">
                              {completedCount} of {allCount} Completed
                            </span>
                          </div>
                          <h3 className="text-xl font-black">{selectedSubject.name} Homework Center</h3>
                          <p className="text-xs text-indigo-200 mt-1 font-medium leading-relaxed">
                            Filter between pending assignments and completed work to track your coursework progress.
                          </p>
                        </div>

                        {/* Set Subject Goal Control */}
                        <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 shrink-0 text-center space-y-1">
                          <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">Subject Pass Goal</span>
                          <div className="flex items-center gap-2 justify-center">
                            <input
                              type="number"
                              min="50"
                              max="100"
                              value={targetScores[selectedSubject.name] || 85}
                              onChange={(e) => {
                                const val = Math.max(50, Math.min(100, Number(e.target.value)));
                                setTargetScores(prev => ({ ...prev, [selectedSubject.name]: val }));
                              }}
                              className="w-16 px-2 py-1 bg-slate-900 text-amber-300 font-black text-center text-sm rounded-xl border border-amber-400/40 focus:outline-none"
                            />
                            <span className="text-xs font-bold text-gray-200">% Goal</span>
                          </div>
                        </div>
                      </div>

                      {/* COMPLETED / PENDING FILTER TOGGLE BAR */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-indigo-500/30">
                        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-indigo-500/30 text-xs font-extrabold w-full sm:w-auto">
                          <button
                            onClick={() => setHwFilterMode('all')}
                            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                              hwFilterMode === 'all'
                                ? 'bg-indigo-600 text-white shadow-md font-black'
                                : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <i className="fa-solid fa-list-check"></i>
                            <span>All ({allCount})</span>
                          </button>

                          <button
                            onClick={() => setHwFilterMode('pending')}
                            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                              hwFilterMode === 'pending'
                                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                                : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <i className="fa-solid fa-clock"></i>
                            <span>Pending ({pendingCount})</span>
                          </button>

                          <button
                            onClick={() => setHwFilterMode('completed')}
                            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                              hwFilterMode === 'completed'
                                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                                : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <i className="fa-solid fa-circle-check"></i>
                            <span>Completed ({completedCount})</span>
                          </button>
                        </div>

                        <span className="text-xs font-medium text-indigo-200 hidden md:block">
                          Showing {filteredTopics.length} {hwFilterMode === 'all' ? 'total' : hwFilterMode} assignment{filteredTopics.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* TOPIC ASSIGNMENTS LIST SWITCHER */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <h4 className="font-black text-sm text-gray-800 uppercase tracking-wider flex items-center gap-2">
                          <i className="fa-solid fa-book-open text-indigo-600"></i> Topic Assignments ({selectedSubject.name})
                        </h4>
                        <span className="text-xs text-gray-500 font-bold">Select a topic below to inspect work</span>
                      </div>

                      {filteredTopics.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-gray-200 space-y-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
                            {hwFilterMode === 'completed' ? <i className="fa-solid fa-clipboard-list"></i> : <i className="fa-solid fa-circle-check"></i>}
                          </div>
                          <h4 className="font-extrabold text-base text-gray-900">
                            {hwFilterMode === 'completed' ? 'No Completed Assignments Yet' : 'All Assignments Completed!'}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium max-w-md mx-auto">
                            {hwFilterMode === 'completed'
                              ? `You haven't submitted any homework for ${selectedSubject.name} yet. Solve questions below and click 'Submit Homework'.`
                              : `Great job! You have submitted all homework tasks for ${selectedSubject.name}.`}
                          </p>
                          <button
                            onClick={() => setHwFilterMode('all')}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md hover:bg-indigo-700 transition"
                          >
                            Show All Assignments ({allCount})
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filteredTopics.map((top) => {
                            const isSelectedTopic = top.id === selectedTopic.id;
                            const topSubmission = completedHomework[top.id];
                            const isDone = !!topSubmission?.submittedAt;

                            return (
                              <div
                                key={top.id}
                                onClick={() => setSelectedTopic(top)}
                                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between h-32 text-left relative ${
                                  isSelectedTopic
                                    ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500/20'
                                    : 'border-gray-100 hover:border-indigo-300 bg-white hover:bg-indigo-50/20'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 truncate max-w-[130px]">
                                      {top.id}
                                    </span>

                                    {isDone ? (
                                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                        <i className="fa-solid fa-circle-check text-emerald-600"></i> Done ({topSubmission.score}%)
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                        <i className="fa-solid fa-clock text-amber-600"></i> Pending
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="font-extrabold text-xs text-gray-900 line-clamp-2 leading-snug">
                                    {top.title}
                                  </h5>
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                                  <span>Due: {currentHw.dueDate}</span>
                                  <span className="text-indigo-600">{isSelectedTopic ? 'Active Selected' : 'View Task →'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* ACTIVE HOMEWORK QUESTIONS DETAIL SECTION */}
                    <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-100">
                              Selected Topic: {selectedTopic.title}
                            </span>
                            {isHwSubmitted && (
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-100">
                                Status: Submitted ({completedHomework[selectedTopic.id].score}% Score)
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                            <i className="fa-solid fa-pen-ruler text-indigo-600"></i> Homework Problems ({currentHw.questions.length} Tasks)
                          </h4>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">Solve questions carefully. Submit answers to verify against your target score.</p>
                        </div>

                        {isHwSubmitted && (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300 flex items-center gap-1.5 self-start sm:self-center">
                            <i className="fa-solid fa-circle-check text-emerald-600"></i> Submitted ({completedHomework[selectedTopic.id].score}% Achieved)
                          </span>
                        )}
                      </div>

                      <div className="space-y-6">
                        {currentHw.questions.map((q, qIdx) => (
                          <div key={q.id} className="p-5 bg-slate-50/80 rounded-2xl border border-gray-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                                Question {qIdx + 1}
                              </span>
                              <span className="text-[11px] font-bold text-gray-500">
                                {q.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Written Answer'}
                              </span>
                            </div>

                            <h5 className="font-bold text-sm text-gray-900">{q.question}</h5>

                            {q.type === 'multiple-choice' && q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {q.options.map((opt, optIdx) => (
                                  <label
                                    key={optIdx}
                                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-gray-200 hover:border-indigo-400 cursor-pointer text-xs font-semibold text-gray-800 transition"
                                  >
                                    <input
                                      type="radio"
                                      name={`hw-q-${q.id}`}
                                      defaultChecked={optIdx === 0}
                                      className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {q.type === 'short-answer' && (
                              <textarea
                                rows={2}
                                placeholder="Type your step-by-step solution or answer here..."
                                className="w-full p-3 rounded-xl bg-white border border-gray-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                              ></textarea>
                            )}

                            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                              <span className="font-black text-amber-950 flex items-center gap-1 mb-1">
                                <i className="fa-solid fa-lightbulb text-amber-600"></i> Explanation & Solution Guide:
                              </span>
                              {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Submit Homework Action */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-gray-600">
                          <i className="fa-solid fa-trophy text-amber-500"></i>
                          <span>Target Goal: {topicTargetScore}% Pass Mark</span>
                        </div>

                        <button
                          onClick={() => {
                            const achieved = Math.floor(Math.random() * 15) + 85; // 85-100%
                            setCompletedHomework(prev => ({
                              ...prev,
                              [selectedTopic.id]: {
                                score: achieved,
                                submittedAt: new Date().toLocaleTimeString(),
                                answers: {}
                              }
                            }));

                            setUser(prev => ({
                              ...prev,
                              points: prev.points + 60,
                              completedTopics: prev.completedTopics.includes(selectedTopic.id) ? prev.completedTopics : [...prev.completedTopics, selectedTopic.id]
                            }));
                          }}
                          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
                        >
                          <i className="fa-solid fa-paper-plane"></i>
                          <span>{isHwSubmitted ? 'Resubmit Homework' : 'Submit Homework for Marking'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'language' && (() => {
                const vocabList = getTopicVocabulary(selectedSubject.name, selectedTopic.title);
                const safeIndex = Math.min(flashcardIndex, vocabList.length - 1);
                const currentCard = vocabList[safeIndex] || vocabList[0];
                const isMastered = masteredTerms.includes(`${selectedTopic.id}-${currentCard.term}`);

                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Language & Flashcard Header Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-blue-500/30">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 font-bold text-xs border border-blue-400/30 flex items-center gap-1">
                            <i className="fa-solid fa-language"></i> {selectedSubject.name} Vocabulary
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 font-bold text-xs border border-emerald-400/30">
                            {masteredTerms.filter(t => t.startsWith(selectedTopic.id)).length} / {vocabList.length} Mastered
                          </span>
                        </div>
                        <h3 className="text-xl font-black">{selectedTopic.title} - Active Recall Engine</h3>
                        <p className="text-xs text-blue-200 mt-1 font-medium">
                          Flip interactive flashcards to test your vocabulary memory and master key exam terminology.
                        </p>
                      </div>

                      {/* View Mode Toggle Switcher */}
                      <div className="bg-white/10 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 shrink-0 text-xs font-bold">
                        <button
                          onClick={() => {
                            setFlashcardViewMode('flashcard');
                            setIsFlashcardFlipped(false);
                          }}
                          className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                            flashcardViewMode === 'flashcard'
                              ? 'bg-blue-600 text-white font-black shadow-md'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          <i className="fa-solid fa-layer-group"></i> Flashcards
                        </button>
                        <button
                          onClick={() => setFlashcardViewMode('grid')}
                          className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                            flashcardViewMode === 'grid'
                              ? 'bg-blue-600 text-white font-black shadow-md'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          <i className="fa-solid fa-table-cells"></i> Full List
                        </button>
                      </div>
                    </div>

                    {/* FLASHCARD INTERACTIVE MODE */}
                    {flashcardViewMode === 'flashcard' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                        {/* Progress Indicator */}
                        <div className="flex items-center justify-between text-xs font-black text-gray-500 px-2">
                          <span>CARD {safeIndex + 1} OF {vocabList.length}</span>
                          <div className="flex items-center gap-2">
                            {isMastered && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                                <i className="fa-solid fa-check"></i> Mastered
                              </span>
                            )}
                            <button
                              onClick={() => {
                                speakWord(currentCard.term, selectedSubject.name);
                              }}
                              className="text-tz-blue hover:underline flex items-center gap-1"
                            >
                              <i className="fa-solid fa-volume-high"></i> Audio
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-tz-blue h-full transition-all duration-300"
                            style={{ width: `${((safeIndex + 1) / vocabList.length) * 100}%` }}
                          ></div>
                        </div>

                        {/* 3D Interactive Flashcard Card */}
                        <div className="perspective-1000 min-h-[280px]">
                          <div
                            className={`w-full bg-white rounded-3xl p-8 border-2 shadow-xl transition-all duration-500 transform flex flex-col justify-between items-center text-center relative overflow-hidden ${
                              isFlashcardFlipped
                                ? 'border-indigo-400 bg-gradient-to-b from-indigo-50/50 via-white to-blue-50/50'
                                : 'border-gray-200 hover:border-tz-blue'
                            }`}
                          >
                            {/* Decorative background watermark */}
                            <div className="absolute -right-8 -bottom-8 opacity-5 text-9xl font-black select-none pointer-events-none">
                              <i className="fa-solid fa-language"></i>
                            </div>

                            {/* Card Top: Phonetic & Audio */}
                            <div className="w-full flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                Phonetic: {currentCard.phonetic}
                              </span>

                              <button
                                onClick={() => speakWord(currentCard.term, selectedSubject.name)}
                                className="w-12 h-12 rounded-full bg-blue-50 text-tz-blue hover:bg-tz-blue hover:text-white transition flex items-center justify-center shadow-md active:scale-95"
                                title="Listen to pronunciation"
                              >
                                <i className="fa-solid fa-volume-high text-lg"></i>
                              </button>
                            </div>

                            {/* Card Body: Term (Front) OR Definition & Translation (Back) */}
                            <div className="my-6 space-y-4 w-full">
                              {!isFlashcardFlipped ? (
                                <div className="space-y-3">
                                  <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                                    {currentCard.term}
                                  </h2>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    Click 'Flip Card' below to reveal translation
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-4 animate-fade-in">
                                  <div className="text-xs font-black uppercase text-indigo-500 tracking-wider">
                                    Meaning & Translation
                                  </div>
                                  <div className="bg-indigo-600 text-white p-5 rounded-2xl font-black text-2xl shadow-lg border border-indigo-400">
                                    {currentCard.translation}
                                  </div>
                                  <p className="text-xs text-gray-500 font-medium">
                                    Target Subject: <strong>{selectedSubject.name}</strong> • Topic: <strong>{selectedTopic.title}</strong>
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Card Bottom: Flip Action Button or Active Recall Self-Marking */}
                            <div className="w-full pt-4 border-t border-gray-100">
                              {!isFlashcardFlipped ? (
                                <button
                                  onClick={() => setIsFlashcardFlipped(true)}
                                  className="w-full py-3.5 rounded-2xl bg-tz-blue hover:bg-blue-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2"
                                >
                                  <i className="fa-solid fa-arrows-rotate text-amber-300 animate-spin-slow"></i>
                                  <span>Flip Card to Reveal Definition</span>
                                </button>
                              ) : (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <button
                                      onClick={() => {
                                        setIsFlashcardFlipped(false);
                                        if (safeIndex < vocabList.length - 1) {
                                          setFlashcardIndex(safeIndex + 1);
                                        }
                                      }}
                                      className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition flex items-center justify-center gap-1.5"
                                    >
                                      <i className="fa-solid fa-rotate-left"></i> Need Practice
                                    </button>

                                    <button
                                      onClick={() => {
                                        const key = `${selectedTopic.id}-${currentCard.term}`;
                                        if (!masteredTerms.includes(key)) {
                                          setMasteredTerms(prev => [...prev, key]);
                                          setUser(prev => ({ ...prev, points: prev.points + 10 }));
                                        }
                                        setIsFlashcardFlipped(false);
                                        if (safeIndex < vocabList.length - 1) {
                                          setFlashcardIndex(safeIndex + 1);
                                        }
                                      }}
                                      className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition flex items-center justify-center gap-1.5"
                                    >
                                      <i className="fa-solid fa-circle-check"></i> Mastered! (+10 XP)
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => setIsFlashcardFlipped(false)}
                                    className="text-xs text-gray-400 font-bold hover:text-tz-blue transition block mx-auto"
                                  >
                                    Flip back to term
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Deck Navigation Controls */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <button
                            disabled={safeIndex === 0}
                            onClick={() => {
                              setIsFlashcardFlipped(false);
                              setFlashcardIndex(Math.max(0, safeIndex - 1));
                            }}
                            className={`px-5 py-3 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
                              safeIndex === 0
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                : 'bg-white border-2 border-gray-200 hover:border-tz-blue text-gray-700 active:scale-95 shadow-sm'
                            }`}
                          >
                            <i className="fa-solid fa-chevron-left"></i> Previous
                          </button>

                          <button
                            onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                            className="px-5 py-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-black text-xs hover:bg-indigo-100 transition active:scale-95 flex items-center gap-2"
                          >
                            <i className="fa-solid fa-arrows-rotate"></i> Flip
                          </button>

                          <button
                            disabled={safeIndex === vocabList.length - 1}
                            onClick={() => {
                              setIsFlashcardFlipped(false);
                              setFlashcardIndex(Math.min(vocabList.length - 1, safeIndex + 1));
                            }}
                            className={`px-5 py-3 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
                              safeIndex === vocabList.length - 1
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                : 'bg-tz-blue text-white hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-200'
                            }`}
                          >
                            Next <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* FULL LIST / GRID VIEW MODE */}
                    {flashcardViewMode === 'grid' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                        {vocabList.map((item, idx) => {
                          const isItemMastered = masteredTerms.includes(`${selectedTopic.id}-${item.term}`);
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setFlashcardIndex(idx);
                                setFlashcardViewMode('flashcard');
                                setIsFlashcardFlipped(false);
                              }}
                              className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-tz-blue transition-all shadow-sm hover:shadow-md relative group flex flex-col justify-between h-48 cursor-pointer"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-2xl font-black text-gray-800 tracking-tight">{item.term}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      speakWord(item.term, selectedSubject.name);
                                    }}
                                    className="w-10 h-10 rounded-full bg-blue-50 text-tz-blue hover:bg-tz-blue hover:text-white transition flex items-center justify-center shadow-sm active:scale-95"
                                    title="Listen to pronunciation"
                                  >
                                    <i className="fa-solid fa-volume-high text-sm"></i>
                                  </button>
                                </div>
                                <span className="inline-block text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded mb-3">
                                  Phonetic: {item.phonetic}
                                </span>
                              </div>

                              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-bold text-tz-blue">{item.translation}</span>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                  isItemMastered ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-tz-blue'
                                }`}>
                                  {isItemMastered ? '✓ Mastered' : 'Practice Card'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {activeTab === 'exams' && (
                <div className="text-center py-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-tz-blue'}`}>
                    <i className={`fa-solid ${isCompleted ? 'fa-medal' : 'fa-clipboard-question'}`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{isCompleted ? 'Topic Mastered!' : 'Ready to test yourself?'}</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {isCompleted ? 'You have already earned points for this topic. Want to practice again?' : 'Take a quick quiz to master this topic and earn 50 EP.'}
                  </p>
                  <button 
                    onClick={startPracticeQuiz}
                    className="bg-tz-green text-white px-8 py-3 rounded-xl font-bold shadow-[0_4px_0_rgb(21,128,61)] hover:shadow-[0_2px_0_rgb(21,128,61)] hover:translate-y-[2px] transition-all"
                  >
                    {isCompleted ? 'Retake Exam' : 'Start Exam'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
             <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-tz-blue to-teal-400 rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-lg">
                  <i className="fa-solid fa-robot text-4xl text-white"></i>
                </div>
                <h3 className="font-bold text-lg">Ask Yun</h3>
                <p className="text-sm text-gray-500 mb-4">Confused about this topic?</p>
                <button 
                  onClick={() => {
                    setYunContext(`I am studying ${selectedTopic.title} in ${selectedSubject.name}. Help me understand...`);
                    setCurrentView(AppView.CHAT);
                  }}
                  className="w-full py-2 rounded-xl border-2 border-tz-blue text-tz-blue font-bold hover:bg-tz-blue hover:text-white transition"
                >
                  Chat Now
                </button>
             </div>

             <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Your Progress</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-500">Mastery</span>
                  <span className="font-bold text-tz-green">
                      {isCompleted ? '100%' : '10%'}
                  </span>
                </div>
                <ProgressBar progress={isCompleted ? 100 : 10} />
                
                {/* Added Quiz Button directly in Progress card */}
                {!isCompleted && (
                    <button 
                        onClick={startPracticeQuiz}
                        className="w-full mt-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl font-bold text-sm hover:bg-yellow-100 transition flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-star"></i> Take Quiz (+50 XP)
                    </button>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  };



  const renderParentDashboard = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={goHome} className="mb-6 flex items-center text-gray-500 hover:text-tz-blue transition">
        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Student Mode
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-3xl">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-tz-dark">Parent Dashboard</h1>
              <p className="text-gray-500 text-xs font-medium">Monitor student progress, target scores & achievements</p>
            </div>
          </div>

          {isParentUnlocked && (
            <button
              onClick={() => setIsParentShareModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <i className="fa-solid fa-share-nodes text-xs"></i>
              <span>Share Student Progress</span>
            </button>
          )}
        </div>

        {!isParentUnlocked ? (
          <div className="max-w-sm mx-auto text-center py-12">
            <p className="mb-4 text-gray-600">Enter PIN to access (Default: 0000)</p>
            <div className="flex gap-2 justify-center mb-6">
              <input 
                type="password" 
                maxLength={4}
                value={parentPin}
                onChange={(e) => setParentPin(e.target.value)}
                className="text-center text-3xl tracking-widest w-40 border-2 border-gray-200 rounded-xl py-2 focus:border-tz-blue outline-none"
              />
            </div>
            <button 
              onClick={() => {
                if(parentPin === '0000') setIsParentUnlocked(true);
                else alert('Incorrect PIN');
              }}
              className="bg-tz-dark text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
            >
              Unlock
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Share Progress Banner Card for Parents */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-extrabold text-[10px] uppercase border border-emerald-400/30">
                    Parent & Teacher Progress Sharing
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    <i className="fa-solid fa-trophy mr-1"></i> {user.points} EP Total
                  </span>
                </div>
                <h3 className="text-lg font-black">Share Academic Report with Family or School</h3>
                <p className="text-xs text-indigo-200 font-medium">
                  Use the Web Share API or WhatsApp to send an updated report of study streak, quiz results, and mastered topics.
                </p>
              </div>

              <button
                onClick={() => setIsParentShareModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <i className="fa-solid fa-share-nodes text-xs"></i>
                <span>Share via WhatsApp / App</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               <div className="bg-blue-50 p-6 rounded-2xl">
                 <p className="text-blue-600 font-bold mb-1">Total Points</p>
                 <h2 className="text-4xl font-extrabold text-tz-dark">{user.points}</h2>
               </div>
               <div className="bg-orange-50 p-6 rounded-2xl">
                 <p className="text-orange-600 font-bold mb-1">Study Streak</p>
                 <h2 className="text-4xl font-extrabold text-tz-dark">{user.streak} Days</h2>
               </div>
               <div className="bg-green-50 p-6 rounded-2xl">
                 <p className="text-green-600 font-bold mb-1">Topics Mastered</p>
                 <h2 className="text-4xl font-extrabold text-tz-dark">{user.completedTopics.length}</h2>
               </div>
            </div>

            {/* Visual Radar Chart Component */}
            <div className="pt-2">
              <RadarChart data={studentProficiencyData} />
            </div>

            {/* Weekly Study Trend Recharts Graph (Time Spent vs Quiz Performance) */}
            <div className="pt-2">
              <StudyTrendChart userPoints={user.points} isParentView={true} />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-lg mb-4">Recent Milestones</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                    <i className="fa-solid fa-check-circle text-green-500"></i> Completed "Fractions" quiz with 100%
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-600">
                    <i className="fa-solid fa-clock text-blue-500"></i> Spent 45 mins on Science
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderHome = () => (
    <div className={`animate-fade-in space-y-12 ${isZenMode ? 'py-4 max-w-4xl mx-auto' : 'py-8'}`}>
      {/* NECTA National Final Examinations Countdown Timer - Hidden in Zen Mode */}
      {!isZenMode && (
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <NectaCountdownTimer
            initialGrade={selectedGrade ? selectedGrade.grade : (selectedLevel ? selectedLevel : 'Form 4')}
            onNavigateToExams={() => setCurrentView(AppView.EXAMS)}
            onNavigateToPlanner={() => setCurrentView(AppView.PLANNER)}
            onStartQuickStudy={handleQuickStudySession}
            onOpenYunAI={(prompt) => {
              setYunContext(prompt);
              setCurrentView(AppView.CHAT);
            }}
          />
        </div>
      )}

      {/* Start Quick Study Session Action Bar Below Timer */}
      <div className="max-w-7xl mx-auto px-4">
        <div className={`bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border-2 border-indigo-500/30 shadow-xl flex flex-col gap-4 ${isZenMode ? 'ring-2 ring-purple-500/50 shadow-2xl shadow-purple-950/50' : ''}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-xl font-black shrink-0 shadow-lg shadow-amber-400/20">
                <i className={`fa-solid ${isZenMode ? 'fa-spa text-purple-950 animate-pulse' : 'fa-bolt text-slate-950'}`}></i>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider">Instant Review</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 text-[10px] font-extrabold uppercase border border-indigo-400/30">NECTA Curriculum</span>
                  {isZenMode && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/40 text-purple-200 text-[10px] font-black uppercase border border-purple-400/40 animate-pulse flex items-center gap-1">
                      <span>🧘</span> Zen Focus Mode
                    </span>
                  )}
                </div>
                <h4 className="font-black text-sm sm:text-base text-white">
                  Start Quick Study Session
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  Jump directly into a random syllabus topic for rapid lesson notes, video tutorials & practice quizzes!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <div className="relative group/btn w-full sm:w-auto flex justify-center items-center">
                {/* Smooth glowing pulsating border backdrop aura on hover */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-pulse blur-md transition-opacity duration-500 pointer-events-none"></div>

                <button
                  id="start-quick-study-session-btn"
                  onClick={handleQuickStudySession}
                  className={`relative w-full sm:w-auto px-4 max-[480px]:px-3.5 sm:px-6 py-2.5 max-[480px]:py-2.5 sm:py-3.5 rounded-2xl font-black text-xs max-[480px]:text-[12px] sm:text-sm uppercase tracking-wider text-slate-950 flex flex-col items-center justify-center text-center mx-auto gap-1 shrink-0 cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-amber-200/90 hover:ring-4 hover:ring-amber-300/80 ${
                    isQuickStudyClicked
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 scale-105 sm:scale-110 ring-4 ring-emerald-300/80 shadow-xl shadow-emerald-500/50'
                      : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-400/30 animate-subtle-pulse hover:scale-105 active:scale-95'
                  }`}
                  title="Triggers a random, AI-selected syllabus topic review with lesson notes, videos & quizzes"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    <i className={`fa-solid ${isQuickStudyClicked ? 'fa-bolt-lightning text-slate-950 animate-bounce' : 'fa-dice'} text-sm sm:text-base text-slate-950 shrink-0`}></i>
                    <span className="text-center">
                      {isQuickStudyClicked ? 'Launching Study Session... ⚡' : 'Start Quick Study Session ⚡'}
                    </span>
                  </div>

                  {/* Daily Goal 5 Sessions Hover Progress Indicator */}
                  <div className="w-full max-w-[210px] overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover/btn:max-h-14 group-hover/btn:opacity-100 group-hover/btn:mt-1 pointer-events-none">
                    <div className="flex items-center justify-between text-[10px] font-black tracking-normal normal-case text-slate-950 px-0.5 mb-0.5">
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-bullseye text-amber-900"></i> Daily Goal: 5 sessions
                      </span>
                      <span className="font-extrabold">{todayQuickSessionsCount}/5 ({Math.min(100, Math.round((todayQuickSessionsCount / 5) * 100))}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950/20 rounded-full overflow-hidden p-0.5 border border-slate-950/10">
                      <div
                        className="h-full bg-slate-950 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((todayQuickSessionsCount / 5) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Small circular counter badge showing total sessions completed today */}
                  <span
                    key={`counter-badge-${todayQuickSessionsCount}`}
                    id="quick-study-sessions-counter-badge"
                    className={`absolute -top-2.5 -right-2.5 max-[480px]:-top-2 max-[480px]:-right-2 flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full font-black text-[11px] leading-none shadow-md transition-all duration-300 group-hover/btn:scale-110 ${
                      todayQuickSessionsCount >= 5
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-2 border-amber-200 ring-2 ring-amber-400/50 shadow-amber-400/40 animate-badge-pop-mastery'
                        : 'bg-slate-950 text-amber-300 border-2 border-amber-400'
                    }`}
                    title={todayQuickSessionsCount >= 5 ? `Daily Mastery Goal Achieved! (${todayQuickSessionsCount}/5 sessions completed today)` : `${todayQuickSessionsCount} quick study session${todayQuickSessionsCount === 1 ? '' : 's'} completed today`}
                  >
                    {todayQuickSessionsCount >= 5 ? `👑 ${todayQuickSessionsCount}` : todayQuickSessionsCount}
                  </span>
                </button>

                {/* Hover Tooltip Indicator with Time to Master estimate */}
                {(() => {
                  const est = getTopicTimeEstimate(null, undefined, selectedGrade?.grade);
                  return (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap bg-slate-900 text-amber-300 font-bold text-[11px] px-3.5 py-2 rounded-2xl border border-amber-400/60 shadow-2xl flex flex-col items-center gap-1 scale-95 group-hover/btn:scale-100">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
                        <span>Random AI Topic Review</span>
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 text-[10px] font-black uppercase border border-amber-400/40">
                          ⏱️ Time to Master: {est.time}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-medium flex items-center gap-1.5">
                        <span>Est. based on {selectedGrade?.grade || 'Form 4'} topic difficulty ({est.level})</span>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-r border-b border-amber-400/60 rotate-45"></div>
                    </div>
                  );
                })()}
              </div>

              {/* Zen Mode Toggle Button */}
              <button
                id="toggle-zen-mode-btn"
                onClick={() => setIsZenMode(!isZenMode)}
                className={`w-full sm:w-auto px-4 py-2.5 max-[480px]:py-2.5 sm:py-3.5 rounded-2xl font-black text-xs max-[480px]:text-[12px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border shadow-md cursor-pointer shrink-0 ${
                  isZenMode
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-400 ring-4 ring-purple-400/40 shadow-purple-500/30'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-purple-300 border-purple-500/30 hover:border-purple-400 hover:scale-105 active:scale-95'
                }`}
                title={isZenMode ? "Disable Zen Focus Mode" : "Enable Zen Focus Mode (removes headers, leaderboards & sidebars for distraction-free study)"}
              >
                <i className={`fa-solid ${isZenMode ? 'fa-spa text-white text-base animate-pulse' : 'fa-yin-yang text-purple-400 text-base'}`}></i>
                <span>{isZenMode ? 'Zen Active 🧘' : 'Zen Mode 🧘'}</span>
              </button>
            </div>
          </div>

          {/* Recent Quick Study Sessions Quick-Access List */}
          {recentQuickSessions.length > 0 && (
            <div className="pt-4 border-t border-indigo-500/20 text-left w-full space-y-2.5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-amber-400 text-xs"></i>
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Recent Sessions ({recentQuickSessions.length}/5)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">• Click any card to resume review</span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Sort by dropdown */}
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-indigo-400/30 text-[11px] font-bold text-slate-300">
                    <label htmlFor="recent-sessions-sort-select" className="text-amber-400/90 flex items-center gap-1 cursor-pointer">
                      <i className="fa-solid fa-arrow-down-short-wide text-[10px]"></i>
                      <span>Sort by:</span>
                    </label>
                    <select
                      id="recent-sessions-sort-select"
                      value={recentSessionsSort}
                      onChange={(e) => setRecentSessionsSort(e.target.value as 'newest' | 'shortest' | 'difficulty')}
                      className="bg-transparent text-amber-300 font-extrabold focus:outline-none cursor-pointer text-[11px] pr-1"
                    >
                      <option value="newest" className="bg-slate-900 text-slate-200 font-medium">Newest</option>
                      <option value="shortest" className="bg-slate-900 text-slate-200 font-medium">Shortest Time</option>
                      <option value="difficulty" className="bg-slate-900 text-slate-200 font-medium">Difficulty Level</option>
                    </select>
                  </div>

                  {/* Download Session Log Button */}
                  <button
                    onClick={downloadRecentSessionsLog}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    title="Download revision session log for offline reference (.txt)"
                  >
                    <i className="fa-solid fa-file-arrow-down text-[11px] text-amber-400"></i>
                    <span>Log (.txt)</span>
                  </button>

                  <button
                    onClick={() => {
                      setRecentQuickSessions([]);
                      try {
                        localStorage.removeItem('tz_recent_quick_study_sessions');
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-400 transition flex items-center gap-1 cursor-pointer ml-auto"
                    title="Clear recent study history"
                  >
                    <i className="fa-solid fa-trash-can text-[10px]"></i>
                    <span>Clear History</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {sortedRecentSessions.map((session, index) => {
                  const isUnfinishedResumeTarget = isMostRecentSessionUnfinished && session.id === mostRecentSession?.id;
                  const isCompleted = isSessionTopicCompleted(session);

                  return (
                    <button
                      key={session.id}
                      onClick={() => resumeQuickStudySession(session)}
                      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
                      className={`px-3.5 py-2 rounded-xl transition group flex items-center gap-2 text-xs font-semibold shadow-sm active:scale-95 cursor-pointer animate-slide-in-item ${
                        isUnfinishedResumeTarget
                          ? 'bg-slate-900 hover:bg-indigo-950 border-2 border-amber-400 text-white animate-subtle-pulse shadow-md shadow-amber-400/25 ring-2 ring-amber-400/40'
                          : 'bg-slate-800/90 hover:bg-indigo-900/90 border border-indigo-400/25 hover:border-amber-400/60 text-slate-200 hover:text-white'
                      }`}
                      title={
                        isUnfinishedResumeTarget
                          ? `⚡ CONTINUE STUDYING (UNFINISHED): ${session.topicTitle} - ${session.subjectName} (${session.gradeName}) • Est. Time: ${session.timeEstimate || '15-25 min'}`
                          : `Resume ${session.topicTitle} - ${session.subjectName} (${session.gradeName}) • Est. Time to Master: ${session.timeEstimate || '15-25 min'}`
                      }
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 group-hover:scale-125 transition-transform ${isUnfinishedResumeTarget ? 'bg-amber-300 animate-ping' : isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                      <span className="font-extrabold text-amber-300 group-hover:text-amber-200 shrink-0">{session.gradeName}</span>
                      <span className="text-indigo-300 font-bold shrink-0">{session.subjectName}:</span>
                      <span className="text-slate-100 font-medium truncate max-w-[120px] sm:max-w-[170px]">{session.topicTitle}</span>

                      {isUnfinishedResumeTarget ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
                          <i className="fa-solid fa-play text-[8px]"></i> Resume
                        </span>
                      ) : isCompleted ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 shrink-0">
                          ✓ Done
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 text-[10px] font-extrabold border border-amber-400/25 shrink-0">
                          ⏱️ {session.timeEstimate || '15-25m'}
                        </span>
                      )}
                      <i className="fa-solid fa-rotate-right text-[10px] text-amber-400/80 group-hover:text-amber-300 transition-transform group-hover:rotate-45 ml-0.5 shrink-0"></i>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Non-essential elements hidden in Zen Focus Mode */}
      {!isZenMode && (
        <>
          {/* Hero */}
          <div className="text-center space-y-6 max-w-4xl mx-auto px-4 relative">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-extrabold text-xs tracking-wider uppercase shadow-sm animate-pulse-glow">
                <i className="fa-solid fa-sparkles text-amber-500"></i> Over {totalTopicsCount}+ Topics & Video Classes
             </div>
             <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-tz-dark tracking-tight leading-tight">
               Your AI Classroom for <span className="gradient-text">Every Stage</span>
             </h1>
             <p className="text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
               Explore over <span className="font-extrabold text-indigo-600">{totalTopicsCount}+ syllabus-aligned topics</span> with embedded video lessons, interactive quizzes, vocabulary engines, and your AI study buddy, Yun.
             </p>
             
             <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
               <span className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs border border-sky-100 flex items-center gap-1.5">
                 <i className="fa-solid fa-video text-sky-500"></i> Video Classes
               </span>
               <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100 flex items-center gap-1.5">
                 <i className="fa-solid fa-circle-check text-emerald-500"></i> NECTA Syllabus
               </span>
               <span className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100 flex items-center gap-1.5">
                 <i className="fa-solid fa-language text-purple-500"></i> Multilingual Vocabulary
               </span>
               <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs border border-amber-100 flex items-center gap-1.5">
                 <i className="fa-solid fa-robot text-amber-500"></i> Yun AI Tutor
               </span>
             </div>
          </div>

          {/* Level Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
             <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { type: EducationLevel.PRIMARY, icon: 'fa-child', color: 'bg-emerald-gradient', desc: 'Standard 1 - 7', badge: 'Primary School' },
                  { type: EducationLevel.SECONDARY, icon: 'fa-book-open', color: 'bg-vibrant-gradient', desc: 'Form 1 - 4', badge: 'O-Level' },
                  { type: EducationLevel.HIGH_SCHOOL, icon: 'fa-microscope', color: 'bg-sunset-gradient', desc: 'Advanced Level', badge: 'A-Level' }
                ].map((level) => (
                  <button 
                    key={level.type}
                    id={`level-select-${level.type.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleLevelSelect(level.type)}
                    className="group glass-card-vibrant rounded-3xl p-8 border-2 border-white/80 hover:border-indigo-400 transition-all duration-300 text-left hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden"
                  >
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 ${level.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                          <i className={`fa-solid ${level.icon}`}></i>
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                          {level.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-tz-dark mb-2 group-hover:text-tz-blue transition-colors">{level.type}</h3>
                      <p className="text-gray-500 font-medium text-sm mb-6">{level.desc}</p>
                      <div className="flex items-center text-indigo-600 font-extrabold gap-2 group-hover:gap-4 transition-all text-sm">
                        Explore Syllabus <i className="fa-solid fa-arrow-right"></i>
                      </div>
                  </button>
                ))}
             </div>
             
             <div className="lg:col-span-1">
                {renderLeaderboard()}
             </div>
          </div>

          {/* Featured Stats */}
          <div className="bg-tz-dark rounded-[3rem] p-10 md:p-12 text-white max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl border border-slate-800">
             <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3 border border-cyan-500/30">
                   Interactive Platform
                </div>
                <h2 className="text-3xl font-extrabold mb-2">Join Tanzania's Digital Learning Revolution</h2>
                <p className="text-slate-300 max-w-xl text-sm leading-relaxed">Access hundreds of video lessons, past exams, study notes, and real-time AI guidance from primary school to high school.</p>
             </div>
             <div className="flex gap-8 relative z-10 shrink-0">
                <div className="text-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[110px]">
                   <div className="text-4xl font-black text-amber-400">{totalTopicsCount}+</div>
                   <div className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mt-1">Video Topics</div>
                </div>
                <div className="text-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 min-w-[110px]">
                   <div className="text-4xl font-black text-cyan-400">120+</div>
                   <div className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold mt-1">Past Exams</div>
                </div>
             </div>
          </div>

          {/* Student & Parent Weekly Study Trend Chart */}
          <div className="max-w-6xl mx-auto px-4">
            <StudyTrendChart userPoints={user.points} isParentView={false} />
          </div>

          {/* Quick Access Portals Grid */}
          <div className="max-w-6xl mx-auto px-4 space-y-4 mb-12">
            <h2 className="text-2xl font-black text-tz-dark flex items-center gap-2">
              <i className="fa-solid fa-grid-2 text-indigo-600"></i> Essential Learning Hubs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Portal 1: NECTA Results */}
              <div
                className="bg-emerald-50/80 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-emerald-100/80 transition border-2 border-emerald-100 shadow-sm hover:shadow-md"
                onClick={() => setCurrentView(AppView.EXAMS)}
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md shadow-emerald-200">
                    <i className="fa-solid fa-square-poll-vertical"></i>
                  </div>
                  <h4 className="text-lg font-black text-emerald-950 mb-1">NECTA Results Portal</h4>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">Check index statements, candidate results, and calculate division points.</p>
                </div>
                <div className="pt-4 mt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-black text-emerald-700">
                  <span>Access Results</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                </div>
              </div>

              {/* Portal 2: Vocabulary & Dictionary */}
              <div
                className="bg-amber-50/80 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-amber-100/80 transition border-2 border-amber-100 shadow-sm hover:shadow-md"
                onClick={() => setCurrentView(AppView.DICTIONARY)}
              >
                <div>
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md shadow-amber-200">
                    <i className="fa-solid fa-book-bookmark"></i>
                  </div>
                  <h4 className="text-lg font-black text-amber-950 mb-1">Vocabulary & Kamusi</h4>
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">Swahili & English academic term definitions, audio pronunciation, and flashcards.</p>
                </div>
                <div className="pt-4 mt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-black text-amber-700">
                  <span>Open Dictionary</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                </div>
              </div>

              {/* Portal 3: Notes Hub */}
              <div
                className="bg-indigo-50/80 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-indigo-100/80 transition border-2 border-indigo-100 shadow-sm hover:shadow-md"
                onClick={() => setCurrentView(AppView.NOTES)}
              >
                <div>
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md shadow-indigo-200">
                    <i className="fa-solid fa-note-sticky"></i>
                  </div>
                  <h4 className="text-lg font-black text-indigo-950 mb-1">Study Notes Hub</h4>
                  <p className="text-xs text-indigo-800 font-medium leading-relaxed">Create personal subject notebooks, save Yun AI summaries, and export PDFs.</p>
                </div>
                <div className="pt-4 mt-2 border-t border-indigo-200/60 flex items-center justify-between text-xs font-black text-indigo-700">
                  <span>Open Notebooks</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                </div>
              </div>

              {/* Portal 4: Grade Calculator */}
              <div
                className="bg-purple-50/80 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-purple-100/80 transition border-2 border-purple-100 shadow-sm hover:shadow-md"
                onClick={() => setCurrentView(AppView.CALCULATOR)}
              >
                <div>
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md shadow-purple-200">
                    <i className="fa-solid fa-calculator"></i>
                  </div>
                  <h4 className="text-lg font-black text-purple-950 mb-1">Grade Calculator</h4>
                  <p className="text-xs text-purple-800 font-medium leading-relaxed">Calculate subject grade averages, sum scores, and academic percentages.</p>
                </div>
                <div className="pt-4 mt-2 border-t border-purple-200/60 flex items-center justify-between text-xs font-black text-purple-700">
                  <span>Calculate Grades</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                </div>
              </div>

              {/* Portal 5: School Admission Predictor */}
              <div
                className="bg-emerald-50/80 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-emerald-100/80 transition border-2 border-emerald-100 shadow-sm hover:shadow-md"
                onClick={() => setCurrentView(AppView.PREDICTOR)}
              >
                <div>
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md shadow-emerald-200">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <h4 className="text-lg font-black text-emerald-950 mb-1">School & University Predictor</h4>
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">Predict exactly which Special National Schools, A-Level Combos, or University programs (UDSM, MUHAS) you qualify for!</p>
                </div>
                <div className="pt-4 mt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-black text-emerald-700">
                  <span>Predict School Admission</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                </div>
              </div>

              {/* Portal 6: Assignments & Practice Test Center */}
              <div
                className="bg-sky-50/80 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-sky-100/80 transition border-2 border-sky-100 shadow-sm hover:shadow-md"
                onClick={() => setCurrentView(AppView.ASSIGNMENTS_TESTS)}
              >
                <div>
                  <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md shadow-sky-200">
                    <i className="fa-solid fa-list-check"></i>
                  </div>
                  <h4 className="text-lg font-black text-sky-950 mb-1">Assignments & Practice Tests</h4>
                  <p className="text-xs text-sky-800 font-medium leading-relaxed">Practice weekly homework tasks, timed speed tests, and past papers with model answer keys.</p>
                </div>
                <div className="pt-4 mt-2 border-t border-sky-200/60 flex items-center justify-between text-xs font-black text-sky-700">
                  <span>Open Test Bank</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                </div>
              </div>

              {/* Portal 7: 150 Strategic Ideas & Master Blueprint */}
              <div
                className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-500/15 rounded-3xl p-6 flex flex-col justify-between group cursor-pointer hover:from-amber-500/20 hover:to-amber-400/10 transition border-2 border-amber-300 shadow-sm hover:shadow-md relative overflow-hidden"
                onClick={() => setIsRoadmapModalOpen(true)}
              >
                <div>
                  <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition shadow-md shadow-amber-400/30 font-black">
                    <i className="fa-solid fa-rocket"></i>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-900 font-extrabold text-[10px] uppercase mb-1 border border-amber-400/40">
                    <span>150 Strategic Features</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">150 Innovation Ideas & Blueprint</h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">Explore the complete 150-point master roadmap powering NECTA exam tech, STEM labs, low-bandwidth PWA, AI tools & Swahili localization.</p>
                </div>
                <div className="pt-4 mt-2 border-t border-amber-300/60 flex items-center justify-between text-xs font-black text-amber-900">
                  <span>Explore 150 Strategy Points</span>
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderWallet = () => (
    <div className="max-w-2xl mx-auto animate-fade-in py-12 px-4">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 text-center">
         <div className="w-24 h-24 bg-purple-600 rounded-[2rem] flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-xl shadow-purple-600/30">
            <i className="fa-solid fa-wallet"></i>
         </div>
         <h1 className="text-4xl font-extrabold text-tz-dark mb-4">Study Wallet</h1>
         <p className="text-gray-500 text-lg mb-10">Exchange your hard-earned XP (EP) for Study Credits to unlock Yun's premium features.</p>
         
         <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-100">
               <div className="text-tz-blue text-xs uppercase tracking-widest font-black mb-2">Your EP</div>
               <div className="text-3xl font-black text-tz-dark">{user.points}</div>
            </div>
            <div className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-100">
               <div className="text-purple-600 text-xs uppercase tracking-widest font-black mb-2">Credits</div>
               <div className="text-3xl font-black text-tz-dark">{currentUser?.email === 'austinreuben95@gmail.com' ? '∞' : user.credits}</div>
            </div>
         </div>

         <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-4">
               <span className="font-bold text-gray-600">Swap rate</span>
               <span className="font-black text-tz-dark">500 EP = 10 Credits</span>
            </div>
            <button 
              onClick={swapXpForCredits}
              disabled={user.points < 500}
              className="w-full bg-tz-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-2px] active:translate-y-[0] transition disabled:opacity-30 disabled:translate-y-0"
            >
              <i className="fa-solid fa-repeat"></i> Swap Points
            </button>
            {user.points < 500 && <p className="text-xs text-red-500 mt-2 font-medium">You need at least 500 EP to swap.</p>}
         </div>
         
         <button onClick={goHome} className="text-gray-400 font-bold hover:text-tz-blue transition">Back to learning</button>
      </div>
    </div>
  );

  const renderExamsDash = () => (
    <div className="max-w-5xl mx-auto animate-fade-in py-12 px-4">
       <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-tz-dark">National Past Papers</h1>
            <p className="text-gray-500 font-medium">Practice with previous PSLE, CSEE, and ACSEE examinations.</p>
          </div>
          <div className="bg-tz-yellow px-4 py-2 rounded-2xl border-2 border-yellow-500 font-bold flex items-center gap-2">
            <i className="fa-solid fa-certificate"></i> Verified by NECTA
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { level: 'PSLE', year: '2023', subjects: ['Math', 'Science', 'English'] },
            { level: 'CSEE', year: '2023', subjects: ['Physics', 'Civics', 'Bio'] },
            { level: 'ACSEE', year: '2023', subjects: ['PCM', 'PCB', 'HKL'] }
          ].map((exam, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition duration-300">
               <div className="flex items-center justify-between mb-6">
                  <div className="bg-tz-blue/10 text-tz-blue px-3 py-1 rounded-full font-black text-xs">{exam.year}</div>
                  <h3 className="text-2xl font-black text-tz-dark">{exam.level}</h3>
               </div>
               <div className="space-y-4">
                  {exam.subjects.map(s => (
                     <div key={s} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                        <span className="font-bold text-gray-700 text-sm">{s}</span>
                        <i className="fa-solid fa-download text-tz-blue text-xs border border-tz-blue/20 p-1 rounded"></i>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-6 bg-tz-dark text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition">
                  Start Practice Mode
               </button>
            </div>
          ))}
       </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-800">Top Students</h3>
        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">Global</span>
      </div>
      <div className="space-y-2">
        {leaderboardLoading ? (
            <div className="py-8 text-center text-gray-400 text-sm">Loading ranks...</div>
        ) : leaderboard.length > 0 ? (
            leaderboard.map((u, idx) => (
                <LeaderboardRow 
                  key={u.userId || idx}
                  rank={idx + 1} 
                  name={u.email ? u.email.split('@')[0] : 'Legend'} 
                  points={u.points} 
                  isUser={u.userId === currentUser?.uid}
                />
            ))
        ) : (
            <div className="py-8 text-center text-gray-400 text-sm">No rankings yet.</div>
        )}
        
        {/* If user not in top 5, show them at the bottom */}
        {!leaderboardLoading && !leaderboard.find(u => u.userId === currentUser?.uid) && (
            <>
                <div className="h-px bg-gray-100 my-4"></div>
                <LeaderboardRow 
                    rank={100} // Dummy rank
                    name="You" 
                    points={user.points} 
                    isUser={true} 
                />
            </>
        )}
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
           <div className="w-16 h-16 border-4 border-tz-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-gray-500 font-bold">Loading Education TZ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      {renderHeader()}

      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full relative">
        
        {/* QUIZ MODAL */}
        {isQuizModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
              <button 
                onClick={() => setIsQuizModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>

              {quizLoading ? (
                <div className="text-center py-12">
                   <div className="w-20 h-20 bg-tz-yellow rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center text-white text-3xl">
                     <i className="fa-solid fa-lightbulb"></i>
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 mb-2">Yun is thinking...</h3>
                   <p className="text-gray-500">Preparing a challenge for you!</p>
                </div>
              ) : currentQuiz ? (
                <div>
                   <div className="flex items-center gap-2 mb-6 text-tz-blue font-bold uppercase text-xs tracking-widest">
                     <i className="fa-solid fa-graduation-cap"></i> Practice Quiz
                   </div>
                   
                   <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                     {currentQuiz.question}
                   </h3>

                   <div className="space-y-3">
                     {currentQuiz.options.map((opt, idx) => {
                       let btnStyle = 'border-gray-100 hover:border-tz-blue hover:bg-blue-50 text-gray-800';
                       if (quizResult !== 'none') {
                         if (idx === currentQuiz.correctIndex) {
                           btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                         } else if (idx === selectedQuizOptionIndex && quizResult === 'incorrect') {
                           btnStyle = 'border-red-500 bg-red-50 text-red-900 font-bold';
                         } else {
                           btnStyle = 'border-gray-100 opacity-50 text-gray-400';
                         }
                       }

                       return (
                         <button
                           key={idx}
                           disabled={quizResult !== 'none'}
                           onClick={() => handleQuizAnswer(idx)}
                           className={`w-full p-4 rounded-2xl text-left font-semibold text-xs sm:text-sm transition-all border-2 flex items-center justify-between ${btnStyle} ${
                             quizResult === 'incorrect' && idx === selectedQuizOptionIndex ? 'shake-animation' : ''
                           }`}
                         >
                           <span>{opt}</span>
                           {quizResult !== 'none' && idx === currentQuiz.correctIndex && (
                             <i className="fa-solid fa-circle-check text-emerald-600 text-base ml-2 shrink-0"></i>
                           )}
                           {quizResult === 'incorrect' && idx === selectedQuizOptionIndex && (
                             <i className="fa-solid fa-circle-xmark text-red-600 text-base ml-2 shrink-0"></i>
                           )}
                         </button>
                       );
                     })}
                   </div>

                   {quizResult === 'correct' && (
                     <div className="mt-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-3 animate-fade-in text-left">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-circle-check text-emerald-600 text-xl"></i>
                          <span className="font-black text-sm text-emerald-900">Correct Answer! (+50 XP)</span>
                        </div>
                        <p className="text-xs text-emerald-800 font-medium leading-relaxed">{currentQuiz.explanation}</p>
                        
                        <button
                          onClick={() => {
                            setQuizShareData({
                              topicTitle: selectedTopic?.title || 'Practice Quiz',
                              score: 100
                            });
                            setIsQuizShareModalOpen(true);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                        >
                          <i className="fa-brands fa-whatsapp text-sm"></i>
                          <i className="fa-solid fa-share-nodes text-xs"></i>
                          <span>Share Quiz Score via WhatsApp / App</span>
                        </button>
                     </div>
                   )}
                   
                   {quizResult === 'incorrect' && (
                     <div className="mt-6 p-5 bg-red-50/90 rounded-2xl border-2 border-red-200 text-red-950 space-y-4 animate-fade-in text-left">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center text-lg shrink-0 shadow-md">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-red-950">Not Quite Right!</h4>
                            <p className="text-xs text-red-800 font-medium mt-0.5 leading-relaxed">
                              Don't worry! Review the lesson note to master this concept, then try again.
                            </p>
                          </div>
                        </div>

                        {currentQuiz.explanation && (
                          <div className="p-3 bg-white/80 rounded-xl border border-red-200 text-xs text-slate-800 font-medium leading-relaxed">
                            <strong className="text-red-950 font-black flex items-center gap-1 mb-1">
                              <i className="fa-solid fa-lightbulb text-amber-500"></i> Explanation & Concept Guide:
                            </strong>
                            {currentQuiz.explanation}
                          </div>
                        )}

                        {/* Action Buttons: Review Note & Try Again */}
                        <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                          <button
                            onClick={() => {
                              setIsQuizModalOpen(false);
                              if (selectedTopic && selectedSubject) {
                                setCurrentView(AppView.TOPIC_CONTENT);
                                setActiveTab('notes');
                              }
                            }}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                            title={`Deep-link to ${selectedTopic?.title || 'Topic'} Lesson Notes`}
                          >
                            <i className="fa-solid fa-book-open text-cyan-300"></i>
                            <span>Review Note 📖</span>
                          </button>

                          <button
                            onClick={() => {
                              setQuizResult('none');
                              setSelectedQuizOptionIndex(null);
                            }}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-300/50 transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                            title="Re-attempt this Quiz Question"
                          >
                            <i className="fa-solid fa-rotate-right"></i>
                            <span>Try Again 🔄</span>
                          </button>
                        </div>
                     </div>
                   )}
                </div>
              ) : (
                <div className="text-center">
                  <p>Could not generate quiz. <button onClick={() => setIsQuizModalOpen(false)} className="text-tz-blue underline">Close</button></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HOME VIEW */}
        {currentView === AppView.HOME && renderHome()}

        {/* SYLLABUS LISTING FOR LEVEL */}
        {currentView === AppView.SYLLABUS && selectedLevel && !selectedGrade && (
           <div className="animate-fade-in max-w-7xl mx-auto py-8">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-extrabold text-tz-dark flex items-center gap-3">
                    <button onClick={goHome} className="hover:text-tz-blue transition"><i className="fa-solid fa-arrow-left text-xl"></i></button>
                    {selectedLevel}
                  </h2>
                  <p className="text-gray-500 font-medium">Select your class level to see the subjects.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SYLLABUS_DATA.filter(g => g.level === selectedLevel).map((data) => (
                  <button
                    key={data.grade}
                    onClick={() => handleGradeSelect(data)}
                    className="group bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:border-tz-blue transition-all duration-300 text-left flex flex-col justify-between h-48"
                  >
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-50 text-tz-blue text-[10px] font-black rounded-full mb-4 uppercase tracking-widest">
                        Curriculum 2024
                      </span>
                      <h3 className="text-2xl font-black text-gray-800 group-hover:text-tz-blue transition-colors">
                        {data.grade}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between w-full">
                       <span className="text-sm font-bold text-gray-400">{data.subjects.length} Subjects</span>
                       <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-tz-blue group-hover:text-white transition-all">
                          <i className="fa-solid fa-arrow-right"></i>
                       </div>
                    </div>
                  </button>
                ))}
              </div>
           </div>
        )}

        {/* SYLLABUS VIEW - SUBJECTS LISTING */}
        {currentView === AppView.SYLLABUS && selectedGrade && !selectedSubject && (
           <div className="animate-fade-in space-y-6">
              {/* Header & Search Bar Bar */}
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <button onClick={goHome} className="mb-2 flex items-center text-gray-500 hover:text-indigo-600 transition font-extrabold text-xs uppercase tracking-wider">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Back to Grade Levels
                  </button>
                  <h1 className="text-3xl sm:text-4xl font-black text-tz-dark flex items-center gap-3">
                    {selectedGrade.grade} <span className="gradient-text">Subjects</span>
                  </h1>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Select a subject to explore syllabus-aligned topics, video lessons, and NECTA practice quizzes.
                  </p>
                </div>
                
                {/* Search Bar Component */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  <div className="relative group min-w-[280px] sm:min-w-[320px]">
                     <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition"></i>
                     <input 
                        type="text" 
                        placeholder="Search subjects by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50/80 border-2 border-gray-100 rounded-2xl py-3 pl-11 pr-10 outline-none focus:bg-white focus:border-indigo-500 transition w-full shadow-sm text-sm font-bold text-gray-800 placeholder-gray-400"
                     />
                     {searchQuery && (
                       <button 
                         onClick={() => setSearchQuery('')}
                         className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs transition"
                         title="Clear search"
                       >
                         <i className="fa-solid fa-xmark"></i>
                       </button>
                     )}
                  </div>
                </div>
              </div>

              {/* Stats & Quick Subject Badge Filter Chips */}
              <div className="bg-white rounded-3xl p-5 border-2 border-gray-100 shadow-sm space-y-4">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                      <i className="fa-solid fa-sliders"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 leading-tight">Filter & Sort Subjects</h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Showing <span className="font-extrabold text-indigo-600">{displayedSubjects.length}</span> of {filteredSubjects.length} subjects
                      </p>
                    </div>
                  </div>

                  {(subjectDifficultyFilter !== 'ALL' || subjectTypeFilter !== 'ALL' || searchQuery) && (
                    <button
                      onClick={() => {
                        setSubjectDifficultyFilter('ALL');
                        setSubjectTypeFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs transition flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-rotate-left text-gray-500"></i> Clear Filters
                    </button>
                  )}
                </div>

                {/* Filter Pill Group 1: Difficulty */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-gauge-high text-amber-500"></i> Filter by Difficulty:
                    </span>
                    {subjectDifficultyFilter !== 'ALL' && (
                      <span className="text-[10px] font-extrabold text-indigo-600 uppercase">
                        Active: {subjectDifficultyFilter}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSubjectDifficultyFilter('ALL')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectDifficultyFilter === 'ALL'
                          ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <i className="fa-solid fa-layer-group text-slate-400"></i> All ({filteredSubjects.length})
                    </button>

                    <button
                      onClick={() => setSubjectDifficultyFilter('EASY')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectDifficultyFilter === 'EASY'
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <i className="fa-solid fa-leaf text-emerald-500"></i> Easy ({filteredSubjects.filter(s => getSubjectDifficulty(s) === 'easy').length})
                    </button>

                    <button
                      onClick={() => setSubjectDifficultyFilter('HARD')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectDifficultyFilter === 'HARD'
                          ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <i className="fa-solid fa-fire text-amber-500"></i> Hard ({filteredSubjects.filter(s => getSubjectDifficulty(s) === 'hard').length})
                    </button>

                    <button
                      onClick={() => setSubjectDifficultyFilter('EXTREME')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectDifficultyFilter === 'EXTREME'
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600'
                          : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      <i className="fa-solid fa-bolt-lightning text-rose-500"></i> Extreme ({filteredSubjects.filter(s => getSubjectDifficulty(s) === 'extreme').length})
                    </button>
                  </div>
                </div>

                {/* Filter Pill Group 2: Type / Focus */}
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-shapes text-indigo-500"></i> Filter by Subject Type & Focus:
                    </span>
                    {subjectTypeFilter !== 'ALL' && (
                      <span className="text-[10px] font-extrabold text-indigo-600 uppercase">
                        Active: {subjectTypeFilter}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSubjectTypeFilter('ALL')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectTypeFilter === 'ALL'
                          ? 'bg-indigo-900 text-white shadow-sm ring-2 ring-indigo-900'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <i className="fa-solid fa-border-all text-indigo-300"></i> All Types
                    </button>

                    <button
                      onClick={() => setSubjectTypeFilter('EXAM')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectTypeFilter === 'EXAM'
                          ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-500'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <i className="fa-solid fa-bullseye text-amber-600"></i> Exam-Focused ({filteredSubjects.filter(s => s.isExamFocused).length})
                    </button>

                    <button
                      onClick={() => setSubjectTypeFilter('VIDEO')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectTypeFilter === 'VIDEO'
                          ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-600'
                          : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      <i className="fa-solid fa-circle-play text-red-500"></i> Video-Rich ({filteredSubjects.filter(s => s.hasVideo).length})
                    </button>

                    <button
                      onClick={() => setSubjectTypeFilter('NEW')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectTypeFilter === 'NEW'
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <i className="fa-solid fa-sparkles text-emerald-500"></i> 2024 Syllabus ({filteredSubjects.filter(s => s.isNewSyllabus).length})
                    </button>

                    <button
                      onClick={() => setSubjectTypeFilter('STEM')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectTypeFilter === 'STEM'
                          ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-600'
                          : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                      }`}
                    >
                      <i className="fa-solid fa-flask-vial text-sky-500"></i> STEM & Science ({filteredSubjects.filter(s => getSubjectCategory(s) === 'stem').length})
                    </button>

                    <button
                      onClick={() => setSubjectTypeFilter('ARTS')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 ${
                        subjectTypeFilter === 'ARTS'
                          ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-600'
                          : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      <i className="fa-solid fa-book-open text-purple-500"></i> Arts & Humanities ({filteredSubjects.filter(s => getSubjectCategory(s) === 'arts').length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Subject Cards Grid */}
              {displayedSubjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedSubjects.map((subject) => {
                    const isExpanded = expandedSubjectId === subject.id;
                    return (
                      <div 
                        key={subject.id}
                        id={`subject-card-${subject.id}`}
                        onClick={() => setSelectedSubject(subject)}
                        className={`group glass-card-vibrant rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/15 border-2 ${
                          isExpanded ? 'border-indigo-500 bg-indigo-50/20' : 'border-gray-100 hover:border-indigo-500'
                        } cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden flex flex-col justify-between min-h-[16rem]`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <SubjectIcon icon={subject.icon} />
                            
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedSubjectId(isExpanded ? null : subject.id);
                                }}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition flex items-center gap-1 border ${
                                  isExpanded
                                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
                                }`}
                                title="Expand summary & resources preview"
                              >
                                <span>{isExpanded ? 'Hide' : 'Quick Peek'}</span>
                                <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[9px]`}></i>
                              </button>

                              <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                                {subject.topics.length} Topics
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                              {subject.name}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                              Interactive study notes, quizzes & video tutorials
                            </p>
                          </div>

                          {/* Subject Visual Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <SubjectDifficultyBadge difficulty={getSubjectDifficulty(subject)} />
                            {subject.isExamFocused && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black text-[10px] bg-amber-100/90 text-amber-900 border border-amber-300">
                                <i className="fa-solid fa-bullseye text-amber-700"></i> Exam Focused
                              </span>
                            )}
                            {subject.hasVideo && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black text-[10px] bg-red-100/90 text-red-800 border border-red-300">
                                <i className="fa-solid fa-circle-play text-red-600"></i> Video Available
                              </span>
                            )}
                            {subject.isNewSyllabus && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-black text-[10px] bg-emerald-100/90 text-emerald-800 border border-emerald-300">
                                <i className="fa-solid fa-sparkles text-emerald-600"></i> New Syllabus
                              </span>
                            )}
                          </div>

                          {/* Expandable Preview Section */}
                          {isExpanded && (
                            <div 
                              onClick={(e) => e.stopPropagation()} 
                              className="mt-3 pt-3 border-t border-indigo-100 space-y-3 animate-fade-in text-left bg-white/90 p-3.5 rounded-2xl border border-indigo-100 shadow-sm"
                            >
                              {/* Topic Summary List */}
                              <div>
                                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-1.5 flex items-center gap-1">
                                  <i className="fa-solid fa-list-check"></i> Key Syllabus Topics
                                </span>
                                <div className="space-y-1.5">
                                  {subject.topics.slice(0, 3).map((tp, idx) => {
                                    const isTpDone = user.completedTopics.includes(tp.id);
                                    const tpDiff = getTopicDifficulty(tp, idx);
                                    return (
                                      <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-gray-100 gap-2">
                                        <span className="font-bold text-gray-800 line-clamp-1 flex-1">{tp.title}</span>
                                        <div className="flex items-center gap-1 shrink-0">
                                          <DifficultyBadge difficulty={tpDiff} compact />
                                          <TopicCompletedBadge isCompleted={isTpDone} compact />
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {subject.topics.length > 3 && (
                                    <p className="text-[10px] text-gray-500 font-bold italic text-center pt-0.5">
                                      + {subject.topics.length - 3} more topics in full syllabus
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Teacher Resources Summary */}
                              <div className="pt-2 border-t border-gray-100">
                                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1.5 flex items-center gap-1">
                                  <i className="fa-solid fa-chalkboard-user"></i> Included Resources
                                </span>
                                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-extrabold text-gray-700">
                                  <span className="bg-amber-50 text-amber-900 p-1.5 rounded-lg border border-amber-200 flex items-center gap-1">
                                    <i className="fa-solid fa-file-lines text-amber-600"></i> Lesson Plans
                                  </span>
                                  <span className="bg-emerald-50 text-emerald-900 p-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                                    <i className="fa-solid fa-clipboard-list text-emerald-600"></i> Scheme of Work
                                  </span>
                                  <span className="bg-blue-50 text-blue-900 p-1.5 rounded-lg border border-blue-200 flex items-center gap-1">
                                    <i className="fa-solid fa-circle-question text-blue-600"></i> NECTA Quizzes
                                  </span>
                                  <span className="bg-purple-50 text-purple-900 p-1.5 rounded-lg border border-purple-200 flex items-center gap-1">
                                    <i className="fa-solid fa-pen-ruler text-purple-600"></i> Solved Papers
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => setSelectedSubject(subject)}
                                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 mt-2 active:scale-95"
                              >
                                <span>Open Full Syllabus Topics</span>
                                <i className="fa-solid fa-arrow-right text-xs"></i>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-indigo-600 font-extrabold text-xs group-hover:gap-2 transition-all">
                          <span>Explore Syllabus Topics</span>
                          <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Search Results Feedback */
                <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-200 text-center space-y-4 max-w-lg mx-auto my-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">No Subjects Match "{searchQuery}"</h3>
                    <p className="text-xs text-gray-500 mt-1">Try checking for spelling errors or search for another subject name like Mathematics or Physics.</p>
                  </div>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-200 hover:bg-indigo-700 transition inline-flex items-center gap-2"
                  >
                    <i className="fa-solid fa-xmark"></i> Clear Search Filter
                  </button>
                </div>
              )}
           </div>
        )}

        {/* TOPIC LIST (Inside Syllabus View essentially) */}
        {currentView === AppView.SYLLABUS && selectedGrade && selectedSubject && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => setSelectedSubject(null)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition">
                    <i className="fa-solid fa-arrow-left"></i>
                 </button>
                 <div>
                    <h1 className="text-2xl font-bold text-gray-800">{selectedSubject.name}</h1>
                    <p className="text-gray-500">{selectedGrade.grade}</p>
                 </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 bg-blue-50/50 border-b border-gray-100">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl text-tz-blue shadow-sm">
                           <i className={`fa-solid ${selectedSubject.icon}`}></i>
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-gray-800">Learning Path</h2>
                           <p className="text-gray-500">Complete topics to earn points</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {filteredTopics.map((topic, index) => {
                      const isCompleted = user.completedTopics.includes(topic.id);
                      const diffLevel = getTopicDifficulty(topic, index);
                      return (
                        <div 
                          key={topic.id} 
                          className={`p-6 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                            isCompleted ? 'bg-emerald-50/40 hover:bg-emerald-50/70 border-l-4 border-l-emerald-500' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex gap-4 items-start">
                             <div className="flex flex-col items-center pt-0.5">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 ${
                                  isCompleted ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-gray-400 border-gray-200'
                                }`}>
                                  {isCompleted ? <i className="fa-solid fa-check text-white"></i> : index + 1}
                                </div>
                                {index !== selectedSubject.topics.length - 1 && <div className="w-0.5 h-full bg-gray-100 my-1"></div>}
                             </div>
                             <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-extrabold text-lg text-gray-900 leading-tight">{topic.title}</h4>
                                  <TopicCompletedBadge isCompleted={isCompleted} />
                                  <DifficultyBadge difficulty={diffLevel} />
                                </div>
                                <p className="text-gray-600 text-sm max-w-xl font-medium leading-relaxed">{topic.description}</p>
                             </div>
                          </div>
                          
                          <button 
                              id={`start-learning-${topic.id}`}
                              onClick={() => enterTopic(topic)}
                              className={`px-6 py-3 rounded-xl font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-2 shrink-0 ${
                                isCompleted 
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' 
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                              }`}
                          >
                              <span>{isCompleted ? 'Review Topic' : 'Start Learning'}</span>
                              <i className="fa-solid fa-arrow-right text-xs"></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>
              </div>
            </div>
        )}

    {currentView === AppView.PREDICTOR && <SchoolAdmissionPredictor />}
    {currentView === AppView.ASSIGNMENTS_TESTS && <AssignmentsAndTestsBank onScoreCompleted={(xp) => {
      setUser(prev => ({ ...prev, points: prev.points + xp }));
    }} />}
    {currentView === AppView.WALLET && renderWallet()}
    {currentView === AppView.BADGES && (
      <Badges
        user={user}
        onUpdateUserProgress={setUser}
        onNavigateView={(v) => setCurrentView(v as AppView)}
      />
    )}
    {currentView === AppView.GRADE_CHECKER && (
      <GradeChecker
        onNavigateToExams={() => setCurrentView(AppView.EXAMS)}
        onOpenYunAI={(prompt) => {
          setYunContext(prompt);
          setCurrentView(AppView.CHAT);
        }}
      />
    )}
    {currentView === AppView.ROADMAP && (
      <StrategicRoadmap
        onBackHome={goHome}
        onLaunchFeature={handleLaunchRoadmapFeature}
      />
    )}
    {currentView === AppView.EXAMS && <ExamVault />}
    {currentView === AppView.PLANNER && <StudyPlanner />}
    {currentView === AppView.DICTIONARY && <Dictionary />}
    {currentView === AppView.NOTES && <NotesHub />}
    {currentView === AppView.TEACHERS && <TeachersHub />}
    {currentView === AppView.ALEVEL_GUIDE && <ALevelGuide />}
    {currentView === AppView.CALCULATOR && <Calculator goHome={goHome} />}
    {currentView === AppView.TOPIC_CONTENT && renderTopicContent()}
    {currentView === AppView.PARENTS && renderParentDashboard()}
    {currentView === AppView.ADMIN && <AdminPanel onBack={goHome} />}

        {currentView === AppView.CHAT && (
          <div className="animate-fade-in flex flex-col items-center justify-center h-full">
             <button 
              onClick={goHome} // Simplified back
              className="self-start mb-4 flex items-center text-gray-500 hover:text-tz-blue transition"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Exit Chat
            </button>
            <div className="w-full">
                <ChatInterface 
                    initialContext={yunContext} 
                    onClose={() => goHome()}
                />
            </div>
          </div>
        )}

        {/* Celebratory First Session Toast Notification */}
        {celebratoryQuickStudyToast && (
          <div className="fixed top-20 right-6 z-50 max-w-sm animate-bounce-short shadow-2xl">
            <div className="p-4 rounded-2xl border-2 border-amber-400 bg-slate-950/95 text-white flex items-start gap-3.5 backdrop-blur-md shadow-amber-400/25">
              <div className="w-10 h-10 rounded-xl shrink-0 bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl shadow-inner border border-amber-400/40">
                <i className="fa-solid fa-trophy text-amber-300"></i>
              </div>
              <div className="flex-1 space-y-1 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <i className="fa-solid fa-sun text-amber-400"></i> New Day Goal Achieved!
                  </h4>
                  <button
                    onClick={() => setCelebratoryQuickStudyToast(null)}
                    className="text-slate-400 hover:text-white text-xs p-1"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                  {celebratoryQuickStudyToast}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Floating Offline / Network Toast Notification */}
        {showOfflineToast && !offlineToastDismissed && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in shadow-2xl">
            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 backdrop-blur-md ${
              !isOnline
                ? 'bg-slate-900/95 border-amber-500/80 text-white'
                : 'bg-emerald-950/95 border-emerald-500/80 text-white'
            }`}>
              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg ${
                !isOnline ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                <i className={`fa-solid ${!isOnline ? 'fa-wifi-slash' : 'fa-wifi'}`}></i>
              </div>

              <div className="flex-1 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm">
                    {!isOnline ? 'Offline Mode Active' : 'Internet Restored'}
                  </h4>
                  <button
                    onClick={() => setOfflineToastDismissed(true)}
                    className="text-gray-400 hover:text-white text-xs p-1"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {!isOnline
                    ? 'Offline Mode is active—some features may be limited. Your saved study notes, vocabulary list, and core syllabus remain accessible!'
                    : 'Back online! Syncing latest syllabus data and cloud progress.'}
                </p>

                {!isOnline && (
                  <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <i className="fa-solid fa-check text-[9px]"></i> Saved Notes
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <i className="fa-solid fa-check text-[9px]"></i> Swahili Dictionary
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <i className="fa-solid fa-check text-[9px]"></i> Core Syllabus
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STUDENT PROFILE MODAL */}
        <StudentProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          userName={currentUser?.email || 'Student'}
          onOpenWallet={() => setCurrentView(AppView.WALLET)}
          onOpenPlanner={() => setCurrentView(AppView.PLANNER)}
          onOpenBadges={() => setCurrentView(AppView.BADGES)}
        />

        {/* PARENT DASHBOARD SHARE PROGRESS MODAL */}
        <ShareProgressModal
          isOpen={isParentShareModalOpen}
          onClose={() => setIsParentShareModalOpen(false)}
          studentName={currentUser?.email ? currentUser.email.split('@')[0] : 'Student'}
          points={user.points}
          streak={user.streak}
          completedTopicsCount={user.completedTopics.length}
          customTitle="Parent Report Sharing"
        />

        {/* QUIZ SCORE SHARE PROGRESS MODAL */}
        {quizShareData && (
          <ShareProgressModal
            isOpen={isQuizShareModalOpen}
            onClose={() => setIsQuizShareModalOpen(false)}
            studentName={currentUser?.email ? currentUser.email.split('@')[0] : 'Student'}
            points={user.points}
            streak={user.streak}
            completedTopicsCount={user.completedTopics.length}
            quizResult={quizShareData}
            customTitle="Share Quiz Result"
          />
        )}

        {/* ROADMAP 150 IDEAS MASTER MODAL */}
        <RoadmapModal
          isOpen={isRoadmapModalOpen}
          onClose={() => setIsRoadmapModalOpen(false)}
          onLaunchFeature={handleLaunchRoadmapFeature}
        />

      </main>
    </div>
  );
};

export default App;