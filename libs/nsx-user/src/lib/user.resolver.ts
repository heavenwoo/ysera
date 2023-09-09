import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UserConnection, UserDto, UserSelfUpdateInput, UserUpdateInput, UserWhereByIdInput } from "./user.model";
import { PrismaService } from "@ysera/nsx-prisma";
import { UserService } from "./user.service";
import { BadRequestException, ForbiddenException, NotFoundException, UseGuards } from "@nestjs/common";
import { Role, User } from "@prisma/client";
import { ApiError } from "@ysera/agx-dto";
import { UserDataAccessScope } from "./user.scope";
import { AuthAnonymousGqlGuard, AuthGqlGuard, AuthRoleGuard, UserDecorator, UseRoles } from "@ysera/nsx-auth";
import { PaginationArgs } from "@ysera/nsx-pagination";
import { UserOrder } from "./user.order";
import { USER_PER_PAGE } from "./user.constant";
import { Connection, findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection";

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {
  }

  @UseGuards(AuthGqlGuard)
  @Query(() => UserDto, { description: "Get user's own info" })
  async userSelf(
    @UserDecorator() currentUser: User,
    @Args("id") id: string
  ): Promise<Partial<User>> {
    if (id !== currentUser.id) {
      throw new ForbiddenException(ApiError.Error.Auth.Forbidden);
    }
    return UserDataAccessScope.getSecuredUser(currentUser, currentUser);
  }

  @UseGuards(AuthGqlGuard)
  @Mutation(() => UserDto, { description: "Update user's own info" })
  async userSelfUpdate(
    @UserDecorator() currentUser: User,
    @Args("data") payload: UserSelfUpdateInput
  ) {
    const user = await this.userService.updateUser(currentUser.id, payload);
    return UserDataAccessScope.getSecuredUser(user, currentUser);
  }

  @UseGuards(AuthAnonymousGqlGuard)
  @Query(() => UserConnection)
  async users(
    @UserDecorator() currentUser: User,
    @Args("pageArgs", { type: () => PaginationArgs, nullable: true })
      pageArgs: PaginationArgs,
    @Args("query", { type: () => String, defaultValue: "", nullable: true })
      query: string,
    @Args("orderBy", { type: () => UserOrder, nullable: true })
      orderBy: UserOrder
  ): Promise<Connection<UserDto>> {
    if ("undefined" === typeof pageArgs) {
      pageArgs = {
        first: 0,
        after: ""
      };
    }

    if (!pageArgs.last && pageArgs.first === 0) {
      if (pageArgs.after === "") {
        pageArgs.first = USER_PER_PAGE;
      }
      if (pageArgs.before) {
        pageArgs.last = USER_PER_PAGE;
      }
    }

    return await findManyCursorConnection(
      (args) =>
        this.prisma.user.findMany({
          where: {
            AND: [{ isActive: true }],
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } }
            ]
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : { createdAt: "desc" },
          ...args
        }),
      () =>
        this.prisma.user.count({
          where: {
            AND: [{ isActive: true }],
            OR: [
              { username: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } }
            ]
          }
        }),
      pageArgs
    );
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGqlGuard, AuthRoleGuard)
  @Query(() => UserDto, { description: "Get other user info" })
  async user(@UserDecorator() currentUser: User, @Args("data") data: UserWhereByIdInput) {
    const user = await this.userService.user({ id: data.id });
    if (user) {
      return UserDataAccessScope.getSecuredUser(user, currentUser);
    }
    throw new NotFoundException(ApiError.Error.Auth.Unauthorized);
  }

  @UseRoles({ exclude: [Role.USER] })
  @UseGuards(AuthGqlGuard, AuthRoleGuard)
  @Mutation(() => UserDto, { description: "Privileged user update" })
  async userUpdate(@UserDecorator() currentUser: User, @Args("data") data: UserUpdateInput) {
    await this.userService.canUpdateUser(currentUser, data.id);
    const user = await this.userService.updateUser(data.id, data);
    return UserDataAccessScope.getSecuredUser(user, currentUser);
  }

  @UseGuards(AuthGqlGuard)
  @Mutation(() => UserDto, { description: "Connect a following to user" })
  async userConnectFollowing(
    @UserDecorator() currentUser: User,
    @Args("data") data: UserWhereByIdInput
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (user?.id === currentUser.id) {
      throw new BadRequestException("Can not connect to self");
    }
    return this.prisma.user.update({
      where: { id: currentUser.id },
      data: {
        following: { connect: [{ id: data.id }] }
      }
    });
  }

  @UseGuards(AuthGqlGuard)
  @Mutation(() => UserDto, { description: "Disconnect a following to user" })
  async userDisconnectFollowing(
    @UserDecorator() currentUser: User,
    @Args("data") data: UserWhereByIdInput
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: data.id } });
    if (user?.id === currentUser.id) {
      throw new BadRequestException("Can not connect to self");
    }

    return this.prisma.user.update({
      where: { id: currentUser.id },
      data: {
        following: { disconnect: [{ id: data.id }] }
      }
    });
  }

  @ResolveField(() => [UserDto])
  async followedBy(@Parent() user: User) {
    return this.prisma.user.findUnique({ where: { id: user.id } }).followedBy();
  }

  @ResolveField(() => [UserDto])
  async following(@Parent() user: User) {
    return this.prisma.user.findUnique({ where: { id: user.id } }).following();
  }
}
