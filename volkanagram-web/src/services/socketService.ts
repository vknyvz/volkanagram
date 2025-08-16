import {io, Socket} from 'socket.io-client'
import {CLIENT_EVENTS} from '@/utils/socketEvents'

class SocketService
{
  private static instance: SocketService
  private socket: Socket

  private constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_ENDPOINT, {
      withCredentials: true,
      transports: ['websocket'],
      autoConnect: false
    })

    this.socket.on('connect_error', (err) => {
      console.error('Socket error:', err)
    })
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  public identify(userId: string): this {
    if (!this.socket.connected) {
      this.socket.connect()
    }

    this.socket.emit(CLIENT_EVENTS.USER_IDENTIFY, userId)
    return this
  }

  public on<T>(event: string, handler: (data: T) => void): this {
    this.socket.on(event, handler)
    return this
  }

  public disconnect(): void {
    this.socket.disconnect()
  }
}

export const getSocketService = () => SocketService.getInstance()

