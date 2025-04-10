import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http';
import socketServer from './socketServer';  // Use import instead of require
import userRoutes from './routes/userRoutes';  // Use import instead of require
import interviewRoutes from './routes/interviewRoutes';  // Use import instead of require
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

socketServer(io);  // Pass the io object to the socket server module

app.use('/user', userRoutes);
app.use('/interview', interviewRoutes);
app.use('/api/auth', authRoutes);

/* 
mongoose.connect('mongodb://localhost:27017/videoMeetAI')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));
*/
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

module.exports = app;