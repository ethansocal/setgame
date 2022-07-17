"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCard = exports.TEMPLATE = exports.indexOfList = exports.generatePuzzle = exports.solvePuzzle = exports.parseCard = exports.verifySet = exports.arraysEqual = exports.allDifferent = exports.allSame = exports.MAX_SOLUTIONS = exports.MIN_SOLUTIONS = void 0;
exports.MIN_SOLUTIONS = 6;
exports.MAX_SOLUTIONS = 8;
function allSame(set) {
    return set.every((x) => x === set[0]);
}
exports.allSame = allSame;
function allDifferent(set) {
    return set.every((x) => set.indexOf(x) === set.lastIndexOf(x));
}
exports.allDifferent = allDifferent;
function arraysEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.arraysEqual = arraysEqual;
function verifySet(set) {
    const colors = set.map((x) => Math.floor((x - 1) / 3) % 3);
    const shapes = set.map((x) => Math.floor((x - 1) / 9) % 3);
    const numbers = set.map((x) => (x - 1) % 3);
    const shading = set.map((x) => Math.floor((x - 1) / 27));
    const colorsValid = allSame(colors) || allDifferent(colors);
    const shapesValid = allSame(shapes) || allDifferent(shapes);
    const numbersValid = allSame(numbers) || allDifferent(numbers);
    const shadingValid = allSame(shading) || allDifferent(shading);
    return [colorsValid, shapesValid, numbersValid, shadingValid].every((x) => x);
}
exports.verifySet = verifySet;
function parseCard(card) {
    const color = Math.floor((card - 1) / 3) % 3;
    const shape = Math.floor((card - 1) / 9) % 3;
    const number = ((card - 1) % 3) + 1;
    const shading = Math.floor((card - 1) / 27);
    return [
        color === 0 ? "red" : color === 1 ? "purple" : "green",
        shape === 0 ? "squiggle" : shape === 1 ? "diamond" : "oval",
        number,
        shading === 0 ? "solid" : shading === 1 ? "striped" : "empty",
    ];
}
exports.parseCard = parseCard;
function solvePuzzle(puzzle) {
    const solutions = [];
    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle.length; j++) {
            if (i === j) {
                continue;
            }
            for (let k = 0; k < puzzle.length; k++) {
                if (i === k || j === k) {
                    continue;
                }
                let solution = [puzzle[i], puzzle[j], puzzle[k]];
                solution = solution.sort();
                if (solutions.some((x) => arraysEqual(solution, x))) {
                    continue;
                }
                if (verifySet(solution)) {
                    solutions.push(solution);
                }
            }
        }
    }
    return solutions.map((x) => x.sort());
}
exports.solvePuzzle = solvePuzzle;
function generatePuzzle() {
    let valid = false;
    let cards = [];
    let puzzle = [];
    let solutions = [];
    while (!valid) {
        cards = Array.from({ length: 81 }, (_, i) => i + 1);
        puzzle = [];
        solutions = [];
        for (let i = 0; i < 12; i++) {
            puzzle.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
        }
        solutions = solvePuzzle(puzzle);
        valid =
            solutions.length >= exports.MIN_SOLUTIONS &&
                solutions.length <= exports.MAX_SOLUTIONS;
    }
    return [puzzle, solutions];
}
exports.generatePuzzle = generatePuzzle;
function indexOfList(list, value) {
    const len = list.length;
    for (let i = 0; i < len; i++) {
        if (list[i].every((x, j) => x === value[j])) {
            return i;
        }
    }
    return -1;
}
exports.indexOfList = indexOfList;
exports.TEMPLATE = `
<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">

    <defs>
        <!-- Shapes -->
        <path id="squiggle"
            d="M22.0815 1C10.303 1.00001 -0.792158 6.85996 1.24264 16.2601C3.50774 26.7242 18.9104 37.6243 16.6453 60.7325C14.6876 80.7048 0.336613 82.9687 2.60171 112.617C4.8668 142.265 32.5009 151.421 47.4506 150.985C63.7592 150.51 75.5377 144.881 75.9907 136.161C76.4437 127.441 60.1351 111.309 60.1351 97.7928C60.1351 84.2767 70.089 75.9926 70.5545 51.5764C71.4605 4.05204 33.86 0.999993 22.0815 1Z" />
        <rect width="75" height="150" rx="43.75" id="oval" />
        <polygon points="37.5,0 75,75 37.5,150 0,75" id="diamond" />

        <!-- Masks -->
        <mask id="squiggle-mask">
            <use href="#squiggle" stroke="white" fill="white" />
        </mask>
        <mask id="oval-mask">
            <use href="#oval" stroke="white" fill="white" />
        </mask>
        <mask id="diamond-mask">
            <use href="#diamond" stroke="white" fill="white" />
        </mask>

        <!-- Fills -->
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(90)">
            <line x1="0" y1="0" x2="0" y2="20" stroke="COLOR" stroke-width="20" />
        </pattern>
    </defs>

    <!-- CONTENT -->

</svg>
`;
function generateCard(cardId) {
    if (cardId === 0) {
        return exports.TEMPLATE;
    }
    let card = parseCard(cardId);
    let color = "";
    switch (card[0]) {
        case "green":
            color = "#14a750";
            break;
        case "purple":
            color = "#613394";
            break;
        case "red":
            color = "#ea1c2d";
            break;
    }
    let pattern = "";
    switch (card[3]) {
        case "solid":
            pattern = color;
            break;
        case "striped":
            pattern = "url(#stripes)";
            break;
        case "empty":
            break;
    }
    const element = `<use href="#${card[1]}" fill="${pattern}" stroke="${color}" stroke-width="10" transform="TRANSFORM" style="transform-origin: center;"/>`;
    const spacings = {
        1: [112],
        2: [67.5, 157.5],
        3: [22, 112, 202],
    };
    const elements = Array(card[2])
        .fill(0)
        .map((_, index) => {
        return element.replace("TRANSFORM", `translate(${spacings[card[2]][index]},25)`);
    });
    return exports.TEMPLATE.replace("<!-- CONTENT -->", elements.join("\n\t")).replace("COLOR", color);
}
exports.generateCard = generateCard;
