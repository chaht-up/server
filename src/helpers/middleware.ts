import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Response } from 'express';
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import { Request } from 'express-serve-static-core';

export const logger = morgan('combined');

// eslint-disable-next-line import/prefer-default-export
export const checkContentType = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'];
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(406).json({ message: 'Content type must be "application/json"' });
  }

  return next();
};

export const parseCookie = cookieParser(process.env.COOKIE_SECRET || 'development');
