import React, { useState } from 'react';
import { Plus, Minus, X, Slash, Trash2 } from 'lucide-react';

interface FormulaBuilderProps {
  onFormulaChange: (formula: string) => void;
}

const TOKENS = ['β0', 'β1', 'X', 'Y', 'ε', 'log()', 'µ', 'σ', 'n', '√', '^2', 'Mean', 'SD'];

const FormulaBuilder: React.FC<FormulaBuilderProps> = ({ onFormulaChange }) => {
  const [formula, setFormula] = useState<string[]>([]);

  const addToken = (token: string) => {
    const newFormula = [...formula, token];
    setFormula(newFormula);
    onFormulaChange(newFormula.join(' '));
  };

  const removeLast = () => {
    const newFormula = formula.slice(0, -1);
    setFormula(newFormula);
    onFormulaChange(newFormula.join(' '));
  };

  const clear = () => {
    setFormula([]);
    onFormulaChange("");
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
      <div className="mb-4 p-4 bg-white border-2 border-berkeley-blue rounded min-h-[60px] flex flex-wrap gap-2 items-center font-mono text-lg shadow-inner">
        {formula.length === 0 ? <span className="text-gray-400 italic">Construct formula here...</span> : formula.map((t, i) => (
          <span key={i} className="bg-berkeley-gold/20 px-2 py-1 rounded text-berkeley-blue font-bold">{t}</span>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {TOKENS.map((token) => (
          <button
            key={token}
            onClick={() => addToken(token)}
            className="bg-white hover:bg-blue-50 text-berkeley-blue font-semibold py-2 px-3 rounded border border-gray-200 shadow-sm transition-colors"
          >
            {token}
          </button>
        ))}
        <button onClick={() => addToken('+')} className="bg-gray-200 hover:bg-gray-300 rounded"><Plus className="w-5 h-5 mx-auto text-gray-700" /></button>
        <button onClick={() => addToken('-')} className="bg-gray-200 hover:bg-gray-300 rounded"><Minus className="w-5 h-5 mx-auto text-gray-700" /></button>
        <button onClick={() => addToken('*')} className="bg-gray-200 hover:bg-gray-300 rounded"><X className="w-5 h-5 mx-auto text-gray-700" /></button>
        <button onClick={() => addToken('/')} className="bg-gray-200 hover:bg-gray-300 rounded"><Slash className="w-5 h-5 mx-auto text-gray-700" /></button>
      </div>

      <div className="flex justify-end space-x-2">
        <button onClick={removeLast} className="text-sm text-gray-600 hover:text-red-600 px-3 py-1">Backspace</button>
        <button onClick={clear} className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 px-3 py-1 bg-red-50 rounded">
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default FormulaBuilder;
