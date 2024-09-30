'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextProps {
  contextToken: string | null;
  setContextToken: (token: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextToken, setContextToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    setContextToken(storedToken);
  }, []);

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      if(localStorage.getItem('token') !== null) {
      localStorage.setItem('token', newToken);
      setContextToken(newToken);
      } else {
        sessionStorage.setItem('token', newToken);
        setContextToken(newToken);
      }
    }
  };

  return (
    <UserContext.Provider value={{ contextToken, setContextToken: updateToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
