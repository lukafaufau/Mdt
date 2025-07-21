import React from 'react';
import { Search, Plus } from 'lucide-react';

const BOLOsWidget: React.FC = () => {
  const [bolos, setBolos] = React.useState([]);

  const handleCreateBOLO = () => {
    // TODO: Implement create BOLO modal
    console.log('Create new BOLO');
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">BOLOS</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCreateBOLO}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Create New BOLO</span>
            </button>
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-center text-gray-500 py-8">
          <p>No active BOLOs</p>
          <p className="text-sm mt-2">BOLOs will appear here when created</p>
        </div>
      </div>
    </div>
  );
};

export default BOLOsWidget;