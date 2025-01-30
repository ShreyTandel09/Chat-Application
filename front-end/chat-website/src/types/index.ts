export interface User {
  id: number;
  name: string;
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
  senderId: number;
  content: string;
  timestamp: Date;
} 