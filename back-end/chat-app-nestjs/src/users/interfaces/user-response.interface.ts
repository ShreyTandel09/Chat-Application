import { User } from '../entities/user.entity';

export interface UsersResponse {
  message: string;
  data: User[];
}

export interface SingleUserResponse {
  message: string;
  data: User;
}
