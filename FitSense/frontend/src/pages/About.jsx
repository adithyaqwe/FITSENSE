import { motion } from "framer-motion";

export default function About() {
  const avatar =
    "https://api.dicebear.com/7.x/bottts/svg?seed=fitsense";

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <section style={styles.hero}>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.title}
        >
          The People Behind <span style={styles.goldText}>FitSense</span>
        </motion.h1>

        <p style={styles.subtitle}>
          A small, focused team obsessed with health, technology, and building
          tools that actually improve lives.
        </p>
      </section>

      {/* TEAM */}
      <section style={styles.teamSection}>
        <div style={styles.grid}>
          <TeamCard name="PRANAVA ADHITHYA" img={avatar} />
          <TeamCard name="KONDALA GOWTHAM" img={avatar} />
          <TeamCard name="BONU ADITHYA" img={avatar} />
          <TeamCard name="BASETTY SHIVA TEJA" img={avatar} />
        </div>
      </section>

      {/* MISSION */}
      <section style={styles.mission}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={styles.missionCard}
        >
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.missionText}>
            Fitness is broken. Generic plans fail. People get injured. Motivation fades.
            <br /><br />
            Our mission is to build the world’s most intelligent fitness system —
            one that adapts to your biology, respects your limitations, and grows
            with you over time.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

/* TEAM CARD */
function TeamCard({ name, img }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -10,
        boxShadow: "0 0 40px rgba(212,175,55,0.15)",
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={styles.card}
    >
      {/* Avatar */}
      <motion.img
        src={img}
        alt={name}
        style={styles.avatar}
        whileHover={{ scale: 1.08, rotate: 2 }}
        transition={{ type: "spring", stiffness: 200 }}
      />

      {/* Name */}
      <motion.h3
        style={styles.name}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {name}
      </motion.h3>

      {/* Subtext */}
      <p style={styles.role}>Core Team Member</p>
    </motion.div>
  );
}

/* STYLES */
const gold = "#D4AF37";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "white",
    padding: "6rem 2rem",
  },

  hero: {
    textAlign: "center",
    maxWidth: 850,
    margin: "0 auto 5rem",
  },

  title: {
    fontSize: "clamp(2.8rem, 5vw, 4rem)",
    fontWeight: 900,
  },

  goldText: {
    background: "linear-gradient(90deg,#D4AF37,#fff2b0,#D4AF37)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    marginTop: "1.5rem",
    color: "#aaa",
    fontSize: "1.2rem",
    lineHeight: 1.6,
  },

  teamSection: {
    maxWidth: 1100,
    margin: "0 auto 6rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "2.5rem",
  },

  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 28,
    padding: "2.8rem 2rem",
    textAlign: "center",
    backdropFilter: "blur(20px)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "#0f0f0f",
    border: `2px solid ${gold}`,
    marginBottom: "1.2rem",
    padding: "0.75rem",
  },

  name: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginTop: "0.2rem",
    letterSpacing: "0.5px",
  },

  role: {
    color: "#888",
    marginTop: "0.3rem",
    fontSize: "0.9rem",
  },

  mission: {
    maxWidth: 900,
    margin: "0 auto",
  },

  missionCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 32,
    padding: "3rem",
    backdropFilter: "blur(20px)",
  },

  sectionTitle: {
    fontSize: "2.2rem",
    marginBottom: "1.5rem",
  },

  missionText: {
    color: "#aaa",
    lineHeight: 1.8,
    fontSize: "1.1rem",
  },
};
