import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversaton.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkAsReadDto } from './dto/mark-read.dto';

@Controller('chat')
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('get-all-conversations')
  async getAllConversations(@Query('userId') id: number) {
    const resData = await this.chatService.getAllConversations(id);
    return resData;
  }

  @Post('create-conversation')
  async createConversation(@Body() body: CreateConversationDto) {
    const resData = await this.chatService.createConversation(body);
    return resData;
  }

  @Get('get-conversation')
  async getConversation(@Query('id') id: number) {
    const resData = await this.chatService.getConversation(id);
    return resData;
  }

  @Post('send-message')
  async sendMessage(@Body() body: SendMessageDto) {
    const resData = await this.chatService.sendMessage(body);
    return resData;
  }
  @Get('unread-messages')
  async getUnreadMessages(@Query('userId') id: number) {
    const resData = await this.chatService.getUnreadMessages(id);
    return resData;
  }

  @Post('mark-as-read')
  async markAsRead(@Body() body: MarkAsReadDto) {
    const resData = await this.chatService.markAsRead(body);
    return resData;
  }
}
