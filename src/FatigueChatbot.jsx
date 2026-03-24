import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Zap, ChevronDown, Database, WifiOff } from 'lucide-react'
import { supabase, isSupabaseConnected } from './supabase'
import { useAuth } from './AuthContext'

// ─── Fatigue Knowledge Base ───────────────────────────────────────────────────

const FATIGUE_RESPONSES = {
  // Greetings
  greet: [
    'hello', 'hi', 'hey', 'what\'s up', 'howdy', 'good morning', 'good evening', 'sup'
  ],

  // Muscle-specific fatigue patterns
  muscles: {
    legs: {
      keywords: ['leg', 'legs', 'quad', 'quads', 'hamstring', 'calf', 'calves', 'thigh', 'knee', 'squat', 'lower body'],
      exercises: [
        '🦵 **Light Leg Day Recovery**',
        '• Bodyweight wall sit (static hold, 30 sec × 3)',
        '• Slow walking lunges (3 × 10 each side)',
        '• Lying hamstring curl with resistance band',
        '• Step-ups on a low platform (3 × 12)',
      ],
      stretches: [
        '🧘 **Leg Stretches**',
        '• Standing quad stretch – 30 sec each leg',
        '• Seated hamstring stretch – 45 sec each',
        '• Standing calf raise + deep calf stretch – 30 sec',
        '• Pigeon pose for hip flexors – 60 sec each side',
        '• Lying figure-4 glute stretch – 45 sec each',
      ],
      tip: '💡 Tip: Apply an ice pack for 15 min after stretching. Hydrate well and consider a magnesium supplement before bed.'
    },
    back: {
      keywords: ['back', 'spine', 'lower back', 'upper back', 'lats', 'traps', 'rhomboid', 'deadlift'],
      exercises: [
        '🏋️ **Light Back Recovery**',
        '• Cat-Cow mobilization (3 × 10 reps)',
        '• Bird-dog holds (3 × 8 each side)',
        '• Dead bug exercise (3 × 8 each side)',
        '• Resistance band pull-aparts (3 × 15)',
      ],
      stretches: [
        '🧘 **Back Stretches**',
        '• Child\'s pose – 60 sec',
        '• Seated spinal twist – 45 sec each side',
        '• Doorway lat stretch – 30 sec each side',
        '• Sphinx pose for lower back – 60 sec',
        '• Thread-the-needle stretch – 45 sec each side',
      ],
      tip: '💡 Tip: Avoid heavy lifting. Use a heating pad on the lower back for 10–15 min to increase blood flow.'
    },
    shoulders: {
      keywords: ['shoulder', 'shoulders', 'rotator', 'delt', 'delts', 'neck', 'traps', 'bench press', 'overhead'],
      exercises: [
        '💪 **Light Shoulder Recovery**',
        '• Pendulum swings (2 × 30 sec each direction)',
        '• Band external rotations (3 × 15)',
        '• Scapular wall slides (3 × 12)',
        '• Dumbbell lateral raises – very light (3 × 15)',
      ],
      stretches: [
        '🧘 **Shoulder Stretches**',
        '• Cross-body shoulder stretch – 45 sec each',
        '• Doorway chest opener – 45 sec',
        '• Neck side tilt stretch – 30 sec each side',
        '• Thread-the-needle on floor – 45 sec each',
        '• Wall pec stretch – 30 sec each side',
      ],
      tip: '💡 Tip: Apply a warm compress and do gentle circular arm swings to restore mobility.'
    },
    chest: {
      keywords: ['chest', 'pec', 'pecs', 'pectoral', 'bench', 'push'],
      exercises: [
        '🫁 **Light Chest Recovery**',
        '• Slow push-ups (half speed) 3 × 8',
        '• Resistance band chest fly (3 × 15)',
        '• Dumbbell pull-over – light (3 × 12)',
        '• Incline push-ups – reduced range (3 × 10)',
      ],
      stretches: [
        '🧘 **Chest Stretches**',
        '• Doorway pec stretch – 45 sec each angle',
        '• Lying chest opener with foam roller – 60 sec',
        '• Clasped-hand chest expansion – 45 sec',
        '• Kneeling thoracic extension – 45 sec',
      ],
      tip: '💡 Tip: Breathe deeply into the chest during stretches. Active recovery with light cardio helps flush lactic acid.'
    },
    arms: {
      keywords: ['arm', 'arms', 'bicep', 'tricep', 'forearm', 'elbow', 'curl', 'extension'],
      exercises: [
        '💪 **Light Arm Recovery**',
        '• Wrist circles and forearm stretches (2 min)',
        '• Light dumbbell hammer curls (3 × 15)',
        '• Tricep rope pushdown – very light (3 × 15)',
        '• Band bicep curl – slow tempo (3 × 12)',
      ],
      stretches: [
        '🧘 **Arm Stretches**',
        '• Overhead tricep stretch – 45 sec each',
        '• Standing bicep wall stretch – 45 sec each',
        '• Wrist flexor stretch – 30 sec each',
        '• Wrist extensor stretch – 30 sec each',
        '• Prayer stretch for forearms – 30 sec',
      ],
      tip: '💡 Tip: Cold water immersion for arms helps reduce inflammation. Massage with a foam roller or lacrosse ball.'
    },
    core: {
      keywords: ['core', 'abs', 'abdominal', 'stomach', 'oblique', 'plank', 'crunch', 'midsection'],
      exercises: [
        '🏋️ **Light Core Recovery**',
        '• Dead bug (slow) – 3 × 8 each side',
        '• Pallof press with band – 3 × 12 each',
        '• Bird-dog – 3 × 10 each side',
        '• Slow heel taps – 3 × 15',
      ],
      stretches: [
        '🧘 **Core Stretches**',
        '• Cobra stretch – 45 sec',
        '• Lying torso twist – 45 sec each side',
        '• Side-lying quadratus lumborum stretch – 30 sec each',
        '• Cat-cow – 10 slow reps',
      ],
      tip: '💡 Tip: Avoid sit-ups while sore. Diaphragmatic breathing (belly breathing) actively relaxes tight core muscles.'
    }
  },

  // Whole body / general fatigue
  general: {
    exercises: [
      '🏃 **Full Body Active Recovery**',
      '• 10–15 min brisk walk or light cycling',
      '• Bodyweight flow: squat → lunge → hip hinge (3 rounds)',
      '• Slow jumping jacks – 3 × 20',
      '• Resistance band full-body circuit (pull-apart, squat, row)',
    ],
    stretches: [
      '🧘 **Full Body Stretching Routine (15 min)**',
      '• Sun salutation flow – 5 slow rounds',
      '• World\'s greatest stretch – 30 sec each side',
      '• Standing forward fold – 60 sec',
      '• Seated spinal twist – 45 sec each side',
      '• Pigeon pose – 60 sec each side',
      '• Lying figure-4 – 45 sec each side',
      '• Happy baby pose – 60 sec',
    ],
    tip: '💡 Tip: Prioritize sleep (7–9 hrs), protein intake & hydration. Consider a contrast shower (hot/cold) for recovery.'
  },

  // Energy / tiredness
  energy: {
    keywords: ['tired', 'exhausted', 'fatigue', 'energy', 'no energy', 'drained', 'sluggish', 'worn out', 'burnt out', 'can\'t move'],
    response: [
      '⚡ **You\'re Fatigued — Let\'s Recover Smart**',
      '',
      '**Low-intensity movement (pick 1-2):**',
      '• 10 min slow walk outside (sunlight helps reset cortisol)',
      '• Gentle yoga or mobility flow (15 min)',
      '• Swimming at an easy pace (20 min)',
      '',
      '**Energizing stretches:**',
      '• Full-body sun salutation – 5 rounds',
      '• Standing backbend – 30 sec × 3',
      '• Hip flexor lunge stretch – 60 sec each side',
      '• Neck rolls to release tension – 1 min',
      '',
      '💡 Tip: Eat a banana + peanut butter before movement. Avoid caffeine; try deep box breathing (4-4-4-4) to reset your nervous system.',
    ]
  },

  // DOMS (Delayed Onset Muscle Soreness)
  doms: {
    keywords: ['sore', 'doms', 'pain', 'aching', 'stiff', 'sore muscles', 'muscle pain', 'hurts', 'burning'],
    response: [
      '🔥 **DOMS (Muscle Soreness) Recovery Plan**',
      '',
      '**Light movement to reduce soreness:**',
      '• 10 min easy walk or cycling',
      '• Foam rolling affected areas (60 sec per muscle group)',
      '• Light band exercises for blood flow',
      '',
      '**Targeted stretches:**',
      '• Slow cat-cow – 2 min',
      '• Global stretch routine (child\'s pose → cobra → pigeon)',
      '• Gentle static stretching (hold 45–60 sec)',
      '',
      '💡 Tip: Ice bath (10 min at ~15°C) or contrast showers accelerate DOMS recovery. Omega-3s and tart cherry juice are evidence-based anti-inflammatory aids.',
    ]
  },

  // Help / what can you do
  help: {
    keywords: ['help', 'what can you do', 'how does this work', 'options', 'commands'],
    response: [
      '🤖 **FitSense Fatigue Chatbot — I Can Help With:**',
      '',
      '• **Specific Muscle Fatigue** – e.g., "my legs are sore" → I\'ll suggest recovery exercises & stretches',
      '• **General Fatigue** – e.g., "I\'m completely exhausted" → full-body recovery plan',
      '• **DOMS** – e.g., "I\'m super sore after yesterday\'s workout"',
      '• **Low Energy** – e.g., "I have no energy today"',
      '',
      'Try asking me something like:',
      '• *"My back is killing me after deadlifts"*',
      '• *"I feel drained and tired"*',
      '• *"Shoulder fatigue from overhead press"*',
    ]
  }
}

