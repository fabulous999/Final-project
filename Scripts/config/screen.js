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
        Scene.PLAY = 1;
        Scene.level2 = 2;
        Scene.level3 = 3;
        Scene.OVER = 4;
        return Scene;
    }());
    config.Scene = Scene;
})(config || (config = {}));

//# sourceMappingURL=screen.js.map
