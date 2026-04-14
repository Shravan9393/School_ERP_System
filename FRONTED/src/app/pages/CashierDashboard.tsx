import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Download, CheckCircle, Clock, DollarSign, Receipt, Printer, Bell, TrendingUp, CreditCard, Users } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const MOCK_STUDENTS = [
  { id: 'S2024047', name: 'Arjun Sharma', class: '11-A', phone: '+91 98765 43210', outstanding: 35000, total: 85000, paid: 50000 },
  { id: 'S2024048', name: 'Priya Mehta', class: '11-B', phone: '+91 91234 56789', outstanding: 0, total: 85000, paid: 85000 },
  { id: 'S2024049', name: 'Rohit Gupta', class: '12-A', phone: '+91 87654 32109', outstanding: 20000, total: 90000, paid: 70000 },
  { id: 'S2024050', name: 'Ananya Singh', class: '12-B', phone: '+91 76543 21098', outstanding: 45000, total: 90000, paid: 45000 },
  { id: 'S2024051', name: 'Vikram Nair', class: '10-A', phone: '+91 65432 10987', outstanding: 0, total: 75000, paid: 75000 },
];

const paymentLogs = [
  { id: 'REC-2026-0142', student: 'Arjun Sharma', class: '11-A', date: '13 Apr 2026', amount: 10000, type: 'Term 2 Partial', method: 'UPI', status: 'verified', cashier: 'Mr. Suresh Rao' },
  { id: 'REC-2026-0141', student: 'Priya Mehta', class: '11-B', date: '12 Apr 2026', amount: 85000, type: 'Full Annual Fee', method: 'NEFT', status: 'verified', cashier: 'Mr. Suresh Rao' },
  { id: 'REC-2026-0140', student: 'Rohit Gupta', class: '12-A', date: '11 Apr 2026', amount: 25000, type: 'Term 2 Partial', method: 'Cash', status: 'verified', cashier: 'Mr. Suresh Rao' },
  { id: 'REC-2026-0139', student: 'Sneha Patel', class: '11-A', date: '10 Apr 2026', amount: 90000, type: 'Full Annual Fee', method: 'UPI', status: 'verified', cashier: 'Mr. Suresh Rao' },
  { id: 'REC-2026-0138', student: 'Karan Kapoor', class: '11-B', date: '9 Apr 2026', amount: 45000, type: 'Term 1 + Lab Fee', method: 'Cash', status: 'pending', cashier: 'Mr. Suresh Rao' },
];

const feeTypes = ['Tuition Fee – Term 1', 'Tuition Fee – Term 2', 'Exam Fee', 'Lab Fee', 'Sports Fee', 'Annual Activity Fee', 'Transport Fee (Monthly)'];

function GlassCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)', borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

