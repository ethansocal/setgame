import express from "express";
import fs from "fs";
import cookieParser from "cookie-parser";
import http from "http";
import { checkSet, generatePuzzle, solvePuzzle } from "./setGame";

const app = express();
const PORT = process.argv[2] || 3000;

function generateToken() {
    return JSON.stringify({
        puzzle: generatePuzzle(),
        time: Date.now(),
    });
}

app.use("/", express.static(__dirname + "/public"));
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(fs.readFileSync(__dirname + "/../cookie.key").toString()));
app.use((req, res, next) => {
    let token = undefined;
    if (req.signedCookies.token === undefined) {
        token = generateToken();
        res.cookie("token", token, { signed: true });
    }
    try {
        req.data = JSON.parse(token || req.signedCookies.token);
    } catch (e) {
        res.cookie("token", generateToken(), { signed: true });
        req.data = JSON.parse(token || req.signedCookies.token);
    }
    next();
});

app.post("/win", (req, res) => {
    const { puzzle } = req.data.puzzle;
    console.log(req.body);
    const userSolutions = JSON.parse(req.body);
    if (userSolutions.length !== 6) {
        res.status(400).send("Must have 6 solutions.");
        return;
    }
    const solutions = solvePuzzle(puzzle);
    const origLength = solutions.length;
    for (let i = 0; i < 6; i++) {
        if (solutions.includes(userSolutions[i].sort())) {
            solutions.splice(solutions.indexOf(userSolutions[i].sort()), 1);
        }
    }
    if (solutions.length === origLength + 6) {
        const time = Date.now() - req.data.time;
        return res
            .header("time", time.toString())
            .cookie("token", generateToken(), { signed: true })
            .sendFile(__dirname + "/private/win.html");
    }
    return res.redirect("/");
});

app.get("/win", (req, res) => {
    const time = Date.now() - req.data.time;
    return res
        .header("time", time.toString())
        .cookie("token", generateToken(), { signed: true })
        .sendFile(__dirname + "/private/win.html");
});

app.get("/card/:id.png", (req, res) => {
    if (req.params.id === "empty") {
        return res.sendFile(__dirname + "/private/cards/empty.png");
    }
    res.sendFile(
        __dirname +
            `/private/cards/${req.data.puzzle[parseInt(req.params.id)]}.png`
    );
});

app.post("/api/newgame", (req, res) => {
    res.cookie("token", generateToken(), { signed: true });
    res.sendStatus(200);
});

app.post("/api/checkset", (req, res) => {
    const set = [
        req.data.puzzle[req.body[0]],
        req.data.puzzle[req.body[1]],
        req.data.puzzle[req.body[2]],
    ];

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
