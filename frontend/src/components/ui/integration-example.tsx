/**
 * Integration Example - Enterprise Employee Rewards System
 * 
 * This file demonstrates how to integrate the design system
 * into an existing React application.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Home, Trophy, Gift, Users, Settings, Bell, 
  Search, Menu, LogOut, User 
} from 'lucide-react';

// Design System Imports
import { ThemeProvider } from './Theme';
import { Button } from './Button';
import { Card, CardHeader, CardContent } from './Card';
import { Avatar, NotificationAvatar } from './Avatar';
import { CompactPointsDisplay } from './PointsDisplay';
import { SearchInput } from './Input';

// Example App Integration
export const IntegratedApp: React.FC = () => {
  return (
    <ThemeProvider defaultColorMode="system" defaultUserRole="employee">
      <Router>
        <div className="min-h-screen bg-background">
          {/* Navigation */}
          <AppNavigation />
          
          {/* Main Content */}
          <main className="ml-64 p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

// Navigation Component
const AppNavigation: React.FC = () => {
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/rewards', label: 'Rewards', icon: Gift },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/leaderboard', label: 'Leaderboard', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-foreground">
            Employee Rewards
          </h1>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <NotificationAvatar 
            name="John Doe"
            size="md"
            count={3}
          />
          <div className="min-w-0">
            <div className="font-medium text-foreground">John Doe</div>
            <div className="text-sm text-muted-foreground">Software Engineer</div>
          </div>
        </div>
        
        <CompactPointsDisplay points={1247} animated />
      </div>

      {/* Search */}
      <div className="p-6">
        <SearchInput 
          placeholder="Search rewards..."
          onSearch={(query) => console.log('Search:', query)}
        />
      </div>

      {/* Navigation Links */}
      <div className="px-3">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors mb-1"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
        <Button variant="ghost" fullWidth leftIcon={<Settings />}>
          Settings
        </Button>
      </div>
    </nav>
  );
};

// Example Pages
const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your activity overview.</p>
        </div>
        
        <Button variant="primary" leftIcon={<Bell />}>
          View Notifications
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Points Earned" />
          <CardContent>
            <div className="text-3xl font-bold text-primary-600 mb-2">1,247</div>
            <div className="text-sm text-success-600">+23% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Rewards Claimed" />
          <CardContent>
            <div className="text-3xl font-bold text-secondary-600 mb-2">5</div>
            <div className="text-sm text-muted-foreground">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Achievements" />
          <CardContent>
            <div className="text-3xl font-bold text-success-600 mb-2">12</div>
            <div className="text-sm text-muted-foreground">Unlocked</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Activity" />
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-success-50 rounded-lg">
              <Trophy className="h-5 w-5 text-success-600" />
              <div>
                <div className="font-medium text-foreground">Achievement Unlocked</div>
                <div className="text-sm text-muted-foreground">Team Collaborator - 50 points earned</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
              <Gift className="h-5 w-5 text-primary-600" />
              <div>
                <div className="font-medium text-foreground">Reward Claimed</div>
                <div className="text-sm text-muted-foreground">Coffee Voucher - 250 points spent</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RewardsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rewards Catalog</h1>
        <p className="text-muted-foreground">Discover and claim amazing rewards with your points.</p>
      </div>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Rewards Coming Soon</h3>
          <p className="text-muted-foreground">
            We're working on adding your favorite rewards to the catalog.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const AchievementsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground">Track your progress and unlock special badges.</p>
      </div>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Achievements System</h3>
          <p className="text-muted-foreground">
            Your achievement progress will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const LeaderboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank among your colleagues.</p>
      </div>
      
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Leaderboard</h3>
          <p className="text-muted-foreground">
            Rankings and statistics will be shown here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Profile Settings</h3>
          <p className="text-muted-foreground">
            Your profile and settings will be managed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedApp;