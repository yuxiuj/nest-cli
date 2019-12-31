import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
import { UserInfoDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 获取所有用户
  @Get('get')
  @UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
  async getUsers() {
    return this.userService.getUsers();
  }
  // 新增用户
  @Post('create')
  @UseInterceptors(LoggingInterceptor)
  createUser(@Body() body: UserInfoDto) {
    return this.userService.createUser(body);
  }
  // 更新用户
  @Put('update/:id')
  @UseInterceptors(LoggingInterceptor)
  updateUser(@Body() body, @Param() params) {
    return this.userService.updateUser(params.id, body);
  }
  // 删除用户
  @Delete('delete/:id')
  @UseInterceptors(LoggingInterceptor)
  deleteUser(@Param() params) {
    return this.userService.deleteUser(params.id);
  }
}
