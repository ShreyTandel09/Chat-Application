import { User } from 'src/users/user.entity';

export interface AuthResponse {
  message: string;
  user?: User;
  accessToken?: string | null;
  refreshToken?: string | null;
}
