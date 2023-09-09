/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonPipe, NgFor, NgIf } from "@angular/common";
import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { AuthService, token } from "@ysera/ngx-auth";
import { PageInfo, PaginationArgs, UserConnection, UserDtoEdge } from "@ysera/ngx-graphql/schema";
import { User, UserService } from "@ysera/ngx-user";
import ls from "localstorage-slim";
import { throwError } from "rxjs";

@Component({
  standalone: true,
  selector: "ysera-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  imports: [NgIf, NgFor, MatButtonModule, JsonPipe]
})
export class UsersComponent implements OnInit {
  currentUser: WritableSignal<User | null> = signal(null);
  usersEdge: WritableSignal<UserDtoEdge[]> = signal([]);
  usersCount: WritableSignal<number> = signal(0);
  currentPageInfo: WritableSignal<PageInfo> = signal({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: "",
    endCursor: ""
  });
  loading: WritableSignal<boolean> = signal(false);
  readonly authService = inject(AuthService);
  userId: Signal<string | null> = computed(() => this.authService.userId);
  readonly userService = inject(UserService);
  protected readonly token = token;

  constructor() {
    effect(() => {
      console.log("userId effect", this.userId());
      console.log("currentPageInfo effect", this.currentPageInfo());
      console.log("currentUser effect", this.currentUser());
    });
  }

  ngOnInit() {
    this.users();
    this.getCurrentUser();
  }

  getCurrentUser() {
    console.log("getCurrentUser", this.authService.userId);
    const userId = ls.get<string>("userId", { decrypt: true }) ?? "";
    console.log("userId: ", userId);
    if (userId) {
      this.userService.user({ id: userId }).subscribe({
        next: (user) => {
          // this.user = user;
          const { __typename, ...prunedUser } = user;
          this.currentUser.set(prunedUser);
          console.log("current user", this.currentUser());
        },
        error: (error) => {
          return throwError(() => error);
        }
      });
    }
  }

  login() {
    this.authService.loginRequest({
      email: "heavenwoo@live.com",
      password: "heaven"
    });
  }

  userSelf() {
    this.userService.userSelf().subscribe({
      next: (user) => {
        console.log("userSelf", user);
      },
      error: (error) => {
        console.warn(error.graphQLErrors);
        return throwError(() => error);
      }
    });
  }

  refreshToken() {
    this.authService.tokenRefreshRequest();
  }

  users(pageArgs: PaginationArgs = { first: 20 }) {
    this.loading.set(true);
    this.userService.users(pageArgs).subscribe((data: UserConnection) => {
      this.usersEdge.set(data.edges as UserDtoEdge[]);
      this.usersCount.set(data.totalCount);
      this.currentPageInfo.set(data.pageInfo);
      this.loading.set(false);
    });
  }

  nextPage() {
    this.users({ first: 20, after: this.currentPageInfo().endCursor });
  }

  previousPage() {
    this.users({ last: 20, before: this.currentPageInfo().startCursor });
  }

  logout() {
    this.authService.logoutRequest();
  }
}
