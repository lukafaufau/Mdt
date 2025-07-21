import React from 'react';
import { Radio, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { mockDispatchCalls } from '../../data/mockData';

const DispatchWidget: React.FC = () => {
  const [currentCallIndex, setCurrentCallIndex] = React.useState(0);
  const activeCalls = mockDispatchCalls.filter(call => call.status !== 'resolved');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'responding':
        return 'text-blue-400';
      case 'on-scene':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTimeElapsed = (timestamp: string) => {
    const now = new Date();
    const callTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - callTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '< 1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} hours ago`;
  };

  const handlePrevious = () => {
    setCurrentCallIndex((prev) => 
      prev > 0 ? prev - 1 : activeCalls.length - 1
    );
  };

  const handleNext = () => {
    setCurrentCallIndex((prev) => 
      prev < activeCalls.length - 1 ? prev + 1 : 0
    );
  };

  const currentCall = activeCalls[currentCallIndex];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Dispatch</h3>
          <Radio className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="p-4">
        {activeCalls.length > 0 ? (
          <>
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getPriorityColor(currentCall.priority)}`}>
                      {currentCall.code}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(currentCall.status)}`}>
                      {currentCall.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold">{currentCall.title}</h4>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div className="flex items-center mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {getTimeElapsed(currentCall.createdAt)}
                  </div>
                  <div>{currentCallIndex + 1}/{activeCalls.length}</div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{currentCall.location}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Responding Units: {currentCall.respondingUnits.length}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevious}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    disabled={activeCalls.length <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700 transition-colors">
                    Respond
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    disabled={activeCalls.length <= 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Call Summary */}
            <div className="text-center text-sm text-gray-400">
              {activeCalls.length} active call{activeCalls.length !== 1 ? 's' : ''}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No active dispatch calls
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatchWidget;