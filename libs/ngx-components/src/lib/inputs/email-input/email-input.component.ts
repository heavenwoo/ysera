import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { emailValidator } from '../../validators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ysera-email-input',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, NgIf, MatFormFieldModule, MatIconModule],
  template: `
    <mat-form-field hideRequiredMarker class="w-full">
      <mat-label>{{ label }}</mat-label>
      <input
        #emailInput
        type="email"
        matInput
        placeholder="Email"
        autocomplete="email"
        maxlength="254"
        [formControl]="control"
      />
      <mat-icon matSuffix>mail</mat-icon>
      <mat-error *ngIf="control.hasError('required')">Required</mat-error>
      <mat-error *ngIf="control.hasError('email')">Not a valid email</mat-error>
      <mat-error *ngIf="control.hasError('emailTaken')">Email is already taken</mat-error>
      <mat-error *ngIf="control.hasError('custom')">{{ customErrorMessage }}</mat-error>
    </mat-form-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EmailInputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: EmailInputComponent,
      multi: true,
    },
  ],
})
export class EmailInputComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

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

  @Input() label = 'Email';
  control = new FormControl('', {
    validators: [emailValidator()],
    nonNullable: true,
  });

  #subs: Subscription[] = [];
  touchedListeners: Array<() => unknown> = [];

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

  select() {
    this.emailInput.nativeElement.select();
  }

  customErrorValidator(): ValidatorFn {
    return () => (this.showCustomError ? { custom: true } : null);
  }

  writeValue(value: string): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: (_: any) => void): void {
    const sub = this.control.valueChanges.subscribe(fn);
    this.#subs.push(sub);
    fn(this.control.value);
  }

  registerOnTouched(fn: any): void {
    this.touchedListeners.push(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.control.disable();
    else this.control.enable();
  }

  validate() {
    return this.control.valid && { invalid: true };
  }

  ngOnDestroy() {
    this.#subs.forEach((s) => s.unsubscribe());
  }
}
