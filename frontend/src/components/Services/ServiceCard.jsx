export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Service icon/logo placeholder */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.name}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          )}
        </div>

        {/* Service name */}
        <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">
          {service.name || 'Unknown Service'}
        </h3>

        {/* Service type */}
        {service.type && (
          <p className="text-center text-sm text-gray-500 mb-3">
            {service.type}
          </p>
        )}

        {/* Authorization status */}
        {service.authorized !== undefined && (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              service.authorized 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {service.authorized ? (
                <>
                  <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Connected
                </>
              ) : (
                'Not Connected'
              )}
            </span>
          </div>
        )}

        {/* Service ID (for debugging) */}
        {service.id && (
          <p className="mt-3 text-xs text-gray-400 text-center font-mono truncate">
            {service.id}
          </p>
        )}
      </div>
    </div>
  );
}
