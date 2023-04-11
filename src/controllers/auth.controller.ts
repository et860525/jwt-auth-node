import { Request, Response, NextFunction, CookieOptions } from 'express';
import { CreateUserInput, LoginUserInput } from '../models/user.schema';
import { UserService } from '../services/user.service';
import DefaultError from '../exceptions/default.exception';

export default class AuthController {
  private accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
  private userService!: UserService;

  constructor() {
    this.userService = new UserService();
    // Set secure to true in production
    if (process.env.NODE_ENV === 'production')
      this.accessTokenCookieOptions.secure = true;
  }

  // Cookie options
  accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + Number(this.accessTokenExpiresIn) * 60 * 1000
    ),
    maxAge: Number(this.accessTokenExpiresIn) * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };

  // Register
  public registerHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.createUser({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      });

      res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err: any) {
      // MongoDB error code: Duplicate
      if (err.code === 11000) {
        return res.status(409).json({
          status: 'fail',
          message: 'Email already exist',
        });
      }
      next(err);
    }
  };

  // Login
  public loginHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.findUser({ email: req.body.email });

      if (
        !user ||
        !(await user.comparePasswords(user.password, req.body.password))
      ) {
        return next(new DefaultError('Invalid email or password', 401));
      }

      // Create an Access Token
      const accessToken = await this.userService.signToken(user);

      // Send Access Token in Cookie
      res.cookie('accessToken', accessToken, this.accessTokenCookieOptions);
      res.cookie('logged_in', true, {
        ...this.accessTokenCookieOptions,
        httpOnly: false,
      });

      // Send Access Token
      res.status(200).json({
        status: 'success',
        accessToken,
      });
    } catch (err: any) {
      next(err);
    }
  };
}
