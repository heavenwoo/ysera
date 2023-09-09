import { Route } from '@angular/router';
import { authRoutes, mainRoutes } from '@ysera/ngx-pages';

export const appRoutes: Route[] = [...authRoutes, ...mainRoutes];
