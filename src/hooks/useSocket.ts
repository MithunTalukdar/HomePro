import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL as string | undefined) || '';

let globalSocket: Socket | null = null;
let activeConnections = 0;

export function useSocket(token?: string | null) {
  const [socket, setSocket] = useState<Socket | null>(globalSocket);
  const [isConnected, setIsConnected] = useState(globalSocket?.connected || false);

  useEffect(() => {
    if (!token) return;

    activeConnections++;

    if (!globalSocket) {
      globalSocket = io(SOCKET_URL, {
        auth: { token }
      });
    }

    setSocket(globalSocket);
    setIsConnected(globalSocket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    globalSocket.on('connect', onConnect);
    globalSocket.on('disconnect', onDisconnect);

    return () => {
      activeConnections--;
      if (globalSocket) {
        globalSocket.off('connect', onConnect);
        globalSocket.off('disconnect', onDisconnect);
        
        if (activeConnections === 0) {
          globalSocket.disconnect();
          globalSocket = null;
        }
      }
    };
  }, [token]);

  return { socket, isConnected };
}
