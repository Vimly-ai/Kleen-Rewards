/**
 * TypeScript Type Definitions - Enterprise Employee Rewards System
 * 
 * Comprehensive type definitions for the design system
 */

import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Base Types
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
export type ColorMode = 'light' | 'dark' | 'system';
export type UserRole = 'employee' | 'admin' | 'manager';

// Theme Types
export interface Theme {
  mode: ColorMode;
  role: UserRole;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    divider: string;
  };
}

// Component Base Props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

// Button Types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
}

// Input Types
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  size?: Size;
  variant?: 'default' | 'filled' | 'flushed';
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
}

// Card Types
export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'premium';
  padding?: Size;
  hoverable?: boolean;
  clickable?: boolean;
  loading?: boolean;
}

// Badge Types
export interface BadgeProps extends BaseProps {
  variant?: Variant;
  size?: Size;
  rounded?: boolean;
  dot?: boolean;
  count?: number;
  max?: number;
}

// Avatar Types
export interface AvatarProps extends BaseProps {
  src?: string;
  alt?: string;
  size?: Size | number;
  name?: string;
  loading?: boolean;
  badge?: {
    variant?: Variant;
    content?: ReactNode;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };
}

// Modal Types
export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  size?: Size | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  title?: string;
  showCloseButton?: boolean;
  centered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
}

// Table Types
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> extends BaseProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: string | ((record: T) => string);
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  scroll?: { x?: number | string; y?: number | string };
  size?: Size;
}

// Reward System Types
export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image?: string;
  available: boolean;
  popularity?: number;
  expiresAt?: Date;
  tags?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: {
    current: number;
    total: number;
  };
  unlockedAt?: Date;
  isSecret?: boolean;
}

export interface UserPoints {
  total: number;
  available: number;
  earned: number;
  spent: number;
  rank?: number;
  level?: {
    current: number;
    progress: number;
    nextLevelPoints: number;
  };
}

// Reward Card Types
export interface RewardCardProps extends BaseProps {
  reward: Reward;
  userPoints?: number;
  onClaim?: (reward: Reward) => void;
  onViewDetails?: (reward: Reward) => void;
  showPopularity?: boolean;
  compact?: boolean;
}

// Achievement Badge Types
export interface AchievementBadgeProps extends BaseProps {
  achievement: Achievement;
  size?: Size;
  showProgress?: boolean;
  interactive?: boolean;
  onClick?: (achievement: Achievement) => void;
}

// Points Display Types
export interface PointsDisplayProps extends BaseProps {
  points: UserPoints;
  showBreakdown?: boolean;
  animated?: boolean;
  size?: Size;
}

// Analytics Types
export interface AnalyticsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface ChartProps extends BaseProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  data: AnalyticsData;
  height?: number;
  responsive?: boolean;
  options?: any;
  loading?: boolean;
}

// Form Types
export interface FormFieldProps extends BaseProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  orientation?: 'vertical' | 'horizontal';
}

// Animation Types
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterationCount?: number | 'infinite';
  playState?: 'running' | 'paused';
}

// Responsive Types
export interface ResponsiveValue<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Event Types
export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps<T = any> extends BaseProps {
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  onChange?: (value: T) => void;
  onSearch?: (query: string) => void;
}

// Toast Types
export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: Variant;
  duration?: number;
  isClosable?: boolean;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Progress Types
export interface ProgressProps extends BaseProps {
  value: number;
  max?: number;
  size?: Size;
  variant?: 'default' | 'striped' | 'animated';
  color?: string;
  showLabel?: boolean;
  label?: string;
  format?: (value: number, max: number) => string;
}

// Dropdown Types
export interface DropdownOption {
  key: string;
  label: ReactNode;
  value?: any;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
  icon?: ReactNode;
  shortcut?: string;
}

export interface DropdownProps extends BaseProps {
  trigger: ReactNode;
  options: DropdownOption[];
  placement?: 'bottom' | 'top' | 'left' | 'right';
  offset?: number;
  onSelect?: (option: DropdownOption) => void;
  disabled?: boolean;
  closeOnSelect?: boolean;
}

// Data Card Types
export interface DataCardProps extends BaseProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  color?: string;
  loading?: boolean;
  onClick?: () => void;
}