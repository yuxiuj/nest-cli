import { Injectable, Logger, Scope, Inject, Global } from '@nestjs/common';
import { InjectConfig } from '../modules/configModule/inject.config.decorator';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { EtcdConfig } from '../modules/configModule/etcd-config';
import { FORMAT_HTTP_HEADERS } from 'opentracing';
import { initTracer as initJaegerTracer, ZipkinB3TextMapCodec } from 'jaeger-client';

@Global()
@Injectable({ scope: Scope.REQUEST })
export class JaegerService {
  private tracer: any;
  private counter: number = 0;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectConfig()
    private readonly config: EtcdConfig,
  ) {
    this.init();
  }

  private readonly logger = new Logger('jaeger');

  init(): void {
    // if()
    const serviceName = 'ice-borne_public';
    const config = {
      serviceName,
      // 采样率100%
      sampler: {
        type: 'const',
        param: 1,
      },
      reporter: {
        logSpans: true,
        collectorEndpoint: this.config.get('jaeger').endpoint,
      },
    };
    // tarcer需要调用log.info 默认logger仅存在log.log方法
    Reflect.defineProperty(this.logger, 'info', { value: this.logger.log });
    const options = {
      logger: this.logger,
      baggagePrefix: 'x-b3-',
    };
    this.tracer = initJaegerTracer(config, options);
    const codec = new ZipkinB3TextMapCodec({ urlEncoding: true });
    this.tracer.registerInjector(FORMAT_HTTP_HEADERS, codec);
    this.tracer.registerExtractor(FORMAT_HTTP_HEADERS, codec);
  }

  getTracer() {
    return this.tracer;
  }

  startSpan(name: string | symbol) {
    return this.tracer.startSpan(name);
  }
}
