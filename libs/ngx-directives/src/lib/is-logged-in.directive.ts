import { Directive, effect, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "@ysera/ngx-auth";

@Directive({
  selector: "[isLoggedIn]",
  standalone: true
})
export class IsLoggedInDirective {
  #embeddedViewRef!: EmbeddedViewRef<unknown> | undefined;
  #isLoggedIn?: boolean;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {
    effect(() => {
      authService.loggedIn();
      this.update();
    });
  }

  get isLoggedIn() {
    return this.#isLoggedIn ?? true;
  }

  @Input()
  set isLoggedIn(value: boolean) {
    this.#isLoggedIn = value;
    this.update();
  }

  update() {
    if (
      (this.isLoggedIn && this.authService.loggedIn()) ||
      (!this.isLoggedIn && !this.authService.loggedIn())
    ) {
      this.render();
    } else {
      this.clear();
    }
  }

  render() {
    if (!this.#embeddedViewRef) {
      this.#embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  clear() {
    this.viewContainer.clear();
    this.#embeddedViewRef = undefined;
  }
}
