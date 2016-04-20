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
        Scene.EXIT = 1;
        Scene.INSTRUCTIONS = 2;
        Scene.PLAY = 3;
        Scene.level2 = 4;
        Scene.level3 = 5;
        Scene.level4 = 6;
        Scene.level5 = 7;
        Scene.DEATH = 8;
        return Scene;
    }());
    config.Scene = Scene;
})(config || (config = {}));

//# sourceMappingURL=screen.js.map
