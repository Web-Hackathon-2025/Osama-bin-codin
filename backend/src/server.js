import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import exampleRoutes from "./routes/exampleRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { authenticateSocket } from "./middleware/socketAuthMiddleware.js";
import { initializeSocket } from "./sockets/chatSocket.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO authentication middleware
io.use(authenticateSocket);

// Initialize chat socket handlers
initializeSocket(io);

// IMPORTANT: Webhook routes MUST come BEFORE express.json()
// Stripe requires raw request body for signature verification
app.use("/api/webhooks", webhookRoutes);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/examples", exampleRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;

// FORCE IPv4 binding to fix Windows issue
const server = httpServer.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ SERVER IS RUNNING!`);
  console.log(`${'='.repeat(60)}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🌐 IP: http://0.0.0.0:${PORT}`);
  console.log(`📡 Actual binding: ${JSON.stringify(address)}`);
  console.log(`🔌 WebSocket: Ready`);
  console.log(`📡 MongoDB: Connected`);
  console.log(`${'='.repeat(60)}\n`);
});

server.on('error', (error) => {
  console.error('\n❌❌❌ SERVER ERROR ❌❌❌');
  console.error(error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  }
  process.exit(1);
});
