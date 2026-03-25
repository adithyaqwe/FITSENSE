import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Utensils, Droplet, Apple, Calendar, ChevronRight } from 'lucide-react';

const DietPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Healthy food image
  const bannerImg = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop";

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/report/my-reports', {
           headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.data?.reports?.[0]?.generatedPlan?.diet) {
          setPlan(res.data.data.reports[0].generatedPlan.diet);
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

  if (loading) return <div className="min-h-screen flex-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div></div>;

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
             <span style={{ fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#f472b6' }}>Nutritional Balance</span>
             <h1 style={{ fontSize: '4rem', margin: '0.5rem 0' }}>Your Diet Plan</h1>
             <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
               <span className="flex-center" style={{ gap: '0.5rem' }}><Apple size={18}/> 2400 kcal</span>
               <span className="flex-center" style={{ gap: '0.5rem' }}><Droplet size={18}/> 3L Water</span>
             </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        
        {/* Sidebar */}
        <div className="glass" style={{ height: 'fit-content', padding: '1.5rem', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', paddingLeft: '0.5rem' }}>Weekly Menu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem',
                  background: selectedDay === day ? '#f472b6' : 'transparent',
                  color: selectedDay === day ? '#fff' : 'var(--text-muted)',
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

        {/* Meals Grid */}
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Utensils className="text-pink-400" /> {selectedDay}'s Meals
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {plan && plan[selectedDay] ? (
              plan[selectedDay].map((meal, idx) => (
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
                    alignItems: 'start',
                    gap: '1.5rem'
                  }}
                  whileHover={{ scale: 1.01, borderColor: '#f472b6' }}
                >
                  <div style={{ 
                    padding: '0.8rem 1.5rem', 
                    background: 'rgba(244, 114, 182, 0.1)', 
                    color: '#f472b6',
                    borderRadius: '12px',
                    fontSize: '0.9rem', fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    Meal {idx + 1}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{meal}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      High protein source with complex carbohydrates for sustained energy.
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="panel" style={{ textAlign: 'center', padding: '4rem' }}>
                 <p style={{ color: 'var(--text-muted)' }}>No specific plan for this day.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DietPlan;
