/**
 * Card Component - Enterprise Employee Rewards System
 * 
 * A versatile, premium card component with multiple variants
 * and sophisticated styling for professional applications.
 */

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';
import type { CardProps } from './types';

const cardVariants = {
  default: 'bg-card border border-border shadow-sm',
  elevated: 'bg-card shadow-lg hover:shadow-xl transition-shadow duration-300',
  outlined: 'bg-card border-2 border-border',
  filled: 'bg-neutral-100 border-0',
  premium: 'bg-card shadow-premium border border-secondary-200/20 hover:shadow-achievement transition-all duration-300',
};

const cardPadding = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

/**
 * Premium Card component with enterprise-grade styling
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    clickable = false,
    loading = false,
    children,
    onClick,
    ...props
  }, ref) => {
    const isInteractive = clickable || !!onClick;

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative rounded-xl overflow-hidden',
          cardVariants[variant],
          cardPadding[padding],
          
          // Interactive styles
          {
            'card-hover cursor-pointer': hoverable && !loading,
            'cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 transition-colors duration-200': 
              isInteractive && !loading,
            'animate-pulse': loading,
          },
          
          className
        )}
        onClick={!loading ? onClick : undefined}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={isInteractive ? (e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick(e as any);
          }
        } : undefined}
        {...props}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
              <span className="text-sm font-medium text-neutral-600">Loading...</span>
            </div>
          </div>
        )}
        
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component for titles and actions
 */
interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
  divider?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({
    className,
    children,
    title,
    subtitle,
    action,
    avatar,
    divider = false,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between',
          { 'border-b border-border pb-4 mb-4': divider },
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {avatar && (
            <div className="flex-shrink-0">
              {avatar}
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-foreground leading-tight">
                {title}
              </h3>
            )}
            
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
            
            {children}
          </div>
        </div>
        
        {action && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Content component for main content area
 */
interface CardContentProps {
  className?: string;
  children?: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-foreground', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * Card Footer component for actions and additional info
 */
interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
  divider?: boolean;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({
    className,
    children,
    divider = false,
    justify = 'end',
    ...props
  }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3',
          justifyClasses[justify],
          { 'border-t border-border pt-4 mt-4': divider },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/**
 * Card Grid component for displaying multiple cards
 */
interface CardGridProps {
  className?: string;
  children?: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({
  className,
  children,
  columns = 3,
  gap = 'md',
  responsive = true,
}) => {
  const columnClasses = responsive ? {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
  } : {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Card Stack component for overlapping cards
 */
interface CardStackProps {
  className?: string;
  children?: React.ReactNode;
  offset?: 'sm' | 'md' | 'lg';
  direction?: 'horizontal' | 'vertical';
  maxVisible?: number;
}

export const CardStack: React.FC<CardStackProps> = ({
  className,
  children,
  offset = 'md',
  direction = 'vertical',
  maxVisible = 3,
}) => {
  const offsetClasses = {
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
  };

  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, maxVisible);
  const hiddenCount = Math.max(0, childrenArray.length - maxVisible);

  return (
    <div className={cn('relative', className)}>
      <div className={cn('flex', {
        'flex-col': direction === 'vertical',
        'flex-row': direction === 'horizontal',
      }, offsetClasses[offset])}>
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className={cn('relative', {
              'z-10': index === 0,
              'z-0': index > 0,
              'transform -translate-y-2': direction === 'vertical' && index > 0,
              'transform -translate-x-2': direction === 'horizontal' && index > 0,
            })}
            style={{
              zIndex: maxVisible - index,
            }}
          >
            {child}
          </div>
        ))}
      </div>
      
      {hiddenCount > 0 && (
        <div className="absolute bottom-0 right-0 bg-neutral-200 text-neutral-600 text-xs px-2 py-1 rounded-full">
          +{hiddenCount} more
        </div>
      )}
    </div>
  );
};

export type { CardProps };