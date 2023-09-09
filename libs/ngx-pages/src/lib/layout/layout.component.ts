// import ls from 'localstorage-slim';
import { NgFor, NgIf } from "@angular/common";
import { Component, computed, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "@ysera/ngx-auth";
import { LoginComponent, UserCardComponent } from "@ysera/ngx-components";
import { StoreService } from "@ysera/ngx-store";
import { UserService } from "@ysera/ngx-user";
import { HeaderComponent } from "../header/header.component";
import UserListComponent from "../user-list/user-list.component";

@Component({
  selector: "ysera-layout",
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    HeaderComponent,
    UserCardComponent,
    LoginComponent,
    NgFor,
    NgIf,
    RouterOutlet,
    UserListComponent
  ],
  templateUrl: "layout.component.html"
})
export class LayoutComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly user = inject(UserService);
  readonly store = inject(StoreService);
  currentUser = computed(() => this.user.currentUser());

  ngOnInit() {
    !this.currentUser() && this.setCurrentUser();
  }

  setCurrentUser() {
    this.user.setCurrentUser();
  }

  onSearch(query: string) {
    this.store.query.set(query.trim());
  }

  doChange(change: boolean) {
    change ? this.logout() : this.login();
  }

  private login() {
    this.auth
      .loginRequest({
        email: "heavenwoo@me.com",
        password: "heaven"
      })
      .subscribe(() => {
        this.setCurrentUser();
      });
  }

  private logout() {
    this.auth.logoutRequest().subscribe();
  }
}
