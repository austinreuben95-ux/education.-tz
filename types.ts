export enum GradeLevel {
  Grade1 = 'Grade 1',
  Grade2 = 'Grade 2',
  Grade3 = 'Grade 3',
  Grade4 = 'Grade 4',
  Grade5 = 'Grade 5',
  Grade6 = 'Grade 6',
  Grade7 = 'Grade 7',
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // FontAwesome class
  topics: Topic[];
}

export interface GradeSyllabus {
  grade: GradeLevel;
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
  SYLLABUS = 'SYLLABUS',
  TOPIC_CONTENT = 'TOPIC_CONTENT',
  CHAT = 'CHAT',
  PARENTS = 'PARENTS',
  LEADERBOARD = 'LEADERBOARD'
}

export interface UserProgress {
  points: number;
  streak: number;
  completedTopics: string[];
  level: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
