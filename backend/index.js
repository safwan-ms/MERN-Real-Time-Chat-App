import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./lib/db.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();

//Connect to db
connectDB();

const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/users", userRoutes);

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
