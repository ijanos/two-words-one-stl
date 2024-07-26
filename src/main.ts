import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );

const loader = new STLLoader()
loader.load(
    'font/FL.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

const controls = new OrbitControls( camera, renderer.domElement );

camera.position.z = 5;
controls.update();

function animate() {
  requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
