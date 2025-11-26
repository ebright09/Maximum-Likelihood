import React from 'react';
import { motion } from 'framer-motion';
import { PROF_MAX_SVG } from '../constants';

interface SuaveMentorProps {
  feedback: string | null;
  isThinking: boolean;
}

const SuaveMentor: React.FC<SuaveMentorProps> = ({ feedback, isThinking }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto">
      {/* Speech Bubble */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white border-2 border-berkeley-blue rounded-2xl p-6 mb-6 shadow-lg w-full min-h-[100px] flex items-center justify-center"
      >
        {isThinking ? (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-berkeley-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-berkeley-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-berkeley-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <p className="text-lg font-serif text-berkeley-blue text-center">
            {feedback || "Ready to look at some data? Let's minimize those residuals."}
          </p>
        )}
        {/* Tail */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-b-2 border-r-2 border-berkeley-blue rotate-45"></div>
      </motion.div>

      {/* Avatar */}
      <div className="w-48 h-48 relative">
        <div dangerouslySetInnerHTML={{ __html: PROF_MAX_SVG }} />
      </div>
    </div>
  );
};

export default SuaveMentor;
