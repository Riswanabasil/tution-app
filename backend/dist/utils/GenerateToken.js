'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const ACCESS_TOKEN = process.env.JWT_SECRET;
const REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET;
const generateAccessToken = (id, email, role, name) => {
  return jsonwebtoken_1.default.sign({ id, email, role, name }, ACCESS_TOKEN, { expiresIn: '30m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id, email, role, name) => {
  return jsonwebtoken_1.default.sign({ id, email, role, name }, REFRESH_TOKEN, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
