import { io } from "socket.io-client";

export const socket = io(
  "https://binagbag-library-management-system.onrender.com",
  {
    withCredentials: true,
  },
);
