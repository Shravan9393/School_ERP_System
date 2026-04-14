import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, Users, UserCheck, X } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

type AttendanceStatus = 'P' | 'A';

type DateAttendanceMap = Record<string, Record<string, AttendanceStatus>>;

interface Student {
  id: string;
  rollNo: string;
  name: string;
  feeStatus: 'Paid' | 'Unpaid';
  outstandingAmount: number;
}

const mockStudents: Student[] = [
  { id: 'S801', rollNo: '01', name: 'Arjun Sharma', feeStatus: 'Paid', outstandingAmount: 0 },
  { id: 'S802', rollNo: '02', name: 'Priya Mehta', feeStatus: 'Unpaid', outstandingAmount: 7500 },
  { id: 'S803', rollNo: '03', name: 'Rohit Gupta', feeStatus: 'Paid', outstandingAmount: 0 },
  { id: 'S804', rollNo: '04', name: 'Ananya Singh', feeStatus: 'Unpaid', outstandingAmount: 12000 },
  { id: 'S805', rollNo: '05', name: 'Vikram Nair', feeStatus: 'Paid', outstandingAmount: 0 },
  { id: 'S806', rollNo: '06', name: 'Sneha Patel', feeStatus: 'Unpaid', outstandingAmount: 3000 },
  { id: 'S807', rollNo: '07', name: 'Karan Kapoor', feeStatus: 'Paid', outstandingAmount: 0 },
  { id: 'S808', rollNo: '08', name: 'Divya Reddy', feeStatus: 'Paid', outstandingAmount: 0 },
];

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(163,177,138,0.12)',
        borderRadius: 16,
      }}
    >
      {children}
    </div>
  );
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function getMonthLabel(monthKey: string) {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function AttendanceModal({
  open,
  students,
  assignedClass,
  todayKey,
  initialEntries,
  onClose,
  onSave,
}: {
  open: boolean;
  students: Student[];
  assignedClass: string;
  todayKey: string;
  initialEntries: Record<string, AttendanceStatus>;
  onClose: () => void;
  onSave: (entries: Record<string, AttendanceStatus>) => void;
}) {
  const [entries, setEntries] = useState<Record<string, AttendanceStatus>>(initialEntries);

  // Re-sync when modal opens for update mode.
  useEffect(() => setEntries(initialEntries), [initialEntries]);

  const mark = (studentId: string, status: AttendanceStatus) => {
    setEntries((prev) => ({ ...prev, [studentId]: status }));
  };

  const present = students.filter((s) => entries[s.id] === 'P').length;
  const absent = students.filter((s) => entries[s.id] === 'A').length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-4xl max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
            style={{ background: 'rgba(15,30,20,0.96)', border: '1px solid rgba(163,177,138,0.2)', borderRadius: 20, backdropFilter: 'blur(30px)' }}
          >
            <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'rgba(163,177,138,0.15)' }}>
              <div>
                <h3 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Mark Attendance</h3>
                <p style={{ color: '#A3B18A', fontSize: 12 }}>Class {assignedClass} · Date: {todayKey} (auto-filled)</p>
              </div>
              <button onClick={onClose}><X size={18} style={{ color: '#A3B18A' }} /></button>
            </div>

            <div className="p-5 pt-4">
              <div className="mb-4 flex gap-3">
                <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 12 }}>Present: {present}</span>
                <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', fontSize: 12 }}>Absent: {absent}</span>
                {Object.keys(initialEntries).length > 0 && (
                  <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: 12 }}>
                    Update mode (today's data loaded)
                  </span>
                )}
              </div>

              <div className="overflow-auto" style={{ maxHeight: '52vh' }}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2" style={{ color: '#A3B18A', fontSize: 11 }}>Roll Number</th>
                      <th className="text-left p-2" style={{ color: '#A3B18A', fontSize: 11 }}>Student Name</th>
                      <th className="text-center p-2" style={{ color: '#A3B18A', fontSize: 11 }}>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const status = entries[student.id];
                      return (
                        <tr key={student.id} style={{ borderTop: '1px solid rgba(163,177,138,0.08)' }}>
                          <td className="p-2" style={{ color: '#A3B18A' }}>{student.rollNo}</td>
                          <td className="p-2" style={{ color: '#fff' }}>{student.name}</td>
                          <td className="p-2">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => mark(student.id, 'P')}
                                className="px-3 py-1 rounded-lg"
                                style={{ background: status === 'P' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.04)', color: status === 'P' ? '#4ade80' : '#A3B18A' }}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => mark(student.id, 'A')}
                                className="px-3 py-1 rounded-lg"
                                style={{ background: status === 'A' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.04)', color: status === 'A' ? '#f87171' : '#A3B18A' }}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end" style={{ borderColor: 'rgba(163,177,138,0.15)' }}>
              <button
                onClick={() => onSave(entries)}
                className="px-5 py-2 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 600 }}
              >
                Save Attendance
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function monthKeyFromOffset(monthOffset = 0) {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1 + monthOffset).padStart(2, '0')}`;
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const teacherName = user?.name || 'Teacher';
  const assignedClass = user?.class || '8 - A';

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceByDate, setAttendanceByDate] = useState<DateAttendanceMap>(() => {
    const seed: DateAttendanceMap = {};
    for (let i = 0; i < 50; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = formatDate(d);
      seed[key] = mockStudents.reduce<Record<string, AttendanceStatus>>((acc, student) => {
        acc[student.id] = Math.random() > 0.17 ? 'P' : 'A';
        return acc;
      }, {});
    }
    return seed;
  });

  const [filterType, setFilterType] = useState<'1m' | '2m' | 'custom'>('1m');
  const [customMonth, setCustomMonth] = useState(monthKeyFromOffset(0));

  const todayKey = formatDate(new Date());
  const todayEntries = attendanceByDate[todayKey] || {};

  const selectedStudent = mockStudents.find((s) => s.id === selectedStudentId) || null;

  const handleSaveTodayAttendance = (entries: Record<string, AttendanceStatus>) => {
    setAttendanceByDate((prev) => ({ ...prev, [todayKey]: { ...entries } }));
    setAttendanceModalOpen(false);
    setActiveTab('attendance');
  };

  const studentAttendanceEntries = useMemo(() => {
    if (!selectedStudentId) return [] as { date: string; status: AttendanceStatus }[];
    return Object.entries(attendanceByDate)
      .map(([date, map]) => ({ date, status: map[selectedStudentId] }))
      .filter((v): v is { date: string; status: AttendanceStatus } => v.status === 'P' || v.status === 'A')
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  }, [attendanceByDate, selectedStudentId]);

  const effectiveMonth = useMemo(() => {
    if (filterType === 'custom') return customMonth;
    return monthKeyFromOffset(filterType === '1m' ? 0 : -1);
  }, [filterType, customMonth]);

  const monthlyEntries = useMemo(() => {
    return studentAttendanceEntries.filter((item) => item.date.startsWith(effectiveMonth));
  }, [studentAttendanceEntries, effectiveMonth]);

  const attendancePct = monthlyEntries.length
    ? Math.round((monthlyEntries.filter((item) => item.status === 'P').length / monthlyEntries.length) * 100)
    : 0;

  const calendarCells = useMemo(() => {
    const [year, month] = effectiveMonth.split('-').map(Number);
    const first = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    const startWeekday = first.getDay();

    const statusByDay = monthlyEntries.reduce<Record<number, AttendanceStatus>>((acc, row) => {
      const day = Number(row.date.split('-')[2]);
      acc[day] = row.status;
      return acc;
    }, {});

    const cells: Array<{ day: number | null; status?: AttendanceStatus }> = [];
    for (let i = 0; i < startWeekday; i += 1) cells.push({ day: null });
    for (let d = 1; d <= lastDay; d += 1) cells.push({ day: d, status: statusByDay[d] });
    while (cells.length % 7 !== 0) cells.push({ day: null });
    return cells;
  }, [effectiveMonth, monthlyEntries]);

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title="Teacher Portal"
      subtitle={`${teacherName} · Class Teacher: Class ${assignedClass}`}
      notifications={2}
    >
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h2 className="text-white" style={{ fontSize: 22, fontWeight: 700 }}>{teacherName}</h2>
              <p style={{ color: '#A3B18A', fontSize: 13 }}>Assigned Class & Section: Class {assignedClass}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => setAttendanceModalOpen(true)} className="p-4 rounded-2xl text-left" style={{ background: 'rgba(88,129,87,0.16)', border: '1px solid rgba(88,129,87,0.35)' }}>
                <UserCheck size={16} style={{ color: '#A3B18A' }} />
                <p className="text-white mt-2" style={{ fontWeight: 700 }}>Mark Attendance</p>
              </button>
              <button onClick={() => setActiveTab('attendance')} className="p-4 rounded-2xl text-left" style={{ background: 'rgba(90,110,138,0.16)', border: '1px solid rgba(90,110,138,0.35)' }}>
                <CalendarDays size={16} style={{ color: '#A3B18A' }} />
                <p className="text-white mt-2" style={{ fontWeight: 700 }}>View Attendance</p>
              </button>
              <button onClick={() => setActiveTab('marks')} className="p-4 rounded-2xl text-left" style={{ background: 'rgba(122,106,74,0.16)', border: '1px solid rgba(122,106,74,0.35)' }}>
                <Users size={16} style={{ color: '#A3B18A' }} />
                <p className="text-white mt-2" style={{ fontWeight: 700 }}>View Students</p>
              </button>
            </div>
          </motion.div>
        )}

        {(activeTab === 'attendance' || activeTab === 'marks') && (
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white" style={{ fontWeight: 700 }}>Class {assignedClass} Students</h3>
              <button onClick={() => setAttendanceModalOpen(true)} className="px-3 py-1 rounded-lg" style={{ background: 'rgba(88,129,87,0.2)', color: '#A3B18A' }}>Mark / Update Today</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    setActiveTab('performance');
                  }}
                  className="p-3 rounded-xl text-left"
                  style={{ border: '1px solid rgba(163,177,138,0.12)', background: selectedStudentId === student.id ? 'rgba(88,129,87,0.15)' : 'rgba(255,255,255,0.02)' }}
                >
                  <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</p>
                  <p style={{ color: '#A3B18A', fontSize: 12 }}>Roll {student.rollNo} · Fee {student.feeStatus}</p>
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            {!selectedStudent ? (
              <GlassCard className="p-5"><p style={{ color: '#A3B18A' }}>Select a student from “View Attendance” or “View Students”.</p></GlassCard>
            ) : (
              <>
                <GlassCard className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-white" style={{ fontSize: 17, fontWeight: 700 }}>{selectedStudent.name}</p>
                      <p style={{ color: '#A3B18A', fontSize: 12 }}>Roll Number: {selectedStudent.rollNo}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setFilterType('1m')} className="px-3 py-1 rounded-lg" style={{ background: filterType === '1m' ? 'rgba(88,129,87,0.22)' : 'rgba(255,255,255,0.04)', color: '#A3B18A' }}>Last 1 Month</button>
                      <button onClick={() => setFilterType('2m')} className="px-3 py-1 rounded-lg" style={{ background: filterType === '2m' ? 'rgba(88,129,87,0.22)' : 'rgba(255,255,255,0.04)', color: '#A3B18A' }}>Last 2 Months</button>
                      <button onClick={() => setFilterType('custom')} className="px-3 py-1 rounded-lg" style={{ background: filterType === 'custom' ? 'rgba(88,129,87,0.22)' : 'rgba(255,255,255,0.04)', color: '#A3B18A' }}>Custom Month</button>
                      {filterType === 'custom' && (
                        <input
                          type="month"
                          value={customMonth}
                          onChange={(e) => setCustomMonth(e.target.value)}
                          className="px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD' }}
                        />
                      )}
                    </div>
                  </div>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <GlassCard className="p-4"><p style={{ color: '#A3B18A', fontSize: 12 }}>Attendance % ({getMonthLabel(effectiveMonth)})</p><p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>{attendancePct}%</p></GlassCard>
                  <GlassCard className="p-4"><p style={{ color: '#A3B18A', fontSize: 12 }}>Fee Status</p><p style={{ color: selectedStudent.feeStatus === 'Paid' ? '#4ade80' : '#f87171', fontSize: 24, fontWeight: 800 }}>{selectedStudent.feeStatus}</p></GlassCard>
                  <GlassCard className="p-4"><p style={{ color: '#A3B18A', fontSize: 12 }}>Outstanding</p><p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>₹{selectedStudent.outstandingAmount.toLocaleString()}</p></GlassCard>
                </div>

                <GlassCard className="p-5">
                  <p className="text-white mb-3" style={{ fontWeight: 700 }}>Attendance Calendar · {getMonthLabel(effectiveMonth)}</p>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} className="text-center" style={{ color: '#A3B18A', fontSize: 11 }}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((cell, idx) => (
                      <div
                        key={`${cell.day}-${idx}`}
                        className="h-14 rounded-lg p-1"
                        style={{ border: '1px solid rgba(163,177,138,0.12)', background: 'rgba(255,255,255,0.02)' }}
                      >
                        {cell.day ? (
                          <div className="h-full flex flex-col justify-between">
                            <span style={{ color: '#DAD7CD', fontSize: 11 }}>{cell.day}</span>
                            <span style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: cell.status === 'P' ? '#4ade80' : cell.status === 'A' ? '#f87171' : 'rgba(163,177,138,0.5)',
                              alignSelf: 'flex-end',
                            }}>
                              {cell.status || '-'}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </>
            )}
          </div>
        )}

        {!['overview', 'attendance', 'marks', 'performance'].includes(activeTab) && (
          <GlassCard className="p-5"><p style={{ color: '#A3B18A' }}>Demo section.</p></GlassCard>
        )}
      </div>

      <AttendanceModal
        open={attendanceModalOpen}
        students={mockStudents}
        assignedClass={assignedClass}
        todayKey={todayKey}
        initialEntries={todayEntries}
        onClose={() => setAttendanceModalOpen(false)}
        onSave={handleSaveTodayAttendance}
      />
    </DashboardLayout>
  );
}
