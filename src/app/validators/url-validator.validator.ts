import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { isFullUrl, containsUrl } from '../utils/validators.utils';

export const urlValidator = (): ValidatorFn => {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value?.trim() ?? '';

    if (!value) return null; // TODO: let required/minLength handle empty

    return isFullUrl(value) ? null : { invalidUrl: true };
  };
};

export const urlForbiddenValidator = (): ValidatorFn => {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    return isFullUrl(control.value ?? '') ? { urlForbidden: true } : null;
  };
};

export const titleValidator = (): ValidatorFn => {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value?.trim() ?? '';
    if (!value) return null;

    // Case 1: Whole value is exactly a valid URL → ✅
    if (isFullUrl(value)) {
      return null;
    }

    // Case 2: Value contains a URL fragment → ❌ (mixed)
    if (containsUrl(value)) {
      return { titleMixedUrl: true };
    }

    // Case 3: Pure text (no URLs) → ✅
    return null;
  };
};
