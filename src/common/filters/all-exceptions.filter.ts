import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    const status = exception.getStatus()
    const message = exception.getResponse()
    response.status(status).json({
      statusCode: status,
      message,
    })
  }
}
