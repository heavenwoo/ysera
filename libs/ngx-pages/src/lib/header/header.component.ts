import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { LoginComponent } from "@ysera/ngx-components";

@Component({
  selector: "ysera-header",
  standalone: true,
  imports: [NgIf, MatToolbarModule, MatButtonModule, RouterLink, LoginComponent],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  isOpen = false;
  @Input() isLoggedIn = false;
  @Output() isLoggedInChange = new EventEmitter<boolean>();

  @Output() searchInputChange = new EventEmitter<string>();

  onInput(event: Event) {
    this.searchInputChange.emit((event.target as HTMLInputElement).value);
  }

  doLogout(event = false) {
    this.isLoggedInChange.emit(event);
  }
}
