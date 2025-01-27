import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_OPTIONS } from './constants';
import setupHandlers from './setupHandlers';

let socket: any = null;

const createSocketConnection = () => {
  if (!socket) {
    console.log('Connecting to', SOCKET_URL);
    socket = io(SOCKET_URL, SOCKET_OPTIONS);

    // Добавляем обработчики событий
    setupHandlers(socket);

    // Обработка переподключения
    socket.on('reconnect_attempt', (attemptNumber: any) => {
      console.log(`Reconnect attempt #${attemptNumber}`);
    });

    socket.on('reconnect', () => {
      console.log('Successfully reconnected');
    });

    socket.on('connect_error', (err: any) => {
      console.error('Connection error:', err.message);
    });

    socket.on('disconnect', (reason: any) => {
      console.warn('Socket disconnected:', reason);
      // При необходимости, можно обрабатывать авто-переподключение вручную
    });
  }

  return socket;
};

export default createSocketConnection;
