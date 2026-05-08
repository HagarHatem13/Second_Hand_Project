import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function egyptianPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const phoneRegex = /^01[0125][0-9]{8}$/;

    return phoneRegex.test(value) ? null : { invalidPhone: true };
  };
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

export function contactValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const phoneRegex = /^01[0125][0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return phoneRegex.test(value) || emailRegex.test(value)
      ? null
      : { invalidContact: true };
  };
}
