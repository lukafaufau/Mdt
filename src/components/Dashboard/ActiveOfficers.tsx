import React from 'react';
import { Users, Circle } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

const ActiveOfficers: React.FC = () => {
  const [activeOfficers, setActiveOfficers] = React.useState(mockUsers.filter(u => u.isActive));
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

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
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-4">
            Chargement...
          </div>
        ) : activeOfficers.map((officer) => (
          <div key={officer.id} className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">
                {officer.first_name} {officer.last_name}
              </div>
              <div className="text-gray-400 text-sm">
                Callsign: {officer.call_sign}
              </div>
              {officer.attached_unit && (
                <div className="text-blue-400 text-xs">
                  Attached Unit: {officer.attached_unit}
                </div>
              )}
            </div>
            <Circle className="w-3 h-3 text-green-400 fill-green-400" />
          </div>
        ))}
        
        {activeOfficers.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No officers currently active
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveOfficers;