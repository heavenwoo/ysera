import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGqlGuard } from './auth.gql.guard';
import { AuthSecurityService } from './auth.security.service';
import { getCookieFromContext, getRequestFromContext, getResponseFromContext } from './auth.util';
import { AUTH_SESSION_COOKIE_NAME } from './auth.constant';
import { JwtDto } from '@ysera/agx-dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthAnonymousGqlGuard extends AuthGqlGuard {
  constructor(override readonly securityService: AuthSecurityService) {
    super(securityService);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromContext(context);
    const response = getResponseFromContext(context);
    const cookie = getCookieFromContext(context, AUTH_SESSION_COOKIE_NAME);
    if (cookie) {
      const payload = this.securityService.verifyToken<JwtDto>(cookie);
      if (payload) {
        const user = await this.securityService.validateUser(payload.userId)
        if (!user) {
          this.securityService.clearHttpCookie(response);
        }
        request.user = user as User;
      } else {
        this.securityService.clearHttpCookie(response);
      }
    }

    return true;
  }
}
