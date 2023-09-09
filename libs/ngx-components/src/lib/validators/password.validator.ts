import { AbstractControl } from '@angular/forms';

interface PasswordErrors {
  minlength?: { actualLength: number; requiredLength: number };
  maxlength?: { actualLength: number; requiredLength: number };
}

export const passwordValidatorFn = (control: AbstractControl) => {
  const errors: PasswordErrors = {};

  if (control.value) {
    if (control.value.length < 6) {
      errors.minlength = {
        actualLength: control.value.length,
        requiredLength: 6,
      };
    }

    if (control.value.length > 10) {
      errors.maxlength = {
        actualLength: control.value.length,
        requiredLength: 10,
      };
    }
  }

  if (Object.keys(errors).length > 0) return errors;
  return null;
};
