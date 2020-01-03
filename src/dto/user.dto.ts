import { IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(5, {
    message: '最大长度为5',
  })
  readonly firstName: string;
  @MaxLength(5, {
    message: '最大长度为5',
  })
  readonly lastName: string;
}
