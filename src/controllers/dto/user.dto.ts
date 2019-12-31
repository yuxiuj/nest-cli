import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty()
  @IsString()
  @MinLength(1, {
    message: '长度不能小于1',
  })
  @MaxLength(3, {
    message: '长度不能超过3',
  })
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;
}
