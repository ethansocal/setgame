import express from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { Server } from "socket.io";
import { createServer } from "http";
import fs from "fs";
import { generatePuzzle, parseCard, solvePuzzle, verifySet } from "./setGame";

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

interface Client {
    puzzle: number[];
    time: number;
    selected: number[];
    found: number[][];
}

const sockets: Record<string, Client> = {};
io.on("connection", (socket) => {
    sockets[socket.id] = {
        puzzle: generatePuzzle(),
        time: Date.now(),
        selected: [],
        found: [],
    };
    socket.emit("game", sockets[socket.id].puzzle, Date.now());
    socket.on("newGame", () => {
        sockets[socket.id] = {
            puzzle: generatePuzzle(),
            time: Date.now(),
            selected: [],
            found: [],
        };

        socket.emit("game", sockets[socket.id].puzzle, Date.now());
    });
    socket.on("selected", (card: number): void => {
        if (card > -1) {
            if (sockets[socket.id].found.length > 6) {
                return;
            }
            sockets[socket.id].selected.push(card);
            if (sockets[socket.id].selected.length === 3) {
                const result =
                    verifySet(
                        sockets[socket.id].selected.map(
                            (x) => sockets[socket.id].puzzle[x]
                        )
                    ) &&
                    sockets[socket.id].found.every((x) => {
                        return !arraysEqual(
                            x.sort(),
                            sockets[socket.id].selected.sort()
                        );
                    });
                if (result) {
                    sockets[socket.id].found.push(sockets[socket.id].selected);
                }
                sockets[socket.id].selected = [];
                if (result && sockets[socket.id].found.length === 6) {
                    socket.emit("win", sockets[socket.id].time);
                } else {
                    socket.emit("setResult", result);
                }
            }
        } else {
            sockets[socket.id].selected = sockets[socket.id].selected.filter(
                (x) => x !== card * -1 - 1
            );
        }
    });
    socket.on("admin", () => {
        socket.emit("admin", {
            answers: solvePuzzle(sockets[socket.id].puzzle),
        });
    });
});

//#region Sentry
if (!module.children) {
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

app.use(
    express.static(__dirname + "/../dist", {
        extensions: ["html"],
    })
);
app.use(express.static(__dirname + "/public"));

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

//#region Sentry

app.use(Sentry.Handlers.errorHandler());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function onError(err, _req, res, _next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    console.log(err);
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});
//#endregion

function arraysEqual(a: unknown[], b: unknown[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

if (!module.parent) {
    server.listen(PORT, () => {
        console.log("Running");
    });
}
