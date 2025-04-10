import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// Lazy load the components
const InterviewManager = React.lazy(() => import('./components/InterviewManager'));
const InterviewRoom = React.lazy(() => import('./components/InterviewRoom'));

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute'; 
import Register from './Auth/Register';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import Home from './components/Home'; 
import HomeUser from './components/homeUser';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected Routes - Use PrivateRoute for these */}
          <Route path="/manage" element={<PrivateRoute element={<InterviewManager />} />} />
          <Route path="/HomeUser" element={<PrivateRoute element={<HomeUser />} />} />
          <Route path="/room/:roomId" element={<PrivateRoute element={<InterviewRoomWrapper />} />} />
          
          {/* Optional: A default route or a 404 route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Wrapper to pass roomId from URL params
const InterviewRoomWrapper: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return <InterviewRoom roomId={roomId || 'default-room'} />;
};

export default App;
