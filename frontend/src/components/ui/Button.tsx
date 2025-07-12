/**
 * Button Component - Enterprise Employee Rewards System
 * 
 * A premium, accessible button component with multiple variants,
 * sizes, and states for professional applications.
 */

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';
import type { ButtonProps } from './types';

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary', 
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-md hover:shadow-lg',
  warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-md hover:shadow-lg',
  error: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-md hover:shadow-lg',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
  xl: 'h-14 px-8 text-lg rounded-xl',
};

/**
 * Premium Button component with enterprise-grade styling and accessibility
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    rounded = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'btn-base',
          buttonVariants[variant],
          buttonSizes[size],
          
          // Conditional styles
          {
            'w-full': fullWidth,
            'rounded-full': rounded,
            'cursor-not-allowed opacity-50': isDisabled,
            'relative': loading,
          },
          
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText && (
              <span className="ml-2 text-sm font-medium">
                {loadingText}
              </span>
            )}
          </span>
        )}

        {/* Button content */}
        <span
          className={cn(
            'flex items-center justify-center gap-2',
            { 'opacity-0': loading }
          )}
        >
          {leftIcon && !loading && (
            <span className="flex-shrink-0">
              {leftIcon}
            </span>
          )}
          
          {children && (
            <span className="font-medium">
              {children}
            </span>
          )}
          
          {rightIcon && !loading && (
            <span className="flex-shrink-0">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Button Group component for related actions
 */
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  attached = false,
  size = 'md',
}) => {
  return (
    <div
      className={cn(
        'inline-flex',
        {
          'flex-col': orientation === 'vertical',
          'flex-row': orientation === 'horizontal',
          'divide-x divide-neutral-200 [&>button]:rounded-none [&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg': 
            attached && orientation === 'horizontal',
          'divide-y divide-neutral-200 [&>button]:rounded-none [&>button:first-child]:rounded-t-lg [&>button:last-child]:rounded-b-lg': 
            attached && orientation === 'vertical',
          'gap-2': !attached,
        },
        className
      )}
      role="group"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Button) {
          return React.cloneElement(child, {
            size: child.props.size || size,
          } as any);
        }
        return child;
      })}
    </div>
  );
};

/**
 * Icon Button component for actions with just icons
 */
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
  tooltip?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', variant = 'ghost', ...props }, ref) => {
    const iconSizes = {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-14 w-14',
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          iconSizes[size],
          'p-0 rounded-full',
          className
        )}
        {...props}
      >
        <span className="flex items-center justify-center">
          {icon}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * Link Button component that looks like a button but behaves like a link
 */
interface LinkButtonProps extends ButtonProps {
  href: string;
  external?: boolean;
  download?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ href, external = false, download = false, className, ...props }, ref) => {
    const linkProps = {
      href,
      ...(external && { target: '_blank', rel: 'noopener noreferrer' }),
      ...(download && { download: true }),
    };

    return (
      <a
        ref={ref}
        className={cn(
          'btn-base',
          buttonVariants[props.variant || 'primary'],
          buttonSizes[props.size || 'md'],
          {
            'w-full': props.fullWidth,
            'rounded-full': props.rounded,
          },
          className
        )}
        {...linkProps}
      >
        <span className="flex items-center justify-center gap-2">
          {props.leftIcon && (
            <span className="flex-shrink-0">
              {props.leftIcon}
            </span>
          )}
          
          {props.children && (
            <span className="font-medium">
              {props.children}
            </span>
          )}
          
          {props.rightIcon && (
            <span className="flex-shrink-0">
              {props.rightIcon}
            </span>
          )}
        </span>
      </a>
    );
  }
);

LinkButton.displayName = 'LinkButton';

export type { ButtonProps };