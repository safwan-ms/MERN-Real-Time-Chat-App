import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./lib/db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

dotenv.config();

//Connect to db
connectDB();

const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

//Store online users
export const userSocketMap = {}; //{userId : socket}

//Socket.io connect handler
io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  console.log("User connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  //Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
