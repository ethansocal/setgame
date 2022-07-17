"use strict";
exports.__esModule = true;
exports.generateCard = exports.TEMPLATE = exports.indexOfList = exports.generatePuzzle = exports.solvePuzzle = exports.parseCard = exports.verifySet = exports.arraysEqual = exports.allDifferent = exports.allSame = exports.MAX_SOLUTIONS = exports.MIN_SOLUTIONS = void 0;
exports.MIN_SOLUTIONS = 6;
exports.MAX_SOLUTIONS = 8;
function allSame(set) {
    return set.every(function (x) { return x === set[0]; });
}
exports.allSame = allSame;
function allDifferent(set) {
    return set.every(function (x) { return set.indexOf(x) === set.lastIndexOf(x); });
}
exports.allDifferent = allDifferent;
function arraysEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.arraysEqual = arraysEqual;
function verifySet(set) {
    var colors = set.map(function (x) { return Math.floor((x - 1) / 3) % 3; });
    var shapes = set.map(function (x) { return Math.floor((x - 1) / 9) % 3; });
    var numbers = set.map(function (x) { return (x - 1) % 3; });
    var shading = set.map(function (x) { return Math.floor((x - 1) / 27); });
    var colorsValid = allSame(colors) || allDifferent(colors);
    var shapesValid = allSame(shapes) || allDifferent(shapes);
    var numbersValid = allSame(numbers) || allDifferent(numbers);
    var shadingValid = allSame(shading) || allDifferent(shading);
    return [colorsValid, shapesValid, numbersValid, shadingValid].every(function (x) { return x; });
}
exports.verifySet = verifySet;
function parseCard(card) {
    var color = Math.floor((card - 1) / 3) % 3;
    var shape = Math.floor((card - 1) / 9) % 3;
    var number = ((card - 1) % 3) + 1;
    var shading = Math.floor((card - 1) / 27);
    return [
        color === 0 ? "red" : color === 1 ? "purple" : "green",
        shape === 0 ? "squiggle" : shape === 1 ? "diamond" : "oval",
        number,
        shading === 0 ? "solid" : shading === 1 ? "striped" : "empty",
    ];
}
exports.parseCard = parseCard;
function solvePuzzle(puzzle) {
    var solutions = [];
    for (var i = 0; i < puzzle.length; i++) {
        for (var j = 0; j < puzzle.length; j++) {
            if (i === j) {
                continue;
            }
            var _loop_1 = function (k) {
                if (i === k || j === k) {
                    return "continue";
                }
                var solution = [puzzle[i], puzzle[j], puzzle[k]];
                solution = solution.sort();
                if (solutions.some(function (x) { return arraysEqual(solution, x); })) {
                    return "continue";
                }
                if (verifySet(solution)) {
                    solutions.push(solution);
                }
            };
            for (var k = 0; k < puzzle.length; k++) {
                _loop_1(k);
            }
        }
    }
    return solutions.map(function (x) { return x.sort(); });
}
exports.solvePuzzle = solvePuzzle;
function generatePuzzle() {
    var valid = false;
    var cards = [];
    var puzzle = [];
    var solutions = [];
    while (!valid) {
        cards = Array.from({ length: 81 }, function (_, i) { return i + 1; });
        puzzle = [];
        solutions = [];
        for (var i = 0; i < 12; i++) {
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
    var len = list.length;
    for (var i = 0; i < len; i++) {
        if (list[i].every(function (x, j) { return x === value[j]; })) {
            return i;
        }
    }
    return -1;
}
exports.indexOfList = indexOfList;
exports.TEMPLATE = "\n<svg width=\"300\" height=\"200\" viewBox=\"0 0 300 200\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n\n    <defs>\n        <!-- Shapes -->\n        <path id=\"squiggle\"\n            d=\"M22.0815 1C10.303 1.00001 -0.792158 6.85996 1.24264 16.2601C3.50774 26.7242 18.9104 37.6243 16.6453 60.7325C14.6876 80.7048 0.336613 82.9687 2.60171 112.617C4.8668 142.265 32.5009 151.421 47.4506 150.985C63.7592 150.51 75.5377 144.881 75.9907 136.161C76.4437 127.441 60.1351 111.309 60.1351 97.7928C60.1351 84.2767 70.089 75.9926 70.5545 51.5764C71.4605 4.05204 33.86 0.999993 22.0815 1Z\" />\n        <rect width=\"75\" height=\"150\" rx=\"43.75\" id=\"oval\" />\n        <polygon points=\"37.5,0 75,75 37.5,150 0,75\" id=\"diamond\" />\n\n        <!-- Masks -->\n        <mask id=\"squiggle-mask\">\n            <use href=\"#squiggle\" stroke=\"white\" fill=\"white\" />\n        </mask>\n        <mask id=\"oval-mask\">\n            <use href=\"#oval\" stroke=\"white\" fill=\"white\" />\n        </mask>\n        <mask id=\"diamond-mask\">\n            <use href=\"#diamond\" stroke=\"white\" fill=\"white\" />\n        </mask>\n\n        <!-- Fills -->\n        <pattern id=\"stripes\" patternUnits=\"userSpaceOnUse\" width=\"20\" height=\"20\" patternTransform=\"rotate(90)\">\n            <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"20\" stroke=\"COLOR\" stroke-width=\"20\" />\n        </pattern>\n    </defs>\n\n    <!-- CONTENT -->\n\n</svg>\n";
function generateCard(cardId) {
    if (cardId === 0) {
        return exports.TEMPLATE;
    }
    var card = parseCard(cardId);
    var color = "";
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
    var pattern = "";
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
    var element = "<use href=\"#".concat(card[1], "\" fill=\"").concat(pattern, "\" stroke=\"").concat(color, "\" stroke-width=\"10\" transform=\"TRANSFORM\" style=\"transform-origin: center;\"/>");
    var spacings = {
        1: [112],
        2: [67.5, 157.5],
        3: [22, 112, 202]
    };
    var elements = Array(card[2])
        .fill(0)
        .map(function (_, index) {
        return element.replace("TRANSFORM", "translate(".concat(spacings[card[2]][index], ",25)"));
    });
    return exports.TEMPLATE.replace("<!-- CONTENT -->", elements.join("\n\t")).replace("COLOR", color);
}
exports.generateCard = generateCard;
