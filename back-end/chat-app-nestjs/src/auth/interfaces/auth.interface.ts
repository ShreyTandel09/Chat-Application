import { User } from 'src/users/entities/user.entity';

export interface AuthResponse {
  message: string;
  user?: User;
  accessToken?: string | null;
  refreshToken?: string | null;
}
