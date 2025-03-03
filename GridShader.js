// CustomShaders.js
import * as THREE from 'three';

// Create cyberpunk grid material
export function createGridMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0