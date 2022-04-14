const loader = new THREE.GLTFLoader();
const models = [
    {
        name: "Test 1",
        path: "./test1.glb",
        scale: 1
    },
    {
        name: "Test 2",
        path: "./test2.glb",
        scale: 1.25
    },
    {
        name: "Test 3",
        path: "./test3.glb",
        scale: 0.25
    }
];

function AddLights(scene) {
    const light = new THREE.DirectionalLight(0xffffff, 2);
    const light2 = new THREE.DirectionalLight(0xfc035a, 2);
    light.position.set(2, 2, 5);
    scene.add(light, light2);
}

function LoadModel(modelPath, scale, loaded) {
    loader.load(modelPath, function (glft) {
        const model = glft.scene;
        model.position.set(0, -.7, 0);
        model.scale.set(scale, scale, scale);
        loaded(model);
    }, undefined, function (error) {
        console.error(error);
    });
}

const modelButtonContainer = document.getElementById('modelButtonContainer');
for (let i = 0; i < models.length; i++) {
    const button = document.createElement('button');
    button.setAttribute('model-id', i);
    button.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2";
    button.classList.add('model-load-button');
    button.innerText = models[i].name;
    modelButtonContainer.appendChild(button);
}


const containerWidth = 1000;
const containerHeight = 600;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
let activeModel = null;

const buttons = document.getElementsByClassName('model-load-button');
Array.prototype.forEach.call(buttons, function (button) {
    button.onclick = () => {
        const model = models[button.getAttribute('model-id')];
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        LoadModel(model.path, model.scale, (loadedModel) => {
            activeModel = loadedModel;
            scene.add(activeModel);
        });
        AddLights(scene);
    }
});

const container = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer();
renderer.setSize(containerWidth, containerHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.enableDamping = true;
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    if (activeModel) {
        activeModel.rotation.y += 0.003;
    }

    controls.update();

    renderer.render(scene, camera);
};

animate();