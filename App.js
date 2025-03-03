// App.js (Main application file)
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Import our custom components and effects
import DataInsightPanel from './DataInsightPanel';
import { 
  createGlowMaterial, 
  createGridMaterial, 
  createHologramMaterial, 
  updateShaderUniforms 
} from './CustomShaders';

function App() {
  const mountRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch sample data (in a real app, this would be from an API)
    const fetchData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate sample data
      const generatedData = [];
      const dataCategories = ['users', 'revenue', 'engagement', 'conversion', 'retention'];
      
      for (let i = 0; i < 50; i++) {
        const category = dataCategories[Math.floor(Math.random() * dataCategories.length)];
        const value = Math.random() * 100;
        
        // Create clusters based on category
        let x, y, z;
        
        switch(category) {
          case 'users':
            x = -5 + Math.random() * 2;
            y = -2 + Math.random() * 4;
            z = -2 + Math.random() * 4;
            break;
          case 'revenue':
            x = 3 + Math.random() * 2;
            y = 2 + Math.random() * 4;
            z = -2 + Math.random() * 4;
            break;
          case 'engagement':
            x = -2 + Math.random() * 4;
            y = -5 + Math.random() * 2;
            z = -2 + Math.random() * 4;
            break;
          case 'conversion':
            x = -2 + Math.random() * 4;
            y = 3 + Math.random() * 2;
            z = -2 + Math.random() * 4;
            break;
          case 'retention':
            x = -2 + Math.random() * 4;
            y = -2 + Math.random() * 4;
            z = 3 + Math.random() * 2;
            break;
        }
        
        // Assign color based on category
        let color;
        switch(category) {
          case 'users': color = 0x00ffff; break;      // cyan
          case 'revenue': color = 0xff00ff; break;    // magenta
          case 'engagement': color = 0xffff00; break; // yellow
          case 'conversion': color = 0x00ff00; break; // green
          case 'retention': color = 0xff5500; break;  // orange
        }
        
        generatedData.push({
          id: i,
          x, y, z,
          value,
          category,
          color
        });
      }
      
      setDataPoints(generatedData);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    if (isLoading) return;
    
    // Three.js scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, // field of view
      window.innerWidth / window.innerHeight, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    camera.position.set(0, 0, 15);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Composer for post-processing effects
    const composer = new THREE.EffectComposer(renderer);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create cyberpunk grid floor
    const gridGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    const gridMaterial = createGridMaterial();
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -10;
    scene.add(grid);
    
    // Fog for depth effect
    scene.fog = new THREE.FogExp2(0x000000, 0.01);
    
    // Collection of shader materials to update
    const shaderMaterials = [gridMaterial];
    
    // Data point objects mapping
    const dataObjects = {};
    
    // Create 3D visualization of data points
    dataPoints.forEach(point => {
      // Create group for each data point
      const group = new THREE.Group();
      group.position.set(point.x, point.y, point.z);
      
      // Size based on value
      const radius = 0.1 + (point.value / 100) * 0.5;
      
      // Main sphere with hologram material
      const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const hologramMaterial = createHologramMaterial();
      hologramMaterial.uniforms.baseColor.value = new THREE.Color(point.color);
      shaderMaterials.push(hologramMaterial);
      
      const sphere = new THREE.Mesh(sphereGeometry, hologramMaterial);
      group.add(sphere);
      
      // Glow effect
      const glowGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32);
      const glowMaterial = createGlowMaterial(point.color, 1.5);
      shaderMaterials.push(glowMaterial);
      
      const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
      group.add(glowSphere);
      
      // Category label
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 256;
      textCanvas.height = 128;
      const textContext = textCanvas.getContext('2d');
      textContext.fillStyle = '#000000';
      textContext.fillRect(0, 0, 256, 128);
      textContext.font = '24px Arial';
      textContext.fillStyle = '#ffffff';
      textContext.textAlign = 'center';
      textContext.fillText(point.category, 128, 64);
      
      const textTexture = new THREE.CanvasTexture(textCanvas);
      const textMaterial = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
      const textSprite = new THREE.Sprite(textMaterial);
      textSprite.scale.set(2, 1, 1);
      textSprite.position.y = radius * 2;
      textSprite.visible = false; // Only show on hover/selection
      group.add(textSprite);
      
      // Store reference to item
      dataObjects[point.id] = {
        group,
        sphere,
        glowSphere,
        textSprite,
        data: point
      };
      
      // Add to scene
      scene.add(group);
    });
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    
    // Add directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights for cyberpunk effect
    const colors = [0x00ffff, 0xff00ff, 0xffff00];
    colors.forEach((color, i) => {
      const light = new THREE.PointLight(color, 1, 15);
      light.position.set(
        Math.sin(i / colors.length * Math.PI * 2) * 10,
        Math.cos(i / colors.length * Math.PI * 2) * 10,
        0
      );
      scene.add(light);
    });
    
    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Handle mouse move for hovering effects
    const onMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, false);
    
    // Handle mouse click for selection
    const onMouseClick = () => {
      raycaster.setFromCamera(mouse, camera);
      
      // Get objects intersecting the ray
      const spheres = Object.values(dataObjects).map(obj => obj.sphere);
      const intersects = raycaster.intersectObjects(spheres);
      
      if (intersects.length > 0) {
        // Find the data point that corresponds to the clicked sphere
        const clickedId = Object.keys(dataObjects).find(id => 
          dataObjects[id].sphere === intersects[0].object
        );
        
        if (clickedId) {
          // Update selected state
          const clickedData = dataObjects[clickedId].data;
          setSelectedObject(prevSelected => 
            prevSelected?.id === clickedData.id ? null : clickedData
          );
        }
      } else {
        // Clicked empty space, clear selection
        setSelectedObject(null);
      }
    };
    window.addEventListener('click', onMouseClick, false);
    
    // Clock for animation
    const clock = new THREE.Clock();
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      
      // Update controls
      controls.update();
      
      // Update shader uniforms
      updateShaderUniforms(shaderMaterials, camera, elapsedTime);
      
      // Update hover effects using raycaster
      raycaster.setFromCamera(mouse, camera);
      const spheres = Object.values(dataObjects).map(obj => obj.sphere);
      const intersects = raycaster.intersectObjects(spheres);
      
      // Reset all hover effects
      Object.values(dataObjects).forEach(obj => {
        // Reset glow intensity
        if (obj.glowSphere.material.uniforms) {
          obj.glowSphere.material.uniforms.intensity.value = 1.5;
        }
        
        // Hide text sprite
        obj.textSprite.visible = false;
        
        // Reset scale
        obj.group.scale.set(1, 1, 1);
      });
      
      // Apply hover effect to intersected object
      if (intersects.length > 0) {
        const hoveredId = Object.keys(dataObjects).find(id => 
          dataObjects[id].sphere === intersects[0].object
        );
        
        if (hoveredId) {
          const hoveredObj = dataObjects[hoveredId];
          
          // Increase glow intensity
          if (hoveredObj.glowSphere.material.uniforms) {
            hoveredObj.glowSphere.material.uniforms.intensity.value = 3.0;
          }
          
          // Show text sprite
          hoveredObj.textSprite.visible = true;
          
          // Slight scale up
          hoveredObj.group.scale.set(1.1, 1.1, 1.1);
        }
      }
      
      // Apply selection effect
      if (selectedObject) {
        const selectedObj = dataObjects[selectedObject.id];
        if (selectedObj) {
          // Pulse effect on selected object
          const pulseFactor = 1 + Math.sin(elapsedTime * 5) * 0.1;
          selectedObj.group.scale.set(pulseFactor, pulseFactor, pulseFactor);
          
          // Keep text visible
          selectedObj.textSprite.visible = true;
        }
      }
      
      // Render scene
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js resources
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      Object.values(dataObjects).forEach(obj => {
        obj.sphere.geometry.dispose();
        obj.sphere.material.dispose();
        obj.glowSphere.geometry.dispose();
        obj.glowSphere.material.dispose();
        obj.textSprite.material.dispose();
        if (obj.textSprite.material.map) {
          obj.textSprite.material.map.dispose();
        }
      });
      
      // Dispose of grid
      grid.geometry.dispose();
      grid.material.dispose();
      
      // Stop animation loop
      renderer.dispose();
      composer.dispose();
    };
  }, [isLoading, dataPoints, selectedObject]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="cyberpunk-spinner"></div>
        <p>Loading Data Visualization...</p>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      {/* 3D Visualization Container */}
      <div 
        ref={mountRef} 
        className="visualization-container"
        style={{ width: '100%', height: '100vh' }}
      />
      
      {/* Data Insight Panel */}
      {selectedObject && (
        <DataInsightPanel 
          data={selectedObject} 
          onClose={() => setSelectedObject(null)}
        />
      )}
      
      {/* Legend */}
      <div className="visualization-legend">
        <h3>Data Categories</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#00ffff' }}></span>
            <span>Users</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#ff00ff' }}></span>
            <span>Revenue</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#ffff00' }}></span>
            <span>Engagement</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#00ff00' }}></span>
            <span>Conversion</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#ff5500' }}></span>
            <span>Retention</span>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="visualization-instructions">
        <p>Click and drag to rotate | Scroll to zoom | Click on data points for details</p>
      </div>
    </div>
  );
}

export default App;
