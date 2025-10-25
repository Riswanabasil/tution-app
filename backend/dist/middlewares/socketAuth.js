'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.socketAuth = socketAuth;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
function socketAuth(secret) {
  return (socket, next) => {
    var _a;
    try {
      const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
      if (!token) return next(new Error('unauthorized'));
      const user = jsonwebtoken_1.default.verify(token, secret);
      socket.data.user = user;
      next();
    } catch (_b) {
      next(new Error('unauthorized'));
    }
  };
}
