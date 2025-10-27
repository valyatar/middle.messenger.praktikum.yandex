export interface ValidationRules {
  [key: string]: RegExp;
}

export interface FormValidationResult {
  isValid: boolean;
  data: Record<string, string>;
}

const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,40}$/;

export const validationRules: ValidationRules = {
  login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  password: passwordPattern,
  password_check: passwordPattern,
  oldPassword: passwordPattern,
  newPassword: passwordPattern,
  repeatNewPassword: passwordPattern,
  first_name: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
  second_name: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
  phone: /^\+?\d{10,15}$/,
  message: /.+/,
};

export function validateField(name: string, value: string): boolean {
  const pattern = validationRules[name];
  if (!pattern) return true; // если правила нет - считаем валидным

  return pattern.test(value);
}

export function validateForm(form: HTMLFormElement): FormValidationResult {
  const inputs = Array.from(form.querySelectorAll<HTMLInputElement>('input'));
  const data: Record<string, string> = {};
  const errors: string[] = [];
  let isValid = true;

  inputs.forEach(input => {
    const fieldIsValid = validateField(input.name, input.value);

    // Обновляем визуальное состояние
    input.classList.toggle('input__error', !fieldIsValid);

    if (fieldIsValid) {
      data[input.name] = input.value;
    } else {
      isValid = false;
      errors.push(input.name);
    }
  });

  return { isValid, data };
}
