import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new STLLoader()

async function setup3DCanvas(canvasContainer: HTMLElement) {
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);
    const material = new THREE.MeshMatcapMaterial()

    let Xpos = 0;

    async function loadGlyph(glyph: string) {
        const geometry = await loader.loadAsync(`font/${ glyph }.stl`);
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh);
        mesh.position.set(Xpos, 0, 0);
        Xpos += 0.29;
        mesh.rotateY(0.7);
    }

    await loadGlyph("FL");
    await loadGlyph("OA");
    await loadGlyph("RB");
    await loadGlyph("MS");

    camera.position.z = 2.5;
    controls.update();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        const w = canvasContainer.clientWidth;
        const h = canvasContainer.clientHeight;

        renderer.setSize(w, h);
        console.log(renderer.domElement.width);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
}

function update3DText(glyphs: string[]) {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    glyphs.forEach(glyph => {

    });
}

export { setup3DCanvas, update3DText }
