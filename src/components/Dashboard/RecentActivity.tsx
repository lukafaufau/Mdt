import React from 'react';
import { Eye, Clock } from 'lucide-react';
import { mockActivities } from '../../data/mockData';

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = React.useState(mockActivities);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'bg-green-600';
      case 'updated':
        return 'bg-yellow-600';
      case 'deleted':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-4">Type</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Done by</th>
                <th className="pb-4">Time ago</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {activities.map((activity) => (
                <tr key={activity.id} className="border-t border-gray-700">
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getTypeColor(activity.type)}`}>
                      {activity.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300 capitalize">{activity.category}</td>
                  <td className="py-3 text-gray-300">{activity.user}</td>
                  <td className="py-3 text-gray-400 text-sm">{getTimeAgo(activity.timestamp)}</td>
                  <td className="py-3">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Chargement des activités...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;