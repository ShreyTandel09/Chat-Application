import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { MessageHistory } from './entities/message.entity';
import { CreateConversationDto } from './dto/chat.dto';
import { User } from 'src/users/entities/user.entity';
import { SendMessageDto } from './dto/chat.dto';
import { MarkAsReadDto } from './dto/chat.dto';
import {
  ChatResponse,
  UnreadMessagesResponse,
  GetAllConversationsResponse,
} from './interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(MessageHistory)
    private messageHistoryRepository: Repository<MessageHistory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  /**
   * Generates a unique conversation ID
   * Combines timestamp, random string, and user IDs for uniqueness
   */
  generateUniqueConversationId(userId1: number, userId2: number): string {
    // Current timestamp in milliseconds
    const timestamp = Date.now().toString(36);

    // Random component (8 characters)
    const randomPart = Math.random().toString(36).substring(2, 10);

    // User IDs (sorted to ensure same ID regardless of order)
    const userPart = [userId1, userId2].sort().join('_');

    // Combine all parts
    const rawId = `${timestamp}_${randomPart}_${userPart}`;

    // Create a hash of the raw ID (optional, for shorter IDs)
    // Using simple string manipulation for demo
    // In production, consider a proper hashing function
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      const char = rawId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    // Return the final ID (combining hash and timestamp for uniqueness and sortability)
    return `${timestamp}_${Math.abs(hash).toString(36)}`;
  }

  async getAllConversations(id: number): Promise<GetAllConversationsResponse> {
    const conversations = await this.conversationRepository.find({
      where: [{ participant_id: id }, { creator_id: id }],
    });
    return {
      message: 'Conversations retrieved successfully',
      conversations,
    };
  }

  async createConversation(body: CreateConversationDto): Promise<Conversation> {
    const { clientId1, clientId2 } = body;

    if (clientId1 === clientId2) {
      throw new BadRequestException('Client IDs must be different');
    }

    if (!clientId1 || !clientId2) {
      throw new BadRequestException('Client IDs are required');
    }

    const user1 = await this.userRepository.findOne({
      where: { id: clientId1 },
    });
    const user2 = await this.userRepository.findOne({
      where: { id: clientId2 },
    });

    if (!user1 || !user2) {
      throw new BadRequestException('User not found');
    }

    const existingConversation = await this.conversationRepository.findOne({
      where: [
        {
          participant_id: user1.id,
          creator_id: user2.id,
        },
        {
          participant_id: user2.id,
          creator_id: user1.id,
        },
      ],
    });

    if (existingConversation) {
      return existingConversation;
    }

    const uniqueId = this.generateUniqueConversationId(user1.id, user2.id);

    const conversation = this.conversationRepository.create({
      participant_id: user1.id,
      creator_id: user2.id,
      title: uniqueId, // Store the unique ID
      created_at: new Date(),
      updated_at: new Date(),
    });
    //save conversation
    const savedConversation =
      await this.conversationRepository.save(conversation);
    return savedConversation;
  }

  async getConversation(id: number): Promise<Conversation> {
    if (!id) {
      throw new BadRequestException('Conversation ID is required');
    }
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: {
        participant: true,
        creator: true,
        messages: true,
      },
      order: {
        messages: {
          created_at: 'ASC',
        },
      },
    });

    return conversation;
  }

  async sendMessage(body: SendMessageDto): Promise<ChatResponse> {
    const { conversationId, message, senderId, receiverId } = body;
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    const messageHistory = this.messageHistoryRepository.create({
      conversation_id: conversation.id,
      message,
      sender_id: senderId,
      receiver_id: receiverId,
    });
    const savedMessageHistory =
      await this.messageHistoryRepository.save(messageHistory);

    return {
      message: 'Message sent successfully',
      messageHistory: savedMessageHistory,
    };
  }

  async getUnreadMessages(id: number): Promise<UnreadMessagesResponse> {
    const [messages, count] = await this.messageHistoryRepository.findAndCount({
      where: { receiver_id: id, is_read: false },
    });
    return {
      message: 'Unread messages retrieved successfully',
      messagesHistory: messages,
      count,
    };
  }

  async markAsRead(body: MarkAsReadDto): Promise<ChatResponse> {
    const { conversationId, userId } = body;
    await this.messageHistoryRepository.update(
      { conversation_id: conversationId, receiver_id: userId },
      { is_read: true },
    );
    return {
      message: 'Messages marked as read',
      success: true,
    };
  }

  async getReceiverId(
    conversationId: number,
    senderId: number,
  ): Promise<number> {
    const conversation = await this.conversationRepository.findOne({
      where: [
        {
          id: conversationId,
          participant_id: senderId,
        },
        {
          id: conversationId,
          creator_id: senderId,
        },
      ],
    });

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    const receiverId =
      conversation.participant_id === senderId
        ? conversation.creator_id
        : conversation.participant_id;
    return receiverId;
  }
}
