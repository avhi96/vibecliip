import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import { router as userRoute } from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import authRoute from './routes/auth.route.js';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import { Server } from 'socket.io';
import notificationRoute from './routes/notification.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './server/.env' });
const app = express();

let serviceAccount;
try {
  serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8'));
} catch (error) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', error);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['https://vibecliip.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],  // Added localhost origins for local development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Routes
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Hello World",
        success: true
    });
});

app.use(cors(corsOptions));


// api routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1", notificationRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://vibecliip.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

//socket io

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('sendMessage', (message) => {
    const receiverId = message.receiverId;
    const senderId = message.senderId;
    io.to(receiverId).emit('message', message);
    if (senderId !== receiverId) {
      io.to(senderId).emit('message', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});

export { io };
