import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { authInterceptorFn } from '@ysera/ngx-auth';
import { GraphQLModule } from '@ysera/ngx-graphql';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(
      GraphQLModule.forRoot({
        cacheOptions: {
          possibleTypes: {},
          typePolicies: {},
        },
        batchOptions: {
          uri: '/graphql',
          batchMax: 250,
        },
      }),
    ),
  ],
};
