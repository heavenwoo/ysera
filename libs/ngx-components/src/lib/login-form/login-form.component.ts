import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EmailInputComponent, PasswordInputComponent } from '../inputs';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthUserCredentialsInput } from '@ysera/ngx-graphql/schema';
import { AuthService } from '@ysera/ngx-auth';
import { ApolloError } from '@apollo/client';
import { map, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface FormType {
  email: FormControl<AuthUserCredentialsInput['email']>;
  password: FormControl<AuthUserCredentialsInput['password']>;
}

@Component({
  selector: 'ysera-login-form',
  standalone: true,
  imports: [EmailInputComponent, PasswordInputComponent, MatButtonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="w-full fs-4 py-1">
        <ysera-email-input #emailInput [formControl]="email" required />
      </div>
      <div class="w-full py-1">
        <ysera-password-input #passwordInput [formControl]="password" required />
      </div>
      <button type="submit" mat-raised-button color="primary">Login</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('emailInput') emailInput!: EmailInputComponent;
  @ViewChild('passwordInput') passwordInput!: PasswordInputComponent;
  @Output() loggedIn = new EventEmitter();

  form = new FormGroup<FormType>({
    email: new FormControl(),
    password: new FormControl(),
  });

  #subs: Subscription[] = [];
  loading = false;
  done = false;
  generalError = false;
  emailTakenError = false;

  constructor(readonly authService: AuthService, private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.emailInput.select();
    });
  }

  ngOnInit(): void {
    const sub = this.route.queryParamMap
      .pipe(map((p) => p.get('email_taken') === 'true'))
      .subscribe((emailTaken) => {
        this.emailTakenError = emailTaken;
      });
    this.#subs.push(sub);
  }

  get email() {
    return this.form.get('email') as FormType['email'];
  }

  get password() {
    return this.form.get('password') as FormType['password'];
  }

  onSubmit() {
    console.log(this.form);
    this.authService.loginRequest({
      email: this.email.value,
      password: this.password.value,
    });

    this.loggedIn.emit();
  }
}
