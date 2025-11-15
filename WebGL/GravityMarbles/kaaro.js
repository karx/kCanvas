import * as THREE from 'three';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import * as CANNON from 'cannon-es';

let camera, scene, renderer;
let world;
let sphereMesh, sphereBody;
let targetMesh, targetBody;
let gyroscopeData = { x: 0, y: 0 };
let gameWon = false;
let mazeObjects = [];

init();

function init() {

    const canvas = document.querySelector('#glCanvas');
    const levelSelect = document.getElementById('level-select');
    const generateButton = document.getElementById('generate-button');

    levelSelect.addEventListener('change', (event) => {
        const size = parseInt(event.target.value);
        clearMaze();
        const maze = generateMaze(size, size);
        createMaze3D(maze);
    });

    generateButton.addEventListener('click', () => {
        const size = parseInt(levelSelect.value);
        clearMaze();
        const maze = generateMaze(size, size);
        createMaze3D(maze);
    });

    camera = new THREE.PerspectiveCamera( 70, canvas.width / canvas.height, 0.1, 100 );
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    // Physics world
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    const groundGeometry = new THREE.PlaneGeometry( 40, 40 );
    const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x808080, side: THREE.DoubleSide } );
    const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add( groundMesh );

    // Sphere
    const sphereShape = new CANNON.Sphere(0.2);
    sphereBody = new CANNON.Body({ mass: 1 });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0, 5, 0);
    world.addBody(sphereBody);
    sphereBody.addEventListener("collide", (event) => {
        if(event.body === targetBody) {
            gameWon = true;
            targetMesh.material.color.set(0x00ff00);
        }
    });

    const sphereGeometry = new THREE.SphereGeometry( 0.2 );
    const sphereMaterial = new THREE.MeshNormalMaterial();
    sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    scene.add( sphereMesh );

    // Maze
    const maze = generateMaze(11, 11);
    createMaze3D(maze);

    // Target
    createTarget(4, -4);


    // Gyroscope
    window.addEventListener('deviceorientation', handleOrientation);


    renderer = new WebGPURenderer( { canvas: canvas, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( canvas.width, canvas.height );
    renderer.setAnimationLoop( animate );

}

function clearMaze() {
    for (const obj of mazeObjects) {
        scene.remove(obj.mesh);
        world.removeBody(obj.body);
    }
    mazeObjects = [];
}

function createTarget(x, z) {
    const targetShape = new CANNON.Cylinder(0.5, 0.5, 0.1, 16);
    targetBody = new CANNON.Body({ mass: 0, isTrigger: true });
    targetBody.addShape(targetShape);
    targetBody.position.set(x, 0.05, z);
    world.addBody(targetBody);

    const targetGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    targetMesh.position.set(x, 0.05, z);
    scene.add(targetMesh);
}

function handleOrientation(event) {
    // The Y axis of the gyroscopedata will be controlled by the gamma property of the deviceorientationevent.
    gyroscopeData.y = event.gamma;
    // The X axis of the gyroscope data will be controlled by the beta property of the deviceorientationevent.
    gyroscopeData.x = event.beta;
}

function createWall(x, y, z, width, height, depth) {
    const wallShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(wallShape);
    wallBody.position.set(x, y, z);
    world.addBody(wallBody);

    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(x, y, z);
    scene.add(wallMesh);
    mazeObjects.push({ mesh: wallMesh, body: wallBody });
}

function createMaze3D(maze) {
    const wallHeight = 1;
    const wallDepth = 0.5;
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 1) {
                const x = j - Math.floor(maze[i].length / 2);
                const z = i - Math.floor(maze.length / 2);
                createWall(x, wallHeight / 2, z, 1, wallHeight, wallDepth);
            }
        }
    }
}


function generateMaze(width, height) {
    let maze = Array(height).fill(null).map(() => Array(width).fill(1));
    let stack = [];
    let startX = Math.floor(Math.random() * (width/2)) * 2 + 1;
    let startY = Math.floor(Math.random() * (height/2)) * 2 + 1;

    maze[startY][startX] = 0;
    stack.push([startX, startY]);

    while(stack.length > 0) {
        let [cx, cy] = stack[stack.length - 1];
        let neighbors = [];

        // Check neighbors
        if (cx - 2 >= 0 && maze[cy][cx - 2] === 1) neighbors.push([cx - 2, cy, 'L']);
        if (cx + 2 < width && maze[cy][cx + 2] === 1) neighbors.push([cx + 2, cy, 'R']);
        if (cy - 2 >= 0 && maze[cy - 2][cx] === 1) neighbors.push([cx, cy - 2, 'U']);
        if (cy + 2 < height && maze[cy + 2][cx] === 1) neighbors.push([cx, cy + 2, 'D']);

        if(neighbors.length > 0) {
            let [nx, ny, dir] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[ny][nx] = 0;
            if(dir === 'L') maze[ny][nx + 1] = 0;
            if(dir === 'R') maze[ny][nx - 1] = 0;
            if(dir === 'U') maze[ny + 1][nx] = 0;
            if(dir === 'D') maze[ny - 1][nx] = 0;
            stack.push([nx, ny]);
        } else {
            stack.pop();
        }
    }
    return maze;
}


function animate() {

    // Update gravity based on gyroscope
    if(!gameWon) {
        const gravity = 9.82;
        world.gravity.set(
            (gyroscopeData.y / 90) * gravity,
            -gravity,
            (gyroscopeData.x / 90) * gravity
        );
    }


    world.step(1/60);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render( scene, camera );

}
