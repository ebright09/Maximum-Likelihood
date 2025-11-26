export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT_INPUT = 'TEXT_INPUT',
  FORMULA = 'FORMULA',
  CALCULATION = 'CALCULATION'
}

export enum Difficulty {
  CONCEPT = 'Concept', // Step 1
  SETUP = 'Setup', // Step 2
  EXECUTION = 'Execution', // Step 3
  INTERPRETATION = 'Interpretation' // Step 4
}

export interface CaseStudy {
  title: string;
  description: string;
  dataPoints: string[];
}

export interface Module {
  id: number;
  title: string;
  topics: string[];
  cases: CaseStudy[];
}

export interface GeneratedQuestion {
  context?: string; // The case description/setup
  text: string; // The specific question
  type: QuestionType;
  options?: string[]; // For MC
  correctFormulaComponents?: string[]; // For Formula
  correctValue?: number; // For Calculation
  rubric?: string; // For Text Input evaluation
}

export interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
}