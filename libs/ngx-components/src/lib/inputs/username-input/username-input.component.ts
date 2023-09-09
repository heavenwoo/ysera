import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'ysera-username-input',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule],
  template: `
    <mat-form-field>
      <mat-label>{{ label }}</mat-label>
      <input
        #usernameInput
        matInput
        placeholder="Username"
        autocomplete="username"
        [formControl]="control"
      />
    </mat-form-field>
  `,
  styles: [],
})
export class UsernameInputComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;

  @Input() label = 'Username';
  control = new FormControl('', {
    validators: [],
    nonNullable: true,
  });

  @Input() set required(value: boolean | string | undefined) {
    const isRequired = value !== 'false' && value !== false;

    if (isRequired && !this.control.hasValidator(Validators.required)) {
      this.control.addValidators(Validators.required);
    } else if (!isRequired && this.control.hasValidator(Validators.required)) {
      this.control.removeValidators(Validators.required);
    }
  }

  select() {
    this.usernameInput.nativeElement.select();
  }
}
