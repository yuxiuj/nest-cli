import { Controller, Get, Post, HttpCode, HttpException, HttpStatus } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health(): number {
    // throw new HttpException('获取health失败', HttpStatus.INTERNAL_SERVER_ERROR);
    return 1;
  }

  @Post()
  @HttpCode(200)
  Health(): number {
    return 1;
  }
}
