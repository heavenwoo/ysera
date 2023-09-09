import { NgFor } from "@angular/common";
import { AfterViewInit, Component, computed, effect, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "@ysera/ngx-auth";
import { InfiniteScrollComponent, UserCardComponent } from "@ysera/ngx-components";
import { PageInfo, PaginationArgs, UserDtoEdge } from "@ysera/ngx-graphql/schema";
import { StoreService } from "@ysera/ngx-store";
import { defaultUserOrder, UserService } from "@ysera/ngx-user";

@Component({
  selector: "ysera-user-list",
  standalone: true,
  imports: [UserCardComponent, NgFor, MatButtonModule, MatIconModule],
  templateUrl: "./user-list.component.html",
  styles: []
})
export default class UserListComponent
  extends InfiniteScrollComponent
  implements OnInit, AfterViewInit {
  readonly auth = inject(AuthService);
  readonly user = inject(UserService);
  readonly store = inject(StoreService);
  @ViewChild("infinite") readonly infinite!: ElementRef;
  usersEdge: UserDtoEdge[] = [];
  pageInfo: PageInfo = { hasNextPage: false, hasPreviousPage: false };
  totalCount = 0;
  loadUsersByScroll$ = this.pageToLoad$.pipe().subscribe((page) => {
    console.log("page", page);
    if (page && this.cache.indexOf(page) <= -1) {
      this.getUsers({ first: 28, after: this.pageInfo.endCursor });
      this.cache.push(page);
    }
  });
  override itemHeight = 150;
  override numberOfItems = 7;
  currentUser = computed(() => this.user.currentUser());
  query = computed(() => this.store.query());

  constructor() {
    super();
    effect(() => {
      this.reset();
      this.getUsers();
    });
  }

  ngOnInit() {
    return;
  }

  ngAfterViewInit() {
    console.log(this.infinite);
  }

  reset() {
    this.usersEdge = [];
    this.totalCount = 0;
    this.pageInfo = { hasNextPage: false, hasPreviousPage: false };
  }

  connectFollowing(followingId: string) {
    this.user.userConnectFollowing({ id: followingId }).subscribe();
  }

  disconnectFollowing(followingId: string) {
    this.user.userDisconnectFollowing({ id: followingId }).subscribe();
  }

  getUsers(pageArgs: PaginationArgs = { first: 40 }) {
    this.user.users(pageArgs, defaultUserOrder, this.query()).subscribe((userConnection) => {
      userConnection.edges?.filter(edge => !this.usersEdge.includes(edge)).map(edge => this.usersEdge.push(edge));
      this.totalCount = userConnection.totalCount;
      this.pageInfo = userConnection.pageInfo as PageInfo;
    });
  }
}
