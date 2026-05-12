/* =====================================================
SOMMELIER VIRTUALE — script.js
Vineria Laparelli
===================================================== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


/* =====================================================
   1. DATI VINI
   Array di oggetti — stesso schema di prodotti.json
   del sito principale, con due proprietà extra per il 3D:
   - bottleHex  → colore della bottiglia nella scena
   - labelAccent → colore usato nell'etichetta canvas
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

// Canvas al div #canvas-wrap nell'HTML
document.getElementById('canvas-wrap').appendChild(renderer.domElement);

/* =====================================================
   3. SCENE
   ===================================================== */
// Colore di sfondo: quasi-nero con tono viola scuro
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06040A);
 
// Fog esponenziale: gli oggetti lontani svaniscono
// nel colore di sfondo. Crea profondità.
// Secondo parametro (0.06) = densità
scene.fog = new THREE.FogExp2(0x06040A, 0.06);


/* =====================================================
   4. CAMERA
   PerspectiveCamera simula la visione umana con
   prospettiva. I 4 parametri:
   - 42        → field of view in gradi (angolo visivo)
   - aspect    → rapporto larghezza/altezza finestra
   - 0.1       → near plane (oggetti più vicini non si vedono)
   - 80        → far plane (oggetti più lontani non si vedono)
   ===================================================== */
 
const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  80
);
 
// Posizione iniziale: leggermente elevata e indietro
camera.position.set(0, 1.6, 5.5);

/* =====================================================
   5. ORBIT CONTROLS
   ===================================================== */
 
const controls = new OrbitControls(camera, renderer.domElement);
 
controls.enableDamping = true;   // inerzia fluida al rilascio
controls.dampingFactor = 0.06;
 
// Il punto attorno a cui orbita la camera
// lo impostiamo al centro della bottiglia
controls.target.set(0, 1.6, 0);
 
controls.minDistance = 2.2;              // zoom in massimo
controls.maxDistance = 9.0;             // zoom out massimo
controls.maxPolarAngle = Math.PI * 0.88; // non scende sotto il pavimento
controls.minPolarAngle = Math.PI * 0.08; // non sale troppo in alto
 
// Tracciamo se l'utente sta draggando
// per mettere in pausa l'auto-rotazione
let userDragging = false;
controls.addEventListener('start', () => { userDragging = true;  });
controls.addEventListener('end',   () => { userDragging = false; });