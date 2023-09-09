import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { HttpRequest, HttpResponse } from '@ysera/nsx-common';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {
  }

  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: true,
      sortSchema: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: this.configService.get<string>('graphqlConfig.autoSchemaFile'),
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      // cors: {
      //   credentials: true,
      //   origin: 'http://localhost:4200',
      // },
      context: ({ req, res }) => ({ request: req as HttpRequest, response: res as HttpResponse }),
    };
  }
}
