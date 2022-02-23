import type { NextApiRequest, NextApiResponse } from "next";
import { createToken } from "../../src/authManager";
import { withSentry } from "@sentry/nextjs";

async function newGame(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(400).send("y you looking back here\n\n;(");
    }
    res.setHeader("Set-Cookie", `token=${(await createToken())[0]}; Path=/`);
    return res.json({ result: true });
}

export default withSentry(newGame);
