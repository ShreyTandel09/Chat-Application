import { IsEmail } from 'class-validator';

export class EmailVerifyDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;
}
