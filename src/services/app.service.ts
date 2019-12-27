import { Injectable } from '@nestjs/common';
import { User } from '../db/user.entity';
import { getMongoRepository } from "typeorm";
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  // private readonly repository = getMongoRepository(User);
  // 获取所有用户
  async getUsers() {
    const repository = getMongoRepository(User);
    return await repository.find();
  }
  // // 创建用户
  // async createUser(userInfo) {
  //   const existUser = await this.checkExistUser(userInfo);
  //   if (existUser) {
  //     throw new HttpException('用户已经注册过', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  //   const user = new User();
  //   user.firstName = userInfo.firstName;
  //   user.lastName = userInfo.lastName;
  //   await this.repository.save(user);
  // }
  // // 检查用户是否已经存在
  // async checkExistUser(userInfo) {
  //   return await this.repository.findOne(userInfo);
  // }
  // // 修改用户信息
  // async updateUser(userInfo) {
  //   // return await this.repository.findOneAndUpdate()
  // }
}
