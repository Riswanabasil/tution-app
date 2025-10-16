"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
// import { socketAuth } from './middlewares/socketAuth';
const createSignalingServer_1 = require("./signaling/createSignalingServer");
const PORT = process.env.PORT || 5000;
// const httpServer=http.createServer(app)
const server = http_1.default.createServer(app_1.default);
(0, createSignalingServer_1.createSignalingServer)(server);
(0, db_1.default)().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
