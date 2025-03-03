import React from 'react';

const ToolSelectionMatrix = () => {
  const tools = [
    {
      name: "Claude",
      strengths: [
        "Visual interactive artifacts",
        "Clear explanations with visuals", 
        "Data visualization",
        "Interactive demonstrations",
        "Good for concept exploration"
      ],
      limitations: [
        "Message length limits", 
        "May require multiple interactions"
      ],
      bestFor: [
        "Visual explanations",
        "Interactive code demos",
        "Algorithm visualization",
        "Data analysis with visuals",
        "Learning new concepts"
      ]
    },
    {
      name: "ChatGPT Plus",
      strengths: [
        "Strong code generation", 
        "Code optimization", 
        "Wide knowledge of libraries",
        "Step-by-step debugging help",
        "Handling complex code structures"
      ],
      limitations: [
        "No visual artifacts", 
        "Sometimes less detailed explanations"
      ],
      bestFor: [
        "Code generation",
        "Debugging help",
        "Performance optimization",
        "Exploring library alternatives",
        "Code refactoring"
      ]
    },
    {
      name: "Grok 3 Beta",
      strengths: [
        "Newer capabilities", 
        "Potentially novel approaches", 
        "Different perspective",
        "May have more recent knowledge"
      ],
      limitations: [
        "Beta status", 
        "Less predictable responses"
      ],
      bestFor: [
        "Alternative solutions",
        "Getting a second opinion",
        "Newer libraries or methods",
        "Creative problem-solving"
      ]
    }
  ];

  return (
    <div className="p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">AI Assistant Selection Matrix</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-300">Tool</th>
              <th className="p-3 border border-gray-300">Key Strengths</th>
              <th className="p-3 border border-gray-300">Limitations</th>
              <th className="p-3 border border-gray-300">Best For</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="p-3 border border-gray-300 font-semibold">{tool.name}</td>
                <td className="p-3 border border-gray-300">
                  <ul className="list-disc pl-5">
                    {tool.strengths.map((strength, idx) => (
                      <li key={idx} className="mb-1">{strength}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 border border-gray-300">
                  <ul className="list-disc pl-5">
                    {tool.limitations.map((limitation, idx) => (
                      <li key={idx} className="mb-1">{limitation}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 border border-gray-300">
                  <ul className="list-disc pl-5">
                    {tool.bestFor.map((use, idx) => (
                      <li key={idx} className="mb-1">{use}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToolSelectionMatrix;
