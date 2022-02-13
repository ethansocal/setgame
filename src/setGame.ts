import fs from "fs";

function savePuzzle(
    name: string,
    cards: number[],
    solutions: number[][]
): void {
    const puzzle = {
        cards,
        solutions,
    };
    fs.writeFileSync(
        __dirname + `/puzzles/${name}.json`,
        JSON.stringify(puzzle)
    );
}

function allSame(set: number[]): boolean {
    return set.every((x) => x === set[0]);
}

function allDifferent(set: number[]): boolean {
    return set.every((x) => set.indexOf(x) === set.lastIndexOf(x));
}

function arraysEqual(a: any[], b: any[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function checkSet(set: number[]): [boolean, boolean, boolean, boolean] {
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
                if (checkSet(solution).every((x) => x)) {
                    solutions.push(solution);
                }
            }
        }
    }
    return solutions;
}

function generateNumber(): string {
    let valid = false;
    let num = "0";
    while (!valid) {
        num = Math.floor(Math.random() * 1000000).toLocaleString("en-US", {
            minimumIntegerDigits: 6,
            useGrouping: false,
        });
        valid = !fs.existsSync(__dirname + `/puzzles/${num}.json`);
    }
    return num;
}

function generatePuzzle(name: string | null | undefined = undefined): number[] {
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
        valid = solutions.length > 5;
    }
    return puzzle;
}

function indexOfList(list: number[][], value: number[]): number {
    let len = list.length;
    for (let i = 0; i < len; i++) {
        if (list[i].every((x, j) => x === value[j])) {
            return i;
        }
    }
    return -1;
}

export {
    savePuzzle,
    allSame,
    generatePuzzle,
    allDifferent,
    solvePuzzle,
    checkSet,
    indexOfList,
};
