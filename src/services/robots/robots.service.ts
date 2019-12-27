import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit, pick } from 'lodash';
import { Repository } from 'typeorm';
import { Robot } from '../../db/robot.entity';

@Injectable()
export class RobotsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Robot)
    private readonly robotRepository: Repository<Robot>,
  ) {}

  async upsert(data: Robot): Promise<Robot> {
    const robotEntity = Object.assign({}, omit(data, 'id'));
    const robot = await this.robotRepository.save(data);
    return Object.assign(robotEntity, pick(robot, 'id'));
  }

  async detail(id: number): Promise<Robot> {
    return this.robotRepository.findOne({ where: { id } });
  }

  async test(): Promise<string> {
    return 'adasd';
  }
}
