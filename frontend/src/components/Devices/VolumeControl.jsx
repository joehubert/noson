import { useState, useEffect } from 'react';
import { devices } from '../../services/api';
import { VOLUME } from '../../utils/constants';
import Toast from '../common/Toast';

export default function VolumeControl({ groupId }) {
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Fetch initial volume
  useEffect(() => {
    fetchVolume();
  }, [groupId]);

  const fetchVolume = async () => {
    try {
      setLoading(true);
      const response = await devices.getVolume(groupId);
      setVolume(response.data.data.volume || 50);
      setMuted(response.data.data.muted || false);
    } catch (error) {
      console.error('Error fetching volume:', error);
      setToast({ message: 'Failed to fetch volume', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateVolume = async (newVolume) => {
    try {
      // Optimistic update
      setVolume(newVolume);
      
      await devices.setVolume(groupId, { volume: newVolume });
    } catch (error) {
      console.error('Error setting volume:', error);
      setToast({ message: 'Failed to set volume', type: 'error' });
      // Revert on error
      fetchVolume();
    }
  };

  const handleSliderChange = (e) => {
    const newVolume = parseInt(e.target.value);
    updateVolume(newVolume);
  };

  const adjustVolume = (delta) => {
    const newVolume = Math.max(VOLUME.MIN, Math.min(VOLUME.MAX, volume + delta));
    updateVolume(newVolume);
  };

  const toggleMute = async () => {
    try {
      const newMuted = !muted;
      setMuted(newMuted);
      
      await devices.setVolume(groupId, { muted: newMuted });
    } catch (error) {
      console.error('Error toggling mute:', error);
      setToast({ message: 'Failed to toggle mute', type: 'error' });
      setMuted(!muted);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-pulse text-sm text-gray-500">Loading volume...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Volume label and value */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Volume</span>
        <span className="text-sm font-semibold text-gray-900">{volume}%</span>
      </div>

      {/* Slider */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => adjustVolume(-VOLUME.STEP)}
          disabled={volume <= VOLUME.MIN}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Decrease volume"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <input
          type="range"
          min={VOLUME.MIN}
          max={VOLUME.MAX}
          value={volume}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />

        <button
          onClick={() => adjustVolume(VOLUME.STEP)}
          disabled={volume >= VOLUME.MAX}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Increase volume"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded transition-colors ${
            muted ? 'bg-red-100 hover:bg-red-200' : 'hover:bg-gray-100'
          }`}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
