import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
