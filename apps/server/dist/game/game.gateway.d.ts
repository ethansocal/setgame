import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
export declare class GameGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private GameService;
    constructor(GameService: GameService);
    private logger;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleNewPuzzle(client: Socket): void;
    handleCheckSet(selected: number[]): {
        error: string;
        result?: undefined;
    } | {
        result: boolean;
        error?: undefined;
    };
}
