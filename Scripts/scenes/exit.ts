/**
 * @module scenes
 */
module scenes {
    /**
     * Menu Scene extends scenes.Scene superclass is used to
     * create a custom menu for the THREEJS Game
     * 
     * @class Menu
     * @extends scene.Scene
     * @param blocker {HTMLElement}
     * @param _stage {createjs.Stage}
     * @param _instructionsLabel {createjs.Text}
     * @param _startButton {createjs.Bitmap}
     */
    export class Exit extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _instructionsLabel: createjs.Text;
        private _instructionsLabel2: createjs.Text;
        private _instructionsLabel3: createjs.Text;
        private _instructionsLabel4: createjs.Text;
        private _backButton: createjs.Bitmap;
        private _background: createjs.Bitmap;
        private _bgSound: createjs.AbstractSoundInstance;

        /**
         * Empty Constructor - calls _initialize and start methods
         * 
         * @constructor
         */
        constructor() {
            super();

            this._initialize();
            this.start();
        }

        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++

        private _setupCanvas(): void {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#ffffff";
        }


        /**
         * This method sets up default values for class member variables
         * and objects
         * 
         * @method _initialize
         * @return void
         */
        private _initialize(): void {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";

            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        }

        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++++++

        /**
         * The start method is the main method for the scene class
         * 
         * @method start
         * @return void
         */
        public start(): void {
            
            // Add background music
            this._bgSound = createjs.Sound.play("bgmusic");
            
            // Add background image
            this._background = new createjs.Bitmap(assets.getResult("Background"));
            this._stage.addChild(this._background);
            
            // Add instructions labels
            this._instructionsLabel = new createjs.Text(
                "THANKS FOR PLAYING:",
                "80px Haettenschweiler",
                "#000000");
            this._instructionsLabel.regX = this._instructionsLabel.getMeasuredWidth() * 0.5;
            this._instructionsLabel.regY = this._instructionsLabel.getMeasuredLineHeight() * 0.5;
            this._instructionsLabel.x = config.Screen.WIDTH * 0.5;
            this._instructionsLabel.y = config.Screen.HEIGHT * 0.5 - 275;
            this._stage.addChild(this._instructionsLabel);
            
            this._instructionsLabel2 = new createjs.Text(
                "Click the back button to be sent to the main menu.",
                "30px Haettenschweiler",
                "#000000");
            this._instructionsLabel2.regX = this._instructionsLabel2.getMeasuredWidth() * 0.5;
            this._instructionsLabel2.regY = this._instructionsLabel2.getMeasuredLineHeight() * 0.5;
            this._instructionsLabel2.x = config.Screen.WIDTH * 0.5;
            this._instructionsLabel2.y = config.Screen.HEIGHT * 0.5 - 150;
            this._stage.addChild(this._instructionsLabel2);
            
            this._backButton = new createjs.Bitmap(assets.getResult("BackButton"));
            this._backButton.regX = this._backButton.getBounds().width * 0.5;
            this._backButton.regY = this._backButton.getBounds().height * 0.5;
            this._backButton.x = config.Screen.WIDTH * 0.5;
            this._backButton.y = config.Screen.HEIGHT * 0.5 + 100;
            this._stage.addChild(this._backButton);
            
            this._backButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });
            
            this._backButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });
            
            this._backButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.MENU;
                changeScene();
                this._bgSound.stop();
            }); 
        }

        /**
         * The update method updates the animation loop and other objects
         * 
         * @method update
         * @return void
         */
        public update(): void {
            this._stage.update();
        }

        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         * 
         * @method resize
         * @return void
         */
        public resize(): void {
            this._setupCanvas();
        }
    }
}