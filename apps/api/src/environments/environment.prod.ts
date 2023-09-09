import { NestApplicationOptions } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
import { SecurityConfig } from '@ysera/nsx-auth';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const serverConfig: NestApplicationOptions = {
  logger: ['error', 'warn'],
};

const appConfig: ConfigModuleOptions = {
  isGlobal: true,
};

const securityConfig: SecurityConfig = {
  accessTokenExpiry: '5m',
  sessionTokenExpiry: '7d',
  bcryptSaltOrRound: 10,
};

const graphqlConfig: ApolloDriverConfig = {
  playground: false,
  autoSchemaFile: 'apps/avidtrader-api/src/prisma/schema.gql',
  driver: ApolloDriver,
};

export const environment = {
  siteName: 'Ysera',
  siteUrl: 'https://localhost:4200',
  siteSupportEmail: 'support@avidtrader.co',
  production: false,
  port: 4301,
  prefix: 'avidtrader-api',
  serverConfig,
  appConfig,
  graphqlConfig,
  securityConfig,
} as const;
