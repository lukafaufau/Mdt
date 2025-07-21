import React, { useState } from 'react';
import { Search, Plus, User, FileText, Car } from 'lucide-react';
import { apiService } from '../../services/api';
import CreateProfileModal from './CreateProfileModal';

const ProfilesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setProfiles([]);
      return;
    }

    setLoading(true);
    try {
      const results = await apiService.searchProfiles(searchTerm);
      setProfiles(results.map(profile => ({
        ...profile,
        criminal_record_count: profile.criminal_records?.length || 0,
        vehicle_count: profile.vehicles?.length || 0
      })));
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleProfileCreated = () => {
    // Relancer la recherche pour afficher le nouveau profil
    if (searchTerm) {
      handleSearch();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Citizen Profiles</h1>
          <p className="text-gray-400">Search and manage citizen records</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Profil</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, license number, or file number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Search Results ({profiles.length})
          </h2>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              Recherche en cours...
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {profile.first_name} {profile.last_name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        DOB: {new Date(profile.date_of_birth).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        License: {profile.license_number}
                      </p>
                      <p className="text-gray-400 text-sm">
                        File: {profile.file_number}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4 text-sm">
                      <span className="text-blue-400 flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        {profile.criminal_record_count || 0}
                      </span>
                      <span className="text-green-400 flex items-center">
                        <Car className="w-3 h-3 mr-1" />
                        {profile.vehicle_count || 0}
                      </span>
                    </div>
                    
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                      Voir Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {searchTerm ? 'Aucun profil trouvé' : 'Entrez un terme de recherche pour trouver des profils'}
            </div>
          )}
        </div>
      </div>

      <CreateProfileModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProfileCreated={handleProfileCreated}
      />
    </div>
  );
};

export default ProfilesPage;