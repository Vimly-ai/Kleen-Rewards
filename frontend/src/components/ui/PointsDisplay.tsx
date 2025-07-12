/**
 * Points Display Component - Enterprise Employee Rewards System
 * 
 * A sophisticated points display component with animations,
 * level progression, and premium styling for gamification.
 */

import React, { forwardRef, useEffect, useState } from 'react';
import { 
  TrendingUp, TrendingDown, Award, Star, Target, 
  Coins, Gift, Clock, Trophy 
} from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Badge } from './Badge';
import { cn, formatNumber } from './utils';
import type { PointsDisplayProps } from './types';

/**
 * Premium Points Display component with sophisticated styling
 */
export const PointsDisplay = forwardRef<HTMLDivElement, PointsDisplayProps>(
  ({
    points,
    showBreakdown = false,
    animated = true,
    size = 'md',
    className,
    ...props
  }, ref) => {
    const [displayPoints, setDisplayPoints] = useState(animated ? 0 : points.total);
    
    // Animate points counting up
    useEffect(() => {
      if (!animated) {
        setDisplayPoints(points.total);
        return;
      }

      const duration = 1000; // 1 second
      const steps = 60; // 60fps
      const increment = (points.total - displayPoints) / steps;
      const stepTime = duration / steps;

      if (Math.abs(points.total - displayPoints) < 1) {
        setDisplayPoints(points.total);
        return;
      }

      const timer = setTimeout(() => {
        setDisplayPoints(prev => {
          const next = prev + increment;
          return Math.abs(next - points.total) < Math.abs(increment) ? points.total : next;
        });
      }, stepTime);

      return () => clearTimeout(timer);
    }, [points.total, displayPoints, animated]);

    const sizeConfig = {
      sm: {
        container: 'p-4',
        title: 'text-lg',
        value: 'text-2xl',
        breakdown: 'text-sm',
        icon: 'h-5 w-5',
      },
      md: {
        container: 'p-6',
        title: 'text-xl',
        value: 'text-3xl',
        breakdown: 'text-base',
        icon: 'h-6 w-6',
      },
      lg: {
        container: 'p-8',
        title: 'text-2xl',
        value: 'text-4xl',
        breakdown: 'text-lg',
        icon: 'h-8 w-8',
      },
    };

    const config = sizeConfig[size];

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <Card variant="premium" className={cn('text-center', config.container)}>
          {/* Main Points Display */}
          <div className="space-y-4">
            {/* Icon and Title */}
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-secondary-100 rounded-full">
                <Coins className={cn('text-secondary-600', config.icon)} />
              </div>
              <h3 className={cn('font-bold text-foreground', config.title)}>
                Your Points
              </h3>
            </div>

            {/* Main Points Value */}
            <div className="space-y-2">
              <div className={cn('font-black text-gradient', config.value)}>
                {formatNumber(Math.floor(displayPoints), { notation: 'compact' })}
              </div>
              
              {/* Available vs Total indicator */}
              {points.available !== points.total && (
                <div className="text-sm text-muted-foreground">
                  {formatNumber(points.available)} available of {formatNumber(points.total)} total
                </div>
              )}
            </div>

            {/* Level Progress */}
            {points.level && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" size="sm">
                    Level {points.level.current}
                  </Badge>
                  
                  {points.rank && (
                    <Badge variant="primary" size="sm">
                      Rank #{points.rank}
                    </Badge>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress to Level {points.level.current + 1}</span>
                    <span>
                      {formatNumber(points.level.nextLevelPoints - points.total)} more needed
                    </span>
                  </div>
                  
                  <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.min(100, (points.level.progress * 100))}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Breakdown */}
        {showBreakdown && (
          <Card variant="outlined" className="mt-4">
            <CardHeader title="Points Breakdown" />
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className={cn('font-medium', config.breakdown)}>
                      Earned
                    </span>
                  </div>
                  <div className={cn('font-bold text-foreground', config.value)}>
                    {formatNumber(points.earned)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary-600">
                    <Gift className="h-4 w-4" />
                    <span className={cn('font-medium', config.breakdown)}>
                      Spent
                    </span>
                  </div>
                  <div className={cn('font-bold text-foreground', config.value)}>
                    {formatNumber(points.spent)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

PointsDisplay.displayName = 'PointsDisplay';

/**
 * Compact Points Display for headers and small spaces
 */
interface CompactPointsDisplayProps {
  points: number;
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export const CompactPointsDisplay: React.FC<CompactPointsDisplayProps> = ({
  points,
  showIcon = true,
  animated = true,
  className,
}) => {
  const [displayPoints, setDisplayPoints] = useState(animated ? 0 : points);
  
  useEffect(() => {
    if (!animated) {
      setDisplayPoints(points);
      return;
    }

    const duration = 500;
    const steps = 30;
    const increment = (points - displayPoints) / steps;
    const stepTime = duration / steps;

    if (Math.abs(points - displayPoints) < 1) {
      setDisplayPoints(points);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayPoints(prev => {
        const next = prev + increment;
        return Math.abs(next - points) < Math.abs(increment) ? points : next;
      });
    }, stepTime);

    return () => clearTimeout(timer);
  }, [points, displayPoints, animated]);

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-2 bg-secondary-50 rounded-lg border border-secondary-200',
      className
    )}>
      {showIcon && (
        <Coins className="h-4 w-4 text-secondary-600" />
      )}
      <span className="font-bold text-secondary-700">
        {formatNumber(Math.floor(displayPoints), { notation: 'compact' })}
      </span>
      <span className="text-xs text-secondary-600 font-medium">
        points
      </span>
    </div>
  );
};

/**
 * Points Change Animation Component
 */
interface PointsChangeProps {
  change: number;
  reason?: string;
  onAnimationComplete?: () => void;
  className?: string;
}

export const PointsChange: React.FC<PointsChangeProps> = ({
  change,
  reason,
  onAnimationComplete,
  className,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onAnimationComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!visible || change === 0) return null;

  const isPositive = change > 0;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-tooltip',
      'animate-slide-up',
      className
    )}>
      <Card variant="elevated" className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-full',
              isPositive ? 'bg-success-100' : 'bg-error-100'
            )}>
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-success-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-error-600" />
              )}
            </div>
            
            <div>
              <div className={cn(
                'font-bold text-lg',
                isPositive ? 'text-success-600' : 'text-error-600'
              )}>
                {isPositive ? '+' : ''}{formatNumber(change)}
              </div>
              
              {reason && (
                <div className="text-sm text-muted-foreground">
                  {reason}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Points Leaderboard Entry
 */
interface LeaderboardEntryProps {
  rank: number;
  name: string;
  points: number;
  avatar?: string;
  isCurrentUser?: boolean;
  trend?: 'up' | 'down' | 'same';
  className?: string;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  rank,
  name,
  points,
  avatar,
  isCurrentUser = false,
  trend,
  className,
}) => {
  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getTrendIcon = () => {
    if (!trend || trend === 'same') return null;
    
    return trend === 'up' ? (
      <TrendingUp className="h-3 w-3 text-success-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-error-500" />
    );
  };

  return (
    <div className={cn(
      'flex items-center justify-between p-4 rounded-lg transition-colors',
      isCurrentUser ? 'bg-primary-50 border border-primary-200' : 'hover:bg-neutral-50',
      className
    )}>
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className="w-8 flex justify-center">
          {getRankIcon()}
        </div>

        {/* Avatar */}
        {avatar ? (
          <img 
            src={avatar} 
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-xs font-medium text-neutral-600">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Name */}
        <div>
          <div className={cn(
            'font-medium',
            isCurrentUser ? 'text-primary-700' : 'text-foreground'
          )}>
            {name}
            {isCurrentUser && (
              <Badge variant="primary" size="sm" className="ml-2">
                You
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Points and Trend */}
      <div className="flex items-center gap-2">
        {getTrendIcon()}
        <span className="font-bold text-foreground">
          {formatNumber(points, { notation: 'compact' })}
        </span>
      </div>
    </div>
  );
};

export type { PointsDisplayProps };