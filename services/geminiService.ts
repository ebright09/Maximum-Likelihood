import { GoogleGenAI } from "@google/genai";
import { CaseStudy, GeneratedQuestion, QuestionType, Difficulty, EvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `
You are Professor Max Auffhammer, a witty, dry-humored, "coastal elite" economist at Berkeley Haas. 
You teach EWMBA200S: Data & Decisions.
You love R. You tolerate Excel but make fun of it ("Dogs do not eat computers").
You emphasize "Deep Ideas" over rote memorization.
You are suave, intellectual, but approachable.

IMPORTANT RULES FOR GENERATION:
1. Do NOT start questions with "Alright wizards" or "Listen up". Start directly with the relevant context or question.
2. Do NOT use the catchphrases "Boom. Deep Idea." or "Check your standard errors" inside the *question text*. Save those for feedback.
3. Be concise. Avoid walls of text.
`;

export const generateQuestionForTopic = async (
  topic: string,
  difficulty: Difficulty,
  caseStudy: CaseStudy
): Promise<GeneratedQuestion> => {
  
  const prompt = `
    ${SYSTEM_PROMPT}
    Generate a single ${difficulty} level question about ${topic} using the following case study context:
    Case: ${caseStudy.title}
    Context: ${caseStudy.description}
    Data: ${caseStudy.dataPoints.join(", ")}

    Rules based on Difficulty:
    - ${Difficulty.CONCEPT}: Ask for a definition or validity of a concept related to this case. Return type: MULTIPLE_CHOICE.
    - ${Difficulty.SETUP}: Ask to map the text description to a variable or hypothesis. Return type: MULTIPLE_CHOICE.
    - ${Difficulty.EXECUTION}: Ask for a specific calculation (e.g., t-stat, confidence interval). Return type: CALCULATION. Provide the correct numeric value.
    - ${Difficulty.INTERPRETATION}: Ask for a business decision or interpretation of a coefficient. Return type: TEXT_INPUT. Provide a rubric for grading.

    Output JSON format ONLY:
    {
      "context": "A short paragraph (max 2 sentences) setting the scene for the case study. Do not repeat this if it's a follow-up, but since this is stateless, provide a concise summary of the specific data needed for this question.",
      "text": "The specific question to answer. Keep it direct.",
      "type": "MULTIPLE_CHOICE" | "CALCULATION" | "TEXT_INPUT",
      "options": ["Option A", "Option B", "Option C", "Option D"] (only for MC),
      "correctOptionIndex": number (only for MC),
      "correctValue": number (only for CALCULATION),
      "rubric": "Key points required for correct answer" (only for TEXT_INPUT)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    
    // Map simple string type to Enum
    let qType = QuestionType.TEXT_INPUT;
    if(json.type === 'MULTIPLE_CHOICE') qType = QuestionType.MULTIPLE_CHOICE;
    if(json.type === 'CALCULATION') qType = QuestionType.CALCULATION;

    return {
      context: json.context,
      text: json.text,
      type: qType,
      options: json.options,
      correctValue: json.correctValue,
      rubric: json.rubric
    };
  } catch (error) {
    console.error("AI Error", error);
    // Fallback question
    return {
      context: "We seem to have lost connection to the server farm.",
      text: "What is the standard error definition?",
      type: QuestionType.TEXT_INPUT,
      rubric: "standard deviation divided by root n"
    };
  }
};

export const evaluateStudentAnswer = async (
  question: GeneratedQuestion,
  studentAnswer: string | number
): Promise<EvaluationResult> => {
  
  // Calculation check is deterministic
  if (question.type === QuestionType.CALCULATION) {
    const numAns = Number(studentAnswer);
    const isCorrect = Math.abs(numAns - (question.correctValue || 0)) < 0.05; // Tolerance
    const feedback = isCorrect 
      ? "Boom. Spot on. The numbers don't lie." 
      : `Not quite. I calculated ${question.correctValue}. Check your standard errors.`;
    return { isCorrect, feedback };
  }

  // Text/Concept check via AI
  const prompt = `
    ${SYSTEM_PROMPT}
    Question Context: ${question.context}
    Question: ${question.text}
    Rubric/Correct Answer: ${question.rubric || JSON.stringify(question.options)}
    Student Answer: ${studentAnswer}

    Evaluate the student's answer. 
    Be strict on concepts (Data & Decisions logic) but lenient on phrasing.
    Respond in Max's voice. 
    If wrong, explain why briefly (one sentence).
    
    Output JSON:
    {
      "isCorrect": boolean,
      "feedback": "string"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text || '{"isCorrect": false, "feedback": "Error parsing response"}');
};