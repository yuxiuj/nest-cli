import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/user.dto';
import { IUser } from '../interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import MODEL from '../constants/model';

@Injectable()
export class UserService {
  constructor(@InjectModel(MODEL.USER_MODEL) private readonly userModel: Model<IUser>) {}

  async get(): Promise<IUser[]> {
    // throw new HttpException('获取用户失败', HttpStatus.INTERNAL_SERVER_ERROR);
    return await this.userModel.find();
  }

  async isExistUser(userInfo): Promise<IUser> {
    return await this.userModel.find(userInfo);
  }

  async create(createUserDto: CreateUserDto) {
    const findUsers = await this.isExistUser(createUserDto);
    if (Array.isArray(findUsers) && findUsers.length > 0) {
      throw new HttpException('用户已经注册', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await this.userModel.create(createUserDto);
  }

  async update(id: string, createUserDto: CreateUserDto) {
    await this.userModel.updateOne({_id: id}, {$set: createUserDto});
  }

  async delete(id: string) {
    await this.userModel.deleteOne({_id: id});
  }
}
