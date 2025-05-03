import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// Lazy load the components
const InterviewManager = React.lazy(() => import('./Hr/InterviewManager'));
const InterviewRoom = React.lazy(() => import('./components/InterviewRoom'));

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute'; 
import Register from './Auth/Register';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import Home from './components/Home'; 
import HomeUser from './Candidate/homeUser';
import AddInterviewForm from './Hr/AddInterviewForm';
import EditInterviewForm from './Hr/EditInterviewForm';
import ApplicationManager from './Hr/ApplicationManager';
import MyApplications from './Candidate/MyApplications';
import Header from './components/Header';
import MyInterviews from './Candidate/MyInterviews';
import InterviewDetail from './Candidate/InterviewDetail';
import InterviewMeeting from './components/InterviewMeeting';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected Routes - Use PrivateRoute for these */}
          <Route path="/manage" element={<PrivateRoute element={<InterviewManager />} />} />
          
          <Route path="/addInterview" element={<PrivateRoute element={<AddInterviewForm />} />} />
          <Route path="/editInterview/:id" element={<PrivateRoute element={<EditInterviewForm />} />} />
          <Route path="/HomeHR" element={<PrivateRoute element={<ApplicationManager />} />} />

      
          {/* Candidate Routes */}  
          <Route path="/HomeUser" element={<PrivateRoute element={<HomeUser />} />} />
          <Route path="/my-applications" element={<PrivateRoute element={<MyApplications />} />} />
          <Route path="/my-interviews" element={<PrivateRoute element={<MyInterviews />} />} />
          <Route path="/interview/:id" element={<PrivateRoute element={<InterviewDetail />} />} />



          {/* Interview Meeting Route - This should be protected */}
          <Route path="/meeting/:roomId" element={<PrivateRoute element={<InterviewMeeting />} />} />
          <Route path="/room/:roomId" element={<PrivateRoute element={<InterviewRoom />} />} />

          {/* Optional: A default route or a 404 route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
/*
// Wrapper to pass roomId from URL params
const InterviewRoomWrapper: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return <InterviewRoom roomId={roomId || 'default-room'} />;
};
*/
export default App;
