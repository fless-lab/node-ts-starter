import UserModel from '../models/user.model';
import UserRepository from '../repositories/user.repo';
import { IUserModel } from '../utils/types';
import { BaseService } from './base.service';

class UserService extends BaseService<IUserModel> {
  constructor() {
    const userRepo = new UserRepository(UserModel);
    super(userRepo, true /*, ['profilePicture']*/);
    this.searchFields = ['firstName', 'lastName', 'email'];
  }
}

export default new UserService();
