import React from 'react';
import { Users, Plus } from 'lucide-react';

const ActiveOfficers: React.FC = () => {
  const [activeOfficers, setActiveOfficers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleCreateOfficer = () => {
    // TODO: Implement create officer modal
    console.log('Create new officer');
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Officers</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{activeOfficers.length}</span>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <button
          onClick={handleCreateOfficer}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Create New Officer</span>
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="text-center text-gray-500 py-4">
          <p>No officers currently active</p>
          <p className="text-sm mt-2">Officers will appear here when they sign in</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveOfficers;