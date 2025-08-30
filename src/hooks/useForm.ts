import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    if (!validationRules || !validationRules[name]) return null;

    const rule = validationRules[name];

    if (rule.required && (!value || value.trim() === '')) {
      return 'Field ini wajib diisi';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      return `Minimal ${rule.minLength} karakter`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      return `Maksimal ${rule.maxLength} karakter`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      return 'Format tidak valid';
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true;

    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, values[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldError,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
  };
}
