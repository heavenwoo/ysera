import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { JWT_BEARER_REALM } from "@ysera/agx-dto";
import { catchError, Observable, throwError } from "rxjs";
import { token } from "./token.signal";

export const authInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (token()) {
    request = request.clone({
      setHeaders: { Authorization: `${JWT_BEARER_REALM} ${token()}` }
    });
  }
  return next(request).pipe(
    catchError((error) => {
      console.log("interceptor", error);
      return throwError(() => error);
    })
  );
};
