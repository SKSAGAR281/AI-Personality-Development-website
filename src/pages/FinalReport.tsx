import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, Target, Calendar, Award, Star, CheckCircle, ArrowRight, BookOpen, Zap } from 'lucide-react';

interface AssessmentResults {
  personality?: any;
  memory?: any;
  speech?: any;
}

interface FinalAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  personalityInsights: string[];
  memoryInsights: string[];
  communicationInsights: string[];
  developmentAreas: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

const FinalReport: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResults>({});
  const [analysis, setAnalysis] = useState<FinalAnalysis | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<45 | 90 | 180>(90);

  useEffect(() => {
    // Load all assessment results
    const personalityResults = localStorage.getItem('personalityResults');
    const memoryResults = localStorage.getItem('memoryResults');
    const speechResults = localStorage.getItem('speechResults');

    const loadedResults: AssessmentResults = {};
    
    if (personalityResults) loadedResults.personality = JSON.parse(personalityResults);
    if (memoryResults) loadedResults.memory = JSON.parse(memoryResults);
    if (speechResults) loadedResults.speech = JSON.parse(speechResults);

    // Check if all assessments are completed
    const completedCount = Object.keys(loadedResults).length;
    if (completedCount < 3) {
      navigate('/dashboard');
      return;
    }

    setResults(loadedResults);
    generateFinalAnalysis(loadedResults);
  }, [navigate]);

  const generateFinalAnalysis = (results: AssessmentResults) => {
    const { personality, memory, speech } = results;
    
    // Calculate overall score
    const personalityAvg = personality ? Object.values(personality).reduce((sum: number, val: number) => sum + val, 0) / 5 : 0;
    const memoryAvg = memory ? memory.overall : 0;
    const speechAvg = speech ? speech.overall : 0;
    const overallScore = Math.round((personalityAvg + memoryAvg + speechAvg) / 3);

    // Analyze strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];
    const personalityInsights: string[] = [];
    const memoryInsights: string[] = [];
    const communicationInsights: string[] = [];

    // Personality Analysis
    if (personality) {
      const traits = Object.entries(personality);
      const strongTraits = traits.filter(([_, score]) => score >= 75);
      const weakTraits = traits.filter(([_, score]) => score < 50);

      strongTraits.forEach(([trait, score]) => {
        switch (trait) {
          case 'extraversion':
            strengths.push('Strong social skills and leadership potential');
            personalityInsights.push('You naturally energize others and thrive in collaborative environments');
            break;
          case 'agreeableness':
            strengths.push('Excellent interpersonal relationships and empathy');
            personalityInsights.push('You build trust easily and excel at conflict resolution');
            break;
          case 'conscientiousness':
            strengths.push('High reliability and exceptional work ethic');
            personalityInsights.push('You consistently deliver quality results and meet commitments');
            break;
          case 'openness':
            strengths.push('Creative thinking and adaptability to change');
            personalityInsights.push('You embrace new ideas and approach problems innovatively');
            break;
          case 'neuroticism':
            if (score < 30) { // Low neuroticism is good
              strengths.push('Emotional stability and stress resilience');
              personalityInsights.push('You maintain composure under pressure and handle challenges well');
            }
            break;
        }
      });

      weakTraits.forEach(([trait, score]) => {
        switch (trait) {
          case 'extraversion':
            weaknesses.push('May struggle with self-promotion and networking');
            recommendations.push('Practice speaking up in meetings and joining professional groups');
            break;
          case 'agreeableness':
            weaknesses.push('Difficulty with assertiveness and saying no');
            recommendations.push('Learn assertiveness techniques and practice setting boundaries');
            break;
          case 'conscientiousness':
            weaknesses.push('May lack organization and struggle with deadlines');
            recommendations.push('Implement time management systems and break large tasks into smaller steps');
            break;
          case 'openness':
            weaknesses.push('May resist change and prefer familiar approaches');
            recommendations.push('Actively seek new experiences and challenge your assumptions');
            break;
          case 'neuroticism':
            if (score > 70) {
              weaknesses.push('High sensitivity to stress and emotional volatility');
              recommendations.push('Practice mindfulness, stress management, and emotional regulation techniques');
            }
            break;
        }
      });
    }

    // Memory Analysis
    if (memory) {
      if (memory.overall >= 80) {
        strengths.push('Exceptional memory capabilities across all areas');
        memoryInsights.push('Your cognitive processing is highly efficient and well-developed');
      } else if (memory.overall >= 65) {
        strengths.push('Strong foundational memory skills');
        memoryInsights.push('You have solid memory abilities with specific areas of excellence');
      } else {
        weaknesses.push('Memory skills need development and strengthening');
        recommendations.push('Engage in daily memory exercises and use mnemonic techniques');
      }

      if (memory.shortTerm < 60) {
        weaknesses.push('Short-term memory retention needs improvement');
        recommendations.push('Practice digit span exercises and chunking techniques');
      }
      if (memory.longTerm < 60) {
        weaknesses.push('Long-term memory consolidation could be enhanced');
        recommendations.push('Use spaced repetition and create meaningful associations');
      }
      if (memory.working < 60) {
        weaknesses.push('Working memory capacity requires strengthening');
        recommendations.push('Engage in dual n-back training and complex mental tasks');
      }
    }

    // Speech Analysis
    if (speech) {
      if (speech.overall >= 80) {
        strengths.push('Excellent communication and presentation skills');
        communicationInsights.push('You effectively engage audiences and convey messages with clarity');
      } else if (speech.overall >= 65) {
        strengths.push('Good communication foundation with room for growth');
        communicationInsights.push('You have solid speaking abilities that can be further refined');
      } else {
        weaknesses.push('Communication skills need significant development');
        recommendations.push('Practice public speaking and record yourself regularly');
      }

      if (speech.speechScore < 70) {
        weaknesses.push('Speech clarity and delivery need improvement');
        recommendations.push('Work on articulation exercises and pace control');
      }
      if (speech.bodyLanguageScore < 70) {
        weaknesses.push('Body language and non-verbal communication need attention');
        recommendations.push('Practice maintaining eye contact and using purposeful gestures');
      }
    }

    // Determine primary development areas
    const scores = {
      personality: personalityAvg,
      memory: memoryAvg,
      communication: speechAvg
    };

    const sortedAreas = Object.entries(scores).sort(([,a], [,b]) => a - b);
    
    const developmentAreas = {
      primary: sortedAreas[0][0],
      secondary: sortedAreas[1][0],
      tertiary: sortedAreas[2][0]
    };

    setAnalysis({
      overallScore,
      strengths,
      weaknesses,
      recommendations,
      personalityInsights,
      memoryInsights,
      communicationInsights,
      developmentAreas
    });
  };

  const generateImprovementPlan = () => {
    if (!analysis) return;

    const planData = {
      duration: selectedPlan,
      overallScore: analysis.overallScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendations: analysis.recommendations,
      developmentAreas: analysis.developmentAreas,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('improvementPlan', JSON.stringify(planData));
    navigate('/improvement-plan');
  };

  const getProfileTitle = (score: number) => {
    if (score >= 85) return "Exceptional Performer";
    if (score >= 75) return "High Achiever";
    if (score >= 65) return "Strong Performer";
    if (score >= 55) return "Developing Talent";
    return "Emerging Potential";
  };

  const getProfileDescription = (score: number) => {
    if (score >= 85) return "You demonstrate exceptional capabilities across personality, memory, and communication. You're well-positioned for leadership roles and complex challenges.";
    if (score >= 75) return "You show strong performance across multiple areas with particular strengths that set you apart. You're ready for advanced responsibilities.";
    if (score >= 65) return "You have solid foundational skills with clear areas of strength. With focused development, you can achieve significant growth.";
    if (score >= 55) return "You show good potential with specific areas that need attention. Targeted improvement will unlock your capabilities.";
    return "You're at the beginning of your development journey with tremendous potential for growth through dedicated practice.";
  };

  const planOptions = [
    {
      duration: 45,
      title: "Intensive Sprint",
      description: "Fast-track improvement with daily focused exercises",
      features: ["Daily 30-min sessions", "Rapid skill building", "Quick wins focus", "High intensity"],
      recommended: false
    },
    {
      duration: 90,
      title: "Balanced Growth",
      description: "Comprehensive development with sustainable progress",
      features: ["3-4 sessions per week", "Balanced approach", "Habit formation", "Sustainable pace"],
      recommended: true
    },
    {
      duration: 180,
      title: "Deep Transformation",
      description: "Thorough development with lasting behavioral change",
      features: ["2-3 sessions per week", "Deep skill integration", "Long-term habits", "Comprehensive growth"],
      recommended: false
    }
  ];

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center">
              <Award className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Complete Development Profile
          </h1>
          <p className="text-gray-300 text-lg">
            Comprehensive analysis across personality, memory, and communication
          </p>
        </div>

        {/* Overall Score and Profile */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                    <circle
                      cx="60" cy="60" r="50"
                      stroke="url(#overallGradient)"
                      strokeWidth="8" fill="none" strokeLinecap="round"
                      strokeDasharray={`${(analysis.overallScore / 100) * 314} 314`}
                    />
                    <defs>
                      <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{analysis.overallScore}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{getProfileTitle(analysis.overallScore)}</h2>
              <p className="text-gray-300">{getProfileDescription(analysis.overallScore)}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-500/20 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Key Strengths ({analysis.strengths.length})</span>
                </h3>
                <div className="space-y-1">
                  {analysis.strengths.slice(0, 3).map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-green-100 text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-orange-500/20 rounded-lg p-4">
                <h3 className="text-orange-400 font-semibold mb-2 flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Growth Areas ({analysis.weaknesses.length})</span>
                </h3>
                <div className="space-y-1">
                  {analysis.weaknesses.slice(0, 3).map((weakness, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-1"></div>
                      <span className="text-orange-100 text-sm">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Detailed Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personality Insights */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-400" />
                <span>Personality Insights</span>
              </h3>
              <div className="space-y-3">
                {analysis.personalityInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Insights */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-400" />
                <span>Memory Insights</span>
              </h3>
              <div className="space-y-3">
                {analysis.memoryInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Insights */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Brain className="h-6 w-6 text-green-400" />
                <span>Communication Insights</span>
              </h3>
              <div className="space-y-3">
                {analysis.communicationInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-yellow-400" />
                <span>Strategic Recommendations</span>
              </h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Development Priority */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Target className="h-6 w-6 text-red-400" />
                <span>Development Priority</span>
              </h3>
              <div className="space-y-4">
                <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/30">
                  <h4 className="text-red-400 font-semibold text-sm mb-1">Primary Focus</h4>
                  <p className="text-white capitalize">{analysis.developmentAreas.primary}</p>
                </div>
                <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-500/30">
                  <h4 className="text-orange-400 font-semibold text-sm mb-1">Secondary Focus</h4>
                  <p className="text-white capitalize">{analysis.developmentAreas.secondary}</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/30">
                  <h4 className="text-yellow-400 font-semibold text-sm mb-1">Maintenance</h4>
                  <p className="text-white capitalize">{analysis.developmentAreas.tertiary}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Award className="h-6 w-6 text-purple-400" />
                <span>Achievement Unlocked</span>
              </h3>
              <div className="text-center">
                <div className="bg-purple-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-white font-semibold">Complete Assessment Suite!</p>
                <p className="text-gray-300 text-sm mt-1">
                  You've completed all three comprehensive assessments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Plan Selection */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-400" />
            <span>Choose Your Development Plan</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {planOptions.map((plan) => (
              <div
                key={plan.duration}
                className={`relative rounded-xl p-6 border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.duration
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-purple-400'
                } ${plan.recommended ? 'ring-2 ring-yellow-400/50' : ''}`}
                onClick={() => setSelectedPlan(plan.duration)}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                      RECOMMENDED
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.duration} Days</h3>
                  <h4 className="text-lg font-semibold text-purple-400 mb-2">{plan.title}</h4>
                  <p className="text-gray-300 text-sm">{plan.description}</p>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                    selectedPlan === plan.duration
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedPlan === plan.duration && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={generateImprovementPlan}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <span>Generate My {selectedPlan}-Day Plan</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;