// ─── AI Response Engine ───────────────────────────────────────────────────────

function generateResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim()

  // Greeting
  if (FATIGUE_RESPONSES.greet.some(g => msg.includes(g))) {
    return [
      '👋 Hey! I\'m your FitSense Recovery Bot.',
      '',
      'Tell me where you\'re feeling fatigue or soreness, and I\'ll recommend the best recovery exercises and stretches for you!',
      '',
      'For example: *"My legs are sore"* or *"I feel totally exhausted"*',
    ].join('\n')
  }

  // Help
  if (FATIGUE_RESPONSES.help.keywords.some(k => msg.includes(k))) {
    return FATIGUE_RESPONSES.help.response.join('\n')
  }

  // DOMS / general soreness
  if (FATIGUE_RESPONSES.doms.keywords.some(k => msg.includes(k)) && !hasMuscleMatch(msg)) {
    return FATIGUE_RESPONSES.doms.response.join('\n')
  }

  // Energy / tiredness
  if (FATIGUE_RESPONSES.energy.keywords.some(k => msg.includes(k)) && !hasMuscleMatch(msg)) {
    return FATIGUE_RESPONSES.energy.response.join('\n')
  }

  // Muscle-specific matches
  for (const [key, data] of Object.entries(FATIGUE_RESPONSES.muscles)) {
    if (data.keywords.some(k => msg.includes(k))) {
      const lines = [
        `I can see you're dealing with **${key} fatigue**. Here's your personalized recovery plan! 💪`,
        '',
        ...data.exercises,
        '',
        ...data.stretches,
        '',
        data.tip
      ]
      return lines.join('\n')
    }
  }

  // General fatigue fallback
  if (msg.includes('fatigue') || msg.includes('recover') || msg.includes('workout') || msg.includes('gym') || msg.includes('exercise')) {
    const lines = [
      '💪 Here\'s a general active recovery plan for you:',
      '',
      ...FATIGUE_RESPONSES.general.exercises,
      '',
      ...FATIGUE_RESPONSES.general.stretches,
      '',
      FATIGUE_RESPONSES.general.tip
    ]
    return lines.join('\n')
  }

  // Default fallback
  return [
    'I specialize in fatigue recovery! 🏋️',
    '',
    'Try telling me:',
    '• Which muscles are sore (e.g., "my legs hurt")',
    '• How you\'re feeling (e.g., "I\'m exhausted")',
    '• Or type **help** to see what I can do!',
  ].join('\n')
}

