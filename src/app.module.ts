import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOptions } from './utils/mysql.help';
import { WinstonModule } from 'nest-winston';
import { options } from './utils/getLogger';
import Modules from './modules/index.module';
// import { ConfigModule } from './modules/configModule/config.module';

@Module({
  imports: [
    WinstonModule.forRoot(options),
    // 配置动态配置
    // ConfigModule.register({key: 'etcd', namespace: `${process.env.NODE_ENV}:JSON:`}),
    // ConfigModule.register(),
    // 数据库
    TypeOrmModule.forRoot(getOptions()),
    HttpModule,
    ...Modules,
  ],
})

export class ApplicationModule {}
