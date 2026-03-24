import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, User, CheckCircle } from 'lucide-react'
import { useAuth } from './AuthContext'

const PERKS = [
  'AI-personalized workout plans',
  'Smart diet & macro tracking',
  'Discipline score analytics',
  'Real-time progress insights',
]

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { data, error } = await signUp(email, password, fullName)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // If email confirmation is required, show success; otherwise navigate
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists.')
        setLoading(false)
      } else if (data?.session) {
        navigate('/profile-setup')
      } else {
        setSuccess(true)
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <CheckCircle className="w-10 h-10 text-sky-400" />
          </div>
          <h2 className="font-display text-4xl text-white tracking-wide mb-3">CHECK YOUR EMAIL</h2>
          <p className="font-body text-white/50 leading-relaxed">
            We sent a confirmation link to <span className="text-white font-medium">{email}</span>.
            Click it to activate your account and start your transformation.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 mt-8 text-brand-400 hover:text-brand-300 font-body text-sm transition-colors">
            ← Back to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent flex overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-16"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #080f1a 60%, #0d1420 100%)' }}>

        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233,0.08) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div className="relative flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
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
          <span className="font-display text-2xl tracking-[0.25em] text-[#e0f2fe] drop-shadow-[0_0_10px_rgba(14, 165, 233,0.5)] border-b-2 border-brand-500 pb-1">FITSENSE</span>
        </motion.div>

        <div className="relative space-y-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}>
            <h1 className="font-display text-[72px] leading-[0.9] text-white tracking-wider mb-6">
              START YOUR<br />
              <span className="text-gradient-brand">JOURNEY</span><br />
              TODAY.
            </h1>
            <p className="font-body text-white/45 text-base max-w-xs leading-relaxed">
              Join thousands of athletes who've transformed their bodies with FitSense.
            </p>
          </motion.div>

          <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}>
            {PERKS.map((perk, i) => (
              <motion.div key={perk} className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(14, 165, 233,0.15)', border: '1px solid rgba(14, 165, 233,0.2)' }}>
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                </div>
                <span className="font-body text-white/55 text-sm">{perk}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <p className="font-body text-white/25 text-xs">Free forever. No credit card required.</p>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233,0.04) 0%, transparent 70%)' }} />

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
          className="w-full max-w-md relative">

          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                border: '1px solid rgba(14, 165, 233, 0.4)',
              }}>
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display text-3xl tracking-[0.25em] text-[#e0f2fe] drop-shadow-[0_0_15px_rgba(14, 165, 233,0.6)]">FITSENSE</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-5xl text-white tracking-wide mb-2">CREATE<br />ACCOUNT</h2>
            <p className="font-body text-white/40 text-sm">Free forever. Start in seconds.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl font-body text-red-300 text-sm flex items-start gap-3"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="mt-0.5">⚠</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="section-label block mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                  placeholder="John Smith"
                  className="input-premium w-full pl-12 pr-4 py-4 text-sm" />
              </div>
            </div>

            <div>
              <label className="section-label block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="input-premium w-full pl-12 pr-4 py-4 text-sm" />
              </div>
            </div>

            <div>
              <label className="section-label block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min. 6 characters"
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
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="font-body text-white/35 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
