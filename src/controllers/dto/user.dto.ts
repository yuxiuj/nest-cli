import { IsString, IsInt, MinLength, MaxLength } from 'class-validator';

export class UserInfoDto {
  @IsString()
  @MinLength(1, {
    message: '长度不能小于1',
  })
  @MaxLength(3, {
    message: '长度不能超过3',
  })
  readonly firstName: string;
  @IsString()
  readonly lastName: string;
}
