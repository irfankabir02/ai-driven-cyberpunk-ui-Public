import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const IterativeLearningDashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Sample problem tracking data
  const problemSteps = [
    { id: 1, name: "Define the Problem", complete: true, description: "Identify and articulate the core issue" },
    { id: 2, name: "Break Down Components", complete: true, description: "Divide the problem into smaller, manageable parts" },
    { id: 3, name: "Identify Patterns", complete: false, description: "Look for similarities with known solutions" },
    { id: 4, name: "Generate Solutions", complete: false, description: "Brainstorm possible approaches" },
    { id: 5, name: "Test & Refine", complete: false, description: "Implement, test, and improve solutions" }
  ];
  
  // Sample learning progress data
  const learningData = [
    { id: 1, iteration: 1, success: 40 },
    { id: 2, iteration: 2, success: 55 },
    { id: 3, iteration: 3, success: 65 },
    { id: 4, iteration: 4, success: 72 },
    { id: 5, iteration: 5, success: 85 }
  ];
  
  // Handler for moving through the steps
  const handleStepChange = (direction) => {
    if (direction === 'next' && currentStep < problemSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (direction === 'prev' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Calculate progress bar width
  const calculateProgress = () => {
    return `${(currentStep + 1) / problemSteps.length * 100}%`;
  };
  
  // Get color based on completion status
  const getStatusColor = (complete) => {
    return complete ? 'bg-green-500' : 'bg-gray-300';
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Problem Dissection Framework Tracker</CardTitle>
          <p className="text-sm text-gray-500">Track your problem-solving journey step by step</p>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
            <div 
              className="bg-blue-500 h-3 rounded-full" 
              style={{ width: calculateProgress() }}
            ></div>
          </div>
          
          {/* Current step display */}
          <div className="border rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-2">
              Step {currentStep + 1}: {problemSteps[currentStep].name}
            </h3>
            <p className="mb-4">{problemSteps[currentStep].description}</p>
            
            <div className="flex justify-between">
              <button 
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => handleStepChange('prev')}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() => handleStepChange('next')}
                disabled={currentStep === problemSteps.length - 1}
              >
                Next
              </button>
            </div>
          </div>
          
          {/* Steps overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
            {problemSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`p-2 border rounded text-center cursor-pointer ${index === currentStep ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${getStatusColor(step.complete)}`}></div>
                <div className="text-sm">{step.name}</div>
              </div>
            ))}
          </div>
          
          {/* Learning progress visualization */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
            <div className="h-48 flex items-end space-x-2">
              {learningData.map((data) => (
                <div key={data.id} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-400 rounded-t"
                    style={{ height: `${data.success}%` }}
                  ></div>
                  <div className="text-xs mt-1">Iter {data.iteration}</div>
                  <div className="text-xs font-semibold">{data.success}%</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IterativeLearningDashboard;
