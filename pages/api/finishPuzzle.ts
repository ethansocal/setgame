import { NextApiRequest, NextApiResponse } from "next";
import { createToken, readToken, solvePuzzle } from "../../src/setGame";

export default function finishPuzzle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(400).send("y you looking back here\n\n;(");
    }
    const data = readToken(req.cookies.token);
    const userSolutions = JSON.parse(req.body);
    const solutions = solvePuzzle(data.puzzle);
    if (userSolutions.length !== 6) {
        res.status(400).send("Must have 6 solutions.");
        return;
    }
    const origLength = solutions.length;
    for (let i = 0; i < 6; i++) {
        if (solutions.includes(userSolutions[i].sort())) {
            solutions.splice(solutions.indexOf(userSolutions[i].sort()), 1);
        }
    }
    if (solutions.length === origLength + 6) {
        const time = Date.now() - data.time;
        return res
            .setHeader(
                "Set-Cookie",
                `token=${createToken()[0]}; Path=/; HttpOnly;`
            )
            .json({ result: true, time: time });
    } else {
        return res.status(400).json({ result: false });
    }
}
