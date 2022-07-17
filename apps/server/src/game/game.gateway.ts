import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { GameService } from "./game.service";

@WebSocketGateway({ namespace: "game" })
export class GameGateway
    implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
    constructor(private GameService: GameService) {}
    private logger: Logger = new Logger("GameGateway");

    afterInit(server: Server) {
        this.logger.log("GameGateway initialized.");
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        this.GameService.connect(client);
        client.emit("setPuzzle", this.GameService.newPuzzle(client));
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.GameService.disconnect(client);
    }

    @SubscribeMessage("newPuzzle")
    handleNewPuzzle(@ConnectedSocket() client: Socket) {
        client.emit("setPuzzle", this.GameService.newPuzzle(client));
    }

    @SubscribeMessage("checkSet")
    handleCheckSet(@MessageBody("selected") selected: number[]) {
        if (selected.length !== 3) {
            return { error: "Invalid length" };
        }
        return { result: this.GameService.checkSet(selected) };
    }
}