export function CashierDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof MOCK_STUDENTS[0] | null>(null);
  const [payForm, setPayForm] = useState({ studentId: '', amount: '', type: feeTypes[0], method: 'Cash', ref: '' });
  const [paySuccess, setPaySuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredStudents = searchQuery.length > 1
    ? MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery) || s.class.includes(searchQuery))
    : [];

  const todayCollected = paymentLogs.filter(p => p.date === '13 Apr 2026').reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = MOCK_STUDENTS.reduce((sum, s) => sum + s.outstanding, 0);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 3500);
    setPayForm({ studentId: '', amount: '', type: feeTypes[0], method: 'Cash', ref: '' });
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} title="Cashier Portal"
      subtitle={`${user?.name} · Fee Collection & Payments`} notifications={1}>
      <div className="space-y-6">

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>Fee Collection Dashboard</h2>
              <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 2 }}>Monday, 13 April 2026</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Today's Collection", value: `₹${(todayCollected / 1000).toFixed(0)}K`, sub: 'April 13, 2026', icon: DollarSign, color: '#4ade80' },
                { label: 'Total Outstanding', value: `₹${(totalOutstanding / 1000).toFixed(0)}K`, sub: 'All students', icon: CreditCard, color: '#f87171' },
                { label: 'Payments Today', value: '2', sub: 'Transactions', icon: Receipt, color: '#fbbf24' },
                { label: 'Students w/ Dues', value: '3', sub: 'Need collection', icon: Users, color: '#5a6e8a' },
              ].map(({ label, value, sub, icon: Icon, color }) => (
                <motion.div key={label} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <GlassCard style={{ padding: 20 }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p style={{ fontSize: 11, color: '#A3B18A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                        <p className="text-white mt-1" style={{ fontSize: 26, fontWeight: 800 }}>{value}</p>
                        <p style={{ fontSize: 12, color: 'rgba(163,177,138,0.7)', marginTop: 2 }}>{sub}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Recent payments */}
            <GlassCard style={{ padding: 20 }}>
              <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Recent Transactions</p>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                      {['Receipt ID', 'Student', 'Class', 'Amount', 'Method', 'Status'].map(h => (
                        <th key={h} className="text-left pb-3 pr-4" style={{ color: '#A3B18A', fontWeight: 600, fontSize: 11 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentLogs.slice(0, 4).map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A', fontFamily: 'monospace', fontSize: 11 }}>{p.id}</td>
                        <td className="py-3 pr-4 text-white">{p.student}</td>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A' }}>{p.class}</td>
                        <td className="py-3 pr-4 text-white" style={{ fontWeight: 600 }}>₹{p.amount.toLocaleString()}</td>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A' }}>{p.method}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-lg" style={{ background: p.status === 'verified' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)', color: p.status === 'verified' ? '#4ade80' : '#fbbf24', fontSize: 10, fontWeight: 600 }}>
                            {p.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Search Student */}
        {activeTab === 'search' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Search Student</h2>
            <GlassCard style={{ padding: 20 }}>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(163,177,138,0.5)' }} />
                <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSelectedStudent(null); }}
                  placeholder="Search by name, student ID, or class..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 14 }} />
              </div>

              {filteredStudents.length > 0 && !selectedStudent && (
                <div className="mt-3 space-y-2">
                  {filteredStudents.map(student => (
                    <motion.button key={student.id} whileHover={{ x: 4 }} onClick={() => setSelectedStudent(student)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl text-left"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 700 }}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</p>
                        <p style={{ fontSize: 11, color: '#A3B18A' }}>ID: {student.id} · Class {student.class}</p>
                      </div>
                      {student.outstanding > 0 && (
                        <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>₹{student.outstanding.toLocaleString()} due</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {searchQuery.length > 1 && filteredStudents.length === 0 && (
                <p style={{ fontSize: 13, color: 'rgba(163,177,138,0.5)', textAlign: 'center', marginTop: 16 }}>No students found</p>
              )}
            </GlassCard>

            {selectedStudent && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard style={{ padding: 20 }}>
                  <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg text-white" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 800 }}>
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>{selectedStudent.name}</p>
                      <p style={{ fontSize: 12, color: '#A3B18A' }}>ID: {selectedStudent.id} · Class {selectedStudent.class}</p>
                      <p style={{ fontSize: 12, color: 'rgba(163,177,138,0.6)' }}>{selectedStudent.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                      <p style={{ fontSize: 11, color: '#A3B18A' }}>Total Fees</p>
                      <p className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>₹{selectedStudent.total.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
                      <p style={{ fontSize: 11, color: '#4ade80' }}>Paid</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>₹{selectedStudent.paid.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ background: selectedStudent.outstanding > 0 ? 'rgba(248,113,113,0.05)' : 'rgba(74,222,128,0.05)', border: `1px solid ${selectedStudent.outstanding > 0 ? 'rgba(248,113,113,0.15)' : 'rgba(74,222,128,0.15)'}` }}>
                      <p style={{ fontSize: 11, color: selectedStudent.outstanding > 0 ? '#f87171' : '#4ade80' }}>Outstanding</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: selectedStudent.outstanding > 0 ? '#f87171' : '#4ade80' }}>
                        {selectedStudent.outstanding > 0 ? `₹${selectedStudent.outstanding.toLocaleString()}` : 'Cleared'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setActiveTab('payment'); setPayForm(f => ({ ...f, studentId: selectedStudent.id })); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                      <DollarSign size={13} /> Record Payment
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#A3B18A', fontSize: 13 }}>
                      <Printer size={13} /> Print Statement
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Record Payment */}
        {activeTab === 'payment' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Record Payment</h2>
            {paySuccess && (
              <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
                <CheckCircle size={16} style={{ color: '#4ade80' }} />
                <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 500 }}>Payment recorded successfully! Receipt generated.</span>
              </div>
            )}
            <GlassCard style={{ padding: 24 }}>
              <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>Student ID</label>
                  <input value={payForm.studentId} onChange={e => setPayForm(f => ({ ...f, studentId: e.target.value }))} required
                    placeholder="e.g. S2024047"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
                  <input value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} required type="number" min="1"
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>Fee Type</label>
                  <select value={payForm.type} onChange={e => setPayForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(30,50,35,0.9)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }}>
                    {feeTypes.map(t => <option key={t} style={{ background: '#1a2e20' }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>Payment Method</label>
                  <div className="flex gap-2">
                    {['Cash', 'UPI', 'NEFT', 'DD'].map(method => (
                      <motion.button key={method} type="button" whileTap={{ scale: 0.95 }}
                        onClick={() => setPayForm(f => ({ ...f, method }))}
                        className="flex-1 py-3 rounded-xl transition-all"
                        style={{ background: payForm.method === method ? 'rgba(88,129,87,0.25)' : 'rgba(255,255,255,0.04)', border: `1px solid ${payForm.method === method ? 'rgba(88,129,87,0.5)' : 'rgba(163,177,138,0.1)'}`, color: payForm.method === method ? '#A3B18A' : 'rgba(163,177,138,0.5)', fontSize: 12, fontWeight: 600 }}>
                        {method}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>Transaction Ref. / Cheque No. (Optional)</label>
                  <input value={payForm.ref} onChange={e => setPayForm(f => ({ ...f, ref: e.target.value }))}
                    placeholder="UPI transaction ID or cheque number"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }} />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 14, fontWeight: 600 }}>
                    {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</> : <><CheckCircle size={14} />Record & Generate Receipt</>}
                  </motion.button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {/* Payment Logs */}
        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Payment Logs</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 rounded-xl outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 12 }}>
                  <option style={{ background: '#1a2e20' }}>All Methods</option>
                  <option style={{ background: '#1a2e20' }}>Cash</option>
                  <option style={{ background: '#1a2e20' }}>UPI</option>
                  <option style={{ background: '#1a2e20' }}>NEFT</option>
                </select>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#A3B18A', fontSize: 12 }}>
                  <Download size={13} /> Export
                </motion.button>
              </div>
            </div>
            <GlassCard style={{ padding: 16 }}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                      {['Receipt ID', 'Student', 'Date', 'Type', 'Method', 'Amount', 'Status', ''].map(h => (
                        <th key={h} className="text-left pb-3 pr-4" style={{ color: '#A3B18A', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentLogs.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A', fontFamily: 'monospace', fontSize: 10 }}>{p.id}</td>
                        <td className="py-3 pr-4">
                          <p className="text-white" style={{ fontWeight: 500 }}>{p.student}</p>
                          <p style={{ fontSize: 10, color: '#A3B18A' }}>{p.class}</p>
                        </td>
                        <td className="py-3 pr-4" style={{ color: '#DAD7CD', whiteSpace: 'nowrap' }}>{p.date}</td>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A', whiteSpace: 'nowrap' }}>{p.type}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg" style={{ background: 'rgba(88,129,87,0.15)', color: '#A3B18A', fontSize: 10, fontWeight: 600 }}>{p.method}</span>
                        </td>
                        <td className="py-3 pr-4 text-white" style={{ fontWeight: 600 }}>₹{p.amount.toLocaleString()}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg" style={{ background: p.status === 'verified' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)', color: p.status === 'verified' ? '#4ade80' : '#fbbf24', fontSize: 10, fontWeight: 600 }}>
                            {p.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="py-3">
                          <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(88,129,87,0.15)' }}>
                            <Download size={12} style={{ color: '#588157' }} />
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Receipts */}
        {activeTab === 'receipts' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Receipts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentLogs.map(p => (
                <motion.div key={p.id} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <GlassCard style={{ padding: 20 }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(88,129,87,0.2)' }}>
                        <Receipt size={16} style={{ color: '#A3B18A' }} />
                      </div>
                      <span className="px-2 py-0.5 rounded-lg" style={{ background: p.status === 'verified' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)', color: p.status === 'verified' ? '#4ade80' : '#fbbf24', fontSize: 10, fontWeight: 600 }}>
                        {p.status === 'verified' ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <p style={{ fontSize: 10, color: '#A3B18A', fontFamily: 'monospace' }}>{p.id}</p>
                    <p className="text-white mt-1" style={{ fontSize: 13, fontWeight: 600 }}>{p.student}</p>
                    <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 1 }}>{p.type}</p>
                    <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(163,177,138,0.1)' }}>
                      <p className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>₹{p.amount.toLocaleString()}</p>
                      <motion.button whileHover={{ scale: 1.1 }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                        style={{ background: 'rgba(88,129,87,0.15)', color: '#A3B18A', fontSize: 11 }}>
                        <Download size={12} /> Download
                      </motion.button>
                    </div>
                    <p style={{ fontSize: 10, color: 'rgba(163,177,138,0.5)', marginTop: 6 }}>{p.date} · {p.method} · {p.cashier}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Notifications</h2>
            {[
              { title: 'Online Payment – Verification Needed', msg: 'Karan Kapoor (11-B) made an online payment of ₹45,000 via UPI. Please verify.', time: '1 hour ago', icon: CreditCard, color: '#fbbf24' },
              { title: 'Fee Deadline Reminder', msg: 'Term 2 fee deadline is 30th April. 15 students have pending dues.', time: '1 day ago', icon: Bell, color: '#f87171' },
              { title: 'Day Closing Report', msg: 'Total collection on April 12: ₹1,10,000 (3 transactions)', time: '2 days ago', icon: TrendingUp, color: '#4ade80' },
            ].map((n, i) => {
              const Icon = n.icon;
              return (
                <motion.div key={i} whileHover={{ x: 4 }} className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${n.color}22` }}>
                    <Icon size={15} style={{ color: n.color }} />
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(218,215,205,0.7)', marginTop: 2 }}>{n.msg}</p>
                    <p style={{ fontSize: 10, color: 'rgba(163,177,138,0.5)', marginTop: 4 }}>{n.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
