import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader, STLExporter } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const exporter = new STLExporter();
const loader = new STLLoader()
const material = new THREE.MeshMatcapMaterial()


async function loadGlyphs(glyphs: string[], addBase: boolean) {
    let Xpos = 0;
    (await Promise.all(glyphs.map(glyph => loader.loadAsync(`font/${glyph}.stl`))).then()).forEach(geometry => {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(Xpos, 0, 0);
        Xpos += 0.29;
        mesh.rotateY(0.7);
        scene.add(mesh);
    });

    if (addBase) {
        const sceneBBox = new THREE.Box3().setFromObject(scene);
        const dimensions = new THREE.Vector3().subVectors( sceneBBox.max, sceneBBox.min );
        const boxGeo = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        const matrix = new THREE.Matrix4().setPosition(dimensions.addVectors(sceneBBox.min, sceneBBox.max).multiplyScalar( 0.5 ));
        boxGeo.applyMatrix4(matrix);

        const base = new THREE.Mesh( boxGeo, material );
        base.scale.set(1,0.05,1);
        scene.add(base);
    }
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
    const height = canvasContainer.clientHeight;
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

function update3DText(glyphs: string[], addBase: boolean) {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    loadGlyphs(glyphs, addBase);
}

export { setup3DCanvas, update3DText, exportSTL }
