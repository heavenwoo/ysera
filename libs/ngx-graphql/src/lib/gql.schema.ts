import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AuthStatusDto = {
  __typename?: 'AuthStatusDto';
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type AuthTokenDto = {
  __typename?: 'AuthTokenDto';
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

export type AuthUserCredentialsInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AuthUserSignupInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  language: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authTokenRefresh: AuthTokenDto;
  authUserLogin: AuthTokenDto;
  authUserLogout: AuthStatusDto;
  authUserSignup: AuthTokenDto;
  /** Connect a following to user */
  userConnectFollowing: UserDto;
  /** Disconnect a following to user */
  userDisconnectFollowing: UserDto;
  /** Update user's own info */
  userSelfUpdate: UserDto;
  /** Privileged user update */
  userUpdate: UserDto;
};


export type MutationAuthUserLoginArgs = {
  data: AuthUserCredentialsInput;
};


export type MutationAuthUserSignupArgs = {
  data: AuthUserSignupInput;
};


export type MutationUserConnectFollowingArgs = {
  data: UserWhereByIdInput;
};


export type MutationUserDisconnectFollowingArgs = {
  data: UserWhereByIdInput;
};


export type MutationUserSelfUpdateArgs = {
  data: UserSelfUpdateInput;
};


export type MutationUserUpdateArgs = {
  data: UserUpdateInput;
};

/** Ascending or descending direction for a given `orderBy` argument. */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginationArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** User permission */
export enum Permission {
  AppAll = 'appALL',
  ContactMessageAll = 'contactMessageALL',
  ContactMessageCreate = 'contactMessageCREATE',
  ContactMessageDelete = 'contactMessageDELETE',
  ContactMessageRead = 'contactMessageREAD',
  ContactMessageUpdate = 'contactMessageUPDATE',
  GroupAll = 'groupALL',
  GroupCreate = 'groupCREATE',
  GroupDelete = 'groupDELETE',
  GroupRead = 'groupREAD',
  GroupUpdate = 'groupUPDATE',
  UserAll = 'userALL',
  UserCreate = 'userCREATE',
  UserDelete = 'userDELETE',
  UserRead = 'userREAD',
  UserUpdate = 'userUPDATE'
}

export type Query = {
  __typename?: 'Query';
  /** Get other user info */
  user: UserDto;
  /** Get user's own info */
  userSelf: UserDto;
  users: UserConnection;
};


export type QueryUserArgs = {
  data: UserWhereByIdInput;
};


export type QueryUserSelfArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  orderBy?: InputMaybe<UserOrder>;
  pageArgs?: InputMaybe<PaginationArgs>;
  query?: InputMaybe<Scalars['String']['input']>;
};

/** User role */
export enum Role {
  Admin = 'ADMIN',
  Staff = 'STAFF',
  Superuser = 'SUPERUSER',
  User = 'USER'
}

export type UserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<UserDtoEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserDto = {
  __typename?: 'UserDto';
  avatar?: Maybe<Scalars['String']['output']>;
  /** Object's creation time */
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  followedBy?: Maybe<Array<UserDto>>;
  following?: Maybe<Array<UserDto>>;
  groupId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  /** User is active */
  isActive?: Maybe<Scalars['Boolean']['output']>;
  /** User is verified */
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<Permission>>;
  role?: Maybe<Role>;
  /** Object's update time */
  updatedAt: Scalars['DateTime']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserDtoEdge = {
  __typename?: 'UserDtoEdge';
  cursor: Scalars['String']['output'];
  node: UserDto;
};

export type UserOrder = {
  direction: OrderDirection;
  field: UserOrderField;
};

/** User connection order llist. */
export enum UserOrderField {
  CreatedAt = 'createdAt',
  FirstName = 'firstName',
  Id = 'id',
  LastName = 'lastName',
  UpdatedAt = 'updatedAt',
  Username = 'username'
}

export type UserSelfUpdateInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UserUpdateInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  groupId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  /** User is active */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** User is verified */
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  permissions: Array<Permission>;
  role?: InputMaybe<Role>;
};

