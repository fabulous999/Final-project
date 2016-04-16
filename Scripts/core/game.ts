/// <reference path="_reference.ts"/>

// MAIN GAME FILE

// THREEJS Aliases
import Scene = Physijs.Scene;
import Renderer = THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import LineBasicMaterial = THREE.LineBasicMaterial;
import PhongMaterial = THREE.MeshPhongMaterial;
import Material = THREE.Material;
import Texture = THREE.Texture;
import Line = THREE.Line;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import CScreen = config.Screen;
import Clock = THREE.Clock;
import Points = THREE.Points;
import PointsMaterial = THREE.PointsMaterial;

// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";

// Game Variables
var scene: scenes.Scene;
var currentScene: number;
var renderer: Renderer;
var camera: PerspectiveCamera;

var play: scenes.Play;
var menu: scenes.Menu;
var level2: scenes.level2;
var level3: scenes.level3;

var stats: Stats;
var canvas: HTMLElement;
var assets: createjs.LoadQueue;
var windx : number = 0;
var windy : number = -10;
var windz : number =0;



var manifest = [
    { id: "land", src: "../../Assets/audio/Land.wav" },
    { id: "death", src: "../../Assets/audio/death.wav" },
    { id: "coin", src: "../../Assets/audio/coin.mp3" },
    { id: "jump", src: "../../Assets/audio/jump.wav" },
    { id: "StartButton", src: "../../Assets/images/StartButton.png"},
    { id: "Background", src: "../../Assets/images/background.png"},
    { id: "bgmusic", src:"../../Assets/audio/bgmusic.wav"},
    { id: "first", src:"../../Assets/audio/level1.wav"} 
];

function preload(): void {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
}

function setupCanvas(): void {
    canvas = document.getElementById("canvas");
    canvas.setAttribute("width", config.Screen.WIDTH.toString());
    canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
    canvas.style.backgroundColor = "#000000";
}

function init(): void {
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
function onWindowResize(): void {
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
 setInterval(function() {windx = randomIntInc(-2,2) }, 10000); 
 setInterval(function() {windy = randomIntInc(-15,-7) }, 10000); 
 setInterval(function() {windz = randomIntInc(-2,2) }, 10000); 
 
// Setup main game loop
function gameLoop(): void {
    stats.update();

    scene.update();
//    this.scoreLabel.text = "wind x:"+ windx + "   wind y:"+ windy +  "  wind z: "+ windz; //windx
    scene.setGravity(new THREE.Vector3(windx,windy,windz));
   
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);

    // render the scene
    renderer.render(scene, camera);
}


// Setup default renderer
function setupRenderer(): void {
    renderer = new Renderer({ antialias: true });
    renderer.setClearColor(0x404040, 1.0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}

// Setup main camera for the scene
function setupCamera(): void {
    camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 300);
    //camera.position.set(0, 10, 30);
    //camera.lookAt(new Vector3(0, 0, 0));
    console.log("Finished setting up Camera...");
}

function changeScene(): void {
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
            
            
     /*   case config.Scene.OVER:
            // show the game OVER scene
            /*
            over = new scenes.Over();
            scene = over;
            console.log("Starting OVER Scene");
            */
        //    break;
    }
}

window.onload = preload;

