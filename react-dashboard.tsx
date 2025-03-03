import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, RefreshCw, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// Main Dashboard Component
const AIPredictionDashboard = () => {
  // State management
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [driftStatus, setDriftStatus] = useState({ detected: false, retraining: false });
  const [predictionInput, setPredictionInput] = useState({});
  const [lastPrediction, setLastPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(30);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        // In a real app, replace with actual API endpoint
        const response = await fetch('/api/models');
        const data = await response.json();
        
        // For demo, use mock data if API is not available
        const models = Object.keys(data).length > 0 ? data : {
          'revenue_forecast': { 
            name: 'Revenue Forecast', 
            type: 'prophet',
            task: 'regression',
            features: ['date', 'marketing_spend', 'seasonality', 'holiday_factor']
          },
          'churn_prediction': { 
            name: 'Customer Churn', 
            type: 'xgboost',
            task: 'classification',
            features: ['tenure', 'monthly_charges', 'total_charges', 'contract', 'payment_method', 'internet_service']
          }
        };
        
        setAvailableModels(models);
        if (Object.keys(models).length > 0) {
          setSelectedModel(Object.keys(models)[0]);
        }
      } catch (err) {
        setError('Failed to fetch models. Please try again later.');
        console.error('Error fetching models:', err);
      }
    };
    
    fetchModels();
  }, []);
  
  // Fetch model details when selected model changes
  useEffect(() => {
    if (!selectedModel) return;
    
    const fetchModelInfo = async () => {
      try {
        // In a real app, replace with actual API endpoint
        const response = await fetch(`/api/models/${selectedModel}`);
        const data = await response.json();
        
        // For demo, use mock data if API is not available
        const modelData = response.ok ? data : availableModels[selectedModel];
        setModelInfo(modelData);
        
        // Initialize prediction input based on model features
        const initialInput = {};
        if (modelData.features) {
          modelData.features.forEach(feature => {
            initialInput[feature] = '';
          });
        }
        setPredictionInput(initialInput);
      } catch (err) {
        setError(`Failed to fetch details for model: ${selectedModel}`);
        console.error('Error fetching model info:', err);
      }
    };
    
    fetchModelInfo();
    
    // Also fetch performance data for this model
    fetchPerformanceData();
  }, [selectedModel, availableModels]);
  
  // Set up periodic refresh for performance data
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedModel) {
        fetchPerformanceData();
      }
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [selectedModel, refreshInterval]);
  
  // Fetch performance and drift status
  const fetchPerformanceData = useCallback(async () => {
    if (!selectedModel) return;
    
    try {
      // In a real app, replace with actual API endpoint
      const response = await fetch(`/api/performance/${selectedModel}`);
      
      // For demo, use mock data if API is not available
      const mockData = {
        model_id: selectedModel,
        metrics: {
          recent_predictions: Array(20).fill(0).map((_, i) => 50 + Math.random() * 10 * (i % 2 === 0 ? 1 : -1)),
          accuracy_over_time: Array(10).fill(0).map((_, i) => ({ 
            timestamp: new Date(Date.now() - (9-i) * 86400000).toISOString().split('T')[0],
            accuracy: 0.85 + Math.random() * 0.1
          }))
        },
        drift_detected: Math.random() > 0.8,
        retraining_status: Math.random() > 0.7 && Math.random() > 0.8
      };
      
      const data = response.ok ? await response.json() : mockData;
      
      // Update dashboard with performance data
      setDriftStatus({
        detected: data.drift_detected,
        retraining: data.retraining_status
      });
      
      // Update prediction history chart
      if (data.metrics && data.metrics.recent_predictions) {
        const chartData = data.metrics.recent_predictions.slice(-20).map((value, index) => ({
          id: index,
          value: value
        }));
        setPredictionData(chartData);
      }
      
    } catch (err) {
      console.error('Error fetching performance data:', err);
      // Don't show error for background refreshes to avoid disrupting the UI
    }
  }, [selectedModel]);
  
  // Handle prediction form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPredictionInput(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle prediction form submission
  const handlePredictionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare prediction request
      const requestData = {
        model_id: selectedModel,
        features: predictionInput,
        explanation_method: 'shap',
        num_features: 10
      };
      
      // In a real app, replace with actual API endpoint
      // const response = await fetch('/api/predict', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(requestData)
      // });
      
      // For demo, simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response data
      const mockResponse = {
        model_id: selectedModel,
        prediction: modelInfo.task === 'classification' 
          ? Math.random() > 0.7 
          : 100 + Math.random() * 50,
        explanation: {
          feature_importance: Object.fromEntries(
            (modelInfo.features || []).map((feature, i) => [
              feature, 
              Math.random() * (10 - i) / 10
            ]).sort((a, b) => b[1] - a[1])
          ),
          shap_values: Array(modelInfo.features?.length || 0).fill(0).map(() => Math.random() * 2 - 1)
        },
        drift_detected: Math.random() > 0.8,
        timestamp: new Date().toISOString()
      };
      
      // const data = await response.json();
      const data = mockResponse;
      
      // Update UI with prediction result
      setLastPrediction(data);
      
      // Update feature importance chart
      const importanceData = Object.entries(data.explanation.feature_importance).map(([name, value]) => ({
        name,
        value: Math.abs(value)
      })).sort((a, b) => b.value - a.value).slice(0, 10);
      
      setFeatureImportance(importanceData);
      
      // Add prediction to chart
      setPredictionData(prev => {
        const newData = [...prev, {
          id: prev.length,
          value: typeof data.prediction === 'number' ? data.prediction : 1
        }];
        return newData.slice(-20); // Keep only last 20 points
      });
      
      // Update drift status
      setDriftStatus(prev => ({
        ...prev,
        detected: data.drift_detected
      }));
      
    } catch (err) {
      setError('Failed to make prediction. Please try again.');
      console.error('Error making prediction:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI-Powered Predictive Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Auto-refresh: {refreshInterval}s</span>
          <select 
            value={refreshInterval} 
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>
        </div>
      </div>
      
      {/* Model Selection */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold mb-2 sm:mb-0">Model Selection</h2>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border rounded p-2 w-full sm:w-auto"
            >
              {Object.entries(availableModels).map(([id, info]) => (
                <option key={id} value={id}>{info.name || id}</option>
              ))}
            </select>
            <button 
              onClick={fetchPerformanceData}
              className="flex items-center space-x-1 p-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`bg-white p-4 rounded-lg shadow flex items-center space-x-3 ${driftStatus.detected ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'}`}>
          {driftStatus.detected 
            ? <AlertTriangle size={24} className="text-yellow-500" /> 
            : <CheckCircle size={24} className="text-green-500" />}
          <div>
            <h3 className="font-medium">Model Drift Status</h3>
            <p className="text-sm text-gray-500">
              {driftStatus.detected ? 'Drift detected' : 'No drift detected'}
            </p>
          </div>
        </div>
        
        <div className={`bg-white p-4 rounded-lg shadow flex items-center space-x-3 ${driftStatus.retraining ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-300'}`}>
          {driftStatus.retraining 
            ? <RefreshCw size={24} className="text-blue-500 animate-spin" /> 
            : <Clock size={24} className="text-gray-500" />}
          <div>
            <h3 className="font-medium">Training Status</h3>
            <p className="text-sm text-gray-500">
              {driftStatus.retraining ? 'Retraining in progress' : 'Model up to date'}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3 border-l-4 border-purple-500">
          <TrendingUp size={24} className="text-purple-500" />
          <div>
            <h3 className="font-medium">Model Type</h3>
            <p className="text-sm text-gray-500">{modelInfo.type || 'Unknown'}</p>
            <p className="text-xs text-gray-400">{modelInfo.task || 'Task not specified'}</p>
          </div>
        </div>
      </div>
      
      {/* Prediction Input Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Make a Prediction</h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handlePredictionSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {modelInfo.features && modelInfo.features.map(feature => (
              <div key={feature} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {feature.charAt(0).toUpperCase() + feature.slice(1).replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  name={feature}
                  value={predictionInput[feature] || ''}
                  onChange={handleInputChange}
                  className="border rounded p-2"
                  placeholder={`Enter ${feature}`}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Run Prediction'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Prediction Results */}
      {lastPrediction && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Prediction Result</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Prediction Value */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Prediction</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {typeof lastPrediction.prediction === 'number' 
                    ? lastPrediction.prediction.toFixed(2)
                    : lastPrediction.prediction.toString()}
                </span>
                {modelInfo.task === 'classification' && (
                  <span className={`ml-2 text-sm font-medium ${lastPrediction.prediction ? 'text-red-500' : 'text-green-500'}`}>
                    {lastPrediction.prediction ? 'Positive' : 'Negative'}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Prediction made at {new Date(lastPrediction.timestamp).toLocaleTimeString()}
              </p>
            </div>
            
            {/* Feature Importance */}
            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Feature Importance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    tick={{fontSize: 12}}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {/* Prediction History Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Prediction History</h2>
        
        <Responsive