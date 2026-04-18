// import { useState } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { CheckCircle, X as XIcon, Calendar, UserCheck, Eye, AlertCircle } from 'lucide-react';
// import { DashboardLayout } from '../components/layout/DashboardLayout';
// import { useAuth } from '../context/AuthContext';

// const studentList = [
//   { id: 'S001', name: 'Arjun Sharma', roll: '01' },
//   { id: 'S002', name: 'Priya Mehta', roll: '02' },
//   { id: 'S003', name: 'Rohit Gupta', roll: '03' },
//   { id: 'S004', name: 'Ananya Singh', roll: '04' },
//   { id: 'S005', name: 'Vikram Nair', roll: '05' },
//   { id: 'S006', name: 'Sneha Patel', roll: '06' },
//   { id: 'S007', name: 'Karan Kapoor', roll: '07' },
//   { id: 'S008', name: 'Divya Reddy', roll: '08' },
//   { id: 'S009', name: 'Aditya Kumar', roll: '09' },
//   { id: 'S010', name: 'Sanya Joshi', roll: '10' },
//   { id: 'S011', name: 'Rahul Verma', roll: '11' },
//   { id: 'S012', name: 'Ishita Desai', roll: '12' },
//   { id: 'S013', name: 'Kunal Rao', roll: '13' },
//   { id: 'S014', name: 'Meera Shah', roll: '14' },
//   { id: 'S015', name: 'Nikhil Jain', roll: '15' },
// ];

// function GlassCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
//   return (
//     <div className={className} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)', borderRadius: 16, ...style }}>
//       {children}
//     </div>
//   );
// }

// interface AttendanceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   assignedClass: string;
// }

// function AttendanceModal({ isOpen, onClose, assignedClass }: AttendanceModalProps) {
//   const [attendance, setAttendance] = useState<Record<string, 'P' | 'A'>>({});
//   const [isSaving, setIsSaving] = useState(false);
//   const [saved, setSaved] = useState(false);

//   const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

//   const toggleAttendance = (id: string, status: 'P' | 'A') => {
//     setSaved(false);
//     setAttendance(prev => ({ ...prev, [id]: status }));
//   };

//   const handleSubmit = async () => {
//     setIsSaving(true);
//     await new Promise(r => setTimeout(r, 800));
//     setIsSaving(false);
//     setSaved(true);
//     setTimeout(() => {
//       onClose();
//       setSaved(false);
//       setAttendance({});
//     }, 1500);
//   };

//   const presentCount = studentList.filter(s => attendance[s.id] === 'P').length;
//   const absentCount = studentList.filter(s => attendance[s.id] === 'A').length;
//   const unmarkedCount = studentList.length - presentCount - absentCount;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//             onClick={onClose}
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[85vh] overflow-hidden"
//             style={{ background: 'rgba(15,30,20,0.95)', backdropFilter: 'blur(40px)', border: '1px solid rgba(163,177,138,0.2)', borderRadius: 24 }}
//           >
//             {/* Header */}
//             <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(163,177,138,0.15)' }}>
//               <div>
//                 <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Mark Attendance</h2>
//                 <div className="flex items-center gap-3 mt-1">
//                   <span style={{ fontSize: 12, color: '#A3B18A' }}>Class {assignedClass}</span>
//                   <span style={{ fontSize: 11, color: 'rgba(163,177,138,0.6)' }}>•</span>
//                   <div className="flex items-center gap-1.5">
//                     <Calendar size={12} style={{ color: '#588157' }} />
//                     <span style={{ fontSize: 12, color: '#588157', fontWeight: 600 }}>{currentDate}</span>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
//                 style={{ border: '1px solid rgba(163,177,138,0.15)' }}
//               >
//                 <XIcon size={16} style={{ color: '#A3B18A' }} />
//               </button>
//             </div>

