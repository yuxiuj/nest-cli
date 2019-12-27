import {
  Controller,
  Get,
  HttpException,
  UseInterceptors,
  HttpStatus,
  Post,
  Query,
  Body,
  Logger,
  Inject,
  ParseIntPipe,
  OnModuleInit,
  Request,
} from '@nestjs/common';
import { Robot } from '../db/robot.entity';
import { RobotsService } from '../services/robots/robots.service';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
import { InjectConfig } from '../modules/configModule/inject.config.decorator';
import { EtcdConfig } from '../modules/configModule/etcd-config';
import { JaegerService } from '../services/jaeger.service';
import { MessagePattern, ClientKafka } from '@nestjs/microservices';
import { configValue } from '../modules/configModule/config-value.decorator';
import { RadarService } from '../modules/radar/radar.service';

@UseInterceptors(LoggingInterceptor)
@Controller('robot')
export class RobotsController implements OnModuleInit {
  constructor(
    private readonly robotsService: RobotsService,
    @InjectConfig()
    private readonly config: EtcdConfig,
    @Inject('KAFKA_CLIENT')
    private readonly client: ClientKafka,
    private readonly jaegerService: JaegerService,
    private readonly radarService: RadarService,
  ) {
  }

  protected readonly logger = new Logger('robotController');

  onModuleInit() {
    const requestPatterns = [
      'test',
    ];

    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Post('upsert')
  upsert(@Body() body): Promise<Robot[] | Robot> {
    return this.robotsService.upsert(body);
  }

  @Post('detail')
  detail(@Body('id', ParseIntPipe) id): Promise<Robot> {
    return this.robotsService.detail(id);
  }

  @Get('errorTest')
  getErrorTest(): string {
    const random = Math.random();
    if (random < 0.3) {
      throw new HttpException('sdsd', HttpStatus.BAD_REQUEST);
    }
    if (random >= 0.3 && random < 0.6) {
      throw new Error('dasdasda');
    }
    return 'success';
  }

  @Get('injectConfigTest')
  getInjectConfigTest(): string {
    // InjectConfig 测试
    return JSON.stringify(this.config.get<object>('mysql', {}));
  }

  @Get('loggerTest')
  testLogger(@Query() query): string {
    this.logger.log(JSON.stringify(query).repeat(50));
    return 'asdasd';
  }

  @Get('jaegerTest')
  jaegerTest(@Request()request): string {
    this.logger.log('xxx');
    return 'ssss';
  }

  @MessagePattern('test')
  async kafkaTest(message): Promise<void> {
    this.jaegerService.getTracer();
    await this.client.send<string>('test', { value: 'sdad' }).toPromise();
  }

  @configValue('mysql', { a: 1 })
  private readonly mysqlConfig: object;

  @Get('configValueTest')
  getConfigValueTestTest(): object {
    // InjectConfig 测试
    return this.mysqlConfig;
  }

  @Get('radarTest')
  async radarTest() {
    // meta:{apiRegion,lang,endpoint}, method, api, data = {}, query
    const a = await this.radarService.request('zh')({ lang: 'zh' }, 'POST', '/v1.0/industry/user/login?', {
      loginName: '17688786060',
      loginPassword: '4e766f95c539b7ab04b76bdb19c68b6b',
      countryCode: '86',
      industryType: 'service_provider',
      sendType: 99,
      domainName: 'service-provider.tuya.com',
    });
    this.logger.log(a);
    return a;
  }
}
