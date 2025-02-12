import { IsNotEmpty, IsNumber } from 'class-validator';
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
