import { Server, Socket } from 'socket.io'
import http from 'http'
import {CLIENT_EVENTS, ROOMS} from '../utils/socketEvents';

class SocketService
{
  private io: Server;
  private activeSockets = new Map<string, Socket>();

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_ENDPOINT,
        credentials: true
      }
    });

    this.run();
  }

  private run() {
    this.io.on('connection', (socket) => {
      this.activeSockets.set(socket.id, socket);

      socket.on(CLIENT_EVENTS.USER_IDENTIFY, (userId: string) => {
        socket.data.userId = userId;
        socket.join(ROOMS.user(userId));
      });

      socket.on('disconnect', () => {
        this.activeSockets.delete(socket.id);
      });
    });
  }

  emitToUser(userId: string, event: string, data: any) {
    this.io.to(ROOMS.user(userId)).emit(event, data);
  }
}

let instance: SocketService;
export const initSocketService = (httpServer: http.Server) => {
  instance = new SocketService(httpServer);
  return instance;
};
export const getSocketService = () => instance;