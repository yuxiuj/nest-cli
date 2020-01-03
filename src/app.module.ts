import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { options } from './utils/getLogger.util';
import Modules from './modules/index.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    WinstonModule.forRoot(options),
    ...Modules,
  ],
})

export class ApplicationModule {}
