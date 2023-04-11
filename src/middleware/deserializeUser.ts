import { Request, Response, NextFunction } from 'express';
import DefaultError from '../exceptions/default.exception';
import { verifyJwt } from '../middleware/jwt';
import redisClient from '../database/connectRedis';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new DefaultError('You are not logged in', 401));
    }

    // Validate Access Token
    const decoded = verifyJwt<{ sub: string }>(access_token);

    console.log(decoded);

    if (!decoded) {
      return next(new DefaultError(`Invalid token or user doesn't exist`, 401));
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(new DefaultError(`User session has expired`, 401));
    }

    // Check if user still exist
    const user = await userService.findUserById(JSON.parse(session)._id);

    if (!user) {
      return next(
        new DefaultError(`User with that token no longer exist`, 401)
      );
    }

    // Help us know if user is logged
    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
