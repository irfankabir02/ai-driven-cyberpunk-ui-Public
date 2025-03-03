// ChatGPT Automation Framework - Core Components
// This framework provides modular, reusable components for ChatGPT workflows

// 1. DATA FORMATTER MODULE
// Handles different data types and formats them appropriately
class DataFormatter {
  static formatValue(value, format) {
    switch (format) {
      case 'number':
        return Number(value).toLocaleString();
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'percent':
        return `${(Number(value) * 100).toFixed(2)}%`;
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  }
}

// 2. ELEMENT RENDERER MODULE
// Creates and manages visual elements for dashboards
class ElementRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  renderCell(value, renderType) {
    const td = document.createElement('td');
    
    if (renderType === 'function') {
      // Custom function renderer
      if (typeof value === 'string') {
        td.innerHTML = value;
      } else {
        td.textContent = '';
        td.appendChild(value);
      }
    } else {
      // Default renderer
      td.textContent = value;
    }
    
    return td;
  }
  
  createTable(data, columns) {
    const table = document.createElement('table');
    table.className = 'dashboard-table';
    
    // Create header row
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column.title;
      headerRow.appendChild(th);
    });
    
    // Create data rows
    data.forEach(row => {
      const tr = document.createElement('tr');
      columns.forEach(column => {
        const value = this._getNestedValue(row, column.field);
        const formattedValue = column.format ? 
          DataFormatter.formatValue(value, column.format) : 
          value;
        
        const td = this.renderCell(formattedValue, column.render);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    
    return table;
  }
  
  _getNestedValue(obj, path) {
    // Gets nested property value using dot notation
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }
}

// 3. WORKFLOW MANAGER MODULE
// Controls the flow of automation tasks
class WorkflowManager {
  constructor() {
    this.tasks = [];
    this.currentTaskIndex = 0;
  }
  
  addTask(taskFn, name) {
    this.tasks.push({
      execute: taskFn,
      name: name || `Task ${this.tasks.length + 1}`
    });
    return this;
  }
  
  async executeAll() {
    const results = [];
    
    for (let i = 0; i < this.tasks.length; i++) {
      this.currentTaskIndex = i;
      try {
        const result = await this.tasks[i].execute();
        results.push({
          taskName: this.tasks[i].name,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          taskName: this.tasks[i].name,
          success: false,
          error: error.message
        });
        // Decision: stop or continue on error?
        // For now, we'll continue but log the error
        console.error(`Error in task ${this.tasks[i].name}:`, error);
      }
    }
    
    return results;
  }
}

// 4. VISUAL ASSETS GENERATOR
// Creates SVG charts and visualizations
class VisualGenerator {
  static createBarChart(data, options = {}) {
    const { width = 600, height = 400, margin = 40 } = options;
    
    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value));
    
    // Calculate bar dimensions
    const barWidth = (width - margin * 2) / data.length - 10;
    const barHeightRatio = (height - margin * 2) / maxValue;
    
    // Start SVG string
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;
    
    // Add bars
    data.forEach((item, index) => {
      const barHeight = item.value * barHeightRatio;
      const x = margin + index * (barWidth + 10);
      const y = height - margin - barHeight;
      
      // Add bar
      svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#4682B4" />`;
      
      // Add label
      svg += `<text x="${x + barWidth/2}" y="${height - 10}" text-anchor="middle" font-size="12">${item.label}</text>`;
      
      // Add value
      svg += `<text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-size="12">${item.value}</text>`;
    });
    
    // Close SVG tag
    svg += '</svg>';
    
    return svg;
  }
}

// Example usage:
// 1. Create a workflow
/*
const workflow = new WorkflowManager();

// 2. Add tasks to the workflow
workflow
  .addTask(async () => {
    // Fetch data
    const response = await fetch('/api/data');
    return response.json();
  }, 'Fetch Data')
  .addTask(async (data) => {
    // Render the data
    const renderer = new ElementRenderer('dashboard-container');
    const table = renderer.createTable(data, [
      { title: 'Name', field: 'name' },
      { title: 'Revenue', field: 'revenue', format: 'currency' },
      { title: 'Growth', field: 'growth', format: 'percent' }
    ]);
    
    document.getElementById('results').appendChild(table);
    return 'Table rendered successfully';
  }, 'Render Table');

// 3. Execute the workflow
workflow.executeAll().then(results => {
  console.log('Workflow completed', results);
});
*/
