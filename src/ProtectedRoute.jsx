import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6">
          {/* Animated logo */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: '2.5px solid rgba(14, 165, 233, 0.6)',
              boxShadow: '0 0 40px rgba(14, 165, 233, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
            }}>
            <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 2px)' }} />
            <Zap className="w-8 h-8 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" fill="currentColor" />
          </motion.div>
          {/* Pulsing dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                className="w-2 h-2 rounded-full bg-brand-500"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
            ))}
          </div>
          <p className="font-body text-[#e0f2fe] text-xs tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(14, 165, 233,0.5)]">Loading FitSense</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
