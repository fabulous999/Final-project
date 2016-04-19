var config;
(function (config) {
    var Screen = (function () {
        function Screen() {
        }
        Screen.WIDTH = window.innerWidth;
        Screen.HEIGHT = window.innerHeight;
        Screen.RATIO = window.innerWidth / window.innerHeight;
        return Screen;
    }());
    config.Screen = Screen;
    // Scene Constants
    var Scene = (function () {
        function Scene() {
        }
        Scene.MENU = 0;
        Scene.INSTRUCTIONS = 1;
        Scene.PLAY = 2;
        Scene.level2 = 3;
        Scene.level3 = 4;
        Scene.level4 = 5;
        Scene.level5 = 6;
        Scene.OVER = 7;
        return Scene;
    }());
    config.Scene = Scene;
})(config || (config = {}));

//# sourceMappingURL=screen.js.map
