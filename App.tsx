import React, { useState, useEffect } from 'react';
import { GradeLevel, AppView, GradeSyllabus, Subject, Topic, UserProgress, QuizQuestion, EducationLevel } from './types';
import { SYLLABUS_DATA } from './constants';
import ChatInterface from './components/ChatInterface';
import { generateQuizQuestion } from './services/geminiService';
import { 
  auth, 
  loginWithGoogle, 
  logout, 
  getUserProgress, 
  saveUserProgress,
  checkIsAdmin,
  updateUserCredits,
  searchUserByEmail
} from './services/firebaseService';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Sub-Components ---

const SubjectIcon = ({ icon }: { icon: string }) => (
  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-tz-blue text-xl mb-3 group-hover:bg-tz-blue group-hover:text-white transition-colors duration-300 border-2 border-gray-100">
    <i className={`fa-solid ${icon}`}></i>
  </div>
);

const ProgressBar = ({ progress, color = "bg-tz-green" }: { progress: number, color?: string }) => (
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
  </div>
);

const LeaderboardRow = ({ rank, name, points, isUser }: { rank: number, name: string, points: number, isUser?: boolean }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl mb-2 ${isUser ? 'bg-blue-50 border-2 border-tz-blue' : 'bg-white border border-gray-100'}`}>
    <div className="flex items-center gap-4">
      <span className={`font-bold w-6 text-center ${rank <= 3 ? 'text-tz-yellow text-xl' : 'text-gray-500'}`}>
        {rank === 1 ? <i className="fa-solid fa-crown"></i> : rank}
      </span>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isUser ? 'bg-tz-blue text-white' : 'bg-gray-200 text-gray-600'}`}>
          {name.charAt(0)}
        </div>
        <span className={`font-medium ${isUser ? 'text-tz-blue' : 'text-gray-700'}`}>{name}</span>
      </div>
    </div>
    <span className="font-bold text-gray-600">{points} XP</span>
  </div>
);

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

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newCredits, setNewCredits] = useState(0);
  const [newPoints, setNewPoints] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const u = await searchUserByEmail(searchEmail);
      if (u) {
        setFoundUser(u);
        setNewCredits(u.credits || 0);
        setNewPoints(u.points || 0);
      } else {
        setFoundUser(null);
        setMessage('User not found.');
      }
    } catch (err) {
      setMessage('Error searching user.');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!foundUser || !foundUser.userId) return;
    setLoading(true);
    try {
      await updateUserCredits(foundUser.userId, newCredits, newPoints);
      setMessage('User updated successfully!');
      setFoundUser(prev => prev ? { ...prev, credits: newCredits, points: newPoints } : null);
    } catch (err) {
      setMessage('Error updating user.');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100">
         <div className="flex items-center gap-3 mb-8">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl">
              <i className="fa-solid fa-user-gear"></i>
            </div>
            <h1 className="text-3xl font-extrabold text-tz-dark">Admin Panel</h1>
         </div>

         <form onSubmit={handleSearch} className="mb-10">
            <label className="block text-sm font-bold text-gray-600 mb-2">Search User by Email</label>
            <div className="flex gap-2">
               <input 
                  type="email" 
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="flex-grow bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-tz-blue outline-none transition"
                  required
               />
               <button 
                type="submit"
                disabled={loading}
                className="bg-tz-dark text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-50"
               >
                 {loading ? 'Searching...' : 'Search'}
               </button>
            </div>
         </form>

         {message && (
           <div className={`p-4 rounded-xl mb-6 font-bold text-center ${message.includes('Error') || message.includes('not found') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-tz-green'}`}>
              {message}
           </div>
         )}

         {foundUser && (
           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="font-bold text-lg mb-4">User Details</h3>
                    <div className="space-y-2">
                       <p className="text-sm text-gray-500">UID: <span className="text-tz-dark font-mono bg-white px-2 rounded">{foundUser.userId}</span></p>
                       <p className="text-sm text-gray-500">Email: <span className="text-tz-dark font-medium">{searchEmail}</span></p>
                       <p className="text-sm text-gray-500">Current Level: <span className="text-tz-dark font-medium">{foundUser.level}</span></p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Set Credits</label>
                      <input 
                        type="number" 
                        value={newCredits}
                        onChange={(e) => setNewCredits(Number(e.target.value))}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-tz-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-2">Set Points/EP</label>
                      <input 
                        type="number" 
                        value={newPoints}
                        onChange={(e) => setNewPoints(Number(e.target.value))}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-tz-blue"
                      />
                    </div>
                    <button 
                      onClick={handleUpdate}
                      disabled={loading}
                      className="w-full bg-tz-blue text-white py-3 rounded-xl font-bold shadow-lg shadow-tz-blue/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Save Changes'}
                    </button>
                 </div>
              </div>
           </div>
         )}
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
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<'none' | 'correct' | 'incorrect'>('none');

  // Content Tab State
  const [activeTab, setActiveTab] = useState<'notes' | 'video' | 'exams' | 'language'>('notes');

  // Parents State
  const [parentPin, setParentPin] = useState('');
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);

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

  const enterTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setYunContext(`Topic: ${topic.title}. ${topic.description}`);
    setCurrentView(AppView.TOPIC_CONTENT);
  };

  const startPracticeQuiz = async () => {
    if (!selectedGrade || !selectedSubject || !selectedTopic) return;
    
    setIsQuizModalOpen(true);
    setQuizLoading(true);
    setQuizResult('none');
    
    const q = await generateQuizQuestion(selectedGrade.grade, selectedSubject.name, selectedTopic.title);
    setCurrentQuiz(q);
    setQuizLoading(false);
  };

  const handleQuizAnswer = (index: number) => {
    if (!currentQuiz || !selectedTopic) return;
    
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
      }, 2000);
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

  // --- Render Sections ---

  const renderHeader = () => (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={goHome}>
          <div className="w-10 h-10 bg-tz-blue rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-tz-blue/30">
            E
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl leading-none text-tz-dark tracking-tight">Education<span className="text-tz-blue">TZ</span></span>
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Global Learning</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {currentUser && (
            <div className="hidden lg:flex items-center gap-4">
              <button 
                onClick={() => setCurrentView(AppView.EXAMS)}
                className={`px-3 py-1.5 rounded-full font-bold text-sm transition ${currentView === AppView.EXAMS ? 'bg-tz-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <i className="fa-solid fa-file-invoice mr-2"></i> Exams
              </button>
              <button 
                onClick={() => setCurrentView(AppView.WALLET)}
                className={`px-3 py-1.5 rounded-full font-bold text-sm transition ${currentView === AppView.WALLET ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <i className="fa-solid fa-wallet mr-2"></i> Wallet
              </button>
              <button 
                onClick={() => setCurrentView(AppView.CALCULATOR)}
                className={`px-3 py-1.5 rounded-full font-bold text-sm transition ${currentView === AppView.CALCULATOR ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <i className="fa-solid fa-calculator mr-2"></i> Calculator
              </button>
            </div>
          )}
          {/* Stats */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                 {user.streak} <i className="fa-solid fa-fire"></i>
              </div>
              <div 
                onClick={() => setCurrentView(AppView.WALLET)}
                className="cursor-pointer flex items-center gap-2 text-tz-blue font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition"
              >
                {user.points} EP
              </div>
            </div>
          )}

          {currentUser && (
            <button 
              onClick={() => setCurrentView(AppView.PARENTS)}
              className="text-gray-400 hover:text-gray-600 transition"
              title="Parent Dashboard"
            >
              <i className="fa-solid fa-user-shield text-lg"></i>
            </button>
          )}

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

          {currentUser && (
            <button 
              onClick={startChat}
              className="bg-tz-yellow text-tz-dark px-4 py-2 rounded-xl font-bold shadow-[0_4px_0_rgb(217,119,6)] hover:shadow-[0_2px_0_rgb(217,119,6)] hover:translate-y-[2px] transition-all flex items-center gap-2 border-2 border-yellow-500"
            >
              <i className="fa-solid fa-robot"></i> <span className="hidden sm:inline">Ask Yun</span>
            </button>
          )}

          {currentUser ? (
              <button 
                onClick={logout}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
          ) : (
            <div className="flex flex-col items-end">
              <button 
                id="header-login-btn"
                onClick={handleLogin}
                className="bg-tz-blue text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition flex items-center gap-2"
              >
                <i className="fa-solid fa-user"></i> Login
              </button>
              {loginError && (
                <span className="text-[10px] text-red-500 font-bold mt-1 max-w-[150px] text-right">
                  {loginError}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );

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
                 <div className="mt-6 flex gap-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm"><i className="fa-solid fa-clock mr-1"></i> 20 mins</span>
                    {isCompleted ? (
                         <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold flex items-center"><i className="fa-solid fa-check mr-1"></i> Completed</span>
                    ) : (
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm"><i className="fa-solid fa-star mr-1"></i> +50 XP</span>
                    )}
                 </div>
               </div>
               <i className={`fa-solid ${selectedSubject.icon} absolute -right-6 -bottom-6 text-9xl text-white/10 rotate-12`}></i>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'notes', label: 'Lesson Notes', icon: 'fa-book-open' },
                { id: 'video', label: 'Video Class', icon: 'fa-play-circle' },
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
              {activeTab === 'notes' && (
                <div className="prose lg:prose-xl text-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-tz-blue">Key Concepts</h3>
                  <p>Here is where the detailed lesson content for <strong>{selectedTopic.title}</strong> would go. In a real app, this would be fetched from a database or generated by Yun.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Understanding the core principles of {selectedTopic.title}.</li>
                    <li>Real-world examples in the Tanzanian context.</li>
                    <li>Step-by-step problem solving.</li>
                  </ul>
                  <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-4">
                    <div className="w-12 h-12 bg-tz-yellow rounded-full flex items-center justify-center text-white font-bold shrink-0">Y</div>
                    <div>
                      <h4 className="font-bold text-gray-800">Yun says:</h4>
                      <p className="text-sm">Don't forget to take notes! Writing things down helps you remember better.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'video' && (
                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                   {selectedTopic.videoUrl ? (
                      <div className="w-full aspect-video bg-tz-dark rounded-2xl overflow-hidden shadow-2xl mb-6">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={selectedTopic.videoUrl}
                          title={`YouTube video player - ${selectedTopic.title}`}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                        ></iframe>
                      </div>
                   ) : (
                      <div className="w-full aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center mb-6 relative group cursor-pointer">
                        <i className="fa-brands fa-youtube text-7xl text-red-500 group-hover:scale-110 transition-transform mb-4"></i>
                        <p className="text-gray-400 font-bold">Video Lesson Coming Soon</p>
                        <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      </div>
                   )}
                   <h3 className="font-extrabold text-xl text-tz-dark">Watch: {selectedTopic.title}</h3>
                   <p className="text-gray-500 font-medium max-w-lg mx-auto mt-2">
                     A comprehensive video lesson perfectly aligned with the {selectedGrade?.grade} syllabus for {selectedSubject.name}.
                   </p>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-full mb-4">
                     <h3 className="font-bold text-lg text-tz-blue">Vocabulary Builder</h3>
                     <p className="text-gray-500">Learn key terms in English and Kiswahili</p>
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="perspective-1000 h-32 group cursor-pointer">
                      <div className="relative w-full h-full text-center transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                        <div className="absolute inset-0 w-full h-full bg-blue-50 border-2 border-tz-blue/20 rounded-xl flex items-center justify-center backface-hidden shadow-sm">
                           <span className="font-bold text-lg text-gray-700">Concept {i} (English)</span>
                        </div>
                        <div className="absolute inset-0 w-full h-full bg-tz-blue text-white rounded-xl flex items-center justify-center backface-hidden rotate-y-180 shadow-md">
                           <span className="font-bold text-lg">Concept {i} (Kiswahili)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-3xl">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-tz-dark">Parent Dashboard</h1>
            <p className="text-gray-500">Monitor your child's progress</p>
          </div>
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

            <div>
              <h3 className="font-bold text-lg mb-4">Weekly Activity</h3>
              <div className="h-40 flex items-end justify-between gap-2 px-4">
                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                   <div key={i} className="w-full bg-gray-100 rounded-t-lg relative group">
                      <div className="absolute bottom-0 w-full bg-tz-blue rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }}></div>
                      <div className="absolute -bottom-6 w-full text-center text-xs text-gray-400">
                        {['M','T','W','T','F','S','S'][i]}
                      </div>
                   </div>
                ))}
              </div>
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
    <div className="animate-fade-in space-y-12 py-8">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
         <h1 className="text-4xl md:text-6xl font-extrabold text-tz-dark tracking-tight leading-tight">
           Your AI Classroom for <span className="text-tz-blue">Every Stage</span>
         </h1>
         <p className="text-gray-500 text-lg md:text-xl font-medium">
           Choose your level to access tailored textbooks, interactive quizzes, and your AI study buddy, Yun.
         </p>
      </div>

      {/* Level Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { type: EducationLevel.PRIMARY, icon: 'fa-child', color: 'bg-green-500', desc: 'Standard 1 - 7' },
              { type: EducationLevel.SECONDARY, icon: 'fa-book-open', color: 'bg-tz-blue', desc: 'Form 1 - 4' },
              { type: EducationLevel.HIGH_SCHOOL, icon: 'fa-microscope', color: 'bg-purple-600', desc: 'Advanced Level' }
            ].map((level) => (
              <button 
                key={level.type}
                id={`level-select-${level.type.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleLevelSelect(level.type)}
                className="group bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-50 hover:border-tz-blue transition-all duration-300 text-left"
              >
                  <div className={`w-14 h-14 ${level.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-${level.color}/20 group-hover:scale-110 transition`}>
                    <i className={`fa-solid ${level.icon}`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-tz-dark mb-2">{level.type}</h3>
                  <p className="text-gray-500 font-medium">{level.desc}</p>
                  <div className="mt-6 flex items-center text-tz-blue font-bold gap-2 group-hover:gap-4 transition-all">
                    Start Learning <i className="fa-solid fa-arrow-right"></i>
                  </div>
              </button>
            ))}
         </div>
         
         <div className="lg:col-span-1">
            {renderLeaderboard()}
         </div>
      </div>

      {/* Featured Stats */}
      <div className="bg-tz-dark rounded-[3rem] p-12 text-white max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
         <div>
            <h2 className="text-3xl font-bold mb-2">Join the Community</h2>
            <p className="text-gray-400">Track your progress, earn badges, and compete with friends across Tanzania.</p>
         </div>
         <div className="flex gap-8">
            <div className="text-center">
               <div className="text-4xl font-black text-tz-yellow">50k+</div>
               <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Students</div>
            </div>
            <div className="text-center">
               <div className="text-4xl font-black text-tz-blue">120+</div>
               <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Exams</div>
            </div>
         </div>
      </div>

      {/* Quick Tools */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         <div className="bg-blue-50 rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition border border-blue-100" onClick={() => setCurrentView(AppView.CALCULATOR)}>
            <div>
               <h4 className="text-2xl font-black text-tz-dark mb-1">Average & Sum</h4>
               <p className="text-gray-500 font-medium">Quickly calculate your grade averages.</p>
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-tz-blue text-2xl shadow-sm group-hover:scale-110 transition">
               <i className="fa-solid fa-calculator"></i>
            </div>
         </div>
         <div className="bg-orange-50 rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-orange-100 transition border border-orange-100" onClick={() => setCurrentView(AppView.EXAMS)}>
            <div>
               <h4 className="text-2xl font-black text-tz-dark mb-1">National Exams</h4>
               <p className="text-gray-500 font-medium">Browse the latest past papers.</p>
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 text-2xl shadow-sm group-hover:scale-110 transition">
               <i className="fa-solid fa-file-contract"></i>
            </div>
         </div>
      </div>
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
         {renderHeader()}
         <main className="flex-grow flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100">
               <div className="w-20 h-20 bg-tz-blue rounded-3xl flex items-center justify-center text-white text-4xl shadow-lg mx-auto mb-6">
                 E
               </div>
               <h1 className="text-3xl font-extrabold text-tz-dark mb-4">Master Your Studies</h1>
               <p className="text-gray-500 mb-8">Join thousands of Tanzanian students learning with Yun, our AI primary school companion.</p>
               
               <button 
                id="login-btn-main"
                onClick={handleLogin}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm mb-4"
               >
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                 Continue with Google
               </button>
               
               <p className="text-xs text-gray-400">By logging in, you agree to our terms of service.</p>
            </div>
         </main>
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
                     {currentQuiz.options.map((opt, idx) => (
                       <button
                         key={idx}
                         disabled={quizResult !== 'none'}
                         onClick={() => handleQuizAnswer(idx)}
                         className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2 ${
                            quizResult === 'none' 
                              ? 'border-gray-100 hover:border-tz-blue hover:bg-blue-50'
                              : idx === currentQuiz.correctIndex 
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : quizResult === 'incorrect' && idx !== currentQuiz.correctIndex // Simple logic: highlight correct, dim others? Actually let's just highlight clicked red if wrong
                                  ? 'border-gray-100 opacity-50'
                                  : 'border-gray-100'
                         } ${quizResult === 'incorrect' && 'shake-animation'}`}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>

                   {quizResult === 'correct' && (
                     <div className="mt-6 p-4 bg-green-100 rounded-xl text-green-800 flex items-center gap-3 animate-bounce-short">
                        <i className="fa-solid fa-check-circle text-xl"></i>
                        <div>
                          <p className="font-bold">Correct! +50 XP</p>
                          <p className="text-sm">{currentQuiz.explanation}</p>
                        </div>
                     </div>
                   )}
                   
                   {quizResult === 'incorrect' && (
                     <div className="mt-6 p-4 bg-red-50 rounded-xl text-red-800 text-center">
                        <p className="font-bold">Not quite right.</p>
                        <button onClick={() => setIsQuizModalOpen(false)} className="mt-2 text-sm underline">Review topic and try again</button>
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

        {/* SYLLABUS VIEW */}
        {currentView === AppView.SYLLABUS && selectedGrade && !selectedSubject && (
           <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <button onClick={goHome} className="mb-2 flex items-center text-gray-500 hover:text-tz-blue transition font-bold text-sm">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Back to Home
                  </button>
                  <h1 className="text-4xl font-extrabold text-tz-dark">{selectedGrade.grade} Subjects</h1>
                </div>
                
                <div className="relative group">
                   <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-tz-blue transition"></i>
                   <input 
                      type="text" 
                      placeholder="Search subjects..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-tz-blue transition w-full md:w-80 shadow-sm font-bold"
                   />
                </div>
              </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedGrade.subjects.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((subject) => (
          <div 
            key={subject.id}
            id={`subject-card-${subject.id}`}
            onClick={() => setSelectedSubject(subject)}
            className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg border border-gray-100 cursor-pointer transition-all hover:-translate-y-1"
          >
                    <SubjectIcon icon={subject.icon} />
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-500">{subject.topics.length} Topics</p>
                    <div className="mt-4 flex items-center text-tz-blue font-bold text-sm">
                       Start Learning <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                ))}
              </div>
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
                    {selectedSubject.topics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())).map((topic, index) => (
                      <div key={topic.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                          <div className="flex gap-4">
                             <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${user.completedTopics.includes(topic.id) ? 'bg-tz-green text-white border-tz-green' : 'bg-white text-gray-400 border-gray-200'}`}>
                                  {user.completedTopics.includes(topic.id) ? <i className="fa-solid fa-check"></i> : index + 1}
                                </div>
                                {index !== selectedSubject.topics.length - 1 && <div className="w-0.5 h-full bg-gray-100 my-1"></div>}
                             </div>
                             <div>
                                <h4 className="font-bold text-lg text-gray-800 mb-1">{topic.title}</h4>
                                <p className="text-gray-600 text-sm max-w-xl">{topic.description}</p>
                             </div>
                          </div>
                          
                          <button 
                              id={`start-learning-${topic.id}`}
                              onClick={() => enterTopic(topic)}
                              className="px-6 py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-xl font-bold hover:border-tz-blue hover:text-tz-blue transition shadow-[0_2px_0_rgb(229,231,235)] active:shadow-none active:translate-y-[2px]"
                          >
                              Start Learning
                          </button>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
        )}

    {currentView === AppView.WALLET && renderWallet()}
    {currentView === AppView.EXAMS && renderExamsDash()}
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

      </main>
    </div>
  );
};

export default App;