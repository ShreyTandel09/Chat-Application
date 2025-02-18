import { Conversation } from '../entities/conversation.entity';
import { MessageHistory } from '../entities/message.entity';

export interface ChatResponse {
  message?: string;
  data?: Conversation;
  conversations?: Conversation[];
  messageHistory?: MessageHistory;
  messages?: MessageHistory[];
  count?: number;
  success?: boolean;
  error?: string;
}

export interface UnreadMessagesResponse {
  message: string;
  messagesHistory: MessageHistory[];
  count: number;
}

export interface ConversationWithMessages {
  message: string;
  conversation: Conversation;
  messagesHistory: MessageHistory[];
}

export interface MarkAsReadResponse {
  message: string;
  success: boolean;
}
export interface GetAllConversationsResponse {
  message: string;
  conversations: Conversation[];
}
