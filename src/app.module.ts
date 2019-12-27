import { Module, HttpModule } from '@nestjs/common';
import { RobotsModule } from './modules/robots.module';
import { HealthModule } from './modules/terminus-options.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { getOptions } from './utils/mysql.help';
import { ConfigModule } from './modules/configModule/config.module';
import { WinstonModule } from 'nest-winston';
import { options } from './utils/getLogger';
import { JaegerModule } from './modules/jaeger.module';

@Module({
  imports: [
    WinstonModule.forRoot(options),
    // 配置动态配置
    // ConfigModule.register({key: 'etcd', namespace: `${process.env.NODE_ENV}:JSON:`}),
    // ConfigModule.register(),
    // 数据库
    TypeOrmModule.forRoot(getOptions()),
    // 健康检查
    // HealthModule,
    // HttpModule,
    // JaegerModule,
    // RobotsModule,
  ],
  controllers: [AppController],  // 响应拦截 包装格式
  providers: [AppService],
})

export class ApplicationModule {}
