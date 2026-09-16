import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { initializeSocket } from "./socket.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import bookCopyRoutes from "./routes/bookCopyRoutes.js";
import shelfRoutes from "./routes/shelfRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import notifyRoutes from "./routes/notifyRoutes.js";
dotenv.config();

const app = express();
const httpServer = createServer(app);
initializeSocket(httpServer);
app.use(
  cors({
    origin: "http://192.168.1.6:5173",
    credentials: true,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
//Routers
app.use("/books", bookRoutes);
app.use("/shelf", shelfRoutes);
app.use("/bookCopy", bookCopyRoutes);
app.use("/user", userRoutes);
app.use("/image", imageRoutes);
app.use("/notification", notifyRoutes);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Binagbag LMS API is Running!");
});
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port " + PORT);
});
