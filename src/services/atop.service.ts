import { Injectable, Logger, Scope, Global } from '@nestjs/common';
import { configValue } from '../modules/configModule/config-value.decorator';

@Global()
@Injectable({ scope: Scope.REQUEST })
export class AtopService {
  @configValue('atop', {})
  private readonly atopConfig: object;
  private readonly clientConfig: object;

  constructor(clientConfig) {
    this.clientConfig = { ...this.atopConfig, ...clientConfig };
  }

  private readonly logger = new Logger('atop');

}
