import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { MessageHistory } from './entities/message.entity';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(MessageHistory)
    private messageHistoryRepository: Repository<MessageHistory>,
  ) {}

  async createConversation(body: any) {
    const { sender_id, receiver_id } = body;

    if (!sender_id || !receiver_id) {
      throw new BadRequestException('Sender and receiver IDs are required');
    }

    const conversation = this.conversationRepository.create({
      sender_id,
      receiver_id,
    });
    return await this.conversationRepository.save(conversation);
  }
}
