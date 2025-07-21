import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import RecentActivity from './RecentActivity';
import ActiveOfficers from './ActiveOfficers';
import ActiveWarrants from './ActiveWarrants';
import Announcements from './Announcements';
import BOLOsWidget from './BOLOsWidget';
import DispatchWidget from './DispatchWidget';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActiveWarrants />
            <Announcements />
          </div>
          
          <BOLOsWidget />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ActiveOfficers />
          <DispatchWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;