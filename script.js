/* =====================================================
SOMMELIER VIRTUALE — script.js
Vineria Laparelli
===================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/* =====================================================
  1. DATI VINI
===================================================== */
const WINES = [ {
  id: 0,
  name: "Pinot Grigio",
  type: "bianco",
  anno: '2022',
  produttore: "Le Romaglie",
  prezzo: '15 € / 750ml',
  note: "DOC",
  bottleHex: '#2A5020',
  labelAccent: '#4E7A38'
  },
  {
  id: 1,
  name: "Lunario Colli Colli Lanuvini",
  type: "bianco",
  anno: '2023',
  produttore: "Superiore La Luna Del Casale",
  prezzo: '14 € / 750ml',
  note: "DOP",
  bottleHex: '#2A5020',
  labelAccent: '#4E7A38'
  },
  {
  id: 2,
  name: "Colle Celone Cesanese Di Olevano",
  type: "rosso",
  anno: '2023',
  produttore: "Azienda Neri",
  prezzo: '11 € / 750ml',
  note: "DOC",
  bottleHex: '#152B1E',
  labelAccent: '#7B1545' 
  }
]

/* =====================================================
 2. RENDERER
===================================================== */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-wrap').appendChild(renderer.domElement);

/* =====================================================
  3. SCENE
===================================================== */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06040A);
scene.fog = new THREE.FogExp2(0x06040A, 0.06);


/* =====================================================
  4. CAMERA
===================================================== */
 
const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  80
);

camera.position.set(0, 1.6, 5.5);

/* =====================================================
  5. ORBIT CONTROLS
===================================================== */
 
const controls = new OrbitControls(camera, renderer.domElement);
 
controls.enableDamping = true;  
controls.dampingFactor = 0.06;
controls.target.set(0, 1.6, 0);
controls.minDistance = 2.2;             
controls.maxDistance = 9.0;            
controls.maxPolarAngle = Math.PI * 0.88; 
controls.minPolarAngle = Math.PI * 0.08; 

let userDragging = false;
controls.addEventListener('start', () => { userDragging = true;  });
controls.addEventListener('end',   () => { userDragging = false; });