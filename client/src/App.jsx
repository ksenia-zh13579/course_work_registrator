import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Main from './pages/Main/Main';
import SignIn from './pages/SignIn/SignIn';
import Registration from './pages/Registration/Registration';
import Profile from './pages/Profile/Profile';
import Incidents from './pages/Incidents/Incidents';
import Involvements from './pages/Involvements/Involvements';
import Participants from './pages/Participants/Participants';
import './styles/global.scss';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Загрузка приложения...
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/involvements" element={<Involvements />} />
          <Route
            path="/participants"
            element={
              <ProtectedRoute requireAdmin>
                <Participants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
