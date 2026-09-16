import { io } from "socket.io-client";

export const socket = io("http://192.168.1.6:5000", {
  withCredentials: true,
});
