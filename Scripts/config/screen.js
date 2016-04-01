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
        Scene.OVER = 2;
        return Scene;
    }());
    config.Scene = Scene;
})(config || (config = {}));
<<<<<<< HEAD

//# sourceMappingURL=screen.js.map
=======
//# sourceMappingURL=screen.js.map
>>>>>>> 71196f26c4a275be2dde1c85060a55749bc06600
