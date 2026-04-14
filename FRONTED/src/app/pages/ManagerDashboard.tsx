import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Table2, Users, Layers, CheckCircle, Plus, Edit2, Trash2, Calendar, Bell, AlignJustify, Save } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['P1\n8:00–8:45', 'P2\n8:45–9:30', 'P3\n9:45–10:30', 'P4\n10:30–11:15', 'P5\n11:30–12:15', 'P6\n12:15–1:00'];

const initialTimetable: Record<string, Record<string, string>> = {
  Monday: { 'P1': 'Physics', 'P2': 'Maths', 'P3': 'Chemistry', 'P4': 'English', 'P5': 'Computer Sc.', 'P6': 'Library' },
  Tuesday: { 'P1': 'Maths', 'P2': 'English', 'P3': 'Physics', 'P4': 'Chemistry', 'P5': 'P.E.', 'P6': 'Maths' },
  Wednesday: { 'P1': 'Chemistry', 'P2': 'Physics', 'P3': 'Maths', 'P4': 'P.E.', 'P5': 'English', 'P6': 'Computer Sc.' },
  Thursday: { 'P1': 'English', 'P2': 'Chemistry', 'P3': 'Computer Sc.', 'P4': 'Physics', 'P5': 'Maths', 'P6': 'Activity' },
  Friday: { 'P1': 'Computer Sc.', 'P2': 'Maths', 'P3': 'English', 'P4': 'Chemistry', 'P5': 'Physics', 'P6': 'P.E.' },
  Saturday: { 'P1': 'Activity', 'P2': 'Physics', 'P3': 'Chemistry', 'P4': 'Maths', 'P5': 'English', 'P6': 'Assembly' },
};

const subjectColors: Record<string, string> = {
  'Physics': '#4a7c6f', 'Maths': '#588157', 'Chemistry': '#5a6e8a', 'English': '#7a6a4a',
  'Computer Sc.': '#6a4a7a', 'P.E.': '#4a7a6a', 'Library': '#6a5a4a', 'Activity': '#5a4a6a', 'Assembly': '#4a5a7a',
};

const sections = [
  { id: 1, class: 'Class 11', section: 'A', students: 35, classTeacher: 'Mrs. Priya Singh' },
  { id: 2, class: 'Class 11', section: 'B', students: 34, classTeacher: 'Mr. Rajan Verma' },
  { id: 3, class: 'Class 12', section: 'A', students: 30, classTeacher: 'Mrs. Sunita Khanna' },
  { id: 4, class: 'Class 12', section: 'B', students: 31, classTeacher: 'Mr. Deepak Rao' },
  { id: 5, class: 'Class 10', section: 'A', students: 40, classTeacher: 'Mrs. Kavita Sharma' },
  { id: 6, class: 'Class 10', section: 'B', students: 38, classTeacher: 'Mr. Sunil Mehta' },
];

const teacherAssignments = [
  { teacher: 'Mrs. Priya Singh', subject: 'Physics', classes: ['11-A', '11-B', '12-A'], periods: 24 },
  { teacher: 'Mr. Rajan Verma', subject: 'Mathematics', classes: ['11-A', '11-B', '12-B'], periods: 24 },
  { teacher: 'Mrs. Sunita Khanna', subject: 'Chemistry', classes: ['11-A', '12-A', '12-B'], periods: 22 },
  { teacher: 'Mr. Deepak Rao', subject: 'English', classes: ['11-A', '11-B', '12-A', '12-B'], periods: 28 },
  { teacher: 'Mrs. Kavita Sharma', subject: 'Computer Sc.', classes: ['11-A', '11-B'], periods: 16 },
  { teacher: 'Mr. Sunil Mehta', subject: 'Physical Ed.', classes: ['All Classes'], periods: 18 },
];

function GlassCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)', borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

