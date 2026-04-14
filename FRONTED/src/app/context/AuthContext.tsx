// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// export type UserRole = 'student' | 'teacher' | 'manager' | 'cashier' | 'admin';

// export interface AuthUser {
//   id: string;
//   name: string;
//   role: UserRole;
//   email: string;
//   class?: string;
//   subject?: string;
//   avatar?: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   login: (userId: string, password: string) => { success: boolean; error?: string };
//   logout: () => void;
//   isLoading: boolean;
// }

// const MOCK_CREDENTIALS: Record<string, { password: string; user: AuthUser }> = {
//   student: {
//     password: 'student123',
//     user: { id: 'S2024047', name: 'Arjun Sharma', role: 'student', email: 'arjun.sharma@greenfield.edu.in', class: '11-A', avatar: 'AS' },
//   },
//   teacher: {
//     password: 'teacher123',
//     user: { id: 'T1045', name: 'Mrs. Priya Singh', role: 'teacher', email: 'priya.singh@greenfield.edu.in', class: '11-A', subject: 'Physics', avatar: 'PS' },
//   },
//   manager: {
//     password: 'manager123',
//     user: { id: 'M2001', name: 'Mr. Amit Kumar', role: 'manager', email: 'amit.kumar@greenfield.edu.in', avatar: 'AK' },
//   },
//   cashier: {
//     password: 'cashier123',
//     user: { id: 'C3001', name: 'Mr. Suresh Rao', role: 'cashier', email: 'suresh.rao@greenfield.edu.in', avatar: 'SR' },
//   },
//   admin: {
//     password: 'admin123',
//     user: { id: 'A0001', name: 'System Admin', role: 'admin', email: 'admin@greenfield.edu.in', avatar: 'SA' },
//   },
// };

// const ROLE_DASHBOARD: Record<UserRole, string> = {
//   student: '/dashboard/student',
//   teacher: '/dashboard/teacher',
//   manager: '/dashboard/manager',
//   cashier: '/dashboard/cashier',
//   admin: '/dashboard/admin',
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const stored = localStorage.getItem('sap_user');
//     if (stored) {
//       try { setUser(JSON.parse(stored)); } catch {}
//     }
//     setIsLoading(false);
//   }, []);

//   const login = (userId: string, password: string) => {
//     const cred = MOCK_CREDENTIALS[userId];
//     if (!cred) return { success: false, error: 'Invalid User ID. Please check your credentials.' };
//     if (cred.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };
//     setUser(cred.user);
//     localStorage.setItem('sap_user', JSON.stringify(cred.user));
//     return { success: true };
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('sap_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }

// export { ROLE_DASHBOARD };





import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'manager' | 'cashier' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  class?: string;
  subject?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const MOCK_CREDENTIALS: Record<string, { password: string; user: AuthUser }> = {
  student: {
    password: 'student123',
    user: {
      id: 'S2024047',
      name: 'Arjun Sharma',
      role: 'student',
      email: 'arjun.sharma@greenfield.edu.in',
      class: '11-A',
      avatar: 'AS',
    },
  },
  teacher: {
    password: 'teacher123',
    user: {
      id: 'T1045',
      name: 'Mrs. Priya Singh',
      role: 'teacher',
      email: 'priya.singh@greenfield.edu.in',
      class: '11-A',
      subject: 'Physics',
      avatar: 'PS',
    },
  },
  manager: {
    password: 'manager123',
    user: {
      id: 'M2001',
      name: 'Mr. Amit Kumar',
      role: 'manager',
      email: 'amit.kumar@greenfield.edu.in',
      avatar: 'AK',
    },
  },
  cashier: {
    password: 'cashier123',
    user: {
      id: 'C3001',
      name: 'Mr. Suresh Rao',
      role: 'cashier',
      email: 'suresh.rao@greenfield.edu.in',
      avatar: 'SR',
    },
  },
  admin: {
    password: 'admin123',
    user: {
      id: 'A0001',
      name: 'System Admin',
      role: 'admin',
      email: 'admin@greenfield.edu.in',
      avatar: 'SA',
    },
  },
};

const ROLE_DASHBOARD: Record<UserRole, string> = {
  student: '/dashboard/student',
  teacher: '/dashboard/teacher',
  manager: '/dashboard/manager',
  cashier: '/dashboard/cashier',
  admin: '/dashboard/admin',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sap_user');

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // Basic validation
        if (parsed?.id && parsed?.role && ROLE_DASHBOARD[parsed.role]) {
          setUser(parsed);
        } else {
          localStorage.removeItem('sap_user');
        }
      } catch (e) {
        console.error('Invalid stored user:', e);
        localStorage.removeItem('sap_user');
      }
    }

    setIsLoading(false);
  }, []);

  // ✅ FIXED LOGIN FUNCTION
  const login = (userId: string, password: string) => {
    const cred = Object.values(MOCK_CREDENTIALS).find(
      (c) => c.user.id.toLowerCase() === userId.toLowerCase()
    );

    if (!cred) {
      return {
        success: false,
        error: 'Invalid User ID. Please check your credentials.',
      };
    }

    if (cred.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    setUser(cred.user);
    localStorage.setItem('sap_user', JSON.stringify(cred.user));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sap_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLE_DASHBOARD };