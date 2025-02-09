import { ReactNode } from 'react';

export interface MenuItem {
  label: string;
  icon: ReactNode;
  component: ReactNode;
}

export interface DashboardStat {
  label: string;
  value: number;
  icon: ReactNode;
  trend?: number;
  description: string;
} 