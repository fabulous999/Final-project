/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var LineBasicMaterial = THREE.LineBasicMaterial;
var PhongMaterial = THREE.MeshPhongMaterial;
var Material = THREE.Material;
var Texture = THREE.Texture;
var Line = THREE.Line;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var CScreen = config.Screen;
var Clock = THREE.Clock;
var Points = THREE.Points;
var PointsMaterial = THREE.PointsMaterial;
// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";
// Game Variables
var scene;
var currentScene;
var renderer;
var camera;
var play;
var menu;
var level2;
var level3;
var level4;
var level5;
var stats;
var canvas;
var assets;
var windx = 0;
var windy = -10;
var windz = 0;
var score = 100;
var manifest = [
    { id: "land", src: "../../Assets/audio/Land.wav" },
    { id: "death", src: "../../Assets/audio/death.wav" },
    { id: "coin", src: "../../Assets/audio/coin.mp3" },
    { id: "jump", src: "../../Assets/audio/jump.wav" },
    { id: "StartButton", src: "../../Assets/images/StartButton.png" },
    { id: "InstructionsButton", src: "../../Assets/images/InstructionsButton.png" },
    { id: "ExitButton", src: "../../Assets/images/ExitButton.png" },
    { id: "Level2Button", src: "../../Assets/images/Level2Button.png" },
    { id: "Level3Button", src: "../../Assets/images/Level3Button.png" },
    { id: "Level4Button", src: "../../Assets/images/Level4Button.png" },
    { id: "Level5Button", src: "../../Assets/images/Level5Button.png" },
    { id: "Background", src: "../../Assets/images/background.png" },
    { id: "bgmusic", src: "../../Assets/audio/bgmusic.wav" },
    { id: "first", src: "../../Assets/audio/level1.wav" }
];
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
}
function setupCanvas() {
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", config.Screen.WIDTH.toString());
    canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
    canvas.style.backgroundColor = "#000000";
}
function init() {
    // setup the canvas for the game
    setupCanvas();
    // setup the default renderer
    setupRenderer();
    // setup the camera
    setupCamera();
    // set initial scene
    currentScene = config.Scene.MENU;
    changeScene();
    // Add framerate stats
    addStatsObject();
    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    // setup the resize event listener
    window.addEventListener('resize', onWindowResize, false);
}
// Window Resize Event Handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.resize();
}
// Add Frame Rate Stats to the Scene
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}
function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
setInterval(function () { windx = randomIntInc(-2, 2); }, 10000);
setInterval(function () { windy = randomIntInc(-15, -7); }, 10000);
setInterval(function () { windz = randomIntInc(-2, 2); }, 10000);
//setInterval(score - 1 , 1000 );
// Setup main game loop
function gameLoop() {
    stats.update();
    scene.update();
    scene.setGravity(new THREE.Vector3(windx, windy, windz));
    //this.timeLabel.text = "score" + this.score + "   time :" + this.time ;
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
    // render the scene
    renderer.render(scene, camera);
}
// Setup default renderer
function setupRenderer() {
    renderer = new Renderer({ antialias: true });
    renderer.setClearColor(0x404040, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}
// Setup main camera for the scene
function setupCamera() {
    camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.2, 100);
    console.log("Finished setting up Camera...");
}
function changeScene() {
    // Launch various scenes
    switch (currentScene) {
        case config.Scene.MENU:
            // show the MENU scene
            menu = new scenes.Menu();
            scene = menu;
            console.log("Starting MENU Scene");
            break;
        case config.Scene.PLAY:
            // show the PLAY scene
            play = new scenes.Play();
            scene = play;
            console.log("Starting PLAY Scene");
            break;
        case config.Scene.level2:
            // show level 2 scene
            level2 = new scenes.level2();
            scene = level2;
            console.log("Starting Level 2 Scene");
            break;
        case config.Scene.level3:
            // show level 2 scene
            level3 = new scenes.level3();
            scene = level3;
            console.log("Starting Level 3 Scene");
            break;
        case config.Scene.level4:
            // show level 2 scene
            level4 = new scenes.level4();
            scene = level4;
            console.log("Starting Level 4 Scene");
            break;
        case config.Scene.level5:
            // show level 2 scene
            level5 = new scenes.level5();
            scene = level5;
            console.log("Starting Level 5 Scene");
            break;
    }
}
window.onload = preload;
//# sourceMappingURL=game.js.map