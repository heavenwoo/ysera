import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGqlGuard } from './auth.gql.guard';
import { Reflector } from '@nestjs/core';
import { AuthSecurityService } from './auth.security.service';
import { AuthFilterType } from './auth.model';
import { Permission, User } from '@prisma/client';
import { AUTH_PERMISSION_KEY } from './auth.constant';
import { getRequestFromContext } from './auth.util';

@Injectable()
export class AuthPermissionGuard extends AuthGqlGuard {
  constructor(private readonly reflector: Reflector, override readonly securityService: AuthSecurityService) {
    super(securityService);
  }

  override async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      const permissions = this.reflector.getAllAndOverride<AuthFilterType<Permission>>(
        AUTH_PERMISSION_KEY,
        [context.getHandler, context.getClass]
      );

      const user = getRequestFromContext(context).user as User;

      // user permissions should not be in the exclude list
      if (permissions?.exclude?.some((permission) => user.permissions?.includes(permission))) {
        return false;
      }
      // user permissions should be in the include list
      return permissions?.include?.some((permission) => user.permissions?.includes(permission)) as boolean;
    }
    return false;
  }
}
