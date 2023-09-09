import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthSecurityService } from './auth.security.service';
import { AuthGqlGuard } from './auth.gql.guard';
import { AuthRoleGuard } from './auth.role.guard';
import { AuthPermissionGuard } from './auth.permission.guard';

@Module({
  providers: [
    AuthSecurityService,
    AuthService,
    AuthGqlGuard,
    AuthRoleGuard,
    AuthResolver,
    AuthPermissionGuard,
  ],
  exports: [
    AuthSecurityService,
    AuthService,
    AuthGqlGuard,
    AuthRoleGuard,
    AuthResolver,
    AuthPermissionGuard,
  ],
})
export class AuthModule {
}
