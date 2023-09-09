/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, Injectable, OnDestroy, signal } from "@angular/core";
import { ApolloError } from "@apollo/client";
import { JwtDto } from "@ysera/agx-dto";
import { AuthTokenRefreshMutation, AuthUserLoginMutation, AuthUserLogoutMutation } from "@ysera/ngx-graphql/operations";
import { AuthStatusDto, AuthTokenDto, AuthUserCredentialsInput } from "@ysera/ngx-graphql/schema";
import { JwtService } from "@ysera/ngx-jwt";
import { LocalStorageService } from "@ysera/ngx-local-storage";
import { Apollo } from "apollo-angular";
import { first, interval, map, Observable, retry, Subject, Subscription, takeUntil, throwError, timer } from "rxjs";
import { AuthSession } from "./auth.model";
import { token } from "./token.signal";

const ls = new LocalStorageService();

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  readonly loggedIn = signal(false);
  private destroy$ = new Subject<boolean>();
  #userId = computed<string>(() =>
    token() ? this.jwt.getPayload<JwtDto>(token() as string).userId : ""
  );

  #exchangeIntervalSubscription?: Subscription;

  constructor(private readonly apollo: Apollo, private readonly jwt: JwtService) {
    try {
      const userId = ls.get<string>("userId", { decrypt: true });
      this.loggedIn.set(!!userId);
      if (this.loggedIn()) {
        this.tokenRefreshRequest();
        this.startRefreshInterval();
      }
    } catch (error) {
      console.error("AuthService failed to initialize", error);
      this.logoutRequest();
    }
  }

  get userId(): string {
    return this.#userId();
  }

  loginRequest(data: AuthUserCredentialsInput): Observable<AuthTokenDto> {
    return this.apollo
      .mutate({
        mutation: AuthUserLoginMutation,
        variables: { data }
      })
      .pipe(
        map(({ data: { authUserLogin } }: any) => {
          if (authUserLogin.ok) {
            this.loggedIn.set(true);
            const userId = this.jwt.getPayload<JwtDto>(authUserLogin.token)?.userId;
            token.set(authUserLogin.token);
            this.setSession({
              userId,
              token: authUserLogin.token
            });
          }
          return authUserLogin;
        })
      );
  }

  logoutRequest(): Observable<AuthStatusDto> {
    return this.apollo
      .mutate<AuthStatusDto>({
        mutation: AuthUserLogoutMutation
      })
      .pipe(
        first(),
        takeUntil(this.destroy$),
        map(({ data: { authUserLogout } }: any) => {
          if (authUserLogout.ok) {
            this.loggedIn.set(false);
            token.set("");
            this.clearSession();
          }
          return authUserLogout;
        })
      );
  }

  tokenRefreshRequest(): Subscription {
    return this.apollo
      .mutate<AuthTokenDto>({
        mutation: AuthTokenRefreshMutation
      })
      .pipe(
        retry({
          delay: retryStrategy({
            excludeStatusCodes: ["FORBIDDEN", "UNAUTHENTICATED", "INTERNAL_SERVER_ERROR"],
            delay: 5000
          })
        })
      )
      .subscribe({
        next: ({ data: { authTokenRefresh } }: any) => {
          const payload = this.jwt.getPayload<JwtDto>(authTokenRefresh.token);
          this.setSession({
            userId: payload.userId,
            token: authTokenRefresh.token
          });
        },
        error: (error: ApolloError) => {
          this.logoutRequest();
          console.error("Refresh token failed", error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private startRefreshInterval(): void {
    if (!this.#exchangeIntervalSubscription) {
      this.#exchangeIntervalSubscription = interval(20 * 1000).subscribe((r) => {
        console.log(r);
        this.tokenRefreshRequest();
      });
    }
  }

  private stopRefreshInterval(): void {
    if (this.#exchangeIntervalSubscription) {
      this.#exchangeIntervalSubscription.unsubscribe();
      this.#exchangeIntervalSubscription = undefined;
    }
  }

  private setSession(authSession: AuthSession): void {
    ls.set("userId", authSession.userId, { encrypt: true });
    ls.set("token", authSession.token, { encrypt: true });
    token.set(authSession.token);
    this.startRefreshInterval();
  }

  private clearSession(): void {
    ls.remove("userId");
    ls.remove("token");
    token.set(null);
    this.stopRefreshInterval();
  }
}

function retryStrategy({ maxAttempts = Infinity, delay = 5000, excludeStatusCodes = [] }: {
  maxAttempts?: number;
  delay?: number;
  excludeStatusCodes: string[];
}) {
  return (error: ApolloError, retryCount: number) => {
    const excludedStatusFound = !!excludeStatusCodes.find((exclude) => exclude === error.message);

    if (retryCount > maxAttempts || excludedStatusFound) {
      return throwError(() => error);
    }

    console.warn(
      `Refresh token attempt ${retryCount}. Retrying in ${Math.round(delay / 1000)}s`,
      error
    );

    return timer(delay);
  };
}