//             {/* Info banner */}
//             <div className="mx-6 mt-4 px-3 py-2 rounded-xl flex items-start gap-2" style={{ background: 'rgba(88,129,87,0.15)', border: '1px solid rgba(88,129,87,0.25)' }}>
//               <AlertCircle size={14} style={{ color: '#A3B18A', marginTop: 1, flexShrink: 0 }} />
//               <p style={{ fontSize: 11, color: '#A3B18A', lineHeight: 1.5 }}>
//                 You can only mark attendance for today's date. Past or future dates cannot be edited.
//               </p>
//             </div>

//             {/* Stats */}
//             <div className="mx-6 mt-3 grid grid-cols-3 gap-2">
//               <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
//                 <p style={{ fontSize: 10, color: 'rgba(74,222,128,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Present</p>
//                 <p className="text-white mt-0.5" style={{ fontSize: 18, fontWeight: 700 }}>{presentCount}</p>
//               </div>
//               <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
//                 <p style={{ fontSize: 10, color: 'rgba(248,113,113,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Absent</p>
//                 <p className="text-white mt-0.5" style={{ fontSize: 18, fontWeight: 700 }}>{absentCount}</p>
//               </div>
//               <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(163,177,138,0.1)', border: '1px solid rgba(163,177,138,0.2)' }}>
//                 <p style={{ fontSize: 10, color: 'rgba(163,177,138,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unmarked</p>
//                 <p className="text-white mt-0.5" style={{ fontSize: 18, fontWeight: 700 }}>{unmarkedCount}</p>
//               </div>
//             </div>

//             {/* Table container */}
//             <div className="mx-6 mt-4 mb-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 280px)' }}>
//               <table className="w-full">
//                 <thead className="sticky top-0" style={{ background: 'rgba(15,30,20,0.95)', borderBottom: '1px solid rgba(163,177,138,0.15)' }}>
//                   <tr>
//                     <th className="text-left px-3 py-3" style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80 }}>Roll No.</th>
//                     <th className="text-left px-3 py-3" style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student Name</th>
//                     <th className="text-center px-3 py-3" style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: 180 }}>Attendance</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {studentList.map((student, idx) => {
//                     const status = attendance[student.id];
//                     return (
//                       <tr key={student.id} className="border-b" style={{ borderColor: 'rgba(163,177,138,0.06)' }}>
//                         <td className="px-3 py-3">
//                           <span style={{ fontSize: 13, color: '#A3B18A', fontWeight: 600 }}>{student.roll}</span>
//                         </td>
//                         <td className="px-3 py-3">
//                           <span className="text-white" style={{ fontSize: 13 }}>{student.name}</span>
//                         </td>
//                         <td className="px-3 py-3">
//                           <div className="flex items-center justify-center gap-2">
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => toggleAttendance(student.id, 'P')}
//                               className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all"
//                               style={{
//                                 background: status === 'P' ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.04)',
//                                 border: `1px solid ${status === 'P' ? 'rgba(74,222,128,0.5)' : 'rgba(163,177,138,0.1)'}`,
//                                 color: status === 'P' ? '#4ade80' : 'rgba(163,177,138,0.5)',
//                                 fontSize: 12,
//                                 fontWeight: 600
//                               }}
//                             >
//                               <CheckCircle size={13} />
//                               Present
//                             </motion.button>
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => toggleAttendance(student.id, 'A')}
//                               className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all"
//                               style={{
//                                 background: status === 'A' ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.04)',
//                                 border: `1px solid ${status === 'A' ? 'rgba(248,113,113,0.5)' : 'rgba(163,177,138,0.1)'}`,
//                                 color: status === 'A' ? '#f87171' : 'rgba(163,177,138,0.5)',
//                                 fontSize: 12,
//                                 fontWeight: 600
//                               }}
//                             >
//                               <XIcon size={13} />
//                               Absent
//                             </motion.button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(163,177,138,0.15)' }}>
//               <div>
//                 {saved && (
//                   <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
//                     <CheckCircle size={16} style={{ color: '#4ade80' }} />
//                     <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 600 }}>Attendance saved successfully!</span>
//                   </motion.div>
//                 )}
//               </div>
//               <div className="flex items-center gap-3">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.97 }}
//                   onClick={onClose}
//                   className="px-5 py-2.5 rounded-xl"
//                   style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', fontSize: 13, color: '#A3B18A', fontWeight: 600 }}
//                 >
//                   Cancel
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.97 }}
//                   onClick={handleSubmit}
//                   disabled={isSaving || saved}
//                   className="px-6 py-2.5 rounded-xl text-white flex items-center gap-2"
//                   style={{
//                     background: saved ? '#3A5A40' : 'linear-gradient(135deg, #588157, #3A5A40)',
//                     fontSize: 13,
//                     fontWeight: 600,
//                     opacity: isSaving ? 0.8 : 1,
//                     boxShadow: '0 4px 16px rgba(88,129,87,0.3)'
//                   }}
//                 >
//                   {isSaving ? (
//                     <>
//                       <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Saving...
//                     </>
//                   ) : saved ? (
//                     <>
//                       <CheckCircle size={14} />
//                       Saved
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={14} />
//                       Save Attendance
//                     </>
//                   )}
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

// export function TeacherDashboard() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showAttendanceModal, setShowAttendanceModal] = useState(false);

//   const assignedClass = '11-A';
//   const teacherName = user?.name || 'Teacher';

//   return (
//     <DashboardLayout
//       activeTab={activeTab}
//       onTabChange={setActiveTab}
//       title="Teacher Portal"
//       subtitle={`${teacherName} · Class Teacher of ${assignedClass}`}
//       notifications={2}
//     >
//       <div className="space-y-6">
//         {/* Overview */}
//         {activeTab === 'overview' && (
//           <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//             {/* Welcome header */}
//             <div>
//               <h2 className="text-white" style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {teacherName.split(' ').slice(-1)[0]} 👋</h2>
//               <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 2 }}>Class Teacher · {assignedClass}</p>
//             </div>

//             {/* Main action cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
//               <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
//                 <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
//                   <div className="p-6">
//                     <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
//                       style={{ background: 'rgba(88,129,87,0.2)', border: '1px solid rgba(88,129,87,0.3)' }}>
//                       <UserCheck size={22} style={{ color: '#588157' }} />
//                     </div>
//                     <h3 className="text-white mb-2" style={{ fontSize: 16, fontWeight: 700 }}>Mark Attendance</h3>
//                     <p style={{ fontSize: 13, color: 'rgba(218,215,205,0.6)', lineHeight: 1.6, marginBottom: 16 }}>
//                       Record daily attendance for Class {assignedClass}. Mark students as Present or Absent for today.
//                     </p>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={() => setShowAttendanceModal(true)}
//                       className="w-full py-3 rounded-xl text-white flex items-center justify-center gap-2"
//                       style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 16px rgba(88,129,87,0.3)' }}
//                     >
//                       <UserCheck size={16} />
//                       Open Attendance
//                     </motion.button>
//                   </div>
//                 </GlassCard>
//               </motion.div>

//               <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
//                 <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
//                   <div className="p-6">
//                     <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
//                       style={{ background: 'rgba(74,124,111,0.2)', border: '1px solid rgba(74,124,111,0.3)' }}>
//                       <Eye size={22} style={{ color: '#4a7c6f' }} />
//                     </div>
//                     <h3 className="text-white mb-2" style={{ fontSize: 16, fontWeight: 700 }}>View Attendance</h3>
//                     <p style={{ fontSize: 13, color: 'rgba(218,215,205,0.6)', lineHeight: 1.6, marginBottom: 16 }}>
//                       Review attendance records, track student presence patterns, and generate reports.
//                     </p>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={() => setActiveTab('attendance')}
//                       className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
//                       style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', fontSize: 14, color: '#A3B18A', fontWeight: 600 }}
//                     >
//                       <Eye size={16} />
//                       View Records
//                     </motion.button>
//                   </div>
//                 </GlassCard>
//               </motion.div>
//             </div>

//             {/* Quick stats */}
//             <GlassCard style={{ padding: 20 }}>
//               <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Today's Summary</p>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {[
//                   { label: 'Total Students', value: studentList.length, color: '#588157' },
//                   { label: 'Present Today', value: '—', color: '#4ade80' },
//                   { label: 'Absent Today', value: '—', color: '#f87171' },
//                   { label: 'Avg. Attendance', value: '92%', color: '#A3B18A' },
//                 ].map(stat => (
//                   <div key={stat.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(163,177,138,0.08)' }}>
//                     <p style={{ fontSize: 10, color: '#A3B18A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
//                     <p className="text-white mt-1" style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </GlassCard>
//           </motion.div>
//         )}

//         {/* Attendance view tab */}
//         {activeTab === 'attendance' && (
//           <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Attendance Records</h2>
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.97 }}
//                 onClick={() => setShowAttendanceModal(true)}
//                 className="px-5 py-2.5 rounded-xl text-white flex items-center gap-2"
//                 style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}
//               >
//                 <UserCheck size={14} />
//                 Mark New Attendance
//               </motion.button>
//             </div>

//             <GlassCard style={{ padding: 20 }}>
//               <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>Student List - Class {assignedClass}</p>
//               <div className="space-y-2">
//                 {studentList.map(student => (
//                   <div key={student.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(163,177,138,0.06)' }}>
//                     <span style={{ fontSize: 12, color: '#A3B18A', width: 32, fontWeight: 600 }}>{student.roll}</span>
//                     <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs text-white flex-shrink-0" style={{ background: 'rgba(88,129,87,0.25)', fontWeight: 700 }}>
//                       {student.name.split(' ').map(n => n[0]).join('')}
//                     </div>
//                     <span className="flex-1 text-white" style={{ fontSize: 13 }}>{student.name}</span>
//                     <span style={{ fontSize: 12, color: 'rgba(163,177,138,0.5)' }}>ID: {student.id}</span>
//                   </div>
//                 ))}
//               </div>
//             </GlassCard>
//           </motion.div>
//         )}

//         {/* Other tabs can remain simple placeholders */}
//         {!['overview', 'attendance'].includes(activeTab) && (
//           <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
//             <GlassCard style={{ padding: 40, textAlign: 'center' }}>
//               <p className="text-white" style={{ fontSize: 16, fontWeight: 600 }}>
//                 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section
//               </p>
//               <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 8 }}>Coming soon</p>
//             </GlassCard>
//           </motion.div>
//         )}
//       </div>

//       {/* Attendance Modal */}
//       <AttendanceModal
//         isOpen={showAttendanceModal}
//         onClose={() => setShowAttendanceModal(false)}
//         assignedClass={assignedClass}
//       />
//     </DashboardLayout>
//   );
// }














import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X as XIcon, Calendar, UserCheck, Eye, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

type AttendanceStatus = 'P' | 'A';

interface Student {
  id: string;
  name: string;
  roll: string;
}

interface AttendanceRecord {
  date: string;
  entries: Record<string, AttendanceStatus>;
}

interface LeaveRequest {
  id: string;
  studentName: string;
  from: string;
  to: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const studentList: Student[] = [
  { id: 'S001', name: 'Arjun Sharma', roll: '01' },
  { id: 'S002', name: 'Priya Mehta', roll: '02' },
  { id: 'S003', name: 'Rohit Gupta', roll: '03' },
  { id: 'S004', name: 'Ananya Singh', roll: '04' },
  { id: 'S005', name: 'Vikram Nair', roll: '05' },
  { id: 'S006', name: 'Sneha Patel', roll: '06' },
  { id: 'S007', name: 'Karan Kapoor', roll: '07' },
  { id: 'S008', name: 'Divya Reddy', roll: '08' },
];

const initialLeaveRequests: LeaveRequest[] = [
  { id: 'LR-101', studentName: 'Arjun Sharma', from: '2026-04-15', to: '2026-04-15', reason: 'Fever', status: 'pending' },
  { id: 'LR-102', studentName: 'Priya Mehta', from: '2026-04-17', to: '2026-04-18', reason: 'Family event', status: 'pending' },
  { id: 'LR-103', studentName: 'Rohit Gupta', from: '2026-04-10', to: '2026-04-10', reason: 'Medical checkup', status: 'approved' },
];

function GlassCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)', borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

function AttendanceModal({ isOpen, onClose, assignedClass, onSave }: { isOpen: boolean; onClose: () => void; assignedClass: string; onSave: (entries: Record<string, AttendanceStatus>) => void }) {
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSaving, setIsSaving] = useState(false);

  const todayDate = new Date().toISOString().split('T')[0];

  const toggleAttendance = (id: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave(attendance);
    setIsSaving(false);
    setAttendance({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[85vh] overflow-hidden"
            style={{ background: 'rgba(15,30,20,0.95)', backdropFilter: 'blur(40px)', border: '1px solid rgba(163,177,138,0.2)', borderRadius: 24 }}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(163,177,138,0.15)' }}>
              <div>
                <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Mark Attendance</h2>
                <p style={{ fontSize: 12, color: '#A3B18A' }}>Class {assignedClass} · {todayDate}</p>
              </div>
              <button onClick={onClose}><XIcon size={18} style={{ color: '#A3B18A' }} /></button>
            </div>

            <div className="mx-6 mt-4 px-3 py-2 rounded-xl flex items-start gap-2" style={{ background: 'rgba(88,129,87,0.15)', border: '1px solid rgba(88,129,87,0.25)' }}>
              <AlertCircle size={14} style={{ color: '#A3B18A', marginTop: 1 }} />
              <p style={{ fontSize: 11, color: '#A3B18A' }}>Attendance can only be marked for current date. Past/future dates are view-only.</p>
            </div>

            <div className="mx-6 mt-4 mb-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 220px)' }}>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left px-3 py-2" style={{ color: '#A3B18A', fontSize: 11 }}>Roll</th>
                    <th className="text-left px-3 py-2" style={{ color: '#A3B18A', fontSize: 11 }}>Student</th>
                    <th className="text-center px-3 py-2" style={{ color: '#A3B18A', fontSize: 11 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student) => {
                    const status = attendance[student.id];
                    return (
                      <tr key={student.id} style={{ borderTop: '1px solid rgba(163,177,138,0.06)' }}>
                        <td className="px-3 py-3" style={{ color: '#A3B18A' }}>{student.roll}</td>
                        <td className="px-3 py-3" style={{ color: 'white' }}>{student.name}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => toggleAttendance(student.id, 'P')} className="px-3 py-1 rounded-lg" style={{ background: status === 'P' ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.04)', color: status === 'P' ? '#4ade80' : '#A3B18A' }}>Present</button>
                            <button onClick={() => toggleAttendance(student.id, 'A')} className="px-3 py-1 rounded-lg" style={{ background: status === 'A' ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.04)', color: status === 'A' ? '#f87171' : '#A3B18A' }}>Absent</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: 'rgba(163,177,138,0.15)' }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={isSaving} className="px-5 py-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)' }}>
                {isSaving ? 'Saving...' : 'Save Attendance'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  const assignedClass = user?.class || '11-A';

  const handleSaveAttendance = (entries: Record<string, AttendanceStatus>) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceRecords((prev) => {
      const withoutToday = prev.filter((r) => r.date !== today);
      return [{ date: today, entries }, ...withoutToday];
    });
  };

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const todayRecord = attendanceRecords.find((r) => r.date === new Date().toISOString().split('T')[0]);
  const presentToday = todayRecord ? Object.values(todayRecord.entries).filter((s) => s === 'P').length : 0;

  const attendanceSummary = useMemo(() => {
    return attendanceRecords.map((record) => {
      const present = Object.values(record.entries).filter((s) => s === 'P').length;
      const absent = Object.values(record.entries).filter((s) => s === 'A').length;
      return { ...record, present, absent };
    });
  }, [attendanceRecords]);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} title="Teacher Portal" subtitle={`${user?.name} · Class ${assignedClass}`} notifications={2}>
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-white" style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <GlassCard style={{ padding: 18 }}><p style={{ color: '#A3B18A', fontSize: 11 }}>Assigned Class</p><p className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>{assignedClass}</p></GlassCard>
              <GlassCard style={{ padding: 18 }}><p style={{ color: '#A3B18A', fontSize: 11 }}>Today Present</p><p style={{ color: '#4ade80', fontSize: 20, fontWeight: 700 }}>{presentToday}</p></GlassCard>
              <GlassCard style={{ padding: 18 }}><p style={{ color: '#A3B18A', fontSize: 11 }}>Pending Leaves</p><p style={{ color: '#fbbf24', fontSize: 20, fontWeight: 700 }}>{leaveRequests.filter((l) => l.status === 'pending').length}</p></GlassCard>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAttendanceModal(true)} className="px-4 py-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)' }}>Mark Attendance</button>
              <button onClick={() => setActiveTab('attendance')} className="px-4 py-2 rounded-xl" style={{ color: '#A3B18A', border: '1px solid rgba(163,177,138,0.2)' }}>View Records</button>
            </div>
          </motion.div>
        )}

        {activeTab === 'attendance' && (
          <GlassCard style={{ padding: 20 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white" style={{ fontWeight: 700 }}>Stored Attendance Records</h3>
              <button onClick={() => setShowAttendanceModal(true)} className="px-3 py-1 rounded-lg" style={{ background: 'rgba(88,129,87,0.2)', color: '#A3B18A' }}>Mark for Today</button>
            </div>
            {attendanceSummary.length === 0 ? (
              <p style={{ color: '#A3B18A', fontSize: 13 }}>No records saved yet. Click "Mark for Today" to create one.</p>
            ) : (
              <div className="space-y-2">
                {attendanceSummary.map((rec) => (
                  <div key={rec.date} className="p-3 rounded-xl flex items-center justify-between" style={{ border: '1px solid rgba(163,177,138,0.1)' }}>
                    <div>
                      <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{rec.date}</p>
                      <p style={{ color: '#A3B18A', fontSize: 12 }}>Present: {rec.present} · Absent: {rec.absent}</p>
                    </div>
                    {rec.date === new Date().toISOString().split('T')[0] ? <span style={{ color: '#4ade80', fontSize: 12 }}>Editable Today</span> : <span style={{ color: '#fbbf24', fontSize: 12 }}>Locked</span>}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {activeTab === 'leave' && (
          <GlassCard style={{ padding: 20 }}>
            <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Leave Requests</h3>
            <div className="space-y-3">
              {leaveRequests.map((req) => (
                <div key={req.id} className="p-3 rounded-xl" style={{ border: '1px solid rgba(163,177,138,0.1)' }}>
                  <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{req.studentName} · {req.from} to {req.to}</p>
                  <p style={{ color: '#A3B18A', fontSize: 12, marginTop: 4 }}>{req.reason}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-1 rounded-lg" style={{ fontSize: 11, color: req.status === 'approved' ? '#4ade80' : req.status === 'rejected' ? '#f87171' : '#fbbf24', background: 'rgba(255,255,255,0.05)' }}>{req.status}</span>
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => updateLeaveStatus(req.id, 'approved')} className="px-2 py-1 rounded-lg" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)' }}>Approve</button>
                        <button onClick={() => updateLeaveStatus(req.id, 'rejected')} className="px-2 py-1 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {!['overview', 'attendance', 'leave'].includes(activeTab) && (
          <GlassCard style={{ padding: 24 }}>
            <p style={{ color: '#A3B18A' }}>This section is available in demo mode.</p>
          </GlassCard>
        )}
      </div>

      <AttendanceModal isOpen={showAttendanceModal} onClose={() => setShowAttendanceModal(false)} assignedClass={assignedClass} onSave={handleSaveAttendance} />
    </DashboardLayout>
  );
}