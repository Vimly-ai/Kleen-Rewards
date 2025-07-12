/**
 * Reward Card Component - Enterprise Employee Rewards System
 * 
 * A premium reward card component with sophisticated styling,
 * animations, and interactive features for the rewards catalog.
 */

import React, { forwardRef, useState } from 'react';
import { Star, Clock, Users, ExternalLink, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { cn, formatNumber, formatRelativeTime } from './utils';
import type { RewardCardProps } from './types';

/**
 * Premium Reward Card component with enterprise-grade styling
 */
export const RewardCard = forwardRef<HTMLDivElement, RewardCardProps>(
  ({
    reward,
    userPoints = 0,
    onClaim,
    onViewDetails,
    showPopularity = true,
    compact = false,
    className,
    ...props
  }, ref) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const canAfford = userPoints >= reward.points;
    const isExpiringSoon = reward.expiresAt && 
      new Date(reward.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days
    
    const handleClaim = () => {
      if (canAfford && reward.available && onClaim) {
        onClaim(reward);
      }
    };

    const handleViewDetails = () => {
      if (onViewDetails) {
        onViewDetails(reward);
      }
    };

    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cn(
          'group overflow-hidden transition-all duration-300 hover:shadow-premium',
          {
            'opacity-60': !reward.available,
            'ring-2 ring-secondary-200': isExpiringSoon,
          },
          className
        )}
        clickable={!!onViewDetails}
        onClick={onViewDetails ? handleViewDetails : undefined}
        {...props}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          {reward.image ? (
            <div className="relative aspect-video bg-neutral-100">
              <img
                src={reward.image}
                alt={reward.title}
                className={cn(
                  'w-full h-full object-cover transition-all duration-300',
                  'group-hover:scale-105',
                  { 'opacity-0': !imageLoaded }
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
              )}
              
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                  <Gift className="h-12 w-12 text-neutral-400" />
                </div>
              )}
              
              {/* Overlay badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {!reward.available && (
                  <Badge variant="error" size="sm">
                    Unavailable
                  </Badge>
                )}
                
                {isExpiringSoon && (
                  <Badge variant="warning" size="sm" className="animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    Expires Soon
                  </Badge>
                )}
              </div>
              
              {/* Popularity indicator */}
              {showPopularity && reward.popularity && (
                <div className="absolute top-3 right-3">
                  <Badge variant="ghost" size="sm" className="bg-black/20 text-white backdrop-blur-sm">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {reward.popularity}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gradient-secondary flex items-center justify-center">
              <Gift className="h-16 w-16 text-white/80" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h3 className={cn(
                'font-semibold text-foreground line-clamp-2',
                compact ? 'text-base' : 'text-lg'
              )}>
                {reward.title}
              </h3>
              
              {reward.description && (
                <p className={cn(
                  'text-muted-foreground mt-2 line-clamp-3',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                  {reward.description}
                </p>
              )}
            </div>

            {/* Points and Category */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary-600">
                  {formatNumber(reward.points, { notation: 'compact' })}
                </span>
                <span className="text-sm text-muted-foreground">points</span>
              </div>
              
              <Badge variant="outline" size="sm">
                {reward.category}
              </Badge>
            </div>

            {/* Affordability indicator */}
            <div className="flex items-center gap-2 text-sm">
              {canAfford ? (
                <>
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  <span className="text-success-700 font-medium">
                    You can afford this
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-warning-500" />
                  <span className="text-warning-700">
                    Need {formatNumber(reward.points - userPoints)} more points
                  </span>
                </>
              )}
            </div>

            {/* Tags */}
            {reward.tags && reward.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {reward.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="ghost" size="sm">
                    {tag}
                  </Badge>
                ))}
                {reward.tags.length > 3 && (
                  <Badge variant="ghost" size="sm">
                    +{reward.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Expiration info */}
            {reward.expiresAt && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Expires {formatRelativeTime(new Date(reward.expiresAt))}
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer with actions */}
        <CardFooter className="px-6 pb-6 pt-0" justify="between">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            leftIcon={<ExternalLink className="h-4 w-4" />}
          >
            Details
          </Button>
          
          <Button
            variant={canAfford ? 'primary' : 'ghost'}
            size="sm"
            disabled={!canAfford || !reward.available}
            onClick={(e) => {
              e.stopPropagation();
              handleClaim();
            }}
            className={cn({
              'animate-glow': canAfford && reward.available,
            })}
          >
            {canAfford ? 'Claim Reward' : 'Insufficient Points'}
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

RewardCard.displayName = 'RewardCard';

/**
 * Compact Reward Card for lists and small spaces
 */
interface CompactRewardCardProps extends Omit<RewardCardProps, 'compact'> {
  horizontal?: boolean;
}

export const CompactRewardCard = forwardRef<HTMLDivElement, CompactRewardCardProps>(
  ({
    reward,
    userPoints = 0,
    onClaim,
    onViewDetails,
    horizontal = false,
    className,
    ...props
  }, ref) => {
    const canAfford = userPoints >= reward.points;

    return (
      <Card
        ref={ref}
        variant="outlined"
        padding="sm"
        className={cn(
          'hover:shadow-md transition-all duration-200',
          {
            'flex items-center gap-4': horizontal,
            'opacity-60': !reward.available,
          },
          className
        )}
        clickable={!!onViewDetails}
        onClick={onViewDetails}
        {...props}
      >
        {/* Image */}
        <div className={cn(
          'relative bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0',
          horizontal ? 'w-16 h-16' : 'aspect-square mb-3'
        )}>
          {reward.image ? (
            <img
              src={reward.image}
              alt={reward.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift className="h-6 w-6 text-neutral-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground line-clamp-1">
            {reward.title}
          </h4>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-bold text-primary-600">
              {formatNumber(reward.points, { notation: 'compact' })}
            </span>
            
            <Badge 
              variant={canAfford ? 'success' : 'ghost'} 
              size="sm"
            >
              {canAfford ? 'Affordable' : 'Need more'}
            </Badge>
          </div>
        </div>
      </Card>
    );
  }
);

CompactRewardCard.displayName = 'CompactRewardCard';

/**
 * Featured Reward Card for highlighting special rewards
 */
interface FeaturedRewardCardProps extends RewardCardProps {
  featured?: boolean;
  spotlight?: boolean;
}

export const FeaturedRewardCard = forwardRef<HTMLDivElement, FeaturedRewardCardProps>(
  ({
    featured = true,
    spotlight = false,
    className,
    ...props
  }, ref) => {
    return (
      <div className="relative">
        {/* Spotlight effect */}
        {spotlight && (
          <div className="absolute -inset-4 bg-gradient-animated opacity-20 blur-2xl rounded-3xl" />
        )}
        
        <RewardCard
          ref={ref}
          variant="premium"
          className={cn(
            'relative border-2 border-secondary-200',
            {
              'ring-4 ring-secondary-100 shadow-achievement': featured,
              'animate-glow': spotlight,
            },
            className
          )}
          {...props}
        />
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute -top-2 -right-2">
            <Badge 
              variant="secondary" 
              size="sm" 
              className="shadow-lg animate-bounce-in"
            >
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
      </div>
    );
  }
);

FeaturedRewardCard.displayName = 'FeaturedRewardCard';

export type { RewardCardProps };