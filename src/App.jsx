import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'

// Pages
import Login from './Login'
import Signup from './Signup'
import ProfileSetup from './ProfileSetup'
import Dashboard from './Dashboard'
import DietPlanner from './DietPlanner'
import Transformation from './Transformation'
import DailyTracker from './DailyTracker'
import Progress from './Progress'
import Profile from './Profile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/profile-setup" element={
            <ProtectedRoute><ProfileSetup /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/diet" element={
            <ProtectedRoute><DietPlanner /></ProtectedRoute>
          } />
          <Route path="/transformation" element={
            <ProtectedRoute><Transformation /></ProtectedRoute>
          } />
          <Route path="/tracker" element={
            <ProtectedRoute><DailyTracker /></ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute><Progress /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
