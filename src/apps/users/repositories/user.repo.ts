import { Model } from 'mongoose';
import { IUserModel } from '../types';
import { BaseRepository } from '../../../core/engine';

export class UserRepository extends BaseRepository<IUserModel> {
  constructor(model: Model<IUserModel>) {
    super(model);
  }
}

export default UserRepository;
