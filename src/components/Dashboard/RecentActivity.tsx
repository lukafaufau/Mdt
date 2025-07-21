import React from 'react';
import { Eye, Plus } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const handleCreateActivity = () => {
    // TODO: Implement create activity modal
    console.log('Create new activity');
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button
            onClick={handleCreateActivity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Activity</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-center text-gray-500 py-8">
          <p>No recent activities</p>
          <p className="text-sm mt-2">Activities will appear here when actions are performed</p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;