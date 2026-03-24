import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, LayoutDashboard, Utensils, Dumbbell, CheckSquare, TrendingUp, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from './AuthContext'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Utensils, label: 'Diet Plan', path: '/diet' },
  { icon: Dumbbell, label: 'Transformation', path: '/transformation' },
  { icon: CheckSquare, label: 'Daily Tracker', path: '/tracker' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: User, label: 'Profile', path: '/profile' },
]

function SidebarContent({ onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="flex flex-col h-full py-6">
      {/* Logo */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: '1.5px solid rgba(14, 165, 233, 0.5)',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}>
            <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 2px)' }} />
            <Zap className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" fill="currentColor" />
          </div>
          <span className="font-display text-xl tracking-[0.25em] text-[#e0f2fe] drop-shadow-[0_0_10px_rgba(14, 165, 233,0.5)] border-b-2 border-brand-500 pb-1">FITSENSE</span>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 mb-3">
        <span className="section-label">Navigation</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`nav-item ${active ? 'active' : ''}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-dot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div className="px-3 mt-4">
        <div className="rounded-2xl p-4 mb-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-body font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233,0.3), rgba(2, 132, 199,0.2))' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-white text-sm font-semibold truncate leading-tight">
                {user?.user_metadata?.full_name || 'Athlete'}
              </p>
              <p className="font-body text-white/30 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-body text-xs text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const logoColor = 'linear-gradient(135deg, #0ea5e9, #0284c7)'

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-40"
        style={{
          background: 'linear-gradient(180deg, #0a1220 0%, #080f1a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}>
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233,0.06) 0%, transparent 70%)' }} />
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(8,15,26,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: logoColor }}>
            <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
          </div>
          <span className="font-display text-xl tracking-[0.25em] text-[#e0f2fe] drop-shadow-[0_0_10px_rgba(14, 165, 233,0.5)]">FITSENSE</span>
        </div>
        <button onClick={() => setMobileOpen(true)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Menu className="w-4 h-4" />
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64"
              style={{
                background: 'linear-gradient(180deg, #0a1220 0%, #080f1a 100%)',
                borderRight: '1px solid rgba(255,255,255,0.06)'
              }}>
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X className="w-4 h-4" />
              </button>
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
