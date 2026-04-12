import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './mainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CommentPage from './pages/CommentsPage.jsx';
import AskPage from './pages/AskPage.jsx';
import SubmitPage from './pages/SubmitPage.jsx';
import RecentCommentsPage from './pages/RecentCommentsPage.jsx';
import { AuthProvider } from './context/Authcontext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Page Routes */}
            <Route path="/ask" element={<AskPage />} />
            <Route path="/comments" element={<RecentCommentsPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/user/:userId" element={<ProfilePage />} />
            <Route path="/comments/:postId" element={<CommentPage />} />

            {/* Placeholder/Redirect for missing pages */}
            <Route path="/show" element={<Navigate to="/" replace />} />
            <Route path="/jobs" element={<Navigate to="/" replace />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

