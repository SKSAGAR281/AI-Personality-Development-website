import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, CheckCircle, Clock, Star, TrendingUp, Brain, MessageCircle, Zap, BookOpen, Award } from 'lucide-react';

interface PlanData {
  duration: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  developmentAreas: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  createdAt: string;
}

interface WeeklyGoal {
  week: number;
  title: string;
  description: string;
  exercises: string[];
  focus: string;
  timeCommitment: string;
}

const ImprovementPlan: React.FC = () => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set());

  useEffect(() => {
    const savedPlan = localStorage.getItem('improvementPlan');
    if (savedPlan) {
      const data = JSON.parse(savedPlan);
      setPlanData(data);
      generateWeeklyGoals(data);
      
      // Load completed weeks from localStorage
      const completed = localStorage.getItem('completedWeeks');
      if (completed) {
        setCompletedWeeks(new Set(JSON.parse(completed)));
      }
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const generateWeeklyGoals = (data: PlanData) => {
    const totalWeeks = Math.ceil(data.duration / 7);
    const goals: WeeklyGoal[] = [];

    const exerciseLibrary = {
      personality: {
        extraversion: [
          "Practice initiating conversations with 3 new people",
          "Join a group activity or networking event",
          "Lead a team discussion or presentation",
          "Practice active listening in social situations"
        ],
        agreeableness: [
          "Practice saying 'no' to one request this week",
          "Express a different opinion in a group discussion",
          "Set one clear boundary with a colleague or friend",
          "Practice assertive communication techniques"
        ],
        conscientiousness: [
          "Create and follow a detailed daily schedule",
          "Break one large project into smaller, manageable tasks",
          "Use a task management app for one week",
          "Practice the Pomodoro Technique for focused work"
        ],
        openness: [
          "Try a new hobby or activity",
          "Read about a topic outside your expertise",
          "Attend a workshop or online course",
          "Practice brainstorming without judgment"
        ],
        neuroticism: [
          "Practice 10 minutes of daily meditation",
          "Keep a stress journal and identify triggers",
          "Use deep breathing exercises during stressful moments",
          "Practice positive self-talk and reframing"
        ]
      },
      memory: [
        "Practice the memory palace technique with 10 items",
        "Do 15 minutes of dual n-back training",
        "Memorize a short poem or speech",
        "Practice chunking phone numbers and dates",
        "Use spaced repetition to learn new vocabulary",
        "Play memory games for 20 minutes daily",
        "Practice visualization techniques for remembering names",
        "Create acronyms for lists you need to remember"
      ],
      communication: [
        "Record yourself giving a 2-minute impromptu speech",
        "Practice maintaining eye contact during conversations",
        "Work on eliminating filler words ('um', 'uh')",
        "Practice speaking with varied pace and tone",
        "Join a public speaking group or practice with friends",
        "Practice storytelling with clear beginning, middle, end",
        "Work on confident body posture and gestures",
        "Practice active listening and asking follow-up questions"
      ]
    };

    for (let week = 1; week <= totalWeeks; week++) {
      let focus = '';
      let exercises: string[] = [];
      let timeCommitment = '';

      // Determine focus based on development areas and week
      if (week <= Math.ceil(totalWeeks * 0.4)) {
        // First 40% - Primary focus
        focus = data.developmentAreas.primary;
      } else if (week <= Math.ceil(totalWeeks * 0.7)) {
        // Next 30% - Secondary focus
        focus = data.developmentAreas.secondary;
      } else {
        // Last 30% - Integration and tertiary
        focus = data.developmentAreas.tertiary;
      }

      // Generate exercises based on focus
      if (focus === 'personality') {
        // Determine which personality trait needs most work
        const personalityResults = JSON.parse(localStorage.getItem('personalityResults') || '{}');
        const lowestTrait = Object.entries(personalityResults)
          .sort(([,a], [,b]) => (a as number) - (b as number))[0];
        
        if (lowestTrait && exerciseLibrary.personality[lowestTrait[0] as keyof typeof exerciseLibrary.personality]) {
          exercises = exerciseLibrary.personality[lowestTrait[0] as keyof typeof exerciseLibrary.personality]
            .slice(0, data.duration === 45 ? 3 : data.duration === 90 ? 2 : 2);
        }
      } else if (focus === 'memory') {
        exercises = exerciseLibrary.memory
          .sort(() => Math.random() - 0.5)
          .slice(0, data.duration === 45 ? 3 : data.duration === 90 ? 2 : 2);
      } else if (focus === 'communication') {
        exercises = exerciseLibrary.communication
          .sort(() => Math.random() - 0.5)
          .slice(0, data.duration === 45 ? 3 : data.duration === 90 ? 2 : 2);
      }

      // Set time commitment based on plan duration
      if (data.duration === 45) {
        timeCommitment = "30-45 minutes daily";
      } else if (data.duration === 90) {
        timeCommitment = "20-30 minutes, 4-5 times per week";
      } else {
        timeCommitment = "15-25 minutes, 3-4 times per week";
      }

      const goal: WeeklyGoal = {
        week,
        title: `Week ${week}: ${focus.charAt(0).toUpperCase() + focus.slice(1)} Development`,
        description: getWeekDescription(focus, week, totalWeeks),
        exercises,
        focus,
        timeCommitment
      };

      goals.push(goal);
    }

    setWeeklyGoals(goals);
  };

  const getWeekDescription = (focus: string, week: number, totalWeeks: number) => {
    const phase = week <= Math.ceil(totalWeeks * 0.4) ? 'foundation' : 
                  week <= Math.ceil(totalWeeks * 0.7) ? 'development' : 'integration';

    const descriptions = {
      personality: {
        foundation: "Build awareness of your personality patterns and establish new behavioral habits.",
        development: "Practice new personality-based skills in real-world situations.",
        integration: "Integrate personality insights into your daily interactions and decision-making."
      },
      memory: {
        foundation: "Establish fundamental memory techniques and cognitive training routines.",
        development: "Advance your memory skills with complex exercises and real-world applications.",
        integration: "Apply advanced memory strategies to professional and personal challenges."
      },
      communication: {
        foundation: "Develop core speaking and presentation skills through structured practice.",
        development: "Enhance your communication effectiveness in various contexts and audiences.",
        integration: "Master advanced communication techniques and leadership presence."
      }
    };

    return descriptions[focus as keyof typeof descriptions][phase];
  };

  const toggleWeekCompletion = (week: number) => {
    const newCompleted = new Set(completedWeeks);
    if (newCompleted.has(week)) {
      newCompleted.delete(week);
    } else {
      newCompleted.add(week);
    }
    setCompletedWeeks(newCompleted);
    localStorage.setItem('completedWeeks', JSON.stringify(Array.from(newCompleted)));
  };

  const getProgressPercentage = () => {
    return Math.round((completedWeeks.size / weeklyGoals.length) * 100);
  };

  const getFocusIcon = (focus: string) => {
    switch (focus) {
      case 'personality': return Brain;
      case 'memory': return Zap;
      case 'communication': return MessageCircle;
      default: return Target;
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus) {
      case 'personality': return 'text-purple-400';
      case 'memory': return 'text-blue-400';
      case 'communication': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (!planData) {
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
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Your {planData.duration}-Day Development Plan
          </h1>
          <p className="text-gray-300">
            Personalized improvement journey based on your assessment results
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                  <circle
                    cx="40" cy="40" r="30"
                    stroke="url(#progressGradient)"
                    strokeWidth="6" fill="none" strokeLinecap="round"
                    strokeDasharray={`${(getProgressPercentage() / 100) * 188} 188`}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{getProgressPercentage()}%</span>
                </div>
              </div>
              <p className="text-white font-semibold">Progress</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{completedWeeks.size}</div>
              <p className="text-gray-300">Weeks Completed</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{weeklyGoals.length - completedWeeks.size}</div>
              <p className="text-gray-300">Weeks Remaining</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{planData.duration}</div>
              <p className="text-gray-300">Total Days</p>
            </div>
          </div>
        </div>

        {/* Plan Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Weekly Development Goals</h2>
            <div className="space-y-6">
              {weeklyGoals.map((goal) => {
                const FocusIcon = getFocusIcon(goal.focus);
                const isCompleted = completedWeeks.has(goal.week);
                
                return (
                  <div
                    key={goal.week}
                    className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border transition-all ${
                      isCompleted 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                          goal.focus === 'personality' ? 'from-purple-500 to-pink-500' :
                          goal.focus === 'memory' ? 'from-blue-500 to-cyan-500' :
                          'from-green-500 to-emerald-500'
                        } flex items-center justify-center`}>
                          <FocusIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                          <p className="text-gray-300 text-sm">{goal.description}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleWeekCompletion(goal.week)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-400 hover:border-green-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="h-5 w-5 text-white" />}
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-400 font-medium text-sm">Time Commitment</span>
                        </div>
                        <p className="text-gray-300 text-sm">{goal.timeCommitment}</p>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className={`h-4 w-4 ${getFocusColor(goal.focus)}`} />
                          <span className={`${getFocusColor(goal.focus)} font-medium text-sm capitalize`}>
                            {goal.focus} Focus
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">Primary development area</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Weekly Exercises:</h4>
                      <div className="space-y-2">
                        {goal.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm">{exercise}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span>Development Focus</span>
              </h3>
              <div className="space-y-3">
                <div className="bg-red-500/20 rounded-lg p-3">
                  <h4 className="text-red-400 font-semibold text-sm mb-1">Primary (Weeks 1-{Math.ceil(weeklyGoals.length * 0.4)})</h4>
                  <p className="text-white capitalize">{planData.developmentAreas.primary}</p>
                </div>
                <div className="bg-orange-500/20 rounded-lg p-3">
                  <h4 className="text-orange-400 font-semibold text-sm mb-1">Secondary (Weeks {Math.ceil(weeklyGoals.length * 0.4) + 1}-{Math.ceil(weeklyGoals.length * 0.7)})</h4>
                  <p className="text-white capitalize">{planData.developmentAreas.secondary}</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-3">
                  <h4 className="text-yellow-400 font-semibold text-sm mb-1">Integration (Weeks {Math.ceil(weeklyGoals.length * 0.7) + 1}-{weeklyGoals.length})</h4>
                  <p className="text-white capitalize">{planData.developmentAreas.tertiary}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <span>Success Tips</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300 text-sm">Set aside dedicated time each day for practice</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300 text-sm">Track your progress and celebrate small wins</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300 text-sm">Be patient with yourself - growth takes time</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300 text-sm">Apply new skills in real-world situations</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Award className="h-6 w-6 text-purple-400" />
                <span>Milestone Rewards</span>
              </h3>
              <div className="space-y-2">
                <div className={`flex items-center space-x-2 ${getProgressPercentage() >= 25 ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">25% Complete - Foundation Built</span>
                </div>
                <div className={`flex items-center space-x-2 ${getProgressPercentage() >= 50 ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">50% Complete - Habits Forming</span>
                </div>
                <div className={`flex items-center space-x-2 ${getProgressPercentage() >= 75 ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">75% Complete - Skills Developing</span>
                </div>
                <div className={`flex items-center space-x-2 ${getProgressPercentage() >= 100 ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">100% Complete - Transformation!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/final-report')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            View Full Report
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovementPlan;