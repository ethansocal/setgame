import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createToken, readToken } from "../src/setGame";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const res = NextResponse.next();
    const data = readToken(req.cookies.token);
    if (data === undefined) {
        res.cookie("token", (await createToken())[0]);
    }
    return res;
}
