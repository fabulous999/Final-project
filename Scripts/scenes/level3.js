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
    var level3 = (function (_super) {
        __extends(level3, _super);
        /**
         * @constructor
         */
        function level3() {
            _super.call(this);
            this.windx = 0;
            this.windy = -10;
            this.windz = 0;
            this.isparkor = false;
            this.player_height = null;
            this.parkour_height = null;
            this.pre_height = null;
            this.score = 10000;
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
        level3.prototype._setupCanvas = function () {
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
        level3.prototype._initialize = function () {
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
        level3.prototype.setupScoreboard = function () {
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
            this.scoreLabel = new createjs.Text("SCORE: " + this.scoreValue, "40px Consolas", "#ffffff");
            this.scoreLabel.x = config.Screen.WIDTH * 0.3;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");
            // Add Score Label
            this.timeLabel = new createjs.Text("SCORE: " + this.scoreValue, "25px Consolas", "#ffffff");
            this.timeLabel.x = config.Screen.WIDTH * 0.8;
            this.timeLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.timeLabel);
            console.log("Added Score Label to stage");
        };
        level3.prototype.randomIntInc = function (low, high) {
            return Math.floor(Math.random() * (high - low + 1) + low);
        };
        /**
          * Add a spotLight to the scene
          *
          * @method addSpotLight
          * @return void
          */
        level3.prototype.addSpotLight = function () {
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
        level3.prototype.addAmbientLight = function () {
            // Ambient Light
            this.ambientLight = new AmbientLight(0x808080);
            this.add(this.ambientLight);
            console.log("Added ambientLight to scene");
        };
        /**
         * Add a ground plane to the scene
         *
         * @method addGround
         * @return void
         */
        level3.prototype.addGround = function () {
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
        level3.prototype.addPlayer = function () {
            // Player Object
            this.playerGeometry = new BoxGeometry(2, 4, 2);
            this.playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
            this.player = new Physijs.BoxMesh(this.playerGeometry, this.playerMaterial, 1);
            this.player.position.set(-5, 15, 5);
            this.player.receiveShadow = true;
            this.player.castShadow = true;
            this.player.name = "Player";
            this.add(this.player);
            console.log("Added Player to Scene");
        };
        /**
         * Adds obstacles to scene
         *
         * @method addObs
         * @return void
         */
        level3.prototype.addObs = function () {
            // Texture and Material set
            this.obstacleTexture = new THREE.TextureLoader().load('../../Assets/images/brick.jpg');
            this.obstacleTexture.wrapS = THREE.RepeatWrapping;
            this.obstacleTexture.wrapT = THREE.RepeatWrapping;
            this.obstacleTexture.repeat.set(8, 8);
            this.obstacleMat = new PhongMaterial();
            this.obstacleMat.map = this.obstacleTexture;
            this.obstacleMat.bumpScale = 0.2;
            this.goalTexture = new THREE.TextureLoader().load('../../Assets/images/checker.png');
            this.goalTexture.wrapS = THREE.RepeatWrapping;
            this.goalTexture.wrapT = THREE.RepeatWrapping;
            this.goalTexture.repeat.set(8, 8);
            this.goalMat = new PhongMaterial();
            this.goalMat.map = this.goalTexture;
            this.goalMat.bumpScale = 0.2;
            // Obstacles
            this.obstacleGeo = new BoxGeometry(5, 4, 5);
            this.obstaclePM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle = new Physijs.BoxMesh(this.obstacleGeo, this.obstaclePM, 0);
            this.obstacle.receiveShadow = true;
            this.obstacle.castShadow = true;
            this.obstacle.position.set(0, 2.5, 0);
            this.obstacle.name = "obstacle";
            this.add(this.obstacle);
            console.log("Added obstacle to scene");
            this.obstacle2Geo = new BoxGeometry(4, 4, 6);
            this.obstacle2PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle2 = new Physijs.BoxMesh(this.obstacle2Geo, this.obstacle2PM, 0);
            this.obstacle2.receiveShadow = true;
            this.obstacle2.castShadow = true;
            this.obstacle2.position.set(0, 6, -6);
            this.obstacle2.name = "obstacle";
            this.add(this.obstacle2);
            console.log("Added obstacle to scene");
            this.obstacle3Geo = new BoxGeometry(2.5, 2, 3);
            this.obstacle3PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle3 = new Physijs.BoxMesh(this.obstacle3Geo, this.obstacle3PM, 0);
            this.obstacle3.receiveShadow = true;
            this.obstacle3.castShadow = true;
            this.obstacle3.position.set(0, 7, -13);
            this.obstacle3.name = "obstacle";
            this.add(this.obstacle3);
            console.log("Added obstacle to scene");
            this.obstacle4Geo = new BoxGeometry(5, 7, 6);
            this.obstacle4PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle4 = new Physijs.BoxMesh(this.obstacle4Geo, this.obstacle4PM, 0);
            this.obstacle4.receiveShadow = true;
            this.obstacle4.castShadow = true;
            this.obstacle4.position.set(0, 10, -19);
            this.obstacle4.name = "obstacle";
            this.add(this.obstacle4);
            console.log("Added obstacle to scene");
            this.obstacle5Geo = new BoxGeometry(0.5, 0.5, 7);
            this.obstacle5PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle5 = new Physijs.BoxMesh(this.obstacle5Geo, this.obstacle5PM, 0);
            this.obstacle5.receiveShadow = true;
            this.obstacle5.castShadow = true;
            this.obstacle5.position.set(0, 11, -29);
            this.obstacle5.name = "obstacle";
            this.add(this.obstacle5);
            console.log("Added obstacle to scene");
            this.obstacle6Geo = new BoxGeometry(2.5, 5, 1);
            this.obstacle6PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle6 = new Physijs.BoxMesh(this.obstacle6Geo, this.obstacle6PM, 0);
            this.obstacle6.receiveShadow = true;
            this.obstacle6.castShadow = true;
            this.obstacle6.position.set(2, 13.5, -30);
            this.obstacle6.name = "obstacle";
            this.add(this.obstacle6);
            console.log("Added obstacle to scene");
            this.obstacle7Geo = new BoxGeometry(6, 1, 0.5);
            this.obstacle7PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle7 = new Physijs.BoxMesh(this.obstacle7Geo, this.obstacle7PM, 0);
            this.obstacle7.receiveShadow = true;
            this.obstacle7.castShadow = true;
            this.obstacle7.position.set(4, 17, -31);
            this.obstacle7.name = "obstacle";
            this.add(this.obstacle7);
            console.log("Added obstacle to scene");
            this.obstacle8Geo = new BoxGeometry(2.5, 10, 2.5);
            this.obstacle8PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle8 = new Physijs.BoxMesh(this.obstacle8Geo, this.obstacle8PM, 0);
            this.obstacle8.receiveShadow = true;
            this.obstacle8.castShadow = true;
            this.obstacle8.position.set(0, 20, -35);
            this.obstacle8.name = "obstacle";
            this.add(this.obstacle8);
            console.log("Added obstacle to scene");
            this.goalGeo = new BoxGeometry(4, 4, 4);
            this.goalPM = Physijs.createMaterial(this.goalMat, 0, 0);
            this.goal = new Physijs.BoxMesh(this.goalGeo, this.goalPM, 0);
            this.goal.receiveShadow = true;
            this.goal.castShadow = true;
            this.goal.position.set(0, 10, -50);
            this.goal.name = "goal";
            this.add(this.goal);
            console.log("Added goal to scene");
        };
        /**
         * Add the death plane to the scene
         *
         * @method addDeathPlane
         * @return void
         */
        level3.prototype.addDeathPlane = function () {
            this.deathPlaneGeometry = new BoxGeometry(300, 1, 300, 3);
            this.deathPlaneTexture = new THREE.TextureLoader().load('../../Assets/images/void.jpg');
            this.deathPlaneTexture.wrapS = THREE.RepeatWrapping;
            this.deathPlaneTexture.wrapT = THREE.RepeatWrapping;
            this.deathPlaneTexture.repeat.set(16, 16);
            this.deathPlanePhong = new PhongMaterial();
            this.deathPlanePhong.map = this.deathPlaneTexture;
            this.deathPlane = new Physijs.BoxMesh(this.deathPlaneGeometry, this.deathPlanePhong, 0);
            this.deathPlane.position.set(0, -10, 0);
            this.deathPlane.name = "DeathPlane";
            this.add(this.deathPlane);
        };
        //background
        level3.prototype.spacebg = function () {
            this.spaceGeo = new SphereGeometry(80, 80, 80);
            this.spaceTexture = THREE.ImageUtils.loadTexture('../../Assets/images/space.jpg');
            this.spaceTexture.wrapS = THREE.RepeatWrapping;
            this.spaceTexture.wrapT = THREE.RepeatWrapping;
            this.spaceTexture.repeat.set(2, 2);
            this.spacePhong = new PhongMaterial();
            this.spacePhong.map = this.spaceTexture;
            // this.space =  new Physijs.SphereMesh();
            this.space = new THREE.Mesh(this.spaceGeo, this.spacePhong);
            this.space.position.set(0, 10, 0);
            this.space.name = "space";
            //   this.space.material.side = THREE.DoubleSide;
            this.space.material.side = THREE.BackSide;
            this.add(this.space);
        };
        level3.prototype.level3 = function () {
            for (var i = 0; i < 10; i++) {
                this.obstacleGeometry = new BoxGeometry(randomIntInc(2, 5), randomIntInc(5, 20), randomIntInc(2, 5));
                this.obstacleTexture = THREE.ImageUtils.loadTexture('../../Assets/images/moon.png');
                this.obstacleTexture.wrapS = THREE.RepeatWrapping;
                this.obstacleTexture.wrapT = THREE.RepeatWrapping;
                this.obstacleTexture.repeat.set(1, 1);
                this.obstaclePhong = new PhongMaterial();
                this.obstaclePhong.map = this.obstacleTexture;
                // this.obstacleMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xffffff }), 0.4, 0);
                this.obstacle = new Physijs.BoxMesh(this.obstacleGeometry, this.obstaclePhong, 0);
                this.obstacle.name = "obstacle";
                this.obstacle.receiveShadow = true;
                this.obstacle.castShadow = true;
                //really proud how i did the stair cube down there is basicly a math formula that kinda orginise them randomly
                this.obstacle.position.set(randomIntInc((i * -2), (i * 2)), randomIntInc((i * 5), (i * 6)), randomIntInc((i * -2), (i * 2)));
                this.add(this.obstacle);
                //  console.log("Added obstacle to Scene  " + this.obstacle.position.y);
                if (i == 9) {
                    //  console.log("asdf " + i);
                    this.goalGeometry = new BoxGeometry(randomIntInc(4, 5), randomIntInc(4, 5), randomIntInc(4, 5));
                    //  this.goalMaterialerial = Physijs.createMaterial(new LambertMaterial({ color: 0xff000000 }), 0.4, 0);
                    this.goalTexture = THREE.ImageUtils.loadTexture('../../Assets/images/pl_sun.jpg');
                    this.goalTexture.wrapS = THREE.RepeatWrapping;
                    this.goalTexture.wrapT = THREE.RepeatWrapping;
                    this.goalTexture.repeat.set(1, 1);
                    this.goalMaterial = new PhongMaterial();
                    this.goalMaterial.map = this.goalTexture;
                    this.goal = new Physijs.BoxMesh(this.goalGeometry, this.goalMaterial, 0);
                    this.goal.name = "goal";
                    this.goal.receiveShadow = true;
                    this.goal.castShadow = true;
                    this.goal.position.set(randomIntInc((i * -2), (i * 2)), randomIntInc((i * 5), (i * 6)), randomIntInc((i * -2), (i * 2)));
                    // this.goal.position.set(10, 0, 0);
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
        level3.prototype.pointerLockChange = function (event) {
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
        level3.prototype.pointerLockError = function (event) {
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
        level3.prototype.checkControls = function () {
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
                                if (this.player.position.y > (this.parkour_height + 0.3)) {
                                    this.isparkor = false;
                                    this.score = this.score + 1000;
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
        level3.prototype.start = function () {
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
            //this.addObs();
            this.level3();
            this.spacebg();
            // Add death plane to the scene
            this.addDeathPlane();
            // Collision Check
            this.player.addEventListener('collision', function (eventObject) {
                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    self.pre_height = self.player_height;
                    self.player_height = self.player.position.y;
                    createjs.Sound.play("land");
                    console.log("player_height is " + this.player_height);
                    console.log("pre_height is " + this.pre_height);
                    if (this.player_height + 10 < this.pre_height) {
                        createjs.Sound.play("death");
                        self.livesValue--;
                        this.score = this.score - 1000;
                        self.livesLabel.text = "LIVES: " + self.livesValue;
                        self.remove(self.player);
                        self.player.position.set(0, 10, 10);
                        self.add(self.player);
                        if (self.livesValue <= 0) {
                            this._firstMusic.stop();
                            document.exitPointerLock();
                            this.children = [];
                            this.player.remove(camera);
                            //currentScene = config.Scene.END;
                            changeScene();
                        }
                    }
                }
                if (eventObject.name === "DeathPlane") {
                    createjs.Sound.play("death");
                    self.livesValue--;
                    this.score = this.score - 1000;
                    self.livesLabel.text = "LIVES: " + self.livesValue;
                    self.remove(self.player);
                    self.player.position.set(0, 10, 10);
                    self.add(self.player);
                    if (self.livesValue <= 0) {
                        this._firstMusic.stop();
                        document.exitPointerLock();
                        this.children = [];
                        this.player.remove(camera);
                    }
                }
                if (eventObject.name === "goal") {
                    this._firstMusic.stop();
                    document.exitPointerLock();
                    this.children = [];
                    this.player.remove(camera);
                    currentScene = config.Scene.MENU;
                    changeScene();
                }
                if (eventObject.name === "obstacle") {
                    self.isparkor = true;
                    self.isGrounded = true;
                    self.pre_height = self.player_height;
                    self.player_height = self.player.position.y;
                    self.parkour_height = self.player.position.y; //self.obstacle.position.y;
                    //  console.log("is parkour " + self.parkour_height);
                    if (this.player_height + 10 < this.pre_height) {
                        createjs.Sound.play("death");
                        self.livesValue--;
                        this.score = this.score - 1000;
                        self.livesLabel.text = "LIVES: " + self.livesValue;
                        self.remove(self.player);
                        self.player.position.set(0, 10, 10);
                        self.add(self.player);
                        if (self.livesValue <= 0) {
                            this._firstMusic.stop();
                            document.exitPointerLock();
                            this.children = [];
                            this.player.remove(camera);
                        }
                    }
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
        level3.prototype.cameraLook = function () {
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
        level3.prototype.update = function () {
            this.scoreLabel.text = "wind x:" + windx + "   wind y:" + windy + "  wind z: " + windz;
            this.score--;
            this.timeLabel.text = "score: " + this.score;
            this.checkControls();
            this.stage.update();
        };
        /**
         * Responds to screen resizes
         *
         * @method resize
         * @return void
         */
        level3.prototype.resize = function () {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        };
        return level3;
    }(scenes.Scene));
    scenes.level3 = level3;
})(scenes || (scenes = {}));

//# sourceMappingURL=level3.js.map
