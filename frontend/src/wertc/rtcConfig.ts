export const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302"] },
    // later add TURN servers here for production
  ],
  iceCandidatePoolSize: 8,
};
