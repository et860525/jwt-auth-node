import { omit } from 'lodash';
import userModel, { User } from '../models/user.model';
import { FilterQuery, QueryOptions } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { signJwt } from '../middleware/jwt';
import redisClient from '../database/connectRedis';

export class UserService {
  private accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;

  private excludedFields = ['password'];

  // Create user
  public async createUser(input: Partial<User>) {
    const user = await userModel.create(input);
    return omit(user.toJSON(), this.excludedFields);
  }

  // Find user by id
  public async findUserById(id: string) {
    const user = await userModel.findById(id).lean();
    return omit(user, this.excludedFields);
  }

  // Find all users
  public async findAllUsers() {
    return await userModel.find();
  }

  // Find one users by any fields
  public async findUser(query: FilterQuery<User>, options: QueryOptions = {}) {
    return await userModel.findOne(query, {}, options).select('+password');
  }

  // Sign token
  public async signToken(user: DocumentType<User>) {
    // Sign the access token
    const access_token = signJwt(
      {
        sub: user._id,
      },
      {
        expiresIn: `${Number(this.accessTokenExpiresIn)}m`,
      }
    );

    // Create a session
    redisClient.set(String(user._id), JSON.stringify(user), { EX: 60 * 60 });

    return { access_token };
  }
}
