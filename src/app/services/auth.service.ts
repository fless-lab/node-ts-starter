/* eslint-disable @typescript-eslint/no-unused-vars */
import UserService from '../services/user.service';
import {
  SuccessResponseType,
  ErrorResponseType,
  IUserModel,
} from '../utils/types';
import ErrorResponse from '../utils/handlers/error/response';
import JwtService from './shared/jwt.service';

class AuthService {
  static async register(
    payload: any,
  ): Promise<SuccessResponseType<any> | ErrorResponseType> {
    try {
      const { email } = payload;
      const existingUserResponse = (await UserService.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (existingUserResponse.success && existingUserResponse.document) {
        return {
          success: false,
          error: new ErrorResponse(
            'VALIDATION_ERROR',
            'The entered email is already registered.',
          ),
        };
      }

      const createUserResponse = (await UserService.create(
        payload,
      )) as SuccessResponseType<IUserModel>;
      if (!createUserResponse.success) {
        return createUserResponse;
      }

      // TODO: Generate and send OTP for account verification

      return { success: true, document: createUserResponse.document };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }

  static async verifyAccount(
    payload: any,
  ): Promise<SuccessResponseType<any> | ErrorResponseType> {
    try {
      const { email, code } = payload;

      const isVerifiedResponse = (await UserService.isVerified(
        email,
      )) as SuccessResponseType<IUserModel>;
      if (isVerifiedResponse.success && isVerifiedResponse.document?.verified) {
        return {
          success: false,
          error: new ErrorResponse(
            'VALIDATION_ERROR',
            'Account is already verified.',
          ),
        };
      }

      // TODO: Validate OTP for account verification

      const verifyUserResponse = (await UserService.markAsVerified(
        email,
      )) as SuccessResponseType<IUserModel>;
      if (!verifyUserResponse.success) {
        return verifyUserResponse;
      }

      // TODO: Send verification success email

      return { success: true, document: verifyUserResponse.document };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }

  static async login(
    payload: any,
  ): Promise<SuccessResponseType<any> | ErrorResponseType> {
    try {
      const { email, password } = payload;
      const existingUserResponse = (await UserService.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (!existingUserResponse.success || !existingUserResponse.document) {
        return {
          success: false,
          error: new ErrorResponse('UNAUTHORIZED', 'Invalid credentials.'),
        };
      }

      const user = existingUserResponse.document;

      const isValidPasswordResponse = (await UserService.isValidPassword(
        user.id,
        password,
      )) as SuccessResponseType<{ isValid: boolean }>;
      if (
        !isValidPasswordResponse.success ||
        !isValidPasswordResponse.document?.isValid
      ) {
        return {
          success: false,
          error: new ErrorResponse('UNAUTHORIZED', 'Invalid credentials.'),
        };
      }

      if (!user.verified) {
        return {
          success: false,
          error: new ErrorResponse('UNAUTHORIZED', 'Unverified account.'),
        };
      }

      if (!user.active) {
        return {
          success: false,
          error: new ErrorResponse(
            'FORBIDDEN',
            'Inactive account, please contact admins.',
          ),
        };
      }

      const accessToken = await JwtService.signAccessToken(user.id);
      const refreshToken = await JwtService.signRefreshToken(user.id);

      return {
        success: true,
        document: { token: { accessToken, refreshToken }, user },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }

  static async refresh(
    refreshToken: string,
  ): Promise<SuccessResponseType<any> | ErrorResponseType> {
    try {
      if (!refreshToken) {
        return {
          success: false,
          error: new ErrorResponse('BAD_REQUEST', 'Refresh token is required.'),
        };
      }

      const userId = await JwtService.verifyRefreshToken(refreshToken);
      const accessToken = await JwtService.signAccessToken(userId);
      const newRefreshToken = await JwtService.signRefreshToken(userId);

      return {
        success: true,
        document: { token: { accessToken, refreshToken: newRefreshToken } },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }

  static async logout(
    refreshToken: string,
  ): Promise<SuccessResponseType<null> | ErrorResponseType> {
    try {
      if (!refreshToken) {
        return {
          success: false,
          error: new ErrorResponse('BAD_REQUEST', 'Refresh token is required.'),
        };
      }

      const userId = await JwtService.verifyRefreshToken(refreshToken);
      await JwtService.removeFromRedis(userId);

      return { success: true, document: null };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }

  static async forgotPassword(
    email: string,
  ): Promise<SuccessResponseType<null> | ErrorResponseType> {
    try {
      if (!email) {
        return {
          success: false,
          error: new ErrorResponse('BAD_REQUEST', 'Email should be provided.'),
        };
      }

      const existingUserResponse = (await UserService.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (!existingUserResponse.success || !existingUserResponse.document) {
        return {
          success: false,
          error: new ErrorResponse('NOT_FOUND_ERROR', 'User not found.'),
        };
      }

      const user = existingUserResponse.document;

      if (!user.verified) {
        return {
          success: false,
          error: new ErrorResponse('UNAUTHORIZED', 'Unverified account.'),
        };
      }

      if (!user.active) {
        return {
          success: false,
          error: new ErrorResponse(
            'FORBIDDEN',
            'Inactive account, please contact admins.',
          ),
        };
      }

      // TODO: Generate and send OTP for password reset

      return { success: true, document: null };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }

  static async resetPassword(
    payload: any,
  ): Promise<SuccessResponseType<null> | ErrorResponseType> {
    try {
      const { email, code, newPassword } = payload;

      const existingUserResponse = (await UserService.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (!existingUserResponse.success || !existingUserResponse.document) {
        return {
          success: false,
          error: new ErrorResponse('NOT_FOUND_ERROR', 'User not found.'),
        };
      }

      const user = existingUserResponse.document;

      if (!user.verified) {
        return {
          success: false,
          error: new ErrorResponse('UNAUTHORIZED', 'Unverified account.'),
        };
      }

      if (!user.active) {
        return {
          success: false,
          error: new ErrorResponse(
            'FORBIDDEN',
            'Inactive account, please contact admins.',
          ),
        };
      }

      // TODO: Validate OTP for password reset

      const updatePasswordResponse = (await UserService.updatePassword(
        user.id,
        newPassword,
      )) as SuccessResponseType<IUserModel>;
      if (!updatePasswordResponse.success) {
        return updatePasswordResponse;
      }

      return { success: true, document: null };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }
}

export default AuthService;
