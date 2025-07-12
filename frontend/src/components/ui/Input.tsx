/**
 * Input Component - Enterprise Employee Rewards System
 * 
 * A comprehensive input component with multiple variants,
 * validation states, and accessibility features.
 */

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { cn } from './utils';
import type { InputProps } from './types';

const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};

const inputVariants = {
  default: 'input-base',
  filled: 'bg-neutral-100 border-transparent focus:bg-white focus:border-primary-500',
  flushed: 'border-0 border-b-2 border-neutral-300 rounded-none px-0 focus:border-primary-500 focus:ring-0',
};

/**
 * Premium Input component with enterprise-grade styling and functionality
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    size = 'md',
    variant = 'default',
    leftElement,
    rightElement,
    error = false,
    errorMessage,
    helperText,
    label,
    required = false,
    disabled = false,
    id,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;
    
    const hasLeftElement = !!leftElement;
    const hasRightElement = !!rightElement || isPassword;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              error ? 'text-error-700' : 'text-neutral-700',
              disabled && 'text-neutral-400'
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-error-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Element */}
          {hasLeftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <span className={cn(
                'text-neutral-400',
                isFocused && 'text-primary-500',
                error && 'text-error-500'
              )}>
                {leftElement}
              </span>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            className={cn(
              inputVariants[variant],
              inputSizes[size],
              {
                'pl-10': hasLeftElement,
                'pr-10': hasRightElement,
                'border-error-500 focus:border-error-500 focus:ring-error-500': error,
                'cursor-not-allowed opacity-50': disabled,
              },
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={error}
            aria-describedby={
              error && errorMessage 
                ? `${inputId}-error` 
                : helperText 
                ? `${inputId}-helper` 
                : undefined
            }
            {...props}
          />

          {/* Right Element */}
          {hasRightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'text-neutral-400 hover:text-neutral-600 focus:outline-none focus:text-primary-500',
                    'transition-colors duration-200'
                  )}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <span className={cn(
                  'text-neutral-400',
                  isFocused && 'text-primary-500',
                  error && 'text-error-500'
                )}>
                  {rightElement}
                </span>
              )}
            </div>
          )}

          {/* Validation Icons */}
          {(error || (props.value && !error)) && !isPassword && !rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {error ? (
                <AlertCircle className="h-4 w-4 text-error-500" />
              ) : (
                <Check className="h-4 w-4 text-success-500" />
              )}
            </div>
          )}
        </div>

        {/* Helper/Error Text */}
        {(errorMessage || helperText) && (
          <div className="mt-2">
            {error && errorMessage ? (
              <p 
                id={`${inputId}-error`}
                className="text-sm text-error-600 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {errorMessage}
              </p>
            ) : helperText ? (
              <p 
                id={`${inputId}-helper`}
                className="text-sm text-neutral-500"
              >
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea component for multi-line input
 */
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    size = 'md',
    error = false,
    errorMessage,
    helperText,
    label,
    required = false,
    disabled = false,
    resize = 'vertical',
    id,
    ...props
  }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    const textareaSizes = {
      sm: 'min-h-[80px] px-3 py-2 text-sm',
      md: 'min-h-[100px] px-3 py-2 text-sm',
      lg: 'min-h-[120px] px-4 py-3 text-base',
    };

    const resizeClasses = {
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x',
      vertical: 'resize-y',
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              error ? 'text-error-700' : 'text-neutral-700',
              disabled && 'text-neutral-400'
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-error-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'input-base',
            textareaSizes[size],
            resizeClasses[resize],
            {
              'border-error-500 focus:border-error-500 focus:ring-error-500': error,
              'cursor-not-allowed opacity-50': disabled,
            },
            className
          )}
          aria-invalid={error}
          aria-describedby={
            error && errorMessage 
              ? `${inputId}-error` 
              : helperText 
              ? `${inputId}-helper` 
              : undefined
          }
          {...props}
        />

        {/* Helper/Error Text */}
        {(errorMessage || helperText) && (
          <div className="mt-2">
            {error && errorMessage ? (
              <p 
                id={`${inputId}-error`}
                className="text-sm text-error-600 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {errorMessage}
              </p>
            ) : helperText ? (
              <p 
                id={`${inputId}-helper`}
                className="text-sm text-neutral-500"
              >
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * Search Input component with built-in search functionality
 */
interface SearchInputProps extends Omit<InputProps, 'type' | 'leftElement'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    onSearch,
    onClear,
    debounceMs = 300,
    placeholder = 'Search...',
    ...props
  }, ref) => {
    const [searchValue, setSearchValue] = useState('');
    
    // Debounce search
    React.useEffect(() => {
      if (onSearch) {
        const timeoutId = setTimeout(() => {
          onSearch(searchValue);
        }, debounceMs);
        
        return () => clearTimeout(timeoutId);
      }
    }, [searchValue, onSearch, debounceMs]);

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        leftElement={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightElement={
          searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                onClear?.();
              }}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export type { InputProps };