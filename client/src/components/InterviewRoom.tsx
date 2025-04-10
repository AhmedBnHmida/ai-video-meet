// src/components/InterviewRoom.tsx
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface InterviewRoomProps {
  roomId: string;
}

const socket: Socket = io('http://localhost:5000');

const InterviewRoom: React.FC<InterviewRoomProps> = ({ roomId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [joined, setJoined] = useState(false);

  const iceServers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    if (!joined) return;

    peerConnectionRef.current = new RTCPeerConnection(iceServers);

    // Setup local stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => peerConnectionRef.current?.addTrack(track, stream));
      })
      .catch((err) => console.error('Error accessing media devices:', err));

    // When remote track received
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE candidate handler
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    // Socket events
    socket.emit('join-room', roomId);

    socket.on('user-joined', async () => {
      if (!peerConnectionRef.current) return;
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
    });

    socket.on('offer', async (offer) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer });
    });

    socket.on('answer', async (answer) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async (candidate) => {
      if (candidate && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    return () => {
      socket.disconnect();
      peerConnectionRef.current?.close();
    };
  }, [joined, roomId]);

  return (
    <div>
      <h2>Interview Room: {roomId}</h2>
      {!joined ? (
        <button onClick={() => setJoined(true)}>Join Room</button>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }} />
          <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;