import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ClipboardList, AlertCircle, Activity, Loader2, Check } from 'lucide-react';

const HealthForm = () => {
    const [formData, setFormData] = useState({
        bmi: '',
        sugarLevel: 'Normal',
        hemoglobin: '',
        injuries: []
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInjuryToggle = (injury) => {
        setFormData(prev => ({
            ...prev,
            injuries: prev.injuries.includes(injury)
                ? prev.injuries.filter(i => i !== injury)
                : [...prev.injuries, injury]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/report/submit', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '8rem 2rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: '700px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ 
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                        width: '64px', height: '64px', borderRadius: '16px', 
                        background: 'rgba(180, 247, 46, 0.1)', color: 'var(--primary)', 
                        marginBottom: '1.5rem' 
                    }}>
                        <Activity size={32} />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Health Profile</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your latest metrics for a precision plan.</p>
                </div>

                <form onSubmit={handleSubmit} className="glass" style={{ padding: '3rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>BMI (Body Mass Index)</label>
                            <input
                                type="number" step="0.1"
                                className="input-field"
                                placeholder="e.g. 24.5"
                                value={formData.bmi}
                                onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Sugar Level</label>
                            <div className="select-wrapper " style={{ position: 'relative' }}>
                                <select
                                    className="input-field"
                                    value={formData.sugarLevel}
                                    onChange={(e) => setFormData({ ...formData, sugarLevel: e.target.value })}
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hemoglobin Level (g/dL)</label>
                        <input
                            type="number" step="0.1"
                            className="input-field"
                            placeholder="e.g. 13.5"
                            value={formData.hemoglobin}
                            onChange={(e) => setFormData({ ...formData, hemoglobin: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Injuries / Health Conditions</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {['Back Pain', 'Knee Injury', 'Shoulder Pain', 'Asthma', 'Heart Condition'].map(injury => {
                                const isSelected = formData.injuries.includes(injury);
                                return (
                                    <button
                                        key={injury}
                                        type="button"
                                        onClick={() => handleInjuryToggle(injury)}
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '12px',
                                            border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                            background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            color: isSelected ? 'black' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            transition: 'all 0.2s ease',
                                            fontWeight: isSelected ? 600 : 400
                                        }}
                                    >
                                        {isSelected && <Check size={16} />}
                                        {injury}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        border: '1px solid rgba(59, 130, 246, 0.2)', 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        display: 'flex', gap: '0.75rem', 
                        color: '#93c5fd', 
                        fontSize: '0.9rem',
                        alignItems: 'start'
                    }}>
                        <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p>Your data is processed securely and used only to filter safe exercises for you. We do not share your health data.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Generate My Plans'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default HealthForm;
