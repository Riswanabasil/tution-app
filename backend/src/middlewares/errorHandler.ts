import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  if (res.headersSent) return;

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error({
      method: req.method,
      path: req.originalUrl,
      status,
      message: err.message,
      stack: err.stack,
    });
  }

  const body: Record<string, any> = { message };
  if (err.code) body.code = err.code;
  if (process.env.NODE_ENV === 'development') body.stack = err.stack;

  res.status(status).json(body);
}

export class AlreadyPaidError extends Error {
  constructor(message = 'Course already paid') { super(message); this.name = 'AlreadyPaidError'; }
}
