import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      errorMsg: exception.message,
      stack: exception.stack,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
