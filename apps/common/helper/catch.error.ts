/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

const logger = new Logger('ErrorHandler');

export const catchError = (error: any): never => {
  logger.error('An error occurred', error?.stack || error);

  if (error instanceof HttpException) {
    throw error;
  }
  const statusCode = error?.response?.statusCode || 500;
  const message =
    error?.response?.message || error?.message || 'Internal Server Error';

  if (statusCode && statusCode >= 400 && statusCode < 600) {
    throw new HttpException(message, statusCode);
  }
  throw new InternalServerErrorException(message);
};
