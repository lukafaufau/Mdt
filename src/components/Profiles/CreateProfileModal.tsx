import React, { useState } from 'react';
import { X, User, Calendar, FileText, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose, onProfileCreated }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    license_number: '',
    file_number: '',
    photo_url: '',
    address: {
      street: '',
      city: '',
      zip_code: '',
      type: 'primary' as 'primary' | 'secondary'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Créer le profil
      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        license_number: formData.license_number,
        file_number: formData.file_number,
        photo_url: formData.photo_url || undefined
      };
      
      // Simuler la création du profil
      const profile = { id: Date.now().toString(), ...profileData };

      // Ajouter l'adresse si fournie
      // if (formData.address.street && formData.address.city) {
      //   await apiService.addAddress({
      //     profile_id: profile.id,
      //     ...formData.address
      //   });
      // }

      onProfileCreated();
      onClose();
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        license_number: '',
        file_number: '',
        photo_url: '',
        address: {
          street: '',
          city: '',
          zip_code: '',
          type: 'primary'
        }
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Erreur lors de la création du profil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Nouveau Profil Citoyen
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de Naissance *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro de Permis
                </label>
                <input
                  type="text"
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="DL123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro de Dossier *
                </label>
                <input
                  type="text"
                  required
                  value={formData.file_number}
                  onChange={(e) => setFormData({ ...formData, file_number: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="P001234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL Photo
                </label>
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Adresse Principale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rue
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Los Santos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code Postal
                </label>
                <input
                  type="text"
                  value={formData.address.zip_code}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, zip_code: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="90210"
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Création...' : 'Créer le Profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfileModal;