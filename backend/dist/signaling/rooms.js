'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;
exports.peersIn = peersIn;
const rooms = new Map();
function joinRoom(roomKey, p) {
  var _a;
  const list = (_a = rooms.get(roomKey)) !== null && _a !== void 0 ? _a : [];
  const next = [...list, p];
  rooms.set(roomKey, next);
  return { peers: next };
}
function leaveRoom(roomKey, socketId) {
  var _a;
  const list = (_a = rooms.get(roomKey)) !== null && _a !== void 0 ? _a : [];
  const next = list.filter((x) => x.socketId !== socketId);
  if (next.length > 0) rooms.set(roomKey, next);
  else rooms.delete(roomKey);
}
function peersIn(roomKey) {
  var _a;
  return (_a = rooms.get(roomKey)) !== null && _a !== void 0 ? _a : [];
}
