import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { BaseModelDto } from '@ysera/nsx-common';
import { User } from '@prisma/client';
import { IsEmail } from 'class-validator';
import { Permission, Role } from '@prisma/client';
import { Connection } from '@ysera/nsx-pagination';

@ObjectType()
export class UserDto extends BaseModelDto implements Partial<User> {
  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true, description: 'User is verified' })
  isVerified!: boolean;

  @Field({ nullable: true, description: 'User is active' })
  isActive!: boolean;

  @Directive('@lowercase')
  @Field({ nullable: true })
  username!: string;

  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true })
  lastName!: string;

  @Field({ nullable: true })
  language!: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => Role, { nullable: true })
  role!: Role;

  @Field(() => [Permission], { nullable: true })
  permissions!: Permission[];

  @Field(() => ID, { nullable: true })
  groupId!: string;

  @Field(() => [UserDto], { nullable: true })
  followedBy?: UserDto[];

  @Field(() => [UserDto], { nullable: true })
  following?: UserDto[];
}

@InputType()
export class UserSelfUpdateInput implements Partial<User> {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  language?: string;
}

@InputType()
export class UserUpdateInput implements Partial<User> {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true, description: 'User is verified' })
  isVerified?: boolean;

  @Field({ nullable: true, description: 'User is active' })
  isActive?: boolean;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  language?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Field(() => [Permission])
  permissions?: Permission[];

  @Field(() => ID, { nullable: true })
  groupId?: string;
}

@InputType()
export class UserChangeEmailInput {
  @Field(() => ID)
  id!: string;

  @Directive('@lowercase')
  @Field()
  email!: string;
}

@InputType()
export class UserChangeUsernameInput {
  @Field(() => ID)
  id!: string;

  @Directive('@lowercase')
  @Field()
  username!: string;
}

@InputType()
export class UserWhereInput implements Partial<User> {
  @Field(() => ID)
  id!: string;

  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email?: string;

  @Directive('@lowercase')
  @Field()
  username?: string;

  @Field()
  isVerified?: boolean;

  @Field()
  isActive?: boolean;

  @Field()
  firstName?: string;

  @Field()
  lastName?: string;

  @Field(() => Role)
  role?: Role;

  @Field(() => [Permission])
  permissions?: Permission[];

  @Field(() => ID, { nullable: true })
  groupId!: string;
}

@InputType()
export class UserWhereUniqueInput implements Partial<User> {
  @Field(() => ID, { nullable: true })
  id!: string;

  @Directive('@lowercase')
  @Field(() => String, { nullable: true })
  email?: string;

  @Directive('@lowercase')
  @Field(() => String, { nullable: true })
  username?: string;
}

@InputType()
export class UserWhereByIdInput {
  @Field(() => ID, { nullable: false })
  id!: string;
}

@InputType()
export class UserWhereByEmailInput {
  @Field(() => String, { nullable: false })
  email!: string;
}

@InputType()
export class UserWhereByUsernameInput {
  @Field(() => String, { nullable: false })
  username!: string;
}

@ObjectType()
export class UserConnection extends Connection(UserDto) {}
