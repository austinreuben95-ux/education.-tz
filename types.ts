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
  ROADMAP = 'ROADMAP'
}

export interface UserProgress {
  points: number;
  credits: number;
  streak: number;
  completedTopics: string[];
  level: number;
  userId?: string;
  email?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
