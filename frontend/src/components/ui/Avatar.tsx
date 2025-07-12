/**
 * Avatar Component - Enterprise Employee Rewards System
 * 
 * A premium avatar component with status indicators,
 * fallback initials, and badge support.
 */

import React, { forwardRef, useState } from 'react';
import { User } from 'lucide-react';
import { Badge } from './Badge';
import { cn, getInitials, getColorFromString } from './utils';
import type { AvatarProps } from './types';

/**
 * Premium Avatar component with enterprise-grade styling
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    src,
    alt,
    size = 'md',
    name,
    loading = false,
    badge,
    className,
    ...props
  }, ref) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Size configurations
    const sizeConfigs = {
      sm: {
        container: 'h-8 w-8',
        text: 'text-xs',
        icon: 'h-4 w-4',
      },
      md: {
        container: 'h-10 w-10',
        text: 'text-sm',
        icon: 'h-5 w-5',
      },
      lg: {
        container: 'h-12 w-12',
        text: 'text-base',
        icon: 'h-6 w-6',
      },
      xl: {
        container: 'h-16 w-16',
        text: 'text-lg',
        icon: 'h-8 w-8',
      },
    };
    
    const sizeConfig = typeof size === 'number' 
      ? {
          container: `h-[${size}px] w-[${size}px]`,
          text: 'text-sm',
          icon: 'h-5 w-5',
        }
      : sizeConfigs[size as keyof typeof sizeConfigs] || sizeConfigs.md;

    const showImage = src && !imageError && !loading;
    const showInitials = name && !showImage;
    const showIcon = !showImage && !showInitials;
    
    const initials = name ? getInitials(name) : '';
    const backgroundColor = name ? getColorFromString(name) : '#94a3b8';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden',
          'bg-neutral-200 text-neutral-600 font-medium select-none',
          sizeConfig.container,
          {
            'animate-pulse': loading,
          },
          className
        )}
        style={showInitials ? { backgroundColor, color: 'white' } : undefined}
        {...props}
      >
        {/* Image */}
        {src && (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-200',
              {
                'opacity-0': !imageLoaded || imageError,
                'opacity-100': imageLoaded && !imageError,
              }
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Initials */}
        {showInitials && (
          <span className={cn('font-semibold', sizeConfig.text)}>
            {initials}
          </span>
        )}

        {/* Default icon */}
        {showIcon && (
          <User className={cn('text-neutral-400', sizeConfig.icon)} />
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
        )}

        {/* Badge */}
        {badge && (
          <div className={cn(
            'absolute z-10',
            {
              'top-0 right-0 transform translate-x-1/2 -translate-y-1/2': badge.position === 'top-right',
              'top-0 left-0 transform -translate-x-1/2 -translate-y-1/2': badge.position === 'top-left',
              'bottom-0 right-0 transform translate-x-1/2 translate-y-1/2': badge.position === 'bottom-right',
              'bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2': badge.position === 'bottom-left',
            }
          )}>
            {typeof badge.content === 'string' || typeof badge.content === 'number' ? (
              <Badge
                variant={badge.variant || 'primary'}
                size="sm"
                className="border-2 border-white shadow-sm"
              >
                {badge.content}
              </Badge>
            ) : (
              badge.content
            )}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

/**
 * Avatar Group component for displaying multiple avatars
 */
interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md',
  spacing = 'normal',
  className,
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const extraCount = Math.max(0, childrenArray.length - max);

  const spacingClasses = {
    tight: '-space-x-1',
    normal: '-space-x-2',
    loose: '-space-x-1',
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={cn('flex items-center', spacingClasses[spacing], className)}>
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          className="relative ring-2 ring-white rounded-full"
          style={{ zIndex: max - index }}
        >
          {React.isValidElement(child) && child.type === Avatar
            ? React.cloneElement(child, { size } as any)
            : child
          }
        </div>
      ))}
      
      {extraCount > 0 && (
        <div
          className={cn(
            'relative ring-2 ring-white rounded-full',
            'bg-neutral-100 text-neutral-600 font-medium',
            'flex items-center justify-center',
            sizeClasses[size]
          )}
          style={{ zIndex: 0 }}
        >
          <span className="text-xs font-semibold">
            +{extraCount}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Avatar with status indicator
 */
interface AvatarWithStatusProps extends Omit<AvatarProps, 'badge'> {
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
}

export const AvatarWithStatus = forwardRef<HTMLDivElement, AvatarWithStatusProps>(
  ({
    status = 'offline',
    showStatus = true,
    ...props
  }, ref) => {
    const statusConfig = {
      online: { color: 'bg-success-500', label: 'Online' },
      offline: { color: 'bg-neutral-400', label: 'Offline' },
      busy: { color: 'bg-error-500', label: 'Busy' },
      away: { color: 'bg-warning-500', label: 'Away' },
    };

    const config = statusConfig[status];

    return (
      <Avatar
        ref={ref}
        badge={showStatus ? {
          content: (
            <div
              className={cn(
                'w-3 h-3 rounded-full border-2 border-white',
                config.color
              )}
              title={config.label}
              aria-label={config.label}
            />
          ),
          position: 'bottom-right',
        } : undefined}
        {...props}
      />
    );
  }
);

AvatarWithStatus.displayName = 'AvatarWithStatus';

/**
 * Notification Avatar with count badge
 */
interface NotificationAvatarProps extends Omit<AvatarProps, 'badge'> {
  count?: number;
  max?: number;
  showDot?: boolean;
}

export const NotificationAvatar = forwardRef<HTMLDivElement, NotificationAvatarProps>(
  ({
    count,
    max = 99,
    showDot = false,
    ...props
  }, ref) => {
    const hasNotification = (count && count > 0) || showDot;

    return (
      <Avatar
        ref={ref}
        badge={hasNotification ? {
          content: showDot ? (
            <div className="w-3 h-3 rounded-full bg-error-500 border-2 border-white" />
          ) : (
            <Badge
              variant="error"
              size="sm"
              className="border-2 border-white min-w-[1.25rem] h-5 text-xs"
            >
              {count! > max ? `${max}+` : count}
            </Badge>
          ),
          position: 'top-right',
        } : undefined}
        {...props}
      />
    );
  }
);

NotificationAvatar.displayName = 'NotificationAvatar';

/**
 * Editable Avatar with upload functionality
 */
interface EditableAvatarProps extends Omit<AvatarProps, 'badge'> {
  onImageChange?: (file: File) => void;
  uploading?: boolean;
  editable?: boolean;
}

export const EditableAvatar = forwardRef<HTMLDivElement, EditableAvatarProps>(
  ({
    onImageChange,
    uploading = false,
    editable = true,
    className,
    ...props
  }, ref) => {
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && onImageChange) {
        onImageChange(file);
      }
    };

    return (
      <div className="relative inline-block">
        <Avatar
          ref={ref}
          loading={uploading}
          className={cn(
            {
              'cursor-pointer hover:opacity-80 transition-opacity': editable,
            },
            className
          )}
          {...props}
        />
        
        {editable && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Change avatar image"
            />
            
            {/* Edit indicator */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-full">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </>
        )}
      </div>
    );
  }
);

EditableAvatar.displayName = 'EditableAvatar';

export type { AvatarProps };