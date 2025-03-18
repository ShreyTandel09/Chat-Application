import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { getDatabaseConfig } from './database.config';

config();

const configService = new ConfigService();
const options = getDatabaseConfig(configService);

export default new DataSource(options);
