import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { UserDto } from "@ysera/ngx-graphql/schema";
import { HighlightPipe, TimeAgoPipe } from "@ysera/ngx-pipes";
import { User } from "@ysera/ngx-user";

@Component({
  selector: "ysera-user-card",
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    TimeAgoPipe,
    NgIf,
    MatTooltipModule,
    MatIconModule,
    HighlightPipe,
    RouterLink
  ],
  templateUrl: "user-card.component.html",
  styles: [
    `
        .user-card {
            border-radius: unset;
        }

        .avatar {
            background-size: cover;
        }
    `
  ]
})
export class UserCardComponent {
  @Output() followingId = new EventEmitter<string>();
  @Output() unFollowingId = new EventEmitter<string>();
  @Input() follower?: User | null;
  @Input() keyword = "";
  @Input() user!: UserDto;

  isFollowed() {
    let isFollowed = false;
    this.follower?.following?.filter((following) => {
      if (following.id === this.user?.id) isFollowed = true;
    });
    return isFollowed;
  }

  isSelf() {
    return this.follower?.id === this.user?.id;
  }

  doFollowing(id: string | undefined) {
    id && this.followingId.emit(id);
  }

  undoFollowing(id: string | undefined) {
    id && this.unFollowingId.emit(id);
  }
}
