// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InterviewRoom from './components/InterviewRoom';
import { useParams } from 'react-router-dom';
import InterviewManager from './components/InterviewManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InterviewManager />} />
        <Route path="/room/:roomId" element={<InterviewRoomWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrapper to pass roomId from URL params
const InterviewRoomWrapper: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return <InterviewRoom roomId={roomId || 'default-room'} />;
};

export default App;