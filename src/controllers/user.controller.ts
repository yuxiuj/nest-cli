import {
  Controller,
  Get,
  UseInterceptors,
  Query,
  Body,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('get')
  @UseInterceptors(LoggingInterceptor)
  async getUsers() {
    return this.userService.getUsers();
  }
  @Post('create')
  @UseInterceptors(LoggingInterceptor)
  createUser(@Body() body) {
    this.userService.createUser(body);
  }
  @Post('update')
  @UseInterceptors(LoggingInterceptor)
  updateUser(@Body() body) {
    this.userService.updateUser(body);
  }
  @Post('delete/:id')
  @UseInterceptors(LoggingInterceptor)
  deleteUser(@Param() params) {
    this.userService.deleteUser(params.id);
  }
}
