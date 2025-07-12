/**
 * Badge Component - Enterprise Employee Rewards System
 * 
 * A premium badge component for status indicators, labels,
 * and achievement displays with professional styling.
 */

import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from './utils';
import type { BadgeProps } from './types';

const badgeVariants = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  ghost: 'bg-transparent text-neutral-600 border border-neutral-300',
  outline: 'bg-transparent border-2 border-current',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
  xl: 'px-4 py-1.5 text-sm',
};

/**
 * Premium Badge component with enterprise-grade styling
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    rounded = false,
    dot = false,
    count,
    max = 99,
    children,
    ...props
  }, ref) => {
    // Handle count display
    const displayCount = count !== undefined 
      ? count > max 
        ? `${max}+` 
        : count.toString()
      : undefined;

    // Don't render if count is 0 or undefined for count badges
    if (count !== undefined && count <= 0) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'badge inline-flex items-center justify-center font-medium',
          badgeVariants[variant],
          badgeSizes[size],
          
          // Conditional styles
          {
            'rounded-full': rounded || dot,
            'rounded-md': !rounded && !dot,
            'h-2 w-2 p-0 text-[0px]': dot,
            'min-w-[1.25rem] h-5': count !== undefined && size === 'sm',
            'min-w-[1.5rem] h-6': count !== undefined && size === 'md',
            'min-w-[1.75rem] h-7': count !== undefined && size === 'lg',
            'min-w-[2rem] h-8': count !== undefined && size === 'xl',
          },
          
          className
        )}
        {...props}
      >
        {dot ? null : displayCount || children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * Removable Badge component with close button
 */
interface RemovableBadgeProps extends Omit<BadgeProps, 'children'> {
  children: React.ReactNode;
  onRemove?: () => void;
  removeAriaLabel?: string;
}

export const RemovableBadge = forwardRef<HTMLSpanElement, RemovableBadgeProps>(
  ({
    className,
    onRemove,
    removeAriaLabel = 'Remove',
    children,
    ...props
  }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn('pr-1 gap-1', className)}
        {...props}
      >
        <span>{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current"
            aria-label={removeAriaLabel}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </Badge>
    );
  }
);

RemovableBadge.displayName = 'RemovableBadge';

/**
 * Status Badge component for specific status types
 */
interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  status: 'online' | 'offline' | 'busy' | 'away' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  showText?: boolean;
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({
    status,
    showText = true,
    dot = !showText,
    ...props
  }, ref) => {
    const statusConfig = {
      online: { variant: 'success' as const, text: 'Online' },
      offline: { variant: 'ghost' as const, text: 'Offline' },
      busy: { variant: 'error' as const, text: 'Busy' },
      away: { variant: 'warning' as const, text: 'Away' },
      active: { variant: 'success' as const, text: 'Active' },
      inactive: { variant: 'ghost' as const, text: 'Inactive' },
      pending: { variant: 'warning' as const, text: 'Pending' },
      approved: { variant: 'success' as const, text: 'Approved' },
      rejected: { variant: 'error' as const, text: 'Rejected' },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        dot={dot}
        {...props}
      >
        {showText && config.text}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

/**
 * Achievement Badge component for gamification
 */
interface AchievementBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  achievement: {
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    icon?: React.ReactNode;
  };
  earned?: boolean;
  progress?: number; // 0-100
}

export const AchievementBadge = forwardRef<HTMLSpanElement, AchievementBadgeProps>(
  ({
    achievement,
    earned = false,
    progress,
    className,
    ...props
  }, ref) => {
    const rarityConfig = {
      common: { 
        variant: 'ghost' as const, 
        classes: 'border-neutral-300 text-neutral-600',
        bg: 'bg-neutral-50'
      },
      rare: { 
        variant: 'primary' as const, 
        classes: 'border-blue-300 text-blue-600',
        bg: 'bg-blue-50'
      },
      epic: { 
        variant: 'secondary' as const, 
        classes: 'border-purple-300 text-purple-600',
        bg: 'bg-purple-50'
      },
      legendary: { 
        variant: 'warning' as const, 
        classes: 'border-amber-300 text-amber-600 shadow-achievement',
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50'
      },
    };

    const config = rarityConfig[achievement.rarity];

    return (
      <div className="relative">
        <Badge
          ref={ref}
          className={cn(
            'gap-1.5 py-1 px-2.5 border-2 transition-all duration-300',
            config.classes,
            config.bg,
            {
              'opacity-50 grayscale': !earned,
              'animate-glow': earned && achievement.rarity === 'legendary',
            },
            className
          )}
          {...props}
        >
          {achievement.icon && (
            <span className="flex-shrink-0">
              {achievement.icon}
            </span>
          )}
          <span className="font-semibold">
            {achievement.name}
          </span>
        </Badge>

        {/* Progress indicator for partially earned achievements */}
        {progress !== undefined && progress < 100 && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);

AchievementBadge.displayName = 'AchievementBadge';

/**
 * Notification Badge component for counts and indicators
 */
interface NotificationBadgeProps {
  children: React.ReactNode;
  count?: number;
  max?: number;
  dot?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  children,
  count,
  max = 99,
  dot = false,
  position = 'top-right',
  offset = 0,
  variant = 'error',
  className,
}) => {
  const positionClasses = {
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  };

  // Don't render badge if count is 0 or undefined
  if (!dot && (count === undefined || count <= 0)) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      <Badge
        variant={variant}
        count={dot ? undefined : count}
        max={max}
        dot={dot}
        rounded
        className={cn(
          'absolute z-10 border-2 border-white',
          positionClasses[position]
        )}
        style={{
          transform: `${positionClasses[position].split(' ')[2]} ${positionClasses[position].split(' ')[3]} translate(${offset}px, ${offset}px)`
        }}
      />
    </div>
  );
};

export type { BadgeProps };