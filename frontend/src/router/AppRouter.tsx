import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Layout } from '../components/Layout'
import { RoleGuard } from '../components/shared/RoleGuard'
import { LoadingSpinner } from '../components/shared/LoadingSpinner'
import { ProfileCheck } from '../components/ProfileCheck'

// Lazy load shared pages
const AuthPage = lazy(() => import('../pages/shared/AuthPage'))
const NotFoundPage = lazy(() => import('../pages/shared/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('../pages/shared/UnauthorizedPage'))
const ProfileSetup = lazy(() => import('../components/ProfileSetup').then(module => ({ default: module.ProfileSetup })))
const ClearSession = lazy(() => import('../pages/ClearSession'))

// Lazy load employee pages
const EmployeeDashboard = lazy(() => import('../pages/employee/Dashboard'))
const EmployeeRewards = lazy(() => import('../pages/employee/Rewards'))
const EmployeeAchievements = lazy(() => import('../pages/employee/Achievements'))
const EmployeeProfile = lazy(() => import('../pages/employee/Profile'))
const LeaderboardPage = lazy(() => import('../pages/shared/Leaderboard'))

// Lazy load admin pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const AdminUserManagement = lazy(() => import('../pages/admin/UserManagement'))
const AdminAnalytics = lazy(() => import('../pages/admin/Analytics'))
const AdminSettings = lazy(() => import('../pages/admin/Settings'))
const QRCodeSettings = lazy(() => import('../pages/admin/QRCodeSettings'))
const AdminRedemptions = lazy(() => import('../pages/admin/Redemptions'))
const AdminProfile = lazy(() => import('../pages/admin/Profile'))

// Enhanced loading component
function PageLoader() {
  return <LoadingSpinner size="large" text="Loading page..." fullScreen />
}

// Employee layout wrapper
function EmployeeLayout() {
  return (
    <RoleGuard allowedRoles={['employee', 'admin', 'super_admin']}>
      <ProfileCheck>
        <Layout>
          <Outlet />
        </Layout>
      </ProfileCheck>
    </RoleGuard>
  )
}

// Admin layout wrapper
function AdminLayout() {
  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <ProfileCheck>
        <Layout>
          <Outlet />
        </Layout>
      </ProfileCheck>
    </RoleGuard>
  )
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <PageLoader />
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

// Remove AdminRoute as it's now handled by RoleGuard component

export function AppRouter() {
  const { isSignedIn, user } = useAuth()
  const userRole = user?.publicMetadata?.role as string || 'employee'

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/auth" 
          element={
            isSignedIn ? 
              <Navigate to={userRole === 'admin' || userRole === 'super_admin' ? '/admin' : '/employee'} replace /> : 
              <AuthPage />
          } 
        />
        
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/clear" element={<ClearSession />} />
        
        {/* Profile Setup */}
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />

        {/* Employee routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="rewards" element={<EmployeeRewards />} />
          <Route path="achievements" element={<EmployeeAchievements />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="qr-settings" element={<QRCodeSettings />} />
          <Route path="redemptions" element={<AdminRedemptions />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Root redirect */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate 
                to={userRole === 'admin' || userRole === 'super_admin' ? '/admin' : '/employee'} 
                replace 
              />
            </ProtectedRoute>
          } 
        />

        {/* Legacy redirects for backward compatibility */}
        <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/rewards" element={<Navigate to="/employee/rewards" replace />} />
        <Route path="/profile" element={<Navigate to="/employee/profile" replace />} />
        <Route path="/leaderboard" element={<Navigate to="/employee/leaderboard" replace />} />

        {/* 404 catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}