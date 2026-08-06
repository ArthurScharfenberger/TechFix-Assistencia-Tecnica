export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

export function isNonNegativeNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateField(
  condition: boolean,
  field: string,
  message: string,
  errors: ValidationError[]
): void {
  if (!condition) {
    errors.push({ field, message });
  }
}
