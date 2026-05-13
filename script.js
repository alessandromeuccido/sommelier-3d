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

/* =====================================================
   6. LIGHTS
   ===================================================== */
scene.add(new THREE.AmbientLight(0xfff0e0, 0.4));

const keyLight = new THREE.DirectionalLight(0xffddb0, 3.0);
keyLight.position.set(3, 6, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);

scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xb0c8ff, 1.0);
fillLight.position.set(-5, 3, 2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
rimLight.position.set(0, 2, -6);
scene.add(rimLight);

/* =====================================================
   7. FLOOR
===================================================== */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({
    color:  0x0a0808,
    roughness: 0.3,
    metalness: 0.9,
  })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

/* =====================================================
   8. BOTTLES GEOMETRY
===================================================== */
function makeBottleGeometry() {
  const profile = [
    [0.000, 0.000],  // centro base — chiude il fondo
    [0.240, 0.000],  // bordo interno base
    [0.295, 0.025],  // smussatura base
    [0.325, 0.080],
    [0.348, 0.160],  // inizio corpo
    [0.358, 0.450],
    [0.363, 0.920],  // punto più largo
    [0.363, 1.650],
    [0.360, 1.950],  // inizio spalla
    [0.340, 2.080],
    [0.295, 2.220],  // rastrematura spalla
    [0.162, 2.500],  // base collo
    [0.138, 2.640],
    [0.130, 2.920],  // collo
    [0.132, 3.060],
    [0.142, 3.130],  // anello 
    [0.150, 3.165],
    [0.140, 3.200],
    [0.130, 3.220],  // apertura bottiglie
  ].map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(profile, 64);
}

/* =====================================================
   9. LABLES
===================================================== */