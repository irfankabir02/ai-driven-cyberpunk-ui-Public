import React, { useState } from 'react';

const ProblemDissectionVisualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [problemDescription, setProblemDescription] = useState('How to optimize a machine learning model that is performing poorly');
  const [userInput, setUserInput] = useState({
    rootCause: '',
    subproblems: '',
    constraints: '',
    resources: '',
    approaches: '',
    implementation: ''
  });
  
  const steps = [
    {
      title: "1. Problem Identification",
      description: "Clearly state the problem to be solved",
      example: "How to optimize a machine learning model that is performing poorly",
      inputField: null
    },
    {
      title: "2. Root Cause Analysis",
      description: "Identify potential underlying causes",
      example: "Possible causes: Data quality issues, Model complexity, Feature selection problems, Hyperparameter tuning",
      inputField: "rootCause"
    },
    {
      title: "3. Problem Decomposition",
      description: "Break down into smaller, manageable sub-problems",
      example: "1. Data preprocessing and cleaning\n2. Feature engineering\n3. Model architecture review\n4. Hyperparameter optimization",
      inputField: "subproblems"
    },
    {
      title: "4. Constraint Identification",
      description: "Define limitations and requirements",
      example: "Time constraints: Solution needed within 2 weeks\nResource constraints: Limited computing power\nAccuracy requirements: Need at least 85% accuracy",
      inputField: "constraints"
    },
    {
      title: "5. Resource Assessment",
      description: "Identify available tools and knowledge",
      example: "Available: Historical data, Computing resources, Team expertise in XGBoost, scikit-learn documentation",
      inputField: "resources"
    },
    {
      title: "6. Solution Approaches",
      description: "Generate potential approaches for each sub-problem",
      example: "For data preprocessing: Try outlier removal, feature scaling\nFor feature engineering: Test PCA, feature selection techniques\nFor model architecture: Compare simpler models vs complex ones",
      inputField: "approaches"
    },
    {
      title: "7. Implementation Strategy",
      description: "Create action plan with iterative learning cycles",
      example: "Cycle 1: Clean data, implement baseline model\nCycle 2: Feature engineering, evaluate improvements\nCycle 3: Hyperparameter tuning, final evaluation",
      inputField: "implementation"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleInputChange = (field, value) => {
    setUserInput({
      ...userInput,
      [field]: value
    });
  };
  
  const handleProblemChange = (value) => {
    setProblemDescription(value);
  };
  
  return (
    <div className="flex flex-col p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Problem Dissection Framework Visualizer</h1>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex mb-4">
        <div className="w-3/4 pr-4">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">{steps[currentStep].title}</h2>
          <p className="mb-4 text-gray-700">{steps[currentStep].description}</p>
          
          {currentStep === 0 ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Problem:</label>
              <textarea
                value={problemDescription}
                onChange={(e) => handleProblemChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>
          ) : steps[currentStep].inputField ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Input:</label>
              <textarea
                value={userInput[steps[currentStep].inputField]}
                onChange={(e) => handleInputChange(steps[currentStep].inputField, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder={`Enter your ${steps[currentStep].title.split('.')[1]}`}
              />
            </div>
          ) : null}
          
          <div className="mb-4">
            <h3 className="text-md font-medium mb-1 text-gray-800">Example:</h3>
            <div className="p-3 bg-gray-100 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{steps[currentStep].example}</pre>
            </div>
          </div>
        </div>
        
        <div className="w-1/4 bg-blue-50 p-4 rounded-md">
          <h3 className="text-md font-medium mb-2 text-blue-800">Framework Progress</h3>
          <ul className="text-sm">
            {steps.map((step, index) => (
              <li key={index} className="mb-1">
                <span 
                  className={`${index === currentStep ? 'font-bold text-blue-600' : 
                    index < currentStep ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {index < currentStep ? '✓ ' : index === currentStep ? '➤ ' : ''}
                  {step.title.split('.')[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          onClick={handlePrevious} 
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-md ${currentStep === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentStep === steps.length - 1}
          className={`px-4 py-2 rounded-md ${currentStep === steps.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProblemDissectionVisualizer;
