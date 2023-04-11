import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export default class UserController {
  private userService!: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getMeHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err: any) {
      next(err);
    }
  };

  public getAllUsersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.userService.findAllUsers();
      res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
          users,
        },
      });
    } catch (err: any) {
      next(err);
    }
  };
}
