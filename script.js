import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById('canvas-wrap').appendChild(renderer.domElement);