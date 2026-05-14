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

const keyLight = new THREE.DirectionalLight(0xffddb0, 6.0);
keyLight.position.set(3, 6, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);

scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xb0c8ff, 2.0);
fillLight.position.set(-5, 3, 2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 4.0);
rimLight.position.set(0, 2, -6);
scene.add(rimLight);

/* =====================================================
   7. FLOOR
===================================================== */
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6, 64),
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
BOTTLES GEOMETRY
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
LABLES
===================================================== */
function makeLabel(wine) {
const W = 512, H = 768;
const cv = document.createElement('canvas');
cv.width = W;
cv.height = H;
const ctx = cv.getContext('2d');

  const isRed = wine.type === 'rosso';
 
  // — Sfondo carta con gradiente —
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, isRed ? '#f8eedf' : '#f5f2e8');
  bg.addColorStop(1, isRed ? '#eddfc5' : '#e8e4cc');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
 
  // — Bordi decorativi —
  ctx.strokeStyle = wine.labelAccent;
  ctx.lineWidth   = 7;
  ctx.strokeRect(12, 12, W - 24, H - 24);  // bordo esterno
  ctx.lineWidth = 1.2;
  ctx.strokeRect(20, 20, W - 40, H - 40);  // bordo interno
 
  // — "VINERIA LAPARELLI" in cima —
  ctx.fillStyle  = wine.labelAccent;
  ctx.font       = '600 30px Georgia, serif';
  ctx.textAlign  = 'center';
  ctx.fillText('VINERIA  LAPARELLI', W / 2, 72);
 
  // — Doppie righe decorative —
  ctx.lineWidth = 1;
  [90, 96].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(40, y); ctx.lineTo(W - 40, y);
    ctx.stroke();
  });
 
  // — Nome del vino con word-wrap manuale —
  // measureText() misura la larghezza del testo
  // prima di scriverlo, così andiamo a capo automaticamente
  ctx.fillStyle = '#120a04';
  const fontSize = wine.name.length > 18 ? 36 : 42;
  ctx.font = `italic ${fontSize}px Georgia, serif`;
 
  const maxW   = W - 90;
  const words  = wine.name.split(' ');
  let lines    = [];
  let current  = '';
 
  words.forEach(word => {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxW) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  lines.push(current);
 
  const lineH = fontSize * 1.3;
  let nameY   = 210 - (lines.length * lineH) / 2 + lineH;
  lines.forEach(line => {
    ctx.fillText(line, W / 2, nameY);
    nameY += lineH;
  });
 
  // — Riga separatrice centrale —
  ctx.strokeStyle = wine.labelAccent;
  ctx.beginPath();
  ctx.moveTo(70, 310); ctx.lineTo(W - 70, 310);
  ctx.stroke();
 
  // — Tipo (ROSSO / BIANCO) e Annata —
  ctx.fillStyle = wine.labelAccent;
  ctx.font      = '600 22px Georgia, serif';
  ctx.fillText(isRed ? '— ROSSO —' : '— BIANCO —', W / 2, 348);
 
  ctx.fillStyle = '#666';
  ctx.font      = '400 26px Georgia, serif';
  ctx.fillText(wine.anno, W / 2, 395);
 
  // — Sezione bassa: produttore e prezzo —
  ctx.strokeStyle = wine.labelAccent;
  ctx.beginPath();
  ctx.moveTo(40, H - 150); ctx.lineTo(W - 40, H - 150);
  ctx.stroke();
 
  ctx.fillStyle = '#333';
  ctx.font      = '400 20px Helvetica Neue, sans-serif';
  ctx.fillText(wine.produttore, W / 2, H - 100);
 
  // Pallino decorativo
  ctx.fillStyle = wine.labelAccent;
  ctx.beginPath();
  ctx.arc(W / 2, H - 68, 3, 0, Math.PI * 2);
  ctx.fill();
 
  ctx.fillStyle = wine.labelAccent;
  ctx.font      = '600 24px Georgia, serif';
  ctx.fillText(wine.prezzo, W / 2, H - 44);
 
const texture = new THREE.CanvasTexture(cv);

const bottleR = 0.364;           // raggio bottiglia + tiny offset anti z-fight
const labelArc = 0.64 / bottleR; // ampiezza arco in radianti
const mesh = new THREE.Mesh(
  new THREE.CylinderGeometry(
    bottleR, bottleR,             // radiusTop, radiusBottom
    0.96,                         // height
    32,                           // radialSegments
    1,                            // heightSegments
    true,                         // openEnded
    Math.PI / 2 - labelArc / 2,  // thetaStart (centrato verso +Z)
    labelArc                      // thetaLength
  ),
  new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85, side: THREE.FrontSide })
);
mesh.position.set(0, 1.25, 0);   // centro bottiglia, niente offset Z
  return mesh;
}

/* =====================================================
CORK
===================================================== */
function makeCork() {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.125, 0.128, 0.22, 24),
    new THREE.MeshStandardMaterial({ color: '#c4956a', roughness: 0.80 })
  );
  mesh.position.y = 3.21;
  mesh.castShadow = true;
  return mesh;
}

/* =====================================================
  GROUP BOTTLES 
===================================================== */
const bottleGroup = new THREE.Group();
let bottleMesh = null;
let labelMesh  = null;
let corkMesh   = null;
 
