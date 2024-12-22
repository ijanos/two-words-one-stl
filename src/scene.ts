import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader, STLExporter, RoundedBoxGeometry, STLExporterOptions } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const exporter = new STLExporter();
const loader = new STLLoader()
const material = new THREE.MeshMatcapMaterial({ flatShading: true });
let orbitControl: OrbitControls|undefined = undefined;
let loadingIndicator:  HTMLElement|undefined = undefined;

const glyphCache = new Map<string, Promise<THREE.BufferGeometry>>();

async function getGlyph(glyph: string, font: string) {
    const cacheKey = `${ font }_${ glyph }`;
    if (glyphCache.has(cacheKey)) {
        return glyphCache.get(cacheKey);
    }
    const geo = loader.loadAsync(`font_${ font }/${ glyph }.stl`);
    glyphCache.set(cacheKey, geo);
    return geo;
}

async function loadGlyphs(glyphs: string[], addBase: boolean, spacing: number, font: string) {
    loadingIndicator!.style.display = "block";
    let Xpos = 0;
    (await Promise.all(glyphs.map(glyph => getGlyph(glyph, font)))).forEach(geometry => {
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
        const boxGeo = new RoundedBoxGeometry(dimensions.x, dimensions.y, dimensions.z, 8, 0.025);
        const matrix = new THREE.Matrix4().setPosition(dimensions.addVectors(sceneBoundingBox.min, sceneBoundingBox.max).multiplyScalar( 0.5 ));
        boxGeo.applyMatrix4(matrix);

        const base = new THREE.Mesh(boxGeo, material);
        base.scale.set(1.08, 0.18, 1.3);

        base.geometry.computeBoundingBox()
        const bbb = base.geometry.boundingBox;
        const size = new THREE.Vector3();
        bbb?.getSize(size);

        base.position.x -= (size.x * 0.08) / 2;
        base.position.y -= 0.065;
        scene.add(base);
    }
    loadingIndicator!.style.display = "none";
}

function exportSTL(filename: string) {
    const options: STLExporterOptions = { binary: true };
    const result = exporter.parse(scene, options) as DataView;
    const url = URL.createObjectURL(new Blob([result.buffer], { type: 'application/sla' }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
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

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });

    function onWindowResize() {
        const w = canvasContainer.clientWidth;
        const h = canvasContainer.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        controls.update();
        renderer.setSize(w, h);
        renderer.setPixelRatio(window.devicePixelRatio);
    }
    window.addEventListener('resize', onWindowResize, false);

}

function update3DText(glyphs: string[], addBase: boolean, spacing: number, font: string) {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    loadGlyphs(glyphs, addBase, spacing, font);
}

export { setup3DCanvas, update3DText, exportSTL }
