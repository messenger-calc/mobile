import React, { createContext, useEffect } from 'react';
import createSocketConnection from './connection';

export const SocketContext = createContext<any>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = createSocketConnection();

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  );
};