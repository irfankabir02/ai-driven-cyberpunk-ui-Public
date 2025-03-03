import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AutomationDashboard = () => {
  // Sample data for the dashboard
  const [apiResponseData, setApiResponseData] = useState([
    { name: '00:00', success: 95, failure: 5 },
    { name: '04:00', success: 97, failure: 3 },
    { name: '08:00', success: 90, failure: 10 },
    { name: '12:00', success: 85, failure: 15 },
    { name: '16:00', success: 93, failure: 7 },
    { name: '20:00', success: 96, failure: 4 },
  ]);

  const [processingTimeData, setProcessingTimeData] = useState([
    { name: 'Web Scraping', time: 2.4 },
    { name: 'Data Extraction', time: 1.8 },
    { name: 'API Calls', time: 0.9 },
    { name: 'AI Processing', time: 3.2 },
    { name: 'Data Transformation', time: 1.5 },
    { name: 'Dashboard Update', time: 0.7 },
  ]);

  const [resourceUsageData, setResourceUsageData] = useState([
    { name: '00:00', cpu: 45, memory: 30, disk: 20 },
    { name: '04:00', cpu: 55, memory: 40, disk: 22 },
    { name: '08:00', cpu: 75, memory: 60, disk: 25 },
    { name: '12:00', cpu: 85, memory: 70, disk: 30 },
    { name: '16:00', cpu: 65, memory: 55, disk: 28 },
    { name: '20:00', cpu: 50, memory: 45, disk: 23 },
  ]);

  const [taskDistributionData, setTaskDistributionData] = useState([
    { name: 'Web Scraping', value: 20 },
    { name: 'Data Processing', value: 30 },
    { name: 'API Integration', value: 15 },
    { name: 'AI Processing', value: 25 },
    { name: 'Reporting', value: 10 },
  ]);

  const [metricsData, setMetricsData] = useState({
    totalTasks: 1287,
    completedTasks: 1253,
    failedTasks: 34,
    averageResponseTime: '1.8s',
    uptime: '99.8%',
    activeWorkers: 8
  });

  const [recentLogs, setRecentLogs] = useState([
    { time: '14:32:05', level: 'INFO', message: 'API integration completed successfully' },
    { time: '14:30:22', level: 'WARNING', message: 'High memory usage detected' },
    { time: '14:28:15', level: 'ERROR', message: 'Database connection timeout' },
    { time: '14:25:03', level: 'INFO', message: 'New data source added to ETL pipeline' },
    { time: '14:22:47', level: 'INFO', message: 'AI model retraining completed' },
  ]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const ERROR_COLOR = '#FF5252';

  // Simulating real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update API response data
      setApiResponseData(prevData => {
        const newData = [...prevData];
        const lastItem = newData[newData.length - 1];
        const successRate = Math.min(Math.max(lastItem.success + (Math.random() * 6 - 3), 80), 100);
        const failureRate = 100 - successRate;
        
        // Shift data and add new point
        newData.shift();
        newData.push({
          name: new Date().getHours() + ':' + new Date().getMinutes(),
          success: Math.round(successRate),
          failure: Math.round(failureRate)
        });
        
        return newData;
      });
      
      // Update resource usage data
      setResourceUsageData(prevData => {
        const newData = [...prevData];
        const lastItem = newData[newData.length - 1];
        
        // Shift data and add new point
        newData.shift();
        newData.push({
          name: new Date().getHours() + ':' + new Date().getMinutes(),
          cpu: Math.min(Math.max(lastItem.cpu + (Math.random() * 15 - 7), 30), 95),
          memory: Math.min(Math.max(lastItem.memory + (Math.random() * 10 - 5), 25), 90),
          disk: Math.min(Math.max(lastItem.disk + (Math.random() * 5 - 2), 15), 40)
        });
        
        return newData;
      });
      
      // Update metrics
      setMetricsData(prevMetrics => {
        const newTasks = Math.floor(Math.random() * 5);
        const newFailed = Math.random() > 0.9 ? 1 : 0;
        
        return {
          ...prevMetrics,
          totalTasks: prevMetrics.totalTasks + newTasks,
          completedTasks: prevMetrics.completedTasks + newTasks - newFailed,
          failedTasks: prevMetrics.failedTasks + newFailed,
          activeWorkers: Math.min(Math.max(prevMetrics.activeWorkers + (Math.random() > 0.7 ? 1 : -1), 5), 12)
        };
      });
      
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">AI Automation Performance Dashboard</h1>
      
      {/* Top metrics cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Tasks</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-800">{metricsData.totalTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-xl font-bold text-green-600">{metricsData.completedTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Failed</p>
              <p className="text-xl font-bold text-red-500">{metricsData.failedTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">System Status</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">Response Time</p>
              <p className="text-xl font-bold text-gray-800">{metricsData.averageResponseTime}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-xl font-bold text-green-600">{metricsData.uptime}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Active Workers</h2>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{metricsData.activeWorkers}</p>
              <p className="text-xs text-gray-500">Processing instances</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* API Response Rate Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">API Response Success Rate</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={apiResponseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="success" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.8} />
                <Area type="monotone" dataKey="failure" stackId="1" stroke="#FF5252" fill="#FF5252" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Resource Usage Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Resource Usage</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resourceUsageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" />
                <Line type="monotone" dataKey="disk" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Task Processing Time */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Task Processing Time (seconds)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processingTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#8884d8">
                  {processingTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Task Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Task Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* System Logs */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent System Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentLogs.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.level === 'ERROR' ? 'bg-red-100 text-red-800' : 
                      log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutomationDashboard;
