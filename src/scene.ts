import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/Addons.js';

function setup3DCanvas(canvasContainer: HTMLElement) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);
    const material = new THREE.MeshMatcapMaterial()
    const loader = new STLLoader()

    let Xpos = 0;

    function loadGlyph(glyph: string) {
        loader.load(
            `font/${glyph}.stl`,
            function (geometry) {
                const mesh = new THREE.Mesh(geometry, material)
                scene.add(mesh);
                mesh.position.set(Xpos, 0, 0);
                Xpos += 0.29;
                mesh.rotateY(0.7);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    }

    loadGlyph("FL");
    loadGlyph("OA");
    loadGlyph("RB");
    loadGlyph("MS");


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

function update3DText(letterPairs: string[]) {
    console.log(letterPairs);
}

export { setup3DCanvas, update3DText }