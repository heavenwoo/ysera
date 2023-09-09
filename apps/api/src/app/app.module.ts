import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../environments/environment';
import { appConfiguration } from './app.config';
import { PrismaModule } from '@ysera/nsx-prisma';
import { AuthModule } from '@ysera/nsx-auth';
import { UserModule } from '@ysera/nsx-user';
import { HttpRequest, HttpResponse } from '@ysera/nsx-common';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...environment.appConfig,
      load: [appConfiguration],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    GraphQLModule.forRoot({
      ...environment.graphqlConfig,
      context: ({ req, res }) => ({
        request: req as HttpRequest,
        response: res as HttpResponse,
      }),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
