declare namespace Express {
    export interface Request {
        data: Token;
    }
}

interface Token {
    puzzle: number[];
    time: number;
}
