import { generatePuzzle } from "./setGame";

function createToken(): Token {
    const puzzle = generatePuzzle();
    const time = Date.now();
    return { puzzle: puzzle, time: time };
}

export { createToken };
