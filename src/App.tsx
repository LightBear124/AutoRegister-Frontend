import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import FlightDetailPage from './pages/FlightDetailPage';
import RequestPage from './pages/RequestPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/flights"
        element={
          <ProtectedRoute>
            <FlightsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/flights/:id"
        element={
          <ProtectedRoute>
            <FlightDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/request/:id"
        element={
          <ProtectedRoute>
            <RequestPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