export type UserWhereByIdInput = {
  id: Scalars['ID']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthStatusDto: ResolverTypeWrapper<AuthStatusDto>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  AuthTokenDto: ResolverTypeWrapper<AuthTokenDto>;
  AuthUserCredentialsInput: AuthUserCredentialsInput;
  AuthUserSignupInput: AuthUserSignupInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  OrderDirection: OrderDirection;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginationArgs: PaginationArgs;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Permission: Permission;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserDto: ResolverTypeWrapper<UserDto>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  UserDtoEdge: ResolverTypeWrapper<UserDtoEdge>;
  UserOrder: UserOrder;
  UserOrderField: UserOrderField;
  UserSelfUpdateInput: UserSelfUpdateInput;
  UserUpdateInput: UserUpdateInput;
  UserWhereByIdInput: UserWhereByIdInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthStatusDto: AuthStatusDto;
  String: Scalars['String']['output'];
  Boolean: Scalars['Boolean']['output'];
  AuthTokenDto: AuthTokenDto;
  AuthUserCredentialsInput: AuthUserCredentialsInput;
  AuthUserSignupInput: AuthUserSignupInput;
  DateTime: Scalars['DateTime']['output'];
  Mutation: {};
  PageInfo: PageInfo;
  PaginationArgs: PaginationArgs;
  Int: Scalars['Int']['output'];
  Query: {};
  UserConnection: UserConnection;
  UserDto: UserDto;
  ID: Scalars['ID']['output'];
  UserDtoEdge: UserDtoEdge;
  UserOrder: UserOrder;
  UserSelfUpdateInput: UserSelfUpdateInput;
  UserUpdateInput: UserUpdateInput;
  UserWhereByIdInput: UserWhereByIdInput;
};

export type NgModuleDirectiveArgs = {
  module: Scalars['String']['input'];
};

export type NgModuleDirectiveResolver<Result, Parent, ContextType = any, Args = NgModuleDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type NamedClientDirectiveArgs = {
  name: Scalars['String']['input'];
};

export type NamedClientDirectiveResolver<Result, Parent, ContextType = any, Args = NamedClientDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthStatusDtoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthStatusDto'] = ResolversParentTypes['AuthStatusDto']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthTokenDtoResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthTokenDto'] = ResolversParentTypes['AuthTokenDto']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  authTokenRefresh?: Resolver<ResolversTypes['AuthTokenDto'], ParentType, ContextType>;
  authUserLogin?: Resolver<ResolversTypes['AuthTokenDto'], ParentType, ContextType, RequireFields<MutationAuthUserLoginArgs, 'data'>>;
  authUserLogout?: Resolver<ResolversTypes['AuthStatusDto'], ParentType, ContextType>;
  authUserSignup?: Resolver<ResolversTypes['AuthTokenDto'], ParentType, ContextType, RequireFields<MutationAuthUserSignupArgs, 'data'>>;
  userConnectFollowing?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<MutationUserConnectFollowingArgs, 'data'>>;
  userDisconnectFollowing?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<MutationUserDisconnectFollowingArgs, 'data'>>;
  userSelfUpdate?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<MutationUserSelfUpdateArgs, 'data'>>;
  userUpdate?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<MutationUserUpdateArgs, 'data'>>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<QueryUserArgs, 'data'>>;
  userSelf?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType, RequireFields<QueryUserSelfArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'query'>>;
};

export type UserConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Maybe<Array<ResolversTypes['UserDtoEdge']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDtoResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDto'] = ResolversParentTypes['UserDto']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  followedBy?: Resolver<Maybe<Array<ResolversTypes['UserDto']>>, ParentType, ContextType>;
  following?: Resolver<Maybe<Array<ResolversTypes['UserDto']>>, ParentType, ContextType>;
  groupId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDtoEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDtoEdge'] = ResolversParentTypes['UserDtoEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['UserDto'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthStatusDto?: AuthStatusDtoResolvers<ContextType>;
  AuthTokenDto?: AuthTokenDtoResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserDto?: UserDtoResolvers<ContextType>;
  UserDtoEdge?: UserDtoEdgeResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  NgModule?: NgModuleDirectiveResolver<any, any, ContextType>;
  namedClient?: NamedClientDirectiveResolver<any, any, ContextType>;
};
