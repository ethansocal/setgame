import jwt from "@tsndr/cloudflare-worker-jwt";
import { generatePuzzle } from "./setGame";
import * as crypto from "crypto";

interface Token {
    puzzle: number[];
    time: number;
}

function readToken(token: string): Token | undefined {
    if (token === undefined || token === null) {
        return undefined;
    }
    try {
        if (!jwt.verify(token, process.env.JWT_KEY)) {
            return undefined;
        }
        return jwt.decode(token) as Token;
    } catch (e) {
        return undefined;
    }
}

async function createToken(): Promise<[string, number[], number]> {
    const puzzle = generatePuzzle();
    const time = Math.floor(Date.now() / 1000);
    return [
        await jwt.sign({ puzzle: puzzle, time: time }, process.env.JWT_KEY),
        puzzle,
        time,
    ];
}

export { readToken, createToken };
export type { Token };
