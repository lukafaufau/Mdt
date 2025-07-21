import React from 'react';
import { Radio, Plus } from 'lucide-react';

const DispatchWidget: React.FC = () => {
  const [activeCalls, setActiveCalls] = React.useState([]);

  const handleCreateCall = () => {
    // TODO: Implement create dispatch call modal
    console.log('Create new dispatch call');
  };


  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Dispatch</h3>
          <Radio className="w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleCreateCall}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Create New Call</span>
        </button>
      </div>

      <div className="p-4">
        <div className="text-center text-gray-500 py-8">
          <p>No active dispatch calls</p>
          <p className="text-sm mt-2">Dispatch calls will appear here when created</p>
        </div>
      </div>
    </div>
  );
};

export default DispatchWidget;