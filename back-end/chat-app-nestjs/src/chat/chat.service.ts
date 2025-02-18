import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { MessageHistory } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversaton.dto';
import { User } from 'src/users/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkAsReadDto } from './dto/mark-read.dto';
import {
  ChatResponse,
  UnreadMessagesResponse,
  ConversationWithMessages,
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

  async getAllConversations(id: number): Promise<GetAllConversationsResponse> {
    const conversations = await this.conversationRepository.find({
      where: [{ participant_id: id }, { creator_id: id }],
    });
    return {
      message: 'Conversations retrieved successfully',
      conversations,
    };
  }

  async createConversation(body: CreateConversationDto): Promise<ChatResponse> {
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
      return {
        message: 'Conversation already exists',
        data: existingConversation,
      };
    }

    const conversation = this.conversationRepository.create({
      participant_id: user1.id,
      creator_id: user2.id,
      title: `${user1.first_name} ${user1.last_name} _ ${user2.first_name} ${user2.last_name}`,
      description: `${user2.first_name} ${user2.last_name}`,
      metadata: {},
    });
    //save conversation
    const savedConversation =
      await this.conversationRepository.save(conversation);
    return {
      message: 'Conversation created successfully',
      data: savedConversation,
    };
  }

  async getConversation(id: number): Promise<ConversationWithMessages> {
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

    return {
      message: 'Conversation retrieved successfully',
      conversation,
      messagesHistory: conversation.messages,
    };
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
}
