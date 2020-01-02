import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './interceptor/http-exception.filter';
import { AnyExceptionFilter } from './interceptor/any-exception.filter';
import { ValidationPipe } from './validate/request.validate';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

const LISTEN_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.setGlobalPrefix('api/v1'); // 设置请求前缀
  app.startAllMicroservices();
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter()); // http异常拦截 包装响应格式
  app.useGlobalFilters(new AnyExceptionFilter()); // 异常拦截 包装响应格式
  app.useGlobalInterceptors(new ResponseInterceptor()); // 响应拦截 包装格式
  app.useGlobalPipes(new ValidationPipe()); // 校验请求字段
  await app.listen(LISTEN_PORT);
  Logger.log(`http://127.0.0.1:${LISTEN_PORT}`, 'AppListening');
}

bootstrap();