export function ManagerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('11-A');
  const [timetable, setTimetable] = useState(initialTimetable);
  const [editCell, setEditCell] = useState<{ day: string; period: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [ttSaved, setTTSaved] = useState(false);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  const handleCellClick = (day: string, period: string) => {
    setEditCell({ day, period });
    setEditValue(timetable[day]?.[period] || '');
  };

  const handleCellSave = () => {
    if (editCell) {
      setTimetable(prev => ({ ...prev, [editCell.day]: { ...prev[editCell.day], [editCell.period]: editValue } }));
      setEditCell(null);
      setTTSaved(false);
    }
  };

  const saveTimetable = () => {
    setTTSaved(true);
    setTimeout(() => setTTSaved(false), 2500);
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} title="Manager Portal"
      subtitle={`${user?.name} · Timetable & Schedule Management`} notifications={1}>
      <div className="space-y-6">

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>School Management Overview</h2>
              <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 2 }}>Academic Year 2025–26 · Term 2</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total Classes', value: '64', sub: 'Nursery to 12th', icon: Layers, color: '#588157' },
                { label: 'Teaching Staff', value: '128', sub: 'Faculty members', icon: Users, color: '#4a7c6f' },
                { label: 'Active Timetables', value: '64', sub: 'All sections', icon: Table2, color: '#5a6e8a' },
                { label: 'Pending Updates', value: '3', sub: 'Schedule conflicts', icon: AlignJustify, color: '#e05252' },
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

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Edit Timetable', sub: 'Modify class schedules', tab: 'timetable', icon: Table2, color: '#588157' },
                { label: 'Manage Sections', sub: 'Add or edit sections', tab: 'sections', icon: Layers, color: '#4a7c6f' },
                { label: 'Assign Teachers', sub: 'Subject assignments', tab: 'assign', icon: Users, color: '#5a6e8a' },
              ].map(({ label, sub, tab, icon: Icon, color }) => (
                <motion.button key={tab} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(tab)}
                  className="flex items-center gap-4 p-5 rounded-2xl text-left"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.1)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 1 }}>{sub}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timetable */}
        {activeTab === 'timetable' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Timetable Editor</h2>
              <div className="flex items-center gap-2">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                  className="px-3 py-2 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 13 }}>
                  {classes.map(c => <option key={c} value={c} style={{ background: '#1a2e20' }}>Class {c}</option>)}
                </select>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={saveTimetable}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                  <Save size={13} /> Save
                </motion.button>
              </div>
            </div>
            {ttSaved && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <CheckCircle size={14} style={{ color: '#4ade80' }} />
                <span style={{ fontSize: 12, color: '#4ade80' }}>Timetable saved for Class {selectedClass}!</span>
              </div>
            )}
            <p style={{ fontSize: 11, color: '#A3B18A' }}>Click any cell to edit the subject. Showing timetable for: <strong style={{ color: '#DAD7CD' }}>Class {selectedClass}</strong></p>

            <div className="overflow-x-auto">
              <GlassCard style={{ padding: 16, minWidth: 600 }}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left pb-3 pr-4" style={{ color: '#A3B18A', fontSize: 11, fontWeight: 600 }}>DAY</th>
                      {PERIODS.map((p, i) => (
                        <th key={i} className="text-center pb-3 px-2" style={{ color: '#A3B18A', fontSize: 10, fontWeight: 600, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map(day => (
                      <tr key={day} style={{ borderTop: '1px solid rgba(163,177,138,0.06)' }}>
                        <td className="py-2 pr-4" style={{ color: '#A3B18A', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{day.slice(0, 3)}</td>
                        {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map(period => {
                          const subject = timetable[day]?.[period] || '';
                          const color = subjectColors[subject] || '#4a5a5a';
                          const isEditing = editCell?.day === day && editCell?.period === period;
                          return (
                            <td key={period} className="py-2 px-1">
                              {isEditing ? (
                                <div className="flex gap-1">
                                  <input value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus
                                    onKeyDown={e => { if (e.key === 'Enter') handleCellSave(); if (e.key === 'Escape') setEditCell(null); }}
                                    className="w-20 px-2 py-1 rounded-lg outline-none text-center"
                                    style={{ background: 'rgba(88,129,87,0.2)', border: '1px solid rgba(88,129,87,0.4)', color: '#DAD7CD', fontSize: 11 }} />
                                  <button onClick={handleCellSave} className="p-1 rounded-lg" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}><CheckCircle size={12} /></button>
                                </div>
                              ) : (
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCellClick(day, period)}
                                  className="w-full py-1.5 px-2 rounded-lg text-center transition-all"
                                  style={{ background: `${color}22`, border: `1px solid ${color}44`, fontSize: 10, color: '#DAD7CD', minWidth: 70 }}>
                                  {subject || <span style={{ color: 'rgba(163,177,138,0.3)' }}>+</span>}
                                </motion.button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(subjectColors).map(([sub, color]) => (
                <div key={sub} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span style={{ fontSize: 10, color: '#A3B18A' }}>{sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sections */}
        {activeTab === 'sections' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Sections Management</h2>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                <Plus size={13} /> Add Section
              </motion.button>
            </div>
            <GlassCard style={{ padding: 16 }}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                      {['Class', 'Section', 'Students', 'Class Teacher', 'Actions'].map(h => (
                        <th key={h} className="text-left pb-3 pr-4" style={{ color: '#A3B18A', fontWeight: 600, fontSize: 11 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                        <td className="py-3 pr-4 text-white" style={{ fontWeight: 600 }}>{s.class}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(88,129,87,0.2)', color: '#A3B18A', fontWeight: 700 }}>{s.section}</span>
                        </td>
                        <td className="py-3 pr-4" style={{ color: '#DAD7CD' }}>{s.students}</td>
                        <td className="py-3 pr-4" style={{ color: '#DAD7CD' }}>{s.classTeacher}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(88,129,87,0.15)' }}>
                              <Edit2 size={12} style={{ color: '#588157' }} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)' }}>
                              <Trash2 size={12} style={{ color: '#f87171' }} />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Assign Teachers */}
        {activeTab === 'assign' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Teacher Assignments</h2>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                <Plus size={13} /> New Assignment
              </motion.button>
            </div>
            <div className="space-y-3">
              {teacherAssignments.map((ta, i) => (
                <motion.div key={i} whileHover={{ x: 4 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.1)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 700 }}>
                    {ta.teacher.split(' ').slice(-1)[0]?.[0]}{ta.teacher.split(' ')[1]?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{ta.teacher}</p>
                    <p style={{ fontSize: 12, color: '#A3B18A', marginTop: 1 }}>
                      {ta.subject} · {ta.periods} periods/week
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ta.classes.map(cls => (
                      <span key={cls} className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(88,129,87,0.15)', color: '#A3B18A', fontSize: 10, fontWeight: 600 }}>{cls}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-xl" style={{ background: 'rgba(88,129,87,0.15)' }}>
                      <Edit2 size={13} style={{ color: '#588157' }} />
                    </motion.button>
                  </div>
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
              { title: 'Timetable Conflict – Class 12-A', msg: 'Physics and Chemistry scheduled at the same period on Wednesday', time: '30 min ago', icon: Table2, color: '#f87171' },
              { title: 'New Teacher Added', msg: 'Mr. Arun Dixit (Hindi) has been added to staff by Admin', time: '2 days ago', icon: Users, color: '#4ade80' },
              { title: 'Exam Schedule Approved', msg: 'Final exam schedule for May 2026 has been approved', time: '3 days ago', icon: Calendar, color: '#fbbf24' },
            ].map((n, i) => {
              const Icon = n.icon;
              return (
                <motion.div key={i} whileHover={{ x: 4 }} className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer"
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
