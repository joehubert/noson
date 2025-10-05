import { useState, useEffect, useCallback } from 'react';
import { devices } from '../services/api';

export function useDevices(householdId) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    if (!householdId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await devices.getGroups(householdId);
      setGroups(response.data.data.groups || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch devices');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  }, [householdId]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const refreshGroups = () => {
    fetchGroups();
  };

  return {
    groups,
    loading,
    error,
    refreshGroups
  };
}
