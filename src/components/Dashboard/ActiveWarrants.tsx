import React from 'react';
import { User, Clock } from 'lucide-react';
import { mockWarrants } from '../../data/mockData';

const ActiveWarrants: React.FC = () => {
  const activeWarrants = mockWarrants.filter(warrant => warrant.status === 'active');

  const getTimeUntilExpiration = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Expires today';
    if (diffInDays === 1) return 'Expires in 1 day';
    return `Expires in ${diffInDays} days`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Warrants</h3>
          <User className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeWarrants.map((warrant) => (
          <div key={warrant.id} className="bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-white font-medium">{warrant.targetName}</h4>
                <p className="text-gray-400 text-sm">{warrant.charge}</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Issued by: {warrant.issuedBy}
              </span>
              <span className="text-yellow-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeUntilExpiration(warrant.expiresAt)}
              </span>
            </div>
          </div>
        ))}
        
        {activeWarrants.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No active warrants
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveWarrants;