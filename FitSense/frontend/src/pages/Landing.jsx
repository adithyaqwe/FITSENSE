import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Activity,
  CheckCircle,
  Flame,
  Target,
  Trophy,
  Zap,
  Users
} from "lucide-react";

export default function Landing() {
  return (
    <div style={styles.page}>
      {/* BACKGROUND GLOWS */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={styles.heroContent}
        >
          <div style={styles.badge}>
            <Star size={14} fill="var(--primary)" /> 
            <span style={{color: 'var(--primary)'}}> AI FITNESS PLATFORM</span>
          </div>

          <h1 style={styles.title}>
            Unlock the <span style={styles.accentText}>Ultimate Standard</span>
            <br />
            of Human Performance
          </h1>

          <p style={styles.subtitle}>
            FitSense analyzes your health, injuries, bloodwork and goals to
            engineer the most intelligent fitness system you've ever used.
          </p>

          <div style={styles.ctaRow}>
            <button style={styles.primaryBtn}>
              Start Transformation <ArrowRight size={18} />
            </button>
            <button style={styles.secondaryBtn}>View Success Stories</button>
          </div>
        </motion.div>

        {/* MOCKUP / DASHBOARD PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={styles.dashboardMock}
        >
           {/* Abstract representational UI */}
           <div style={styles.mockHeader}>
              <div style={styles.mockDot} />
              <div style={styles.mockDot} />
              <div style={styles.mockDot} />
           </div>
           <div style={styles.mockBody}>
              <div style={styles.metric}>
                <span>Daily Recovery</span>
                <strong style={{ color: 'var(--primary)' }}>98%</strong>
              </div>
              <div style={styles.barContainer}>
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: '98%' }} 
                   transition={{ delay: 1, duration: 1.5 }}
                   style={styles.barFill} 
                />
              </div>
              
              <div style={{...styles.metric, marginTop: 20}}>
                <span>VO2 Max</span>
                <strong style={{ color: 'var(--primary)' }}>Elite</strong>
              </div>
               <div style={styles.barContainer}>
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: '92%' }} 
                   transition={{ delay: 1.2, duration: 1.5 }}
                   style={styles.barFill} 
                />
              </div>
           </div>
        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" style={styles.section}>
        <h2 style={styles.sectionTitle}>Why FitSense Wins</h2>
        <div style={styles.grid}>
          <Feature 
            icon={<Target color="var(--primary)" />} 
            title="Precision AI" 
            desc="Algorithms that adapt to your daily bio-feedback." 
          />
          <Feature 
            icon={<ShieldCheck color="var(--primary)" />} 
            title="Injury Protocols" 
            desc="Workouts designed to rehab and protect." 
          />
          <Feature 
            icon={<Flame color="var(--primary)" />} 
            title="Metabolic Sync" 
            desc="Matches nutrition to your exact energy output." 
          />
        </div>
      </section>

      {/* HOW IT WORKS / PROCESS */}
      <section id="process" style={styles.processSection}>
        <div style={styles.container}>
            <h2 style={styles.sectionTitle}>The <span style={styles.accentText}>Process</span></h2>
            <div style={styles.processGrid}>
                <ProcessStep 
                    number="01" 
                    title="Analyze" 
                    desc="We ingest your health data, bloodwork, and fitness history." 
                />
                
                <ProcessStep 
                    number="02" 
                    title="Engineer" 
                    desc="AI builds a custom protocol for your specific biology." 
                />
                
                <ProcessStep 
                    number="03" 
                    title="Evolve" 
                    desc="Real-time adjustments based on your daily recovery scores." 
                />
            </div>
        </div>
      </section>

      {/* PRICING */}
      {/* <section id="pricing" style={styles.section}>
        <h2 style={styles.sectionTitle}>Investment</h2>
        <div style={styles.pricingGrid}>
            <PricingCard 
                title="Starter" 
                price="$29" 
                features={["AI Workout Builder", "Basic Nutrition", "Progress Tracking"]} 
            />
            <PricingCard 
                title="Pro Athlete" 
                price="$59" 
                isPopular 
                features={["Everything in Starter", "Bloodwork Analysis", "Recovery Tracking", "1-on-1 Coach Access"]} 
            />
             <PricingCard 
                title="Elite" 
                price="$199" 
                features={["Full Concierge", "Custom Meal Delivery", "DNA Analysis", "24/7 Support"]} 
            />
        </div>
      </section> */}

      {/* TESTIMONIALS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Trusted by High Performers</h2>
        <div style={styles.grid}>
          <Testimonial name="Arjun K." text="I've never felt this dialed in. It's like magic." />
          <Testimonial name="Sarah L." text="Finally, a system that understands my injuries." />
          <Testimonial name="David R." text="The ROI on my energy levels is insane." />
        </div>
      </section>

      {/* FOOTER CTA */}
      {/* <section style={styles.final}>
        <Trophy size={64} color="var(--primary)" />
        <h2 style={styles.sectionTitle}>Join the Top 1%</h2>
        <p style={styles.subtitle}>Your potential is waiting.</p>
        <button style={styles.primaryBtn}>Unlock Pro Plan</button>
      </section> */}
      
    </div>
  );
}

/* SUB-COMPONENTS */

function Feature({ icon, title, desc }) {
  return (
    <motion.div whileHover={{ y: -5 }} style={styles.card}>
      <div style={styles.iconBox}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{desc}</p>
    </motion.div>
  );
}

function ProcessStep({ number, title, desc }) {
    return (
        <div style={styles.step}>
            <span style={styles.stepNum}>{number}</span>
            <h3 style={styles.stepTitle}>{title}</h3>
            <p style={styles.stepDesc}>{desc}</p>
        </div>
    )
}

function PricingCard({ title, price, features, isPopular }) {
    return (
        <motion.div 
            whileHover={{ y: -8 }} 
            style={{
                ...styles.card, 
                border: isPopular ? '1px solid var(--primary)' : styles.card.border,
                position: 'relative'
            }}
        >
            {isPopular && <div style={styles.popularTag}>MOST POPULAR</div>}
            <h3 style={{fontSize: '1.5rem', marginBottom: 10}}>{title}</h3>
            <div style={styles.price}>
                <span style={{fontSize: '2.5rem', fontWeight: 700}}>{price}</span>
                <span style={{color: '#666'}}>/mo</span>
            </div>
            <ul style={styles.featureList}>
                {features.map((f, i) => (
                    <li key={i} style={styles.featureItem}>
                        <CheckCircle size={16} color="var(--primary)" /> {f}
                    </li>
                ))}
            </ul>
            <button style={isPopular ? styles.primaryBtnFull : styles.secondaryBtnFull}>
                Choose {title}
            </button>
        </motion.div>
    )
}

function Testimonial({ name, text }) {
  return (
    <motion.div whileHover={{ y: -6 }} style={styles.card}>
      <p style={{ fontStyle: "italic", fontSize: '1.1rem' }}>"{text}"</p>
      <strong style={{ color: "var(--primary)", marginTop: 16, display: 'block' }}>{name}</strong>
    </motion.div>
  );
}