function hasMuscleMatch(msg) {
  return Object.values(FATIGUE_RESPONSES.muscles).some(data =>
    data.keywords.some(k => msg.includes(k))
  )
}

// ─── Message Renderer (supports basic markdown) ───────────────────────────────

function renderMessage(text) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    return (
      <span key={i} className="block" style={{ marginBottom: line === '' ? '6px' : '1px' }}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} style={{ color: '#38bdf8' }}>{part.slice(2, -2)}</strong>
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={j} style={{ color: 'rgba(255,255,255,0.7)' }}>{part.slice(1, -1)}</em>
          }
          return <span key={j}>{part}</span>
        })}
      </span>
    )
  })
}

// ─── Quick Action Chips ───────────────────────────────────────────────────────

const QUICK_CHIPS = [
  { label: '🦵 Leg fatigue', msg: 'My legs are very sore after squats' },
  { label: '💪 Shoulder pain', msg: 'My shoulders are fatigued from overhead press' },
  { label: '🔙 Back soreness', msg: 'My lower back is sore after deadlifts' },
  { label: '⚡ Low energy', msg: 'I feel completely drained and exhausted' },
  { label: '🫁 Chest DOMS', msg: 'My chest is sore after bench press' },
  { label: '🏋️ General recovery', msg: 'I am fatigued from my workout, need a full recovery plan' },
]

