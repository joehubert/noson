import { useState, useEffect } from 'react';
import { households } from '../services/api';
import { useServices } from '../hooks/useServices';
import ServiceList from '../components/Services/ServiceList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function ServicesPage() {
  const [householdList, setHouseholdList] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);
  const [loadingHouseholds, setLoadingHouseholds] = useState(true);
  const [householdError, setHouseholdError] = useState(null);

  const { musicServices, loading: loadingServices, error: servicesError } = useServices(selectedHouseholdId);

  // Fetch households on mount
  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      setLoadingHouseholds(true);
      setHouseholdError(null);
      const response = await households.getAll();
      const householdData = response.data.data.households || [];
      setHouseholdList(householdData);
      
      // Auto-select first household
      if (householdData.length > 0) {
        setSelectedHouseholdId(householdData[0].id);
      }
    } catch (err) {
      setHouseholdError(err.message || 'Failed to fetch households');
      console.error('Error fetching households:', err);
    } finally {
      setLoadingHouseholds(false);
    }
  };

  if (loadingHouseholds) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (householdError) {
    return <ErrorMessage message={householdError} onRetry={fetchHouseholds} />;
  }

  if (householdList.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No households found</h3>
        <p className="mt-2 text-gray-500">
          Please check your Sonos account and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Music Services</h1>
        <p className="mt-2 text-gray-600">
          View all music services connected to your Sonos system
        </p>
      </div>

      {/* Household selector (if multiple) */}
      {householdList.length > 1 && (
        <div className="bg-white shadow rounded-lg p-4">
          <label htmlFor="household" className="block text-sm font-medium text-gray-700 mb-2">
            Select Household
          </label>
          <select
            id="household"
            value={selectedHouseholdId || ''}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black rounded-md"
          >
            {householdList.map((household) => (
              <option key={household.id} value={household.id}>
                {household.name || household.id}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Services list */}
      <ServiceList 
        services={musicServices} 
        loading={loadingServices} 
        error={servicesError}
      />
    </div>
  );
}
