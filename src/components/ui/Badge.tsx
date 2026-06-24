import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'info' | 'pending' | 'danger';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success border-success/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  info: 'bg-info-bg text-info border-info/20',
  pending: 'bg-muted text-muted-foreground border-border',
  danger: 'bg-error-bg text-error border-error/20',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  pending: 'bg-muted-foreground',
  danger: 'bg-error',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  variant = 'pending',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
