import { Module } from '@nestjs/common';
import { CosController } from '../controllers/cos.controller';

@Module({
  controllers: [CosController],
})
export class CosModule {}
