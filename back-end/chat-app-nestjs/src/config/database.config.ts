import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Conversation } from '../chat/entities/conversation.entity';
import { MessageHistory } from '../chat/entities/message.entity';
import { Token } from '../auth/token.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Token, Conversation, MessageHistory],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
});

// For CLI commands
const configService = new ConfigService();
export default new DataSource(getDatabaseConfig(configService));
