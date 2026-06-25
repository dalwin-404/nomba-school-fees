'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30',
  secondary:
    'bg-muted text-foreground hover:bg-border',
  outline:
    'border border-border text-foreground hover:bg-muted hover:border-muted-foreground/30',
  ghost:
    'text-foreground hover:bg-muted',
  danger:
    'bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm rounded-lg gap-1.5',
  md: 'px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg sm:rounded-xl gap-1.5 sm:gap-2',
  lg: 'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl gap-2 sm:gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-out
        focus-ring
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.98]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin-slow -ml-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
