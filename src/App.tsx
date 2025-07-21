import React, { createContext } from 'react';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import ProfilesPage from './components/Profiles/ProfilesPage';

const App: React.FC = () => {
  const auth = useAuthProvider();
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'profiles':
        return <ProfilesPage />;
      case 'incidents':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Incidents</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <p className="text-gray-400">Incidents management coming soon...</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Reports</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <p className="text-gray-400">Reports management coming soon...</p>
            </div>
          </div>
        );
      case 'vehicles':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Vehicles</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <p className="text-gray-400">Vehicle database coming soon...</p>
            </div>
          </div>
        );
      case 'dispatch':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Dispatch</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <p className="text-gray-400">Live dispatch system coming soon...</p>
            </div>
          </div>
        );
      case 'roster':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Roster</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <p className="text-gray-400">Officer roster coming soon...</p>
            </div>
          </div>
        );
      case 'charges':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Charges</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <p className="text-gray-400">Charges database coming soon...</p>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Admin Panel</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <p className="text-gray-400">Admin panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-gray-900">
        {!auth.user ? (
          <LoginForm />
        ) : (
          <div className="flex">
            <Sidebar 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              user={auth.user}
            />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 bg-gray-900 overflow-y-auto">
                {renderContent()}
              </main>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
};

export default App;