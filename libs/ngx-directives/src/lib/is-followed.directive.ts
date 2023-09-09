import { Directive, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "@ysera/ngx-auth";

@Directive({
  selector: "[yseraIsFollowed]",
  standalone: true
})
export class IsFollowedDirective {
  #isFollowed = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {
  }

  get isFollowed() {
    return this.#isFollowed;
  }

  set isFollowed(value: boolean) {
    this.#isFollowed = value;
  }
}
