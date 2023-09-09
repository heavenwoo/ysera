import { Component, EventEmitter, Output } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'ysera-login',
  standalone: true,
  imports: [LoginFormComponent],
  template: `
    <div class="card">
      <div class="card-header">
        <h1>
          <i class="fa-solid fa-fw fa-key me-1"></i>
          Login
        </h1>
      </div>
      <div class="card-body">
        <ysera-login-form (loggedIn)="loggedIn.emit()" />
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  @Output() loggedIn = new EventEmitter<never>();
}
