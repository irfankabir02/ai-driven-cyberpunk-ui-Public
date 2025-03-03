import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomerDashboard = () => {
  // Sample data
  const acquisitionData = [
    { month: 'Jan', newCustomers: 120, churned: 45 },
    { month: 'Feb', newCustomers: 132, churned: 48 },
    { month: 'Mar', newCustomers: 141, churned: 52 },
    { month: 'Apr', newCustomers: 154, churned: 49 },
    { month: 'May', newCustomers: 162, churned: 55 },
    { month: 'Jun', newCustomers: 178, churned: 57 },
    { month: 'Jul', newCustomers: 195, churned: 61 },
    { month: 'Aug', newCustomers: 188, churned: 63 },
    { month: 'Sep', newCustomers: 204, churned: 68 },
    { month: 'Oct', newCustomers: 215, churned: 72 },
    { month: 'Nov', newCustomers: 232, churned: 75 },
    { month: 'Dec', newCustomers: 245, churned: 79 }
  ];

  const retentionData = [
    { month: 1, retention: 100 },
    { month: 2, retention: 87 },
    { month: 3, retention: 76 },
    { month: 4, retention: 68 },
    { month: 5, retention: 62 },
    { month: 6, retention: 58 },
    { month: 7, retention: 55 },
    { month: 8, retention: 53 },
    { month: 9, retention: 51 },
    { month: 10, retention: 49 },
    { month: 11, retention: 48 },
    { month: 12, retention: 47 }
  ];

  const segmentData = [
    { name: 'Enterprise', value: 35 },
    { name: 'Mid-Market', value: 25 },
    { name: 'Small Business', value: 30 },
    { name: 'Individual', value: 10 }
  ];

  const ltvaData = [
    { segment: 'Enterprise', cac: 1200, ltv: 8400, ratio: 7.0 },
    { segment: 'Mid-Market', cac: 800, ltv: 4800, ratio: 6.0 },
    { segment: 'Small Business', cac: 400, ltv: 1600, ratio: 4.0 },
    { segment: 'Individual', cac: 100, ltv: 300, ratio: 3.0 }
  ];

  const kpiData = [
    { name: 'Total Customers', value: '2,166', change: '+18%', status: 'positive' },
    { name: 'Avg. LTV', value: '$4,250', change: '+7%', status: 'positive' },
    { name: 'Churn Rate', value: '2.8%', change: '-0.5%', status: 'positive' },
    { name: 'NPS Score', value: '42', change: '+6', status: 'positive' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate net growth
  const growthData = acquisitionData.map(item => ({
    ...item,
    netGrowth: item.newCustomers - item.churned
  }));

  const [selectedTab, setSelectedTab] = useState('acquisition');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Analytics Dashboard</h1>
        <p className="text-gray-600">Acquisition, retention, and customer lifetime value metrics</p>
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

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 font-medium ${selectedTab === 'acquisition' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('acquisition')}
        >
          Acquisition
        </button>
        <button 
          className={`py-2 px-4 font-medium ${selectedTab === 'retention' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('retention')}
        >
          Retention
        </button>
        <button 
          className={`py-2 px-4 font-medium ${selectedTab === 'segments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('segments')}
        >
          Segments
        </button>
        <button 
          className={`py-2 px-4 font-medium ${selectedTab === 'ltv' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('ltv')}
        >
          LTV Analysis
        </button>
      </div>

      {/* Acquisition Tab */}
      {selectedTab === 'acquisition' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Acquisition & Churn</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="newCustomers" fill="#4CAF50" name="New Customers" />
                <Bar dataKey="churned" fill="#F44336" name="Churned Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Net Customer Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="netGrowth" stroke="#8884d8" name="Net Growth" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Retention Tab */}
      {selectedTab === 'retention' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Retention Curve</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={retentionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }} />
                <YAxis label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area type="monotone" dataKey="retention" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Retention Rate" />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-medium text-blue-800 mb-2">Retention Analysis</h3>
              <p className="text-blue-700">
                After 12 months, we retain 47% of customers. The steepest drop occurs in the first 3 months,
                suggesting we should focus on improving onboarding and early customer success initiatives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Segments Tab */}
      {selectedTab === 'segments' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Segments</h2>
            <div className="flex flex-col md:flex-row">
              <ResponsiveContainer width="100%" height={300} className="max-w-md mx-auto">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 md:mt-0 md:ml-8 flex-grow">
                <h3 className="font-medium mb-2">Segment Insights</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-4 h-4 mt-1 mr-2" style={{ backgroundColor: COLORS[0] }}></div>
                    <div>
                      <span className="font-medium">Enterprise (35%)</span>: Highest value, lowest churn. Core growth focus.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 mt-1 mr-2" style={{ backgroundColor: COLORS[1] }}></div>
                    <div>
                      <span className="font-medium">Mid-Market (25%)</span>: Strong growth potential, moderate CAC.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 mt-1 mr-2" style={{ backgroundColor: COLORS[2] }}></div>
                    <div>
                      <span className="font-medium">Small Business (30%)</span>: Highest volume, price sensitive.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 mt-1 mr-2" style={{ backgroundColor: COLORS[3] }}></div>
                    <div>
                      <span className="font-medium">Individual (10%)</span>: Testing ground for features, high churn.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LTV Analysis Tab */}
      {selectedTab === 'ltv' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Acquisition Cost vs Lifetime Value</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={ltvaData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="segment" type="category" width={100} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="cac" name="Customer Acquisition Cost" fill="#FF8042" />
                <Bar dataKey="ltv" name="Lifetime Value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Segment</th>
                    <th className="py-2 px-4 text-left">CAC</th>
                    <th className="py-2 px-4 text-left">LTV</th>
                    <th className="py-2 px-4 text-left">LTV:CAC Ratio</th>
                    <th className="py-2 px-4 text-left">Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  {ltvaData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{item.segment}</td>
                      <td className="py-2 px-4">${item.cac.toLocaleString()}</td>
                      <td className="py-2 px-4">${item.ltv.toLocaleString()}</td>
                      <td className="py-2 px-4">{item.ratio.toFixed(1)}x</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.ratio >= 5 ? 'bg-green-100 text-green-800' : 
                          item.ratio >= 3 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.ratio >= 5 ? 'Excellent' : item.ratio >= 3 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
