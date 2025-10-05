import { useState, useEffect } from 'react';
import { households } from '../services/api';
import { useDevices } from '../hooks/useDevices';
import { AUTO_REFRESH_INTERVAL } from '../utils/constants';
import DeviceList from '../components/Devices/DeviceList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function DevicesPage() {
  const [householdList, setHouseholdList] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);
  const [loadingHouseholds, setLoadingHouseholds] = useState(true);
  const [householdError, setHouseholdError] = useState(null);

  const { groups, loading: loadingGroups, error: groupsError, refreshGroups } = useDevices(selectedHouseholdId);

  // Fetch households on mount
  useEffect(() => {
    fetchHouseholds();
  }, []);

  // Auto-refresh groups every 30 seconds
  useEffect(() => {
    if (!selectedHouseholdId) return;

    const interval = setInterval(() => {
      refreshGroups();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedHouseholdId, refreshGroups]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Devices</h1>
          <p className="mt-2 text-gray-600">
            Control your Sonos speakers and adjust volume
          </p>
        </div>
        <button
          onClick={refreshGroups}
          disabled={loadingGroups}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg 
            className={`-ml-1 mr-2 h-5 w-5 ${loadingGroups ? 'animate-spin' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
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

      {/* Device list */}
      <DeviceList 
        groups={groups} 
        loading={loadingGroups} 
        error={groupsError}
        onRefresh={refreshGroups}
      />

      {/* Auto-refresh indicator */}
      {selectedHouseholdId && !loadingGroups && (
        <p className="text-sm text-gray-500 text-center">
          Auto-refreshing every 30 seconds
        </p>
      )}
    </div>
  );
}
