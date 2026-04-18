import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Download, CheckCircle, Clock, DollarSign, Receipt, Printer, Bell,
  TrendingUp, CreditCard, Users, Grid3x3, ChevronRight, User, Phone, X, Calendar
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CLASSES = [
  { id: 'nursery-a', name: 'Nursery-A', students: 25 },
  { id: 'nursery-b', name: 'Nursery-B', students: 24 },
  { id: '1-a',  name: '1-A',  students: 30 }, { id: '1-b',  name: '1-B',  students: 28 },
  { id: '2-a',  name: '2-A',  students: 32 }, { id: '2-b',  name: '2-B',  students: 30 },
  { id: '3-a',  name: '3-A',  students: 28 }, { id: '3-b',  name: '3-B',  students: 29 },
  { id: '4-a',  name: '4-A',  students: 31 }, { id: '4-b',  name: '4-B',  students: 30 },
  { id: '5-a',  name: '5-A',  students: 33 }, { id: '5-b',  name: '5-B',  students: 32 },
  { id: '6-a',  name: '6-A',  students: 34 }, { id: '6-b',  name: '6-B',  students: 33 },
  { id: '7-a',  name: '7-A',  students: 35 }, { id: '7-b',  name: '7-B',  students: 34 },
  { id: '8-a',  name: '8-A',  students: 36 }, { id: '8-b',  name: '8-B',  students: 35 },
  { id: '9-a',  name: '9-A',  students: 38 }, { id: '9-b',  name: '9-B',  students: 37 },
  { id: '10-a', name: '10-A', students: 40 }, { id: '10-b', name: '10-B', students: 39 },
  { id: '11-m', name: '11-M (Math)',       students: 25 },
  { id: '11-b', name: '11-B (Biology)',    students: 22 },
  { id: '11-c', name: '11-C (Commerce)',   students: 28 },
  { id: '11-a', name: '11-A (Arts)',       students: 20 },
  { id: '12-m', name: '12-M (Math)',       students: 24 },
  { id: '12-b', name: '12-B (Biology)',    students: 21 },
  { id: '12-c', name: '12-C (Commerce)',   students: 27 },
  { id: '12-a', name: '12-A (Arts)',       students: 19 },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentMode = 'Cash' | 'UPI' | 'Online' | 'NEFT' | 'DD';

interface Student {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  fatherName: string;
  motherName: string;
  phone: string;
  photo?: string;
  outstanding: number;
  total: number;
  paid: number;
}

interface Payment {
  id: string;
  date: string;
  time: string;
  amount: number;
  mode: PaymentMode;
  status: 'verified' | 'pending';
  receiptId: string;
  type: string;
  ref?: string;
}

// FIX 1: payForm.mode was typed `as const` on the initial value but the setter
// accepted `string` for `mode`, causing implicit `any` / type-unsafe assignment.
// Defined a proper PaymentFormState type so mode is always PaymentMode.
interface PaymentFormState {
  amount: string;
  type: string;
  mode: PaymentMode;
  ref: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_STUDENTS: Student[] = [
  { id: 'S2024047', rollNo: '001', name: 'Arjun Sharma',  class: '11-A', fatherName: 'Mr. Rajesh Sharma', motherName: 'Mrs. Priya Sharma',  phone: '+91 98765 43210', outstanding: 35000, total: 85000, paid: 50000 },
  { id: 'S2024048', rollNo: '002', name: 'Priya Mehta',   class: '11-A', fatherName: 'Mr. Amit Mehta',    motherName: 'Mrs. Neha Mehta',    phone: '+91 91234 56789', outstanding: 0,     total: 85000, paid: 85000 },
  { id: 'S2024049', rollNo: '003', name: 'Rohit Gupta',   class: '11-A', fatherName: 'Mr. Suresh Gupta',  motherName: 'Mrs. Kavita Gupta',  phone: '+91 87654 32109', outstanding: 20000, total: 85000, paid: 65000 },
  { id: 'S2024050', rollNo: '004', name: 'Ananya Singh',  class: '11-A', fatherName: 'Mr. Vikram Singh',  motherName: 'Mrs. Meera Singh',   phone: '+91 76543 21098', outstanding: 45000, total: 85000, paid: 40000 },
  { id: 'S2024051', rollNo: '005', name: 'Vikram Nair',   class: '11-A', fatherName: 'Mr. Arun Nair',     motherName: 'Mrs. Lakshmi Nair',  phone: '+91 65432 10987', outstanding: 0,     total: 85000, paid: 85000 },
  { id: 'S2024052', rollNo: '006', name: 'Sneha Patel',   class: '11-A', fatherName: 'Mr. Kiran Patel',   motherName: 'Mrs. Anjali Patel',  phone: '+91 98123 45678', outstanding: 10000, total: 85000, paid: 75000 },
  { id: 'S2024053', rollNo: '007', name: 'Karan Kapoor',  class: '11-A', fatherName: 'Mr. Deepak Kapoor', motherName: 'Mrs. Ritu Kapoor',   phone: '+91 87123 45678', outstanding: 25000, total: 85000, paid: 60000 },
  { id: 'S2024054', rollNo: '008', name: 'Isha Reddy',    class: '11-A', fatherName: 'Mr. Ramesh Reddy',  motherName: 'Mrs. Swati Reddy',   phone: '+91 76123 45678', outstanding: 0,     total: 85000, paid: 85000 },
];

const STUDENT_PAYMENTS: Record<string, Record<string, Payment[]>> = {
  'S2024047': {
    '2025-2026': [
      { id: '1', date: '2026-04-13', time: '10:30 AM', amount: 25000, mode: 'UPI',  status: 'verified', receiptId: 'REC-2026-0142', type: 'Term 1 Tuition Fee',           ref: 'UPI2026041310301234' },
      { id: '2', date: '2026-02-15', time: '11:45 AM', amount: 25000, mode: 'Cash', status: 'verified', receiptId: 'REC-2026-0098', type: 'Admission Fee + Term 1 Partial' },
    ],
    '2024-2025': [
      { id: '3', date: '2025-11-20', time: '02:15 PM', amount: 40000, mode: 'NEFT', status: 'verified', receiptId: 'REC-2025-0876', type: 'Term 2 Full Fee' },
      { id: '4', date: '2025-07-10', time: '09:30 AM', amount: 45000, mode: 'Cash', status: 'verified', receiptId: 'REC-2025-0412', type: 'Annual Fee + Lab' },
    ],
  },
  'S2024048': {
    '2025-2026': [
      { id: '5', date: '2026-04-12', time: '03:20 PM', amount: 85000, mode: 'Online', status: 'verified', receiptId: 'REC-2026-0141', type: 'Full Annual Fee' },
    ],
  },
  'S2024049': {
    '2025-2026': [
      { id: '6', date: '2026-04-11', time: '01:10 PM', amount: 25000, mode: 'Cash', status: 'verified', receiptId: 'REC-2026-0140', type: 'Term 2 Partial' },
      { id: '7', date: '2026-01-20', time: '10:00 AM', amount: 40000, mode: 'UPI',  status: 'verified', receiptId: 'REC-2026-0045', type: 'Term 1 Fee' },
    ],
  },
};

const TODAY_TRANSACTIONS = [
  { id: 'REC-2026-0142', student: 'Arjun Sharma', studentId: 'S2024047', class: '11-A', amount: 25000, time: '10:30 AM', mode: 'UPI'    as PaymentMode },
  { id: 'REC-2026-0141', student: 'Priya Mehta',  studentId: 'S2024048', class: '11-A', amount: 85000, time: '03:20 PM', mode: 'Online' as PaymentMode },
];

const FEE_TYPES = [
  'Tuition Fee – Term 1', 'Tuition Fee – Term 2', 'Exam Fee', 'Lab Fee',
  'Sports Fee', 'Annual Activity Fee', 'Transport Fee (Monthly)', 'Admission Fee',
];

const PAYMENT_METHODS: PaymentMode[] = ['Cash', 'UPI', 'Online', 'NEFT'];

// FIX 2: Session options were hard-coded as display strings ("2025–2026") using
// an en-dash (–) in the <option> labels but compared against state values using
// a hyphen-minus ("2025-2026") as the key in STUDENT_PAYMENTS. This meant the
// select could never match a real key, so payment history was always empty.
// Fixed by using a consistent hyphen-minus key throughout and rendering a
// separate display label only in the <option> text.
const SESSION_OPTIONS: { value: string; label: string }[] = [
  { value: '2025-2026', label: '2025–2026' },
  { value: '2024-2025', label: '2024–2025' },
  { value: '2023-2024', label: '2023–2024' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('');
}

// FIX 3: Class matching was unreliable — `selectedClass` stored the display
// name (e.g. "11-A (Arts)") but the filter compared it directly against
// student.class (e.g. "11-A") after a fragile `.replace('class-', '')` strip
// that only worked for numeric classes, silently returning 0 students for
// every stream class (11-M, 11-B, 12-C, etc.). Fixed with a dedicated helper.
function matchesClass(student: Student, selectedClass: string): boolean {
  // selectedClass is the CLASSES[i].name, e.g. "11-A (Arts)" or "3-A"
  // student.class is the compact form, e.g. "11-A" or "3-A"
  // Strip the parenthetical stream suffix before comparing.
  const normalized = selectedClass.replace(/\s*\(.*\)$/, '').trim();
  return student.class.toLowerCase() === normalized.toLowerCase();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function GlassCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)', borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CashierDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]           = useState('overview');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedClass, setSelectedClass]   = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSession, setSelectedSession] = useState('2025-2026');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // FIX 1: mode is now properly typed as PaymentMode, not a plain string
  const [payForm, setPayForm] = useState<PaymentFormState>({ amount: '', type: FEE_TYPES[0], mode: 'Cash', ref: '' });
  const [paySuccess, setPaySuccess] = useState(false);
  const [saving, setSaving]         = useState(false);

  // FIX 4: searchQuery threshold was `> 1` (i.e. needs 2+ chars) — this is
  // intentional debounce behaviour, but the empty-state message fired at
  // length > 1 too, so typing a single character showed neither results nor
  // "No students found". Aligned both branches to the same `>= 2` threshold.
  const filteredStudents = searchQuery.length >= 2
    ? MOCK_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery) ||
        s.class.includes(searchQuery) ||
        s.rollNo.includes(searchQuery)
      )
    : [];

  // FIX 3: use the corrected matchesClass helper instead of the broken strip
  const classStudents = selectedClass
    ? MOCK_STUDENTS.filter(s => matchesClass(s, selectedClass))
    : [];

  const todayCollected   = TODAY_TRANSACTIONS.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = MOCK_STUDENTS.reduce((sum, s) => sum + s.outstanding, 0);

  // FIX 5: handlePaymentSubmit was defined inline without useCallback, causing
  // a new function reference on every render — this is fine functionally but
  // wasteful given how deep it's passed (into the modal form). Wrapped it.
  const handlePaymentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise<void>(r => setTimeout(r, 1200));
    setSaving(false);
    setPaySuccess(true);
    setShowPaymentModal(false);
    setTimeout(() => setPaySuccess(false), 3500);
    setPayForm({ amount: '', type: FEE_TYPES[0], mode: 'Cash', ref: '' });
  }, []);

  const openStudentDetail = useCallback((student: Student) => {
    setSelectedStudent(student);
    setActiveTab('student-detail');
  }, []);

  // FIX 2: Now correctly looks up payments because selectedSession uses
  // hyphen-minus keys that match STUDENT_PAYMENTS keys exactly.
  const studentPayments = selectedStudent
    ? (STUDENT_PAYMENTS[selectedStudent.id]?.[selectedSession] ?? [])
    : [];

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="Cashier Portal"
      subtitle={`${user?.name} · Fee Collection & Payments`}
      notifications={1}
    >
      <div className="space-y-6">

        {/* ── Overview ──────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h2>
              <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 2 }}>Saturday, April 18, 2026</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Today's Collection",  value: `₹${(todayCollected / 1000).toFixed(0)}K`,   sub: 'April 18, 2026',      icon: DollarSign, color: '#4ade80' },
                { label: 'Total Outstanding',   value: `₹${(totalOutstanding / 1000).toFixed(0)}K`, sub: 'All students',        icon: CreditCard, color: '#f87171' },
                { label: 'Transactions Today',  value: String(TODAY_TRANSACTIONS.length),            sub: 'Payments recorded',   icon: Receipt,    color: '#fbbf24' },
                { label: 'Students w/ Dues',    value: String(MOCK_STUDENTS.filter(s => s.outstanding > 0).length), sub: 'Need collection', icon: Users, color: '#5a6e8a' },
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

            {/* Quick Actions */}
            <div>
              <p className="text-white mb-3" style={{ fontSize: 14, fontWeight: 600 }}>Quick Actions</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Search Student',        icon: Search,   tab: 'search',  color: '#588157' },
                  { label: 'View Classes',           icon: Grid3x3,  tab: 'classes', color: '#4a7c6f' },
                  { label: "Today's Transactions",   icon: Clock,    tab: 'today',   color: '#fbbf24' },
                  { label: 'Payment Logs',           icon: Receipt,  tab: 'logs',    color: '#5a6e8a' },
                ].map(({ label, icon: Icon, tab, color }) => (
                  <motion.button key={tab} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab)}
                    className="flex flex-col items-center gap-3 py-6 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.1)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#DAD7CD', fontWeight: 500 }}>{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <GlassCard style={{ padding: 20 }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white" style={{ fontSize: 14, fontWeight: 600 }}>Recent Transactions</p>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActiveTab('logs')}
                  style={{ fontSize: 12, color: '#A3B18A', fontWeight: 500 }}>
                  View All →
                </motion.button>
              </div>
              <div className="space-y-2">
                {TODAY_TRANSACTIONS.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(163,177,138,0.06)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.15)' }}>
                      <CheckCircle size={16} style={{ color: '#4ade80' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{t.student}</p>
                      <p style={{ fontSize: 11, color: '#A3B18A' }}>{t.class} · {t.mode} · {t.time}</p>
                    </div>
                    <p className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>₹{t.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Classes & Sections ────────────────────────────────────────── */}
        {activeTab === 'classes' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {!selectedClass ? (
              <>
                <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Classes &amp; Sections</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {CLASSES.map(cls => (
                    <motion.button key={cls.id} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedClass(cls.name)}
                      className="p-5 rounded-2xl text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(163,177,138,0.12)' }}>
                      <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)' }}>
                        <Grid3x3 size={20} className="text-white" />
                      </div>
                      <p className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>{cls.name}</p>
                      <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 2 }}>{cls.students} students</p>
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ x: -3 }} onClick={() => setSelectedClass(null)}
                    className="p-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)' }}>
                    <ChevronRight size={16} style={{ color: '#A3B18A', transform: 'rotate(180deg)' }} />
                  </motion.button>
                  <div>
                    <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Class {selectedClass}</h2>
                    {/* FIX 3: classStudents is now correct for all classes */}
                    <p style={{ fontSize: 12, color: '#A3B18A' }}>{classStudents.length} students</p>
                  </div>
                </div>

                <GlassCard style={{ padding: 20 }}>
                  <div className="space-y-2">
                    {classStudents.map(student => (
                      <motion.button key={student.id} whileHover={{ x: 4 }} onClick={() => openStudentDetail(student)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl text-left"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 700 }}>
                          {student.rollNo}
                        </div>
                        <div className="flex-1">
                          <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</p>
                          <p style={{ fontSize: 11, color: '#A3B18A' }}>Roll {student.rollNo} · ID: {student.id}</p>
                        </div>
                        {student.outstanding > 0 && (
                          <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>
                            ₹{student.outstanding.toLocaleString()} due
                          </span>
                        )}
                        <ChevronRight size={16} style={{ color: '#A3B18A' }} />
                      </motion.button>
                    ))}

                    {/* FIX 6: Missing empty state — when a class has no matching
                        mock students the list was silently blank with no feedback. */}
                    {classStudents.length === 0 && (
                      <p style={{ fontSize: 13, color: 'rgba(163,177,138,0.5)', textAlign: 'center', padding: '32px 0' }}>
                        No students found for this class.
                      </p>
                    )}
                  </div>
                </GlassCard>
              </>
            )}
          </motion.div>
        )}

        {/* ── Search Student ────────────────────────────────────────────── */}
        {activeTab === 'search' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Search Student</h2>
            <GlassCard style={{ padding: 20 }}>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(163,177,138,0.5)' }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, roll number, student ID, or class..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 14 }}
                />
              </div>

              {filteredStudents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {filteredStudents.map(student => (
                    <motion.button key={student.id} whileHover={{ x: 4 }} onClick={() => openStudentDetail(student)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl text-left"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 700 }}>
                        {getInitials(student.name)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</p>
                        <p style={{ fontSize: 11, color: '#A3B18A' }}>Roll {student.rollNo} · Class {student.class} · ID: {student.id}</p>
                      </div>
                      {student.outstanding > 0 && (
                        <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>
                          ₹{student.outstanding.toLocaleString()} due
                        </span>
                      )}
                      <ChevronRight size={16} style={{ color: '#A3B18A' }} />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* FIX 4: Aligned empty-state threshold to >= 2 so it fires
                  consistently with the filteredStudents logic above */}
              {searchQuery.length >= 2 && filteredStudents.length === 0 && (
                <p style={{ fontSize: 13, color: 'rgba(163,177,138,0.5)', textAlign: 'center', marginTop: 16 }}>
                  No students found
                </p>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* ── Student Detail ────────────────────────────────────────────── */}
        {activeTab === 'student-detail' && selectedStudent && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {paySuccess && (
              <div className="flex items-center gap-2 p-4 rounded-xl"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
                <CheckCircle size={16} style={{ color: '#4ade80' }} />
                <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 500 }}>
                  Payment recorded successfully! Receipt generated.
                </span>
              </div>
            )}

            {/* Profile Card */}
            <GlassCard style={{ padding: 24 }}>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 800 }}>
                  {getInitials(selectedStudent.name)}
                </div>

                <div className="flex-1">
                  <p className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>{selectedStudent.name}</p>
                  <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 2 }}>
                    Class {selectedStudent.class} · Roll No: {selectedStudent.rollNo}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <User size={14} style={{ color: '#A3B18A' }} />
                      <div>
                        <p style={{ fontSize: 10, color: '#A3B18A' }}>Father's Name</p>
                        <p style={{ fontSize: 12, color: '#DAD7CD' }}>{selectedStudent.fatherName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} style={{ color: '#A3B18A' }} />
                      <div>
                        <p style={{ fontSize: 10, color: '#A3B18A' }}>Mother's Name</p>
                        <p style={{ fontSize: 12, color: '#DAD7CD' }}>{selectedStudent.motherName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Phone size={14} style={{ color: '#A3B18A' }} />
                      <div>
                        <p style={{ fontSize: 10, color: '#A3B18A' }}>Contact Number</p>
                        <p style={{ fontSize: 12, color: '#DAD7CD' }}>{selectedStudent.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Summary */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: '1px solid rgba(163,177,138,0.1)' }}>
                <div className="p-4 rounded-xl text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                  <p style={{ fontSize: 11, color: '#A3B18A' }}>Total Fees</p>
                  <p className="text-white" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                    ₹{selectedStudent.total.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl text-center"
                  style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
                  <p style={{ fontSize: 11, color: '#4ade80' }}>Paid</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#4ade80', marginTop: 2 }}>
                    ₹{selectedStudent.paid.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{
                  background: selectedStudent.outstanding > 0 ? 'rgba(248,113,113,0.05)' : 'rgba(74,222,128,0.05)',
                  border: `1px solid ${selectedStudent.outstanding > 0 ? 'rgba(248,113,113,0.15)' : 'rgba(74,222,128,0.15)'}`,
                }}>
                  <p style={{ fontSize: 11, color: selectedStudent.outstanding > 0 ? '#f87171' : '#4ade80' }}>Outstanding</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: selectedStudent.outstanding > 0 ? '#f87171' : '#4ade80', marginTop: 2 }}>
                    {selectedStudent.outstanding > 0
                      ? `₹${selectedStudent.outstanding.toLocaleString()}`
                      : 'Cleared'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-5">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                  <DollarSign size={14} /> Add Payment
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#A3B18A', fontSize: 13 }}>
                  <Printer size={14} /> Print Statement
                </motion.button>
              </div>
            </GlassCard>

            {/* Payment History */}
            <GlassCard style={{ padding: 20 }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white" style={{ fontSize: 14, fontWeight: 600 }}>Payment History</p>
                <div className="flex items-center gap-2">
                  <Calendar size={14} style={{ color: '#A3B18A' }} />
                  {/* FIX 2: option values now use hyphen-minus keys that match
                      STUDENT_PAYMENTS keys; display labels use the en-dash */}
                  <select
                    value={selectedSession}
                    onChange={e => setSelectedSession(e.target.value)}
                    className="px-3 py-2 rounded-xl outline-none"
                    style={{ background: 'rgba(30,50,35,0.9)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 12 }}
                  >
                    {SESSION_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ background: '#1a2e20' }}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {studentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                        {['Date & Time', 'Amount Paid', 'Payment Mode', 'Status', 'Receipt ID', ''].map(h => (
                          <th key={h} className="text-left pb-3 pr-4"
                            style={{ color: '#A3B18A', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {studentPayments.map(payment => (
                        <tr key={payment.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                          <td className="py-3 pr-4">
                            <p className="text-white" style={{ fontSize: 12 }}>
                              {new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p style={{ fontSize: 10, color: '#A3B18A' }}>{payment.time}</p>
                          </td>
                          <td className="py-3 pr-4 text-white" style={{ fontWeight: 600 }}>₹{payment.amount.toLocaleString()}</td>
                          <td className="py-3 pr-4">
                            <span className="px-2 py-0.5 rounded-lg"
                              style={{ background: 'rgba(88,129,87,0.15)', color: '#A3B18A', fontSize: 10, fontWeight: 600 }}>
                              {payment.mode}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="px-2 py-0.5 rounded-lg" style={{
                              background: payment.status === 'verified' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
                              color: payment.status === 'verified' ? '#4ade80' : '#fbbf24',
                              fontSize: 10, fontWeight: 600,
                            }}>
                              {payment.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="py-3 pr-4" style={{ color: '#A3B18A', fontFamily: 'monospace', fontSize: 10 }}>
                            {payment.receiptId}
                          </td>
                          <td className="py-3">
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg"
                              style={{ background: 'rgba(88,129,87,0.15)' }}>
                              <Download size={12} style={{ color: '#588157' }} />
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'rgba(163,177,138,0.5)', textAlign: 'center', padding: '40px 0' }}>
                  No payment records for session {SESSION_OPTIONS.find(o => o.value === selectedSession)?.label ?? selectedSession}
                </p>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* ── Today's Transactions ──────────────────────────────────────── */}
        {activeTab === 'today' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Today's Transactions</h2>
                <p style={{ fontSize: 12, color: '#A3B18A', marginTop: 1 }}>Saturday, April 18, 2026</p>
              </div>
              <div className="text-right">
                <p style={{ fontSize: 11, color: '#A3B18A' }}>Total Collected</p>
                <p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>₹{todayCollected.toLocaleString()}</p>
              </div>
            </div>

            <GlassCard style={{ padding: 20 }}>
              <div className="space-y-3">
                {TODAY_TRANSACTIONS.map(t => (
                  <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(74,222,128,0.15)' }}>
                      <CheckCircle size={18} style={{ color: '#4ade80' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white" style={{ fontSize: 14, fontWeight: 600 }}>{t.student}</p>
                      <p style={{ fontSize: 11, color: '#A3B18A' }}>ID: {t.studentId} · Class {t.class}</p>
                      <p style={{ fontSize: 11, color: 'rgba(163,177,138,0.6)', marginTop: 2 }}>{t.time} · {t.mode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>₹{t.amount.toLocaleString()}</p>
                      <p style={{ fontSize: 10, color: '#A3B18A', fontFamily: 'monospace', marginTop: 2 }}>{t.id}</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }}
                      onClick={() => {
                        const student = MOCK_STUDENTS.find(s => s.id === t.studentId);
                        if (student) openStudentDetail(student);
                      }}
                      className="p-2 rounded-lg" style={{ background: 'rgba(88,129,87,0.15)' }}>
                      <ChevronRight size={14} style={{ color: '#588157' }} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Payment Logs ──────────────────────────────────────────────── */}
        {activeTab === 'logs' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Payment Logs</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 12 }}>
                  <option style={{ background: '#1a2e20' }}>All Methods</option>
                  <option style={{ background: '#1a2e20' }}>Cash</option>
                  <option style={{ background: '#1a2e20' }}>UPI</option>
                  <option style={{ background: '#1a2e20' }}>Online</option>
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
                      {['Receipt ID', 'Student', 'Date & Time', 'Amount', 'Mode', 'Status', ''].map(h => (
                        <th key={h} className="text-left pb-3 pr-4"
                          style={{ color: '#A3B18A', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TODAY_TRANSACTIONS.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A', fontFamily: 'monospace', fontSize: 10 }}>{t.id}</td>
                        <td className="py-3 pr-4">
                          <p className="text-white" style={{ fontWeight: 500 }}>{t.student}</p>
                          <p style={{ fontSize: 10, color: '#A3B18A' }}>Class {t.class}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p style={{ color: '#DAD7CD' }}>Apr 18, 2026</p>
                          <p style={{ fontSize: 10, color: '#A3B18A' }}>{t.time}</p>
                        </td>
                        <td className="py-3 pr-4 text-white" style={{ fontWeight: 600 }}>₹{t.amount.toLocaleString()}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg"
                            style={{ background: 'rgba(88,129,87,0.15)', color: '#A3B18A', fontSize: 10, fontWeight: 600 }}>
                            {t.mode}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg"
                            style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 10, fontWeight: 600 }}>
                            ✓ Verified
                          </span>
                        </td>
                        <td className="py-3">
                          <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg"
                            style={{ background: 'rgba(88,129,87,0.15)' }}>
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

        {/* ── Receipts ──────────────────────────────────────────────────── */}
        {activeTab === 'receipts' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Receipts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TODAY_TRANSACTIONS.map(t => (
                <motion.div key={t.id} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <GlassCard style={{ padding: 20 }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(88,129,87,0.2)' }}>
                        <Receipt size={16} style={{ color: '#A3B18A' }} />
                      </div>
                      <span className="px-2 py-0.5 rounded-lg"
                        style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 10, fontWeight: 600 }}>
                        Verified
                      </span>
                    </div>
                    <p style={{ fontSize: 10, color: '#A3B18A', fontFamily: 'monospace' }}>{t.id}</p>
                    <p className="text-white mt-1" style={{ fontSize: 13, fontWeight: 600 }}>{t.student}</p>
                    <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 1 }}>Class {t.class}</p>
                    <div className="flex items-center justify-between mt-4 pt-3"
                      style={{ borderTop: '1px solid rgba(163,177,138,0.1)' }}>
                      <p className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>₹{t.amount.toLocaleString()}</p>
                      <motion.button whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                        style={{ background: 'rgba(88,129,87,0.15)', color: '#A3B18A', fontSize: 11 }}>
                        <Download size={12} /> Download
                      </motion.button>
                    </div>
                    <p style={{ fontSize: 10, color: 'rgba(163,177,138,0.5)', marginTop: 6 }}>
                      Apr 18, 2026 · {t.time} · {t.mode}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Notifications ─────────────────────────────────────────────── */}
        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Notifications</h2>
            {[
              { title: 'Fee Deadline Reminder',       msg: 'Term 2 fee deadline is April 30. 15 students have pending dues totaling ₹1,75,000.',  time: '2 hours ago', icon: Bell,       color: '#f87171' },
              { title: 'Day Closing Report',           msg: 'Total collection today: ₹1,10,000 (2 transactions). All payments verified.',           time: '1 day ago',   icon: TrendingUp, color: '#4ade80' },
              { title: 'Payment Verification Required',msg: 'Online payment of ₹45,000 from Karan Kapoor (11-B) needs verification.',               time: '2 days ago',  icon: CreditCard, color: '#fbbf24' },
            ].map((n, i) => {
              const Icon = n.icon;
              return (
                <motion.div key={i} whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.08)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${n.color}22` }}>
                    <Icon size={15} style={{ color: n.color }} />
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(218,215,205,0.7)', marginTop: 2, lineHeight: 1.5 }}>{n.msg}</p>
                    <p style={{ fontSize: 10, color: 'rgba(163,177,138,0.5)', marginTop: 4 }}>{n.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* ── Add Payment Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPaymentModal && selectedStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowPaymentModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg rounded-3xl" style={{
                background: 'rgba(15,30,20,0.98)', backdropFilter: 'blur(40px)',
                border: '1px solid rgba(163,177,138,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              }}>
                <div className="flex items-center justify-between p-6 border-b"
                  style={{ borderColor: 'rgba(163,177,138,0.1)' }}>
                  <div>
                    <p className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>Add Payment</p>
                    <p style={{ fontSize: 12, color: '#A3B18A', marginTop: 1 }}>
                      {selectedStudent.name} · {selectedStudent.class}
                    </p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <X size={16} style={{ color: '#A3B18A' }} />
                  </motion.button>
                </div>

                <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
                  <div>
                    <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Amount (₹)
                    </label>
                    <input
                      value={payForm.amount}
                      onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))}
                      required type="number" min="1"
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Fee Type
                    </label>
                    <select
                      value={payForm.type}
                      onChange={e => setPayForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ background: 'rgba(30,50,35,0.9)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }}
                    >
                      {FEE_TYPES.map(t => (
                        <option key={t} style={{ background: '#1a2e20' }}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Payment Method
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PAYMENT_METHODS.map(method => (
                        <motion.button key={method} type="button" whileTap={{ scale: 0.95 }}
                          onClick={() => setPayForm(f => ({ ...f, mode: method }))}
                          className="py-3 rounded-xl transition-all"
                          style={{
                            background: payForm.mode === method ? 'rgba(88,129,87,0.25)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${payForm.mode === method ? 'rgba(88,129,87,0.5)' : 'rgba(163,177,138,0.1)'}`,
                            color: payForm.mode === method ? '#A3B18A' : 'rgba(163,177,138,0.5)',
                            fontSize: 12, fontWeight: 600,
                          }}>
                          {method}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Transaction Ref. (Optional)
                    </label>
                    <input
                      value={payForm.ref}
                      onChange={e => setPayForm(f => ({ ...f, ref: e.target.value }))}
                      placeholder="UPI ID, cheque number, etc."
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#DAD7CD', fontSize: 13 }}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 14, fontWeight: 600 }}>
                      {saving
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                        : <><CheckCircle size={14} /> Record Payment</>}
                    </motion.button>
                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowPaymentModal(false)}
                      className="px-5 py-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#A3B18A', fontSize: 14 }}>
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}