import { motion } from 'framer-motion'

// ─── Animated Full Body AI Bot SVG ────────────────────────────────────────────
// size: 'sm' (36px max-h) | 'md' (54px max-h) | 'lg' (70px max-h)
// bounce: true = floating bounce animation
// glow: true = neon glow ring

export default function AIBotAvatar({ size = 'md', bounce = false, glow = false }) {
  const h = size === 'sm' ? 36 : size === 'lg' ? 76 : 54
  const w = h * (56 / 70) // maintain strict aspect ratio of 56w:70h

  const bounceAnim = bounce
    ? { y: [0, -6, 0], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }
    : {}

  const glowStyle = glow
    ? { filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.8)) drop-shadow(0 0 16px rgba(14,165,233,0.4))' }
    : { filter: 'drop-shadow(0 0 3px rgba(14,165,233,0.5))' }

  return (
    <motion.div
      animate={bounceAnim}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: w, height: h }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 56 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ ...glowStyle, position: 'absolute' }}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="70">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1f35" />
            <stop offset="100%" stopColor="#061020" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* ── Antenna ── */}
        <rect x="27.25" y="2" width="1.5" height="8" fill="#0ea5e9" />
        <motion.circle cx="28" cy="2" r="2.5" fill="#7dd3fc"
          animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />

        {/* ── Head ── */}
        <rect x="14" y="10" width="28" height="22" rx="6" fill="url(#bodyGrad)" />
        {/* Ears */}
        <rect x="12" y="17" width="2" height="8" rx="1" fill="#0369a1" />
        <rect x="42" y="17" width="2" height="8" rx="1" fill="#0369a1" />
        
        {/* Face plate */}
        <rect x="17" y="14" width="22" height="14" rx="4" fill="url(#faceGrad)" stroke="rgba(14,165,233,0.5)" strokeWidth="1" />
        
        {/* Eyes (glowing) */}
        <rect x="20" y="17" width="5" height="4" rx="2" fill="url(#eyeGlow)" />
        <rect x="31" y="17" width="5" height="4" rx="2" fill="url(#eyeGlow)" />
        
        {/* Eye blinking overlay (Blinking animation) */}
        <motion.rect x="18" y="15" width="20" height="0" fill="#061020"
          animate={{ height: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4, repeatDelay: 1.5, ease: 'easeInOut' }} />

        {/* Mouth speaker */}
        <line x1="25" y1="24" x2="31" y2="24" stroke="rgba(14,165,233,0.8)" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── Neck ── */}
        <rect x="24.5" y="32" width="7" height="4" fill="#0369a1" />

        {/* ── Torso ── */}
        <rect x="18" y="36" width="20" height="15" rx="5" fill="url(#bodyGrad)" />
        
        {/* Chest reactor */}
        <circle cx="28" cy="43.5" r="4.5" fill="#061020" stroke="rgba(14,165,233,0.6)" strokeWidth="1" />
        <motion.circle cx="28" cy="43.5" r="2.5" fill="#38bdf8"
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} />

        {/* ── Arms (Floating independently) ── */}
        {/* Left Arm */}
        <motion.rect x="11.5" y="38" width="5" height="14" rx="2.5" fill="url(#bodyGrad)"
          animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} />
        {/* Right Arm */}
        <motion.rect x="39.5" y="38" width="5" height="14" rx="2.5" fill="url(#bodyGrad)"
          animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4 }} />

        {/* ── Base / Pelvis ── */}
        <rect x="22" y="51" width="12" height="5" rx="2" fill="#0369a1" />

        {/* ── Thruster Flame (Animated) ── */}
        <motion.path d="M23 56 L33 56 L28 68 Z" fill="#38bdf8" opacity="0.8" style={{ transformOrigin: '50% 56px' }}
          animate={{ scaleY: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }} />
        <motion.path d="M25 56 L31 56 L28 64 Z" fill="#bae6fd" style={{ transformOrigin: '50% 56px' }}
          animate={{ scaleY: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.4, ease: 'easeInOut' }} />
      </svg>
    </motion.div>
  )
}
