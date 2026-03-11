import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import './App.css'

/* ── Static data ── */
const ORBS = [
  { size: 600, x: '-5%',  y: '-10%', dur: 14, delay: 0   },
  { size: 450, x: '70%',  y: '5%',   dur: 18, delay: 2   },
  { size: 350, x: '35%',  y: '50%',  dur: 11, delay: 1   },
  { size: 400, x: '85%',  y: '55%',  dur: 20, delay: 3   },
  { size: 280, x: '-2%',  y: '65%',  dur: 9,  delay: 1.5 },
]

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:  `${(i * 4.7 + 3) % 100}%`,
  top:   `${(i * 7.3 + 8) % 100}%`,
  size:  (i % 3) * 2 + 3,
  dur:   3 + (i % 4),
  delay: (i * 0.28) % 3,
}))

const STEPS = [
  { id: 1, jsx: <>Tap <strong>Download APK</strong> and wait for the file to save to your device.</> },
  { id: 2, jsx: <>Go to <strong>Settings → Security</strong> and enable <em>Install from unknown sources</em>.</> },
  { id: 3, jsx: <>Open the downloaded <strong>.apk</strong> file from your Downloads folder.</> },
  { id: 4, jsx: <>Tap <strong>Install</strong> and launch the app to get started.</> },
]

/* ── Step row component ── */
function Step({ step, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  return (
    <motion.div
      ref={ref}
      className="step-item"
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ type: 'spring', stiffness: 180, damping: 22, delay }}
    >
      <motion.div
        className="step-num"
        whileHover={{ scale: 1.25, rotate: 360, backgroundColor: '#c0392b', borderColor: '#c0392b' }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        {step.id}
      </motion.div>
      <span className="step-text">{step.jsx}</span>
    </motion.div>
  )
}