function rebuildBottle(wine) {

  while (bottleGroup.children.length > 0) {
    const child = bottleGroup.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
    bottleGroup.remove(child);
  }

  const wineColor = wine.type === 'rosso' ? '#4a0a0a' : '#c8a84b';
  const liquidMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.34,   // raggio superiore (leggermente dentro le pareti)
    0.34,   // raggio inferiore
    1.6,    // altezza — riempie circa metà bottiglia
    32
  ),
  new THREE.MeshPhysicalMaterial({
    color:       wineColor,
    transparent: true,
    opacity:     0.85,
    roughness:   0.0,
    transmission: 0.3,
  })
);
liquidMesh.position.y =  1.05; // dal fondo verso su

  bottleMesh = new THREE.Mesh(
    makeBottleGeometry(),
    new THREE.MeshPhysicalMaterial({
      color:              new THREE.Color(wine.bottleHex),
      transparent:        true,
      opacity:            0.90,
      roughness:          0.06,  // quasi specchio
      metalness:          0.05,
      transmission:       0.18,  // quanto luce passa ATTRAVERSO il vetro
      thickness:          0.9,   // spessore percepito del vetro
      ior:                1.52,  // Indice di rifrazione (vetro reale = ~1.5)
      clearcoat:          1.0,   // strato lucido superficiale
      clearcoatRoughness: 0.04,
    })
  );
  bottleMesh.castShadow    = true;
  bottleMesh.receiveShadow = true;
 
  labelMesh = makeLabel(wine);
  corkMesh  = makeCork();
 
  bottleGroup.add(liquidMesh, bottleMesh, labelMesh, corkMesh);
}
 
rebuildBottle(WINES[0]);
scene.add(bottleGroup);

/* =====================================================
   PARTICLES
   ===================================================== */
 
const PARTICLE_COUNT = 200;
 
const positions = new Float32Array(PARTICLE_COUNT * 3);
 
for (let i = 0; i < PARTICLE_COUNT; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 14; // x
  positions[i * 3 + 1] =  Math.random()        * 7;  // y
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
}
 
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
 
const particles = new THREE.Points(
  particleGeo,
  new THREE.PointsMaterial({
    color:       0xC9A84C,  // oro
    size:        0.018,
    transparent: true,
    opacity:     0.35,
  })
);
scene.add(particles);

/* =====================================================
  RAYCASTER
   ===================================================== */
 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-9, -9);
const tooltipEl = document.getElementById('tooltip');
const ttName    = document.getElementById('tt-name');
const ttYear    = document.getElementById('tt-year');
 
let isHovering = false;
 
window.addEventListener('mousemove', (e) => {

  mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  tooltipEl.style.left = (e.clientX + 18) + 'px';
  tooltipEl.style.top  = (e.clientY - 14) + 'px';
});
 

/* =====================================================
WINE SELECTION
   ===================================================== */
 
let currentWine  = WINES[0];
let bounceTimer  = 0; 
 

function updateDetailBar(wine) {
  document.getElementById('d-produttore').textContent = wine.produttore;
  document.getElementById('d-anno').textContent       = wine.anno;
  document.getElementById('d-note').textContent       = wine.note;
  document.getElementById('d-prezzo').textContent     = wine.prezzo;
}
 
function selectWine(wine) {
  if (wine.id === currentWine.id) return;
 
  currentWine = wine;
  rebuildBottle(wine);  
  updateDetailBar(wine); 
 
  bounceTimer = 1;       
 
  document.querySelectorAll('.wine-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.wine) === wine.id);
  });
}
 
document.querySelectorAll('.wine-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectWine(WINES[parseInt(btn.dataset.wine)]);
  });
});
 
updateDetailBar(WINES[0]);

/* =====================================================
  RENDER LOOP  
===================================================== */
const clock = new THREE.Clock();

function tick() {
  requestAnimationFrame(tick);
 
  // getDelta() → secondi trascorsi dall'ultimo frame
  // Usarlo per le animazioni le rende frame-rate independent:
  // a 30fps o 144fps la velocità è sempre la stessa
  const dt = clock.getDelta();
 
  // — Auto-rotazione —
  // Si ferma quando l'utente interagisce con OrbitControls
  if (!userDragging) {
    bottleGroup.rotation.y += dt * 0.18;
  }
 
  // — Bounce al cambio vino —
  if (bounceTimer > 0) {
    bounceTimer -= dt * 4.5;
    const scale = 1 + 0.06 * Math.sin(bounceTimer * Math.PI) * bounceTimer;
    bottleGroup.scale.setScalar(scale);
  } else {
    bounceTimer = 0;
    bottleGroup.scale.setScalar(1); // assicura che torni esattamente a 1
  }
 
  // — Rotazione lenta delle particelle —
  particles.rotation.y += dt * 0.018;
 
  // — Raycaster hover check —
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects([bottleMesh, labelMesh, corkMesh]);
 
  if (hits.length > 0 && !isHovering) {
    // Mouse appena entrato sulla bottiglia
    isHovering = true;
    ttName.textContent = currentWine.name;
    ttYear.textContent = currentWine.anno + '  ·  ' + currentWine.produttore;
    tooltipEl.classList.add('show');
  } else if (hits.length === 0 && isHovering) {
    // Mouse appena uscito dalla bottiglia
    isHovering = false;
    tooltipEl.classList.remove('show');
  }
    controls.update();
    renderer.render(scene, camera);
}

tick();

/* =====================================================
   17. RESIZE
   ===================================================== */
 
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
 
  camera.aspect = w / h;
  camera.updateProjectionMatrix(); // applica il nuovo aspect
 
  renderer.setSize(w, h);
});
 

setTimeout(() => {
  document.getElementById('loader').classList.add('hide');
}, 900);