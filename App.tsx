import React, { useState, useEffect } from 'react';
import { GradeLevel, AppView, GradeSyllabus, Subject, Topic, UserProgress, QuizQuestion } from './types';
import { SYLLABUS_DATA } from './constants';
import ChatInterface from './components/ChatInterface';
import { generateQuizQuestion } from './services/geminiService';

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

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedGrade, setSelectedGrade] = useState<GradeSyllabus | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [yunContext, setYunContext] = useState<string>('');
  
  // User State (Mocked persistence)
  const [user, setUser] = useState<UserProgress>({
    points: 1250,
    streak: 5,
    completedTopics: [],
    level: 3
  });

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

  const handleGradeSelect = (grade: GradeSyllabus) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setCurrentView(AppView.SYLLABUS);
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
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Learn & Grow</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
              <i className="fa-solid fa-fire"></i> {user.streak}
            </div>
            <div className="flex items-center gap-2 text-tz-blue font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <i className="fa-solid fa-gem"></i> {user.points} EP
            </div>
          </div>

          <button 
            onClick={() => setCurrentView(AppView.PARENTS)}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Parent Dashboard"
          >
            <i className="fa-solid fa-user-shield text-lg"></i>
          </button>

          <button 
            onClick={startChat}
            className="bg-tz-yellow text-tz-dark px-4 py-2 rounded-xl font-bold shadow-[0_4px_0_rgb(217,119,6)] hover:shadow-[0_2px_0_rgb(217,119,6)] hover:translate-y-[2px] transition-all flex items-center gap-2 border-2 border-yellow-500"
          >
            <i className="fa-solid fa-robot"></i> <span className="hidden sm:inline">Ask Yun</span>
          </button>
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
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                   <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center mb-4 relative group cursor-pointer">
                      <i className="fa-brands fa-youtube text-6xl text-red-500 group-hover:scale-110 transition-transform"></i>
                      <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                   </div>
                   <h3 className="font-bold text-lg">Watch: Introduction to {selectedTopic.title}</h3>
                   <p className="text-gray-500">Video tutorial tailored for {selectedGrade?.grade}</p>
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

  const renderLeaderboard = () => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-800">Top Students</h3>
        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">This Week</span>
      </div>
      <div className="space-y-2">
        <LeaderboardRow rank={1} name="Juma" points={2400} />
        <LeaderboardRow rank={2} name="Asha" points={2150} />
        <LeaderboardRow rank={3} name="Baraka" points={1900} />
        <LeaderboardRow rank={14} name="You" points={user.points} isUser />
        <LeaderboardRow rank={5} name="Neema" points={1100} />
      </div>
      <button className="w-full mt-6 py-2 text-sm font-bold text-tz-blue hover:bg-blue-50 rounded-lg transition">
        View Full Rankings
      </button>
    </div>
  );

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
        {currentView === AppView.HOME && (
          <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
             <div className="lg:col-span-2 space-y-8">
                {/* Banner */}
                <div className="bg-tz-dark rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h2 className="text-3xl font-extrabold mb-2">Karibu, Scholar!</h2>
                      <p className="text-blue-200 mb-6">You're on a 5 day streak. Keep it up to reach the top of the leaderboard.</p>
                      <button className="bg-tz-green text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_0_rgb(20,83,45)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgb(20,83,45)] transition-all">
                        Continue Learning
                      </button>
                   </div>
                   <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md relative z-10 border-4 border-white/20">
                      <i className="fa-solid fa-trophy text-5xl text-tz-yellow"></i>
                   </div>
                   {/* Decorative background elements */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-tz-blue opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-tz-blue pl-3">Select Class</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SYLLABUS_DATA.map((data) => (
                    <button
                      key={data.grade}
                      onClick={() => handleGradeSelect(data)}
                      className="group bg-white p-6 rounded-2xl shadow-[0_2px_0_rgb(229,231,235)] hover:shadow-[0_4px_0_rgb(229,231,235)] hover:-translate-y-1 border border-gray-100 transition-all duration-300 text-left flex flex-col justify-between h-36"
                    >
                      <div>
                        <span className="inline-block px-2 py-1 bg-blue-50 text-tz-blue text-[10px] font-bold rounded-md mb-2 uppercase tracking-wider">
                          Primary
                        </span>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-tz-blue transition-colors">
                          {data.grade}
                        </h3>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                         <div className="bg-tz-yellow h-1.5 rounded-full" style={{width: '30%'}}></div>
                      </div>
                    </button>
                  ))}
                </div>
             </div>

             <div className="lg:col-span-1">
                {renderLeaderboard()}
             </div>
          </div>
        )}

        {/* SYLLABUS VIEW */}
        {currentView === AppView.SYLLABUS && selectedGrade && !selectedSubject && (
           <div className="animate-fade-in">
             <button onClick={goHome} className="mb-6 flex items-center text-gray-500 hover:text-tz-blue transition">
               <i className="fa-solid fa-arrow-left mr-2"></i> Back to Home
             </button>
             <h1 className="text-3xl font-bold text-tz-dark mb-6">{selectedGrade.grade} Subjects</h1>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedGrade.subjects.map((subject) => (
                  <div 
                    key={subject.id}
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
                    {selectedSubject.topics.map((topic, index) => (
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

        {currentView === AppView.TOPIC_CONTENT && renderTopicContent()}
        {currentView === AppView.PARENTS && renderParentDashboard()}

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