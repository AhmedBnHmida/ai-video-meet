import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const InterviewMeeting: React.FC = () => {
  const { roomId } = useParams();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadJitsi = () => {
      if (!window.JitsiMeetExternalAPI || !roomId) {
        alert("Jitsi API not loaded or Room ID is missing");
        return;
      }

      const domain = 'meet.jit.si';
      const options = {
        roomName: roomId,
        width: '100%',
        height: 600,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Guest',
        },
        configOverwrite: {
          disableDeepLinking: true,
          prejoinPageEnabled: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      return () => api.dispose();
    };

    loadJitsi();
  }, [roomId]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📡 Live Interview Room</h2>
      <div ref={jitsiContainerRef} style={{ width: '100%', height: '600px' }} />
    </div>
  );
};

export default InterviewMeeting;
