export type ExerciseType = 'choice' | 'true-false' | 'fill' | 'order';

export interface TheoryBlock {
  title: string;
  icon: string;
  explanation: string;
  examples: string[];
  tip?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
  skill: 'vocabulary' | 'grammar' | 'reading' | 'communication';
}

export interface LearningUnit {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  emoji: string;
  vocabulary: string[];
  theory: TheoryBlock[];
  practice: Exercise[];
  exam: Exercise[];
}
