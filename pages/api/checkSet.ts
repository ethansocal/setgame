import { verifySet } from "../../src/setGame";
import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { readToken } from "../../src/authManager";

function checkSet(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(400).send("y you looking back here\n\n;(");
    }

    if (req.body.length !== 3) {
        return res.status(400).json({ error: "Invalid set length" });
    }
    const data = readToken(req.cookies.token);
    const result = verifySet(req.body.map((x) => data.puzzle[x]));

    return res.json({
        result: result.every((x) => x),
        colors: result[0],
        shapes: result[1],
        numbers: result[2],
        shading: result[3],
    });
}

export default withSentry(checkSet);
