import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from './AuthContext'

const STATS = [
  { num: '10K+', label: 'Athletes' },
  { num: '98%', label: 'Accuracy' },
  { num: '30d', label: 'Results' },
]

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 6 + 4,
}))

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex overflow-hidden">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-16"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #080f1a 60%, #0d1420 100%)' }}>

        {/* Animated particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-brand-500/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Radial glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full translate-x-1/4 translate-y-1/4"
          style={{ background: 'radial-gradient(circle, rgba(2, 132, 199,0.06) 0%, transparent 70%)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Top — Logo */}
        <motion.div className="relative flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: '2px solid rgba(14, 165, 233, 0.6)',
              boxShadow: '0 0 30px rgba(14, 165, 233, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
            }}>
            {/* Brushes texture overlay */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 2px)' }} />
            <Zap className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" fill="currentColor" />
          </div>
          <span className="font-display text-2xl tracking-[0.25em] text-[#e0f2fe] drop-shadow-[0_0_10px_rgba(14, 165, 233,0.5)] border-b-2 border-brand-500 pb-1">FITSENSE</span>
        </motion.div>

        {/* Middle — Hero text */}
        <div className="relative space-y-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="section-label text-brand-400">AI-Powered Fitness</span>
            </div>
            <h1 className="font-display text-[80px] leading-[0.9] text-white tracking-wider">
              TRANS<br />
              <span className="text-gradient-brand">FORM</span><br />
              YOUR<br />
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}>BODY.</span>
            </h1>
          </motion.div>
          <motion.p
            className="font-body text-white/45 text-lg max-w-xs leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            Personalized plans. Discipline tracking. Real results.
            No excuses — just relentless progress.
          </motion.p>
        </div>

        {/* Bottom — Stats */}
        <motion.div className="relative flex gap-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <div className="font-display text-4xl text-gradient-brand">{num}</div>
              <div className="font-body text-white/35 text-sm mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233,0.04) 0%, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
          className="w-full max-w-md relative">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-12 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display text-3xl tracking-[0.25em] text-[#e0f2fe] drop-shadow-[0_0_15px_rgba(14, 165, 233,0.6)]">FITSENSE</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-5xl text-white tracking-wide mb-2">WELCOME<br />BACK</h2>
            <p className="font-body text-white/40 text-sm">Sign in to continue your transformation journey</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl font-body text-red-300 text-sm flex items-start gap-3"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="mt-0.5">⚠</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="section-label block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="input-premium w-full pl-12 pr-4 py-4 text-sm" />
              </div>
            </div>

            <div>
              <label className="section-label block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="input-premium w-full pl-12 pr-12 py-4 text-sm" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="btn-brand w-full py-4 text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="font-body text-white/35 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