// ─── Main Chatbot Component ───────────────────────────────────────────────────

const WELCOME_MSG = {
  id: 'welcome',
  role: 'bot',
  text: '👋 Hi! I\'m your **FitSense Recovery Bot**.\n\nTell me about your fatigue or muscle soreness and I\'ll give you a personalized recovery plan with exercises and stretches!\n\nOr tap one of the quick options below. 👇',
  time: new Date()
}

export default function FatigueChatbot() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const [dbStatus, setDbStatus] = useState('idle') // 'idle' | 'connected' | 'local'
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // ─── Load chat history from Supabase when panel first opens ───────────────
  const loadHistory = useCallback(async () => {
    if (historyLoaded || !user) return
    setHistoryLoaded(true)

    if (!isSupabaseConnected) {
      setDbStatus('local')
      return
    }

    try {
      const { data, error } = await supabase
        .from('fatigue_chat_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(30)

      if (error) throw error

      if (data && data.length > 0) {
        const loaded = data.map(row => ({
          id: row.id,
          role: row.role,
          text: row.message,
          time: new Date(row.created_at)
        }))
        setMessages([WELCOME_MSG, ...loaded])
        setShowChips(false)
      }
      setDbStatus('connected')
    } catch (err) {
      console.warn('[FitSense Chatbot] Could not load history:', err.message)
      setDbStatus('local')
    }
  }, [user, historyLoaded])

  // ─── Persist a single message to Supabase ─────────────────────────────────
  const persistMessage = useCallback(async (role, text) => {
    if (!isSupabaseConnected || !user) return
    try {
      await supabase.from('fatigue_chat_logs').insert({
        user_id: user.id,
        role,
        message: text
      })
    } catch (err) {
      console.warn('[FitSense Chatbot] Could not save message:', err.message)
    }
  }, [user])

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, typing])

  useEffect(() => {
    if (open) {
      loadHistory()
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, loadHistory])

  const sendMessage = (text) => {
    const messageText = text || input.trim()
    if (!messageText) return

    const userMsg = { id: Date.now(), role: 'user', text: messageText, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setShowChips(false)

    // Persist user message
    persistMessage('user', messageText)

    // Simulate bot "thinking" delay
    setTimeout(() => {
      const botResponse = generateResponse(messageText)
      const botMsg = { id: Date.now() + 1, role: 'bot', text: botResponse, time: new Date() }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
      // Persist bot response
      persistMessage('bot', botResponse)
    }, 900 + Math.random() * 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="fatigue-chatbot-toggle"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{
          background: open
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          boxShadow: open
            ? '0 0 30px rgba(239,68,68,0.45), 0 8px 25px rgba(0,0,0,0.4)'
            : '0 0 30px rgba(14,165,233,0.45), 0 8px 25px rgba(0,0,0,0.4)'
        }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification Dot when closed */}
      {!open && (
        <motion.div
          className="fixed bottom-[70px] right-6 z-50 w-3 h-3 rounded-full bg-green-400"
          style={{ boxShadow: '0 0 8px rgba(74,222,128,0.7)' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="fatigue-chatbot-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-3xl overflow-hidden"
            style={{
              width: '380px',
              maxWidth: 'calc(100vw - 24px)',
              height: '580px',
              maxHeight: 'calc(100vh - 120px)',
              background: 'linear-gradient(180deg, #0a1220 0%, #080f1a 100%)',
              border: '1px solid rgba(14,165,233,0.2)',
              boxShadow: '0 0 60px rgba(14,165,233,0.12), 0 30px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 py-4 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(2,132,199,0.06))',
                borderBottom: '1px solid rgba(14,165,233,0.15)'
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}>
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">Recovery Bot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"
                    style={{ boxShadow: '0 0 6px rgba(74,222,128,0.7)' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Fatigue &amp; Recovery Specialist</span>
                  {dbStatus === 'connected' && (
                    <span className="flex items-center gap-1 text-xs ml-1" style={{ color: 'rgba(74,222,128,0.8)' }}>
                      <Database className="w-2.5 h-2.5" /> Synced
                    </span>
                  )}
                  {dbStatus === 'local' && (
                    <span className="flex items-center gap-1 text-xs ml-1" style={{ color: 'rgba(255,180,0,0.7)' }}>
                      <WifiOff className="w-2.5 h-2.5" /> Local
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === 'user' ? 'bg-gradient-to-br from-sky-500 to-blue-600' : 'bg-gradient-to-br from-sky-600 to-cyan-500'}`}
                    style={{ boxShadow: '0 0 10px rgba(14,165,233,0.3)' }}>
                    {msg.role === 'user'
                      ? <User className="w-3.5 h-3.5 text-white" />
                      : <Bot className="w-3.5 h-3.5 text-white" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div
                      className="px-3.5 py-3 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, rgba(14,165,233,0.25), rgba(2,132,199,0.2))'
                          : 'rgba(255,255,255,0.05)',
                        border: msg.role === 'user'
                          ? '1px solid rgba(14,165,233,0.3)'
                          : '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.88)',
                        fontFamily: 'DM Sans, sans-serif',
                        borderTopRightRadius: msg.role === 'user' ? '6px' : '18px',
                        borderTopLeftRadius: msg.role === 'user' ? '18px' : '6px',
                      }}
                    >
                      {renderMessage(msg.text)}
                    </div>
                    <span className="text-xs px-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {formatTime(msg.time)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2.5 flex-row"
                >
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-600 to-cyan-500"
                    style={{ boxShadow: '0 0 10px rgba(14,165,233,0.3)' }}>
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-sky-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <AnimatePresence>
              {showChips && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-shrink-0 px-3 pb-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-xs px-1 pt-2 pb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Quick options</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_CHIPS.map((chip) => (
                      <motion.button
                        key={chip.label}
                        onClick={() => sendMessage(chip.msg)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap"
                        style={{
                          background: 'rgba(14,165,233,0.08)',
                          border: '1px solid rgba(14,165,233,0.2)',
                          color: '#38bdf8',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                        whileHover={{ scale: 1.04, background: 'rgba(14,165,233,0.15)' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {chip.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="flex-shrink-0 p-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  id="fatigue-chatbot-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your fatigue or soreness..."
                  rows={1}
                  className="flex-1 resize-none input-premium px-4 py-3 text-sm"
                  style={{
                    minHeight: '44px',
                    maxHeight: '100px',
                    lineHeight: '1.4',
                    fontFamily: 'DM Sans, sans-serif',
                    overflowY: 'auto'
                  }}
                  onInput={e => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
                  }}
                />
                <motion.button
                  id="fatigue-chatbot-send"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || typing}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: input.trim() && !typing
                      ? 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                      : 'rgba(255,255,255,0.06)',
                    boxShadow: input.trim() && !typing ? '0 0 20px rgba(14,165,233,0.4)' : 'none',
                    color: input.trim() && !typing ? 'white' : 'rgba(255,255,255,0.2)',
                    cursor: input.trim() && !typing ? 'pointer' : 'not-allowed'
                  }}
                  whileHover={input.trim() && !typing ? { scale: 1.06 } : {}}
                  whileTap={input.trim() && !typing ? { scale: 0.94 } : {}}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
                Powered by FitSense AI · Recovery & Wellness
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
