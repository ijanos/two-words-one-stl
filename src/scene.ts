import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader, STLExporter } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new STLLoader()
const material = new THREE.MeshMatcapMaterial()
const exporter = new STLExporter();

async function loadGlyphs(glyphs: string[]) {
    let Xpos = 0;
    (await Promise.all(glyphs.map(glyph => loader.loadAsync(`font/${glyph}.stl`))).then()).forEach(geometry => {
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh);
        mesh.position.set(Xpos, 0, 0);
        Xpos += 0.29;
        mesh.rotateY(0.7);
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
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);


    loadGlyphs(["FL", "OA", "RB", "MS"]);

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
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    loadGlyphs(glyphs);
}

export { setup3DCanvas, update3DText, exportSTL }
