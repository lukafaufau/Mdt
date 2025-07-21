import React, { useState } from 'react';
import { Radio, Users, MapPin, Clock, Plus, X } from 'lucide-react';

interface DispatchConnectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const DispatchConnection: React.FC<DispatchConnectionProps> = ({ isOpen, onClose }) => {
  const [selectedUnit, setSelectedUnit] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const predefinedUnits = [
    'Adam-1', 'Adam-2', 'Adam-3', 'Adam-4', 'Adam-5',
    'Baker-1', 'Baker-2', 'Baker-3',
    'Charlie-1', 'Charlie-2',
    'David-1', 'David-2',
    'Edward-1', 'Edward-2',
    'Frank-1', 'Frank-2'
  ];

  const handleConnect = () => {
    const unit = showCustomInput ? customUnit : selectedUnit;
    if (unit) {
      setIsConnected(true);
      console.log(`Connected to dispatch as ${unit}`);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedUnit('');
    setCustomUnit('');
    setShowCustomInput(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Radio className="w-5 h-5 mr-2" />
              Dispatch Connection
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!isConnected ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Select Unit</h3>
                
                {!showCustomInput ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {predefinedUnits.map((unit) => (
                        <button
                          key={unit}
                          onClick={() => setSelectedUnit(unit)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            selectedUnit === unit
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Custom Unit</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Custom Unit Name
                      </label>
                      <input
                        type="text"
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        placeholder="Enter unit name (e.g., Adam-10)"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomUnit('');
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      ← Back to predefined units
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!selectedUnit && !customUnit}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Radio className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Connected to Dispatch</h3>
                <p className="text-gray-400">
                  Unit: <span className="text-green-400 font-semibold">
                    {showCustomInput ? customUnit : selectedUnit}
                  </span>
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Dispatch Status
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-gray-300">Patrol Zone</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Connected:</span>
                    <span className="text-blue-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Just now
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleDisconnect}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchConnection;