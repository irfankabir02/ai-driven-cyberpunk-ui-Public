import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueDashboard = () => {
  // Sample data
  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 40000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, target: 42000, expenses: 34000 },
    { month: 'Mar', revenue: 48000, target: 44000, expenses: 33000 },
    { month: 'Apr', revenue: 61000, target: 46000, expenses: 35000 },
    { month: 'May', revenue: 55000, target: 48000, expenses: 36000 },
    { month: 'Jun', revenue: 67000, target: 50000, expenses: 38000 },
    { month: 'Jul', revenue: 72000, target: 52000, expenses: 40000 },
    { month: 'Aug', revenue: 70000, target: 54000, expenses: 41000 },
    { month: 'Sep', revenue: 81000, target: 56000, expenses: 43000 },
    { month: 'Oct', revenue: 75000, target: 58000, expenses: 42000 },
    { month: 'Nov', revenue: 85000, target: 60000, expenses: 45000 },
    { month: 'Dec', revenue: 92000, target: 62000, expenses: 48000 }
  ];

  const channelData = [
    { name: 'Direct Sales', value: 45 },
    { name: 'Online', value: 30 },
    { name: 'Partners', value: 15 },
    { name: 'Referrals', value: 10 }
  ];

  const kpiData = [
    { name: 'Total Revenue', value: '$803,000', change: '+12%', status: 'positive' },
    { name: 'Average Sale', value: '$2,450', change: '+5%', status: 'positive' },
    { name: 'Conversion Rate', value: '24%', change: '-2%', status: 'negative' },
    { name: 'Customer Retention', value: '78%', change: '+3%', status: 'positive' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate profit
  const profitData = revenueData.map(item => ({
    ...item,
    profit: item.revenue - item.expenses
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Revenue Performance Dashboard</h1>
        <p className="text-gray-600">Year-to-date performance metrics and analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">{kpi.name}</p>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className={`text-sm ${kpi.status === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              {kpi.change} from previous period
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue vs Target Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue vs Target</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Profit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Channel Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Revenue by Channel (%)</h2>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <ResponsiveContainer width="100%" height={300} className="max-w-md mx-auto">
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 md:mt-0 md:ml-4">
            <div className="grid grid-cols-2 gap-2">
              {channelData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div className="w-4 h-4 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Revenue Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Revenue Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Month</th>
                <th className="py-2 px-4 border-b">Revenue</th>
                <th className="py-2 px-4 border-b">Target</th>
                <th className="py-2 px-4 border-b">Expenses</th>
                <th className="py-2 px-4 border-b">Profit</th>
                <th className="py-2 px-4 border-b">Margin</th>
              </tr>
            </thead>
            <tbody>
              {profitData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-4">{item.month}</td>
                  <td className="py-2 px-4">${item.revenue.toLocaleString()}</td>
                  <td className="py-2 px-4">${item.target.toLocaleString()}</td>
                  <td className="py-2 px-4">${item.expenses.toLocaleString()}</td>
                  <td className="py-2 px-4">${item.profit.toLocaleString()}</td>
                  <td className="py-2 px-4">{((item.profit / item.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
