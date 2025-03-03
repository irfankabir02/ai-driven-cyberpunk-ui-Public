import React from 'react';

const PerformanceOptimization = () => {
  const optimizationStrategies = [
    {
      category: "Memory Management",
      strategies: [
        {
          name: "Generator Functions",
          description: "Use generators instead of lists for large sequences",
          example: "def large_range():\n    i = 0\n    while i < 1000000:\n        yield i\n        i += 1",
          impact: "High"
        },
        {
          name: "Data Chunking",
          description: "Process large datasets in smaller chunks",
          example: "for chunk in pd.read_csv('large.csv', chunksize=1000):\n    process_chunk(chunk)",
          impact: "High"
        },
        {
          name: "Garbage Collection",
          description: "Explicitly release memory when possible",
          example: "import gc\n\n# After heavy processing\nresult = heavy_function()\ngc.collect()",
          impact: "Medium"
        }
      ]
    },
    {
      category: "CPU Optimization",
      strategies: [
        {
          name: "Vectorization",
          description: "Use NumPy vectorized operations instead of loops",
          example: "# Instead of loops\nresult = np.sum(array1 * array2)",
          impact: "High"
        },
        {
          name: "Caching Results",
          description: "Cache expensive function results",
          example: "from functools import lru_cache\n\n@lru_cache(maxsize=128)\ndef expensive_function(x):\n    # Complex calculation\n    return result",
          impact: "Medium"
        },
        {
          name: "Multiprocessing",
          description: "For CPU-bound tasks, use multiprocessing (carefully)",
          example: "from multiprocessing import Pool\n\nwith Pool(2) as p:  # limit to 2 processes\n    results = p.map(function, data)",
          impact: "Medium"
        }
      ]
    },
    {
      category: "Algorithm Efficiency",
      strategies: [
        {
          name: "Data Structures",
          description: "Use appropriate data structures",
          example: "# Set for fast lookups\nlookup_set = set(large_list)\nif item in lookup_set:  # O(1) vs O(n)",
          impact: "High"
        },
        {
          name: "Early Termination",
          description: "Exit loops early when possible",
          example: "for item in large_list:\n    if condition(item):\n        result = item\n        break",
          impact: "Medium"
        },
        {
          name: "Lazy Evaluation",
          description: "Compute values only when needed",
          example: "# Using a property\n@property\ndef expensive_property(self):\n    if self._cached is None:\n        self._cached = expensive_calculation()\n    return self._cached",
          impact: "Medium"
        }
      ]
    },
    {
      category: "I/O Optimization",
      strategies: [
        {
          name: "Buffer Operations",
          description: "Buffer file operations",
          example: "with open('file.txt', 'w', buffering=4096) as f:\n    # Write operations",
          impact: "Medium"
        },
        {
          name: "Async I/O",
          description: "Use async for I/O-bound operations",
          example: "import asyncio\n\nasync def main():\n    tasks = [fetch_data(url) for url in urls]\n    results = await asyncio.gather(*tasks)",
          impact: "High"
        },
        {
          name: "Memory Mapping",
          description: "Use memory mapping for large files",
          example: "import mmap\n\nwith open('large_file.bin', 'rb') as f:\n    mm = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)\n    # Process mm as a byte array",
          impact: "High"
        }
      ]
    }
  ];

  return (
    <div className="p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Performance Optimization Strategies</h2>
      <p className="mb-6">Optimize your Python code for limited hardware resources with these strategies.</p>
      
      {optimizationStrategies.map((category, idx) => (
        <div key={idx} className="mb-8">
          <h3 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-300">{category.category}</h3>
          
          {category.strategies.map((strategy, sidx) => (
            <div key={sidx} className="mb-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-medium mb-2">{strategy.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  strategy.impact === 'High' ? 'bg-green-100 text-green-800' : 
                  strategy.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {strategy.impact} Impact
                </span>
              </div>
              <p className="mb-3 text-gray-700">{strategy.description}</p>
              <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                {strategy.example.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PerformanceOptimization;
