import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, Eye, Target, CheckCircle, XCircle } from 'lucide-react';

const MemoryAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState<'intro' | 'shortTerm' | 'longTerm' | 'working' | 'results'>('intro');
  const [scores, setScores] = useState({
    shortTerm: 0,
    longTerm: 0,
    working: 0
  });

  // Short-term memory test state
  const [shortTermSequence, setShortTermSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [shortTermRound, setShortTermRound] = useState(1);
  const [shortTermCorrect, setShortTermCorrect] = useState(0);

  // Long-term memory test state
  const [wordList] = useState([
    'elephant', 'guitar', 'rainbow', 'telescope', 'butterfly',
    'mountain', 'keyboard', 'sandwich', 'umbrella', 'bicycle'
  ]);
  const [studyTime, setStudyTime] = useState(30);
  const [longTermInput, setLongTermInput] = useState('');
  const [recalledWords, setRecalledWords] = useState<string[]>([]);
  const [isStudying, setIsStudying] = useState(false);

  // Working memory test state
  const [mathProblems] = useState([
    { equation: '7 + 5 = ?', answer: 12, letter: 'R' },
    { equation: '15 - 8 = ?', answer: 7, letter: 'M' },
    { equation: '4 × 3 = ?', answer: 12, letter: 'K' },
    { equation: '18 ÷ 2 = ?', answer: 9, letter: 'L' },
    { equation: '9 + 6 = ?', answer: 15, letter: 'P' },
    { equation: '20 - 7 = ?', answer: 13, letter: 'T' },
    { equation: '3 × 4 = ?', answer: 12, letter: 'N' },
    { equation: '16 ÷ 4 = ?', answer: 4, letter: 'S' }
  ]);
  const [workingMemoryIndex, setWorkingMemoryIndex] = useState(0);
  const [workingMemoryAnswer, setWorkingMemoryAnswer] = useState('');
  const [workingMemoryLetters, setWorkingMemoryLetters] = useState<string[]>([]);
  const [workingMemoryCorrect, setWorkingMemoryCorrect] = useState(0);
  const [showingMath, setShowingMath] = useState(true);

  const generateShortTermSequence = (length: number) => {
    const sequence = [];
    for (let i = 0; i < length; i++) {
      sequence.push(Math.floor(Math.random() * 9) + 1);
    }
    return sequence;
  };

  const startShortTermTest = () => {
    const sequence = generateShortTermSequence(3 + shortTermRound);
    setShortTermSequence(sequence);
    setUserSequence([]);
    setShowingSequence(true);
    setSequenceIndex(0);
  };

  useEffect(() => {
    if (showingSequence && sequenceIndex < shortTermSequence.length) {
      const timer = setTimeout(() => {
        setSequenceIndex(sequenceIndex + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showingSequence && sequenceIndex >= shortTermSequence.length) {
      setShowingSequence(false);
    }
  }, [showingSequence, sequenceIndex, shortTermSequence.length]);

  const handleShortTermInput = (number: number) => {
    const newSequence = [...userSequence, number];
    setUserSequence(newSequence);

    if (newSequence.length === shortTermSequence.length) {
      const correct = newSequence.every((num, index) => num === shortTermSequence[index]);
      if (correct) {
        setShortTermCorrect(shortTermCorrect + 1);
      }

      if (shortTermRound < 5) {
        setTimeout(() => {
          setShortTermRound(shortTermRound + 1);
          startShortTermTest();
        }, 1500);
      } else {
        const score = Math.round((shortTermCorrect / 5) * 100);
        setScores(prev => ({ ...prev, shortTerm: score }));
        setCurrentTest('longTerm');
      }
    }
  };

  const startLongTermStudy = () => {
    setIsStudying(true);
    const timer = setInterval(() => {
      setStudyTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsStudying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLongTermSubmit = () => {
    if (longTermInput.trim()) {
      const word = longTermInput.trim().toLowerCase();
      if (wordList.includes(word) && !recalledWords.includes(word)) {
        setRecalledWords([...recalledWords, word]);
      }
      setLongTermInput('');
    }
  };

  const finishLongTermTest = () => {
    const score = Math.round((recalledWords.length / wordList.length) * 100);
    setScores(prev => ({ ...prev, longTerm: score }));
    setCurrentTest('working');
  };

  const handleWorkingMemoryAnswer = () => {
    const currentProblem = mathProblems[workingMemoryIndex];
    const isCorrect = parseInt(workingMemoryAnswer) === currentProblem.answer;
    
    if (isCorrect) {
      setWorkingMemoryCorrect(workingMemoryCorrect + 1);
      setWorkingMemoryLetters([...workingMemoryLetters, currentProblem.letter]);
    }

    setWorkingMemoryAnswer('');
    
    if (workingMemoryIndex < mathProblems.length - 1) {
      setWorkingMemoryIndex(workingMemoryIndex + 1);
    } else {
      // Test recall of letters
      setShowingMath(false);
    }
  };

  const finishWorkingMemoryTest = (recalledLetters: string) => {
    const correctLetters = workingMemoryLetters.join('').toLowerCase();
    const userLetters = recalledLetters.toLowerCase().replace(/\s/g, '');
    
    let correctCount = 0;
    for (let i = 0; i < Math.min(correctLetters.length, userLetters.length); i++) {
      if (correctLetters[i] === userLetters[i]) {
        correctCount++;
      }
    }
    
    const score = Math.round((correctCount / workingMemoryLetters.length) * 100);
    setScores(prev => ({ ...prev, working: score }));
    
    const overallScore = Math.round((scores.shortTerm + scores.longTerm + score) / 3);
    
    const results = {
      shortTerm: scores.shortTerm,
      longTerm: scores.longTerm,
      working: score,
      overall: overallScore
    };
    
    localStorage.setItem('memoryResults', JSON.stringify(results));
    navigate('/assessment/memory/results');
  };

  const renderIntro = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Memory Assessment Overview</h2>
        <div className="space-y-4 text-left">
          <div className="flex items-start space-x-3">
            <Target className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold">Short-Term Memory</h3>
              <p className="text-gray-300 text-sm">Remember and repeat number sequences of increasing length</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold">Long-Term Memory</h3>
              <p className="text-gray-300 text-sm">Study a list of words and recall them after a delay</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Eye className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold">Working Memory</h3>
              <p className="text-gray-300 text-sm">Solve math problems while remembering associated letters</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentTest('shortTerm');
            startShortTermTest();
          }}
          className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );

  const renderShortTermTest = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Short-Term Memory Test</h2>
        <p className="text-gray-300 mb-6">Round {shortTermRound} of 5</p>
        
        {showingSequence ? (
          <div className="space-y-6">
            <p className="text-white">Watch the sequence:</p>
            <div className="text-6xl font-bold text-purple-400">
              {sequenceIndex < shortTermSequence.length ? shortTermSequence[sequenceIndex] : ''}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-white">Enter the sequence you saw:</p>
            <div className="flex justify-center space-x-2 mb-6">
              {userSequence.map((num, index) => (
                <div key={index} className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {num}
                </div>
              ))}
              {Array.from({ length: shortTermSequence.length - userSequence.length }).map((_, index) => (
                <div key={index} className="w-12 h-12 bg-white/20 rounded-lg border-2 border-dashed border-white/40"></div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleShortTermInput(num)}
                  className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold text-xl transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLongTermTest = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Long-Term Memory Test</h2>
        
        {!isStudying && studyTime === 30 ? (
          <div className="space-y-6">
            <p className="text-gray-300">You will have 30 seconds to study these words:</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {wordList.map((word, index) => (
                <div key={index} className="bg-purple-600/20 rounded-lg p-3 text-white font-medium">
                  {word}
                </div>
              ))}
            </div>
            <button
              onClick={startLongTermStudy}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Start Studying
            </button>
          </div>
        ) : isStudying ? (
          <div className="space-y-6">
            <div className="text-4xl font-bold text-purple-400">{studyTime}</div>
            <p className="text-white">Study these words:</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {wordList.map((word, index) => (
                <div key={index} className="bg-purple-600/20 rounded-lg p-3 text-white font-medium">
                  {word}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-white">Enter the words you remember:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={longTermInput}
                onChange={(e) => setLongTermInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLongTermSubmit()}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type a word and press Enter"
              />
              <button
                onClick={handleLongTermSubmit}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">Words recalled: {recalledWords.length}/10</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {recalledWords.map((word, index) => (
                  <span key={index} className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={finishLongTermTest}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Continue to Next Test
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderWorkingMemoryTest = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Working Memory Test</h2>
        
        {showingMath ? (
          <div className="space-y-6">
            <p className="text-gray-300">Solve the math problem and remember the letter</p>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">
                {mathProblems[workingMemoryIndex].equation}
              </div>
              <div className="text-2xl font-bold text-purple-400">
                Letter: {mathProblems[workingMemoryIndex].letter}
              </div>
            </div>
            <div className="flex space-x-2 justify-center">
              <input
                type="number"
                value={workingMemoryAnswer}
                onChange={(e) => setWorkingMemoryAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleWorkingMemoryAnswer()}
                className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="?"
              />
              <button
                onClick={handleWorkingMemoryAnswer}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
            <p className="text-sm text-gray-400">Problem {workingMemoryIndex + 1} of {mathProblems.length}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-white">Enter the letters in the order they appeared:</p>
            <p className="text-gray-300">You solved {workingMemoryCorrect} problems correctly</p>
            <input
              type="text"
              onChange={(e) => {
                if (e.target.value.length <= workingMemoryLetters.length) {
                  // Allow input
                } else {
                  e.target.value = e.target.value.slice(0, workingMemoryLetters.length);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  finishWorkingMemoryTest((e.target as HTMLInputElement).value);
                }
              }}
              className="w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter letters"
              maxLength={workingMemoryLetters.length}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                finishWorkingMemoryTest(input.value);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Finish Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Memory Power Assessment
        </h1>
        <p className="text-gray-300">
          Comprehensive evaluation of your memory capabilities
        </p>
      </div>

      {/* Test Content */}
      {currentTest === 'intro' && renderIntro()}
      {currentTest === 'shortTerm' && renderShortTermTest()}
      {currentTest === 'longTerm' && renderLongTermTest()}
      {currentTest === 'working' && renderWorkingMemoryTest()}
    </div>
  );
};

export default MemoryAssessment;