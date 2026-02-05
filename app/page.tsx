'use client';

import { useAuth } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import LubricatorDashboard from '@/components/dashboards/LubricatorDashboard';
import SupervisorDashboard from '@/components/dashboards/SupervisorDashboard';
import ContractorDashboard from '@/components/dashboards/ContractorDashboard';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  // Role Strategy Pattern
  const renderDashboard = () => {
    switch (user?.role) {
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'supervisor_ext':
        return <ContractorDashboard />;
      case 'lubricador':
      default:
        // Default to Lubricator view as it's the core operational view
        return <LubricatorDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderDashboard()}
        </main>
      </div>
    </ProtectedRoute>
  );
}
