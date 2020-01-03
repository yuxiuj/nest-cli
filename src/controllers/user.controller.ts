import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly catsService: UserService) {}

  @Get('get')
  async findAll(): Promise<IUser[]> {
    return this.catsService.get();
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.catsService.create(createUserDto);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.catsService.update(id, createUserDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.catsService.delete(id);
  }
}
