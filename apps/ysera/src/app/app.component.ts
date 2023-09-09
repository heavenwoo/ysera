/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from "@angular/core";
import { LayoutComponent } from "@ysera/ngx-pages";

@Component({
  standalone: true,
  imports: [LayoutComponent],
  selector: "ysera-root",
  template: "<ysera-layout></ysera-layout>"
})
export class AppComponent {
}
