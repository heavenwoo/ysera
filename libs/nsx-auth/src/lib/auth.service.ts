import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { isConstraintError, PrismaService } from '@ysera/nsx-prisma';
import { AuthSecurityService } from './auth.security.service';
import { AuthUserCredentialsInput, AuthUserSignupInput } from './auth.model';
import { Role, User, Prisma } from '@prisma/client';
import { tryGet } from '@ysera/agx-util';
import { ApiError } from '@ysera/agx-dto';
import { decodeURITokenComponent } from './auth.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly security: AuthSecurityService
  ) {}

  async createUser(payload: AuthUserSignupInput): Promise<User> {
    let user: User;
    const hashedPassword = await this.security.hashPassword(payload.password);

    try {
      user = await this.prisma.user.create({
        data: {
          ...payload,
          email: payload.email.toLowerCase(),
          password: hashedPassword,
          username: payload.firstName + payload.lastName,
          role: Role.USER,
          isActive: true,
          lastLoginAt: new Date(),
        } as unknown as Prisma.UserCreateInput,
      });
      // eslint-disable-next-line
    } catch (err: any) {
      if (isConstraintError(err)) {
        const constraint = tryGet(() => err.meta.target[0], 'Some fields');
        switch (constraint) {
          case 'email':
            throw new ConflictException('ERROR.AUTH.EMAIL_IN_USE');
          case 'username':
            throw new ConflictException('ERROR.AUTH.USERNAME_IN_USE');
          default:
            throw new ConflictException(`Error: ${constraint} already in use.`);
        }
      } else {
        throw new Error(err);
      }
    }

    return user;
  }

  async authenticateUser(credentials: AuthUserCredentialsInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (user) {
      const passwordValid = await this.security.validatePassword(
        credentials.password,
        user.password
      );

      if (passwordValid) {
        return this.prisma.user.update({
          where: { email: credentials.email },
          data: {
            lastLoginAt: new Date(),
          },
        });
      }
    }
    throw new BadRequestException(ApiError.Error.Auth.InvalidUserOrPassword);
  }

  async performPasswordReset(
    token: string,
    password: string,
    resetOtherSessions = false
  ): Promise<User> {
    const payload = decodeURITokenComponent<{ userId: string }>(
      token,
      this.security.getSiteSecret()
    );
    if (!payload) {
      throw new BadRequestException(
        ApiError.Error.Auth.InvalidPasswordResetLink
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidOrInactiveUser);
    }

    return this.security.resetPassword(user, password, resetOtherSessions);
  }

  async changePassword(
    user: User,
    oldPassword: string,
    newPassword: string,
    resetOtherSessions: boolean
  ): Promise<User> {
    const validPassword = await this.security.validatePassword(
      oldPassword,
      user.password
    );

    if (!validPassword) {
      throw new BadRequestException(ApiError.Error.Auth.InvalidPassword);
    }

    const hashedPassword = await this.security.hashPassword(newPassword);

    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        sessionVersion: resetOtherSessions
          ? user.sessionVersion + 1
          : user.sessionVersion,
      },
    });
  }

  async performEmailChange(token: string): Promise<User> {
    const payload = decodeURITokenComponent<{
      currentEmail: string;
      newEmail: string;
    }>(token, this.security.getSiteSecret());

    if (payload) {
      const user = await this.security.validateUserByEmail(
        payload.currentEmail
      );
      if (user) {
        if (!(await this.security.isEmailInUse(payload.newEmail))) {
          return this.prisma.user.update({
            where: { email: payload.currentEmail },
            data: { email: payload.newEmail },
          });
        } else {
          throw new BadRequestException(ApiError.Error.Auth.EmailInUse);
        }
      }
    }

    throw new BadRequestException(ApiError.Error.Auth.InvalidEmailChangeLink);
  }
}
