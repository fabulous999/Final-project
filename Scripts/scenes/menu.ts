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
     * @param _gameLabel {createjs.Text}
     * @param _startButton {createjs.Bitmap}
     */
    export class Menu extends scenes.Scene {
        private _blocker: HTMLElement;
        private _stage: createjs.Stage;
        private _gameLabel: createjs.Text;
        private _startButton: createjs.Bitmap;
        private _instructionButton: createjs.Bitmap;
        private _exitButton: createjs.Bitmap;
        private _level2Button: createjs.Bitmap;
        private _level3Button: createjs.Bitmap;   
        private _background: createjs.Bitmap;
        private _bgmusic: createjs.AbstractSoundInstance;
        private _level4Button: createjs.Bitmap;
        private _level5Button: createjs.Bitmap;

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
            this._bgmusic = createjs.Sound.play("bgmusic");
            this._bgmusic.loop = -1;
            this._background = new createjs.Bitmap(assets.getResult("Background"));
            this._stage.addChild(this._background);
            console.log(this._background);
            
            this._gameLabel = new createjs.Text(
                "Press Start to Play",
                "80px Haettenschweiler",
                "#000000");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.5 - 275;
            this._stage.addChild(this._gameLabel);

            this._startButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._startButton.regX = this._startButton.getBounds().width * 0.5;
            this._startButton.regY = this._startButton.getBounds().height * 0.5;
            this._startButton.x = config.Screen.WIDTH * 0.5 - 150;
            this._startButton.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._startButton);

            this._startButton.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });

            this._startButton.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });

            this._startButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.PLAY;
                changeScene();
                this._bgmusic.stop();
            });
            
            this._instructionButton = new createjs.Bitmap(assets.getResult("InstructionsButton"));
            this._instructionButton.regX = this._instructionButton.getBounds().width * 0.5;
            this._instructionButton.regY = this._instructionButton.getBounds().height * 0.5;
            this._instructionButton.x = config.Screen.WIDTH * 0.5 + 150;
            this._instructionButton.y = config.Screen.HEIGHT * 0.5;
            this._stage.addChild(this._instructionButton);
            
            this._instructionButton.on("mouseover", (event:createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });
            
            this._instructionButton.on("mouseout", (event:createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });
            
            this._instructionButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.INSTRUCTIONS;
                changeScene();
                this._bgmusic.stop();
            });
            
            this._exitButton = new createjs.Bitmap(assets.getResult("ExitButton"));
            this._exitButton.regX = this._exitButton.getBounds().width * 0.5;
            this._exitButton.regY = this._exitButton.getBounds().height * 0.5;
            this._exitButton.x = config.Screen.WIDTH * 1 - 80
            this._exitButton.y = 80;
            this._exitButton.scaleX = 0.5;
            this._exitButton.scaleY = 0.5;
            this._stage.addChild(this._exitButton);
            
            this._exitButton.on("mouseover", (event:createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });
            
            this._exitButton.on("mouseout", (event:createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });
            
            this._exitButton.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.EXIT;
                changeScene();
                this._bgmusic.stop();
            });
            
            this._level2Button = new createjs.Bitmap(assets.getResult("Level2Button"));
            this._level2Button.regX = this._level2Button.getBounds().width * 0.5;
            this._level2Button.regY = this._level2Button.getBounds().height * 0.5;
            this._level2Button.x = 80;
            this._level2Button.y = 80;
            this._level2Button.scaleX = 0.5;
            this._level2Button.scaleY = 0.5;
            this._stage.addChild(this._level2Button);
            
            this._level2Button.on("mouseover", (event:createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });
            
            this._level2Button.on("mouseout", (event:createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });
            
            this._level2Button.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.level2;
                changeScene();
                this._bgmusic.stop();
            });
            
            this._level3Button = new createjs.Bitmap(assets.getResult("Level3Button"));
            this._level3Button.regX = this._level3Button.getBounds().width * 0.5;
            this._level3Button.regY = this._level3Button.getBounds().height * 0.5;
            this._level3Button.x = 80;
            this._level3Button.y = 110
            this._level3Button.scaleX = 0.5;
            this._level3Button.scaleY = 0.5;
            this._stage.addChild(this._level3Button);
            
            this._level3Button.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });
            
            this._level3Button.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });
            
            this._level3Button.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.level3;
                changeScene();
                this._bgmusic.stop();
            });
            
            this._level4Button = new createjs.Bitmap(assets.getResult("Level4Button"));
            this._level4Button.regX = this._level4Button.getBounds().width * 0.5;
            this._level4Button.regY = this._level4Button.getBounds().height * 0.5;
            this._level4Button.x = 80;
            this._level4Button.y = 140;
            this._level4Button.scaleX = 0.5;
            this._level4Button.scaleY = 0.5;
            this._stage.addChild(this._level4Button);
            
            this._level4Button.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });
            
            this._level4Button.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });
            
            this._level4Button.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.level4;
                changeScene();
                this._bgmusic.stop();
            });
            
             this._level5Button = new createjs.Bitmap(assets.getResult("Level5Button"));
            this._level5Button.regX = this._level5Button.getBounds().width * 0.5;
            this._level5Button.regY = this._level5Button.getBounds().height * 0.5;
            this._level5Button.x = 80;
            this._level5Button.y = 170;
            this._level5Button.scaleX = 0.5;
            this._level5Button.scaleY = 0.5;
            this._stage.addChild(this._level5Button);
            
            this._level5Button.on("mouseover", (event: createjs.MouseEvent) => {
                event.target.alpha = 0.7;
            });
            
            this._level5Button.on("mouseout", (event: createjs.MouseEvent) => {
                event.target.alpha = 1.0;
            });
            
            this._level5Button.on("click", (event: createjs.MouseEvent) => {
                currentScene = config.Scene.level5;
                changeScene();
                this._bgmusic.stop();
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