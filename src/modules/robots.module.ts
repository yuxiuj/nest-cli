import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Robot } from '../db/robot.entity';
import { RobotsService } from '../services/robots/robots.service';
import { RobotsController } from '../controllers/robots.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RadarModule } from './radar/radar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Robot]),
    ClientsModule.register([{ name: 'KAFKA_CLIENT', transport: Transport.KAFKA }]),
    HttpModule,
    RadarModule],
  controllers: [RobotsController],
  providers: [RobotsService],
  exports: [RobotsService],
})
export class RobotsModule {
}
