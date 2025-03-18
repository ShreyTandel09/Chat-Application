export interface User {
  id: number;
  first_name: string;
  last_name: string;
  status?: 'online' | 'away' | 'offline';
  email?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface SignUpFormData extends AuthFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  re_password: string;
}

export interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: Date;
} 

export interface Conversation {
  id: number;
  title: string;
  participantIds: number;
  creatorId: number;
  description: string;
}