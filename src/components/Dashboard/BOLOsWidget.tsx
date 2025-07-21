import React from 'react';
import { Search, AlertTriangle, Car, User } from 'lucide-react';
import { mockBOLOs } from '../../data/mockData';

const BOLOsWidget: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return Car;
      case 'person':
        return User;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">BOLOS</h3>
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockBOLOs.map((bolo) => {
            const TypeIcon = getTypeIcon(bolo.type);
            return (
              <div key={bolo.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TypeIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-mono text-sm font-semibold">
                      {bolo.subject}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${getPriorityColor(bolo.priority)} uppercase`}>
                    {bolo.priority}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{bolo.description}</p>
                
                {bolo.lastSeen && (
                  <div className="text-gray-400 text-xs mb-2">
                    Last seen: {bolo.lastSeen}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By: {bolo.createdBy}</span>
                  <span>
                    {new Date(bolo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
          
          {mockBOLOs.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No active BOLOs
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BOLOsWidget;