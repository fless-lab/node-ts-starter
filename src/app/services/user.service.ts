import config from '../../config';
import UserModel from '../models/user.model';
import UserRepository from '../repositories/user.repo';
import ErrorResponse from '../utils/handlers/error/response';
import {
  ErrorResponseType,
  IUserModel,
  SuccessResponseType,
} from '../utils/types';
import { BaseService } from './base.service';
import bcrypt from 'bcrypt';

class UserService extends BaseService<IUserModel> {
  constructor() {
    const userRepo = new UserRepository(UserModel);
    super(userRepo, true /*, ['profilePicture']*/);
    this.searchFields = ['firstName', 'lastName', 'email'];
  }

  async isValidPassword(
    userId: string,
    password: string,
  ): Promise<SuccessResponseType<{ isValid: boolean }> | ErrorResponseType> {
    try {
      const response = (await this.findOne({
        _id: userId,
      })) as SuccessResponseType<IUserModel>;
      if (!response.success || !response.document) {
        return {
          success: false,
          error: response.error,
        };
      }

      const isValid = await bcrypt.compare(
        password,
        response.document.password,
      );
      return { success: true, document: { isValid } };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('UNKNOWN_ERROR', (error as Error).message),
      };
    }
  }

  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<SuccessResponseType<IUserModel> | ErrorResponseType> {
    try {
      const response = (await this.findOne({
        _id: userId,
      })) as SuccessResponseType<IUserModel>;
      if (!response.success || !response.document) {
        return {
          success: false,
          error: response.error,
        };
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        config.bcrypt.saltRounds,
      );
      const updateResponse = (await this.update(
        { _id: userId },
        { password: hashedPassword },
      )) as SuccessResponseType<IUserModel>;

      if (!updateResponse.success) {
        return {
          success: false,
          error: updateResponse.error!,
        };
      }

      return {
        success: true,
        document: updateResponse.document,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('UNKNOWN_ERROR', (error as Error).message),
      };
    }
  }

  async isVerified(
    email: string,
  ): Promise<SuccessResponseType<{ verified: boolean }> | ErrorResponseType> {
    try {
      const response = (await this.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (!response.success || !response.document) {
        return {
          success: false,
          error: response.error,
        };
      }

      return {
        success: true,
        document: { verified: response.document.verified },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('UNKNOWN_ERROR', (error as Error).message),
      };
    }
  }

  async markAsVerified(
    email: string,
  ): Promise<SuccessResponseType<IUserModel> | ErrorResponseType> {
    try {
      const response = (await this.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (!response.success || !response.document) {
        return {
          success: false,
          error: response.error,
        };
      }

      const updateResponse = (await this.update(
        { _id: response.document._id },
        { verified: true },
      )) as SuccessResponseType<IUserModel>;

      if (!updateResponse.success) {
        return {
          success: false,
          error: updateResponse.error,
        };
      }

      return {
        success: true,
        document: updateResponse.document,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('UNKNOWN_ERROR', (error as Error).message),
      };
    }
  }
}

export default new UserService();
