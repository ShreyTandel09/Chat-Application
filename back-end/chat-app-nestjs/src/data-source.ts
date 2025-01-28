import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Token } from './auth/token.entity';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Token],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
