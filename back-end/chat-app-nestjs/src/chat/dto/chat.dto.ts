import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateConversationDto {
  @IsNotEmpty({ message: 'Client ID is required' })
  @IsNumber()
  clientId1: number;

  @IsNotEmpty({ message: 'Client ID is required' })
  @IsNumber()
  clientId2: number;

  user?: User;
}

export class MarkAsReadDto {
  @IsNotEmpty({ message: 'Conversation ID is required' })
  @IsNumber()
  conversationId: number;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  userId: number;
}

export class SendMessageDto {
  @IsNotEmpty({ message: 'Conversation ID is required' })
  @IsNumber()
  conversationId: number;

  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  message: string;

  @IsNotEmpty({ message: 'Sender ID is required' })
  @IsNumber()
  senderId: number;

  @IsNotEmpty({ message: 'Receiver ID is required' })
  @IsNumber()
  receiverId: number;
}

export class RegisterPayload {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  userId: number;
}

export class ConversationId {
  @IsNotEmpty({ message: 'Conversation ID is required' })
  @IsNumber()
  conversationId: number;
}
