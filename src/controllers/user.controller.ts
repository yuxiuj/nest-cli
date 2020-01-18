import { Controller, Get, Post, Body, Put, Delete, Param, Inject, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('user')
export class UserController {
  constructor(private readonly catsService: UserService, @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

  @Get('get')
  async findAll(): Promise<IUser[]> {
    this.logger.log('logger get user api');
    return this.catsService.get();
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('logger create user api');
    return this.catsService.create(createUserDto);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    this.logger.log('logger update user api');
    return this.catsService.update(id, createUserDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    this.logger.log('logger delete user api');
    return this.catsService.delete(id);
  }
}
