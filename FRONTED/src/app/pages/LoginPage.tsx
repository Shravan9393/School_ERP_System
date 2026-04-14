import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Eye, EyeOff, Shield, ChevronLeft, AlertCircle, Lock, User } from 'lucide-react';
import { useAuth, ROLE_DASHBOARD } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (user) navigate(ROLE_DASHBOARD[user.role], { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => setMousePos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) { setError('Please enter your User ID and Password.'); return; }
    setError(''); setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(userId.trim(), password);
    setIsLoading(false);
    if (!result.success) { setError(result.error || 'Login failed.'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'linear-gradient(160deg, #0a1a10 0%, #1a2e20 50%, #0f1e14 100%)', fontFamily: 'var(--font-body)' }}>

      {/* Cursor spotlight */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(88,129,87,0.15), transparent 70%)`, zIndex: 0 }} />

      {/* Background orbs */}
      <div className="fixed top-0 left-1/3 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(88,129,87,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="fixed bottom-0 right-1/3 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(58,90,64,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Back to home */}
      <motion.button whileHover={{ x: -4 }} onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-10 flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#A3B18A', fontSize: 13 }}>
        <ChevronLeft size={14} /> Home
      </motion.button>

      {/* Login card */}
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="relative w-full max-w-md z-10">
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(163,177,138,0.15)', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', boxShadow: '0 8px 30px rgba(88,129,87,0.3)' }}>
              <GraduationCap size={28} className="text-white" />
            </motion.div>
            <h1 className="text-white" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>Greenfield Academy</h1>
            <p style={{ fontSize: 12, color: '#A3B18A', marginTop: 4 }}>School Administration Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ fontSize: 12, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>User ID</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(163,177,138,0.5)' }} />
                <input value={userId} onChange={e => { setUserId(e.target.value); setError(''); }}
                  placeholder="Enter your User ID"
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(224,82,82,0.4)' : 'rgba(163,177,138,0.15)'}`, color: '#DAD7CD', fontSize: 14 }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(163,177,138,0.5)' }} />
                <input value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(224,82,82,0.4)' : 'rgba(163,177,138,0.15)'}`, color: '#DAD7CD', fontSize: 14 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                  style={{ color: 'rgba(163,177,138,0.5)' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.2)' }}>
                  <AlertCircle size={14} style={{ color: '#e05252', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#e05252' }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 14, fontWeight: 600, opacity: isLoading ? 0.8 : 1, boxShadow: '0 6px 20px rgba(88,129,87,0.3)' }}>
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying...</>
              ) : (
                <><Shield size={15} /> Sign In to Portal</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgba(163,177,138,0.1)' }}>
            <p style={{ fontSize: 11, color: 'rgba(163,177,138,0.5)', textAlign: 'center', lineHeight: 1.6 }}>
              Credentials are issued by the Administration.<br />
              Contact <span style={{ color: '#A3B18A' }}>admin@greenfield.edu.in</span> for access.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
