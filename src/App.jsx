import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage';
import { ExamResults } from './pages/ExamResults';
import { CreateExam } from './pages/CreateExam';
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './pages/components/ProtectedRoute';
import { Navbar } from './pages/components/Navbar';
import { ExamRoom } from './pages/ExamRoom';
import { Review } from './pages/Review';
import { LobbyPage } from './pages/LobbyPage';
import { JoinExam } from './pages/JoinExam';
import { HostResults } from './pages/HostResults';
import { useLocation } from 'react-router-dom';
import { ExplorePage } from './pages/ExplorePage';
function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/exam/') || location.pathname === '/login';
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ProtectedRoute><ExamResults /></ProtectedRoute>} />
        <Route path="/create-exam" element={<ProtectedRoute><CreateExam /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/exam/:roomCode" element={<ProtectedRoute><ExamRoom /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/lobby/:roomCode" element={<ProtectedRoute><LobbyPage /></ProtectedRoute>} />
        <Route path="/join" element={<ProtectedRoute><JoinExam /></ProtectedRoute>} />
        <Route path="/host-results/:roomCode/:participantName" element={<ProtectedRoute><HostResults /></ProtectedRoute>} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </>
  )
}

export default App
