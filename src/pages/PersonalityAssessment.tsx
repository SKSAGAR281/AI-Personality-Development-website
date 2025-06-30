import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, ChevronLeft } from 'lucide-react';

const PersonalityAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    {
      text: "I see myself as someone who is talkative",
      trait: "extraversion"
    },
    {
      text: "I see myself as someone who tends to find fault with others",
      trait: "agreeableness",
      reverse: true
    },
    {
      text: "I see myself as someone who does a thorough job",
      trait: "conscientiousness"
    },
    {
      text: "I see myself as someone who is depressed, blue",
      trait: "neuroticism"
    },
    {
      text: "I see myself as someone who is original, comes up with new ideas",
      trait: "openness"
    },
    {
      text: "I see myself as someone who is reserved",
      trait: "extraversion",
      reverse: true
    },
    {
      text: "I see myself as someone who is helpful and unselfish with others",
      trait: "agreeableness"
    },
    {
      text: "I see myself as someone who can be somewhat careless",
      trait: "conscientiousness",
      reverse: true
    },
    {
      text: "I see myself as someone who is relaxed, handles stress well",
      trait: "neuroticism",
      reverse: true
    },
    {
      text: "I see myself as someone who is curious about many different things",
      trait: "openness"
    },
    {
      text: "I see myself as someone who is full of energy",
      trait: "extraversion"
    },
    {
      text: "I see myself as someone who starts quarrels with others",
      trait: "agreeableness",
      reverse: true
    },
    {
      text: "I see myself as someone who is a reliable worker",
      trait: "conscientiousness"
    },
    {
      text: "I see myself as someone who can be tense",
      trait: "neuroticism"
    },
    {
      text: "I see myself as someone who is ingenious, a deep thinker",
      trait: "openness"
    }
  ];

  const scaleLabels = [
    "Disagree strongly",
    "Disagree a little",
    "Neither agree nor disagree",
    "Agree a little",
    "Agree strongly"
  ];

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const traits = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    const traitCounts = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        const score = question.reverse ? 6 - answers[index] : answers[index];
        traits[question.trait as keyof typeof traits] += score;
        traitCounts[question.trait as keyof typeof traitCounts]++;
      }
    });

    // Calculate percentages
    const results = Object.keys(traits).reduce((acc, trait) => {
      const traitKey = trait as keyof typeof traits;
      acc[traitKey] = Math.round((traits[traitKey] / (traitCounts[traitKey] * 5)) * 100);
      return acc;
    }, {} as typeof traits);

    // Save results and navigate
    localStorage.setItem('personalityResults', JSON.stringify(results));
    navigate('/assessment/personality/results');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Big Five Personality Assessment
          </h1>
          <p className="text-gray-300">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-8 text-center">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-4">
            {scaleLabels.map((label, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  answers[currentQuestion] === index + 1
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index + 1
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQuestion] === index + 1 && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityAssessment;