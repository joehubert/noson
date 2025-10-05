import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { households } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function DashboardPage() {
  const [householdList, setHouseholdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await households.getAll();
      setHouseholdList(response.data.data.households || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch households');
      console.error('Error fetching households:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchHouseholds} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Noson. Control your Sonos system from here.
        </p>
      </div>

      {/* Households section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Households</h2>
        
        {householdList.length === 0 ? (
          <p className="text-gray-500">No households found.</p>
        ) : (
          <div className="space-y-3">
            {householdList.map((household) => (
              <div 
                key={household.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {household.name || 'Unnamed Household'}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                      ID: {household.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/devices"
          className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-black">
                View Devices
              </h3>
              <p className="text-sm text-gray-500">
                See and control your Sonos speakers
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/services"
          className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-black">
                Music Services
              </h3>
              <p className="text-sm text-gray-500">
                View your connected music services
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
