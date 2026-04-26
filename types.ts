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

export interface Topic {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // FontAwesome class
  topics: Topic[];
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
  WALLET = 'WALLET',
  CALCULATOR = 'CALCULATOR'
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
