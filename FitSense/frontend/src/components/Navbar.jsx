import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Process', path: '/#process' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Connect', path: '/connect' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '1rem 0' : '1.5rem 0',
          transition: 'padding 0.3s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: scrolled ? 'rgba(5, 5, 5, 0.8)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderRadius: scrolled ? '100px' : '0',
            border: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
            padding: scrolled ? '0.75rem 2rem' : '0 2rem',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, var(--primary), #8cc224)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black'
            }}>
              <Activity size={24} />
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.5px'
            }}>
              FitSense
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path.startsWith('/#') ? link.path : link.path}
                onClick={(e) => {
                  if (link.path.startsWith('/#')) {
                    // handling anchor links if needed, or let default behavior work if on same page
                  } else {
                    navigate(link.path);
                  }
                }}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                {link.name}
              </a>
            ))}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-ghost" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex' // Visible on mobile, handled by CSS media query ideally, but here inline
            }}
            className="mobile-toggle"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '80px',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              zIndex: 999,
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{ fontSize: '1.25rem', fontWeight: 600 }}
                >
                  {link.name}
                </Link>
              ))}
              <hr style={{ borderColor: 'var(--border-subtle)' }} />
              <Link to="/login" className="btn btn-ghost" style={{ width: '100%' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
