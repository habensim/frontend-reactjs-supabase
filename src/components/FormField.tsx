import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  ariaDescribedBy?: string;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    required = false,
    disabled = false,
    className = '',
    ariaDescribedBy
  }, ref) => {
    const hasError = touched && error;
    const errorId = `${name}-error`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(name, e.target.value);
    };

    const handleBlur = () => {
      onBlur(name);
    };

    const inputClasses = `
      w-full px-4 py-3 border rounded-lg transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-50 disabled:cursor-not-allowed
      ${hasError 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300 hover:border-gray-400'
      }
      ${className}
    `;

    return (
      <div className="space-y-2">
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${inputClasses} resize-vertical min-h-[100px]`}
            aria-describedby={ariaDescribedBy || (hasError ? errorId : undefined)}
            aria-invalid={hasError}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputClasses}
            aria-describedby={ariaDescribedBy || (hasError ? errorId : undefined)}
            aria-invalid={hasError}
          />
        )}

        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-red-600 text-sm"
            id={errorId}
            role="alert"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;

