import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

import apiRoutes from "./routes/index.js";
import { protect } from "./middlewares/auth.middleware.js";

import { notFound, errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

// 1️Initialize express FIRST
const app = express();

// 2️Core middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//Routes
app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

// Health check
app.get("/", (req, res) => {
  res.send("GigFlow API running");
});

// Optional test route
app.get("/api/test-protect", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user.email,
  });
});

// 4️Connect DB
connectDB();

// 5️Create HTTP server AFTER app exists
const server = http.createServer(app);

// 6️Initialize Socket.io
initSocket(server);

// 7️Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
