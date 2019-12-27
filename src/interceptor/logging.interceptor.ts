import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  protected readonly logger = new Logger('logInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handleName = context.getHandler().name;
    this.logger.log('Before...', handleName);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(data =>
          this.logger.log(
            `After... ${Date.now() - now}ms：${JSON.stringify(data)}`,
            handleName,
          ),
        ),
      );
  }
}
