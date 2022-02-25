import setGame from "./setGame";

// Write tests for the setGame module here.
describe("generatePuzzle", () => {
    it("generates a puzzle with unique cards", () => {
        for (let i = 0; i < 100; i++) {
            const puzzle = setGame.generatePuzzle();
            expect(puzzle.length).toBe(12);
            expect(Array.from(new Set(puzzle))).toHaveLength(12);
            expect(setGame.solvePuzzle(puzzle).length).toBeLessThanOrEqual(
                setGame.MAX_SOLUTIONS
            );
            expect(setGame.solvePuzzle(puzzle).length).toBeGreaterThanOrEqual(
                setGame.MIN_SOLUTIONS
            );
        }
    });
});

export {};
