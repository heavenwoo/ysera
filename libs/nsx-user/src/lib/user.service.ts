import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@ysera/nsx-prisma";
import { UserSelfUpdateInput, UserWhereUniqueInput } from "./user.model";
import { User } from "@prisma/client";
import { AUTH_ROLE_RESTRICTION_MATRIX } from "@ysera/nsx-auth";
import { ApiError } from "@ysera/agx-dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {
  }

  async updateUser(userId: string, newUserData: UserSelfUpdateInput): Promise<User> {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId
      }
    });
  }

  async canUpdateUser(currentUser: User, userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    const forbidden = AUTH_ROLE_RESTRICTION_MATRIX[currentUser.role];
    if (forbidden.some((some) => some === user?.role)) {
      throw new ForbiddenException(ApiError.Error.Auth.Forbidden);
    }
    return true;
  }

  async user(userWhereUniqueInput: UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  // async createUser(authUserSignup)
}
