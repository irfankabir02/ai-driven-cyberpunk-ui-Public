// File: CyberpunkEffects.js
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Custom Cyberpunk Glow Shader
const CyberpunkGlowShader = {
  uniforms: {
    "tDiffuse": { value: null },
    "time": { value: 0 },
    "intensity": { value: 0.3 },
    "primaryColor": { value: new THREE.Color(0x00ffff) },  // Cyan
    "secondaryColor": { value: new THREE.Color(0xff00ff) }, // Magenta
    "resolution": { value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    uniform vec2 resolution;
    varying vec2 vUv;
    
    void main() {
      // Sample the original scene render
      vec4 texel = texture2D(tDiffuse, vUv);
      
      // Add scanlines effect
      float scanLine = sin(vUv.y * resolution.y * 1.0 - time * 10.0) * 0.04;
      
      // Add edge glow based on brightness
      float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      float glow = smoothstep(0.7, 0.9, brightness) * intensity;
      
      // Add color fringing based on position and time
      float fringe = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
      vec3 glowColor = mix(primaryColor, secondaryColor, fringe);
      
      // Add subtle RGB shift
      float rgbOffset = sin(time * 2.0) * 0.002;
      float r = texture2D(tDiffuse, vUv + vec2(rgbOffset, 0.0)).r;
      float g = texel.g;
      float b = texture2D(tDiffuse, vUv - vec2(rgbOffset, 0.0)).b;
      
      // Random digital glitch effect
      float glitchIntensity = 0.02;
      float glitchLine = step(0.996, sin(vUv.y * resolution.y * 0.25 + time * 3.0));
      vec2 glitchOffset = vec2(
        sin(vUv.y * 100.0 + time * 5.0) * glitchLine * glitchIntensity,
        0.0
      );
      vec3 glitchColor = texture2D(tDiffuse, vUv + glitchOffset).rgb;
      
      // Combine all effects
      vec3 finalColor = mix(vec3(r, g, b), glitchColor, glitchLine);
      finalColor = mix(finalColor, glowColor, glow);
      finalColor += scanLine;
      
      gl_FragColor = vec4(finalColor, texel.a);
    }
  `
};

// Grid Floor Shader
const GridShader = {
  uniforms: {
    "time": { value: 0 },
    "gridSize": { value: 1.0 },
    "gridWidth": { value: 0.02 },
    "gridColor": { value: new THREE.Color(0x00ffff) },
    "pulseSpeed": { value: 0.5 },
    "fadeDistance": { value: 50.0 }
  },
  vertexShader: `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float gridSize;
    uniform float gridWidth;
    uniform vec3 gridColor;
    uniform float pulseSpeed;
    uniform float fadeDistance;
    varying vec3 vPosition;
    
    float grid(vec3 pos, float size, float width) {
      vec2 grid = abs(fract(pos.xz / size - 0.5) - 0.5) / width;
      float line = min(grid.x, grid.y);
      return 1.0 - min(line, 1.0);
    }
    
    void main() {
      // Calculate distance fade
      float dist = length(vPosition.xz);
      float fade = 1.0 - smoothstep(0.0, fadeDistance, dist);
      
      // Calculate grid with pulse
      float pulse = (sin(time * pulseSpeed) * 0.5 + 0.5) * 0.3 + 0.7;
      float g = grid(vPosition, gridSize, gridWidth) * pulse * fade;
      
      // Add wave pulse from center
      float wave = sin(dist - time * 2.0) * 0.5 + 0.5;
      float waveIntensity = smoothstep(0.98, 1.0, wave) * fade * 0.8;
      
      // Final color
      vec3 color = gridColor * g + gridColor * waveIntensity * 2.0;
      
      gl_FragColor = vec4(color, g * fade);
    }
  `
};

// Particle system for ambient atmosphere
class ParticleSystem {
  constructor(scene, count = 1000, radius = 50) {
    this.scene = scene;
    this.count = count;
    this.radius = radius;
    this.particles = null;
    this.time = 0;
    
    this.init();
  }
  
  init() {
    // Particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const scales = new Float32Array(this.count);
    const colors = new Float32Array(this.count * 3);
    
    for (let i = 0; i < this.count; i++) {
      // Random position in sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * this.radius;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Random size
      scales[i] = Math.random() * 2.0 + 0.5;
      
      // Color based on position (gradient from cyan to magenta)
      const t = Math.random();
      colors[i * 3] = t * 1.0;         // R
      colors[i * 3 + 1] = 0.0;         // G
      colors[i * 3 + 2] = (1-t) * 1.0; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Particle shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float scale;
        attribute vec3 color;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Add some movement
          vec3 pos = position;
          float noiseFreq = 0.02;
          float noiseAmp = 1.0;
          float noise = sin(pos.x * noiseFreq + time) * 
                     sin(pos.y * noiseFreq + time) * 
                     sin(pos.z * noiseFreq + time) * noiseAmp;
          pos += noise * normalize(pos) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = scale * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Calculate fade from center for circular particles
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Glow effect
          float glow = 1.0 - pow(dist * 2.0, 2.0);
          vec3 finalColor = vColor * glow;
          
          gl_FragColor = vec4(finalColor, glow * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  
  update(deltaTime) {
    this.time += deltaTime;
    if (this.particles) {
      this.particles.material.uniforms.time.value = this.time;
      
      // Slowly rotate the entire particle system
      this.particles.rotation.y += deltaTime * 0.05;
    }
  }
}

// Main effects manager
class CyberpunkEffects {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    
    this.composer = null;
    this.clock = new THREE.Clock();
    this.particleSystem = null;
    this.gridFloor = null;
    
    this.init();
  }
  
  init() {
    // Setup post-processing
    this.setupPostProcessing();
    
    // Add particle system
    this.particleSystem = new ParticleSystem(this.scene);
    
    // Add grid floor
    this.setupGridFloor();
  }
  
  setupPostProcessing() {
    // Create effect composer
    this.composer = new EffectComposer(this.renderer);
    
    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Add bloom pass for glow effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    this.composer.addPass(bloomPass);
    
    // Add custom cyberpunk shader pass
    const cyberpunkPass = new ShaderPass(CyberpunkGlowShader);
    cyberpunkPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    this.composer.addPass(cyberpunkPass);
  }
  
  setupGridFloor() {
    // Create a large plane for the grid
    const geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    geometry.rotateX(-Math.PI / 2); // Make it horizontal
    
    const material = new THREE.ShaderMaterial({
      uniforms: GridShader.uniforms,
      vertexShader: GridShader.vertexShader,
      fragmentShader: GridShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    this.gridFloor = new THREE.Mesh(geometry, material);
    this.gridFloor.position.y = -10; // Position below the scene
    this.scene.add(this.gridFloor);
  }
  
  update() {
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    // Update particle system
    if (this.particleSystem) {
      this.particleSystem.update(delta);
    }
    
    // Update custom shader uniforms
    if (this.composer) {
      const passes = this.composer.passes;
      for (const pass of passes) {
        if (pass.uniforms && pass.uniforms.time !== undefined) {
          pass.uniforms.time.value = elapsedTime;
        }
      }
    }
    
    // Update grid floor
    if (this.gridFloor) {
      this.gridFloor.material.uniforms.time.value = elapsedTime;
    }
    
    // Render with composer instead of standard renderer
    this.composer.render();
  }
  
  resize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height);
    }
    
    // Update cyberpunk shader resolution
    const passes = this.composer.passes;
    for (const pass of passes) {
      if (pass.uniforms && pass.uniforms.resolution !== undefined) {
        pass.uniforms.resolution.value.set(width, height);
      }
    }
  }
}

export default CyberpunkEffects;
