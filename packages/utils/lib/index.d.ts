export declare const MIN_SOLUTIONS = 6;
export declare const MAX_SOLUTIONS = 8;
export declare function allSame(set: number[]): boolean;
export declare function allDifferent(set: number[]): boolean;
export declare function arraysEqual<T>(a: T[], b: T[]): boolean;
export declare function verifySet(set: number[]): boolean;
export declare function parseCard(card: number): [
    "green" | "purple" | "red",
    "squiggle" | "oval" | "diamond",
    1 | 2 | 3,
    "solid" | "striped" | "empty"
];
export declare function solvePuzzle(puzzle: number[]): number[][];
export declare function generatePuzzle(): number[];
export declare function indexOfList(list: number[][], value: number[]): number;
export declare const TEMPLATE = "\n<svg width=\"300\" height=\"200\" viewBox=\"0 0 300 200\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\n    <defs>\n        <!-- Shapes -->\n        <path id=\"squiggle\"\n            d=\"M22.0815 1C10.303 1.00001 -0.792158 6.85996 1.24264 16.2601C3.50774 26.7242 18.9104 37.6243 16.6453 60.7325C14.6876 80.7048 0.336613 82.9687 2.60171 112.617C4.8668 142.265 32.5009 151.421 47.4506 150.985C63.7592 150.51 75.5377 144.881 75.9907 136.161C76.4437 127.441 60.1351 111.309 60.1351 97.7928C60.1351 84.2767 70.089 75.9926 70.5545 51.5764C71.4605 4.05204 33.86 0.999993 22.0815 1Z\" />\n        <rect width=\"75\" height=\"150\" rx=\"43.75\" id=\"oval\" />\n        <polygon points=\"37.5,0 75,75 37.5,150 0,75\" id=\"diamond\" />\n\n        <!-- Masks -->\n        <mask id=\"squiggle-mask\">\n            <use href=\"#squiggle\" stroke=\"white\" fill=\"white\" />\n        </mask>\n        <mask id=\"oval-mask\">\n            <use href=\"#oval\" stroke=\"white\" fill=\"white\" />\n        </mask>\n        <mask id=\"diamond-mask\">\n            <use href=\"#diamond\" stroke=\"white\" fill=\"white\" />\n        </mask>\n\n        <!-- Fills -->\n        <pattern id=\"stripes\" patternUnits=\"userSpaceOnUse\" width=\"20\" height=\"20\" patternTransform=\"rotate(90)\">\n            <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"20\" stroke=\"COLOR\" stroke-width=\"20\" />\n        </pattern>\n    </defs>\n\n    <!-- CONTENT -->\n\n</svg>\n";
export declare function generateCard(cardId: number): string;
