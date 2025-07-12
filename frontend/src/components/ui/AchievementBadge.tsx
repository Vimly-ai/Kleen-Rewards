/**
 * Achievement Badge Component - Enterprise Employee Rewards System
 * 
 * A sophisticated achievement badge component with rarity-based styling,
 * progress tracking, and premium animations for gamification.
 */

import React, { forwardRef, useState } from 'react';
import { 
  Trophy, Medal, Star, Crown, Gem, Target, Lock, 
  TrendingUp, Calendar, Users, Award, CheckCircle2 
} from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { cn, formatRelativeTime } from './utils';
import type { AchievementBadgeProps } from './types';

const rarityConfig = {
  common: {
    gradient: 'from-gray-100 to-gray-200',
    border: 'border-gray-300',
    text: 'text-gray-700',
    icon: Medal,
    glow: 'shadow-md',
    particles: false,
  },
  rare: {
    gradient: 'from-blue-100 to-blue-200',
    border: 'border-blue-400',
    text: 'text-blue-700',
    icon: Star,
    glow: 'shadow-lg shadow-blue-200',
    particles: false,
  },
  epic: {
    gradient: 'from-purple-100 to-purple-200',
    border: 'border-purple-400',
    text: 'text-purple-700',
    icon: Trophy,
    glow: 'shadow-xl shadow-purple-300',
    particles: true,
  },
  legendary: {
    gradient: 'from-yellow-100 via-orange-100 to-red-100',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    icon: Crown,
    glow: 'shadow-achievement',
    particles: true,
  },
};

const categoryIcons = {
  performance: TrendingUp,
  attendance: Calendar,
  teamwork: Users,
  milestone: Target,
  special: Award,
  anniversary: Gem,
};

/**
 * Premium Achievement Badge component with sophisticated styling
 */
export const AchievementBadge = forwardRef<HTMLDivElement, AchievementBadgeProps>(
  ({
    achievement,
    size = 'md',
    showProgress = true,
    interactive = true,
    onClick,
    className,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const config = rarityConfig[achievement.rarity];
    const IconComponent = config.icon;
    const CategoryIcon = categoryIcons[achievement.category as keyof typeof categoryIcons] || Award;
    
    const isUnlocked = !!achievement.unlockedAt;
    const hasProgress = achievement.progress && achievement.progress.total > 0;
    const progressPercentage = hasProgress 
      ? Math.round((achievement.progress!.current / achievement.progress!.total) * 100)
      : 0;

    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-20 h-20',
      lg: 'w-24 h-24',
      xl: 'w-32 h-32',
    };

    const iconSizes = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
      xl: 'h-12 w-12',
    };

    const handleClick = () => {
      if (interactive && onClick) {
        onClick(achievement);
      }
    };

    return (
      <div 
        ref={ref}
        className={cn('relative group', className)}
        {...props}
      >
        {/* Particle effects for epic/legendary */}
        {config.particles && isUnlocked && (
          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-1 h-1 rounded-full animate-ping',
                  achievement.rarity === 'legendary' ? 'bg-yellow-400' : 'bg-purple-400'
                )}
                style={{
                  left: `${20 + Math.cos(i * 45 * Math.PI / 180) * 30}%`,
                  top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 30}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        )}

        {/* Main badge */}
        <div
          className={cn(
            'relative rounded-full border-4 transition-all duration-300 cursor-pointer',
            sizeClasses[size],
            config.border,
            config.glow,
            {
              'opacity-40 grayscale': !isUnlocked && !achievement.isSecret,
              'scale-110': isHovered && interactive,
              'animate-glow': isUnlocked && achievement.rarity === 'legendary',
            }
          )}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background gradient */}
          <div className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-br',
            config.gradient
          )} />

          {/* Secret achievement overlay */}
          {achievement.isSecret && !isUnlocked && (
            <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
              <Lock className={cn(iconSizes[size], 'text-white')} />
            </div>
          )}

          {/* Achievement icon */}
          {(!achievement.isSecret || isUnlocked) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {achievement.icon ? (
                <span className={cn(iconSizes[size], config.text)}>
                  {achievement.icon}
                </span>
              ) : (
                <IconComponent className={cn(iconSizes[size], config.text)} />
              )}
            </div>
          )}

          {/* Rarity indicator */}
          <div className="absolute -top-1 -right-1">
            <Badge
              variant="ghost"
              size="sm"
              className={cn(
                'text-xs font-bold border-2',
                config.border,
                config.text,
                'bg-white'
              )}
            >
              {achievement.rarity.charAt(0).toUpperCase()}
            </Badge>
          </div>

          {/* Completion indicator */}
          {isUnlocked && (
            <div className="absolute -bottom-1 -right-1">
              <div className="bg-success-500 rounded-full p-1">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Progress ring for partially completed achievements */}
        {hasProgress && showProgress && !isUnlocked && (
          <div className="absolute inset-0">
            <svg className={cn('transform -rotate-90', sizeClasses[size])}>
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-neutral-200"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                className={config.text}
                style={{
                  transition: 'stroke-dashoffset 0.5s ease-in-out',
                }}
              />
            </svg>
            
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                'text-xs font-bold',
                size === 'sm' ? 'text-[8px]' : 'text-xs',
                config.text
              )}>
                {progressPercentage}%
              </span>
            </div>
          </div>
        )}

        {/* Hover tooltip */}
        {interactive && (
          <div className={cn(
            'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100',
            'transition-opacity duration-200 pointer-events-none z-10'
          )}>
            <div className="bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              <div className="font-semibold">{achievement.title}</div>
              <div className="text-neutral-300">{achievement.description}</div>
              
              {hasProgress && !isUnlocked && (
                <div className="text-neutral-400 mt-1">
                  Progress: {achievement.progress!.current} / {achievement.progress!.total}
                </div>
              )}
              
              {isUnlocked && achievement.unlockedAt && (
                <div className="text-success-400 mt-1">
                  Unlocked {formatRelativeTime(new Date(achievement.unlockedAt))}
                </div>
              )}
              
              {achievement.isSecret && !isUnlocked && (
                <div className="text-yellow-400 mt-1">Secret Achievement</div>
              )}
              
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

AchievementBadge.displayName = 'AchievementBadge';

/**
 * Achievement Grid for displaying multiple achievements
 */
interface AchievementGridProps {
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon?: React.ReactNode;
    category: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    progress?: { current: number; total: number };
    unlockedAt?: Date;
    isSecret?: boolean;
  }>;
  columns?: 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgress?: boolean;
  onAchievementClick?: (achievement: any) => void;
  className?: string;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  columns = 4,
  size = 'md',
  showProgress = true,
  onAchievementClick,
  className,
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  return (
    <div className={cn(
      'grid gap-4',
      gridCols[columns],
      className
    )}>
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex flex-col items-center gap-3">
          <AchievementBadge
            achievement={achievement}
            size={size}
            showProgress={showProgress}
            onClick={onAchievementClick}
          />
          
          {/* Achievement name */}
          <div className="text-center">
            <h4 className="text-sm font-medium text-foreground line-clamp-2">
              {achievement.isSecret && !achievement.unlockedAt 
                ? '???'
                : achievement.title
              }
            </h4>
            
            <Badge variant="outline" size="sm" className="mt-1">
              {achievement.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Achievement Showcase for featuring a single achievement
 */
interface AchievementShowcaseProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon?: React.ReactNode;
    category: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    progress?: { current: number; total: number };
    unlockedAt?: Date;
    isSecret?: boolean;
  };
  showDetails?: boolean;
  className?: string;
}

export const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  achievement,
  showDetails = true,
  className,
}) => {
  const config = rarityConfig[achievement.rarity];
  
  return (
    <Card
      variant="premium"
      className={cn(
        'text-center relative overflow-hidden',
        config.glow,
        className
      )}
    >
      {/* Background effect */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-10',
        config.gradient
      )} />
      
      <div className="relative z-10 space-y-6">
        {/* Achievement badge */}
        <div className="flex justify-center">
          <AchievementBadge
            achievement={achievement}
            size="xl"
            interactive={false}
          />
        </div>
        
        {showDetails && (
          <>
            {/* Title and description */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {achievement.isSecret && !achievement.unlockedAt 
                  ? 'Secret Achievement'
                  : achievement.title
                }
              </h2>
              
              <p className="text-muted-foreground mt-2">
                {achievement.isSecret && !achievement.unlockedAt
                  ? 'Keep exploring to unlock this mystery!'
                  : achievement.description
                }
              </p>
            </div>

            {/* Metadata */}
            <div className="flex justify-center gap-4">
              <Badge variant="outline">
                {achievement.category}
              </Badge>
              
              <Badge 
                variant={achievement.rarity === 'legendary' ? 'secondary' : 'primary'}
                className={cn({
                  'animate-glow': achievement.rarity === 'legendary',
                })}
              >
                {achievement.rarity} rarity
              </Badge>
            </div>

            {/* Unlock status */}
            {achievement.unlockedAt ? (
              <div className="text-success-600 font-medium">
                ✨ Unlocked {formatRelativeTime(new Date(achievement.unlockedAt))}
              </div>
            ) : achievement.progress ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Progress: {achievement.progress.current} / {achievement.progress.total}
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={cn(
                      'h-2 rounded-full transition-all duration-500',
                      'bg-gradient-to-r from-primary-500 to-secondary-500'
                    )}
                    style={{ 
                      width: `${(achievement.progress.current / achievement.progress.total) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">
                Requirements unknown
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export type { AchievementBadgeProps };