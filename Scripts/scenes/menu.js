var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @module scenes
 */
var scenes;
(function (scenes) {
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
    var Menu = (function (_super) {
        __extends(Menu, _super);
        /**
         * Empty Constructor - calls _initialize and start methods
         *
         * @constructor
         */
        function Menu() {
            _super.call(this);
            this._initialize();
            this.start();
        }
        // PRIVATE METHODS ++++++++++++++++++++++++++++++++++++++++++++++
        Menu.prototype._setupCanvas = function () {
            canvas.style.width = "100%";
            canvas.setAttribute("height", config.Screen.HEIGHT.toString());
            canvas.style.backgroundColor = "#ffffff";
        };
        /**
         * This method sets up default values for class member variables
         * and objects
         *
         * @method _initialize
         * @return void
         */
        Menu.prototype._initialize = function () {
            // Create to HTMLElements
            this._blocker = document.getElementById("blocker");
            this._blocker.style.display = "none";
            // setup canvas for menu scene
            this._setupCanvas();
            // setup a stage on the canvas
            this._stage = new createjs.Stage(canvas);
            this._stage.enableMouseOver(20);
        };
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++++++
        /**
         * The start method is the main method for the scene class
         *
         * @method start
         * @return void
         */
        Menu.prototype.start = function () {
            var _this = this;
            this._bgmusic = createjs.Sound.play("bgmusic");
            this._bgmusic.loop = -1;
            this._background = new createjs.Bitmap(assets.getResult("Background"));
            this._stage.addChild(this._background);
            console.log(this._background);
            this._gameLabel = new createjs.Text("Press start to play", "80px Consolas", "#000000");
            this._gameLabel.regX = this._gameLabel.getMeasuredWidth() * 0.5;
            this._gameLabel.regY = this._gameLabel.getMeasuredLineHeight() * 0.5;
            this._gameLabel.x = config.Screen.WIDTH * 0.5;
            this._gameLabel.y = config.Screen.HEIGHT * 0.5 - 175;
            this._stage.addChild(this._gameLabel);
            this._startButton = new createjs.Bitmap(assets.getResult("StartButton"));
            this._startButton.regX = this._startButton.getBounds().width * 0.5;
            this._startButton.regY = this._startButton.getBounds().height * 0.5;
            this._startButton.x = config.Screen.WIDTH * 0.5;
            this._startButton.y = (config.Screen.HEIGHT * 0.5) + 100;
            this._stage.addChild(this._startButton);
            this._startButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._startButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._startButton.on("click", function (event) {
                currentScene = config.Scene.PLAY;
                changeScene();
                _this._bgmusic.stop();
            });
            this._instructionButton = new createjs.Bitmap(assets.getResult("InstructionsButton"));
            this._instructionButton.regX = this._instructionButton.getBounds().width * 0.5;
            this._instructionButton.regY = this._instructionButton.getBounds().height * 0.5;
            this._instructionButton.x = config.Screen.WIDTH * 0.5 - 150;
            this._instructionButton.y = (config.Screen.HEIGHT * 0.5) + 175;
            this._stage.addChild(this._instructionButton);
            this._instructionButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._instructionButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._instructionButton.on("click", function (event) {
                //currentScene = config.Scene.INSTRUCTIONS;
                //changeScene();
                //this._bgmusic.stop();
            });
            this._exitButton = new createjs.Bitmap(assets.getResult("ExitButton"));
            this._exitButton.regX = this._exitButton.getBounds().width * 0.5;
            this._exitButton.regY = this._exitButton.getBounds().height * 0.5;
            this._exitButton.x = config.Screen.WIDTH * 0.5 + 150;
            this._exitButton.y = (config.Screen.HEIGHT * 0.5) + 175;
            this._stage.addChild(this._exitButton);
            this._exitButton.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._exitButton.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._exitButton.on("click", function (event) {
                //currentScene = config.Scene.END;
                //changeScene();
                //this._bgmusic.stop();
            });
            this._level2Button = new createjs.Bitmap(assets.getResult("Level2Button"));
            this._level2Button.regX = this._level2Button.getBounds().width * 0.5;
            this._level2Button.regY = this._level2Button.getBounds().height * 0.5;
            this._level2Button.x = config.Screen.WIDTH * 0.5 - 150;
            this._level2Button.y = (config.Screen.HEIGHT * 0.5) + 25;
            this._stage.addChild(this._level2Button);
            this._level2Button.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._level2Button.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._level2Button.on("click", function (event) {
                currentScene = config.Scene.level2;
                changeScene();
                _this._bgmusic.stop();
            });
            this._level3Button = new createjs.Bitmap(assets.getResult("Level3Button"));
            this._level3Button.regX = this._level3Button.getBounds().width * 0.5;
            this._level3Button.regY = this._level3Button.getBounds().height * 0.5;
            this._level3Button.x = config.Screen.WIDTH * 0.5 + 150;
            this._level3Button.y = (config.Screen.HEIGHT * 0.5) + 25;
            this._stage.addChild(this._level3Button);
            this._level3Button.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._level3Button.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._level3Button.on("click", function (event) {
                currentScene = config.Scene.level3;
                changeScene();
                _this._bgmusic.stop();
            });
            this._level4Button = new createjs.Bitmap(assets.getResult("Level3Button"));
            this._level4Button.regX = this._level4Button.getBounds().width * -0.2;
            this._level4Button.regY = this._level4Button.getBounds().height * -5.2;
            this._level4Button.x = config.Screen.WIDTH * 0.5 + 150;
            this._level4Button.y = (config.Screen.HEIGHT * 0.5) + 25;
            this._stage.addChild(this._level4Button);
            this._level4Button.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._level4Button.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._level4Button.on("click", function (event) {
                currentScene = config.Scene.level4;
                changeScene();
                _this._bgmusic.stop();
            });
            this._level5Button = new createjs.Bitmap(assets.getResult("Level3Button"));
            this._level5Button.regX = this._level5Button.getBounds().width * -1.5;
            this._level5Button.regY = this._level5Button.getBounds().height * -6.1;
            this._level5Button.x = config.Screen.WIDTH * 0.5 + 150;
            this._level5Button.y = (config.Screen.HEIGHT * 0.5) + 25;
            this._stage.addChild(this._level5Button);
            this._level5Button.on("mouseover", function (event) {
                event.target.alpha = 0.7;
            });
            this._level5Button.on("mouseout", function (event) {
                event.target.alpha = 1.0;
            });
            this._level5Button.on("click", function (event) {
                currentScene = config.Scene.level5;
                changeScene();
                _this._bgmusic.stop();
            });
        };
        /**
         * The update method updates the animation loop and other objects
         *
         * @method update
         * @return void
         */
        Menu.prototype.update = function () {
            this._stage.update();
        };
        /**
         * The resize method is a procedure that sets variables and objects on screen resize
         *
         * @method resize
         * @return void
         */
        Menu.prototype.resize = function () {
            this._setupCanvas();
        };
        return Menu;
    }(scenes.Scene));
    scenes.Menu = Menu;
})(scenes || (scenes = {}));
//# sourceMappingURL=menu.js.map