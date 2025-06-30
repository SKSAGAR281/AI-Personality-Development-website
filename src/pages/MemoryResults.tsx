import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Eye, TrendingUp, BookOpen, ArrowRight, Award, Zap } from 'lucide-react';

interface MemoryResults {
  shortTerm: number;
  longTerm: number;
  working: number;
  overall: number;
}

const MemoryResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<MemoryResults | null>(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('memoryResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      navigate('/assessment/memory');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const getMemoryProfile = (results: MemoryResults) => {
    const { shortTerm, longTerm, working, overall } = results;
    
    if (overall >= 85) {
      return {
        title: "Memory Champion",
        description: "You have exceptional memory capabilities across all areas. Your cognitive processing is highly efficient and you excel at both storing and retrieving information.",
        icon: Award,
        color: "text-yellow-400"
      };
    } else if (overall >= 70) {
      return {
        title: "Memory Specialist",
        description: "You have strong memory abilities with particular strengths in certain areas. Your cognitive performance is above average and well-developed.",
        icon: Target,
        color: "text-green-400"
      };
    } else if (overall >= 55) {
      return {
        title: "Memory Developer",
        description: "You have solid foundational memory skills with room for improvement. With targeted practice, you can significantly enhance your cognitive abilities.",
        icon: TrendingUp,
        color: "text-blue-400"
      };
    } else {
      return {
        title: "Memory Builder",
        description: "You're at the beginning of your memory development journey. There's tremendous potential for growth with the right techniques and consistent practice.",
        icon: Zap,
        color: "text-purple-400"
      };
    }
  };

  const getMemoryInsights = (results: MemoryResults) => {
    const insights = [];
    const recommendations = [];
    
    // Short-term memory insights
    if (results.shortTerm >= 80) {
      insights.push("Excellent short-term memory - you can hold and manipulate information effectively");
    } else if (results.shortTerm >= 60) {
      insights.push("Good short-term memory with room for improvement in information retention");
      recommendations.push("Practice digit span exercises daily to improve short-term retention");
    } else {
      insights.push("Short-term memory needs development - focus on attention and concentration");
      recommendations.push("Use chunking techniques to break information into smaller, manageable pieces");
    }

    // Long-term memory insights
    if (results.longTerm >= 80) {
      insights.push("Strong long-term memory - you excel at encoding and retrieving stored information");
    } else if (results.longTerm >= 60) {
      insights.push("Moderate long-term memory - you can improve information consolidation");
      recommendations.push("Use spaced repetition and elaborative rehearsal for better retention");
    } else {
      insights.push("Long-term memory requires attention - focus on encoding strategies");
      recommendations.push("Create meaningful associations and use mnemonic devices for better recall");
    }

    // Working memory insights
    if (results.working >= 80) {
      insights.push("Exceptional working memory - you can juggle multiple tasks efficiently");
    } else if (results.working >= 60) {
      insights.push("Good working memory with potential for enhanced multitasking abilities");
      recommendations.push("Practice dual n-back exercises to improve working memory capacity");
    } else {
      insights.push("Working memory needs strengthening for better cognitive flexibility");
      recommendations.push("Engage in complex mental tasks that require holding multiple pieces of information");
    }

    return { insights, recommendations };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const profile = getMemoryProfile(results);
  const { insights, recommendations } = getMemoryInsights(results);
  const ProfileIcon = profile.icon;

  const memoryTypes = [
    {
      name: 'Short-Term Memory',
      score: results.shortTerm,
      icon: Eye,
      description: 'Ability to hold and manipulate information for brief periods',
      color: 'text-blue-400'
    },
    {
      name: 'Long-Term Memory',
      score: results.longTerm,
      icon: Brain,
      description: 'Capacity to store and retrieve information over extended periods',
      color: 'text-purple-400'
    },
    {
      name: 'Working Memory',
      score: results.working,
      icon: Target,
      description: 'Skill in processing and manipulating information simultaneously',
      color: 'text-green-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Memory Assessment Results
          </h1>
          <p className="text-gray-300">
            Comprehensive analysis of your cognitive memory capabilities
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#memoryGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(results.overall / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="memoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{results.overall}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <ProfileIcon className={`h-8 w-8 ${profile.color}`} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{profile.title}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">{profile.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Memory Type Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Memory Type Analysis</h2>
            
            {memoryTypes.map((type) => {
              const TypeIcon = type.icon;
              return (
                <div key={type.name} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <TypeIcon className={`h-6 w-6 ${type.color}`} />
                      <h3 className="text-xl font-semibold text-white">{type.name}</h3>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(type.score)}`}>
                      {type.score}%
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="bg-white/20 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r ${getScoreBackground(type.score)} h-3 rounded-full transition-all duration-1000`}
                        style={{ width: `${type.score}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm">{type.description}</p>
                </div>
              );
            })}

            {/* Detailed Insights */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-400" />
                <span>Performance Insights</span>
              </h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations and Actions */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Target className="h-6 w-6 text-green-400" />
                <span>Improvement Strategies</span>
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span>Memory Training Plan</span>
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Get a personalized 90-day memory improvement plan based on your assessment results.
              </p>
              <button
                onClick={() => navigate('/plan')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <span>View Training Plan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Memory Exercises</h3>
              <div className="space-y-3">
                <div className="bg-purple-600/20 rounded-lg p-3">
                  <h4 className="text-white font-medium text-sm">Daily Practice</h4>
                  <p className="text-gray-300 text-xs">15 minutes of memory exercises</p>
                </div>
                <div className="bg-blue-600/20 rounded-lg p-3">
                  <h4 className="text-white font-medium text-sm">Spaced Repetition</h4>
                  <p className="text-gray-300 text-xs">Review information at increasing intervals</p>
                </div>
                <div className="bg-green-600/20 rounded-lg p-3">
                  <h4 className="text-white font-medium text-sm">Mnemonic Techniques</h4>
                  <p className="text-gray-300 text-xs">Use memory aids and associations</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Award className="h-6 w-6 text-yellow-400" />
                <span>Achievement</span>
              </h3>
              <div className="text-center">
                <div className="bg-yellow-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-white font-semibold">Memory Assessment Complete!</p>
                <p className="text-gray-300 text-sm mt-1">
                  You've mapped your cognitive memory landscape
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/assessment/speech')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors"
          >
            Take Communication Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryResults;