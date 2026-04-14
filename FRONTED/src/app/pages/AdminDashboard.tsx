import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, GraduationCap, BookOpen, Shield, Settings, Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle, X, Bell, Search, Copy, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const ROLES = ['student', 'teacher', 'manager', 'cashier', 'admin'];
const roleColors: Record<string, string> = {
  student: '#588157', teacher: '#4a7c6f', manager: '#5a6e8a', cashier: '#7a6a4a', admin: '#6a4a7a'
};

const initialUsers = [
  { id: 'S2024047', name: 'Arjun Sharma', role: 'student', email: 'arjun@greenfield.edu.in', status: 'active', createdAt: '1 Apr 2024' },
  { id: 'T1045', name: 'Mrs. Priya Singh', role: 'teacher', email: 'priya@greenfield.edu.in', status: 'active', createdAt: '15 Jun 2020' },
  { id: 'M2001', name: 'Mr. Amit Kumar', role: 'manager', email: 'amit@greenfield.edu.in', status: 'active', createdAt: '10 Jul 2019' },
  { id: 'C3001', name: 'Mr. Suresh Rao', role: 'cashier', email: 'suresh@greenfield.edu.in', status: 'active', createdAt: '5 Jan 2021' },
  { id: 'T1046', name: 'Mr. Rajan Verma', role: 'teacher', email: 'rajan@greenfield.edu.in', status: 'active', createdAt: '2 Aug 2018' },
  { id: 'T1047', name: 'Mrs. Sunita Khanna', role: 'teacher', email: 'sunita@greenfield.edu.in', status: 'inactive', createdAt: '12 Mar 2017' },
];

const studentList = [
  { id: 'S2024047', name: 'Arjun Sharma', class: '11-A', dob: '15 Mar 2008', guardian: 'Mr. Rajesh Sharma', phone: '+91 98765 43210', status: 'active' },
  { id: 'S2024048', name: 'Priya Mehta', class: '11-B', dob: '22 Jun 2008', guardian: 'Mr. Arun Mehta', phone: '+91 91234 56789', status: 'active' },
  { id: 'S2024049', name: 'Rohit Gupta', class: '12-A', dob: '8 Nov 2007', guardian: 'Mrs. Sunita Gupta', phone: '+91 87654 32109', status: 'active' },
  { id: 'S2024050', name: 'Ananya Singh', class: '12-B', dob: '4 Feb 2007', guardian: 'Mr. Harpreet Singh', phone: '+91 76543 21098', status: 'active' },
  { id: 'S2024051', name: 'Vikram Nair', class: '10-A', dob: '19 Sep 2009', guardian: 'Mr. Vijay Nair', phone: '+91 65432 10987', status: 'active' },
];

const staffList = [
  { id: 'T1045', name: 'Mrs. Priya Singh', role: 'teacher', subject: 'Physics', exp: '8 years', phone: '+91 99887 76655', status: 'active' },
  { id: 'T1046', name: 'Mr. Rajan Verma', role: 'teacher', subject: 'Mathematics', exp: '12 years', phone: '+91 88776 65544', status: 'active' },
  { id: 'T1047', name: 'Mrs. Sunita Khanna', role: 'teacher', subject: 'Chemistry', exp: '15 years', phone: '+91 77665 54433', status: 'inactive' },
  { id: 'M2001', name: 'Mr. Amit Kumar', role: 'manager', subject: '—', exp: '6 years', phone: '+91 66554 43322', status: 'active' },
  { id: 'C3001', name: 'Mr. Suresh Rao', role: 'cashier', subject: '—', exp: '4 years', phone: '+91 55443 32211', status: 'active' },
];

function GlassCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(163,177,138,0.12)', borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md p-6 rounded-2xl z-10"
        style={{ background: 'rgba(15,30,20,0.95)', backdropFilter: 'blur(40px)', border: '1px solid rgba(163,177,138,0.2)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white" style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={16} style={{ color: '#A3B18A' }} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState(initialUsers);
  const [searchUser, setSearchUser] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', id: '', password: '' });
  const [createSuccess, setCreateSuccess] = useState(false);

  const generateId = () => {
    const prefix: Record<string, string> = { student: 'S', teacher: 'T', manager: 'M', cashier: 'C', admin: 'A' };
    return `${prefix[newUser.role]}${Math.floor(Math.random() * 9000 + 1000)}`;
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newUser.id || generateId();
    setUsers(prev => [...prev, { id, name: newUser.name, role: newUser.role, email: newUser.email, status: 'active', createdAt: '13 Apr 2026' }]);
    setCreateSuccess(true);
    setShowCreateModal(false);
    setTimeout(() => setCreateSuccess(false), 3000);
    setNewUser({ name: '', email: '', role: 'student', id: '', password: '' });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const filteredUsers = searchUser
    ? users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.id.includes(searchUser) || u.role.includes(searchUser.toLowerCase()))
    : users;

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab} title="Admin Panel"
      subtitle={`${user?.name} · System Administration`} notifications={0}>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New User">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 5 }}>Full Name</label>
                <input value={newUser.name} onChange={e => setNewUser(n => ({ ...n, name: e.target.value }))} required
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 5 }}>Email</label>
                <input value={newUser.email} onChange={e => setNewUser(n => ({ ...n, email: e.target.value }))} required type="email"
                  placeholder="user@greenfield.edu.in"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600, display: 'block', marginBottom: 5 }}>Role</label>
                <select value={newUser.role} onChange={e => setNewUser(n => ({ ...n, role: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: 'rgba(30,50,35,0.95)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 13 }}>
                  {ROLES.map(r => <option key={r} value={r} style={{ background: '#1a2e20' }}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label style={{ fontSize: 11, color: '#A3B18A', fontWeight: 600 }}>Auto-Generated Password</label>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.15)', color: '#A3B18A', fontSize: 13 }}>
                    {newUser.role}@Greenfield{new Date().getFullYear()}
                  </div>
                  <button type="button" className="p-3 rounded-xl" style={{ background: 'rgba(88,129,87,0.15)', color: '#588157' }}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                  Create User
                </motion.button>
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.15)', color: '#A3B18A', fontSize: 13 }}>
                  Cancel
                </motion.button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <div className="space-y-6">

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <h2 className="text-white" style={{ fontSize: 20, fontWeight: 700 }}>System Administration</h2>
              <p style={{ fontSize: 13, color: '#A3B18A', marginTop: 2 }}>Greenfield Academy ERP · v2.4.1</p>
            </div>
            {createSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <CheckCircle size={14} style={{ color: '#4ade80' }} />
                <span style={{ fontSize: 12, color: '#4ade80' }}>User created successfully! Credentials sent via email.</span>
              </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total Users', value: String(users.length), sub: 'All roles', icon: Users, color: '#588157' },
                { label: 'Students', value: '2,847', sub: 'Enrolled', icon: GraduationCap, color: '#4a7c6f' },
                { label: 'Staff', value: '128', sub: 'Faculty + Admin', icon: BookOpen, color: '#5a6e8a' },
                { label: 'Roles Defined', value: '5', sub: 'Access levels', icon: Shield, color: '#6a4a7a' },
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

            {/* Role breakdown */}
            <GlassCard style={{ padding: 20 }}>
              <p className="text-white mb-4" style={{ fontSize: 14, fontWeight: 600 }}>System Role Distribution</p>
              <div className="space-y-3">
                {ROLES.map(role => {
                  const count = users.filter(u => u.role === role).length;
                  const pct = Math.round((count / users.length) * 100);
                  const color = roleColors[role];
                  return (
                    <div key={role}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-white capitalize" style={{ fontSize: 13 }}>{role}</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#A3B18A' }}>{count} users ({pct}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                          className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Create User', tab: 'users', icon: Plus, color: '#588157', action: () => setShowCreateModal(true) },
                { label: 'Student Mgmt', tab: 'students', icon: GraduationCap, color: '#4a7c6f', action: () => setActiveTab('students') },
                { label: 'Staff Mgmt', tab: 'staff', icon: BookOpen, color: '#5a6e8a', action: () => setActiveTab('staff') },
                { label: 'Role Control', tab: 'roles', icon: Shield, color: '#6a4a7a', action: () => setActiveTab('roles') },
              ].map(({ label, icon: Icon, color, action }) => (
                <motion.button key={label} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={action}
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

        {/* User Management */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>User Management</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(163,177,138,0.5)' }} />
                  <input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Search users..."
                    className="pl-9 pr-4 py-2 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(163,177,138,0.2)', color: '#DAD7CD', fontSize: 12, width: 180 }} />
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                  <Plus size={13} /> New User
                </motion.button>
              </div>
            </div>
            <GlassCard style={{ padding: 16 }}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                      {['User ID', 'Name', 'Role', 'Email', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left pb-3 pr-4" style={{ color: '#A3B18A', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A', fontFamily: 'monospace', fontSize: 11 }}>{u.id}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white flex-shrink-0"
                              style={{ background: `linear-gradient(135deg, ${roleColors[u.role]}, #2d4a35)`, fontWeight: 700, fontSize: 10 }}>
                              {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-white" style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg capitalize" style={{ background: `${roleColors[u.role]}22`, color: roleColors[u.role], fontSize: 10, fontWeight: 600 }}>{u.role}</span>
                        </td>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A' }}>{u.email}</td>
                        <td className="py-3 pr-4">
                          <button onClick={() => toggleStatus(u.id)}
                            className="px-2 py-0.5 rounded-lg cursor-pointer"
                            style={{ background: u.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(163,177,138,0.1)', color: u.status === 'active' ? '#4ade80' : 'rgba(163,177,138,0.5)', fontSize: 10, fontWeight: 600 }}>
                            {u.status}
                          </button>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1.5">
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(88,129,87,0.15)' }}>
                              <Edit2 size={11} style={{ color: '#588157' }} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(88,129,87,0.1)' }}>
                              <RefreshCw size={11} style={{ color: '#A3B18A' }} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)' }}>
                              <Trash2 size={11} style={{ color: '#f87171' }} />
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

        {/* Students */}
        {activeTab === 'students' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Student Management</h2>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                <Plus size={13} /> Add Student
              </motion.button>
            </div>
            <div className="space-y-3">
              {studentList.map(s => (
                <motion.div key={s.id} whileHover={{ x: 4 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.1)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontWeight: 700 }}>
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white" style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</p>
                      <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(88,129,87,0.15)', color: '#A3B18A', fontSize: 10 }}>Class {s.class}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#A3B18A', marginTop: 1 }}>ID: {s.id} · Guardian: {s.guardian} · {s.phone}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 10, fontWeight: 600 }}>Active</span>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-xl" style={{ background: 'rgba(88,129,87,0.15)' }}>
                      <Edit2 size={13} style={{ color: '#588157' }} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-xl" style={{ background: 'rgba(248,113,113,0.1)' }}>
                      <Trash2 size={13} style={{ color: '#f87171' }} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Staff */}
        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Staff Management</h2>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #588157, #3A5A40)', fontSize: 13, fontWeight: 600 }}>
                <Plus size={13} /> Add Staff
              </motion.button>
            </div>
            <GlassCard style={{ padding: 16 }}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(163,177,138,0.1)' }}>
                      {['ID', 'Name', 'Role', 'Subject', 'Experience', 'Phone', 'Status', ''].map(h => (
                        <th key={h} className="text-left pb-3 pr-4" style={{ color: '#A3B18A', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(163,177,138,0.05)' }}>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A', fontFamily: 'monospace', fontSize: 11 }}>{s.id}</td>
                        <td className="py-3 pr-4 text-white" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{s.name}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg capitalize" style={{ background: `${roleColors[s.role]}22`, color: roleColors[s.role], fontSize: 10, fontWeight: 600 }}>{s.role}</span>
                        </td>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A' }}>{s.subject}</td>
                        <td className="py-3 pr-4" style={{ color: '#DAD7CD' }}>{s.exp}</td>
                        <td className="py-3 pr-4" style={{ color: '#A3B18A', whiteSpace: 'nowrap' }}>{s.phone}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg" style={{ background: s.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(163,177,138,0.1)', color: s.status === 'active' ? '#4ade80' : 'rgba(163,177,138,0.5)', fontSize: 10, fontWeight: 600 }}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1.5">
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(88,129,87,0.15)' }}>
                              <Edit2 size={11} style={{ color: '#588157' }} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} className="p-1.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)' }}>
                              <Trash2 size={11} style={{ color: '#f87171' }} />
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

        {/* Role Assignment */}
        {activeTab === 'roles' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>Role Assignment & Permissions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { role: 'student', icon: GraduationCap, perms: ['View attendance', 'View fees & pay online', 'Apply for leave', 'View profile & marks', 'Receive notifications'] },
                { role: 'teacher', icon: BookOpen, perms: ['Mark attendance', 'Enter & update marks', 'Approve/reject leave', 'View class performance', 'Notifications'] },
                { role: 'manager', icon: Users, perms: ['Create/edit timetable', 'Manage class sections', 'Assign teachers', 'Manage schedules', 'Notifications'] },
                { role: 'cashier', icon: Users, perms: ['Search students', 'Record fee payments', 'Verify online payments', 'View payment logs', 'Generate receipts'] },
                { role: 'admin', icon: Shield, perms: ['Create user accounts', 'Assign roles', 'Manage all students', 'Manage all staff', 'Full system access'] },
              ].map(({ role, icon: Icon, perms }) => {
                const color = roleColors[role];
                return (
                  <motion.div key={role} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <GlassCard style={{ padding: 20, height: '100%' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
                          <Icon size={18} style={{ color }} />
                        </div>
                        <p className="text-white capitalize" style={{ fontSize: 14, fontWeight: 700 }}>{role}</p>
                      </div>
                      <ul className="space-y-2">
                        {perms.map(p => (
                          <li key={p} className="flex items-center gap-2">
                            <CheckCircle size={12} style={{ color: '#588157', flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: '#A3B18A' }}>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <h2 className="text-white" style={{ fontSize: 18, fontWeight: 700 }}>System Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'School Name', value: 'Greenfield Academy' },
                { label: 'CBSE Affiliation No.', value: '2730211' },
                { label: 'Academic Year', value: '2025–2026' },
                { label: 'Current Term', value: 'Term 2 (Jan–Jun 2026)' },
                { label: 'ERP Version', value: 'GreenSAP v2.4.1' },
                { label: 'Last Backup', value: '13 Apr 2026, 02:00 AM' },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(163,177,138,0.1)' }}>
                  <p style={{ fontSize: 10, color: '#A3B18A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                  <p className="text-white mt-1" style={{ fontSize: 14, fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
