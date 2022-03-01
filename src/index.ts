import express from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import cookieParser from "cookie-parser";
import fs from "fs";
import { createToken } from "./authManager";
import { parseCard, solvePuzzle, verifySet } from "./setGame";

const app = express();

//#region Sentry
if (!module.parent) {
    Sentry.init({
        dsn: "https://3a3915ba1000470b8e3bfd791d720070@o1112946.ingest.sentry.io/6232665",
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({ app }),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
//#endregion

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(fs.readFileSync(__dirname + "/../cookie.key").toString()));

app.use((req, res, next) => {
    let token = undefined;
    if (req.signedCookies.token === undefined) {
        token = createToken();
        res.cookie("token", JSON.stringify(token), { signed: true });
    }
    try {
        token = JSON.parse(req.signedCookies.token);
        if (token.puzzle.length !== 12 || typeof token.time !== "number") {
            throw new Error("Incorrect token");
        }
    } catch (e) {
        token = createToken();
        res.cookie("token", JSON.stringify(token), { signed: true });
    } finally {
        req.data = token;
    }
    return next();
});

app.use(
    express.static(__dirname + "/../dist", {
        extensions: ["html"],
    })
);

app.get("/card/:id", (req, res) => {
    if (req.params.id === "empty.svg" || req.params.id === "0.svg") {
        return res.sendFile(__dirname + "/shapes.svg");
    }
    const card = parseCard(parseInt(req.params.id.replace(".svg", "")));
    const file = fs.readFileSync(__dirname + "/shapes.svg").toString();
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
            return element.replace(
                "TRANSFORM",
                `translate(${spacings[card[2]][index]},25)`
            );
        });

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(
        file
            .replace("<!-- CONTENT -->", elements.join("\n\t"))
            .replace("COLOR", color)
    );
});

app.post("/api/newGame", (req, res) => {
    res.cookie("token", createToken(), { signed: true });
    res.sendStatus(200);
});

app.post("/api/checkSet", (req, res) => {
    const set = req.body;

    if (set.length !== 3 || set.some((x) => typeof x !== "number")) {
        return res.status(400).send({ error: "Invalid set length" });
    }
    const result = verifySet(set);

    res.send({
        valid: result.every((x) => x),
        colors: result[0],
        shapes: result[1],
        numbers: result[2],
        shading: result[3],
    });
});

app.get("/api/current", (req, res) => {
    res.json(req.data);
});

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function compare(a, b) {
    if (a === b) return 0;

    return a < b ? -1 : 1;
}
function insideAnotherArray(array, target): boolean {
    for (let i = 0; i < array.length; i++) {
        if (arraysEqual(array[i].sort(compare), target.sort(compare))) {
            return true;
        }
    }
    return false;
}

app.post("/api/finishPuzzle", (req, res) => {
    const userSolutions = req.body.map((x) =>
        x.map((i) => req.data.puzzle[i]).sort(compare)
    );
    if (userSolutions.length !== 6) {
        res.status(400).send("Must have 6 solutions.");
        return;
    }

    const solutions = solvePuzzle(req.data.puzzle);
    const found = [];
    for (let i = 0; i < 6; i++) {
        if (
            insideAnotherArray(userSolutions, solutions[i]) &&
            !insideAnotherArray(userSolutions, found)
        ) {
            found.push(userSolutions[i]);
        }
    }
    if (found.length === 6) {
        const time = Date.now() - req.data.time;
        return res
            .cookie("token", createToken(), { signed: true })
            .json({ result: true, time: time });
    } else {
        return res.status(400).json({ result: false });
    }
});

app.get("/api/admin", (req, res) => {
    if (!(req.cookies.admin === "supersecretadminpassword")) {
        res.sendStatus(403);
    }
    res.json({ answers: solvePuzzle(req.data.puzzle) });
});

//#region Sentry

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, _req, res, _next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    console.log(err);
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});
//#endregion

if (!module.parent) {
    app.listen(3000, () => {
        console.log("Running");
    });
}
