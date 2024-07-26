import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader, STLExporter, Constraint } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const exporter = new STLExporter();
const loader = new STLLoader()
const material = new THREE.MeshMatcapMaterial()

async function loadGlyphs(glyphs: string[]) {
    let Xpos = 0;
    (await Promise.all(glyphs.map(glyph => loader.loadAsync(`font/${glyph}.stl`))).then()).forEach(geometry => {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(Xpos, 0, 0);
        Xpos += 0.29;
        mesh.rotateY(0.7);
        scene.add(mesh);
    });
}

function exportSTL(filename: string) {
    const options = { binary: true }
    const result = exporter.parse( scene, options ) as DataView;
    const url = URL.createObjectURL(new Blob([result.buffer], { type: 'application/sla' }));
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

function setup3DCanvas(canvasContainer: HTMLElement) {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(width, height);
    canvasContainer.appendChild(renderer.domElement);

    camera.position.z = 2.5;
    controls.update();

    function animate() {
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        const w = canvasContainer.clientWidth;
        const h = canvasContainer.clientHeight;

        renderer.setSize(w, h);
        camera.aspect = w / h;
        controls.update();
        camera.updateProjectionMatrix();
    }
}

function update3DText(glyphs: string[]) {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    loadGlyphs(glyphs);
}

export { setup3DCanvas, update3DText, exportSTL }
