import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { getOptions } from './utils/mongodb.util';
import { WinstonModule } from 'nest-winston';
import { options } from './utils/getLogger.util';
import Modules from './modules/index.module';

@Module({
  imports: [
    WinstonModule.forRoot(options),
    ...Modules,
  ],
})

export class ApplicationModule {}
