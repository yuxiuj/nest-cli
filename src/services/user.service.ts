// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from '../db/schemas/user.schema';
// import { HttpException, HttpStatus } from '@nestjs/common';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly repository: Repository<User>,
//   ) {}
//   // 获取所有用户
//   async getUsers() {
//     return await this.repository.find();
//   }
//   // 创建用户
//   async createUser(userInfo) {
//     const existUser = await this.checkExistUser(userInfo);
//     if (existUser) {
//       throw new HttpException('用户已经注册过', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//     const user = new User();
//     user.firstName = userInfo.firstName;
//     user.lastName = userInfo.lastName;
//     await this.repository.save(user);
//   }
//   // 检查用户是否已经存在
//   async checkExistUser(userInfo) {
//     return await this.repository.findOne(userInfo);
//   }
//   // 修改用户信息
//   async updateUser(id, userInfo) {
//     if (!id) {
//       throw new HttpException('id不存在', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//     return await this.repository.update(id, userInfo);
//   }
//   // 删除用户
//   async deleteUser(userId) {
//     return await this.repository.delete(userId);
//   }
// }

import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from '../dto/user.dto';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@Inject('CAT_MODEL') private readonly catModel: Model<IUser>) {}

  async get(): Promise<IUser[]> {
    return await this.catModel.find().exec();
  }

  async create(createCatDto: UserDto): Promise<IUser> {
    const createdCat = new this.catModel(createCatDto);
    return await createdCat.save();
  }
}
