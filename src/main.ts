import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './interceptor/http-exception.filter';
import { AnyExceptionFilter } from './interceptor/any-exception.filter';
import { ValidationPipe } from './validate/validateRequest';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { CompressionTypes } from '@nestjs/common/interfaces/external/kafka-options.interface';
// import config from './config/config';
// import { Transport } from '@nestjs/microservices';

const LISTEN_PORT = 3111;
// const kafkaOptions = merge({
//   name: 'KAFKA_CLIENT',
//   consumer: {
//     groupId: 'ice-borne',
//   },
//   send: {
//     compression: CompressionTypes.Snappy,
//   },
//   // producer存在问题
//   producer: {
//     maxInFlightRequests: 5,
//     // true时当对应topic不存在会自动在kafka上创建topic
//     allowAutoTopicCreation: false,
//   },
// }, config.kafka);

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.setGlobalPrefix('api/v1');
  // app.connectMicroservice({
  //   transport: Transport.KAFKA,
  //   options: kafkaOptions,
  // });
  app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());
  // http异常拦截 包装响应格式
  app.useGlobalFilters(new HttpExceptionFilter());
  // 异常拦截 包装响应格式
  app.useGlobalFilters(new AnyExceptionFilter());
  // 响应拦截 包装格式
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(LISTEN_PORT);
  Logger.log(`http://127.0.0.1:${LISTEN_PORT}`, 'AppListening');
}

bootstrap();
