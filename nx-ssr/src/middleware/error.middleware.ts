import type { NextFunction, Request, Response } from 'express';

/**
 * Example error logger
 */
export function errorLoggerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  next(err);
}

/**
 * Example error sent to the client
 */
export function errorClientMiddleware(
  err: Error,
  req: Request,
  res: Response
): void {
  res.status(500);
  res.render('error', {
    error: 'Ups! something want wrong...',
  });
}
