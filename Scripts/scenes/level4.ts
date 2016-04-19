/**
 * The Scenes module is a namespace to reference all scene objects
 * 
 * @module scenes
 */
module scenes {
    /**
     * The Play class is where the main action occurs for the game
     * 
     * @class Play
     * @param havePointerLock {boolean}
     */
    export class level4 extends scenes.Scene {
        private havePointerLock: boolean;
        private element: any;

        private blocker: HTMLElement;
        private instructions: HTMLElement;
        private spotLight: SpotLight;
        private ambientLight: AmbientLight;
        private groundGeometry: CubeGeometry;
        private groundPhysicsMaterial: Physijs.Material;
        private groundMaterial: PhongMaterial;
        private ground: Physijs.Mesh;
        private groundTexture: Texture;
        private groundTextureNormal: Texture;
        private playerGeometry: CubeGeometry;
        private playerMaterial: Physijs.Material;
        private player: Physijs.Mesh;
        private keyboardControls: objects.KeyboardControls;
        private mouseControls: objects.MouseControls;
        private isGrounded: boolean;

        private deathPlaneGeometry: CubeGeometry;
        private deathPlaneMaterial: Physijs.Material;
        private deathPlane: Physijs.Mesh;
        private deathPlaneTexture: Texture;
        private deathPlanePhong: PhongMaterial;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private windLabel: createjs.Text;
        private livesLabel: createjs.Text;
        private scoreValue: number;
        private livesValue: number;
        private scoreLabel: createjs.Text;
        private timeValue: number;
        private score: number = 10000;

        private goalTexture: Texture;
        private goal: Physijs.Mesh;
        private goalGeometry: CubeGeometry;
        private goalMaterial: PhongMaterial;

        private windx: number = 0;
        private windy: number = -10;
        private windz: number = 0;

        private obstacle: Physijs.Mesh;
        private obstacleGeometry: CubeGeometry;
        private obstacleMaterial: Physijs.Material;
        private obstacleTexture: Texture;
        private obstaclePhong: PhongMaterial;
        private _firstMusic: createjs.AbstractSoundInstance;

        private isParkour: boolean = false;
        private timerB: boolean;

        private spaceGeo: SphereGeometry;
        private spaceMat: THREE.Material;
        private space: THREE.Mesh;
        private spaceTexture: Texture;
        private spacePhong: PhongMaterial;

        private player_height: number = null;
        private parkour_height: number = null;
        private pre_height: number = null;

        /**
         * @constructor
         */
        constructor() {
            super();

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

        private _setupCanvas(): void {
            canvas.setAttribute("width", config.Screen.WIDTH.toString());
            canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
            canvas.style.backgroundColor = "#000000";
        }

        /**
         * The initialize method sets up key objects to be used in the scene
         * 
         * @method _initialize
         * @returns void
         */
        private _initialize(): void {
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
        }
        /**
         * This method sets up the scoreboard for the scene
         * 
         * @method setupScoreboard
         * @returns void
         */
        private setupScoreboard(): void {
            // initialize score, wind and lives values
            this.scoreValue = 0;
            this.livesValue = 5;

            // Add Lives Label
            this.livesLabel = new createjs.Text(
                "LIVES: " + this.livesValue,
                "30px Monotype Corsiva",
                "#ffffff"
            );
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");

            // Add Wind Label
            this.windLabel = new createjs.Text(
                "WIND: " + this.scoreValue,
                "30px Monotype Corsiva",
                "#ffffff"
            );
            this.windLabel.x = config.Screen.WIDTH * 0.3;
            this.windLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.windLabel);
            console.log("Added Wind Label to stage");

            // Add Score Label
            this.scoreLabel = new createjs.Text(
                "SCORE: " + this.scoreValue,
                "30px Monotype Corsiva",
                "#ffffff"
            );
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.scoreLabel);
            console.log("Added Score Label to stage");

        }


        private randomIntInc(low, high) {
            return Math.floor(Math.random() * (high - low + 1) + low);
        }

        /**
          * Add a spotLight to the scene
          * 
          * @method addSpotLight
          * @return void
          */
        private addSpotLight(): void {
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
        }

        private addAmbientLight(): void {
            // Ambient Light
            this.ambientLight = new AmbientLight(0x808080);
            this.add(this.ambientLight);
        }

        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         */

        private addGround(): void {
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
        }
        
        private level4(): void {
            this.obstacleTexture = THREE.ImageUtils.loadTexture('../../Assets/images/moon.png');
            this.goalTexture = THREE.ImageUtils.loadTexture('../../Assets/images/pl_sun.jpg');
            this.obstaclePhong = new PhongMaterial();
            this.obstaclePhong.map = this.obstacleTexture;
            this.goalMaterial = new PhongMaterial();
            this.goalMaterial.map = this.goalTexture;



            for (var i = 0; i < 15; i++) {
                this.obstacleGeometry = new BoxGeometry(randomIntInc(4, 10), randomIntInc(2, 5), randomIntInc(2, 5));

                this.obstacle = new Physijs.BoxMesh(this.obstacleGeometry, this.obstaclePhong, 0);
                this.obstacle.name = "obstacle";

                this.obstacle.position.set(randomIntInc((i * 4), (i * 5)), randomIntInc((i * 0), (i * 2)), randomIntInc((i * -2), (i * 2)));
                this.add(this.obstacle);
                console.log("Added obstacle to Scene  " + this.obstacle.position.y);

                if (i == 14) {
                    this.goalGeometry = new BoxGeometry(randomIntInc(2, 5), randomIntInc(2, 5), randomIntInc(2, 5));

                    this.goal = new Physijs.BoxMesh(this.goalGeometry, this.goalMaterial, 0);
                    this.goal.name = "goal";

                    this.goal.position.set(randomIntInc((i * 4), (i * 5)), randomIntInc((i * 0), (i * 1)), randomIntInc((i * -2), (i * 2)));
                    this.add(this.goal);
                }
            }
        }
        /**
         * Adds the player controller to the scene
         * 
         * @method addPlayer
         * @return void
         */
        private addPlayer(): void {
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
        }

