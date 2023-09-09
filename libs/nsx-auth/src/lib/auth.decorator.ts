import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { getCookiesFromContext, getRequestFromContext, getResponseFromContext } from './auth.util';
import { Permission, Role, User } from '@prisma/client';
import { AuthFilterType } from './auth.model';
import { AUTH_ROLE_KEY } from './auth.constant';

export const CookiesDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getCookiesFromContext(context);
});

export const RequestDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getRequestFromContext(context);
});

export const ResponseDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getResponseFromContext(context);
});

export const UserDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getRequestFromContext(context).user as User;
});

export const UseRoles = (roles: AuthFilterType<Role>) => {
  return SetMetadata(AUTH_ROLE_KEY, roles);
}

export const UsePermissions = (permissions: AuthFilterType<Permission>) => {
  return SetMetadata(AUTH_ROLE_KEY, permissions);
}
