import { generatePuzzle } from "../src/setGame";

for (let i = 0; i <= parseInt(process.argv[2]); i++) {
    generatePuzzle();
}
