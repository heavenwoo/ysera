/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { AuthService } from "@ysera/ngx-auth";
import {
  UserConnectFollowing,
  UserDisconnectFollowing,
  UserQuery,
  UserSelfQuery,
  UsersQuery
} from "@ysera/ngx-graphql/operations";
import { PaginationArgs, UserConnection, UserDto, UserOrder, UserWhereByIdInput } from "@ysera/ngx-graphql/schema";
import { Apollo } from "apollo-angular";
import { map, Observable, Subject } from "rxjs";
import { defaultPageArgs, defaultUserOrder } from "./user.default";

export const initialState: UserDto = {
  id: "",
  email: "",
  updatedAt: undefined,
  createdAt: undefined
};

@Injectable({ providedIn: "root" })
export class UserService implements OnDestroy {
  readonly authService = inject(AuthService);
  readonly apollo = inject(Apollo);
  currentUser = signal<UserDto | null>(null);
  private destroy$ = new Subject<boolean>();

  setCurrentUser() {
    if (this.authService.loggedIn()) {
      this.userSelf().subscribe(user => this.currentUser.set(user));
    } else {
      this.currentUser.set(null);
    }
  }

  user(data: UserWhereByIdInput): Observable<UserDto> {
    return this.apollo
      .watchQuery({
        query: UserQuery,
        variables: { data }
      })
      .valueChanges.pipe(map(({ data: { user } }: any) => user as UserDto));
  }

  users(
    pageArgs: PaginationArgs = defaultPageArgs,
    order: UserOrder = defaultUserOrder,
    query = ""
  ): Observable<UserConnection> {
    return this.apollo
      .watchQuery({
        query: UsersQuery,
        variables: {
          pageArgs,
          query,
          order
        }
      })
      .valueChanges.pipe(map(({ data: { users } }: any) => users as UserConnection));
  }

  userSelf(): Observable<UserDto> {
    return this.apollo
      .watchQuery({
        query: UserSelfQuery,
        variables: {
          id: this.authService.userId
        }
      })
      .valueChanges.pipe(map(({ data: { userSelf } }: any) => userSelf as UserDto));
  }

  userConnectFollowing(data: UserWhereByIdInput) {
    return this.apollo
      .mutate({
        mutation: UserConnectFollowing,
        variables: {
          data
        }
      })
      .pipe(map(({ data: { userConnectFollowing } }: any) => userConnectFollowing as UserDto));
  }

  userDisconnectFollowing(data: UserWhereByIdInput) {
    return this.apollo
      .mutate({
        mutation: UserDisconnectFollowing,
        variables: {
          data
        }
      })
      .pipe(
        map(({ data: { userDisconnectFollowing } }: any) => userDisconnectFollowing as UserDto)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
