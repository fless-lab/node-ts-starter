import { Model } from 'mongoose';
import { BaseRepository } from './base.repo';
import { IUserModel } from '../utils/types';

export class UserRepository extends BaseRepository<IUserModel> {
  constructor(model: Model<IUserModel>) {
    super(model);
  }
}

export default UserRepository;