/* STYLES OBJECT */
const styles = {
  page: {
    background: "var(--bg-main)",
    color: "var(--text-main)",
    fontFamily: "var(--font-body)",
    overflowX: "hidden",
    position: 'relative'
  },
  glowTop: {
    position: "absolute",
    top: -200,
    left: "20%",
    width: 600,
    height: 600,
    background: "radial-gradient(circle, var(--primary-glow), transparent 70%)",
    filter: "blur(120px)",
    zIndex: 0,
    opacity: 0.5
  },
  glowBottom: {
    position: "absolute",
    bottom: -200,
    right: "20%",
    width: 600,
    height: 600,
    background: "radial-gradient(circle, var(--primary-glow), transparent 70%)",
    filter: "blur(150px)",
    zIndex: 0,
    opacity: 0.3
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "8rem 2rem 4rem",
    textAlign: "center",
    position: 'relative',
    zIndex: 1
  },
  heroContent: { maxWidth: 900, marginBottom: 60 },
  badge: {
    border: "1px solid var(--border-highlight)",
    padding: "0.5rem 1.2rem",
    borderRadius: 100,
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 24,
    background: "rgba(180, 247, 46, 0.05)",
    fontSize: '0.9rem',
    fontWeight: 600
  },
  title: { 
      fontSize: "clamp(3rem, 6vw, 5rem)", 
      fontWeight: 800, 
      lineHeight: 1.1, 
      marginBottom: 24,
      fontFamily: "var(--font-display)"
  },
  accentText: {
      background: "linear-gradient(135deg, var(--primary) 0%, #ffffff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
  },
  subtitle: { 
      color: "var(--text-muted)", 
      maxWidth: 600, 
      margin: "0 auto 40px", 
      fontSize: "1.2rem",
      lineHeight: 1.6
  },
  ctaRow: { display: "flex", gap: 16, justifyContent: "center", flexWrap: 'wrap' },
  primaryBtn: {
    background: "var(--primary)",
    border: "none",
    padding: "1rem 2.5rem",
    borderRadius: 100,
    fontWeight: 700,
    fontSize: '1rem',
    cursor: "pointer",
    color: "#000",
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'transform 0.2s',
    boxShadow: '0 10px 20px -5px var(--primary-glow)'
  },
  primaryBtnFull: {
    width: '100%',
    background: "var(--primary)",
    border: "none",
    padding: "1rem",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    color: "#000",
    marginTop: 24
  },
  secondaryBtn: {
    background: "transparent",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-main)",
    padding: "1rem 2.5rem",
    borderRadius: 100,
    fontWeight: 600,
    fontSize: '1rem',
    cursor: "pointer",
  },
  secondaryBtnFull: {
    width: '100%',
    background: "transparent",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-main)",
    padding: "1rem",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 24
  },
  dashboardMock: {
      width: '100%',
      maxWidth: 500,
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 24,
      padding: 24,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
  },
  mockHeader: { display: 'flex', gap: 6, marginBottom: 24},
  mockDot: { width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.1)'},
  metric: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: '0.9rem' },
  barContainer: { height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' },
  barFill: { height: '100%', background: 'var(--primary)', borderRadius: 10 },

  section: { padding: "8rem 2rem", maxWidth: 1280, margin: "0 auto", textAlign: "center", position: 'relative', zIndex: 1 },
  processSection: { padding: "8rem 0", background: 'var(--bg-secondary)', textAlign: 'center' },
  container: { maxWidth: 1280, margin: '0 auto', padding: '0 2rem' },
  sectionTitle: { fontSize: "3rem", marginBottom: 60, fontFamily: "var(--font-display)", fontWeight: 700 },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 },
  processGrid: { display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 40 },
  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: 'center' },

  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-subtle)",
    padding: 40,
    borderRadius: 24,
    textAlign: 'left',
    transition: 'border-color 0.3s'
  },
  iconBox: { marginBottom: 20, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'inline-flex' },
  cardTitle: { fontSize: '1.5rem', marginBottom: 12, fontWeight: 700 },
  cardText: { color: 'var(--text-muted)', lineHeight: 1.6 },

  step: { flex: 1, textAlign: 'left', minWidth: 250 },
  stepNum: { fontSize: '4rem', fontWeight: 900, color: 'rgba(255,255,255,0.05)', display: 'block', lineHeight: 1 },
  stepTitle: { fontSize: '1.8rem', marginBottom: 10, fontWeight: 700 },
  stepDesc: { color: 'var(--text-muted)', lineHeight: 1.6 },

  popularTag: {
      position: 'absolute',
      top: -12,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--primary)',
      color: '#000',
      padding: '4px 12px',
      borderRadius: 100,
      fontSize: '0.8rem',
      fontWeight: 700
  },
  price: { marginBottom: 24, display: 'flex', alignItems: 'baseline', gap: 4 },
  featureList: { listStyle: 'none', padding: 0, margin: 0 },
  featureItem: { display: 'flex', gap: 12, marginBottom: 16, fontSize: '0.95rem', color: 'var(--text-muted)' },

  showcase: { padding: "6rem 2rem" },
  
  final: {
    padding: "8rem 2rem",
    textAlign: "center",
    background: "linear-gradient(to top, #000, var(--bg-main))",
  },
};
