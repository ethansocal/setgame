import type { NextApiRequest, NextApiResponse } from "next";
import { createToken } from "../../src/setGame";

export default function newGame(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(400).send("y you looking back here\n\n;(");
    }
    res.setHeader("Set-Cookie", `token=${createToken()[0]}; Path=/`);
    return res.json({ result: true });
}
