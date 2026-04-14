import { useState, useId } from 'react';
import { motion } from 'motion/react';
import { Clock, CreditCard, CheckCircle, XCircle, Download, Upload, User, FileText, BookOpen } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const attendanceHistory = [
  { month: 'Nov', percent: 88 }, { month: 'Dec', percent: 82 }, { month: 'Jan', percent: 91 },
  { month: 'Feb', percent: 85 }, { month: 'Mar', percent: 91 }, { month: 'Apr', percent: 87 },
];

const dailyAttendance = [
  { date: 'Apr 1', status: 'P' }, { date: 'Apr 2', status: 'P' }, { date: 'Apr 3', status: 'A' },
  { date: 'Apr 4', status: 'P' }, { date: 'Apr 5', status: 'P' }, { date: 'Apr 7', status: 'P' },
  { date: 'Apr 8', status: 'P' }, { date: 'Apr 9', status: 'A' }, { date: 'Apr 10', status: 'P' },
  { date: 'Apr 11', status: 'P' }, { date: 'Apr 12', status: 'P' }, { date: 'Apr 13', status: 'P' },
];

const feeData = {
  total: 85000, paid: 50000, outstanding: 35000,
  history: [
    { id: 'PAY-001', date: '15 Jan 2026', amount: 25000, type: 'Term 1 Tuition Fee', method: 'UPI', status: 'paid' },
    { id: 'PAY-002', date: '10 Feb 2026', amount: 15000, type: 'Exam & Lab Fee', method: 'Cash', status: 'paid' },
    { id: 'PAY-003', date: '01 Apr 2026', amount: 10000, type: 'Sports & Activity Fee', method: 'UPI', status: 'paid' },
    { id: 'PAY-004', date: '30 Apr 2026', amount: 35000, type: 'Term 2 Tuition Fee', method: '-', status: 'due' },
  ],
};

const leaveApplications = [
  { id: 'L001', from: '5 Apr', to: '6 Apr', days: 2, reason: 'Medical – Fever', status: 'approved', doc: 'medical_cert.pdf' },
  { id: 'L002', from: '20 Mar', to: '20 Mar', days: 1, reason: 'Family function', status: 'approved', doc: null },
  { id: 'L003', from: '25 Apr', to: '26 Apr', days: 2, reason: 'Pending', status: 'pending', doc: null },
];

const subjects = [
  { name: 'Physics', marks: 88, max: 100 }, { name: 'Chemistry', marks: 82, max: 100 },
  { name: 'Mathematics', marks: 94, max: 100 }, { name: 'English', marks: 79, max: 100 },
  { name: 'Computer Sc.', marks: 96, max: 100 },
];

const notifications = [
  { id: 1, type: 'fee', title: 'Fee Reminder', msg: 'Term 2 fee of ₹35,000 due on 30th April 2026', time: '2 hours ago', read: false },
  { id: 2, type: 'attendance', title: 'Attendance Alert', msg: 'You were absent on 9th April. Kindly submit explanation.', time: '1 day ago', read: false },
  { id: 3, type: 'leave', title: 'Leave Approved', msg: 'Your leave request (L001) has been approved by Mrs. Singh', time: '3 days ago', read: true },
  { id: 4, type: 'academic', title: 'Term 2 Exams', msg: 'Mid-term exams scheduled from 28th April – 5th May', time: '5 days ago', read: true },
];

function GlassCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className}
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)', borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <GlassCard style={{ padding: 20 }}>
        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontSize: 11, color: '#A3B18A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
            <p className="text-white mt-1" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</p>
            {sub && <p style={{ fontSize: 12, color: 'rgba(163,177,138,0.7)', marginTop: 2 }}>{sub}</p>}
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
            <Icon size={18} style={{ color }} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [leaveForm, setLeaveForm] = useState({ from: '', to: '', reason: '', doc: null as File | null });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);
  const attendancePercent = 87;
  const presentDays = dailyAttendance.filter(d => d.status === 'P').length;

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setLeaveSubmitting(false);
    setLeaveSuccess(true);
    setTimeout(() => setLeaveSuccess(false), 3000);
    setLeaveForm({ from: '', to: '', reason: '', doc: null });
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="Student Portal"
      subtitle={`${user?.name} · Class ${user?.class} · Roll No: ${user?.id}`}
      notifications={2}>
      <div className="space-y-6">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Greeting */}
            <div>
              <h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>Good morning, {user?.name?.split(' ')[0]} 👋</h2>
              <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 2 }}>Monday, April 13, 2026 · Class 11-A · Academic Year 2025–26</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard icon={Clock} label="Attendance" value="87%" sub="April 2026" color="#588157" />
              <StatCard icon={CreditCard} label="Outstanding Fees" value="₹35K" sub="Due 30th April" color="#e05252" />
              <StatCard icon={BookOpen} label="Avg Marks" value="87.8%" sub="Last Term" color="#4a7c6f" />
              <StatCard icon={FileText} label="Leaves Taken" value="3" sub="This semester" color="#7a6a4a" />
            </div>

            {/* Attendance chart + subjects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard style={{ padding: 20 }}>
                <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Attendance Trend</p>
                <MiniAreaChart data={attendanceHistory} dataKey="percent" height={160} />
              </GlassCard>

              <GlassCard style={{ padding: 20 }}>
                <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Subject Marks</p>
                <div className="space-y-3">
                  {subjects.map(s => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: 12, color: '#A3B18A' }}>{s.name}</span>
                        <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>{s.marks}/{s.max}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.marks}%` }} transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #588157, #A3B18A)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: 'Attendance', tab: 'attendance', color: '#588157' },
                { icon: CreditCard, label: 'Pay Fees', tab: 'fees', color: '#e05252' },
                { icon: FileText, label: 'Apply Leave', tab: 'leave', color: '#4a7c6f' },
                { icon: User, label: 'My Profile', tab: 'profile', color: '#5a6e8a' },
              ].map(({ icon: Icon, label, tab, color }) => (
                <motion.button key={tab} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(tab)}
                  className="flex flex-col items-center gap-2 py-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.1)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#DAD7CD', fontWeight: 500 }}>{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Attendance Record</h2>
            <div className="grid grid-cols-3 gap-3">
              <GlassCard style={{ padding: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#A3B18A' }}>Monthly %</p>
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{attendancePercent}%</p>
                <p style={{ fontSize: 11, color: '#A3B18A' }}>April 2026</p>
              </GlassCard>
              <GlassCard style={{ padding: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#A3B18A' }}>Present Days</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#4ade80' }}>{presentDays}</p>
                <p style={{ fontSize: 11, color: '#A3B18A' }}>of {dailyAttendance.length} days</p>
              </GlassCard>
              <GlassCard style={{ padding: 16, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#A3B18A' }}>Absent Days</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#f87171' }}>{dailyAttendance.filter(d => d.status === 'A').length}</p>
                <p style={{ fontSize: 11, color: '#A3B18A' }}>This month</p>
              </GlassCard>
            </div>

            {/* Daily grid */}
            <GlassCard style={{ padding: 20 }}>
              <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Daily Attendance – April 2026</p>
              <div className="flex flex-wrap gap-2">
                {dailyAttendance.map(d => (
                  <div key={d.date} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: d.status === 'P' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', border: `1px solid ${d.status === 'P' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
                      {d.status === 'P' ? <CheckCircle size={16} style={{ color: '#4ade80' }} /> : <XCircle size={16} style={{ color: '#f87171' }} />}
                    </div>
                    <span style={{ fontSize: 9, color: '#A3B18A' }}>{d.date.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Monthly chart */}
            <GlassCard style={{ padding: 20 }}>
              <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Monthly Attendance History</p>
              <MiniAreaChart data={attendanceHistory} dataKey="percent" height={200} showDots />
            </GlassCard>
          </motion.div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Fee Portal</h2>

            {/* Fee summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <GlassCard style={{ padding: 20 }}>
                <p style={{ fontSize: 11, color: '#A3B18A' }}>Total Fees (Annual)</p>
                <p className="text-white" style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>₹{feeData.total.toLocaleString()}</p>
              </GlassCard>
              <GlassCard style={{ padding: 20 }}>
                <p style={{ fontSize: 11, color: '#4ade80' }}>Amount Paid</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#4ade80', marginTop: 4 }}>₹{feeData.paid.toLocaleString()}</p>
              </GlassCard>
              <GlassCard style={{ padding: 20 }}>
                <p style={{ fontSize: 11, color: '#f87171' }}>Outstanding</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#f87171', marginTop: 4 }}>₹{feeData.outstanding.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: '#f87171', marginTop: 2 }}>Due: 30 Apr 2026</p>
              </GlassCard>
            </div>

            {/* Progress */}
            <GlassCard style={{ padding: 20 }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white" style={{ fontSize: 14, fontWeight: 600 }}>Payment Progress</p>
                <span style={{ fontSize: 12, color: '#A3B18A' }}>{Math.round((feeData.paid / feeData.total) * 100)}% paid</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(feeData.paid / feeData.total) * 100}%` }} transition={{ duration: 1 }}
                  className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #588157, #4ade80)' }} />
              </div>
            </GlassCard>

            {/* Pay online button */}
            <GlassCard style={{ padding: 20 }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white" style={{ fontSize: 14, fontWeight: 600 }}>Pay Online</p>
                  <p style={{ fontSize: 12, color: '#A3B18A', marginTop: 2 }}>Outstanding: ₹35,000 · Due 30th April 2026</p>
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-5 py-2.5 rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                    Pay via UPI
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-5 py-2.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(163,177,138,0.2)', fontSize: 13, color: '#A3B18A' }}>
                    Net Banking
                  </motion.button>
                </div>
              </div>
            </GlassCard>

            {/* Payment history */}
            <GlassCard style={{ padding: 20 }}>
              <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Payment History</p>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                      {['Ref ID', 'Date', 'Description', 'Method', 'Amount', 'Status', ''].map(h => (
                        <th key={h} className="text-left pb-3" style={{ color: '#A3B18A', fontWeight: 600, paddingRight: 16, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {feeData.history.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                        <td className="py-3" style={{ color: '#A3B18A', paddingRight: 16 }}>{p.id}</td>
                        <td className="py-3" style={{ color: '#DAD7CD', paddingRight: 16, whiteSpace: 'nowrap' }}>{p.date}</td>
                        <td className="py-3" style={{ color: '#DAD7CD', paddingRight: 16, whiteSpace: 'nowrap' }}>{p.type}</td>
                        <td className="py-3" style={{ color: '#A3B18A', paddingRight: 16 }}>{p.method}</td>
                        <td className="py-3 text-white" style={{ paddingRight: 16, fontWeight: 600, whiteSpace: 'nowrap' }}>₹{p.amount.toLocaleString()}</td>
                        <td className="py-3" style={{ paddingRight: 16 }}>
                          <span className="px-2 py-1 rounded-lg" style={{ background: p.status === 'paid' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: p.status === 'paid' ? '#4ade80' : '#f87171', fontSize: 10, fontWeight: 600 }}>
                            {p.status === 'paid' ? 'Paid' : 'Due'}
                          </span>
                        </td>
                        <td className="py-3">
                          {p.status === 'paid' && (
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(88,129,87,0.15)' }}>
                              <Download size={12} style={{ color: '#588157' }} />
                            </motion.button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Leave Tab */}
        {activeTab === 'leave' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Leave Management</h2>

            {/* Apply form */}
            <GlassCard style={{ padding: 20 }}>
              <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Apply for Leave</p>
              {leaveSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <CheckCircle size={14} style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: 12, color: '#4ade80' }}>Leave application submitted successfully! Awaiting teacher approval.</span>
                </div>
              )}
              <form onSubmit={handleLeaveSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600 }}>From Date</label>
                  <input type="date" value={leaveForm.from} onChange={e => setLeaveForm(f => ({ ...f, from: e.target.value }))} required
                    className="w-full mt-1 px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600 }}>To Date</label>
                  <input type="date" value={leaveForm.to} onChange={e => setLeaveForm(f => ({ ...f, to: e.target.value }))} required
                    className="w-full mt-1 px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }} />
                </div>
                <div className="sm:col-span-2">
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600 }}>Reason</label>
                  <textarea value={leaveForm.reason} onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))} required rows={3}
                    placeholder="State your reason for leave..."
                    className="w-full mt-1 px-4 py-3 rounded-xl outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }} />
                </div>
                <div className="sm:col-span-2">
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600 }}>Upload Supporting Document (Optional)</label>
                  <div className="mt-1 flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(163,177,138,0.2)' }}>
                    <Upload size={16} style={{ color: '#A3B18A' }} />
                    <span style={{ fontSize: 12, color: 'rgba(163,177,138,0.6)' }}>
                      {leaveForm.doc ? (leaveForm.doc as File).name : 'Click or drag to upload medical certificate, etc.'}
                    </span>
                    <input type="file" className="hidden" onChange={e => setLeaveForm(f => ({ ...f, doc: e.target.files?.[0] || null }))} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={leaveSubmitting}
                    className="px-6 py-3 rounded-xl text-white flex items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                    {leaveSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</> : <><FileText size={14} />Submit Application</>}
                  </motion.button>
                </div>
              </form>
            </GlassCard>

            {/* Leave history */}
            <GlassCard style={{ padding: 20 }}>
              <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Application History</p>
              <div className="space-y-3">
                {leaveApplications.map(leave => (
                  <div key={leave.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(163,177,138,0.08)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: leave.status === 'approved' ? 'rgba(74,222,128,0.15)' : leave.status === 'pending' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)' }}>
                      {leave.status === 'approved' ? <CheckCircle size={14} style={{ color: '#4ade80' }} /> : leave.status === 'pending' ? <Clock size={14} style={{ color: '#fbbf24' }} /> : <XCircle size={14} style={{ color: '#f87171' }} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white" style={{ fontSize: 13, fontWeight: 500 }}>{leave.reason}</p>
                      <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 1 }}>{leave.from} → {leave.to} · {leave.days} day{leave.days > 1 ? 's' : ''}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg" style={{ background: leave.status === 'approved' ? 'rgba(74,222,128,0.1)' : leave.status === 'pending' ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)', color: leave.status === 'approved' ? '#4ade80' : leave.status === 'pending' ? '#fbbf24' : '#f87171', fontSize: 11, fontWeight: 600 }}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                    <span style={{ fontSize: 10, color: '#A3B18A' }}>{leave.id}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>My Profile</h2>
            <GlassCard style={{ padding: 20 }}>
              <div className="flex items-center gap-5 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 800 }}>
                  {user?.avatar}
                </div>
                <div>
                  <p className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</p>
                  <p style={{ fontSize: 12, color: '#A3B18A', marginTop: 2 }}>Class {user?.class} · Roll No: {user?.id}</p>
                  <span className="px-2 py-0.5 rounded-md mt-1 inline-block" style={{ background: 'rgba(88,129,87,0.2)', color: '#A3B18A', fontSize: 10, fontWeight: 600 }}>STUDENT</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['Full Name', user?.name],
                  ['Student ID', user?.id],
                  ['Class & Section', user?.class],
                  ['Email', user?.email],
                  ['Date of Birth', '15 March 2008'],
                  ['Guardian Name', 'Mr. Rajesh Sharma'],
                  ['Guardian Phone', '+91 98765 43210'],
                  ['Blood Group', 'O+'],
                  ['Admission Year', '2019'],
                  ['Stream', 'Science (PCM)'],
                ].map(([label, value]) => (
                  <div key={label} className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(163,177,138,0.08)' }}>
                    <p style={{ fontSize: 10, color: '#A3B18A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                    <p className="text-white mt-1" style={{ fontSize: 13 }}>{value || '—'}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'rgba(163,177,138,0.5)', marginTop: 16 }}>* Profile details are read-only. Contact admin for changes.</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Notifications</h2>
            {notifications.map(notif => (
              <motion.div key={notif.id} whileHover={{ x: 4 }}
                className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer"
                style={{ background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(88,129,87,0.08)', border: `1px solid ${notif.read ? 'rgba(163,177,138,0.06)' : 'rgba(88,129,87,0.2)'}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: notif.type === 'fee' ? 'rgba(248,113,113,0.15)' : notif.type === 'attendance' ? 'rgba(251,191,36,0.15)' : 'rgba(88,129,87,0.15)' }}>
                  {notif.type === 'fee' ? <CreditCard size={15} style={{ color: '#f87171' }} /> : notif.type === 'attendance' ? <Clock size={15} style={{ color: '#fbbf24' }} /> : <CheckCircle size={15} style={{ color: '#4ade80' }} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{notif.title}</p>
                    {!notif.read && <div className="w-2 h-2 rounded-full" style={{ background: '#588157' }} />}
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(218,215,205,0.7)', marginTop: 2, lineHeight: 1.5 }}>{notif.msg}</p>
                  <p style={{ fontSize: 10, color: 'rgba(163,177,138,0.5)', marginTop: 4 }}>{notif.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Lightweight custom area chart – avoids recharts key collision entirely
function MiniAreaChart({ data, dataKey, color = '#588157', height = 160, showDots = false }: {
  data: Record<string, any>[];
  dataKey: string;
  color?: string;
  height?: number;
  showDots?: boolean;
}) {
  const uid = useId();
  const gradId = `mini-grad-${uid}`;
  const values = data.map(d => Number(d[dataKey]));
  const labels = data.map(d => d.month ?? d.label ?? '');
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const W = 400;
  const H = height;
  const PAD = { top: 10, right: 10, bottom: 24, left: 30 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const toX = (i: number) => PAD.left + (i / (values.length - 1)) * chartW;
  const toY = (v: number) => PAD.top + chartH - ((v - min) / (max - min)) * chartH;

  const linePts = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const areaPath = `M ${toX(0)},${toY(values[0])} ` +
    values.slice(1).map((v, i) => `L ${toX(i + 1)},${toY(v)}`).join(' ') +
    ` L ${toX(values.length - 1)},${PAD.top + chartH} L ${toX(0)},${PAD.top + chartH} Z`;

  // Y-axis ticks
  const yTicks = [min + 4, Math.round((min + max) / 2), max - 4];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <line key={`grid-${i}`} x1={PAD.left} x2={PAD.left + chartW} y1={toY(t)} y2={toY(t)}
          stroke="rgba(163,177,138,0.08)" strokeDasharray="3 3" />
      ))}
      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <polyline points={linePts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {showDots && values.map((v, i) => (
        <circle key={`dot-${i}`} cx={toX(i)} cy={toY(v)} r={4} fill={color} />
      ))}
      {/* X-axis labels */}
      {labels.map((l, i) => (
        <text key={`xlabel-${i}`} x={toX(i)} y={H - 4} textAnchor="middle" fill="#A3B18A" fontSize={11}>{l}</text>
      ))}
      {/* Y-axis labels */}
      {yTicks.map((t, i) => (
        <text key={`ylabel-${i}`} x={PAD.left - 6} y={toY(t) + 4} textAnchor="end" fill="#A3B18A" fontSize={11}>{t}</text>
      ))}
    </svg>
  );
}