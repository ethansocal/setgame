"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
let GameGateway = class GameGateway {
    constructor(GameService) {
        this.GameService = GameService;
        this.logger = new common_1.Logger("GameGateway");
    }
    afterInit(server) {
        this.logger.log("GameGateway initialized.");
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
        this.GameService.connect(client);
        client.emit("setPuzzle", this.GameService.newPuzzle(client));
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.GameService.disconnect(client);
    }
    handleNewPuzzle(client) {
        client.emit("setPuzzle", this.GameService.newPuzzle(client));
    }
    handleCheckSet(selected) {
        if (selected.length !== 3) {
            return { error: "Invalid length" };
        }
        return { result: this.GameService.checkSet(selected) };
    }
};
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("newPuzzle"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleNewPuzzle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("checkSet"),
    __param(0, (0, websockets_1.MessageBody)("selected")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleCheckSet", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: "game" }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map