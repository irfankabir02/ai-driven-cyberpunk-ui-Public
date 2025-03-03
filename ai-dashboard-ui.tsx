import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Camera } from 'lucide-react';
import _ from 'lodash';

// Sample data - in production, this would come from your API
const forecasts = [
  { date: '2025-01', actual: 120, predicted: 118, lower: 110, upper: 126 },
  { date: '2025-02', actual: 132, predicted: 130, lower: 122, upper: 138 },
  { date: '2025-03', actual: 141, predicted: 139, lower: 131, upper: 147 },
  { date: '2025-04', actual: 154, predicted: 152, lower: 144, upper: 160 },
  { date: '2025-05', actual: null, predicted: 165, lower: 157, upper: 173 },
  { date: '2025-06', actual: null, predicted: 178, lower: 170, upper: 186 },
];

const shapValues = [
  { feature: 'Seasonality', value: 0.35, color: '#2E7D32' },
  { feature: 'Previous Month', value: 0.28, color: '#2E7D32' },
  { feature: 'Marketing Spend', value: 0.15, color: '#2E7D32' },
  { feature: 'Competitor Price', value: -0.12, color: '#C62828' },
  { feature: 'Website Traffic', value: 0.09, color: '#2E7D32' },
  { feature: 'Weather Index', value: -0.05, color: '#C62828' },
];

const driftMetrics = [
  { date: '2025-01-15', ks: 0.05, psi: 0.02, kl: 0.03, threshold: 0.1 },
  { date: '2025-01-30', ks: 0.06, psi: 0.02, kl: 0.04, threshold: 0.1 },
  { date: '2025-02-15', ks: 0.07, psi: 0.03, kl: 0.05, threshold: 0.1 },
  { date: '2025-02-28', ks: 0.09, psi: 0.04, kl: 0.08, threshold: 0.1 },
  { date: '2025-03-15', ks: 0.12, psi: 0.11, kl: 0.14, threshold: 0.1 },
  { date: '2025-03-30', ks: 0.08, psi: 0.03, kl: 0.07, threshold: 0.1 },
];

const Dashboard = () => {
  const [activeModel, setActiveModel] = useState('revenue');
  const [showExplanations, setShowExplanations] = useState(true);
  const [driftAlert, setDriftAlert] = useState(false);
  const [retrainingStatus, setRetrainingStatus] = useState('stable');

  useEffect(() => {
    // Detect if any drift metrics exceed threshold
    const latestMetrics = driftMetrics[driftMetrics.length - 1];
    if (latestMetrics.ks > latestMetrics.threshold || 
        latestMetrics.psi > latestMetrics.threshold || 
        latestMetrics.kl > latestMetrics.threshold) {
      setDriftAlert(true);
    } else {
      setDriftAlert(false);
    }
  }, []);

  const handleRetrainModel = () => {
    setRetrainingStatus('retraining');
    setTimeout(() => {
      setRetrainingStatus('completed');
      setDriftAlert(false);
      setTimeout(() => setRetrainingStatus('stable'), 2000);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Prediction & Interpretability System</h1>
          <div className="flex items-center space-x-4">
            <select 
              className="px-3 py-2 bg-indigo-800 rounded-md border border-indigo-600"
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
            >
              <option value="revenue">Revenue Forecasting</option>
              <option value="churn">Customer Churn</option>
              <option value="inventory">Inventory Optimization</option>
            </select>
            {driftAlert && (
              <button 
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                onClick={handleRetrainModel}
              >
                <span>
                  {retrainingStatus === 'stable' ? 'Drift Detected! Retrain?' : 
                   retrainingStatus === 'retraining' ? 'Retraining...' : 
                   'Retraining Complete'}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Prediction Panel */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Revenue Forecast</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecasts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#2E7D32" name="Actual Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="predicted" stroke="#1976D2" name="Predicted Revenue" strokeWidth={2} />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#90CAF9" name="Lower Bound" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="#90CAF9" name="Upper Bound" fillOpacity={0.3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Prediction Metrics</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">MAPE</p>
                  <p className="text-xl font-semibold">3.2%</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-800">R²</p>
                  <p className="text-xl font-semibold">0.94</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-sm text-purple-800">RMSE</p>
                  <p className="text-xl font-semibold">$4.3K</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-md">
                  <p className="text-sm text-amber-800">MAE</p>
                  <p className="text-xl font-semibold">$3.9K</p>
                </div>
              </div>
            </div>
          </div>

          {/* SHAP Explanations Panel */}
          {showExplanations && (
            <div className="col-span-12 lg:col-span-4 bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Model Explanations</h2>
                <button 
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                  onClick={() => setShowExplanations(!showExplanations)}
                >
                  Hide
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">SHAP Feature Importance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={shapValues}
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[-0.2, 0.4]} />
                      <YAxis type="category" dataKey="feature" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill={(entry) => entry.color} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">LIME Local Explanation</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm mb-2">Explanation for prediction on <span className="font-semibold">2025-04</span>:</p>
                  <ul className="text-sm space-y-1">
                    <li className="text-green-700">✓ Strong seasonal uptrend (+12.4%)</li>
                    <li className="text-green-700">✓ Marketing campaign active (+8.7%)</li>
                    <li className="text-red-700">✗ Competitor price decrease (-5.2%)</li>
                    <li className="text-green-700">✓ Website traffic increase (+3.8%)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Model Monitoring Panel */}
          <div className="col-span-12 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Model Drift Monitoring</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={driftMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ks" stroke="#8884d8" name="KS Test" />
                  <Line type="monotone" dataKey="psi" stroke="#82ca9d" name="PSI" />
                  <Line type="monotone" dataKey="kl" stroke="#ffc658" name="KL Divergence" />
                  <Line type="monotone" dataKey="threshold" stroke="#ff0000" name="Alert Threshold" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-md p-3">
                <h3 className="text-sm font-medium text-gray-500">Last Retrained</h3>
                <p className="text-lg">March 15, 2025</p>
              </div>
              <div className="border border-gray-200 rounded-md p-3">
                <h3 className="text-sm font-medium text-gray-500">Model Status</h3>
                <p className={`text-lg ${driftAlert ? 'text-red-600' : 'text-green-600'}`}>
                  {driftAlert ? 'Drift Detected' : 'Stable'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-md p-3">
                <h3 className="text-sm font-medium text-gray-500">Model Version</h3>
                <p className="text-lg">v2.3.7</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          AI Prediction & Interpretability System &copy; 2025
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;