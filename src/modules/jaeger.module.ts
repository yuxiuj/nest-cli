import { Module, Global, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JaegerService } from '../services/jaeger.service';
import { TracingInterceptor } from '../interceptor/tracing.interceptor';

@Global()
@Module({
  providers: [JaegerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingInterceptor,
      scope: Scope.REQUEST,
    },
  ],
  exports: [JaegerService],
})
export class JaegerModule {
}
