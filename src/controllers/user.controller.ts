import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { IUser } from '../interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly catsService: UserService) {}

  @Post('create')
  async create(@Body() userDto: UserDto) {
    this.catsService.create(userDto);
  }

  @Get('get')
  async findAll(): Promise<IUser[]> {
    return this.catsService.get();
  }
}
