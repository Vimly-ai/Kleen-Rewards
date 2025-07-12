/**
 * Design System Demo - Enterprise Employee Rewards System
 * 
 * A comprehensive showcase of all design system components
 * for testing and demonstration purposes.
 */

import React, { useState } from 'react';
import { 
  Star, Gift, Users, TrendingUp, Settings, Coffee, 
  Trophy, Medal, Crown, Target, Plus, Download,
  Bell, Search, Filter, ExternalLink, Calendar
} from 'lucide-react';

// Component imports
import { Button, IconButton, ButtonGroup } from './Button';
import { Input, Textarea, SearchInput } from './Input';
import { Card, CardHeader, CardContent, CardFooter, CardGrid } from './Card';
import { Badge, StatusBadge, AchievementBadge as AchievementBadgeComponent, NotificationBadge } from './Badge';
import { Avatar, AvatarGroup, AvatarWithStatus, NotificationAvatar } from './Avatar';
import { Modal, ConfirmModal } from './Modal';
import { RewardCard, CompactRewardCard, FeaturedRewardCard } from './RewardCard';
import { AchievementBadge, AchievementGrid, AchievementShowcase } from './AchievementBadge';
import { AdminCard, MetricCard, AlertCard, QuickActionCard } from './AdminCard';
import { PointsDisplay, CompactPointsDisplay, PointsChange, LeaderboardEntry } from './PointsDisplay';
import { ThemeProvider, useTheme, ThemeToggle, RoleToggle } from './Theme';

// Demo Component
export const DesignSystemDemo: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pointsChange, setPointsChange] = useState<number | null>(null);

  return (
    <ThemeProvider defaultColorMode="light" defaultUserRole="employee">
      <div className="min-h-screen bg-background">
        <DemoContent 
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          confirmOpen={confirmOpen}
          setConfirmOpen={setConfirmOpen}
          pointsChange={pointsChange}
          setPointsChange={setPointsChange}
        />
      </div>
    </ThemeProvider>
  );
};

