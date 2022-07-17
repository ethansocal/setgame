import type { Socket } from "socket.io";
export declare class GameService {
    private connections;
    connect(socket: Socket): void;
    newPuzzle(socket: Socket): number[];
    disconnect(socket: Socket): void;
    checkSet(set: number[]): boolean;
}
