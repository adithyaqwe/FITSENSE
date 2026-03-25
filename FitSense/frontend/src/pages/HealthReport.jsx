import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Heart, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const HealthReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/report/my-reports', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data?.data?.reports?.length > 0) {
                    setReport(res.data.data.reports[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    if (loading) return <div className="min-h-screen flex-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

    if (!report) return (
        <div className="min-h-screen flex-center flex-col container text-center">
            <h2 className="text-3xl font-bold mb-4">No Report Found</h2>
            <Link to="/submit-report" className="btn btn-primary">Create Report</Link>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingTop: '100px', paddingBottom: '4rem' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <div style={{ 
                        display: 'inline-flex', padding: '0.5rem 1rem', borderRadius: '50px', 
                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem'
                    }}>
                        Report Generated: {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem' }}>Health & Fitness <span className="text-gradient">Analysis</span></h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
                        Based on your submitted data, here is a breakdown of your current standing and recommendations.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {/* BMI Card */}
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Activity size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>BMI Score</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{report.bmi}</div>
                        <p style={{ marginTop: '1rem', color: report.bmi > 25 ? '#fca5a5' : '#86efac' }}>
                            {report.bmi > 25 ? 'Overweight Range' : 'Healthy Range'}
                        </p>
                    </div>

                    {/* Vitals Card */}
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Heart size={24} className="text-primary" /> Vitals Check
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Hemoglobin</span>
                                <span style={{ fontWeight: 700 }}>{report.hemoglobin} g/dL</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Sugar Level</span>
                                <span style={{ fontWeight: 700 }}>{report.sugarLevel}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Blood Pressure</span>
                                <span style={{ fontWeight: 700 }}>120/80 (Est)</span>
                            </div>
                        </div>
                    </div>

                    {/* Conditions Card */}
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <AlertTriangle size={24} color="#fca5a5" /> Conditions
                        </h3>
                        {report.injuries && report.injuries.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {report.injuries.map((injury, i) => (
                                    <span key={i} style={{ 
                                        padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', 
                                        color: '#fca5a5', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 
                                    }}>
                                        {injury}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#86efac' }}>
                                <CheckCircle size={20} />
                                <span>No active injuries reported.</span>
                            </div>
                        )}
                        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Your workout plan has been automatically adjusted to accommodate these factors.
                        </p>
                    </div>
                </div>

                <div className="panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to start?</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/gym-plan" className="btn btn-primary">View Workout Plan</Link>
                        <Link to="/diet-plan" className="btn btn-secondary">View Diet Plan</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthReport;
