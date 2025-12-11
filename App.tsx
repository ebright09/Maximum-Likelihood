import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, ChevronRight, Award, RefreshCcw, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYLLABUS } from './constants';
import { Difficulty, GeneratedQuestion, QuestionType, Module } from './types';
import { generateQuestionForTopic, evaluateStudentAnswer } from './services/geminiService';
import SuaveMentor from './components/SuaveMentor';
import FormulaBuilder from './components/FormulaBuilder';

type Emotion = 'neutral' | 'happy' | 'skeptical' | 'thinking';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(Difficulty.CONCEPT);
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [mentorFeedback, setMentorFeedback] = useState<string | null>(null);
  const [mentorEmotion, setMentorEmotion] = useState<Emotion>('neutral');
  
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Load initial question when module changes or difficulty increases
  useEffect(() => {
    if (currentModule && !currentQuestion) {
      loadQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModule, currentDifficulty]);

  const loadQuestion = async () => {
    if (!currentModule) return;
    setIsThinking(true);
    setMentorEmotion('thinking');
    
    if (!currentQuestion) {
       setMentorFeedback("Reviewing the case files...");
    }
    
    // Pick random topic and case from module
    const topic = currentModule.topics[Math.floor(Math.random() * currentModule.topics.length)];
    const caseStudy = currentModule.cases[Math.floor(Math.random() * currentModule.cases.length)];
    
    const q = await generateQuestionForTopic(topic, currentDifficulty, caseStudy);
    setCurrentQuestion(q);
    setIsThinking(false);
    setMentorEmotion('neutral');
    setMentorFeedback(null); // Clear feedback to let question speak
    setUserAnswer("");
  };

  const handleSkip = () => {
    setMentorFeedback("Skipping? Fine. But in the real world, you can't just skip the residuals. (Streak Reset)");
    setMentorEmotion('skeptical');
    setStreak(0); // Penalty for skipping
    
    // Small delay before loading next
    setTimeout(() => loadQuestion(), 2000);
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;
    setIsThinking(true);
    setMentorEmotion('thinking');
    
    try {
      const evaluation = await evaluateStudentAnswer(currentQuestion, userAnswer);
      setMentorFeedback(evaluation.feedback);
      
      if (evaluation.isCorrect) {
        setMentorEmotion('happy');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#003262', '#FDB515', '#C4820E']
        });
        setStreak(s => s + 1);
        setScore(s => s + 10 * (streak + 1));
        
        // Progression logic
        setTimeout(() => {
          if (currentDifficulty === Difficulty.INTERPRETATION) {
            setCurrentDifficulty(Difficulty.CONCEPT);
            loadQuestion();
            setMentorFeedback("Excellent work. Let's tackle another case.");
          } else {
            const nextDiff = getNextDifficulty(currentDifficulty);
            setCurrentDifficulty(nextDiff);
            loadQuestion();
          }
        }, 3500);
      } else {
        setMentorEmotion('skeptical');
        setStreak(0);
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setMentorFeedback("My internet connection is less reliable than a p-value of 0.06. Try again.");
      setMentorEmotion('skeptical');
    } finally {
      setIsThinking(false);
    }
  };

  const getNextDifficulty = (d: Difficulty): Difficulty => {
    switch(d) {
      case Difficulty.CONCEPT: return Difficulty.SETUP;
      case Difficulty.SETUP: return Difficulty.EXECUTION;
      case Difficulty.EXECUTION: return Difficulty.INTERPRETATION;
      default: return Difficulty.CONCEPT;
    }
  };

  const handleModuleSelect = (m: Module) => {
    setCurrentModule(m);
    setCurrentDifficulty(Difficulty.CONCEPT);
    setCurrentQuestion(null); // Reset to force load
    setMentorFeedback(`Ah, ${m.title}. A fine choice. Let's begin.`);
    setMentorEmotion('neutral');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar Syllabus */}
      <aside className="w-full md:w-64 bg-berkeley-blue text-white p-6 md:h-screen overflow-y-auto shrink-0 z-20 shadow-lg flex flex-col">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold text-berkeley-gold mb-1 tracking-tight">Maximum Likelihood</h1>
          <p className="text-xs text-blue-200 opacity-80">EWMBA200S Tutoring</p>
        </div>
        
        <div className="space-y-2 flex-1">
          <h3 className="text-sm uppercase tracking-wider text-blue-300 font-bold mb-2">Modules</h3>
          {SYLLABUS.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModuleSelect(m)}
              disabled={isThinking}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${currentModule?.id === m.id ? 'bg-berkeley-gold text-berkeley-blue font-bold shadow-md' : 'hover:bg-white/10 text-blue-100'} ${isThinking ? 'opacity-50 cursor-wait' : ''}`}
            >
              <span className="truncate text-sm">{m.id}. {m.title}</span>
              {currentModule?.id === m.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
           <div className="flex items-center justify-between mb-2">
             <span className="flex items-center gap-2 font-serif"><Award className="w-4 h-4 text-berkeley-gold" /> Score</span>
             <motion.span
               key={score}
               initial={{ scale: 1.5, color: '#FDB515' }}
               animate={{ scale: 1, color: '#fff' }}
               className="font-mono font-bold text-lg"
             >
               {score}
             </motion.span>
           </div>
           <div className="flex items-center justify-between mb-4">
             <span className="flex items-center gap-2 text-sm text-blue-200">Streak</span>
             <div className="flex items-center gap-1">
                <span className={`font-mono font-bold transition-colors ${streak > 2 ? 'text-orange-400' : 'text-berkeley-gold'}`}>{streak}</span>
                {streak > 2 && <Flame className="w-4 h-4 text-orange-500 animate-pulse" />}
             </div>
           </div>
           <div className="text-xs text-center text-blue-300/50 font-mono mt-4">
             v1.2.1 - Auffhammer Edition
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative bg-slate-50">
        
        {/* Sticky Mentor Header */}
        <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur border-b border-gray-200 p-4 shadow-sm transition-all duration-300">
           <SuaveMentor feedback={mentorFeedback} emotion={mentorEmotion} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          {/* Game Area */}
          <AnimatePresence mode='wait'>
            {currentModule ? (
              <motion.div
                key={currentModule.id + (currentQuestion?.text || "")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mb-10"
              >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    currentDifficulty === Difficulty.CONCEPT ? 'bg-green-100 text-green-700' :
                    currentDifficulty === Difficulty.SETUP ? 'bg-blue-100 text-blue-700' :
                    currentDifficulty === Difficulty.EXECUTION ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {currentDifficulty}
                  </span>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 font-mono">Q-ID: {currentQuestion ? 100 + currentModule.id * 10 + Math.floor(Math.random()*9) : "..."}</span>
                    <button
                      onClick={handleSkip}
                      disabled={isThinking}
                      className="text-gray-400 hover:text-berkeley-blue transition-colors disabled:opacity-50 hover:bg-gray-100 p-1 rounded"
                      title="Skip (Resets Streak)"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  
                  {/* Loading Skeleton or Question */}
                  {!currentQuestion ? (
                     <div className="animate-pulse space-y-4">
                       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                       <div className="h-32 bg-gray-100 rounded mt-6"></div>
                     </div>
                  ) : (
                    <>
                      {/* Context Block */}
                      {currentQuestion.context && (
                        <div className="mb-6 p-4 bg-berkeley-blue/5 border-l-4 border-berkeley-blue rounded-r text-sm text-slate-700 italic">
                          {currentQuestion.context}
                        </div>
                      )}

                      {/* Question Text */}
                      <h2 className="font-serif text-xl md:text-2xl text-slate-900 mb-8 leading-relaxed whitespace-pre-wrap">
                        {currentQuestion.text}
                      </h2>

                      {/* Input Areas */}
                      <div className="mb-8">
                        {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && currentQuestion.options && (
                          <div className="grid gap-3">
                            {currentQuestion.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => setUserAnswer(opt)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${userAnswer === opt ? 'border-berkeley-blue bg-blue-50 text-berkeley-blue font-bold shadow-md' : 'border-gray-200 hover:border-blue-300 text-slate-700 hover:bg-gray-50'}`}
                              >
                                <span className="inline-block w-6 h-6 rounded-full bg-white border border-gray-300 text-center text-xs leading-6 mr-3 text-gray-400 font-mono">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentQuestion.type === QuestionType.TEXT_INPUT && (
                          <textarea
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer here. Be precise..."
                            className="w-full p-4 border-2 border-gray-300 bg-white text-slate-900 rounded-lg focus:border-berkeley-blue focus:ring-0 min-h-[120px] text-lg transition-colors placeholder:text-gray-300"
                          />
                        )}

                        {currentQuestion.type === QuestionType.CALCULATION && (
                          <div className="flex items-center gap-4">
                            <input
                              type="number"
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="0.00"
                              className="w-full p-4 border-2 border-gray-300 bg-white text-slate-900 rounded-lg focus:border-berkeley-blue focus:ring-0 text-2xl font-mono"
                            />
                            <span className="text-gray-500 italic text-sm whitespace-nowrap">Round to 2 decimals</span>
                          </div>
                        )}
                        
                        {currentQuestion.type === QuestionType.FORMULA && (
                            <FormulaBuilder onFormulaChange={setUserAnswer} />
                        )}

                      </div>

                      {/* Action Bar */}
                      <div className="flex justify-end">
                        <button
                          onClick={handleSubmit}
                          disabled={!userAnswer || isThinking}
                          className="bg-berkeley-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-900 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                        >
                          {isThinking ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Evaluating...</span>
                            </>
                          ) : 'Submit Answer'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60"
              >
                <BookOpen className="w-24 h-24 mb-6 text-gray-300" />
                <p className="text-2xl font-serif text-center max-w-md">Select a module from the syllabus to begin your tutoring session.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
