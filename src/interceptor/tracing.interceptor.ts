import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of, ObservableInput } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JaegerService } from '../services/jaeger.service';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  protected readonly logger = new Logger('logInterceptor');

  constructor(
    protected readonly jaegerService: JaegerService,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const span = this.jaegerService.startSpan(context.getHandler().name);
    return next
      .handle()
      .pipe(
        tap(() =>
          span.finish(),
        ),
        catchError((e: any, caught: Observable<any>): ObservableInput<any> => {
            span.finish();
            return of(e);
          },
        ),
      );
  }
}
