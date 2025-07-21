import React from 'react';
import { User, Plus } from 'lucide-react';

const ActiveWarrants: React.FC = () => {
  const [activeWarrants, setActiveWarrants] = React.useState([]);

  const handleCreateWarrant = () => {
    // TODO: Implement create warrant modal
    console.log('Create new warrant');
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Warrants</h3>
          <User className="w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleCreateWarrant}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Create New Warrant</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-center text-gray-500 py-4">
          <p>No active warrants</p>
          <p className="text-sm mt-2">Warrants will appear here when issued</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveWarrants;