import { io } from 'socket.io-client';

// Replace with your server URL
const URL='http://localhost:3001'

export const socket = io(URL, {
    transports: ["websocket"],
    extraHeaders: {
      myheader: "12345",
    },
    withCredentials: true,
    autoConnect: false,
});