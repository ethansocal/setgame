const MIN_SOLUTIONS = 6;
const MAX_SOLUTIONS = 8;

function allSame(set: number[]): boolean {
    return set.every((x) => x === set[0]);
}

function allDifferent(set: number[]): boolean {
    return set.every((x) => set.indexOf(x) === set.lastIndexOf(x));
}

function arraysEqual<A, B>(a: A[], b: B[] | A[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function verifySet(set: number[]): [boolean, boolean, boolean, boolean] {
    const colors = set.map((x) => Math.floor((x - 1) / 3) % 3);
    const shapes = set.map((x) => Math.floor((x - 1) / 9) % 3);
    const numbers = set.map((x) => (x - 1) % 3);
    const shading = set.map((x) => Math.floor((x - 1) / 27));

    const colorsValid = allSame(colors) || allDifferent(colors);
    const shapesValid = allSame(shapes) || allDifferent(shapes);
    const numbersValid = allSame(numbers) || allDifferent(numbers);
    const shadingValid = allSame(shading) || allDifferent(shading);

    return [colorsValid, shapesValid, numbersValid, shadingValid];
}

function solvePuzzle(puzzle: number[]): number[][] {
    const solutions: number[][] = [];
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
                if (verifySet(solution).every((x) => x)) {
                    solutions.push(solution);
                }
            }
        }
    }
    return solutions;
}

function generatePuzzle(): number[] {
    let valid = false;
    let cards: number[] = [];
    let puzzle: number[] = [];
    let solutions: number[][] = [];

    while (!valid) {
        cards = Array.from({ length: 81 }, (x, i) => i + 1);
        puzzle = [];
        solutions = [];

        for (let i = 0; i < 12; i++) {
            puzzle.push(
                cards.splice(Math.floor(Math.random() * cards.length), 1)[0]
            );
        }
        solutions = solvePuzzle(puzzle);
        valid =
            solutions.length >= MIN_SOLUTIONS &&
            solutions.length <= MAX_SOLUTIONS;
    }
    return puzzle;
}

function indexOfList(list: number[][], value: number[]): number {
    const len = list.length;
    for (let i = 0; i < len; i++) {
        if (list[i].every((x, j) => x === value[j])) {
            return i;
        }
    }
    return -1;
}
const setGame = {
    allSame,
    generatePuzzle,
    allDifferent,
    solvePuzzle,
    verifySet,
    indexOfList,
    MAX_SOLUTIONS,
    MIN_SOLUTIONS,
};
export default setGame;

export {
    allSame,
    generatePuzzle,
    allDifferent,
    solvePuzzle,
    verifySet,
    indexOfList,
    MAX_SOLUTIONS,
    MIN_SOLUTIONS,
};
