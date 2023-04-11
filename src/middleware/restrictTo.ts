import { Request, Response, NextFunction } from 'express';
import DefaultError from '../exceptions/default.exception';

/* Restrict Unauthorized Access */
export const restrictTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) {
      return next(
        new DefaultError('You are not allowed to perform this action', 403)
      );
    }
    next();
  };
