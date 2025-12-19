import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '../types';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userId: string;
  userName: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  
  // Mock user IDs based on role
  const getUserId = () => {
    if (role === 'customer') return 'cust-1';
    if (role === 'provider') return 'prov-1';
    return 'admin-1';
  };
  
  const getUserName = () => {
    if (role === 'customer') return 'Arjun Mehta';
    if (role === 'provider') return 'Rajesh Kumar';
    return 'Admin User';
  };

  return (
    <UserContext.Provider value={{ 
      role, 
      setRole,
      userId: getUserId(),
      userName: getUserName()
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
