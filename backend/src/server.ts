import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import { initializeSocket } from './socket/socketHandler';

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
initializeSocket(io);

app.set('io', io);

const startServer = async () => {
  try {
    await connectDB();
    // For local dev and for Vercel Web Service (container), we must listen.
    // For Vercel Serverless (api/index.ts), this file is not executed - handler imports app directly.
    httpServer.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    // In production (Vercel), don't exit - let platform report error
  }
};

startServer();

export default app;
