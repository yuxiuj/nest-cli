import {
  Controller,
  Get,
  UseInterceptors,
  Query,
  Body,
  Param,
  Post,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';


// tslint:disable-next-line: max-classes-per-file
@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('get')
  @UseInterceptors(LoggingInterceptor)
  async getUsers() {
    return this.appService.getUsers();
  }
  // @Post('create')
  // // @UseInterceptors(LoggingInterceptor)
  // createUser(@Body() body) {
  //   return this.appService.createUser(body);
  // }
  // @Post('update')
  // updateUser(@Body() body) {
  //   return this.appService.updateUser(body);
  // }
}
