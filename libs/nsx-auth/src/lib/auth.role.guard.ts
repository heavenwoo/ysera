import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGqlGuard } from './auth.gql.guard';
import { Reflector } from '@nestjs/core';
import { AuthSecurityService } from './auth.security.service';
import { Role, User } from '@prisma/client';
import { AuthFilterType } from './auth.model';
import { AUTH_ROLE_KEY } from './auth.constant';
import { getRequestFromContext } from './auth.util';

@Injectable()
export class AuthRoleGuard extends AuthGqlGuard {
  constructor(
    private readonly reflector: Reflector,
    override readonly securityService: AuthSecurityService
  ) {
    super(securityService);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      const roles: AuthFilterType<Role> = this.reflector.getAllAndOverride<
        AuthFilterType<Role>
      >(AUTH_ROLE_KEY, [context.getHandler(), context.getClass()]);

      if (!roles || (!roles.include && !roles.exclude)) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error:
              'Improperly configured - `AuthRoleGuard` must be used with `UseRoles`',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const user = getRequestFromContext(context).user as User;

      // user role should not be in the exclude list
      if (roles?.exclude?.length) {
        return !roles.exclude.some((role) => user.role === role);
      }

      // user role should be in the include list
      if (roles?.include?.length) {
        return roles.include.some((role) => user.role === role);
      }
    }
    return false;
  }
}
