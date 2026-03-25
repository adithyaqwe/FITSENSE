import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, Activity, Heart, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* Newsletter / Top Section */}
      <div style={styles.newsletterSection}>
         <div style={styles.newsletterContent}>
            <h3 style={styles.newsletterTitle}>Ready to <span style={{color: 'var(--primary)'}}>evolve?</span></h3>
            <p style={styles.newsletterDesc}>Join our newsletter for the latest bio-hacking tips and feature updates.</p>
         </div>
         <div style={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email" style={styles.input} />
            <button style={styles.button}>Subscribe <ArrowRight size={16}/></button>
         </div>
      </div>

      <div style={styles.separator} />

      <div style={styles.container}>
        
        {/* Brand */}
        <div style={styles.brandCol}>
          <div style={styles.logoRow}>
            <Activity size={24} color="var(--primary)" />
            <h2 style={styles.logo}>FitSense</h2>
          </div>
          <p style={styles.desc}>
            The ultimate standard of AI-powered human performance. Engineering a better you, one data point at a time.
          </p>
          <div style={styles.socials}>
            <SocialIcon icon={<Instagram size={18} />} />
            <SocialIcon icon={<Twitter size={18} />} />
            <SocialIcon icon={<Linkedin size={18} />} />
            <SocialIcon icon={<Mail size={18} />} />
          </div>
        </div>

        {/* Links */}
        <div style={styles.linksGrid}>
            <div style={styles.column}>
            <h4 style={styles.heading}>Product</h4>
            <FooterLink to="/#features">Features</FooterLink>
            <FooterLink to="/#process">Process</FooterLink>
            <FooterLink to="/#pricing">Pricing</FooterLink>
            <FooterLink to="/dashboard">Dashboard</FooterLink>
            </div>

            <div style={styles.column}>
            <h4 style={styles.heading}>Company</h4>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/careers">Careers</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            </div>

            <div style={styles.column}>
            <h4 style={styles.heading}>Legal</h4>
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
            <FooterLink to="/security">Security</FooterLink>
            </div>
        </div>
      </div>

      <div style={styles.bottom}>
        <div style={styles.bottomContent}>
            <span>© {new Date().getFullYear()} FitSense Inc. All rights reserved.</span>
            <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
                Made with <Heart size={12} fill="var(--primary)" color="var(--primary)" /> for performers.
            </span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
    return (
        <motion.div 
            whileHover={{ y: -3, color: 'var(--primary)' }} 
            style={styles.socialIcon}
        >
            {icon}
        </motion.div>
    )
}

function FooterLink({ children, to }) {
    return (
        <Link to={to} style={styles.link}>
            <motion.span whileHover={{ x: 5, color: 'var(--primary)' }} style={{ display: 'inline-block', transition: 'color 0.2s' }}>
                {children}
            </motion.span>
        </Link>
    )
}

const styles = {
  footer: {
    background: "var(--bg-secondary)", // Consistent background
    borderTop: "1px solid var(--border-subtle)",
    padding: "0 0 2rem",
    color: "var(--text-muted)",
    width: "100%",
    position: 'relative',
    zIndex: 10
  },
  newsletterSection: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '4rem 2rem',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 32
  },
  newsletterContent: {
      maxWidth: 500
  },
  newsletterTitle: {
      fontSize: '2rem',
      fontWeight: 700,
      color: 'var(--text-main)',
      marginBottom: 8,
      fontFamily: 'var(--font-display)'
  },
  newsletterDesc: {
      color: 'var(--text-muted)'
  },
  newsletterForm: {
      display: 'flex',
      gap: 12,
      flex: 1,
      maxWidth: 400
  },
  input: {
      flex: 1,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid var(--border-subtle)',
      padding: '12px 16px',
      borderRadius: 100,
      color: 'white',
      outline: 'none',
  },
  button: {
      background: 'var(--primary)',
      color: '#000',
      border: 'none',
      padding: '0 24px',
      borderRadius: 100,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8
  },
  separator: {
      height: 1,
      background: 'var(--border-subtle)',
      width: '100%',
      maxWidth: 1280,
      margin: '0 auto'
  },
  container: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "4rem 2rem",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "3rem"
  },
  brandCol: {
      maxWidth: 350
  },
  logoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16
  },
  logo: {
    color: "var(--text-main)",
    fontSize: "1.5rem",
    fontWeight: 700,
    fontFamily: 'var(--font-display)'
  },
  desc: {
    lineHeight: 1.6,
    marginBottom: 24
  },
  linksGrid: {
      display: 'flex',
      gap: '4rem',
      flexWrap: 'wrap'
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    minWidth: 100
  },
  heading: {
    color: "var(--text-main)",
    marginBottom: "1rem",
    fontWeight: 600,
    fontSize: '1.1rem'
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: '0.95rem'
  },
  socials: {
    display: "flex",
    gap: "1rem"
  },
  socialIcon: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-main)',
      cursor: 'pointer'
  },
  bottom: {
    borderTop: "1px solid var(--border-subtle)",
    paddingTop: "2rem",
    marginTop: "0",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "2rem",
  },
  bottomContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: "#666",
      fontSize: "0.85rem",
      flexWrap: 'wrap',
      gap: 12
  }
};
