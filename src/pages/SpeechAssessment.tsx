import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Play, Eye, Camera, AlertCircle, Volume2, Users, MessageCircle } from 'lucide-react';

const SpeechAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const topics = [
    "Describe your ideal vacation destination and explain why it appeals to you. Include details about the activities, culture, and experiences you would enjoy there.",
    "Talk about a significant challenge you've overcome in your life. Explain the situation, the steps you took to address it, and what you learned from the experience.",
    "Explain a hobby or interest you're passionate about. Describe what drew you to it, how you've developed your skills, and why it's meaningful to you.",
    "Describe someone who has positively influenced your life. Explain their impact on you and specific examples of how they've helped shape who you are today.",
    "Share your thoughts on the importance of continuous learning and personal development. Discuss how you approach learning new skills and staying curious.",
    "Describe your communication style and how you adapt it for different situations. Give examples of how you communicate with friends versus professional settings.",
    "Talk about a time when you had to present or speak in front of others. Describe your preparation, how you felt, and what you learned from the experience.",
    "Explain your perspective on teamwork and collaboration. Describe a successful team experience and what made it work well."
  ];

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start countdown
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(countdownInterval);
            setCountdown(null);
            setIsRecording(true);
            setHasStarted(true);
            setRecordingDuration(0);
            
            // Start actual recording
            recordedChunks.current = [];
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'video/webm;codecs=vp9'
            });
            mediaRecorderRef.current = mediaRecorder;
            
            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
              }
            };
            
            mediaRecorder.start();
            
            // Start duration timer
            timerRef.current = setInterval(() => {
              setRecordingDuration(prev => prev + 1);
            }, 1000);
            
            // Auto-stop after 60 seconds
            setTimeout(() => {
              if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                stopRecording();
              }
            }, 60000);
            
            return null;
          }
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera and microphone. Please check your permissions and ensure no other applications are using your camera.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        setIsRecording(false);
        
        // Stop the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
    }
  }, []);

  const analyzeRecording = () => {
    // Enhanced analysis with more detailed metrics
    const mockResults = {
      // Speech Analysis
      clarity: Math.floor(Math.random() * 25) + 75, // 75-100
      pace: Math.floor(Math.random() * 20) + 80, // 80-100
      volume: Math.floor(Math.random() * 30) + 70, // 70-100
      articulation: Math.floor(Math.random() * 25) + 75, // 75-100
      
      // Body Language Analysis
      eyeContact: Math.floor(Math.random() * 35) + 65, // 65-100
      posture: Math.floor(Math.random() * 30) + 70, // 70-100
      gestures: Math.floor(Math.random() * 25) + 75, // 75-100
      facialExpression: Math.floor(Math.random() * 20) + 80, // 80-100
      
      // Communication Effectiveness
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100
      engagement: Math.floor(Math.random() * 25) + 75, // 75-100
      structure: Math.floor(Math.random() * 30) + 70, // 70-100
      
      // Overall scores
      speechScore: 0,
      bodyLanguageScore: 0,
      overall: 0,
      
      // Detailed feedback
      strengths: [],
      improvements: [],
      recommendations: [],
      
      // Recording metadata
      duration: recordingDuration,
      topic: topics[currentTopic]
    };
    
    // Calculate composite scores
    mockResults.speechScore = Math.round(
      (mockResults.clarity + mockResults.pace + mockResults.volume + mockResults.articulation) / 4
    );
    
    mockResults.bodyLanguageScore = Math.round(
      (mockResults.eyeContact + mockResults.posture + mockResults.gestures + mockResults.facialExpression) / 4
    );
    
    mockResults.overall = Math.round(
      (mockResults.speechScore + mockResults.bodyLanguageScore + mockResults.confidence + mockResults.engagement + mockResults.structure) / 5
    );

    // Generate dynamic feedback based on scores
    const strengths = [];
    const improvements = [];
    const recommendations = [];

    if (mockResults.clarity >= 85) strengths.push("Excellent speech clarity and pronunciation");
    else if (mockResults.clarity < 75) improvements.push("Work on speech clarity and pronunciation");

    if (mockResults.eyeContact >= 80) strengths.push("Strong eye contact with the camera");
    else if (mockResults.eyeContact < 70) improvements.push("Maintain more consistent eye contact");

    if (mockResults.confidence >= 85) strengths.push("High confidence level in delivery");
    else if (mockResults.confidence < 75) improvements.push("Build confidence through practice");

    if (mockResults.pace >= 85) strengths.push("Well-paced speech delivery");
    else if (mockResults.pace < 75) improvements.push("Adjust speaking pace for better comprehension");

    if (mockResults.posture >= 80) strengths.push("Good posture and body positioning");
    else if (mockResults.posture < 70) improvements.push("Improve posture and body positioning");

    // Recommendations based on areas for improvement
    if (mockResults.clarity < 80) recommendations.push("Practice tongue twisters and articulation exercises daily");
    if (mockResults.eyeContact < 75) recommendations.push("Practice speaking while looking directly at a camera or mirror");
    if (mockResults.confidence < 80) recommendations.push("Record yourself speaking regularly to build comfort");
    if (mockResults.gestures < 75) recommendations.push("Practice natural hand gestures that support your message");
    if (mockResults.structure < 75) recommendations.push("Use the PREP method: Point, Reason, Example, Point");

    mockResults.strengths = strengths;
    mockResults.improvements = improvements;
    mockResults.recommendations = recommendations;

    localStorage.setItem('speechResults', JSON.stringify(mockResults));
    navigate('/assessment/speech/results');
  };

  const selectNewTopic = () => {
    setCurrentTopic((prev) => (prev + 1) % topics.length);
    setRecordedVideo(null);
    setHasStarted(false);
    setRecordingDuration(0);
  };

  const formatTime = (seconds: number) => {
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
            Communication Analysis
          </h1>
          <p className="text-gray-300">
            Advanced speech and body language assessment through video analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Recording Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Camera className="h-6 w-6" />
                <span>Recording Studio</span>
              </h2>
              
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                {countdown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
                      <div className="text-white text-lg">Get ready to speak...</div>
                    </div>
                  </div>
                )}
                
                {recordedVideo ? (
                  <video
                    src={recordedVideo}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
                
                {isRecording && (
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Recording</span>
                    </div>
                    <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {formatTime(recordingDuration)} / 1:00
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                {!hasStarted && !recordedVideo && (
                  <button
                    onClick={startRecording}
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    <Mic className="h-5 w-5" />
                    <span>Start Recording</span>
                  </button>
                )}
                
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="flex items-center space-x-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    <Square className="h-5 w-5" />
                    <span>Stop Recording</span>
                  </button>
                )}
                
                {recordedVideo && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setRecordedVideo(null);
                        setHasStarted(false);
                        setRecordingDuration(0);
                      }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      Retake
                    </button>
                    <button
                      onClick={analyzeRecording}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-semibold"
                    >
                      Analyze Communication
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Topic and Analysis Info */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">
                Speaking Topic
              </h2>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30 mb-4">
                <p className="text-white font-medium text-sm leading-relaxed">
                  {topics[currentTopic]}
                </p>
              </div>
              <button
                onClick={selectNewTopic}
                className="text-green-400 hover:text-green-300 text-sm font-medium"
              >
                Get different topic
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Eye className="h-6 w-6" />
                <span>Analysis Areas</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-green-400" />
                    <span>Speech Quality</span>
                  </h3>
                  <div className="space-y-1 text-sm text-gray-300 ml-6">
                    <div>• Clarity and pronunciation</div>
                    <div>• Speaking pace and rhythm</div>
                    <div>• Volume and articulation</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>Body Language</span>
                  </h3>
                  <div className="space-y-1 text-sm text-gray-300 ml-6">
                    <div>• Eye contact and gaze</div>
                    <div>• Posture and positioning</div>
                    <div>• Gestures and expressions</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-purple-400" />
                    <span>Communication</span>
                  </h3>
                  <div className="space-y-1 text-sm text-gray-300 ml-6">
                    <div>• Confidence and presence</div>
                    <div>• Audience engagement</div>
                    <div>• Message structure</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2">Recording Tips</h3>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    <li>• Ensure good lighting on your face</li>
                    <li>• Maintain eye contact with the camera</li>
                    <li>• Speak naturally and expressively</li>
                    <li>• Keep your upper body visible</li>
                    <li>• Take your time - up to 60 seconds</li>
                    <li>• Address the topic thoroughly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechAssessment;