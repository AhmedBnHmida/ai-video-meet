import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from 'http';
import socketServer from './socketServer';  

import userRoutes from './routes/userRoutes';  
import interviewRoutes from './routes/interviewRoutes';  
import authRoutes from './routes/authRoutes';
import applicationRoutes from "./routes/applicationRoutes";

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});



// Initialize Socket.IO logic
socketServer(io);  // Pass the io object to the socket server module

// Middleware
app.use(cors());
app.use(express.json());


app.use('/user', userRoutes);
app.use('/interview', interviewRoutes);
app.use('/api/auth', authRoutes);
app.use("/application", applicationRoutes);


mongoose.connect('mongodb://localhost:27017/videoMeetAI')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

module.exports = app;