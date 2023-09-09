import { NestApplicationOptions } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { SecurityConfig } from '@ysera/nsx-auth';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

const serverConfig: NestApplicationOptions = {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
};

const appConfig: ConfigModuleOptions = {
  isGlobal: true,
};

const securityConfig: SecurityConfig = {
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  sessionTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  bcryptSaltOrRound: process.env.AUTH_PASSWORD_SALT_ROUND_DEFAULT,
};

const graphqlConfig: ApolloDriverConfig = {
  playground: false,
  sortSchema: true,
  installSubscriptionHandlers: true,
  autoSchemaFile: join(process.cwd(), 'apps/api/src/schema.gql'),
  buildSchemaOptions: {
    numberScalarMode: 'integer',
  },
  driver: ApolloDriver,
};

export const environment = {
  siteName: 'Ysera',
  siteUrl: 'http://[::1]:4200',
  production: false,
  prefix: 'ysera',
  serverConfig,
  appConfig,
  graphqlConfig,
  securityConfig,
} as const;
