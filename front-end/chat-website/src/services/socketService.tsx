import { io, Socket } from 'socket.io-client';



class SocketService {
    private socket: Socket | null = null;
    private static instance: SocketService;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public connect(): Socket {
        if (!this.socket) {

            this.socket = io(`${process.env.REACT_APP_API_URL}/chat`, {
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });


            this.socket.on('connect', () => {
                const resData = JSON.parse(localStorage.getItem('persist:chat') || '{}');
                const currentUser = resData.currentUser ? JSON.parse(resData.currentUser) : null;
                this.registerUser(currentUser.id);
                console.log('Socket connected:', this.socket?.id);
            });


            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            this.socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });
        }

        return this.socket;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public registerUser(userId: number): void {
        if (this.socket) {
            this.socket.emit('register', userId);
        }
    }

    public joinConversation(conversationId: number): void {
        if (this.socket) {
            this.socket.emit('joinConversation', { conversationId });
        }
    }

    public sendMessage(messageData: any): void {
        if (this.socket) {
            this.socket.emit('sendMessage', messageData);
        }
    }

    public onNewMessage(callback: (message: any) => void): void {
        if (this.socket) {
            this.socket.on('newMessage', callback);
        }
    }

    public removeListener(event: string): void {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

export default SocketService.getInstance(); 