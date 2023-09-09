import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSecurityService } from './auth.security.service';
import {
  getCookiesFromContext,
  getJwtTokenFromAuthorizationHeader,
  getRequestFromContext,
} from './auth.util';
import { ApiError, JwtDto } from '@ysera/agx-dto';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGqlGuard extends AuthGuard('jwt') {
  constructor(readonly securityService: AuthSecurityService) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context);

    const cookies = getCookiesFromContext(context);
    // console.log('cookies', cookies);
    if (
      !this.securityService.verifyToken<JwtDto>(
        cookies[AUTH_SESSION_COOKIE_NAME]
      )
    ) {
      throw new UnauthorizedException(
        ApiError.Error.Auth.InvalidOrExpiredSession
      );
    }

    const token = getJwtTokenFromAuthorizationHeader(request);
    if (!token) {
      throw new UnauthorizedException(ApiError.Error.Auth.MissingAccessToken);
    }

    const payload = this.securityService.verifyToken<JwtDto>(token);

    if (!payload) {
      throw new UnauthorizedException(ApiError.Error.Auth.InvalidAccessToken);
    }

    const user = await this.securityService.validateUser(payload.userId);
    if (!user) {
      throw new NotFoundException(ApiError.Error.Auth.InvalidOrInactiveUser);
    }

    if (user?.sessionVersion !== payload.sessionVersion) {
      throw new BadRequestException(
        ApiError.Error.Auth.InvalidOrRemotelyTerminatedSession
      );
    }

    request.user = user;
    return true;
  }
}
