/**
 * Admin Card Component - Enterprise Employee Rewards System
 * 
 * Sophisticated admin dashboard cards with elevated styling,
 * advanced data visualization, and authority-conveying design.
 */

import React, { forwardRef } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, MoreVertical, 
  ExternalLink, Settings, Eye, Download, RefreshCw,
  AlertTriangle, CheckCircle, Info, Users
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Button, IconButton } from './Button';
import { cn, formatNumber } from './utils';

interface AdminCardProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  value?: string | number;
  previousValue?: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
    label?: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  loading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  elevation?: 'low' | 'medium' | 'high';
}

/**
 * Premium Admin Card component with authority-conveying design
 */
export const AdminCard = forwardRef<HTMLDivElement, AdminCardProps>(
  ({
    className,
    children,
    title,
    subtitle,
    value,
    previousValue,
    trend,
    status,
    icon,
    actions = [],
    loading = false,
    lastUpdated,
    onRefresh,
    elevation = 'medium',
    ...props
  }, ref) => {
    const elevationVariants = {
      low: 'elevated',
      medium: 'elevated',
      high: 'premium',
    } as const;

    const statusConfig = {
      success: {
        badge: 'success' as const,
        accent: 'border-l-4 border-success-500',
      },
      warning: {
        badge: 'warning' as const,
        accent: 'border-l-4 border-warning-500',
      },
      error: {
        badge: 'error' as const,
        accent: 'border-l-4 border-error-500',
      },
      info: {
        badge: 'primary' as const,
        accent: 'border-l-4 border-primary-500',
      },
    };

    const getTrendIcon = () => {
      if (!trend) return null;
      
      switch (trend.direction) {
        case 'up':
          return <TrendingUp className="h-4 w-4 text-success-500" />;
        case 'down':
          return <TrendingDown className="h-4 w-4 text-error-500" />;
        case 'neutral':
          return <Minus className="h-4 w-4 text-neutral-500" />;
        default:
          return null;
      }
    };

    const getTrendColor = () => {
      if (!trend) return 'text-neutral-500';
      
      switch (trend.direction) {
        case 'up':
          return 'text-success-600';
        case 'down':
          return 'text-error-600';
        case 'neutral':
          return 'text-neutral-600';
        default:
          return 'text-neutral-500';
      }
    };

    return (
      <Card
        ref={ref}
        variant={elevationVariants[elevation]}
        loading={loading}
        className={cn(
          'relative transition-all duration-300',
          status && statusConfig[status].accent,
          {
            'hover:shadow-lg transform hover:-translate-y-1': elevation === 'high',
          },
          className
        )}
        {...props}
      >
        {/* Header */}
        <CardHeader divider={!!children}>
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* Icon */}
              {icon && (
                <div className="flex-shrink-0 p-2 bg-primary-50 rounded-lg">
                  <div className="text-primary-600">
                    {icon}
                  </div>
                </div>
              )}
              
              {/* Title and subtitle */}
              <div className="min-w-0 flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    {title}
                  </h3>
                )}
                
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Status and actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {status && (
                <Badge variant={statusConfig[status].badge} size="sm">
                  {status}
                </Badge>
              )}
              
              {onRefresh && (
                <IconButton
                  icon={<RefreshCw className="h-4 w-4" />}
                  size="sm"
                  variant="ghost"
                  onClick={onRefresh}
                  aria-label="Refresh data"
                />
              )}
              
              {actions.length > 0 && (
                <div className="relative">
                  <IconButton
                    icon={<MoreVertical className="h-4 w-4" />}
                    size="sm"
                    variant="ghost"
                    aria-label="More actions"
                  />
                  {/* TODO: Implement dropdown menu */}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Main value display */}
        {value !== undefined && (
          <CardContent>
            <div className="space-y-4">
              {/* Primary value */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {typeof value === 'number' 
                    ? formatNumber(value, { notation: 'compact' })
                    : value
                  }
                </span>
                
                {/* Trend indicator */}
                {trend && (
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    getTrendColor()
                  )}>
                    {getTrendIcon()}
                    <span>
                      {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
                    </span>
                    {trend.label && (
                      <span className="text-xs text-muted-foreground">
                        {trend.label}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Previous value comparison */}
              {previousValue !== undefined && (
                <div className="text-sm text-muted-foreground">
                  Previous: {typeof previousValue === 'number' 
                    ? formatNumber(previousValue, { notation: 'compact' })
                    : previousValue
                  }
                </div>
              )}
            </div>
          </CardContent>
        )}

        {/* Custom content */}
        {children && (
          <CardContent>
            {children}
          </CardContent>
        )}

        {/* Footer with metadata and actions */}
        {(actions.length > 0 || lastUpdated) && (
          <CardFooter divider justify="between">
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={action.onClick}
                  leftIcon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }
);

AdminCard.displayName = 'AdminCard';

/**
 * Metric Card for displaying KPIs and statistics
 */
interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  target?: number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
    period?: string;
  };
  status?: 'on-track' | 'behind' | 'ahead';
  format?: 'number' | 'currency' | 'percentage';
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  target,
  trend,
  status,
  format = 'number',
  icon,
  className,
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatNumber(val, { style: 'currency' });
      case 'percentage':
        return `${val}%`;
      default:
        return formatNumber(val, { notation: 'compact' });
    }
  };

  const statusConfig = {
    'on-track': { color: 'text-success-600', bg: 'bg-success-50' },
    'behind': { color: 'text-error-600', bg: 'bg-error-50' },
    'ahead': { color: 'text-primary-600', bg: 'bg-primary-50' },
  };

  const targetPercentage = target ? Math.round((value / target) * 100) : 0;

  return (
    <AdminCard
      title={title}
      value={formatValue(value)}
      trend={trend}
      icon={icon}
      className={className}
    >
      <div className="space-y-3">
        {/* Unit */}
        {unit && (
          <div className="text-sm text-muted-foreground">
            {unit}
          </div>
        )}

        {/* Target progress */}
        {target && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Progress</span>
              <span className={cn(
                'font-medium',
                status && statusConfig[status].color
              )}>
                {targetPercentage}%
              </span>
            </div>
            
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  targetPercentage >= 100 ? 'bg-success-500' :
                  targetPercentage >= 75 ? 'bg-primary-500' :
                  targetPercentage >= 50 ? 'bg-warning-500' : 'bg-error-500'
                )}
                style={{ width: `${Math.min(100, targetPercentage)}%` }}
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              Target: {formatValue(target)}
            </div>
          </div>
        )}

        {/* Status indicator */}
        {status && (
          <Badge 
            variant={
              status === 'on-track' ? 'success' :
              status === 'ahead' ? 'primary' : 'error'
            }
            size="sm"
          >
            {status.replace('-', ' ')}
          </Badge>
        )}
      </div>
    </AdminCard>
  );
};

/**
 * Alert Card for important notifications and warnings
 */
interface AlertCardProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  type,
  title,
  message,
  actions = [],
  dismissible = false,
  onDismiss,
  className,
}) => {
  const alertConfig = {
    info: {
      icon: Info,
      variant: 'info' as const,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    warning: {
      icon: AlertTriangle,
      variant: 'warning' as const,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
    error: {
      icon: AlertTriangle,
      variant: 'error' as const,
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    success: {
      icon: CheckCircle,
      variant: 'success' as const,
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
  };

  const config = alertConfig[type];
  const IconComponent = config.icon;

  return (
    <AdminCard
      status={config.variant}
      icon={<IconComponent className="h-5 w-5" />}
      title={title}
      className={cn(
        config.bg,
        config.border,
        'border',
        className
      )}
      actions={[
        ...actions,
        ...(dismissible ? [{
          label: 'Dismiss',
          onClick: onDismiss || (() => {}),
          variant: 'ghost' as const,
        }] : [])
      ]}
    >
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </AdminCard>
  );
};

/**
 * Quick Action Card for common admin tasks
 */
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  badge,
  className,
}) => {
  return (
    <Card
      variant="outlined"
      hoverable
      clickable
      onClick={onClick}
      className={cn(
        'cursor-pointer group hover:border-primary-300 hover:shadow-md',
        'transition-all duration-200',
        className
      )}
    >
      <CardContent className="text-center space-y-4">
        {/* Icon */}
        <div className="mx-auto w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-100 transition-colors">
          <div className="text-primary-600">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Badge */}
        {badge && (
          <Badge variant={badge.variant || 'primary'} size="sm">
            {badge.text}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export type { AdminCardProps };