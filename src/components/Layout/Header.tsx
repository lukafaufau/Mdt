import React from 'react';
import { LogOut, Bell, Settings, Radio } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DispatchConnection from '../Dispatch/DispatchConnection';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDispatchModal, setShowDispatchModal] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-400 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowDispatchModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Radio className="w-4 h-4" />
              <span>Connect Dispatch</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <DispatchConnection
        isOpen={showDispatchModal}
        onClose={() => setShowDispatchModal(false)}
      />
    </>
  );
};

export default Header;