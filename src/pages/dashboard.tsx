import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import UserDashboard from '../components/UserDashboard';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      {isAuthenticated && (
        <UserDashboard error={null} />
      )}
    </>
  );
};

export default Dashboard;