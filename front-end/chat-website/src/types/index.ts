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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
} 