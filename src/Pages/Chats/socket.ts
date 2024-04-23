import { io } from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const userSessionSocket = io(
  'https://araosdev-social-media-backend.onrender.com/araosdevsm/user-session',
  { forceNew: true, autoConnect: false }
);

export const chatSessionSocket = io(
  'https://araosdev-social-media-backend.onrender.com/araosdevsm/chat-session',
  { autoConnect: false, forceNew: true }
);
