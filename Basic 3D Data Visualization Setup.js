// File: App.js
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';

function App() {
  const mountRef = useRef(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample data - in a real app, you'd fetch this from an API
    const sampleData = [
      { id: 1, x: 1, y: 2, z: 3, value: 10, category: 'A' },
      { id: 2, x: 2, y: 3, z: 1, value: 15, category: 'B' },
      { id: 3, x: 3, y: 1, z: 2, value: 20, category: 'A' },
      { id: 4, x: -1, y: -2, z: -3, value: 5, category: 'C' },
      { id: 5, x: -2, y: -1, z: -2, value: 25, category: 'B' },
      // Add more sample data points as needed
    ];

    setDataPoints(sampleData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    // Scene setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111133); // Dark blue background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Controls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Grid helper for orientation
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Create visualization objects based on data
    dataPoints.forEach(point => {
      const size = point.value / 5; // Scale size based on value
      
      // Different geometry based on category
      let geometry;
      if (point.category === 'A') {
        geometry = new THREE.SphereGeometry(size, 16, 16);
      } else if (point.category === 'B') {
        geometry = new THREE.BoxGeometry(size, size, size);
      } else {
        geometry = new THREE.ConeGeometry(size, size * 2, 16);
      }
      
      // Material with glow effect
      const material = new THREE.MeshStandardMaterial({
        color: getColorForCategory(point.category),
        emissive: getColorForCategory(point.category),
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(point.x * 2, point.y * 2, point.z * 2); // Scale and position
      mesh.userData = point; // Store original data for interactivity
      scene.add(mesh);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [loading, dataPoints]);

  // Helper function to get color based on category
  const getColorForCategory = (category) => {
    switch (category) {
      case 'A': return 0x00ffff; // Cyan
      case 'B': return 0xff00ff; // Magenta
      case 'C': return 0xffff00; // Yellow
      default: return 0x0000ff; // Blue
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>3D Data Visualization</h1>
      </header>
      <div className="visualization-container" ref={mountRef}></div>
      <div className="controls-panel">
        <h2>Controls</h2>
        <p>Rotate: Left-click + drag</p>
        <p>Pan: Right-click + drag</p>
        <p>Zoom: Scroll</p>
      </div>
    </div>
  );
}

export default App;

// File: App.css
.App {
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a2e;
  color: #e6e6ff;
}

.App-header {
  background-color: #16213e;
  padding: 10px;
  color: #00ffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.visualization-container {
  flex: 1;
  width: 100%;
  position: relative;
}

.controls-panel {
  position: absolute;
  top: 80px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #00ffff;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}
