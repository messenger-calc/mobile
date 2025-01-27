import createSocketConnection from './index';

let socket: any = null;

export const connectSocket = () => {
  if (!socket || !socket.connected) {
    socket = createSocketConnection();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default connectSocket;