const DemoContent: React.FC<{
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  pointsChange: number | null;
  setPointsChange: (change: number | null) => void;
}> = ({ modalOpen, setModalOpen, confirmOpen, setConfirmOpen, pointsChange, setPointsChange }) => {
  const { theme } = useTheme();

  // Sample data
  const sampleReward = {
    id: '1',
    title: 'Premium Coffee Voucher',
    description: 'Enjoy a premium coffee experience at our partner locations with this exclusive voucher.',
    points: 250,
    category: 'Food & Beverage',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    available: true,
    popularity: 4.8,
    expiresAt: new Date('2024-12-31'),
    tags: ['Popular', 'Instant', 'Local'],
  };

  const sampleAchievement = {
    id: '1',
    title: 'Team Collaborator',
    description: 'Work effectively with team members on 10 projects',
    icon: <Users className="h-6 w-6" />,
    category: 'teamwork',
    rarity: 'epic' as const,
    progress: { current: 7, total: 10 },
    unlockedAt: undefined,
    isSecret: false,
  };

  const samplePoints = {
    total: 1247,
    available: 1150,
    earned: 1500,
    spent: 253,
    rank: 12,
    level: {
      current: 5,
      progress: 0.67,
      nextLevelPoints: 1500,
    },
  };

  const achievements = [
    { ...sampleAchievement, id: '1', rarity: 'common' as const, unlockedAt: new Date() },
    { ...sampleAchievement, id: '2', rarity: 'rare' as const, title: 'Helper', icon: <Gift className="h-6 w-6" /> },
    { ...sampleAchievement, id: '3', rarity: 'epic' as const, title: 'Leader', icon: <Trophy className="h-6 w-6" /> },
    { ...sampleAchievement, id: '4', rarity: 'legendary' as const, title: 'Champion', icon: <Crown className="h-6 w-6" />, unlockedAt: new Date() },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Design System Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              Enterprise Employee Rewards System Components
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <CompactPointsDisplay points={1247} />
            <ThemeToggle size="md" showLabel />
            <RoleToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card variant="premium" className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gradient mb-2">50+</div>
              <div className="text-muted-foreground">Components</div>
            </CardContent>
          </Card>
          
          <Card variant="premium" className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gradient mb-2">100%</div>
              <div className="text-muted-foreground">Accessible</div>
            </CardContent>
          </Card>
          
          <Card variant="premium" className="text-center">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gradient mb-2">{theme.role}</div>
              <div className="text-muted-foreground">Theme Active</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Buttons</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader title="Button Variants" />
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="error">Error</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" size="xl">Extra Large</Button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={<Star />}>With Icon</Button>
                <Button variant="secondary" loading>Loading</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Button Groups & Icon Buttons" />
            <CardContent className="space-y-4">
              <ButtonGroup attached>
                <Button variant="outline">Left</Button>
                <Button variant="outline">Center</Button>
                <Button variant="outline">Right</Button>
              </ButtonGroup>
              
              <div className="flex gap-3">
                <IconButton icon={<Settings />} aria-label="Settings" />
                <IconButton icon={<Bell />} variant="primary" aria-label="Notifications" />
                <IconButton icon={<Search />} variant="secondary" aria-label="Search" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Form Controls</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader title="Text Inputs" />
            <CardContent className="space-y-4">
              <Input 
                label="Email Address"
                placeholder="Enter your email"
                type="email"
              />
              
              <Input 
                label="Password"
                placeholder="Enter password"
                type="password"
              />
              
              <Input 
                label="Search"
                placeholder="Search rewards..."
                leftElement={<Search className="h-4 w-4" />}
                rightElement={<Filter className="h-4 w-4" />}
              />
              
              <Input 
                label="Error State"
                error
                errorMessage="This field is required"
                placeholder="Required field"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Advanced Inputs" />
            <CardContent className="space-y-4">
              <SearchInput 
                placeholder="Search with debouncing..."
                onSearch={(query) => console.log('Search:', query)}
              />
              
              <Textarea 
                label="Description"
                placeholder="Enter description..."
                rows={3}
              />
              
              <Input 
                label="Success State"
                defaultValue="Valid input"
                helperText="This looks good!"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Cards</h2>
        
        <CardGrid columns={3} gap="md">
          <Card variant="default">
            <CardHeader title="Default Card" subtitle="Basic card variant" />
            <CardContent>
              <p className="text-muted-foreground">
                Simple card with clean styling for general content.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="elevated" hoverable>
            <CardHeader title="Elevated Card" subtitle="With hover effects" />
            <CardContent>
              <p className="text-muted-foreground">
                Elevated card with shadow and hover animations.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="premium">
            <CardHeader title="Premium Card" subtitle="Luxury styling" />
            <CardContent>
              <p className="text-muted-foreground">
                Premium card with sophisticated styling and effects.
              </p>
            </CardContent>
          </Card>
        </CardGrid>
      </section>

      {/* Badges & Avatars */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Badges & Avatars</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader title="Badges" />
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="online" />
                <StatusBadge status="busy" />
                <StatusBadge status="away" />
                <Badge count={5} />
                <Badge count={99} max={50} />
                <Badge dot />
              </div>
              
              <NotificationBadge count={3}>
                <Button variant="ghost" leftIcon={<Bell />}>
                  Notifications
                </Button>
              </NotificationBadge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Avatars" />
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar size="sm" name="John Doe" />
                <Avatar size="md" name="Jane Smith" />
                <Avatar size="lg" name="Bob Johnson" />
                <Avatar size="xl" name="Alice Brown" />
              </div>
              
              <div className="flex items-center gap-4">
                <AvatarWithStatus 
                  name="Online User"
                  status="online"
                />
                <NotificationAvatar 
                  name="User with notifications"
                  count={5}
                />
              </div>
              
              <AvatarGroup max={4}>
                <Avatar name="User 1" />
                <Avatar name="User 2" />
                <Avatar name="User 3" />
                <Avatar name="User 4" />
                <Avatar name="User 5" />
                <Avatar name="User 6" />
              </AvatarGroup>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rewards Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Rewards System</h2>
        
        <div className="space-y-8">
          {/* Points Display */}
          <Card>
            <CardHeader title="Points Display" />
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PointsDisplay 
                  points={samplePoints}
                  size="sm"
                />
                <PointsDisplay 
                  points={samplePoints}
                  size="md"
                  showBreakdown
                />
                <div className="space-y-4">
                  <CompactPointsDisplay points={1247} />
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => setPointsChange(50)}
                  >
                    Test Points Animation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reward Cards */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Reward Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RewardCard 
                reward={sampleReward}
                userPoints={500}
                onClaim={(reward) => console.log('Claiming:', reward)}
                onViewDetails={(reward) => console.log('Viewing:', reward)}
              />
              
              <CompactRewardCard 
                reward={sampleReward}
                userPoints={500}
              />
              
              <FeaturedRewardCard 
                reward={sampleReward}
                userPoints={500}
                featured
                spotlight
              />
            </div>
          </div>

          {/* Achievement Badges */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Achievement System</h3>
            <div className="space-y-6">
              <AchievementGrid 
                achievements={achievements}
                columns={4}
                size="md"
                onAchievementClick={(achievement) => console.log('Achievement:', achievement)}
              />
              
              <AchievementShowcase 
                achievement={achievements[3]}
                showDetails
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admin Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard 
            title="Total Users"
            subtitle="Active employees"
            value={1247}
            trend={{
              direction: 'up',
              percentage: 5.7,
              label: 'vs last month'
            }}
            status="success"
            icon={<Users />}
            elevation="high"
          />
          
          <MetricCard 
            title="Engagement Rate"
            value={87}
            target={90}
            format="percentage"
            status="on-track"
            icon={<TrendingUp />}
          />
          
          <QuickActionCard 
            title="Add Reward"
            description="Create a new reward for employees"
            icon={<Plus />}
            onClick={() => console.log('Add reward')}
            badge={{ text: 'Popular', variant: 'primary' }}
          />
          
          <AlertCard 
            type="warning"
            title="Maintenance Scheduled"
            message="System maintenance this weekend 2-4 AM EST."
            dismissible
          />
          
          <AdminCard 
            title="Points Distributed"
            value={125000}
            icon={<Gift />}
            trend={{
              direction: 'up',
              percentage: 12.3,
            }}
          />
          
          <AdminCard 
            title="Active Rewards"
            value={23}
            subtitle="Available for redemption"
            icon={<Coffee />}
          />
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Leaderboard</h2>
        
        <Card>
          <CardHeader title="Top Performers" subtitle="This month's leaders" />
          <CardContent className="space-y-2">
            <LeaderboardEntry 
              rank={1}
              name="Alice Johnson"
              points={2847}
              trend="up"
            />
            <LeaderboardEntry 
              rank={2}
              name="Bob Smith"
              points={2156}
              trend="same"
            />
            <LeaderboardEntry 
              rank={3}
              name="Carol Davis"
              points={1923}
              trend="up"
            />
            <LeaderboardEntry 
              rank={12}
              name="You"
              points={1247}
              isCurrentUser
              trend="up"
            />
          </CardContent>
        </Card>
      </section>

      {/* Modals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Modals & Overlays</h2>
        
        <Card>
          <CardHeader title="Modal Components" />
          <CardContent>
            <div className="flex gap-4">
              <Button 
                variant="primary"
                onClick={() => setModalOpen(true)}
              >
                Open Modal
              </Button>
              
              <Button 
                variant="error"
                onClick={() => setConfirmOpen(true)}
              >
                Confirm Dialog
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Modals */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This is an example modal showcasing the design system's modal component
            with smooth animations and accessibility features.
          </p>
          
          <div className="flex gap-3">
            <Button variant="primary">Primary Action</Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => console.log('Confirmed')}
        title="Confirm Action"
        message="Are you sure you want to perform this action? This cannot be undone."
        variant="danger"
      />

      {/* Points Change Animation */}
      {pointsChange && (
        <PointsChange 
          change={pointsChange}
          reason="Reward claimed"
          onAnimationComplete={() => setPointsChange(null)}
        />
      )}
    </div>
  );
};

export default DesignSystemDemo;