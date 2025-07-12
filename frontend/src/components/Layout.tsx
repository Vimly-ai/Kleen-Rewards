import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  Gift, 
  User,
  Settings
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'super_admin';

  const employeeNavItems = [
    { path: '/employee/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/employee/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/employee/rewards', icon: Gift, label: 'Rewards' },
    { path: '/employee/profile', icon: User, label: 'Profile' }
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', icon: Settings, label: 'Admin' },
    { path: '/admin/users', icon: User, label: 'Users' },
    { path: '/admin/analytics', icon: Trophy, label: 'Analytics' },
    { path: '/admin/profile', icon: User, label: 'Profile' }
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Employee Rewards
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName || 'Employee'}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-16">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64 pt-0 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}