        /**
         * Add the death plane to the scene
         * 
         * @method addDeathPlane
         * @return void
         */
        private addDeathPlane(): void {

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
        }

        //background
        private spacebg(): void {
            this.spaceGeo = new SphereGeometry(80, 80, 80)
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
        }

        private AmbientLight(): void {
            this.ambientLight = new AmbientLight(0x808080);
            this.add(this.ambientLight);
        }

        /*
         * Event Handler method for any pointerLockChange events
         * 
         * @method pointerLockChange
         * @return void
         */
        pointerLockChange(event): void {
            if (document.pointerLockElement === this.element) {
                // enable our mouse and keyboard controls
                this.keyboardControls.enabled = true;
                this.mouseControls.enabled = true;
                this.blocker.style.display = 'none';
            } else {
                // disable our mouse and keyboard controls
                this.keyboardControls.enabled = false;
                this.mouseControls.enabled = false;
                this.blocker.style.display = '-webkit-box';
                this.blocker.style.display = '-moz-box';
                this.blocker.style.display = 'box';
                this.instructions.style.display = '';
                console.log("PointerLock disabled");
            }
        }

        /**
         * Event handler for PointerLockError
         * 
         * @method pointerLockError
         * @return void
         */
        private pointerLockError(event): void {
            this.instructions.style.display = '';
            console.log("PointerLock Error Detected!!");
        }

        // Check Controls Function

        /**
         * This method updates the player's position based on user input
         * 
         * @method checkControls
         * @return void
         */
        private checkControls(): void {
            if (this.keyboardControls.enabled) {
                this.velocity = new Vector3();

                var time: number = performance.now();
                var delta: number = (time - this.prevTime) / 1000;
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

                        if (this.player.position.y > (this.player_height + 0.5)) {
                            this.isGrounded = false;
                        }
                    }
                    if (this.isParkour) {
                        if (this.keyboardControls.shift) {
                            {
                                this.velocity.y += 4000.0 * delta;
                                console.log(this.obstacle.position.y);
                                if (this.player.position.y > (this.parkour_height + 0.3)) {
                                    this.isParkour = false;
                                    this.score = this.score + 100;
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

            // Controls Enabled ends
            else {
                this.player.setAngularVelocity(new Vector3(0, 0, 0));
                this.player.setAngularFactor(new Vector3(0, 0, 0));
            }
        }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */

        public start(): void {
            var self = this;

            // Set Up Scoreboard
            this.setupScoreboard();

            //check to see if pointerlock is supported
            this.havePointerLock = 'pointerLockElement' in document ||
                'mozPointerLockElement' in document ||
                'webkitPointerLockElement' in document;

            //this.time
            // Check to see if we have pointerLock
            if (this.havePointerLock) {
                this.element = document.body;

                this.instructions.addEventListener('click', () => {

                    // Ask the user for pointer lock
                    console.log("Requesting PointerLock");

                    this.element.requestPointerLock = this.element.requestPointerLock ||
                        this.element.mozRequestPointerLock ||
                        this.element.webkitRequestPointerLock;

                    this.element.requestPointerLock();
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

            this.addEventListener('update', () => {
                this.simulate(undefined, 2);
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

            this.level4();

            this.spacebg();


            // Collision Check

            this.player.addEventListener('collision', function (eventObject) {


                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    self.pre_height = self.player_height;
                    self.player_height = self.player.position.y;
                    createjs.Sound.play("land");

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
                            currentScene = config.Scene.DEATH;
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
                        currentScene = config.Scene.DEATH;
                        changeScene();
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
                    self.isParkour = true;
                    self.isGrounded = true;
                    self.pre_height = self.player_height;
                    self.player_height = self.player.position.y;
                    self.parkour_height = self.player.position.y;

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
                            currentScene = config.Scene.DEATH;
                            changeScene();
                        }
                    }
                }
            }.bind(self));

            console.log(name);

            // create parent-child relationship with camera and player
            this.player.add(camera);
            camera.position.set(0, 1, 0);
            this.simulate();
        }

        /**
         * Camera Look function
         * 
         * @method cameraLook
         * @return void
         */
        private cameraLook(): void {
            var zenith: number = THREE.Math.degToRad(90);
            var nadir: number = THREE.Math.degToRad(-90);

            var cameraPitch: number = camera.rotation.x + this.mouseControls.pitch;

            // Constrain the Camera Pitch
            camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        }

        /**
         * @method update
         * @returns void
         */
        public update(): void {

            this.windLabel.text = "Wind X: " + windx + "   Wind Y: " + windy + "  Wind Z: " + windz;
            this.score--;
            this.scoreLabel.text = "Score: " + this.score;
            //console.log("score" + this.score + "   wind y:" + this.time);

            this.checkControls();
            this.stage.update();
        }

        /**
         * Responds to screen resizes
         * 
         * @method resize
         * @return void
         */

        public resize(): void {
            canvas.style.width = "100%";
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.windLabel.x = config.Screen.WIDTH * 0.8;
            this.windLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        }
    }
}