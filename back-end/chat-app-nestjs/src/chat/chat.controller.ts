import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-conversation')
  async createConversation(@Body() body: any) {
    const resData = await this.chatService.createConversation(body);
    return resData;
  }
}
