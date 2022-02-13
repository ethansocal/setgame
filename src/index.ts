import express from "express";
import fs from "fs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import http from "http";
import { checkSet, generatePuzzle } from "./setGame";

const app = express();
const PORT = process.argv[2] || 3000;

function generateToken() {
    return jwt.sign(
        {
            puzzle: generatePuzzle(),
            time: Date.now(),
        },
        fs.readFileSync(__dirname + "/../key.pub").toString()
    );
}

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
app.use(cookieParser());
app.use((req, res, next) => {
    let token = undefined;
    if (req.cookies.token === undefined) {
        token = res.cookie("token", generateToken());
    }
    req.data = jwt.verify(
        token || req.cookies.token,
        fs.readFileSync(__dirname + "/../key.pub").toString()
    );
    next();
});

app.use("/card/:id.png", (req, res) => {
    if (req.params.id === "empty") {
        return res.sendFile(__dirname + "/cards/empty.png");
    }
    res.sendFile(
        __dirname + `/cards/${req.data.puzzle[parseInt(req.params.id)]}.png`
    );
});

app.post("/api/newgame", (req, res) => {
    res.cookie("token", generateToken());
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
