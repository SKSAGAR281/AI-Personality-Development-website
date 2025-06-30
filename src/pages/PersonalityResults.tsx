import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, Target, BookOpen, ArrowRight, Star, Award } from 'lucide-react';

interface PersonalityResults {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
}

const PersonalityResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<PersonalityResults | null>(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('personalityResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      navigate('/assessment/personality');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const getPersonalityProfile = (results: PersonalityResults) => {
    const traits = Object.entries(results);
    const dominantTrait = traits.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );

    const profiles = {
      extraversion: {
        title: "The Energizer",
        description: "You thrive in social situations and draw energy from interactions with others. You're likely outgoing, assertive, and comfortable being the center of attention.",
        strengths: ["Natural leadership", "Strong communication", "Motivates others", "Adaptable to change"],
        challenges: ["May dominate conversations", "Can be impulsive", "Might struggle with solitude"]
      },
      agreeableness: {
        title: "The Harmonizer",
        description: "You prioritize cooperation and maintaining positive relationships. You're naturally empathetic, trusting, and focused on helping others.",
        strengths: ["Excellent team player", "High emotional intelligence", "Conflict resolution", "Builds trust easily"],
        challenges: ["May avoid necessary conflicts", "Can be taken advantage of", "Difficulty saying no"]
      },
      conscientiousness: {
        title: "The Achiever",
        description: "You're highly organized, disciplined, and goal-oriented. You take responsibilities seriously and consistently deliver high-quality work.",
        strengths: ["Exceptional reliability", "Strong work ethic", "Detail-oriented", "Excellent planning skills"],
        challenges: ["May be overly critical", "Can be inflexible", "Prone to perfectionism"]
      },
      neuroticism: {
        title: "The Sensitive",
        description: "You experience emotions deeply and are highly attuned to stress and environmental changes. This sensitivity can be both a strength and a challenge.",
        strengths: ["High emotional awareness", "Empathetic to others", "Motivated by improvement", "Attention to potential problems"],
        challenges: ["Stress sensitivity", "May worry excessively", "Emotional volatility"]
      },
      openness: {
        title: "The Explorer",
        description: "You're curious, creative, and open to new experiences. You enjoy learning, abstract thinking, and exploring unconventional ideas.",
        strengths: ["Creative problem-solving", "Adaptable to change", "Intellectual curiosity", "Innovative thinking"],
        challenges: ["May be seen as impractical", "Can be indecisive", "Might neglect routine tasks"]
      }
    };

    return profiles[dominantTrait[0] as keyof typeof profiles];
  };

  const profile = getPersonalityProfile(results);
  const overallScore = Math.round(Object.values(results).reduce((sum, score) => sum + score, 0) / 5);

  const getTraitDescription = (trait: string, score: number) => {
    const descriptions = {
      extraversion: {
        high: "You're outgoing, energetic, and thrive in social situations. You likely enjoy being around people and feel comfortable expressing yourself.",
        medium: "You balance social interaction with alone time. You can be outgoing when needed but also appreciate quieter moments.",
        low: "You prefer quieter, more intimate settings and may need time alone to recharge. You think before speaking and value deep conversations."
      },
      agreeableness: {
        high: "You're naturally cooperative, trusting, and focused on maintaining harmony. You prioritize others' needs and work well in teams.",
        medium: "You balance cooperation with assertiveness. You can be accommodating but also stand up for your beliefs when necessary.",
        low: "You're more competitive and skeptical. You prioritize your own interests and aren't afraid to challenge others when needed."
      },
      conscientiousness: {
        high: "You're highly organized, disciplined, and reliable. You set goals and work systematically to achieve them with great attention to detail.",
        medium: "You're generally organized and responsible but can be flexible when needed. You balance planning with spontaneity.",
        low: "You prefer flexibility and spontaneity over rigid structure. You may struggle with organization but are adaptable to change."
      },
      neuroticism: {
        high: "You experience emotions intensely and may be more sensitive to stress. You're highly aware of potential problems and challenges.",
        medium: "You experience normal emotional ups and downs. You can handle stress reasonably well but may occasionally feel overwhelmed.",
        low: "You're emotionally stable and resilient. You handle stress well and maintain a calm demeanor in challenging situations."
      },
      openness: {
        high: "You're highly creative, curious, and open to new experiences. You enjoy abstract thinking and exploring unconventional ideas.",
        medium: "You appreciate both new experiences and familiar routines. You're moderately creative and open to different perspectives.",
        low: "You prefer familiar experiences and traditional approaches. You value practical solutions over abstract theories."
      }
    };

    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return descriptions[trait as keyof typeof descriptions][level];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Personality Profile
          </h1>
          <p className="text-gray-300">
            Comprehensive Big Five personality analysis and insights
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
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{overallScore}</span>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{profile.title}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">{profile.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Detailed Trait Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Detailed Trait Analysis</h2>
            
            {Object.entries(results).map(([trait, score]) => (
              <div key={trait} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white capitalize">
                    {trait === 'neuroticism' ? 'Emotional Stability' : trait}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                    {score >= 80 && <Star className="h-5 w-5 text-yellow-400" />}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="bg-white/20 rounded-full h-3">
                    <div 
                      className={`bg-gradient-to-r ${getScoreBackground(score)} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                  {getTraitDescription(trait, score)}
                </p>
              </div>
            ))}
          </div>

          {/* Insights and Recommendations */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span>Your Strengths</span>
              </h3>
              <div className="space-y-2">
                {profile.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Target className="h-6 w-6 text-orange-400" />
                <span>Growth Areas</span>
              </h3>
              <div className="space-y-2">
                {profile.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-purple-400" />
                <span>Development Plan</span>
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Based on your personality profile, we recommend focusing on leveraging your strengths while addressing growth areas.
              </p>
              <button
                onClick={() => navigate('/plan')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
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
                <p className="text-white font-semibold">Personality Assessment Complete!</p>
                <p className="text-gray-300 text-sm mt-1">
                  You've unlocked insights into your personality traits
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
            onClick={() => navigate('/assessment/memory')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-colors"
          >
            Take Memory Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityResults;