// src/socketServer.ts
import { Server, Socket } from 'socket.io';

// Define types for the event payloads
interface JoinRoomPayload {
  roomId: string;
}

interface OfferPayload {
  roomId: string;
  offer: RTCSessionDescriptionInit; // WebRTC offer type
}

interface AnswerPayload {
  roomId: string;
  answer: RTCSessionDescriptionInit; // WebRTC answer type
}

interface IceCandidatePayload {
  roomId: string;
  candidate: RTCIceCandidateInit; // WebRTC ICE candidate type
}

const socketServer = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join a room
    socket.on('join-room', ({ roomId }: JoinRoomPayload) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle offer
    socket.on('offer', ({ roomId, offer }: OfferPayload) => {
      socket.to(roomId).emit('offer', offer);
      console.log(`Offer sent to room: ${roomId}`);
    });

    // Handle answer
    socket.on('answer', ({ roomId, answer }: AnswerPayload) => {
      socket.to(roomId).emit('answer', answer);
      console.log(`Answer sent to room: ${roomId}`);
    });

    // Handle ICE candidate
    socket.on('ice-candidate', ({ roomId, candidate }: IceCandidatePayload) => {
      socket.to(roomId).emit('ice-candidate', candidate);
      console.log(`ICE candidate sent to room: ${roomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export default socketServer;