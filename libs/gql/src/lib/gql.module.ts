import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule],
})
export class GqlModule {
  constructor(@Optional() @SkipSelf() parentModule: GqlModule) {
    if (parentModule) {
      throw new Error(
        'GqlModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  forRoot() {
    return {
      ngModule: GqlModule,
    };
  }
}
