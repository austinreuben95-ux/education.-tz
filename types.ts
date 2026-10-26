export enum EducationLevel {
  PRIMARY = 'Primary School',
  SECONDARY = 'Secondary School (O-Level)',
  HIGH_SCHOOL = 'High School (A-Level)'
}

export enum GradeLevel {
  // Primary
  Grade1 = 'Standard 1',
  Grade2 = 'Standard 2',
  Grade3 = 'Standard 3',
  Grade4 = 'Standard 4',
  Grade5 = 'Standard 5',
  Grade6 = 'Standard 6',
  Grade7 = 'Standard 7',
  // Secondary
  Form1 = 'Form 1',
  Form2 = 'Form 2',
  Form3 = 'Form 3',
  Form4 = 'Form 4',
  // High School
  Form5 = 'Form 5',
  Form6 = 'Form 6'
}

export interface VideoLesson {
  id: string;
  title: string;
  url: string;
  duration?: string;
  channel?: string;
  badge?: string;
}

export interface HomeworkQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface QuickStudySession {
  id: string;
  topicId?: string;
  gradeName: string;
  subjectName: string;
  topicTitle: string;
  timestamp: number;
  difficulty?: string;
  timeEstimate?: string;
}

export interface HomeworkItem {
  id: string;
  topicId: string;
  topicTitle: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  targetScore: number; // e.g. 85%
  maxScore: number; // e.g. 100
  submitted?: boolean;
  scoreAchieved?: number;
  submissionText?: string;
  questions: HomeworkQuestion[];
}

export interface TargetScore {
  subjectId: string;
  subjectName: string;
  targetPercentage: number; // e.g. 85
  gradeTarget: 'A' | 'B' | 'C' | 'S';
  note?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videos?: VideoLesson[];
  homework?: HomeworkItem[];
  targetScore?: number;
  difficulty?: 'beginner' | 'easy' | 'amateur' | 'hard' | 'extreme';
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // FontAwesome class
  topics: Topic[];
  isNewSyllabus?: boolean;
  hasVideo?: boolean;
  isExamFocused?: boolean;
  targetScore?: number;
}

export interface GradeSyllabus {
  grade: GradeLevel;
  level: EducationLevel;
  subjects: Subject[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  isStreaming?: boolean;
  modelUsed?: string;
  groundingSources?: { title: string; uri: string }[];
}

export enum AppView {
  HOME = 'HOME',
  LEVEL_SELECT = 'LEVEL_SELECT',
  SYLLABUS = 'SYLLABUS',
  TOPIC_CONTENT = 'TOPIC_CONTENT',
  CHAT = 'CHAT',
  PARENTS = 'PARENTS',
  LEADERBOARD = 'LEADERBOARD',
  ADMIN = 'ADMIN',
  EXAMS = 'EXAMS',
  TEACHERS = 'TEACHERS',
  ALEVEL_GUIDE = 'ALEVEL_GUIDE',
  WALLET = 'WALLET',
  CALCULATOR = 'CALCULATOR',
  DICTIONARY = 'DICTIONARY',
  NOTES = 'NOTES',
  PLANNER = 'PLANNER',
  PREDICTOR = 'PREDICTOR',
  ASSIGNMENTS_TESTS = 'ASSIGNMENTS_TESTS',
  BADGES = 'BADGES',
  GRADE_CHECKER = 'GRADE_CHECKER',
  ROADMAP = 'ROADMAP',
  NEWS_SCHOLARSHIPS = 'NEWS_SCHOLARSHIPS',
  VIDEOS = 'VIDEOS',
  SCHOOLS = 'SCHOOLS',
  STUDY_ROOM = 'STUDY_ROOM',
  INTERACTIVE_GAMES = 'INTERACTIVE_GAMES',
  ANALYTICS = 'ANALYTICS'
}

export type StudyTipType = 'tip' | 'trap' | 'formula' | 'question';

export interface StudyRoomMessage {
  id: string;
  subjectId: string;
  subjectName: string;
  gradeLevel?: string;
  authorName: string;
  authorId: string;
  authorRole?: 'Student' | 'Candidate' | 'Teacher' | 'Peer Tutor';
  type: StudyTipType;
  title?: string;
  content: string;
  likes: number;
  likedBy?: string[];
  createdAt: string;
  isNectaTrap?: boolean;
  topicRef?: string;
}

export interface StudyBuddy {
  id: string;
  userId: string;
  displayName: string;
  avatarId?: string;
  schoolName?: string;
  region?: string;
  gradeLevel: string;
  subjectId: string;
  subjectName: string;
  topicId?: string;
  topicTitle: string;
  studyGoal: string;
  isOnline: boolean;
  status: 'available' | 'in_session' | 'seeking_help' | 'ready_to_tutor';
  lastActive: string;
  matchScore?: number;
}

export interface CollaborativeStep {
  id: string;
  authorId: string;
  authorName: string;
  stepNumber: number;
  explanation: string;
  formulaOrCode?: string;
  isVerified?: boolean;
  timestamp: string;
}

export interface StudyBuddySession {
  id: string;
  subjectId: string;
  subjectName: string;
  topicTitle: string;
  questionOrProblem: string;
  participants: {
    userId: string;
    displayName: string;
    avatarId?: string;
    schoolName?: string;
    role: 'creator' | 'buddy';
  }[];
  steps: CollaborativeStep[];
  finalAnswer?: string;
  status: 'active' | 'solved' | 'waiting_for_buddy';
  createdAt: string;
  updatedAt: string;
}

export interface BuddyChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'step_proposal' | 'formula' | 'hint' | 'yun_ai_referee';
  createdAt: string;
}

export interface UserProgress {
  points: number;
  credits: number;
  streak: number;
  completedTopics: string[];
  level: number;
  userId?: string;
  email?: string;
  displayName?: string;
  schoolOrUniversity?: string;
  educationStage?: 'Primary' | 'Secondary' | 'High School' | 'University / College' | 'Other';
  region?: string;
  schoolRegion?: string;
  headTeacherName?: string;
  avatarId?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  nectaTip?: string;
  subject?: string;
  topic?: string;
}

export interface QuizWhereToFocus {
  primaryFocusTopic: string;
  keyTakeaway: string;
  actionSteps: string[];
  nectaTrapToAvoid: string;
}

export interface QuizMistakeFeedback {
  conceptualGap: string;
  whyOptionIsIncorrect: string;
  underlyingPrinciple: string;
  whereToFocus: QuizWhereToFocus;
  bilingualQuickTip?: string;
  source?: 'gemini' | 'heuristic';
}

