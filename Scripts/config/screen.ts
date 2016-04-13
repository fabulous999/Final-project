module config {
    export class Screen {
        static WIDTH:number = window.innerWidth;
        static HEIGHT:number = window.innerHeight;
        static RATIO:number = window.innerWidth / window.innerHeight;
    }
    
    // Scene Constants
    export class Scene {
        public static MENU: number = 0;
        public static PLAY: number = 1;
        public static level2: number = 2;
        public static level3: number = 3;
        public static OVER: number = 4;
    }
    
}