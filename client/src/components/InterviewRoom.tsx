import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useParams } from 'react-router-dom';

const InterviewRoom: React.FC = () => {
  const { roomId } = useParams();
  const callFrameRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null); // Correct use of useState

  useEffect(() => {
    if (!roomId) {
      alert("Room ID is missing");
      return;
    }

    const frame = DailyIframe.createFrame({
      showLeaveButton: true,
      iframeStyle: {
        position: 'relative',
        width: '100%',
        height: '600px',
        border: '0'
      }
    });

    try {
      frame.join({ url: `https://ahmedvideo.daily.co/${roomId}` });
    } catch (err: any) {
      console.error("❌ Failed to join Daily room:", err?.message || JSON.stringify(err));
      if (err?.message.includes("account-missing-payment-method")) {
        setError("This account does not have a valid payment method. Please check your billing.");
      }
    }

    // Ensure frame.iframe() is not null and is of type HTMLIFrameElement before appending
    const iframe = frame.iframe();
    if (containerRef.current && iframe instanceof HTMLIFrameElement) {
      containerRef.current.innerHTML = ''; // Clear previous content
      containerRef.current.appendChild(iframe); // Append the iframe
    } else {
      console.error("❌ Daily iframe is not available or is not an HTMLIFrameElement");
    }

    callFrameRef.current = frame;

    return () => {
      frame.leave().catch((err: any) => {
        console.error("Error while leaving the room:", err?.message || JSON.stringify(err));
      });
    };
  }, [roomId]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📡 Live Interview Room</h2>
      <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default InterviewRoom;
