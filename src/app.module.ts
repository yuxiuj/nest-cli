import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOptions } from './utils/mongodb.util';
import { WinstonModule } from 'nest-winston';
import { options } from './utils/getLogger.util';
import Modules from './modules/index.module';

@Module({
  imports: [
    WinstonModule.forRoot(options),
    // 数据库
    TypeOrmModule.forRoot(getOptions()),
    HttpModule,
    ...Modules,
  ],
})

export class ApplicationModule {}
