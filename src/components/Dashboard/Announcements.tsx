import React from 'react';
import { Plus, MessageSquare, Calendar } from 'lucide-react';
import { mockAnnouncements } from '../../data/mockData';

const Announcements: React.FC = () => {
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
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Announcements</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {mockAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-white font-medium">{announcement.title}</h4>
                <p className="text-gray-300 text-sm mt-1">{announcement.content}</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                By: {announcement.author}
              </span>
              <span className="text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {getTimeAgo(announcement.createdAt)}
              </span>
            </div>
          </div>
        ))}
        
        {mockAnnouncements.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No announcements
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;