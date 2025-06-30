import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PersonalityAssessment from './pages/PersonalityAssessment';
import MemoryAssessment from './pages/MemoryAssessment';
import SpeechAssessment from './pages/SpeechAssessment';
import PersonalityResults from './pages/PersonalityResults';
import MemoryResults from './pages/MemoryResults';
import SpeechResults from './pages/SpeechResults';
import FinalReport from './pages/FinalReport';
import ImprovementPlan from './pages/ImprovementPlan';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/assessment/personality" element={
              <ProtectedRoute>
                <PersonalityAssessment />
              </ProtectedRoute>
            } />
            <Route path="/assessment/personality/results" element={
              <ProtectedRoute>
                <PersonalityResults />
              </ProtectedRoute>
            } />
            <Route path="/assessment/memory" element={
              <ProtectedRoute>
                <MemoryAssessment />
              </ProtectedRoute>
            } />
            <Route path="/assessment/memory/results" element={
              <ProtectedRoute>
                <MemoryResults />
              </ProtectedRoute>
            } />
            <Route path="/assessment/speech" element={
              <ProtectedRoute>
                <SpeechAssessment />
              </ProtectedRoute>
            } />
            <Route path="/assessment/speech/results" element={
              <ProtectedRoute>
                <SpeechResults />
              </ProtectedRoute>
            } />
            <Route path="/final-report" element={
              <ProtectedRoute>
                <FinalReport />
              </ProtectedRoute>
            } />
            <Route path="/improvement-plan" element={
              <ProtectedRoute>
                <ImprovementPlan />
              </ProtectedRoute>
            } />
            <Route path="/assessments" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <Navigate to="/improvement-plan" replace />
              </ProtectedRoute>
            } />
            <Route path="/plan" element={
              <ProtectedRoute>
                <Navigate to="/final-report" replace />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;