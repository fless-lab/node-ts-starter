import { Model } from 'mongoose';
import { IUserModel } from '../types';
import { BaseRepository } from '../../../common';

export class UserRepository extends BaseRepository<IUserModel> {
  constructor(model: Model<IUserModel>) {
    super(model);
  }
}

export default UserRepository;
