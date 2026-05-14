import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'ADMIN' | 'MANAGER' | 'SALESPERSON' | 'CUSTOMER';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const { profile, loading } = useAuth();

  if (loading) return <div>Loading layout...</div>;
  if (!profile || profile.role !== role) {
    console.warn('Role mismatch or no profile', profile?.role, role);
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};
