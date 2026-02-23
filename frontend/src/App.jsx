import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './mainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import ProfilePage from './pages/ProfilePage';
import CommentPage from './pages/CommentsPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Catch all - redirect to home */}
          <Route path="/user/:userId" element={<ProfilePage />} />
          <Route path="/comments/:postId" element={<CommentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
