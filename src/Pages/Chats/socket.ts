import { io } from 'socket.io-client';

// eslint-disable-next-line import/prefer-default-export
export const userSessionSocket = io(
  'http://localhost:5001/araosdevsm/user-session'
);
