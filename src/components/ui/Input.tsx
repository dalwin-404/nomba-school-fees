'use client';

import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

export function Input({
  label,
  error,
  hint,
  leadingIcon,
  trailingIcon,
  inputSize = 'md',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const sizeClasses = {
    sm: 'py-1.5 text-sm',
    md: 'py-2.5 text-sm',
    lg: 'py-3 text-base',
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leadingIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border bg-background
            ${leadingIcon ? 'pl-10' : 'pl-4'}
            ${trailingIcon ? 'pr-10' : 'pr-4'}
            ${sizeClasses[inputSize]}
            placeholder:text-muted-foreground/60
            transition-all duration-200
            focus-ring
            ${
              error
                ? 'border-error text-error focus:border-error focus:ring-error/30'
                : 'border-border text-foreground focus:border-primary focus:ring-primary/20'
            }
            ${className}
          `}
          {...props}
        />
        {trailingIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {trailingIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm
          text-foreground transition-all duration-200 focus-ring
          ${error ? 'border-error' : 'focus:border-primary'}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </div>
  );
}
