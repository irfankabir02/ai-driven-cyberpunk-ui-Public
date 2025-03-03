import React, { useState, useEffect } from 'react';
import { Sun, Moon, Target, Star, Award, Activity, Zap } from 'lucide-react';

const TeachingDashboard = () => {
  // Primary parameters (set by teacher)
  const [attentionDrift, setAttentionDrift] = useState(8);
  const [trialErrors, setTrialErrors] = useState(8);
  
  // Secondary parameters (calculated based on primary)
  const [creativity, setCreativity] = useState(5);
  const [visualization, setVisualization] = useState(5);
  const [interactivity, setInteractivity] = useState(5);
  
  // Theme toggle
  const [darkMode, setDarkMode] = useState(false);
  
  // Character selection
  const [character, setCharacter] = useState('robot');
  const characters = ['robot', 'animal', 'wizard'];
  
  // Update secondary parameters when primary change
  useEffect(() => {
    // Creativity increases with trial/errors, decreases with attention drift
    setCreativity(Math.min(10, Math.max(1, 5 + (trialErrors/2) - (attentionDrift/4))));
    
    // Visualization increases with attention drift (to help focus)
    setVisualization(Math.min(10, Math.max(1, attentionDrift * 0.8)));
    
    // Interactivity increases with both parameters
    setInteractivity(Math.min(10, Math.max(1, (attentionDrift + trialErrors) / 2)));
  }, [attentionDrift, trialErrors]);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const bgColor = darkMode ? 'bg-slate-800' : 'bg-blue-50';
  const textColor = darkMode ? 'text-white' : 'text-slate-800';
  
  const getEmoji = (value) => {
    if (value >= 8) return '😃';
    if (value >= 5) return '🙂';
    return '😐';
  };
  
  // Simple animation for kids
  const [bounce, setBounce] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`p-6 rounded-xl shadow-lg ${bgColor} ${textColor} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Learning Buddy</h1>
        <button 
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          onClick={toggleTheme}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Character selection */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Choose Your AI Friend</h2>
          <div className="flex justify-around">
            <button 
              onClick={() => setCharacter('robot')} 
              className={`p-3 rounded-lg ${character === 'robot' ? 'bg-blue-200 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-600'}`}
            >
              <div className={`text-4xl ${bounce ? 'animate-bounce' : ''}`}>🤖</div>
              <div>Robot</div>
            </button>
            <button 
              onClick={() => setCharacter('animal')} 
              className={`p-3 rounded-lg ${character === 'animal' ? 'bg-blue-200 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-600'}`}
            >
              <div className={`text-4xl ${bounce ? 'animate-bounce' : ''}`}>🦊</div>
              <div>Animal</div>
            </button>
            <button 
              onClick={() => setCharacter('wizard')} 
              className={`p-3 rounded-lg ${character === 'wizard' ? 'bg-blue-200 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-600'}`}
            >
              <div className={`text-4xl ${bounce ? 'animate-bounce' : ''}`}>🧙</div>
              <div>Wizard</div>
            </button>
          </div>
        </div>
        
        {/* Emotion meter */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">How Are You Feeling?</h2>
          <div className="flex justify-around text-4xl">
            <button className="hover:scale-125 transition-transform">😃</button>
            <button className="hover:scale-125 transition-transform">🙂</button>
            <button className="hover:scale-125 transition-transform">😐</button>
            <button className="hover:scale-125 transition-transform">😕</button>
            <button className="hover:scale-125 transition-transform">😢</button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Teacher Controls</h2>
        
        {/* Primary Parameters */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="font-medium">Attention Drift</label>
            <span>{getEmoji(attentionDrift)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={attentionDrift}
            onChange={(e) => setAttentionDrift(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="font-medium">Trial & Errors</label>
            <span>{getEmoji(trialErrors)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={trialErrors}
            onChange={(e) => setTrialErrors(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">AI Buddy Settings</h2>
        
        {/* Secondary Parameters (auto-adjusted) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Zap className="mr-2" size={18} />
                <span>Creativity</span>
              </div>
              <span className="text-lg">{Math.round(creativity)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${creativity * 10}%` }}></div>
            </div>
          </div>
          
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="mr-2" size={18} />
                <span>Visualization</span>
              </div>
              <span className="text-lg">{Math.round(visualization)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-purple-400 h-2.5 rounded-full" style={{ width: `${visualization * 10}%` }}></div>
            </div>
          </div>
          
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Activity className="mr-2" size={18} />
                <span>Interactivity</span>
              </div>
              <span className="text-lg">{Math.round(interactivity)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${interactivity * 10}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg transition-all text-lg">
          Start Learning Adventure!
        </button>
      </div>
    </div>
  );
};

export default TeachingDashboard;
