import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthStatusDto,
  AuthTokenDto,
  AuthUserCredentialsInput,
  AuthUserSignupInput,
} from './auth.model';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthSecurityService } from './auth.security.service';
// import { DeepReadonly } from 'ts-essentials';
// import { ApplicationConfig } from '@nestjs/core';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  CookiesDecorator,
  RequestDecorator,
  ResponseDecorator,
} from './auth.decorator';
import { HttpRequest, HttpResponse } from '@ysera/nsx-common';
import { ApiError, JwtDto } from '@ysera/agx-dto';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { AuthAnonymousGqlGuard } from './auth.anonymous.guard';

@Resolver(() => AuthTokenDto)
export class AuthResolver {
  // private readonly options: DeepReadonly<ApplicationConfig>;
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly config: ConfigService,
    private readonly auth: AuthService,
    private readonly security: AuthSecurityService
  ) {}

  @Mutation(() => AuthTokenDto)
  async authUserSignup(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('data') data: AuthUserSignupInput
  ): Promise<AuthTokenDto> {
    const user = await this.auth.createUser(data);
    const token = this.security.issueToken(user, request, response);

    this.logger.log(`${user.username} signned up`);
    return { ok: true, token };
  }

  @Mutation(() => AuthTokenDto)
  async authUserLogin(
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse,
    @Args('data') data: AuthUserCredentialsInput
  ): Promise<AuthTokenDto> {
    const user = await this.auth.authenticateUser(data);
    const token = this.security.issueToken(user, request, response);

    this.logger.log(`${user.username} logged in`);
    return { ok: true, token };
  }

  @Mutation(() => AuthTokenDto)
  async authTokenRefresh(
    @CookiesDecorator() cookies: string[],
    @RequestDecorator() request: HttpRequest,
    @ResponseDecorator() response: HttpResponse
  ): Promise<AuthTokenDto> {
    const payload = this.security.verifyToken<JwtDto>(
      cookies[AUTH_SESSION_COOKIE_NAME]
    );
    if (!payload) {
      throw new UnauthorizedException(ApiError.Error.Auth.Unauthorized);
    }

    const user = await this.security.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException(
        ApiError.Error.Auth.InvalidOrInactiveUser
      );
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new UnauthorizedException(
        ApiError.Error.Auth.InvalidOrRemotelyTerminatedSession
      );
    }

    const token = this.security.issueToken(user, request, response);

    this.logger.log(`${user.username} refreshed the token`);
    return { ok: true, token };
  }

  @UseGuards(AuthAnonymousGqlGuard)
  @Mutation(() => AuthStatusDto)
  async authUserLogout(
    @ResponseDecorator() response: HttpResponse
  ): Promise<AuthStatusDto> {
    this.security.clearHttpCookie(response);

    return { ok: true };
  }
}
