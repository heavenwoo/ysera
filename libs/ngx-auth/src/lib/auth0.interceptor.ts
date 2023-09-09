import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JWT_BEARER_REALM } from '@ysera/agx-dto';
import { AuthService } from './auth.service';

@Injectable()
export class Auth0Interceptor implements HttpInterceptor {
  private auth!: AuthService;

  constructor(readonly injector: Injector) {
    /**
     * This interceptor will initialize before the auth module
     * So, we inject it manually, with a bit of delay to prevent circular injection deps
     */
    setTimeout(() => {
      this.auth = this.injector.get(AuthService);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('auth', this.auth);
    if (!this.auth) {
      return next.handle(request);
    }
    request = this.insertToken(request, this.auth.token);

    // console.log("interceptor", request.headers);

    return next.handle(request).pipe(
      catchError((error) => {
        console.log('error catch', error);
        return throwError(() => error);
      })
    );
  }

  private insertToken(request: HttpRequest<unknown>, token: string | null) {
    if (!token) {
      return request;
    }
    return request.clone({
      setHeaders: { Authorization: `${JWT_BEARER_REALM} ${token}` },
    });
  }
}
