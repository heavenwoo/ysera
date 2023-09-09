import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AuthModule } from '@ysera/nsx-auth';
import { PrismaModule } from '@ysera/nsx-prisma';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {
}
