import express from "express";
import fs from "fs";
import http from "http";
import { checkSet, indexOfList } from "./setGame";

const app = express();
const PORT = process.argv[2] || 3000;

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        "http://setgame.ethansocal.codes"
    );
    res.header(
        "Content-Security-Policy",
        "default-src 'self'; style-src *; font-src *;"
    );
    next();
});
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.get("/api/puzzles/", (req, res) => {
    let puzzles = fs.readdirSync(__dirname + "/puzzles");
    puzzles = puzzles.map((x) => {
        return x.slice(7, x.length - 5);
    });
    res.send(puzzles);
});

app.get("/api/puzzles/random", (req, res) => {
    const puzzles = fs.readdirSync(__dirname + "/puzzles").filter((x) => {
        return x.startsWith("puzzle-");
    });
    const random = Math.floor(Math.random() * puzzles.length);
    const puzzle = JSON.parse(
        fs.readFileSync(__dirname + "/puzzles/" + puzzles[random]).toString()
    );
    delete puzzle.solutions;
    puzzle.id = puzzles[random].slice(0, puzzles[random].length - 5);
    res.send(puzzle);
});

app.post("/api/puzzles/:id/solution", (req, res) => {
    const id = req.params.id;
    const solutions: number[][] = JSON.parse(
        fs.readFileSync(__dirname + "/puzzles/" + id + ".json").toString()
    ).solutions;
    const length = solutions.length;
    const userSolutions: number[][] = req.body;
    if (userSolutions.length !== 6) {
        return res.status(400).send({ error: "Invalid solution length" });
    }
    for (let i = 0; i < userSolutions.length; i++) {
        try {
            solutions.splice(indexOfList(solutions, userSolutions[i]), 1);
        } catch {
            return res.send({ valid: false });
        }
    }
    if (solutions.length !== length - 6) {
        return res.send({ valid: true });
    } else {
        return res.send({ valid: false });
    }
});

app.get("/api/puzzles/:id", (req, res) => {
    const id = req.params.id;
    let puzzle: any = undefined;
    try {
        puzzle = JSON.parse(
            fs.readFileSync(__dirname + "/puzzles/" + id + ".json").toString()
        );
    } catch (e) {
        try {
            puzzle = JSON.parse(
                fs
                    .readFileSync(__dirname + "/puzzles/puzzle-" + id + ".json")
                    .toString()
            );
        } catch (e) {
            return res.status(404).send({ error: "Puzzle not found" });
        }
    }
    delete puzzle.solutions;
    puzzle.id = id;
    res.send(puzzle);
});

app.post("/api/checkset", (req, res) => {
    const set = req.body;
    if (set.length !== 3) {
        return res.status(400).send({ error: "Invalid set length" });
    }
    const result = checkSet(set);

    res.send({
        valid: result.every((x) => x),
        colors: result[0],
        shapes: result[1],
        numbers: result[2],
        shading: result[3],
    });
});

http.createServer(app).listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
