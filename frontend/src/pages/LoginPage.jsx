import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginButton from '../components/Auth/LoginButton';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo/Title */}
        <div>
          <h1 className="text-6xl font-bold text-white mb-2">Noson</h1>
          <p className="text-xl text-gray-300">Control your Sonos system</p>
        </div>

        {/* Feature list */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 space-y-4">
          <div className="flex items-start text-left space-x-3">
            <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-white font-medium">View all your devices</h3>
              <p className="text-gray-300 text-sm">See all Sonos speakers in your household</p>
            </div>
          </div>

          <div className="flex items-start text-left space-x-3">
            <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-white font-medium">Control volume</h3>
              <p className="text-gray-300 text-sm">Adjust volume and mute from one place</p>
            </div>
          </div>

          <div className="flex items-start text-left space-x-3">
            <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-white font-medium">View music services</h3>
              <p className="text-gray-300 text-sm">See all connected music services</p>
            </div>
          </div>
        </div>

        {/* Login button */}
        <div className="pt-4">
          <LoginButton />
        </div>

        {/* Footer note */}
        <p className="text-gray-400 text-sm">
          You'll be redirected to Sonos to authorize this application
        </p>
      </div>
    </div>
  );
}
