import { IsNotEmpty, IsNumber } from 'class-validator';

export class MarkAsReadDto {
  @IsNotEmpty({ message: 'Conversation ID is required' })
  @IsNumber()
  conversationId: number;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber()
  userId: number;
}
