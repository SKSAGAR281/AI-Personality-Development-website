import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Volume2, Users, Eye, TrendingUp, Target, BookOpen, ArrowRight, Award, Star } from 'lucide-react';

interface SpeechResults {
  clarity: number;
  pace: number;
  volume: number;
  articulation: number;
  eyeContact: number;
  posture: number;
  gestures: number;
  facialExpression: number;
  confidence: number;
  engagement: number;
  structure: number;
  speechScore: number;
  bodyLanguageScore: number;
  overall: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  duration: number;
  topic: string;
}

const SpeechResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<SpeechResults | null>(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('speechResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      navigate('/assessment/speech');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const getCommunicationProfile = (results: SpeechResults) => {
    const { overall } = results;
    
    if (overall >= 90) {
      return {
        title: "Master Communicator",
        description: "You demonstrate exceptional communication skills with outstanding speech delivery and compelling body language. You naturally engage audiences and convey messages with remarkable clarity and confidence.",
        icon: Award,
        color: "text-yellow-400"
      };
    } else if (overall >= 80) {
      return {
        title: "Skilled Communicator",
        description: "You have strong communication abilities with excellent speech quality and effective body language. You connect well with audiences and deliver messages with confidence and clarity.",
        icon: Star,
        color: "text-green-400"
      };
    } else if (overall >= 70) {
      return {
        title: "Developing Communicator",
        description: "You show solid communication fundamentals with good speech delivery and body language awareness. With focused practice, you can enhance your natural communication abilities.",
        icon: TrendingUp,
        color: "text-blue-400"
      };
    } else if (overall >= 60) {
      return {
        title: "Emerging Communicator",
        description: "You have foundational communication skills with room for growth in both speech delivery and body language. Targeted practice will help you build confidence and effectiveness.",
        icon: Target,
        color: "text-purple-400"
      };
    } else {
      return {
        title: "Communication Builder",
        description: "You're at the beginning of your communication development journey. With dedicated practice and the right techniques, you can significantly improve your speaking abilities.",
        icon: MessageCircle,
        color: "text-orange-400"
      };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 55) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    if (score >= 55) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const profile = getCommunicationProfile(results);
  const ProfileIcon = profile.icon;

  const speechMetrics = [
    { name: 'Clarity', score: results.clarity, description: 'How clearly you articulate words and sounds' },
    { name: 'Pace', score: results.pace, description: 'The speed and rhythm of your speech delivery' },
    { name: 'Volume', score: results.volume, description: 'Appropriate volume level and projection' },
    { name: 'Articulation', score: results.articulation, description: 'Precision in pronouncing words and syllables' }
  ];

  const bodyLanguageMetrics = [
    { name: 'Eye Contact', score: results.eyeContact, description: 'Maintaining appropriate gaze with the audience' },
    { name: 'Posture', score: results.posture, description: 'Body positioning and stance during speaking' },
    { name: 'Gestures', score: results.gestures, description: 'Natural and supportive hand movements' },
    { name: 'Facial Expression', score: results.facialExpression, description: 'Appropriate facial expressions and engagement' }
  ];

  const communicationMetrics = [
    { name: 'Confidence', score: results.confidence, description: 'Overall confidence and self-assurance in delivery' },
    { name: 'Engagement', score: results.engagement, description: 'Ability to connect with and engage the audience' },
    { name: 'Structure', score: results.structure, description: 'Organization and flow of your message' }
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Communication Analysis
          </h1>
          <p className="text-gray-300">
            Comprehensive assessment of your speech and body language
          </p>
        </div>

        {/* Recording Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Recording Details</h3>
              <p className="text-gray-300 text-sm mb-1">Duration: {formatDuration(results.duration)}</p>
              <p className="text-gray-300 text-sm">Topic: {results.topic.substring(0, 100)}...</p>
            </div>
            <div className="text-center md:text-right">
              <div className="inline-flex items-center space-x-2">
                <ProfileIcon className={`h-8 w-8 ${profile.color}`} />
                <div>
                  <p className="text-white font-semibold">{profile.title}</p>
                  <p className="text-gray-300 text-sm">Overall Score: {results.overall}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Scores */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <Volume2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Speech Quality</h3>
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                <circle
                  cx="40" cy="40" r="30"
                  stroke="url(#speechGradient)"
                  strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray={`${(results.speechScore / 100) * 188} 188`}
                />
                <defs>
                  <linearGradient id="speechGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{results.speechScore}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Body Language</h3>
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                <circle
                  cx="40" cy="40" r="30"
                  stroke="url(#bodyGradient)"
                  strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray={`${(results.bodyLanguageScore / 100) * 188} 188`}
                />
                <defs>
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{results.bodyLanguageScore}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <MessageCircle className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Overall</h3>
            <div className="relative w-20 h-20 mx-auto mb-2">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                <circle
                  cx="40" cy="40" r="30"
                  stroke="url(#overallGradient)"
                  strokeWidth="6" fill="none" strokeLinecap="round"
                  strokeDasharray={`${(results.overall / 100) * 188} 188`}
                />
                <defs>
                  <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white">{results.overall}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Detailed Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Speech Metrics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Volume2 className="h-6 w-6 text-green-400" />
                <span>Speech Analysis</span>
              </h3>
              <div className="space-y-4">
                {speechMetrics.map((metric) => (
                  <div key={metric.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{metric.name}</span>
                      <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2 mb-1">
                      <div 
                        className={`bg-gradient-to-r ${getScoreBackground(metric.score)} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <p className="text-gray-300 text-xs">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Body Language Metrics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-400" />
                <span>Body Language Analysis</span>
              </h3>
              <div className="space-y-4">
                {bodyLanguageMetrics.map((metric) => (
                  <div key={metric.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{metric.name}</span>
                      <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2 mb-1">
                      <div 
                        className={`bg-gradient-to-r ${getScoreBackground(metric.score)} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <p className="text-gray-300 text-xs">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Effectiveness */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <MessageCircle className="h-6 w-6 text-purple-400" />
                <span>Communication Effectiveness</span>
              </h3>
              <div className="space-y-4">
                {communicationMetrics.map((metric) => (
                  <div key={metric.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{metric.name}</span>
                      <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2 mb-1">
                      <div 
                        className={`bg-gradient-to-r ${getScoreBackground(metric.score)} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <p className="text-gray-300 text-xs">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights and Recommendations */}
          <div className="space-y-6">
            {results.strengths.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  <span>Your Strengths</span>
                </h3>
                <div className="space-y-2">
                  {results.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.improvements.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Target className="h-6 w-6 text-orange-400" />
                  <span>Areas for Growth</span>
                </h3>
                <div className="space-y-2">
                  {results.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.recommendations.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                  <span>Recommendations</span>
                </h3>
                <div className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-green-400" />
                <span>Communication Plan</span>
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Get a personalized communication improvement plan based on your assessment results.
              </p>
              <button
                onClick={() => navigate('/plan')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <span>View Improvement Plan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
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
                <p className="text-white font-semibold">Communication Assessment Complete!</p>
                <p className="text-gray-300 text-sm mt-1">
                  You've analyzed your speaking and presentation skills
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
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechResults;