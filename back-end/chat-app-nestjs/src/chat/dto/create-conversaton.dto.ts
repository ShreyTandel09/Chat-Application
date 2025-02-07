import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty({ message: 'Client ID is required' })
  @IsNumber()
  clientId1: number;

  @IsNotEmpty({ message: 'Client ID is required' })
  @IsNumber()
  clientId2: number;
}
