import { useState } from 'react';
import VolumeControl from './VolumeControl';

export default function DeviceCard({ group }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Device name and info */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {group.name || 'Unnamed Room'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {group.playerIds?.length || 0} device{group.playerIds?.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Playback state indicator */}
          {group.playbackState && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              group.playbackState === 'PLAYBACK_STATE_PLAYING' 
                ? 'bg-green-100 text-green-800'
                : group.playbackState === 'PLAYBACK_STATE_PAUSED'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {group.playbackState === 'PLAYBACK_STATE_PLAYING' ? 'Playing' : 
               group.playbackState === 'PLAYBACK_STATE_PAUSED' ? 'Paused' : 'Idle'}
            </span>
          )}
        </div>

        {/* Volume Control */}
        <div className="mt-4">
          <VolumeControl groupId={group.id} />
        </div>

        {/* Expand/Collapse for more details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          {isExpanded ? 'Hide details' : 'Show details'}
          <svg 
            className={`ml-1 w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">Group ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{group.id}</dd>
              </div>
              {group.coordinatorId && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Coordinator</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{group.coordinatorId}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
