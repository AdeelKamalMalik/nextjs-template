import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { AuthContextProps, User } from '../types';
import { AUTH_CONTEXT_PROVIDER_ERROR } from '../constants';
import { clearLocalStorage, getAccessToken } from '@/utils';
import { fetchCurrentUser } from '@/queries/auth';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error(AUTH_CONTEXT_PROVIDER_ERROR);
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const token = getAccessToken();
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!token
  });

  const { data, isLoading, isFetched } = useQuery<User, Error>({
    queryKey: ["get-current-user"],
    queryFn: fetchCurrentUser,
    enabled: !!token
  });

  useEffect(() => {
    if(!isLoading && token && data){
      setIsAuthenticated(true)
      setCurrentUser(data as User)
    }
  }, [data, isLoading, token])

  useEffect(() => {
    if(isFetched && !data){
      console.log("CLARING")
      clearLocalStorage()
      window.location.href = '/'
    }
  }, [data, isFetched])

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
