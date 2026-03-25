import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Flame, Calendar, ChevronRight, Play } from 'lucide-react';

const GymPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Using a gym atmosphere image from Unsplash
  const bannerImg = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop";

  useEffect(() => {
    // In a real app, we'd fetch specific plan details. 
    // Reusing the report endpoint for now to get the plan data.
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/report/my-reports', {
           headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.data?.reports?.[0]?.generatedPlan?.gym) {
          setPlan(res.data.data.reports[0].generatedPlan.gym);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) return <div className="min-h-screen flex-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '4rem' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '40vh', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: `url(${bannerImg}) center/cover no-repeat` 
        }} />
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to bottom, transparent, var(--bg-main))' 
        }} />
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '3rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <span className="text-primary" style={{ fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Advanced Hypertrophy</span>
             <h1 style={{ fontSize: '4rem', margin: '0.5rem 0' }}>Your Workout Plan</h1>
             <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
               <span className="flex-center" style={{ gap: '0.5rem' }}><Clock size={18}/> 60-90 Mins</span>
               <span className="flex-center" style={{ gap: '0.5rem' }}><Flame size={18}/> High Intensity</span>
             </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        
        {/* Sidebar */}
        <div className="glass" style={{ height: 'fit-content', padding: '1.5rem', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', paddingLeft: '0.5rem' }}>Weekly Schedule</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem',
                  background: selectedDay === day ? 'var(--primary)' : 'transparent',
                  color: selectedDay === day ? '#000' : 'var(--text-muted)',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: selectedDay === day ? 600 : 400,
                  transition: 'all 0.3s ease'
                }}
              >
                <span>{day}</span>
                {selectedDay === day && <ChevronRight size={16}/>}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Calendar className="text-primary" /> {selectedDay}'s Session
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {plan && plan[selectedDay] ? (
              plan[selectedDay].map((exercise, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass"
                  style={{ 
                    padding: '2rem', 
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }}
                >
                  <div style={{ 
                    width: '60px', height: '60px', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)'
                  }}>
                    {idx + 1}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{exercise}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span>4 Sets</span>
                      <span>•</span>
                      <span>8-12 Reps</span>
                      <span>•</span>
                      <span>90s Rest</span>
                    </div>
                  </div>

                  <div style={{ 
                    width: '40px', height: '40px', 
                    background: 'var(--primary)', 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'black'
                  }}>
                    <Play size={20} fill="black" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="panel" style={{ textAlign: 'center', padding: '4rem' }}>
                 <p style={{ color: 'var(--text-muted)' }}>Rest Day. Active recovery recommended.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GymPlan;
