import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { BatchOptions, HttpLink } from 'apollo-angular/http';
import {
  ApolloClientOptions,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { END_POINT } from './graphql.constant';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { NormalizedCachedOptions } from '@angular-devkit/build-angular/src/utils/normalize-cache';

const createApollo = (httpLink: HttpLink): ApolloClientOptions<NormalizedCacheObject> => {
  return {
    link: httpLink.create({
      uri: END_POINT,
      withCredentials: true,
    }),
    cache: new InMemoryCache(),
  };
};

export abstract class GraphQLOptions {
  resolvers?: ApolloClientOptions<NormalizedCachedOptions>['resolvers'];
  cacheOptions?: InMemoryCacheConfig;
  batchOptions?: BatchOptions;
}

@NgModule({
  imports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, GraphQLOptions],
    },
  ],
})
export class GraphQLModule {
  constructor(@Optional() @SkipSelf() parentModule?: GraphQLModule) {
    if (parentModule) {
      throw new Error('GraphQLModule is already loaded. Import it in the AppModule only.');
    }
  }

  static forRoot(options: GraphQLOptions): ModuleWithProviders<GraphQLModule> {
    return {
      ngModule: GraphQLModule,
      providers: [
        {
          provide: GraphQLOptions,
          useValue: options,
        },
      ],
    };
  }
}
