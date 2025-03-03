// File: DataInsights.js
import React, { useState, useEffect } from 'react';
import './DataInsights.css';

function DataInsights({ dataPoints, selectedPoint }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPoint) {
      generateInsights(selectedPoint);
    } else {
      generateOverviewInsights(dataPoints);
    }
  }, [selectedPoint, dataPoints]);

  const generateInsights = (point) => {
    setLoading(true);
    
    // In a real app, this would be an API call to Claude 3.7 Sonnet
    // Simulating AI analysis with a timeout
    setTimeout(() => {
      const pointInsight = {
        title: `Analysis of Point ${point.id}`,
        summary: `This data point represents a ${point.category} type entity with a relative importance of ${point.value}.`,
        details: [
          `Position in 3D space: (${point.x}, ${point.y}, ${point.z})`,
          `Value is ${point.value > 15 ? 'above' : 'below'} average for its category`,
          `Category ${point.category} tends to cluster in the ${getQuadrant(point)} quadrant`
        ],
        recommendations: [
          `Consider examining relationship with nearby ${point.category} points`,
          `The unusual ${point.value > 20 ? 'high' : 'low'} value suggests ${point.value > 20 ? 'potential significance' : 'possible anomaly'}`
        ]
      };
      
      setInsights(pointInsight);
      setLoading(false);
    }, 800); // Simulate processing time
  };

  const generateOverviewInsights = (data) => {
    setLoading(true);
    
    // Again, this would be Claude API in real implementation
    setTimeout(() => {
      // Calculate some basic stats
      const categories = {};
      let totalValue = 0;
      
      data.forEach(point => {
        totalValue += point.value;
        if (categories[point.category]) {
          categories[point.category]++;
        } else {
          categories[point.category] = 1;
        }
      });
      
      const avgValue = totalValue / data.length;
      
      // Format insights object
      const overviewInsight = {
        title: "Dataset Overview Analysis",
        summary: `This dataset contains ${data.length} points across ${Object.keys(categories).length} categories with an average value of ${avgValue.toFixed(1)}.`,
        details: [
          `Category distribution: ${Object.entries(categories).map(([cat, count]) => `${cat}: ${count}`).join(', ')}`,
          `Spatial range: X(${Math.min(...data.map(p => p.x))} to ${Math.max(...data.map(p => p.x))}), Y(${Math.min(...data.map(p => p.y))} to ${Math.max(...data.map(p => p.y))}), Z(${Math.min(...data.map(p => p.z))} to ${Math.max(...data.map(p => p.z))})`,
          `Most frequent category: ${Object.entries(categories).sort((a, b) => b[1] - a[1])[0][0]}`
        ],
        recommendations: [
          "Try filtering by category to identify patterns within groups",
          "Zoom into dense clusters to examine relationships",
          "Rotate the view to look for patterns from different angles"
        ]
      };
      
      setInsights(overviewInsight);
      setLoading(false);
    }, 1000);
  };

  // Helper function to determine quadrant
  const getQuadrant = (point) => {
    if (point.x >= 0 && point.z >= 0) return "northeast";
    if (point.x < 0 && point.z >= 0) return "northwest";
    if (point.x < 0 && point.z < 0) return "southwest";
    return "southeast";
  };

  if (loading) {
    return (
      <div className="data-insights loading-insights">
        <div className="insight-loader">
          <div className="loader-text">AI analyzing data...</div>
          <div className="loading-circle"></div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return <div className="data-insights">Select a data point or wait for overview analysis</div>;
  }

  return (
    <div className="data-insights">
      <h3 className="insight-title">{insights.title}</h3>
      <div className="insight-summary">{insights.summary}</div>
      
      <div className="insight-section">
        <h4>Key Observations</h4>
        <ul>
          {insights.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
      
      <div className="insight-section">
        <h4>AI Recommendations</h4>
        <ul className="recommendations">
          {insights.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DataInsights;

// File: DataInsights.css
.data-insights {
  position: absolute;
  left: 20px;
  top: 80px;
  width: 300px;
  background-color: rgba(10, 15, 30, 0.85);
  border: 1px solid #00ffff;
  border-radius: 8px;
  padding: 15px;
  color: #e0e0ff;
  font-family: 'Roboto', sans-serif;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  max-height: 80vh;
  overflow-y: auto;
  z-index: 100;
}

.insight-title {
  color: #00ffff;
  margin-top: 0;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
  padding-bottom: 8px;
}

.insight-summary {
  font-style: italic;
  margin-bottom: 15px;
  color: #ffffff;
}

.insight-section {
  margin-bottom: 15px;
}

.insight-section h4 {
  color: #ff00ff;
  margin-bottom: 5px;
}

.insight-section ul {
  margin: 0;
  padding-left: 20px;
}

.insight-section li {
  margin-bottom: 5px;
}

.recommendations li {
  border-left: 2px solid #ff00ff;
  padding-left: 10px;
  list-style-type: none;
}

.loading-insights {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.insight-loader {
  text-align: center;
}

.loader-text {
  margin-bottom: 15px;
  color: #00ffff;
}

.loading-circle {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 255, 255, 0.3);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
