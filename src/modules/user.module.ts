import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../schemas/user.schema';
import MODEL from '../constants/model';

@Module({
  imports: [MongooseModule.forFeature([{ name: MODEL.USER_MODEL, schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
