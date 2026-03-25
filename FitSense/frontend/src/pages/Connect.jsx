import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Connect() {
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
          Let's <span style={styles.goldText}>Connect</span>
        </motion.h1>

        <p style={styles.subtitle}>
          Have questions or feedback? We'd love to hear from you.
        </p>
      </section>

      {/* CONTENT */}
      <section style={styles.contentSection}>
        <div style={styles.grid}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={styles.infoCard}
          >
            <h2 style={styles.sectionTitle}>Get in Touch</h2>
            <div style={styles.contactList}>
              <div style={styles.contactItem}>
                <div style={styles.iconBox}><Mail size={24} /></div>
                <div>
                  <h3 style={styles.contactLabel}>Email</h3>
                  <p style={styles.contactValue}>hello@fitsense.com</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.iconBox}><Phone size={24} /></div>
                <div>
                  <h3 style={styles.contactLabel}>Phone</h3>
                  <p style={styles.contactValue}>+1 (555) 123-4567</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.iconBox}><MapPin size={24} /></div>
                <div>
                  <h3 style={styles.contactLabel}>Office</h3>
                  <p style={styles.contactValue}>123 Fitness Blvd, Tech City</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={styles.formCard}
          >
            <h2 style={styles.sectionTitle}>Send a Message</h2>
            <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input type="text" placeholder="Your Name" style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input type="email" placeholder="your@email.com" style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea placeholder="How can we help?" rows={4} style={styles.textarea}></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={styles.button}
                type="submit"
              >
                Send Message <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* STYLES */
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
    fontFamily: "var(--font-display)",
  },
  goldText: {
    background: "linear-gradient(90deg, var(--primary), #fff2b0, var(--primary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    marginTop: "1.5rem",
    color: "#aaa",
    fontSize: "1.2rem",
    lineHeight: 1.6,
  },
  contentSection: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "3rem",
  },
  infoCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: "2.5rem",
    backdropFilter: "blur(20px)",
  },
  formCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: "2.5rem",
    backdropFilter: "blur(20px)",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "2rem",
    fontFamily: "var(--font-display)",
  },
  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: "12px",
    background: "rgba(180, 247, 46, 0.1)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontSize: "0.9rem",
    color: "#888",
    marginBottom: "0.2rem",
  },
  contactValue: {
    fontSize: "1.1rem",
    fontWeight: 500,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    color: "#ccc",
    fontWeight: 500,
  },
  input: {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "1rem",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s",
  },
  textarea: {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "1rem",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    transition: "border-color 0.3s",
    fontFamily: "inherit",
  },
  button: {
    background: "var(--primary)",
    color: "black",
    border: "none",
    borderRadius: "100px",
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
  },
};
