import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  ConversationId,
  RegisterPayload,
  SendMessageDto,
} from './dto/chat.dto';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private readonly userSocketMap = new Map<number, string>(); // userId -> socketId

  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Find and remove user from socket map
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  private parsePayload<T>(payload: T | string): T {
    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload) as T;
      } catch (error) {
        this.logger.error(`Registration error: ${error}`);
      }
    }
    return payload as T;
  }

  @SubscribeMessage('register')
  async handleRegister(client: Socket, payload: RegisterPayload) {
    try {
      const parsedPayload = this.parsePayload<RegisterPayload>(payload);
      const userId = Number(parsedPayload.data.userId);

      // Store socket mapping
      this.userSocketMap.set(userId, client.id);

      // Update user in database
      const user = await this.usersService.findUserById(userId);
      if (user) {
        user.socketId = client.id;
        await this.usersService.updateUser(user);
        this.logger.log(`User ${userId} registered with socket ${client.id}`);

        return { status: 'success', message: 'User registered successfully' };
      }

      return { status: 'error', message: 'User not found' };
    } catch (error) {
      this.logger.error(`Registration error: ${error}`);
      return { status: 'error', message: 'Failed to register user' };
    }
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(client: Socket, payload: ConversationId) {
    try {
      const parsedPayload = this.parsePayload<ConversationId>(payload);
      const roomName = await this.chatService.getConversation(
        parsedPayload.conversationId,
      );

      if (roomName) {
        await client.join(roomName.title);
        this.logger.log(`Client ${client.id} joined ${roomName.title}`);
        return { status: 'success', message: 'Joined conversation' };
      } else {
        return { status: 'error', message: 'Conversation not found' };
      }
    } catch (error) {
      this.logger.error(`Join conversation error: ${error}`);
      return { status: 'error', message: 'Failed to join conversation' };
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: SendMessageDto) {
    try {
      const parsedPayload = this.parsePayload<SendMessageDto>(payload);
      const roomName = await this.chatService.getConversation(
        parsedPayload.conversationId,
      );

      const senderId = this.getUserIdBySocketId(client.id);
      const receiverId = await this.chatService.getReceiverId(
        parsedPayload.conversationId,
        senderId,
      );

      // Save message to database
      await this.chatService.sendMessage({
        ...parsedPayload,
        senderId,
        receiverId,
      });

      // Emit to the conversation room
      this.server.to(roomName.title).emit('newMessage', parsedPayload);
      this.logger.log(`Message sent to conversation ${roomName.title}`);

      return { status: 'success', message: 'Message sent' };
    } catch (error) {
      this.logger.error(`Send message error: ${error}`);
      return { status: 'error', message: 'Failed to send message' };
    }
  }

  // Helper method to get user ID from socket ID
  private getUserIdBySocketId(socketId: string): number | null {
    for (const [userId, id] of this.userSocketMap.entries()) {
      if (id === socketId) return userId;
    }
    return null;
  }

  // Helper method to get socket ID from user ID
  private getSocketIdByUserId(userId: number): string | null {
    return this.userSocketMap.get(userId) || null;
  }
}
