import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Clock, CreditCard, Calendar, BarChart2, FileText, Users,
  Shield, ChevronRight, Menu, X, MapPin, Phone, Mail, ExternalLink,
  Bell, CheckCircle, BookOpen, Award, Zap, Star, ArrowRight
} from 'lucide-react';
import { DraggableImageStack } from '../components/DraggableImageStack';

const SCHOOL_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1741638511355-7b0037a52f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZSUyMGdyZWVuJTIwY2FtcHVzfGVufDF8fHx8MTc3NjA5OTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  about: 'https://images.unsplash.com/photo-1758270704384-9df36d94a29d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3NjA5OTk0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
};

const features = [
  { icon: Clock, title: 'Smart Attendance', desc: 'Automated daily attendance tracking with real-time reports for teachers, students, and parents.', color: '#588157' },
  { icon: CreditCard, title: 'Fee Management', desc: 'Streamlined fee collection with UPI/cash support, receipts, and outstanding alerts.', color: '#4a7c6f' },
  { icon: Calendar, title: 'Timetable Scheduler', desc: 'Dynamic class scheduling from Nursery to Class 12 with conflict-free teacher assignment.', color: '#5a6e8a' },
  { icon: BarChart2, title: 'Academic Analytics', desc: 'Performance dashboards with subject-wise analysis and progress reports.', color: '#7a6a4a' },
  { icon: FileText, title: 'Leave Management', desc: 'Digital leave applications with document upload, status tracking, and approval workflow.', color: '#6a4a7a' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Secure multi-role system for Students, Teachers, Managers, Cashiers, and Admins.', color: '#4a6a7a' },
];

const announcements = [
  { id: 1, title: 'Annual Sports Day – 20th April 2026', tag: 'Event', date: 'Apr 18', color: '#588157' },
  { id: 2, title: 'CBSE Board Results declared for Class 12', tag: 'Academic', date: 'Apr 15', color: '#4a7c6f' },
  { id: 3, title: 'Holiday: Ram Navami – School Closed', tag: 'Holiday', date: 'Apr 6', color: '#7a6a4a' },
  { id: 4, title: 'Term 2 Fee Payment Deadline: 30th April', tag: 'Fee', date: 'Apr 5', color: '#e05252' },
  { id: 5, title: 'Parent-Teacher Meeting – 25th April 2026', tag: 'Event', date: 'Apr 4', color: '#5a6e8a' },
  { id: 6, title: 'Inter-School Science Exhibition – 28th April', tag: 'Academic', date: 'Apr 3', color: '#6a4a7a' },
];

const stats = [
  { label: 'Students Enrolled', value: '2,847', icon: Users },
  { label: 'Faculty Members', value: '128', icon: BookOpen },
  { label: 'Classes & Sections', value: '64', icon: GraduationCap },
  { label: 'Years of Excellence', value: '32+', icon: Award },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [scrollY, setScrollY] = useState(0);
  const frameRef = useRef<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => setMousePos({ x: e.clientX, y: e.clientY }));
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('scroll', onScroll); };
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(160deg, #0a1a10 0%, #1a2e20 50%, #0f1e14 100%)', fontFamily: 'var(--font-body)', color: '#DAD7CD' }}>
      {/* Cursor Spotlight */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(88,129,87,0.12), transparent 70%)` }} />

      {/* Ambient Background Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(88,129,87,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="fixed top-1/3 right-0 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(58,90,64,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(52,78,65,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6"
        style={{ paddingTop: 12, paddingBottom: 12 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{
            background: scrollY > 50 ? 'rgba(10,26,16,0.85)' : 'rgba(10,26,16,0.4)',
            backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(163,177,138,0.15)',
            transition: 'background 0.3s ease'
          }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)' }}>
              <GraduationCap size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>Greenfield Academy</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {['Home', 'About', 'Features', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="px-3 py-1.5 rounded-lg transition-colors hover:text-white"
                style={{ fontSize: 13, color: 'rgba(218,215,205,0.7)' }}>
                {link}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 20px rgba(88,129,87,0.3)' }}>
              <Shield size={14} />
              SAP Login
            </motion.button>
            <button className="md:hidden p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={18} style={{ color: '#A3B18A' }} /> : <Menu size={18} style={{ color: '#A3B18A' }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 mx-4 p-4 rounded-2xl space-y-1"
              style={{ background: 'rgba(10,26,16,0.95)', backdropFilter: 'blur(30px)', border: '1px solid rgba(163,177,138,0.15)' }}>
              {['Home', 'About', 'Features', 'Contact'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  style={{ fontSize: 14, color: '#DAD7CD' }}>{link}</a>
              ))}
              <button onClick={() => navigate('/login')}
                className="w-full mt-2 py-2.5 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 14, fontWeight: 600 }}>
                SAP Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto relative z-10">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(88,129,87,0.15)', border: '1px solid rgba(88,129,87,0.3)', backdropFilter: 'blur(10px)' }}>
            <Zap size={12} style={{ color: '#A3B18A' }} />
            <span style={{ fontSize: 12, color: '#A3B18A', fontWeight: 500 }}>School Administration & Governance Platform</span>
          </motion.div>

          {/* School Name */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: 'white', fontFamily: 'var(--font-display)' }}>
            Greenfield
            <span className="block" style={{ background: 'linear-gradient(135deg, #A3B18A 0%, #588157 50%, #DAD7CD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Academy
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-6 mx-auto max-w-xl" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: 'rgba(218,215,205,0.7)', lineHeight: 1.7 }}>
            A unified digital platform for 10+2 school management — attendance, fees, timetable, marks, and more, beautifully integrated.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 15, fontWeight: 600, boxShadow: '0 8px 30px rgba(88,129,87,0.4)' }}>
              <Shield size={16} /> Access SAP Portal <ArrowRight size={16} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', fontSize: 15, color: '#A3B18A', fontWeight: 600, backdropFilter: 'blur(10px)' }}>
              Explore Features <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero image card */}
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
          className="relative mt-16 w-full max-w-5xl mx-auto px-4 z-10">
          <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(163,177,138,0.15)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
            <img src={SCHOOL_IMAGES.hero} alt="Greenfield Academy" className="w-full h-64 sm:h-80 object-cover" style={{ filter: 'brightness(0.7) saturate(0.8)' }} />
            <DraggableImageStack />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="w-full max-w-4xl mx-auto px-4 mt-8 z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="p-4 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)' }}>
                  <Icon size={18} style={{ color: '#588157', margin: '0 auto 8px' }} />
                  <p className="text-white" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                  <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 2 }}>{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(88,129,87,0.1)', border: '1px solid rgba(88,129,87,0.2)' }}>
              <Star size={12} style={{ color: '#A3B18A' }} />
              <span style={{ fontSize: 12, color: '#A3B18A' }}>Platform Features</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
              Everything a school needs,<br /><span style={{ color: '#A3B18A' }}>in one platform</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="p-6 rounded-2xl group cursor-default"
                  style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.1)', transition: 'border-color 0.3s ease' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${feature.color}22`, border: `1px solid ${feature.color}44` }}>
                    <Icon size={20} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-white mb-2" style={{ fontSize: 15, fontWeight: 700 }}>{feature.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(218,215,205,0.6)', lineHeight: 1.6 }}>{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(88,129,87,0.1)', border: '1px solid rgba(88,129,87,0.2)' }}>
              <GraduationCap size={12} style={{ color: '#A3B18A' }} />
              <span style={{ fontSize: 12, color: '#A3B18A' }}>About Greenfield Academy</span>
            </div>
            <h2 className="text-white mb-6" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              32 years of shaping<br /><span style={{ color: '#A3B18A' }}>brilliant minds</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(218,215,205,0.7)', lineHeight: 1.8, marginBottom: 16 }}>
              Greenfield Academy is a CBSE-affiliated 10+2 school committed to holistic education. Since 1994, we have nurtured over 15,000 students with a blend of academics, sports, and values.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(218,215,205,0.7)', lineHeight: 1.8 }}>
              Our digital ERP system — <strong style={{ color: '#A3B18A' }}>GreenSAP</strong> — brings the entire school administration online, reducing paperwork and empowering every stakeholder.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {[['CBSE Affiliated', CheckCircle], ['ISO Certified', CheckCircle], ['Smart Campus', CheckCircle]].map(([label, Icon]: any) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={14} style={{ color: '#588157' }} />
                  <span style={{ fontSize: 13, color: '#A3B18A' }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
              <img src={SCHOOL_IMAGES.about} alt="Students learning" className="w-full h-80 object-cover" style={{ filter: 'brightness(0.75) saturate(0.9)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(10,26,16,0.8) 100%)' }} />
              {/* Floating card overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl" style={{ background: 'rgba(10,26,16,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.15)' }}>
                <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>15,000+ Alumni Worldwide</p>
                <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 2 }}>From IITs to Harvard — our students lead the world.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ANNOUNCEMENTS SECTION */}
      <section id="announcements" className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(88,129,87,0.1)', border: '1px solid rgba(88,129,87,0.2)' }}>
              <Bell size={12} style={{ color: '#A3B18A' }} />
              <span style={{ fontSize: 12, color: '#A3B18A' }}>Live Announcements</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Stay <span style={{ color: '#A3B18A' }}>updated</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {announcements.map((ann, i) => (
              <motion.div key={ann.id}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ x: 6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.08)' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ann.color }} />
                <div className="flex-1">
                  <p className="text-white" style={{ fontSize: 14, fontWeight: 500 }}>{ann.title}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs flex-shrink-0" style={{ background: `${ann.color}22`, color: ann.color, fontWeight: 600 }}>{ann.tag}</span>
                <span style={{ fontSize: 12, color: '#A3B18A', flexShrink: 0 }}>{ann.date}</span>
                <ExternalLink size={14} style={{ color: 'rgba(163,177,138,0.3)', flexShrink: 0 }} className="group-hover:text-[#A3B18A] transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(88,129,87,0.1)', border: '1px solid rgba(88,129,87,0.2)' }}>
              <Mail size={12} style={{ color: '#A3B18A' }} />
              <span style={{ fontSize: 12, color: '#A3B18A' }}>Get in Touch</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Contact <span style={{ color: '#A3B18A' }}>Us</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              {[
                { icon: MapPin, label: 'Address', value: '123 Education Road, Green Valley,\nNew Delhi – 110 001' },
                { icon: Phone, label: 'Phone', value: '+91 11 2345 6789' },
                { icon: Mail, label: 'Email', value: 'info@greenfieldacademy.edu.in' },
                { icon: Clock, label: 'Hours', value: 'Mon – Sat: 8:00 AM – 4:00 PM' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.1)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(88,129,87,0.15)' }}>
                    <Icon size={16} style={{ color: '#588157' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    <p style={{ fontSize: 13, color: '#DAD7CD', whiteSpace: 'pre-line', marginTop: 4 }}>{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Contact form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <form onSubmit={handleContactSubmit} className="p-6 rounded-2xl space-y-4"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)' }}>
                <div>
                  <label style={{ fontSize: 12, color: '#A3B18A', fontWeight: 600 }}>Full Name</label>
                  <input value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} required
                    placeholder="Your name"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#A3B18A', fontWeight: 600 }}>Email</label>
                  <input value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} required type="email"
                    placeholder="you@example.com"
                    className="w-full mt-1.5 px-4 py-3 rounded-xl outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#A3B18A', fontWeight: 600 }}>Message</label>
                  <textarea value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} required rows={4}
                    placeholder="Your message..."
                    className="w-full mt-1.5 px-4 py-3 rounded-xl outline-none transition-all resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 14 }} />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl text-white"
                  style={{ background: formSent ? '#3A5A40' : 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 600, fontSize: 14 }}>
                  {formSent ? '✓ Message Sent!' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-12 px-4 border-t" style={{ borderColor: 'rgba(163,177,138,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)' }}>
                  <GraduationCap size={16} className="text-white" />
                </div>
                <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>Greenfield Academy</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(218,215,205,0.5)', lineHeight: 1.7 }}>
                CBSE Affiliated School (Affil. No. 2730211)<br />Empowering excellence since 1994
              </p>
            </div>
            <div>
              <p className="text-white mb-3" style={{ fontSize: 13, fontWeight: 600 }}>Quick Links</p>
              <div className="space-y-2">
                {['Academic Calendar', 'Admission Process', 'Fee Structure', 'Results & Reports'].map(link => (
                  <p key={link} className="cursor-pointer transition-colors hover:text-[#A3B18A]" style={{ fontSize: 12, color: 'rgba(218,215,205,0.5)' }}>{link}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white mb-3" style={{ fontSize: 13, fontWeight: 600 }}>ERP Portal</p>
              <div className="space-y-2">
                {['Student Login', 'Teacher Portal', 'Parent Access', 'Admin Panel'].map(link => (
                  <p key={link} className="cursor-pointer transition-colors hover:text-[#A3B18A]" style={{ fontSize: 12, color: 'rgba(218,215,205,0.5)' }}>{link}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(163,177,138,0.1)' }}>
            <p style={{ fontSize: 11, color: 'rgba(218,215,205,0.35)' }}>© 2026 Greenfield Academy. All rights reserved.</p>
            <button onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
              style={{ background: 'rgba(88,129,87,0.2)', border: '1px solid rgba(88,129,87,0.3)', fontSize: 12 }}>
              <Shield size={12} /> Access SAP Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
