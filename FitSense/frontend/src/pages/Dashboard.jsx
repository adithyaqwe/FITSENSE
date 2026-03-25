import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Utensils, Calendar, ChevronRight, Activity, Loader2, Plus } from 'lucide-react';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('gym');
    const [selectedDay, setSelectedDay] = useState('Monday');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/report/my-reports', {
                    headers: { Authorization: `Bearer ${token}` } // Assuming Bearer token format
                });
                if (res.data && res.data.data && res.data.data.reports) {
                     setReports(res.data.data.reports);
                } else {
                     setReports([]);
                }
            } catch (err) {
                console.error("Error fetching reports:", err);
                // Handle 401 or empty states gracefully in UI
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
        </div>
    );

    if (reports.length === 0) {
        return (
            <div className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass"
                    style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', borderRadius: '30px' }}
                >
                    <div style={{ 
                        width: '100px', height: '100px', background: 'rgba(180, 247, 46, 0.1)', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 2rem', color: 'var(--primary)'
                    }}>
                        <Activity size={48} />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>No Plans Yet</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
                        You haven't generated a fitness plan yet. Submit your health report to get started.
                    </p>
                    <Link to="/submit-report" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                           <Plus size={20} /> Create Your First Plan
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const latestReport = reports[0];
    const gymPlan = latestReport.generatedPlan?.gym || {};
    const dietPlan = latestReport.generatedPlan?.diet || {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const currentPlanItems = activeTab === 'gym' ? gymPlan[selectedDay] : dietPlan[selectedDay];

    return (
        <div className="container" style={{ padding: '4rem 2rem 6rem' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
            >
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Your Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></span>
                        Active Plan • BMI: {latestReport.bmi || 'N/A'} • Status: Optimal
                    </p>
                </div>
                <Link to="/submit-report" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>
                    Generate New Plan
                </Link>
            </motion.div>

            {/* Toggle Switch */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                <TabButton 
                    active={activeTab === 'gym'} 
                    onClick={() => setActiveTab('gym')} 
                    icon={<Dumbbell size={20} />} 
                    label="Workout Plan"
                    color="var(--primary)"
                />
                <TabButton 
                    active={activeTab === 'diet'} 
                    onClick={() => setActiveTab('diet')} 
                    icon={<Utensils size={20} />} 
                    label="Nutrition Plan"
                    color="#f472b6"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                
                {/* Sidebar Days */}
                <div className="glass" style={{ 
                    padding: '1.5rem', borderRadius: '20px', 
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    height: 'fit-content'
                }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', paddingBottom: '1rem', paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule</h3>
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                background: selectedDay === day ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: '1px solid',
                                borderColor: selectedDay === day ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: selectedDay === day ? 'var(--text-main)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '1rem',
                                fontWeight: selectedDay === day ? 600 : 400
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Calendar size={18} style={{ opacity: selectedDay === day ? 1 : 0.5 }} />
                                {day}
                            </span>
                            {selectedDay === day && <ChevronRight size={16} />}
                        </button>
                    ))}
                </div>

                {/* Main Content Plan */}
                <div style={{ gridColumn: 'span 2' }}>
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + selectedDay}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="glass"
                            style={{ padding: '2.5rem', borderRadius: '24px', minHeight: '500px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ 
                                    padding: '1rem', borderRadius: '16px', 
                                    background: activeTab === 'gym' ? 'rgba(180, 247, 46, 0.1)' : 'rgba(244, 114, 182, 0.1)',
                                    color: activeTab === 'gym' ? 'var(--primary)' : '#f472b6'
                                }}>
                                    {activeTab === 'gym' ? <Dumbbell size={32} /> : <Utensils size={32} />}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{selectedDay}</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>
                                        {activeTab === 'gym' ? 'Focus on your form and consistency.' : 'Fuel your body with the right nutrients.'}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {currentPlanItems && currentPlanItems.length > 0 ? (
                                    currentPlanItems.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            style={{ 
                                                padding: '1.5rem', 
                                                background: 'rgba(255,255,255,0.03)', 
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                gap: '1.5rem',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span style={{ 
                                                fontSize: '1.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.1)',
                                                minWidth: '40px'
                                            }}>
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </span>
                                            <p style={{ fontSize: '1.1rem' }}>{item}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                        No items planned for this day. Rest is important too!
                                    </div>
                                )}
                            </div>
                        </motion.div>
                     </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label, color }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            padding: '1.25rem',
            borderRadius: '16px',
            background: active ? color : 'rgba(255,255,255,0.05)',
            color: active ? '#000' : 'var(--text-muted)',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: active ? `0 10px 20px -5px ${color}66` : 'none' // Adding opacity to hex color
        }}
    >
        {icon} {label}
    </button>
);

export default Dashboard;
