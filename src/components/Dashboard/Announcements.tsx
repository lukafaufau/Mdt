import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = React.useState([]);

  const handleCreateAnnouncement = () => {
    // TODO: Implement create announcement modal
    console.log('Create new announcement');
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Announcements</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCreateAnnouncement}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </button>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-center text-gray-500 py-4">
          <p>No announcements</p>
          <p className="text-sm mt-2">Announcements will appear here when created</p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;