import { Injectable } from "@nestjs/common";
import type { Socket } from "socket.io";
import { generatePuzzle, verifySet } from "utils";

interface Connection {
    socket: Socket;
    puzzle?: [number[], number[][]];
}

@Injectable()
export class GameService {
    private connections: Record<string, Connection> = {};

    connect(socket: Socket) {
        this.connections[socket.id] = { socket };
    }

    newPuzzle(socket: Socket): number[] {
        this.connections[socket.id].puzzle = generatePuzzle();
        return this.connections[socket.id].puzzle[0];
    }

    disconnect(socket: Socket) {
        delete this.connections[socket.id];
    }

    checkSet(set: number[]): boolean {
        return verifySet(set);
    }
}
