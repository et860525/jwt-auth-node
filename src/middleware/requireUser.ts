import { Request, Response, NextFunction } from 'express';
import DefaultError from '../exceptions/default.exception';

/* Check if the user is logged in */
export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return next(
        new DefaultError(`Invalid token or session has expired`, 401)
      );
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
