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
    export class Play extends scenes.Scene {
        private havePointerLock: boolean;
        private element: any;

        private blocker: HTMLElement;
        private instructions: HTMLElement;
        private spotLight: SpotLight;
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
        private deathplanetexture: Texture;
        private groundMaterials: PhongMaterial;

        private velocity: Vector3;
        private prevTime: number;
        private clock: Clock;

        private stage: createjs.Stage;
        private scoreLabel: createjs.Text;
        private livesLabel: createjs.Text;
        private scoreValue: number;
        private livesValue: number;

        private windx: number = 0;
        private windy: number = -10;
        private windz: number = 0;

        private _firstMusic: createjs.AbstractSoundInstance;

        private isparkor: boolean = false;
        private timerB: boolean;

        private spacegeo: SphereGeometry;
        private spaceMat: Physijs.Material;
        private space: Physijs.Mesh;
        private spacetex: Texture;
        private sapcePhong: PhongMaterial;

        private obstacleTexture: Texture;
        private obstacleMat: PhongMaterial;
        
        private goalTexture: Texture;
        private goalMat: PhongMaterial;

        private obstacleGeo: CubeGeometry;
        private obstaclePM: Physijs.Material;
        private obstacle: Physijs.Mesh;

        private obstacle2Geo: CubeGeometry;
        private obstacle2PM: Physijs.Material;
        private obstacle2: Physijs.Mesh;

        private obstacle3Geo: CubeGeometry;
        private obstacle3PM: Physijs.Material;
        private obstacle3: Physijs.Mesh;

        private obstacle4Geo: CubeGeometry;
        private obstacle4PM: Physijs.Material;
        private obstacle4: Physijs.Mesh;

        private obstacle5Geo: CubeGeometry;
        private obstacle5PM: Physijs.Material;
        private obstacle5: Physijs.Mesh;

        private goalGeo: CubeGeometry;
        private goalPM: Physijs.Material;
        private goal: Physijs.Mesh;

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
            // initialize  score and lives values
            this.scoreValue = 0;
            this.livesValue = 5;

            // Add Lives Label
            this.livesLabel = new createjs.Text(
                "LIVES: " + this.livesValue,
                "40px Consolas",
                "#ffffff"
            );
            this.livesLabel.x = config.Screen.WIDTH * 0.1;
            this.livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.addChild(this.livesLabel);
            console.log("Added Lives Label to stage");

            // Add Score Label
            this.scoreLabel = new createjs.Text(
                "SCORE: " + this.scoreValue,
                "40px Consolas",
                "#ffffff"
            );
            this.scoreLabel.x = config.Screen.WIDTH * 0.4;
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

        /**
         * Add a ground plane to the scene
         * 
         * @method addGround
         * @return void
         */

        private addGround(): void {
            this.groundTexture = new THREE.TextureLoader().load('../../Assets/images/floor.jpg');
            this.groundTexture.wrapS = THREE.RepeatWrapping;
            this.groundTexture.wrapT = THREE.RepeatWrapping;
            this.groundTexture.repeat.set(8, 8);

            this.groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/floor.jpg');
            this.groundTextureNormal.wrapS = THREE.RepeatWrapping;
            this.groundTextureNormal.wrapT = THREE.RepeatWrapping;
            this.groundTextureNormal.repeat.set(8, 8);

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
         * Adds obstacles to scene
         * 
         * @method addObs
         * @return void
         */

        private addObs(): void {
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
            this.goalTexture.repeat.set(8,8);
            
            this.goalMat = new PhongMaterial();
            this.goalMat.map = this.goalTexture;
            this.goalMat.bumpScale = 0.2;

            // Obstacles
            this.obstacleGeo = new BoxGeometry(5, 2.5, 5);
            this.obstaclePM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle = new Physijs.BoxMesh(this.obstacleGeo, this.obstaclePM, 0);
            this.obstacle.receiveShadow = true;
            this.obstacle.castShadow = true;
            this.obstacle.position.set(0, 1.25, 0);
            this.obstacle.name = "obstacle";
            this.add(this.obstacle);
            console.log("Added obstacle to scene");

            this.obstacle2Geo = new BoxGeometry(4, 5, 2.5);
            this.obstacle2PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle2 = new Physijs.BoxMesh(this.obstacle2Geo, this.obstacle2PM, 0);
            this.obstacle2.receiveShadow = true;
            this.obstacle2.castShadow = true;
            this.obstacle2.position.set(0, 3.75, 0);
            this.obstacle2.name = "obstacle";
            this.add(this.obstacle2);
            console.log("Added obstacle to scene");

            this.obstacle3Geo = new BoxGeometry(0.5, 3, 6.5);
            this.obstacle3PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle3 = new Physijs.BoxMesh(this.obstacle3Geo, this.obstacle3PM, 0);
            this.obstacle3.receiveShadow = true;
            this.obstacle3.castShadow = true;
            this.obstacle3.position.set(5, 7.75, 0);
            this.obstacle3.name = "obstacle";
            this.add(this.obstacle3);
            console.log("Added obstacle to scene");

            this.obstacle4Geo = new BoxGeometry(3.5, 5, 0.5);
            this.obstacle4PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle4 = new Physijs.BoxMesh(this.obstacle4Geo, this.obstacle4PM, 0);
            this.obstacle4.receiveShadow = true;
            this.obstacle4.castShadow = true;
            this.obstacle4.position.set(0, 11.75, 0);
            this.obstacle4.name = "obstacle";
            this.add(this.obstacle4);
            console.log("Added obstacle to scene");
            
            this.obstacle5Geo = new BoxGeometry(2.5, 1, 2.5);
            this.obstacle5PM = Physijs.createMaterial(this.obstacleMat, 0, 0);
            this.obstacle5 = new Physijs.BoxMesh(this.obstacle5Geo, this.obstacle5PM, 0);
            this.obstacle5.receiveShadow = true;
            this.obstacle5.castShadow = true;
            this.obstacle5.position.set(0, 15, 0);
            this.obstacle5.name = "obstacle";
            this.add(this.obstacle5);
            console.log("Added obstacle to scene");
            
            this.goalGeo = new BoxGeometry(4, 4, 4);
            this.goalPM = Physijs.createMaterial(this.goalMat, 0, 0);
            this.goal = new Physijs.BoxMesh(this.goalGeo, this.goalPM, 0);
            this.goal.receiveShadow = true;
            this.goal.castShadow = true;
            this.goal.position.set(-2, 18, 0);
            this.goal.name = "goal";
            this.add(this.goal);
            console.log("Added goal to scene");
        }

        /**
         * Add the death plane to the scene
         * 
         * @method addDeathPlane
         * @return void
         */
        private addDeathPlane(): void {
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
        }
        //background
        private spacebg(): void {

            this.spacegeo = new SphereGeometry(100, 100, 100)
            this.spacetex = THREE.ImageUtils.loadTexture('../../Assets/images/space.jpg');

            this.spacetex.wrapS = THREE.RepeatWrapping;
            this.spacetex.wrapT = THREE.RepeatWrapping;
            this.spacetex.repeat.set(1, 1);

            this.sapcePhong = new PhongMaterial();
            this.sapcePhong.map = this.deathplanetexture;
            this.space = new Physijs.SphereMesh(this.deathPlaneGeometry, this.groundMaterials, 0);
            this.space.position.set(0, -10, 0);
            this.space.name = "space";
            this.space.material.side = THREE.DoubleSide;

            this.add(this.space);
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
                        if (this.player.position.y > 4) {
                            this.isGrounded = false;
                        }
                    }
                }
                if (this.keyboardControls.shift) {
                    if (this.isparkor) {
                        this.velocity.y += 4000 * delta;
                        setTimeout(function() {
                            this.isparkor = false; this.timerB = false;
                        }, 1000);
                        createjs.Sound.play("jump");
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

        if(timerB = false) {
            setInterval(function() {
                this.timerB = true;
                this.isparkor = false;
            }, 10000);
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

            // Ground Object
            this.addGround();

            // Add player controller
            this.addPlayer();

            this.addObs();

            // Add death plane to the scene
            this.addDeathPlane();

            // Collision Check
            this.player.addEventListener('collision', function(eventObject) {

                if (eventObject.name === "Ground") {
                    self.isGrounded = true;
                    createjs.Sound.play("land");
                }
                if (eventObject.name === "DeathPlane") {
                    createjs.Sound.play("death");
                    self.livesValue--;
                    self.livesLabel.text = "LIVES: " + self.livesValue;
                    self.remove(self.player);
                    self.player.position.set(0, 30, 10);
                    self.add(self.player);
                    
                    if (self.livesValue <= 0) {
                        this._firstMusic.stop();
                        document.exitPointerLock();
                        this.children = [];
                        this.player.remove(camera);
                        //currentScene = config.Scene.END;
                        //changeScene();
                    }
                    
                }
                if (eventObject.name === "goal") {
                    this._firstMusic.stop();
                    document.exitPointerLock();
                    this.children = [];
                    this.player.remove(camera);
                    currentScene = config.Scene.level2;
                    changeScene();


                }
                if (eventObject.name === "obstacle") {
                    self.isparkor = true;
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

            this.scoreLabel.text = "wind x:" + windx + "   wind y:" + windy + "  wind z: " + windz;

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
            this.scoreLabel.x = config.Screen.WIDTH * 0.8;
            this.scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
            this.stage.update();
        }
    }
}