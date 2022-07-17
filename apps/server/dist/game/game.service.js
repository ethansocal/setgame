"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("utils");
let GameService = class GameService {
    constructor() {
        this.connections = {};
    }
    connect(socket) {
        this.connections[socket.id] = { socket };
    }
    newPuzzle(socket) {
        this.connections[socket.id].puzzle = (0, utils_1.generatePuzzle)();
        return this.connections[socket.id].puzzle[0];
    }
    disconnect(socket) {
        delete this.connections[socket.id];
    }
    checkSet(set) {
        return (0, utils_1.verifySet)(set);
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map