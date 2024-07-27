import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader, STLExporter, RoundedBoxGeometry } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const exporter = new STLExporter();
const loader = new STLLoader()
const material = new THREE.MeshMatcapMaterial({ flatShading: true });
let orbitControl: OrbitControls|undefined = undefined;
let loadingIndicator:  HTMLElement|undefined = undefined;

async function loadGlyphs(glyphs: string[], addBase: boolean, spacing: number) {
    loadingIndicator!.style.display = "block";
    let Xpos = 0;
    (await Promise.all(glyphs.map(glyph => loader.loadAsync(`font/${glyph}.stl`))).then()).forEach(geometry => {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(Xpos, 0, 0);
        Xpos += spacing;
        mesh.rotateY(0.785);
        scene.add(mesh);
    });

    const sceneBoundingBox = new THREE.Box3().setFromObject(scene);
    const sceneCenter = new THREE.Vector3();
    sceneBoundingBox.getCenter(sceneCenter);
    orbitControl!.target = sceneCenter;

    if (addBase) {
        const dimensions = new THREE.Vector3().subVectors(sceneBoundingBox.max, sceneBoundingBox.min);
        const boxGeo = new RoundedBoxGeometry(dimensions.x, dimensions.y, dimensions.z, 24);
        const matrix = new THREE.Matrix4().setPosition(dimensions.addVectors(sceneBoundingBox.min, sceneBoundingBox.max).multiplyScalar( 0.5 ));
        boxGeo.applyMatrix4(matrix);

        const base = new THREE.Mesh(boxGeo, material);
        base.scale.set(1, 0.095, 1);
        base.position.y -= 0.02;
        scene.add(base);
    }
    loadingIndicator!.style.display = "none";
}

function exportSTL(filename: string) {
    const options = { binary: true }
    const result = exporter.parse(scene, options) as DataView;
    const url = URL.createObjectURL(new Blob([result.buffer], { type: 'application/sla' }));
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

function setup3DCanvas(canvasContainer: HTMLElement, loadingDiv: HTMLElement) {
    loadingIndicator = loadingDiv;
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);
    orbitControl = controls;
    controls.enablePan = false;
    controls.enableDamping = true;

    renderer.setSize(width, height);
    canvasContainer.appendChild(renderer.domElement);

    camera.position.z = 2.5;
    controls.update();

    function animate() {
        controls.update();
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

function update3DText(glyphs: string[], addBase: boolean, spacing: number) {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    loadGlyphs(glyphs, addBase, spacing);
}

export { setup3DCanvas, update3DText, exportSTL }
