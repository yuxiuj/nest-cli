import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { options } from './utils/getLogger.util';
import Modules from './modules/index.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/index.config';
import { HealthController } from './controllers/health.controller';

const { username, password, host, port, database} = config.mongodb;
const dbUri = username && password ?
  `mongodb://${username}:${password}@${host}:${port}/${database}` :
  `mongodb://${host}:${port}/${database}`;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

@Module({
  imports: [
    MongooseModule.forRoot(dbUri, dbOptions),
    WinstonModule.forRoot(options),
    ...Modules,
  ],
  controllers: [HealthController], // 健康检查
})

export class ApplicationModule {}
