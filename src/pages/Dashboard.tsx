import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Clock, TrendingUp, Target, Calendar, Award, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { Assessment } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);
  const [stats, setStats] = useState({
    completedAssessments: 0,
    averageScore: 0,
    improvementDays: 0,
    currentStreak: 7
  });

  useEffect(() => {
    // Check which assessments are completed
    const personalityResults = localStorage.getItem('personalityResults');
    const memoryResults = localStorage.getItem('memoryResults');
    const speechResults = localStorage.getItem('speechResults');
    
    const completed = [];
    if (personalityResults) completed.push('personality');
    if (memoryResults) completed.push('memory');
    if (speechResults) completed.push('speech');
    
    setCompletedAssessments(completed);

    // Load assessment data
    const mockAssessments: Assessment[] = [
      {
        id: '1',
        type: 'personality',
        title: 'Big Five Personality Test',
        description: 'Comprehensive personality analysis based on the Big Five model',
        duration: '15 min',
        completed: completed.includes('personality')
      },
      {
        id: '2',
        type: 'memory',
        title: 'Memory Power Assessment',
        description: 'Evaluate your short-term, long-term, and working memory capabilities',
        duration: '20 min',
        completed: completed.includes('memory')
      },
      {
        id: '3',
        type: 'speech',
        title: 'Communication Analysis',
        description: 'Assess your speech patterns and body language through video analysis',
        duration: '10 min',
        completed: completed.includes('speech')
      }
    ];

    setAssessments(mockAssessments);
    
    // Calculate stats
    const completedCount = completed.length;
    let averageScore = 0;
    
    if (completedCount > 0) {
      let totalScore = 0;
      if (personalityResults) {
        const personality = JSON.parse(personalityResults);
        totalScore += Object.values(personality).reduce((sum: number, val: number) => sum + val, 0) / 5;
      }
      if (memoryResults) {
        const memory = JSON.parse(memoryResults);
        totalScore += memory.overall;
      }
      if (speechResults) {
        const speech = JSON.parse(speechResults);
        totalScore += speech.overall;
      }
      averageScore = Math.round(totalScore / completedCount);
    }
    
    setStats({
      completedAssessments: completedCount,
      averageScore,
      improvementDays: completedCount > 0 ? 7 : 0,
      currentStreak: 7
    });
  }, []);

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case 'personality':
        return Brain;
      case 'memory':
        return Target;
      case 'speech':
        return TrendingUp;
      default:
        return Brain;
    }
  };

  const getAssessmentColor = (type: string) => {
    switch (type) {
      case 'personality':
        return 'from-purple-500 to-pink-500';
      case 'memory':
        return 'from-blue-500 to-cyan-500';
      case 'speech':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const allAssessmentsCompleted = completedAssessments.length === 3;

  return (
    <div className="px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-300">
          Continue your personal development journey with AI-powered insights.
        </p>
      </div>

      {/* Final Report CTA */}
      {allAssessmentsCompleted && (
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  🎉 All Assessments Complete!
                </h3>
                <p className="text-gray-300">
                  Generate your comprehensive final report and personalized improvement plan
                </p>
              </div>
            </div>
            <Link
              to="/final-report"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
            >
              <span>View Final Report</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completedAssessments}/3</p>
            </div>
            <Award className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-white">
                {stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Days Active</p>
              <p className="text-2xl font-bold text-white">{stats.improvementDays}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
            </div>
            <Target className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Assessments Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Assessments</h2>
          <div className="text-gray-300 text-sm">
            {completedAssessments.length}/3 completed
          </div>
        </div>

        <div className="space-y-4">
          {assessments.map((assessment) => {
            const Icon = getAssessmentIcon(assessment.type);
            const colorClass = getAssessmentColor(assessment.type);
            
            return (
              <div
                key={assessment.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>{assessment.title}</span>
                        {assessment.completed && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {assessment.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{assessment.duration}</span>
                        </div>
                        {assessment.completed && (
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {assessment.completed && (
                      <Link
                        to={`/assessment/${assessment.type}/results`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        View Results
                      </Link>
                    )}
                    <Link
                      to={`/assessment/${assessment.type}`}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        assessment.completed
                          ? 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      }`}
                    >
                      {assessment.completed ? 'Retake' : 'Start'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Assessment Progress</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Overall Progress</span>
            <span className="text-white">{Math.round((completedAssessments.length / 3) * 100)}%</span>
          </div>
          <div className="bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(completedAssessments.length / 3) * 100}%` }}
            />
          </div>
          <p className="text-gray-300 text-sm">
            {completedAssessments.length === 0 && "Start your first assessment to begin your development journey"}
            {completedAssessments.length === 1 && "Great start! Complete the remaining assessments to unlock your full profile"}
            {completedAssessments.length === 2 && "Almost there! One more assessment to complete your comprehensive analysis"}
            {completedAssessments.length === 3 && "🎉 All assessments complete! View your final report and improvement plan"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;