import React from 'react';

const ExecutionEnvironment = () => {
  return (
    <div className="p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Python Execution Environment Setup</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-2">1. Virtual Environment Setup</h3>
        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-2">
          <div># Create a virtual environment</div>
          <div>python -m venv venv</div>
          <div>&nbsp;</div>
          <div># Activate the virtual environment</div>
          <div>venv\Scripts\activate</div>
        </div>
        <p className="text-sm mt-2">
          Virtual environments isolate dependencies for each project, which is especially
          important on systems with limited resources.
        </p>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-2">2. Efficient Package Management</h3>
        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-2">
          <div># Create requirements.txt file</div>
          <div>pip freeze > requirements.txt</div>
          <div>&nbsp;</div>
          <div># Install only required packages</div>
          <div>pip install -r requirements.txt</div>
        </div>
        <p className="text-sm mt-2">
          Install only what you need to minimize resource usage.
          Consider lightweight alternatives to heavy packages.
        </p>
      </div>
      
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-2">3. Resource-Aware Execution</h3>
        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-2">
          <div># Monitor resource usage during execution</div>
          <div>python -m memory_profiler your_script.py</div>
          <div>&nbsp;</div>
          <div># For CPU profiling</div>
          <div>python -m cProfile -o profile.stats your_script.py</div>
        </div>
        <p className="text-sm mt-2">
          Use profiling tools to identify and optimize resource-heavy operations.
        </p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-2">4. Memory-Efficient Data Processing</h3>
        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-2">
          <div>import pandas as pd</div>
          <div>&nbsp;</div>
          <div># Use chunksize for large files</div>
          <div>for chunk in pd.read_csv('large_file.csv', chunksize=10000):</div>
          <div>    # Process each chunk</div>
          <div>    process_data(chunk)</div>
        </div>
        <p className="text-sm mt-2">
          Process data in smaller chunks to avoid memory issues on your limited hardware.
        </p>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold mb-2">5. Lightweight Visualization</h3>
        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-2">
          <div># Use lighter alternatives when possible</div>
          <div>import matplotlib.pyplot as plt  # Instead of heavier options</div>
          <div>&nbsp;</div>
          <div># Set lower DPI for plots to save memory</div>
          <div>plt.figure(figsize=(8, 6), dpi=80)</div>
          <div>plt.plot(x, y)</div>
          <div>plt.savefig('plot.png')</div>
        </div>
        <p className="text-sm mt-2">
          Choose lighter visualization libraries and lower resolution settings when working with visualizations.
        </p>
      </div>
    </div>
  );
};

export default ExecutionEnvironment;
