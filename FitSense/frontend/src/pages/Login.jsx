import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative', 
            overflow: 'hidden',
            padding: '2rem'
        }}>
            {/* Background Atmosphere */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <div style={{
                    position: 'absolute', top: '-10%', right: '-5%',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                    opacity: 0.4, filter: 'blur(80px)'
                }} />
                 <div style={{
                    position: 'absolute', bottom: '-10%', left: '-10%',
                    width: '500px', height: '500px',
                    background: 'radial-gradient(circle, rgba(100,100,255,0.2) 0%, transparent 70%)',
                    opacity: 0.3, filter: 'blur(80px)'
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass"
                style={{ 
                    padding: '3rem', 
                    borderRadius: '24px', 
                    width: '100%', 
                    maxWidth: '480px',
                    position: 'relative',
                    boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
                }}
            >
                {/* Glow Line */}
                <div style={{ 
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px', 
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                    opacity: 0.8
                }} />

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Access your personalized health dashboard</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            border: '1px solid rgba(239, 68, 68, 0.2)', 
                            color: '#fca5a5', 
                            padding: '1rem', 
                            borderRadius: '12px', 
                            marginBottom: '1.5rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input
                            type="email"
                            className="input-field"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                        <input
                            type="password"
                            className="input-field"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                         <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Forgot Password?</a>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem', width: '100%', padding: '1rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Sign In <ArrowRight size={20} /></>}
                    </motion.button>
                </form>

                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        New to FitSense? 
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: '0.5rem' }}>
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
