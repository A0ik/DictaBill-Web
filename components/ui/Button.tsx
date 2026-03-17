'use client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  };
  const sizes = {
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
