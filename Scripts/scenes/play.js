var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * The Scenes module is a namespace to reference all scene objects
 *
 * @module scenes
 */
var scenes;
(function (scenes) {
    /**
     * The Play class is where the main action occurs for the game
     *
     * @class Play
     * @param havePointerLock {boolean}
     */
    var Play = (function (_super) {
        __extends(Play, _super);
        /**
         * @constructor
         */
        function Play() {
            _super.call(this);
            this.windx = 0;
            this.windy = -10;
            this.windz = 0;
            this.isparkor = false;
            this.player_height = null;
            this.parkour_height = null;
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++
        /**
         * Sets up the initial canvas for the play scene
         *
         * @method setupCanvas
         * @return void
         */
        Play.prototype._setupCanvas = function () {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
        };
        /**
         * The initialize method sets up key objects to be used in the scene
         *
         * @method _initialize
         * @returns void
         */
        Play.prototype._initialize = function () {
            // Create to HTMLElements
            this._firstMusic = createjs.Sound.play("first");
            this._firstMusic.loop = -1;
            this.blocker = document.getElementById("blocker");
            this.instructions = document.getElementById("instructions");
            this.blocker.style.display = "block";
            // setup canvas for menu scene
            this._setupCanvas();
            this.prevTime = 0;
            this.stage = new createjs.Stage(canvas);
            this.velocity = new Vector3(0, 0, 0);
            // setup a THREE.JS Clock object
            this.clock = new Clock();
            // Instantiate Game Controls
            this.keyboardControls = new objects.KeyboardControls();
            this.mouseControls = new objects.MouseControls();
        };
        /**
         * This method sets up the scoreboard for the scene
         *
         * @method setupScoreboard
         * @returns void
         */
        Play.prototype.setupScoreboard = function () {
            // initialize  score and lives values
            this.scoreValue = 0;
            this.livesValue = 5;
            // Add Lives Label
            this.livesLabel = new createjs.Text("LIVES: " + this.livesValue, "40px Consolas", "#ffffff");
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");
            // Add Score Label
            this.scoreLabel = new createjs.Text("SCORE: " + this.scoreValue, "25px Consolas", "#ffffff");
            this.scoreLabel.x = config.Screen.WIDTH * 0.4;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
        };
        Play.prototype.randomIntInc = function (low, high) {
            return Math.floor(Math.random() * (high - low + 1) + low);
        };
        /**
          * Add a spotLight to the scene
          *
          * @method addSpotLight
          * @return void
          */
        Play.prototype.addSpotLight = function () {
            // Spot Light
            this.spotLight = new SpotLight(0xffffff);
            this.spotLight.position.set(20, 40, -15);
            this.spotLight.castShadow = true;
            this.spotLight.intensity = 2;
            this.spotLight.lookAt(new Vector3(0, 0, 0));
            this.spotLight.shadowCameraNear = 2;
            this.spotLight.shadowCameraFar = 200;
            this.spotLight.shadowCameraLeft = -5;
            this.spotLight.shadowCameraRight = 5;
            this.spotLight.shadowCameraTop = 5;
            this.spotLight.shadowCameraBottom = -5;
            this.spotLight.shadowMapWidth = 2048;
            this.spotLight.shadowMapHeight = 2048;
            this.spotLight.shadowDarkness = 0.5;
            this.spotLight.name = "Spot Light";
            this.add(this.spotLight);
            console.log("Added spotLight to scene");
        };
        Play.prototype.addAmbientLight = function () {
            // Ambient Light
            this.ambientLight = new AmbientLight(0x808080);
            this.add(this.ambientLight);
        };
        /**
         * Add a ground plane to the scene
         *
         * @method addGround
         * @return void
         */
        Play.prototype.addGround = function () {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/earth.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(1, 1);
            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/earth.jpg');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(1, 1);
            this.groundMaterial = new PhongMaterial();
            this.groundMaterial.map = this.groundTexture;
            this.groundMaterial.bumpMap = this.groundTextureNormal;
            this.groundMaterial.bumpScale = 0.2;
            this.groundGeometry = new BoxGeometry(32, 1, 32);
            this.groundPhysicsMaterial = Physijs.createMaterial(this.groundMaterial, 0, 0);
            this.ground = new Physijs.ConvexMesh(this.groundGeometry, this.groundPhysicsMaterial, 0);
            this.ground.receiveShadow = true;
            this.ground.name = "Ground";
            this.add(this.ground);
            console.log("Added Burnt Ground to scene");
        };
        /**
         * Adds the player controller to the scene
         *
         * @method addPlayer
         * @return void
         */
        Play.prototype.addPlayer = function () {
            // Player Object
            this.playerGeometry = new BoxGeometry(2, 4, 2);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(0, 30, 10);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            console.log("Added Player to Scene");
        };
        /**
         * Add the death plane to the scene
         *
         * @method addDeathPlane
         * @return void
         */
        Play.prototype.addDeathPlane = function () {
            this.deathPlaneGeometry = new BoxGeometry(50, 1, 50, 3);
            this.deathplanetexture = new THREE.TextureLoader().load('../../Assets/images/void.jpg');
            this.deathplanetexture.wrapS = THREE.RepeatWrapping;
            this.deathplanetexture.wrapT = THREE.RepeatWrapping;
            this.deathplanetexture.repeat.set(1, 1);
            this.groundMaterials = new PhongMaterial();
            this.groundMaterials.map = this.deathplanetexture;
            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.groundMaterials, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
        };
        //background
        Play.prototype.spacebg = function () {
            this.spacegeo = new SphereGeometry(200, 200, 200);
            this.spacetex = THREE.ImageUtils.loadTexture('../../Assets/images/space.jpg');
            this.spacetex.wrapS = THREE.RepeatWrapping;
            this.spacetex.wrapT = THREE.RepeatWrapping;
            this.spacetex.repeat.set(8, 8);
            this.sapcePhong = new PhongMaterial();
            this.sapcePhong.map = this.spacetex;
            this.space = new Physijs.SphereMesh(this.deathPlaneGeometry, this.sapcePhong, 0);
            this.space.position.set(0, -10, 0);
            this.space.name = "space";
            this.space.material.side = THREE.DoubleSide;
            this.add(this.space);
        };
        Play.prototype.differentSizeWide = function () {
            for (var i = 0; i < 20; i++) {
                this.obstacleGeometry = new BoxGeometry(randomIntInc(4, 5), randomIntInc(5, 5), randomIntInc(5, 5));
                this.obsticaltex = THREE.ImageUtils.loadTexture('../../Assets/images/moon.png');
                this.obsticaltex.wrapS = THREE.RepeatWrapping;
                this.obsticaltex.wrapT = THREE.RepeatWrapping;
                this.obsticaltex.repeat.set(1, 1);
                this.obsticalpong = new PhongMaterial();
                this.obsticalpong.map = this.obsticaltex;
                // this.obstacleMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xffffff }), 0.4, 0);
                this.obstacle = new Physijs.BoxMesh(this.obstacleGeometry, this.obsticalpong, 0);
                this.obstacle.name = "obstacle";
                this.obstacle.receiveShadow = true;
                this.obstacle.castShadow = true;
                //really proud how i did the stair cube down there is basicly a math formula that kinda orginise them randomly
                this.obstacle.position.set(randomIntInc(-1 + (i * 6), 1 + (i * 5)), randomIntInc(2 + (i * 8), 3 + (i * 8)), randomIntInc(-0, 2));
                this.add(this.obstacle);
                console.log("Added obstacle to Scene  " + this.obstacle.position.y);
                if (i == 4) {
                    console.log("asdf " + i);
                    this.goalGeometry = new BoxGeometry(randomIntInc(2, 5), randomIntInc(2, 5), randomIntInc(2, 5));
                    this.goalMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xff000000 }), 0.4, 0);
                    this.goal = new Physijs.BoxMesh(this.goalGeometry, this.goalMaterial, 0);
                    this.goal.name = "goal";
                    this.goal.receiveShadow = true;
                    this.goal.castShadow = true;
                    this.goal.position.set(10, 0, 0);
                    this.add(this.goal);
                    console.log("Added goal" + this.goal.name);
                }
            }
        };
        /*
         * Event Handler method for any pointerLockChange events
         *
         * @method pointerLockChange
         * @return void
         */
        Play.prototype.pointerLockChange = function (event) {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            }
            else {
                // disable our mouse and keyboard controls
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                this.blocker.style.display = '-webkit-box';
                this.blocker.style.display = '-moz-box';
                this.blocker.style.display = 'box';
                this.instructions.style.display = '';
                console.log("PointerLock disabled");
            }
        };
        /**
         * Event handler for PointerLockError
         *
         * @method pointerLockError
         * @return void
         */
        Play.prototype.pointerLockError = function (event) {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        };
        // Check Controls Function
        /**
         * This method updates the player's position based on user input
         *
         * @method checkControls
         * @return void
         */
        Play.prototype.checkControls = function () {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3();
                var time = performance.now();
                var delta = (time - this.prevTime) / 1000;
                var direction = new Vector3(0, 0, 0);
                if (this.keyboardControls.moveForward) {
                    this.velocity.z -= 400.0 * delta;
                }
                if (this.keyboardControls.moveLeft) {
                    this.velocity.x -= 400.0 * delta;
                }
                if (this.keyboardControls.moveBackward) {
                    this.velocity.z += 400.0 * delta;
                }
                if (this.keyboardControls.moveRight) {
                    this.velocity.x += 400.0 * delta;
                }
                if (this.isGrounded) {
                    if (this.keyboardControls.jump) {
                        this.velocity.y += 4000.0 * delta;
                        //   this.isGrounded = false;
                        if (this.player.position.y > (this.player_height + 0.5)) {
                            this.isGrounded = false;
                            console.log("it false " + this.player_height);
                        }
                    }
                    if (this.isparkor) {
                        if (this.keyboardControls.shift) {
                            {
                                this.velocity.y += 4000.0 * delta;
                                console.log(this.obstacle.position.y);
                                if (this.player.position.y > (this.parkour_height + 0.2)) {
                                    this.isparkor = false;
                                    console.log("it false " + this.player_height);
                                }
                            }
                        }
                    }
                }
                this.player.setDamping(0.7, 0.1);
                // Changing player's rotation
                this.player.setAngularVelocity(new Vector3(0, this.mouseControls.yaw, 0));
                direction.addVectors(direction, this.velocity);
                direction.applyQuaternion(this.player.quaternion);
                if (Math.abs(this.player.getLinearVelocity().x) < 20 && Math.abs(this.player.getLinearVelocity().y) < 10) {
                    this.player.applyCentralForce(direction);
                }
                // isGrounded ends
                this.cameraLook();
                //reset Pitch and Yaw
                this.mouseControls.pitch = 0;
                this.mouseControls.yaw = 0;
                this.prevTime = time;
            }
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
                this.player.setAngularFactor(new Vector3(0, 0, 0));
            }
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        Play.prototype.start = function () {
            var _this = this;
            var self = this;
            // Set Up Scoreboard
            this.setupScoreboard();
            //check to see if pointerlock is supported
            this.havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;
            // Check to see if we have pointerLock
            if (this.havePointerLock) {
                this.element = document.body;
                this.instructions.addEventListener('click', function () {
                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");
                    _this.element.requestPointerLock = _this.element.requestPointerLock ||
                        _this.element.mozRequestPointerLock ||
                        _this.element.webkitRequestPointerLock;
                    _this.element.requestPointerLock();
                });
                document.addEventListener('pointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('mozpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('webkitpointerlockchange', this.pointerLockChange.bind(this), false);
                document.addEventListener('pointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('mozpointerlockerror', this.pointerLockError.bind(this), false);
                document.addEventListener('webkitpointerlockerror', this.pointerLockError.bind(this), false);
            }
            // Scene changes for Physijs
            this.name = "Main";
            this.fog = new THREE.Fog(0xffffff, 0, 750);
            this.setGravity(new THREE.Vector3(0, -10, 0));
            this.addEventListener('update', function () {
                _this.simulate(undefined, 2);
            });
            // Add Spot Light to the scene
            this.addSpotLight();
            // Add Ambient Light to the scene
            this.addAmbientLight();
            // Ground Object
            this.addGround();
            // Add player controller
            this.addPlayer();
            // Add death plane to the scene
            this.addDeathPlane();
            this.differentSizeWide();
            //  this.spacebg();
            // Collision Check
            this.player.addEventListener('collision', function (eventObject) {
                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    self.player_height = this.player.position.y;
                    createjs.Sound.play("land");
                    console.log("player_height is " + this.player_height);
                }
                if (eventObject.name === "DeathPlane") {
                    createjs.Sound.play("death");
                    self.livesValue--;
                    self.livesLabel.text = "LIVES: " + self.livesValue;
                    self.remove(self.player);
                    self.player.position.set(0, 30, 10);
                    self.add(self.player);
                }
                if (eventObject.name === "goal") {
                    currentScene = config.Scene.level3;
                    changeScene();
                    this._bgmusic.stop();
                }
                if (eventObject.name === "obstacle") {
                    self.isparkor = true;
                    self.isGrounded = true;
                    self.player_height = this.player.position.y;
                    self.parkour_height = self.player.position.y; //self.obstacle.position.y;
                    console.log("is parkour " + this.parkour_height);
                }
            }.bind(self));
            console.log(name);
            // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.position.set(0, 1, 0);
            this.simulate();
        };
        /**
         * Camera Look function
         *
         * @method cameraLook
         * @return void
         */
        Play.prototype.cameraLook = function () {
            var zenith = THREE.Math.degToRad(90);
            var nadir = THREE.Math.degToRad(-90);
            var cameraPitch = camera.rotation.x + this.mouseControls.pitch;
            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        };
        /**
         * @method update
         * @returns void
         */
        Play.prototype.update = function () {
            this.scoreLabel.text = "wind x:" + windx + "   wind y:" + windy + "  wind z: " + windz;
            this.checkControls();
            this.stage.update();
        };
        /**
         * Responds to screen resizes
         *
         * @method resize
         * @return void
         */
        Play.prototype.resize = function () {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        };
        return Play;
    }(scenes.Scene));
    scenes.Play = Play;
})(scenes || (scenes = {}));

//# sourceMappingURL=play.js.map