/* ── Main App ── */
export default function App() {
  const [phase, setPhase]       = useState('idle')   // idle | downloading | done
  const [progress, setProgress] = useState(0)
  const [ripples, setRipples]   = useState([])

  const handleDownload = (e) => {
    if (phase !== 'idle') return

    /* Ripple effect */
    const rect = e.currentTarget.getBoundingClientRect()
    const id   = Date.now()
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)

    setPhase('downloading')
    setProgress(0)

    /* Simulated progress */
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 8 + 3
      if (p >= 100) {
        clearInterval(iv)
        setProgress(100)
        setTimeout(() => setPhase('done'), 400)
      } else {
        setProgress(Math.round(p))
      }
    }, 120)

    /* Trigger actual APK download */
    const a  = document.createElement('a')
    a.href   = `${import.meta.env.BASE_URL}amrita-placement-tracker.apk`
    a.download = 'amrita-placement-tracker.apk'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="app">

      {/* ══ Animated background ══ */}
      <div className="bg-layer" aria-hidden="true">
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="orb"
            style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
            animate={{ x: [0, 40, -25, 0], y: [0, -50, 25, 0], scale: [1, 1.08, 0.95, 1] }}
            transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: orb.delay, repeatType: 'mirror' }}
          />
        ))}
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className="particle"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [0, -160, 0], opacity: [0, 0.75, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut', repeatType: 'mirror' }}
          />
        ))}
      </div>

      {/* ══ Hero ══ */}
      <section className="hero">
        {/* Badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 22 }}
        >
          <span className="badge-dot" />
          Placement Tracker App
        </motion.div>

        {/* Animated letter-by-letter title */}
        <div className="hero-title-wrap" aria-label="AMRITA">
          {'AMRITA'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="hero-char"
              initial={{ opacity: 0, y: 70, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Sub-title with shimmer gradient */}
        <motion.div
          className="hero-subtitle"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          PLACEMENT TRACKER
        </motion.div>

        <motion.p
          className="hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Track placements, company drives &amp; offer letters —<br />
          right from your Android device.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <motion.div
            className="scroll-line"
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ══ Download card ══ */}
      <main className="main-content">
        <motion.div
          className="download-card"
          initial={{ opacity: 0, y: 90, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.012, boxShadow: '0 52px 130px rgba(139,26,26,0.38), 0 0 0 1px rgba(255,255,255,0.13)', transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] } }}
        >
          {/* Animated top glow border */}
          <div className="card-top-glow" />

          {/* Floating app icon */}
          <motion.div
            className="app-icon-wrap"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
          >
            <motion.div
              className="app-icon"
              whileHover={{ scale: 1.12, rotate: [0, -8, 8, -4, 0] }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <svg viewBox="0 0 24 24" fill="white" width={46} height={46}>
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
              </svg>
            </motion.div>
            {/* Triple pulse rings */}
            {[1, 2, 3].map(n => (
              <motion.div
                key={n}
                className="icon-ring"
            animate={{ scale: [1, 1.45 + n * 0.28], opacity: [0.5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: n * 0.5, ease: 'easeOut', repeatType: 'loop' }}
              />
            ))}
          </motion.div>

          {/* Card text content */}
          <motion.h2 className="card-title"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            Amrita Placement Tracker
          </motion.h2>

          <motion.span className="version-tag"
            initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.75 }}>
            Android APK · v1.0.0
          </motion.span>

          <motion.p className="card-desc"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
            Track placement drives, company visits, and offer letters for Amrita Vishwa Vidyapeetham students.
            Stay updated on every recruitment event, anytime, anywhere.
          </motion.p>

          {/* ── Download button ── */}
          <motion.div className="btn-area"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.95, type: 'spring', stiffness: 200, damping: 20 }}>

            <motion.button
              className={`btn-download ${phase}`}
              onClick={handleDownload}
              whileHover={phase === 'idle' ? {
                scale: 1.04,
                boxShadow: '0 0 55px rgba(192,57,43,0.8), 0 14px 44px rgba(139,26,26,0.6)',
                transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
              } : {}}
              whileTap={phase === 'idle' ? { scale: 0.97, transition: { duration: 0.15 } } : {}}
            >
              {/* Click ripples */}
              {ripples.map(r => (
                <motion.span
                  key={r.id}
                  className="ripple"
                  style={{ left: r.x, top: r.y }}
                  initial={{ width: 0, height: 0, opacity: 0.55 }}
                  animate={{ width: 540, height: 540, opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              ))}

              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.span key="idle" className="btn-inner"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
                      <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v6h5.66V9h3.84L12 2z"/>
                    </svg>
                    Download APK
                  </motion.span>
                )}
                {phase === 'downloading' && (
                  <motion.span key="loading" className="btn-inner"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                      width={20} height={20}
                      animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}>
                      <circle cx={12} cy={12} r={10} strokeOpacity={0.22} />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </motion.svg>
                    Downloading… {progress}%
                  </motion.span>
                )}
                {phase === 'done' && (
                  <motion.span key="done" className="btn-inner"
                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8}
                      strokeLinecap="round" width={20} height={20}>
                      <motion.path d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45 }} />
                    </svg>
                    Downloaded!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Progress bar */}
            <AnimatePresence>
              {phase === 'downloading' && (
                <motion.div className="progress-wrap"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}>
                  <div className="progress-track">
                    <motion.div className="progress-fill"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.3 }} />
                    <motion.div className="progress-shimmer"
                      animate={{ x: ['-100%', '300%'] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }} />
                  </div>
                  <p className="progress-label">{progress}% complete</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Download again */}
            {phase === 'done' && (
              <motion.button className="btn-again"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { setPhase('idle'); setProgress(0) }}>
                Download Again
              </motion.button>
            )}
          </motion.div>

          {/* Thank you banner */}
          <AnimatePresence>
            {phase === 'done' && (
              <motion.div className="thankyou-banner"
                initial={{ opacity: 0, y: 28, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 190, delay: 0.25 }}>
                <motion.div className="ty-icon"
                  initial={{ scale: 0, rotate: -160 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.45 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}
                    strokeLinecap="round" width={16} height={16}>
                    <motion.path d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }} />
                  </svg>
                </motion.div>
                <div>
                  <strong>Thank you for downloading!</strong>
                  <p>Your download has started. We hope you enjoy the Amrita Placement Tracker experience on your mobile device.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Installation steps */}
          <div className="steps-section">
            <motion.h4 className="steps-title"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <span className="steps-line" />
              How to Install
              <span className="steps-line" />
            </motion.h4>
            {STEPS.map((step, i) => (
              <Step key={step.id} step={step} delay={1.3 + i * 0.13} />
            ))}
          </div>
        </motion.div>
      </main>

      {/* ══ Footer ══ */}
      <motion.footer className="footer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
        <span>© 2026 Amrita Vishwa Vidyapeetham, Ettimadai, Coimbatore – 641112</span>
        <span className="ft-dot" />
        <a href="#">Privacy Policy</a>
        <span className="ft-dot" />
        <a href="#">Contact IT Support</a>
      </motion.footer>

    </div>
  )
}
