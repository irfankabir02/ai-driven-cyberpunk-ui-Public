// DataInsightPanel.js
import React, { useState, useEffect } from 'react';
import './DataInsightPanel.css';

// This component shows detailed information about a selected data point
function DataInsightPanel({ data, onClose }) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate some fake insights based on the data point
  useEffect(() => {
    if (!data) return;
    
    // Simulate API call or data processing
    const getInsightsForData = async () => {
      setIsLoading(true);
      
      // Simulate delay for processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate insights based on category
      let categoryInsights = {};
      
      switch(data.category) {
        case 'users':
          categoryInsights = {
            title: 'User Growth Trends',
            metrics: [
              { name: 'New Signups', value: Math.round(data.value * 12), unit: 'per day' },
              { name: 'Retention Rate', value: Math.round(60 + data.value / 4), unit: '%' },
              { name: 'Active Users', value: Math.round(data.value * 580), unit: '' }
            ],
            recommendations: [
              'Consider targeting similar demographic profiles',
              'Optimize onboarding flow to increase conversions',
              'Implement notification system to improve engagement'
            ]
          };
          break;
          
        case 'revenue':
          categoryInsights = {
            title: 'Revenue Analytics',
            metrics: [
              { name: 'Monthly Revenue', value: Math.round(data.value * 1250), unit: '$' },
              { name: 'Average Order', value: Math.round(20 + data.value / 2), unit: '$' },
              { name: 'Conversion Rate', value: (2 + data.value / 25).toFixed(1), unit: '%' }
            ],
            recommendations: [
              'Test premium tiers for higher revenue potential',
              'Analyze pricing structure against competition',
              'Implement cross-selling opportunities at checkout'
            ]
          };
          break;
          
        case 'engagement':
          categoryInsights = {
            title: 'User Engagement Metrics',
            metrics: [
              { name: 'Session Duration', value: Math.round(2 + data.value / 10), unit: 'minutes' },
              { name: 'Pages per Session', value: Math.round(2 + data.value / 20), unit: '' },
              { name: 'Return Rate', value: Math.round(40 + data.value / 2), unit: '%' }
            ],
            recommendations: [
              'Introduce gamification elements to increase time spent',
              'Optimize content recommendation algorithm',
              'Implement A/B testing on key engagement features'
            ]
          };
          break;
          
        case 'conversion':
          categoryInsights = {
            title: 'Conversion Performance',
            metrics: [
              { name: 'Conversion Rate', value: (3 + data.value / 20).toFixed(1), unit: '%' },
              { name: 'Funnel Dropoff', value: Math.round(50 - data.value / 3), unit: '%' },
              { name: 'First Purchase Time', value: Math.round(10 - data.value / 15), unit: 'days' }
            ],
            recommendations: [
              'Simplify checkout process to reduce abandonment',
              'Add social proof elements on product pages',
              'Implement targeted exit-intent offers'
            ]
          };
          break;
          
        case 'retention':
          categoryInsights = {
            title: 'Customer Retention',
            metrics: [
              { name: 'Churn Rate', value: Math.round(20 - data.value / 8), unit: '%' },
              { name: 'Repeat Purchase', value: Math.round(30 + data.value / 3), unit: '%' },
              { name: 'Feedback Score', value: (3 + data.value / 25).toFixed(1), unit: '/5' }
            ],
            recommendations: [
              'Implement a loyalty program to encourage repeat business',
              'Develop re-engagement email campaigns for inactive users',
              'Collect and act on exit survey feedback'
            ]
          };
          break;
          
        default:
          categoryInsights = {
            title: 'Data Insights',
            metrics: [
              { name: 'Value', value: data.value.toFixed(1), unit: '' }
            ],
            recommendations: [
              'Collect more data for deeper analysis',
              'Define key metrics for this category'
            ]
          };
      }
      
      setInsights(categoryInsights);
      setIsLoading(false);
    };
    
    getInsightsForData();
  }, [data]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="data-insight-panel loading">
        <div className="panel-header">
          <h2>Loading Insights...</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="panel-content">
          <div className="cyberpunk-spinner small"></div>
        </div>
      </div>
    );
  }
  
  // Handle no data
  if (!insights) {
    return null;
  }
  
  return (
    <div className="data-insight-panel">
      <div className="panel-header">
        <h2>{insights.title}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="panel-content">
        <div className="data-category">
          <span 
            className="category-indicator" 
            style={{ backgroundColor: `#${data.color.toString(16).padStart(6, '0')}` }}
          ></span>
          <h3>{data.category.charAt(0).toUpperCase() + data.category.slice(1)}</h3>
        </div>
        
        <div className="metrics-container">
          {insights.metrics.map((metric, index) => (
            <div className="metric-card" key={index}>
              <div className="metric-value">
                {metric.unit.startsWith('$') ? metric.unit : ''}{metric.value}{!metric.unit.startsWith('$') ? ` ${metric.unit}` : ''}
              </div>
              <div className="metric-name">{metric.name}</div>
            </div>
          ))}
        </div>
        
        <div className="recommendations-container">
          <h4>Recommended Actions</h4>
          <ul className="recommendations-list">
            {insights.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DataInsightPanel;
