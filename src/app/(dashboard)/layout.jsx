import { redirect } from 'next/navigation';
import DashboardSidebarLayout from '@/components/layout/DashboardSidebarLayout';

export default function ProtectedLayout({ children }) {
  return <DashboardSidebarLayout>{children}</DashboardSidebarLayout>;
}
