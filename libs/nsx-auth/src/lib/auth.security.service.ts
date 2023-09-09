import { JwtDto } from '@ysera/agx-dto';
import { Injectable, Logger } from '@nestjs/common';
import { DeepReadonly } from 'ts-essentials';
import { SecurityConfig } from './auth.model';
import { DefaultSecurityConfig } from './auth.default';
import { PrismaService } from '@ysera/nsx-prisma';
import { ConfigService } from '@nestjs/config';
import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash';
import { Permission, Role, User } from '@prisma/client';
import { v4 as uuid_v4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { HttpRequest, HttpResponse } from '@ysera/nsx-common';

@Injectable()
export class AuthSecurityService {
  private readonly logger = new Logger(AuthSecurityService.name);
  private readonly options: DeepReadonly<SecurityConfig> =
    DefaultSecurityConfig;
  private readonly siteSecret!: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {
    this.options = ldMergeWith(
      ldDeepClone(this.options),
      this.config.get<SecurityConfig>('appConfig.securityConfig'),
      (dest, src) => (Array.isArray(dest) ? src : undefined)
    );
    this.siteSecret = this.config.get<string>('SITE_SEEKRET_KEY') as string;
    this.rehydrateSuperuser();
  }

  getSiteSecret() {
    return this.siteSecret;
  }

  private async rehydrateSuperuser() {
    let sessionVersion = 1;
    const email = this.config.get<string>('AUTH_SUPERUSER_EMAIL') as string;
    const password = this.config.get<string>(
      'AUTH_SUPERUSER_PASSWORD'
    ) as string;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      if (await this.validatePassword(password, user.password)) {
        return;
      }
      sessionVersion = user.sessionVersion + 1;
    }

    const hashedPassword = await this.hashPassword(password);
    await this.prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword, sessionVersion },
      create: {
        email,
        username: 'superuser',
        firstName: 'Super',
        lastName: 'User',
        password: hashedPassword,
        sessionVersion,
        isActive: true,
        isVerified: true,
        lastLoginAt: new Date(),
        role: Role.SUPERUSER,
        permissions: [Permission.appALL],
      },
    });

    this.logger.log(`Superuser rehydrated - ${email}`);
  }

  issueToken(user: User, request: HttpRequest, response: HttpResponse): string {
    const payload: JwtDto = {
      userId: user.id,
      sessionVersion: user.sessionVersion,
    };

    request.user = user;
    this.setHttpCookie(payload, response);

    return this.generateAccessToken(payload);
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async resetPassword(
    user: User,
    password?: string,
    resetOtherSessions?: boolean
  ): Promise<User> {
    const hashedPassword = await this.hashPassword(password);

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

  async hashPassword(password?: string): Promise<string> {
    password = password || uuid_v4();
    return await hash(password, this.options.bcryptSaltOrRound);
  }

  generateSessionToken(payload: JwtDto): string {
    return jwt.sign(payload, this.siteSecret, {
      expiresIn: this.options.sessionTokenExpiry,
    });
  }

  generateAccessToken(payload: JwtDto): string {
    return jwt.sign(payload, this.siteSecret, {
      expiresIn: this.options.accessTokenExpiry,
    });
  }

  setHttpCookie(payload: JwtDto, response: HttpResponse) {
    const sessionToken = this.generateSessionToken(payload);
    response.cookie(AUTH_SESSION_COOKIE_NAME, sessionToken, { httpOnly: true });
  }

  clearHttpCookie(response: HttpResponse) {
    response.clearCookie(AUTH_SESSION_COOKIE_NAME);
  }

  async validateUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user?.isActive ? user : undefined;
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const users = await this.prisma.user.findMany({
      where: { email: { contains: email, mode: 'insensitive' } },
    });
    return users?.length > 0;
  }

  verifyToken<T>(token: string): T | undefined {
    try {
      return jwt.verify(token, this.siteSecret) as T;
    } catch (err) {
      return undefined;
    }
  }

  async validateUser(userId: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.isActive ? user : undefined;
  }
}
