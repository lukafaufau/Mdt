import React from 'react';
import { 
  Home, 
  User, 
  AlertTriangle, 
  FileText, 
  Car, 
  Radio, 
  Users, 
  Gavel,
  Settings,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profiles', icon: User, label: 'Profiles' },
    { id: 'incidents', icon: AlertTriangle, label: 'Incidents' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'vehicles', icon: Car, label: 'Vehicles' },
    { id: 'dispatch', icon: Radio, label: 'Dispatch' },
  ];

  const staffItems = [
    { id: 'roster', icon: Users, label: 'Roster' },
    { id: 'charges', icon: Gavel, label: 'Charges' },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col">
      {/* Badge Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-20 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-gray-900" />
          </div>
          <div className="text-white">
            <div className="text-sm font-semibold">Police Department</div>
            <div className="text-xs text-gray-400">Mobile Data Terminal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Pages
        </div>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">
          Staff
        </div>
        
        {staffItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        {user.permission === 'admin' && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-8">
              Admin
            </div>
            <button
              onClick={() => onTabChange('admin')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'admin'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Admin Panel</span>
            </button>
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-white">
          <div className="font-semibold">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-gray-400">{user.rank} | {user.callSign}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;