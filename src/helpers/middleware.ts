// eslint-disable-next-line no-unused-vars
import express, { NextFunction, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line no-unused-vars, import/no-unresolved
import { Request } from 'express-serve-static-core';
import { errors } from './messages';

export const logger = morgan('combined');

const parseBody = express.json();

// eslint-disable-next-line import/prefer-default-export
export const checkContentType = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'];
  if (!contentType || contentType.toLowerCase() !== 'application/json') {
    return res.status(406).json({ message: errors.INVALID_CONTENT_TYPE });
  }

  return parseBody(req, res, next);
};

export const parseCookie = cookieParser(process.env.COOKIE_SECRET || 'development');
