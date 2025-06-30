import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, BarChart3, Shield, Users, Zap } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms assess your personality, memory, and communication skills with scientific precision.'
    },
    {
      icon: Target,
      title: 'Personalized Plans',
      description: 'Get custom 90-day improvement plans tailored to your unique strengths and areas for growth.'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your development journey with detailed analytics and milestone celebrations.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We prioritize your privacy above all else.'
    },
    {
      icon: Users,
      title: 'Expert-Designed',
      description: 'Created by psychology and AI experts using proven assessment methodologies.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get immediate feedback and insights from your assessments with actionable recommendations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">MindDev AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Unlock Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {' '}Full Potential
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your personality, memory, and communication skills with AI-powered assessments 
            and personalized improvement plans designed by experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose MindDev AI?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge AI with proven psychological 
              frameworks to deliver unparalleled personal development insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of users who have already started their personal development journey.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;