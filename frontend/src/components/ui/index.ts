/**
 * UI Components Library - Enterprise Employee Rewards System
 * 
 * Barrel export file for all UI components
 */

// Base Components
export { Button, type ButtonProps } from './Button';
export { Input, type InputProps } from './Input';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './Card';
export { Modal, type ModalProps } from './Modal';
export { Badge, type BadgeProps } from './Badge';
export { Avatar, type AvatarProps } from './Avatar';
export { Tooltip, type TooltipProps } from './Tooltip';
export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, type DropdownProps } from './Dropdown';

// Layout Components
export { Container, type ContainerProps } from './Container';
export { Grid, type GridProps } from './Grid';
export { Stack, type StackProps } from './Stack';
export { Divider, type DividerProps } from './Divider';

// Form Components
export { FormField, type FormFieldProps } from './FormField';
export { Select, type SelectProps } from './Select';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { RadioGroup, RadioOption, type RadioGroupProps } from './RadioGroup';
export { Switch, type SwitchProps } from './Switch';

// Feedback Components
export { Alert, type AlertProps } from './Alert';
export { Toast, type ToastProps } from './Toast';
export { LoadingSpinner, type LoadingSpinnerProps } from './LoadingSpinner';
export { Progress, type ProgressProps } from './Progress';
export { Skeleton, type SkeletonProps } from './Skeleton';

// Navigation Components
export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps } from './Tabs';
export { Breadcrumb, BreadcrumbItem, type BreadcrumbProps } from './Breadcrumb';
export { Pagination, type PaginationProps } from './Pagination';

// Data Display Components
export { Table, TableHeader, TableBody, TableRow, TableCell, type TableProps } from './Table';
export { DataCard, type DataCardProps } from './DataCard';
export { StatCard, type StatCardProps } from './StatCard';
export { MetricCard, type MetricCardProps } from './MetricCard';

// Rewards System Components
export { RewardCard, type RewardCardProps } from './RewardCard';
export { AchievementBadge, type AchievementBadgeProps } from './AchievementBadge';
export { PointsDisplay, type PointsDisplayProps } from './PointsDisplay';
export { LeaderboardCard, type LeaderboardCardProps } from './LeaderboardCard';
export { ProgressRing, type ProgressRingProps } from './ProgressRing';
export { AnimatedCounter } from './AnimatedCounter';
export { Timeline } from './Timeline';

// Admin Components
export { AdminCard, type AdminCardProps } from './AdminCard';
export { AdminTable, type AdminTableProps } from './AdminTable';
export { AnalyticsChart, type AnalyticsChartProps } from './AnalyticsChart';
export { ControlPanel, type ControlPanelProps } from './ControlPanel';
export { UserManagementCard, type UserManagementCardProps } from './UserManagementCard';

// Utility Hooks and Context
export { useTheme, ThemeProvider, type ThemeProviderProps } from './Theme';
export { useToast } from './hooks/useToast';
export { useModal } from './hooks/useModal';
export { useLocalStorage } from './hooks/useLocalStorage';

// Types
export type { Theme, ColorMode, UserRole } from './types';