import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { passwordValidatorFn } from '../../validators';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ysera-password-input',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-form-field hideRequiredMarker class="w-full">
      <mat-label>{{ label }}</mat-label>
      <input
        #passwordInput
        [type]="hide ? 'password' : 'text'"
        matInput
        placeholder="Password"
        autocomplete="password"
        [formControl]="control"
      />
      <button
        type="button"
        mat-icon-button
        matSuffix
        (click)="hide = !hide"
        tabindex="-1"
        title="Toggle show password"
        [attr.aria-label]="'Hide password'"
        [attr.aria-pressed]="hide"
      >
        <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
      <mat-error *ngIf="control.hasError('required')">Required</mat-error>
      <mat-error *ngIf="control.hasError('minlength')"
        >Minimum length of {{ control.getError('minlength')?.['requiredLength'] }} characters
      </mat-error>
      <mat-error *ngIf="control.hasError('maxlength')"
        >Maximum length of {{ control.getError('maxlength')?.['requiredLength'] }} characters
      </mat-error>
      <mat-error *ngIf="control.hasError('custom')">{{ customErrorMessage }}</mat-error>
    </mat-form-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PasswordInputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordInputComponent,
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  @Input() label = 'Password';
  control = new FormControl('', {
    validators: [passwordValidatorFn],
    nonNullable: true,
  });
  hide = true;
  touchedListeners: Array<() => unknown> = [];
  #subs: Subscription[] = [];
  private showCustomError = false;
  #customErrorMessage = '';

  @Input() set customErrorMessage(value: string) {
    this.showCustomError = !!value;
    this.#customErrorMessage = value;
    this.control.updateValueAndValidity();
  }

  get customErrorMessage() {
    return this.#customErrorMessage;
  }

  @Input() set required(value: boolean | string | undefined) {
    const isRequired = value !== 'false' && value !== false;

    if (isRequired && !this.control.hasValidator(Validators.required)) {
      this.control.addValidators(Validators.required);
    } else if (!isRequired && this.control.hasValidator(Validators.required)) {
      this.control.removeValidators(Validators.required);
    }
  }

  constructor() {
    const sub = this.control.valueChanges.subscribe(() => {
      this.showCustomError = false;
    });
    this.#subs.push(sub);
  }

  customErrorValidator(): ValidatorFn {
    return () => (this.showCustomError ? { custom: true } : null);
  }

  select() {
    this.passwordInput.nativeElement.select();
  }

  writeValue(value: string) {
    this.control.setValue(value);
  }

  registerOnChange(fn: (_: any) => void) {
    const sub = this.control.valueChanges.subscribe(fn);
    this.#subs.push(sub);
    fn(this.control.value);
  }

  emitTouched() {
    this.touchedListeners.forEach((fn) => fn());
  }

  registerOnTouched(fn: any) {
    this.touchedListeners.push(fn);
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) this.control.disable();
    else this.control.enable();
  }

  validate() {
    return this.control.invalid && { invalid: true };
  }

  ngOnDestroy() {
    this.#subs.forEach((s) => s.unsubscribe());
  }
}
