import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from '../dto/user.dto';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private readonly catModel: Model<IUser>) {}

  async get(): Promise<IUser[]> {
    return await this.catModel.find().exec();
  }

  async create(createCatDto: UserDto): Promise<IUser> {
    const createdCat = new this.catModel(createCatDto);
    return await createdCat.save();
  }
}
