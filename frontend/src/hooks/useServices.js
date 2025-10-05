import { useState, useEffect, useCallback } from 'react';
import { services } from '../services/api';

export function useServices(householdId) {
  const [musicServices, setMusicServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    if (!householdId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await services.getAll(householdId);
      setMusicServices(response.data.data.services || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch music services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [householdId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    musicServices,
    loading,
    error
  };
}
