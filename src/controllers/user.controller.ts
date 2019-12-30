import {
  Controller,
  Get,
  UseInterceptors,
  Body,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
import { UserInfoDto } from './dto/user.dto';

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
  createUser(@Body() body: UserInfoDto) {
    return this.userService.createUser(body);
  }
  @Post('update/:id')
  @UseInterceptors(LoggingInterceptor)
  updateUser(@Body() body, @Param() params) {
    return this.userService.updateUser(params.id, body);
  }
  @Post('delete/:id')
  @UseInterceptors(LoggingInterceptor)
  deleteUser(@Param() params) {
    return this.userService.deleteUser(params.id);
  }
}
